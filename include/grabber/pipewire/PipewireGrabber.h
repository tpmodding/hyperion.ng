#pragma once

#include <hyperion/Grabber.h>

#include <QMutex>
#include <QObject>

// Forward declarations for PipeWire opaque types
struct pw_thread_loop;
struct pw_context;
struct pw_core;
struct pw_stream;
struct spa_pod;

///
/// @brief Screen grabber using the PipeWire/xdg-desktop-portal stack.
///
/// Supports Wayland compositors that expose screen cast via the
/// org.freedesktop.portal.ScreenCast D-Bus interface (GNOME, KDE, …).
/// A one-time interactive source-picker dialog is shown the first time
/// Hyperion starts (or after the token is revoked).
///
class PipewireGrabber : public Grabber
{
	Q_OBJECT
public:
	explicit PipewireGrabber();
	~PipewireGrabber() override;

	bool isAvailable(bool logError = false) override;
	bool setupScreen() override;
	int  grabFrame(Image<ColorRgb>& image, bool forceUpdate = false) override;

	// Called from the PipeWire thread when a new frame arrives
	void onPwFrame(const uint8_t* data, int width, int height, int stride, bool bgr);
	void onPwConnected();
	void onPwDisconnected();

public slots:
	// Receives the PipeWire node ID from the portal negotiation
	void startPipewireStream(uint32_t nodeId);

private:
	bool initPipewire();
	void teardownPipewire();

	static void pwStreamStateChanged(void* data, enum pw_stream_state old,
	                                 enum pw_stream_state state, const char* error);
	static void pwStreamParamChanged(void* data, uint32_t id, const struct spa_pod* param);
	static void pwStreamProcess(void* data);

	pw_thread_loop* _pwLoop    = nullptr;
	pw_context*     _pwContext = nullptr;
	pw_core*        _pwCore    = nullptr;
	pw_stream*      _pwStream  = nullptr;

	QMutex          _frameMutex;
	Image<ColorRgb> _latestFrame;
	bool            _newFrame = false;

	bool _pwAvailable = false;
	bool _streamReady = false;
};
