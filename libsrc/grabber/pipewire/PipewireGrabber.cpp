#include <grabber/pipewire/PipewireGrabber.h>

#include <utils/Logger.h>

#include <QMutexLocker>

#include <pipewire/pipewire.h>
#include <pipewire/stream.h>
#include <spa/param/video/format-utils.h>
#include <spa/debug/types.h>
#include <spa/param/video/type-info.h>

namespace {

struct StreamData {
	PipewireGrabber* grabber;
	struct spa_video_info format;
};

const struct pw_stream_events STREAM_EVENTS = {
	.version       = PW_VERSION_STREAM_EVENTS,
	.state_changed = PipewireGrabber::pwStreamStateChanged,
	.param_changed = PipewireGrabber::pwStreamParamChanged,
	.process       = PipewireGrabber::pwStreamProcess,
};

} // namespace

PipewireGrabber::PipewireGrabber()
	: Grabber("PipeWire")
{
	pw_init(nullptr, nullptr);
	_pwAvailable = true;
	_isAvailable = true;
}

PipewireGrabber::~PipewireGrabber()
{
	teardownPipewire();
}

bool PipewireGrabber::isAvailable(bool /*logError*/)
{
	return _pwAvailable;
}

bool PipewireGrabber::setupScreen()
{
	// Actual stream setup happens in startPipewireStream() after portal negotiation
	return true;
}

int PipewireGrabber::grabFrame(Image<ColorRgb>& image, bool /*forceUpdate*/)
{
	QMutexLocker lock(&_frameMutex);
	if (!_newFrame || _latestFrame.isNull())
		return -1;

	image      = _latestFrame;
	_newFrame  = false;
	_width     = image.width();
	_height    = image.height();
	return 0;
}

void PipewireGrabber::startPipewireStream(uint32_t nodeId)
{
	if (!initPipewire())
		return;

	// Build the format parameter: accept any RGB / BGRx frame
	uint8_t  buffer[1024];
	struct spa_pod_builder builder = SPA_POD_BUILDER_INIT(buffer, sizeof(buffer));

	const struct spa_pod* params[2];
	struct spa_video_info_raw rawInfo = {};
	rawInfo.format    = SPA_VIDEO_FORMAT_RGB;
	rawInfo.size      = SPA_RECTANGLE(0, 0);
	rawInfo.framerate = SPA_FRACTION(0, 1);
	params[0] = spa_format_video_raw_build(&builder, SPA_PARAM_EnumFormat, &rawInfo);

	struct spa_video_info_raw rawInfoBgr = {};
	rawInfoBgr.format    = SPA_VIDEO_FORMAT_BGRx;
	rawInfoBgr.size      = SPA_RECTANGLE(0, 0);
	rawInfoBgr.framerate = SPA_FRACTION(0, 1);
	params[1] = spa_format_video_raw_build(&builder, SPA_PARAM_EnumFormat, &rawInfoBgr);

	pw_thread_loop_lock(_pwLoop);

	int rc = pw_stream_connect(
		_pwStream,
		PW_DIRECTION_INPUT,
		nodeId,
		static_cast<enum pw_stream_flags>(PW_STREAM_FLAG_AUTOCONNECT | PW_STREAM_FLAG_MAP_BUFFERS),
		params, 2);

	pw_thread_loop_unlock(_pwLoop);

	if (rc < 0)
		Error(_log, "PipeWire stream connect failed: %s", strerror(-rc));
}

bool PipewireGrabber::initPipewire()
{
	_pwLoop = pw_thread_loop_new("hyperion-pw", nullptr);
	if (!_pwLoop)
	{
		Error(_log, "Failed to create PipeWire thread loop");
		return false;
	}

	_pwContext = pw_context_new(pw_thread_loop_get_loop(_pwLoop), nullptr, 0);
	if (!_pwContext)
	{
		Error(_log, "Failed to create PipeWire context");
		teardownPipewire();
		return false;
	}

	pw_thread_loop_start(_pwLoop);
	pw_thread_loop_lock(_pwLoop);

	_pwCore = pw_context_connect(_pwContext, nullptr, 0);
	if (!_pwCore)
	{
		pw_thread_loop_unlock(_pwLoop);
		Error(_log, "Failed to connect to PipeWire core");
		teardownPipewire();
		return false;
	}

	struct pw_properties* props = pw_properties_new(
		PW_KEY_MEDIA_TYPE,     "Video",
		PW_KEY_MEDIA_CATEGORY, "Capture",
		PW_KEY_MEDIA_ROLE,     "Screen",
		nullptr);

	_pwStream = pw_stream_new(_pwCore, "hyperion-screen-capture", props);
	if (!_pwStream)
	{
		pw_thread_loop_unlock(_pwLoop);
		Error(_log, "Failed to create PipeWire stream");
		teardownPipewire();
		return false;
	}

	pw_stream_add_listener(_pwStream, new pw_stream_listener{}, &STREAM_EVENTS, this);

	pw_thread_loop_unlock(_pwLoop);
	_streamReady = true;
	return true;
}

void PipewireGrabber::teardownPipewire()
{
	if (_pwLoop)
		pw_thread_loop_stop(_pwLoop);

	if (_pwStream)
	{
		pw_stream_destroy(_pwStream);
		_pwStream = nullptr;
	}
	if (_pwCore)
	{
		pw_core_disconnect(_pwCore);
		_pwCore = nullptr;
	}
	if (_pwContext)
	{
		pw_context_destroy(_pwContext);
		_pwContext = nullptr;
	}
	if (_pwLoop)
	{
		pw_thread_loop_destroy(_pwLoop);
		_pwLoop = nullptr;
	}
	_streamReady = false;
}

void PipewireGrabber::onPwFrame(const uint8_t* data, int width, int height,
                                int stride, bool bgr)
{
	QMutexLocker lock(&_frameMutex);
	if (_latestFrame.width() != width || _latestFrame.height() != height)
		_latestFrame.resize(width, height);

	ColorRgb* dst = _latestFrame.memptr();

	if (!bgr)
	{
		const int rowBytes = width * static_cast<int>(sizeof(ColorRgb));
		for (int y = 0; y < height; ++y)
			memcpy(dst + y * width, data + y * stride, static_cast<size_t>(rowBytes));
	}
	else
	{
		// BGRx → RGB
		for (int y = 0; y < height; ++y)
		{
			const uint8_t* src = data + y * stride;
			ColorRgb*      row = dst  + y * width;
			for (int x = 0; x < width; ++x)
			{
				row[x].blue  = src[x * 4 + 0];
				row[x].green = src[x * 4 + 1];
				row[x].red   = src[x * 4 + 2];
			}
		}
	}
	_newFrame = true;
}

void PipewireGrabber::onPwConnected()
{
	Debug(_log, "PipeWire stream connected");
}

void PipewireGrabber::onPwDisconnected()
{
	Debug(_log, "PipeWire stream disconnected");
	_streamReady = false;
}

// ─── Static PipeWire callbacks ────────────────────────────────────────────────

void PipewireGrabber::pwStreamStateChanged(void* data,
                                           enum pw_stream_state /*old*/,
                                           enum pw_stream_state  state,
                                           const char*           error)
{
	auto* self = static_cast<PipewireGrabber*>(data);
	if (state == PW_STREAM_STATE_STREAMING)
		self->onPwConnected();
	else if (state == PW_STREAM_STATE_ERROR)
		Error(self->_log, "PipeWire stream error: %s", error ? error : "unknown");
	else if (state == PW_STREAM_STATE_UNCONNECTED || state == PW_STREAM_STATE_PAUSED)
		self->onPwDisconnected();
}

void PipewireGrabber::pwStreamParamChanged(void* data, uint32_t id,
                                           const struct spa_pod* param)
{
	if (id != SPA_PARAM_Format || !param)
		return;

	auto* self = static_cast<PipewireGrabber*>(data);

	struct spa_video_info info{};
	if (spa_format_parse(param, &info.media_type, &info.media_subtype) < 0)
		return;

	if (info.media_type    != SPA_MEDIA_TYPE_video ||
	    info.media_subtype != SPA_MEDIA_SUBTYPE_raw)
		return;

	spa_format_video_raw_parse(param, &info.info.raw);

	// Acknowledge format and request a buffer
	uint8_t buffer[256];
	struct spa_pod_builder b = SPA_POD_BUILDER_INIT(buffer, sizeof(buffer));
	const struct spa_pod* params[1];
	params[0] = spa_pod_builder_add_object(
		&b,
		SPA_TYPE_OBJECT_ParamBuffers, SPA_PARAM_Buffers,
		SPA_PARAM_BUFFERS_buffers, SPA_POD_CHOICE_RANGE_Int(2, 1, 32),
		SPA_PARAM_BUFFERS_blocks,  SPA_POD_Int(1),
		SPA_PARAM_BUFFERS_align,   SPA_POD_Int(16));

	pw_stream_update_params(self->_pwStream, params, 1);
}

void PipewireGrabber::pwStreamProcess(void* data)
{
	auto* self = static_cast<PipewireGrabber*>(data);

	struct pw_buffer* buf = pw_stream_dequeue_buffer(self->_pwStream);
	if (!buf)
		return;

	struct spa_buffer* spaBuf = buf->buffer;
	if (!spaBuf || !spaBuf->datas[0].data)
	{
		pw_stream_queue_buffer(self->_pwStream, buf);
		return;
	}

	// Determine format from stream node params
	const struct spa_pod* formatPod = pw_stream_get_param(
		self->_pwStream, 0, SPA_PARAM_Format);

	int  width  = 0;
	int  height = 0;
	int  stride = static_cast<int>(spaBuf->datas[0].chunk->stride);
	bool bgr    = false;

	if (formatPod)
	{
		struct spa_video_info info{};
		spa_format_parse(formatPod, &info.media_type, &info.media_subtype);
		if (info.media_subtype == SPA_MEDIA_SUBTYPE_raw)
		{
			spa_format_video_raw_parse(formatPod, &info.info.raw);
			width  = static_cast<int>(info.info.raw.size.width);
			height = static_cast<int>(info.info.raw.size.height);
			bgr    = (info.info.raw.format == SPA_VIDEO_FORMAT_BGRx ||
			          info.info.raw.format == SPA_VIDEO_FORMAT_BGR);
		}
	}

	if (width > 0 && height > 0)
	{
		self->onPwFrame(static_cast<const uint8_t*>(spaBuf->datas[0].data),
		                width, height, stride, bgr);
	}

	pw_stream_queue_buffer(self->_pwStream, buf);
}
