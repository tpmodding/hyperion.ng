// STL includes
#include <cassert>
#include <iostream>
#include <mutex>

// Header
#include <grabber/osx/OsxFrameGrabber.h>

// ScreenCaptureKit
#if defined(SDK_15_AVAILABLE)
#include <ScreenCaptureKit/ScreenCaptureKit.h>
#include <CoreMedia/CoreMedia.h>
#include <CoreVideo/CoreVideo.h>
#endif

//Qt
#include <QJsonObject>
#include <QJsonArray>
#include <QJsonDocument>

#if defined(SDK_15_AVAILABLE)

// Receives SCStream frames and stores the latest CVPixelBuffer for grabFrame() to consume.
// Using CVPixelBuffer directly avoids CIImage/CIContext overhead on every frame.
@interface HyperionStreamOutput : NSObject <SCStreamOutput>
{
	CVPixelBufferRef _latestBuffer;
	std::mutex       _bufferMutex;
}
// Returns a retained copy of the latest pixel buffer, or nil if none available yet.
- (CVPixelBufferRef)copyLatestBuffer;
@end

@implementation HyperionStreamOutput

- (id)init
{
	self = [super init];
	if (self)
		_latestBuffer = nil;
	return self;
}

- (void)dealloc
{
	std::lock_guard<std::mutex> lock(_bufferMutex);
	if (_latestBuffer)
	{
		CVPixelBufferRelease(_latestBuffer);
		_latestBuffer = nil;
	}
	[super dealloc];
}

- (void)stream:(SCStream *)stream didOutputSampleBuffer:(CMSampleBufferRef)sampleBuffer ofType:(SCStreamOutputType)type
{
	if (type != SCStreamOutputTypeScreen)
		return;

	CVPixelBufferRef newBuffer = CMSampleBufferGetImageBuffer(sampleBuffer);
	if (!newBuffer)
		return;

	CVPixelBufferRetain(newBuffer);
	{
		std::lock_guard<std::mutex> lock(_bufferMutex);
		if (_latestBuffer)
			CVPixelBufferRelease(_latestBuffer);
		_latestBuffer = newBuffer;
	}
}

- (CVPixelBufferRef)copyLatestBuffer
{
	std::lock_guard<std::mutex> lock(_bufferMutex);
	if (_latestBuffer)
	{
		CVPixelBufferRetain(_latestBuffer);
		return _latestBuffer;
	}
	return nil;
}

@end


// Single-shot screenshot via SCScreenshotManager.
// Used only during setup/discovery and as a fallback when the stream has no frame yet.
static CGImageRef capture15(CGDirectDisplayID id, CGRect rect)
{
	dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
	__block CGImageRef image1 = nil;
	[SCShareableContent getShareableContentWithCompletionHandler:^(SCShareableContent* content, NSError* error)
	{
		@autoreleasepool
		{
			if (error || !content)
			{
				dispatch_semaphore_signal(semaphore);
				return;
			}

			SCDisplay* target = nil;
			for (SCDisplay *display in content.displays)
			{
				if (display.displayID == id)
				{
					target = display;
					break;
				}
			}
			if (!target)
			{
				dispatch_semaphore_signal(semaphore);
				return;
			}

			SCContentFilter* filter = [[SCContentFilter alloc] initWithDisplay:target excludingWindows:@[]];
			SCStreamConfiguration* config = [[SCStreamConfiguration alloc] init];
			config.queueDepth = 3;
			config.sourceRect = rect;
			config.scalesToFit = false;
			config.captureResolution = SCCaptureResolutionBest;

			CGDisplayModeRef modeRef = CGDisplayCopyDisplayMode(id);
			if (modeRef)
			{
				double sysScale = CGDisplayModeGetPixelWidth(modeRef) / CGDisplayModeGetWidth(modeRef);
				config.width  = (size_t)(rect.size.width  * sysScale);
				config.height = (size_t)(rect.size.height * sysScale);
				CGDisplayModeRelease(modeRef);
			}

			[SCScreenshotManager captureImageWithFilter:filter
				configuration:config
				completionHandler:^(CGImageRef img, NSError* captureError)
				{
					if (!captureError && img)
					{
						CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
						image1 = CGImageCreateCopyWithColorSpace(img, colorSpace);
						CGColorSpaceRelease(colorSpace);
					}
					dispatch_semaphore_signal(semaphore);
				}];
			[filter release];
			[config release];
		}
	}];

	dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);
	dispatch_release(semaphore);
	return image1;
}

#endif // SDK_15_AVAILABLE


OsxFrameGrabber::OsxFrameGrabber(int display)
	: Grabber("GRABBER-OSX")
	, _screenIndex(display)
#if defined(SDK_15_AVAILABLE)
	, _stream(nil)
	, _streamOutput(nil)
#endif
{
	_isEnabled = false;
	_useImageResampler = true;
}

OsxFrameGrabber::~OsxFrameGrabber()
{
#if defined(SDK_15_AVAILABLE)
	stopStream();
#endif
}

#if defined(SDK_15_AVAILABLE)

bool OsxFrameGrabber::startStream(CGDirectDisplayID displayID)
{
	stopStream();

	__block bool success = false;
	__block HyperionStreamOutput* outputBlock = nil;
	__block SCStream* streamBlock = nil;

	dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);

	[SCShareableContent getShareableContentWithCompletionHandler:^(SCShareableContent* content, NSError* error)
	{
		@autoreleasepool
		{
			if (error || !content)
			{
				if (error)
					Error(_log, "SCShareableContent failed: %s", [[error localizedDescription] UTF8String]);
				dispatch_semaphore_signal(semaphore);
				return;
			}

			SCDisplay* target = nil;
			for (SCDisplay* display in content.displays)
			{
				if (display.displayID == displayID)
				{
					target = display;
					break;
				}
			}
			if (!target)
			{
				Error(_log, "Display %u not found in shareable content", displayID);
				dispatch_semaphore_signal(semaphore);
				return;
			}

			CGRect bounds = CGDisplayBounds(displayID);
			CGDisplayModeRef modeRef = CGDisplayCopyDisplayMode(displayID);
			double sysScale = 1.0;
			if (modeRef)
			{
				sysScale = CGDisplayModeGetPixelWidth(modeRef) / CGDisplayModeGetWidth(modeRef);
				CGDisplayModeRelease(modeRef);
			}

			SCContentFilter* filter = [[SCContentFilter alloc] initWithDisplay:target excludingWindows:@[]];
			SCStreamConfiguration* config = [[SCStreamConfiguration alloc] init];

			// BGR32 maps directly to Hyperion's PixelFormat::BGR32 — no conversion needed
			config.pixelFormat          = kCVPixelFormatType_32BGRA;
			config.sourceRect           = bounds;
			config.width                = (size_t)(bounds.size.width  * sysScale);
			config.height               = (size_t)(bounds.size.height * sysScale);
			config.minimumFrameInterval = CMTimeMake(1, _fps > 0 ? _fps : 10);
			config.queueDepth           = 3;
			config.showsCursor          = NO;
			config.scalesToFit          = NO;
			config.captureResolution    = SCCaptureResolutionBest;

			HyperionStreamOutput* output = [[HyperionStreamOutput alloc] init];
			SCStream* stream = [[SCStream alloc] initWithFilter:filter configuration:config delegate:nil];

			NSError* addErr = nil;
			BOOL added = [stream addStreamOutput:output
				                            type:SCStreamOutputTypeScreen
				               sampleHandlerQueue:dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_HIGH, 0)
				                           error:&addErr];
			[filter release];
			[config release];

			if (!added || addErr)
			{
				Error(_log, "Failed to add stream output: %s", addErr ? [[addErr localizedDescription] UTF8String] : "unknown");
				[output release];
				[stream release];
				dispatch_semaphore_signal(semaphore);
				return;
			}

			outputBlock = output;
			streamBlock  = stream;

			[stream startCaptureWithCompletionHandler:^(NSError* startErr)
			{
				if (startErr)
				{
					Error(_log, "Failed to start SCStream: %s", [[startErr localizedDescription] UTF8String]);
					success = false;
				}
				else
				{
					success = true;
				}
				dispatch_semaphore_signal(semaphore);
			}];
		}
	}];

	dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);
	dispatch_release(semaphore);

	if (success)
	{
		_stream       = streamBlock;
		_streamOutput = outputBlock;
		Info(_log, "SCStream started for display %u", displayID);
	}
	else
	{
		[outputBlock release];
		[streamBlock  release];
	}
	return success;
}

void OsxFrameGrabber::stopStream()
{
	SCStream*             stream = (SCStream*)_stream;
	HyperionStreamOutput* output = (HyperionStreamOutput*)_streamOutput;
	_stream       = nil;
	_streamOutput = nil;

	if (stream)
	{
		[stream stopCaptureWithCompletionHandler:^(NSError*) {}];
		[stream release];
	}
	if (output)
		[output release];
}

#endif // SDK_15_AVAILABLE


bool OsxFrameGrabber::setupDisplay()
{
#if defined(SDK_15_AVAILABLE)
	if (!CGPreflightScreenCaptureAccess())
	{
		if (!CGRequestScreenCaptureAccess())
		{
			Error(_log, "Screen capture permission required to start the grabber");
			return false;
		}
	}
#endif

	return setDisplayIndex(_screenIndex);
}

int OsxFrameGrabber::grabFrame(Image<ColorRgb> & image, bool /*forceUpdate*/)
{
	if (_isDeviceInError)
	{
		Error(_log, "Cannot grab frame, device is in error state");
		return -1;
	}

	if (!_isEnabled)
		return -1;

	if (image.isNull())
		return -1;

#if defined(SDK_15_AVAILABLE)
	HyperionStreamOutput* output = (HyperionStreamOutput*)_streamOutput;
	if (output)
	{
		CVPixelBufferRef buffer = [output copyLatestBuffer];
		if (buffer)
		{
			CVPixelBufferLockBaseAddress(buffer, kCVPixelBufferLock_ReadOnly);
			uint8_t* data       = (uint8_t*)CVPixelBufferGetBaseAddress(buffer);
			int      width      = (int)CVPixelBufferGetWidth(buffer);
			int      height     = (int)CVPixelBufferGetHeight(buffer);
			int      bytesPerRow = (int)CVPixelBufferGetBytesPerRow(buffer);
			_imageResampler.processImage(data, width, height, bytesPerRow, PixelFormat::BGR32, image);
			CVPixelBufferUnlockBaseAddress(buffer, kCVPixelBufferLock_ReadOnly);
			CVPixelBufferRelease(buffer);
			return 0;
		}
		// Stream running but no frame delivered yet — fall through to single screenshot
	}
#endif

	// Legacy path (pre-macOS 15 SDK) or stream not yet available
	CGImageRef dispImage = nullptr;

#if defined(SDK_15_AVAILABLE)
	dispImage = capture15(_display, CGDisplayBounds(_display));
#else
	dispImage = CGDisplayCreateImageForRect(_display, CGDisplayBounds(_display));
#endif

	// display lost, try main display
	if (dispImage == nullptr && _display != kCGDirectMainDisplay)
	{
#if defined(SDK_15_AVAILABLE)
		dispImage = capture15(kCGDirectMainDisplay, CGDisplayBounds(kCGDirectMainDisplay));
#else
		dispImage = CGDisplayCreateImageForRect(kCGDirectMainDisplay, CGDisplayBounds(kCGDirectMainDisplay));
#endif
	}

	if (dispImage == nullptr)
	{
		Error(_log, "No display connected...");
		return -1;
	}

	CFDataRef imgData = CGDataProviderCopyData(CGImageGetDataProvider(dispImage));
	if (imgData != nullptr)
	{
		_imageResampler.processImage(
			(uint8_t*)CFDataGetBytePtr(imgData),
			(int)CGImageGetWidth(dispImage),
			(int)CGImageGetHeight(dispImage),
			(int)CGImageGetBytesPerRow(dispImage),
			PixelFormat::BGR32,
			image);
		CFRelease(imgData);
	}
	CGImageRelease(dispImage);
	return 0;
}

bool OsxFrameGrabber::setDisplayIndex(int index)
{
	bool rc = true;
	if (_screenIndex != index || !_isEnabled)
	{
		_screenIndex = index;

		CGDisplayCount dspyCnt = 0;
		CGDisplayErr err = CGGetActiveDisplayList(0, nullptr, &dspyCnt);
		if (err != kCGErrorSuccess || dspyCnt == 0)
			return false;

		CGDirectDisplayID* activeDspys = new CGDirectDisplayID[dspyCnt];
		err = CGGetActiveDisplayList(dspyCnt, activeDspys, &dspyCnt);
		if (err == kCGErrorSuccess)
		{
			if (_screenIndex + 1 > static_cast<int>(dspyCnt))
			{
				Error(_log, "Display with index %d is not available.", _screenIndex);
				rc = false;
			}
			else
			{
				_display = activeDspys[_screenIndex];

#if defined(SDK_15_AVAILABLE)
				if (startStream(_display))
				{
					// Stream started — use display mode for size logging
					CGDisplayModeRef modeRef = CGDisplayCopyDisplayMode(_display);
					if (modeRef)
					{
						Info(_log, "Display [%u] opened with resolution: %zux%zubit via SCStream",
							_display,
							CGDisplayModeGetPixelWidth(modeRef),
							CGDisplayModeGetPixelHeight(modeRef));
						CGDisplayModeRelease(modeRef);
					}
					setEnabled(true);
					rc = true;
				}
				else
				{
					// Stream failed — fall back to single-shot screenshot to verify display
					Warning(_log, "SCStream failed for display %u, falling back to screenshot mode", _display);
					CGImageRef image = capture15(_display, CGDisplayBounds(_display));
					if (image)
					{
						Info(_log, "Display [%u] opened with resolution: %ux%u@%ubit (screenshot fallback)",
							_display,
							(unsigned)CGImageGetWidth(image),
							(unsigned)CGImageGetHeight(image),
							(unsigned)CGImageGetBitsPerPixel(image));
						CGImageRelease(image);
						setEnabled(true);
						rc = true;
					}
					else
					{
						setEnabled(false);
						Error(_log, "Failed to open display %u, disabling capture interface", _display);
						rc = false;
					}
				}
#else
				CGImageRef image = CGDisplayCreateImageForRect(_display, CGDisplayBounds(_display));
				if (image == nullptr)
				{
					setEnabled(false);
					Error(_log, "Failed to open main display, disable capture interface");
					rc = false;
				}
				else
				{
					setEnabled(true);
					Info(_log, "Display [%u] opened with resolution: %ux%u@%ubit",
						_display,
						(unsigned)CGImageGetWidth(image),
						(unsigned)CGImageGetHeight(image),
						(unsigned)CGImageGetBitsPerPixel(image));
					CGImageRelease(image);
					rc = true;
				}
#endif
			}
		}
		else
		{
			rc = false;
		}
		delete[] activeDspys;
	}
	return rc;
}

QJsonObject OsxFrameGrabber::discover(const QJsonObject& params)
{
	QJsonObject inputsDiscovered;

	CGDisplayCount dspyCnt = 0;
	CGDisplayErr err = CGGetActiveDisplayList(0, nullptr, &dspyCnt);
	if (err != kCGErrorSuccess || dspyCnt == 0)
	{
		qCDebug(grabber_screen_properties) << "No displays found to capture from!";
		return inputsDiscovered;
	}

	CGDirectDisplayID* activeDspys = new CGDirectDisplayID[dspyCnt];
	err = CGGetActiveDisplayList(dspyCnt, activeDspys, &dspyCnt);
	if (err == kCGErrorSuccess)
	{
		inputsDiscovered["device"]      = "osx";
		inputsDiscovered["device_name"] = "OSX";
		inputsDiscovered["type"]        = "screen";

		QJsonArray video_inputs;
		for (int i = 0; i < static_cast<int>(dspyCnt); ++i)
		{
			CGDirectDisplayID did = activeDspys[i];

			QJsonObject in;
			in["name"]     = QString("Display:%1").arg(did);
			in["inputIdx"] = i;

			CGDisplayModeRef dispMode = CGDisplayCopyDisplayMode(did);
			CGRect rect = CGDisplayBounds(did);

			QJsonObject resolution;
			resolution["width"]  = static_cast<int>(rect.size.width);
			resolution["height"] = static_cast<int>(rect.size.height);
			resolution["fps"]    = getFpsSupported();
			if (dispMode) CGDisplayModeRelease(dispMode);

			QJsonArray resolutionArray;
			resolutionArray.append(resolution);

			QJsonObject format;
			format["resolutions"] = resolutionArray;

			QJsonArray formats;
			formats.append(format);
			in["formats"] = formats;

			video_inputs.append(in);
		}
		inputsDiscovered["video_inputs"] = video_inputs;

		QJsonObject defaults, video_inputs_default, resolution_default;
		resolution_default["fps"]          = _fps;
		video_inputs_default["resolution"] = resolution_default;
		video_inputs_default["inputIdx"]   = 0;
		defaults["video_input"]            = video_inputs_default;
		inputsDiscovered["default"]        = defaults;
	}
	delete[] activeDspys;

	return inputsDiscovered;
}
