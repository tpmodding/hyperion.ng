#pragma once

#include <hyperion/GrabberWrapper.h>
#include <grabber/pipewire/PipewireGrabber.h>
#include <grabber/pipewire/ScreenCastPortal.h>

///
/// @brief GrabberWrapper for the PipeWire/Wayland screen capture grabber.
///
class PipewireWrapper : public GrabberWrapper
{
	Q_OBJECT
public:
	static constexpr const char* GRABBERTYPE = "PipeWire";

	explicit PipewireWrapper(int updateRate_Hz = GrabberWrapper::DEFAULT_RATE_HZ,
	                         int cropLeft = 0, int cropRight = 0,
	                         int cropTop  = 0, int cropBottom = 0);
	explicit PipewireWrapper(const QJsonDocument& grabberConfig = QJsonDocument());

public slots:
	void action() override;

private:
	PipewireGrabber  _grabber;
	ScreenCastPortal _portal;
};
