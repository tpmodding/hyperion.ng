#include <grabber/pipewire/PipewireWrapper.h>

PipewireWrapper::PipewireWrapper(int updateRate_Hz,
                                 int cropLeft, int cropRight,
                                 int cropTop,  int cropBottom)
	: GrabberWrapper(GRABBERTYPE, &_grabber, updateRate_Hz)
{
	_grabber.setCropping(cropLeft, cropRight, cropTop, cropBottom);

	connect(&_portal, &ScreenCastPortal::streamReady,
	        &_grabber, &PipewireGrabber::startPipewireStream);
	connect(&_portal, &ScreenCastPortal::failed,
	        this, [this](const QString& reason) {
		Error(_log, "ScreenCast portal failed: %s", QSTRING_CSTR(reason));
		_grabber.setEnabled(false);
		stop();
	});
}

PipewireWrapper::PipewireWrapper(const QJsonDocument& grabberConfig)
	: PipewireWrapper(GrabberWrapper::DEFAULT_RATE_HZ)
{
	if (_grabber.isAvailable())
	{
		GrabberWrapper::handleSettingsUpdate(settings::SYSTEMCAPTURE, grabberConfig);
		_portal.start();
	}
}

void PipewireWrapper::action()
{
	transferFrame(_grabber);
}
