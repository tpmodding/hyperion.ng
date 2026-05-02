#include <grabber/pipewire/ScreenCastPortal.h>

#include <utils/Logger.h>

#include <QDBusConnection>
#include <QDBusInterface>
#include <QDBusMessage>
#include <QDBusPendingCall>
#include <QDBusReply>
#include <QDBusVariant>
#include <QDBusObjectPath>
#include <QCoreApplication>

namespace {
constexpr const char* PORTAL_SERVICE   = "org.freedesktop.portal.Desktop";
constexpr const char* PORTAL_PATH      = "/org/freedesktop/portal/desktop";
constexpr const char* PORTAL_INTERFACE = "org.freedesktop.portal.ScreenCast";
constexpr const char* REQUEST_INTERFACE = "org.freedesktop.portal.Request";
}

ScreenCastPortal::ScreenCastPortal(QObject* parent)
	: QObject(parent)
{
}

void ScreenCastPortal::stop()
{
	QDBusConnection::sessionBus().disconnect(
		PORTAL_SERVICE, {}, REQUEST_INTERFACE, "Response",
		this, SLOT(onCreateSessionResponse(uint, QVariantMap)));
	QDBusConnection::sessionBus().disconnect(
		PORTAL_SERVICE, {}, REQUEST_INTERFACE, "Response",
		this, SLOT(onSelectSourcesResponse(uint, QVariantMap)));
	QDBusConnection::sessionBus().disconnect(
		PORTAL_SERVICE, {}, REQUEST_INTERFACE, "Response",
		this, SLOT(onStartResponse(uint, QVariantMap)));
}

QString ScreenCastPortal::senderToken() const
{
	QString sender = QDBusConnection::sessionBus().baseService();
	// D-Bus sender names start with ':', replace non-alphanumeric chars
	sender.remove(':').replace('.', '_');
	return sender;
}

QString ScreenCastPortal::makeToken()
{
	return QStringLiteral("hyperion_%1").arg(++_tokenCounter);
}

void ScreenCastPortal::connectResponse(const QString& requestHandle,
                                       QObject* receiver, const char* slot)
{
	QDBusConnection::sessionBus().connect(
		PORTAL_SERVICE, requestHandle,
		REQUEST_INTERFACE, QStringLiteral("Response"),
		receiver, slot);
}

void ScreenCastPortal::start()
{
	if (!QDBusConnection::sessionBus().isConnected())
	{
		emit failed(QStringLiteral("D-Bus session bus not available"));
		return;
	}

	QDBusInterface portal(PORTAL_SERVICE, PORTAL_PATH, PORTAL_INTERFACE,
	                      QDBusConnection::sessionBus());
	if (!portal.isValid())
	{
		emit failed(QStringLiteral("xdg-desktop-portal ScreenCast interface not available"));
		return;
	}

	const QString token = makeToken();
	const QString requestHandle = QStringLiteral("/org/freedesktop/portal/desktop/request/%1/%2")
	                              .arg(senderToken(), token);

	connectResponse(requestHandle, this,
	                SLOT(onCreateSessionResponse(uint, QVariantMap)));

	QVariantMap options;
	options[QStringLiteral("handle_token")]         = token;
	options[QStringLiteral("session_handle_token")] = makeToken();

	QDBusPendingCall call = portal.asyncCall(QStringLiteral("CreateSession"), options);
	Q_UNUSED(call)
}

void ScreenCastPortal::onCreateSessionResponse(uint response, const QVariantMap& results)
{
	if (response != 0)
	{
		emit failed(QStringLiteral("CreateSession failed (response=%1)").arg(response));
		return;
	}

	_sessionHandle = results.value(QStringLiteral("session_handle")).toString();
	if (_sessionHandle.isEmpty())
	{
		emit failed(QStringLiteral("CreateSession: empty session handle"));
		return;
	}

	QDBusInterface portal(PORTAL_SERVICE, PORTAL_PATH, PORTAL_INTERFACE,
	                      QDBusConnection::sessionBus());

	const QString token = makeToken();
	const QString requestHandle = QStringLiteral("/org/freedesktop/portal/desktop/request/%1/%2")
	                              .arg(senderToken(), token);

	connectResponse(requestHandle, this,
	                SLOT(onSelectSourcesResponse(uint, QVariantMap)));

	QVariantMap options;
	options[QStringLiteral("handle_token")] = token;
	// Source type: 1 = MONITOR, 2 = WINDOW, 4 = VIRTUAL — request monitor
	options[QStringLiteral("types")]        = QVariant::fromValue<uint32_t>(1u);
	// Do not embed cursor
	options[QStringLiteral("cursor_mode")]  = QVariant::fromValue<uint32_t>(1u);
	// Allow multiple monitors
	options[QStringLiteral("multiple")]     = false;

	portal.asyncCall(QStringLiteral("SelectSources"),
	                 QDBusObjectPath(_sessionHandle), options);
}

void ScreenCastPortal::onSelectSourcesResponse(uint response, const QVariantMap& /*results*/)
{
	if (response != 0)
	{
		emit failed(QStringLiteral("SelectSources failed (response=%1)").arg(response));
		return;
	}

	QDBusInterface portal(PORTAL_SERVICE, PORTAL_PATH, PORTAL_INTERFACE,
	                      QDBusConnection::sessionBus());

	const QString token = makeToken();
	const QString requestHandle = QStringLiteral("/org/freedesktop/portal/desktop/request/%1/%2")
	                              .arg(senderToken(), token);

	connectResponse(requestHandle, this,
	                SLOT(onStartResponse(uint, QVariantMap)));

	QVariantMap options;
	options[QStringLiteral("handle_token")] = token;

	portal.asyncCall(QStringLiteral("Start"),
	                 QDBusObjectPath(_sessionHandle), QStringLiteral(""), options);
}

void ScreenCastPortal::onStartResponse(uint response, const QVariantMap& results)
{
	if (response != 0)
	{
		emit failed(QStringLiteral("Start failed (response=%1)").arg(response));
		return;
	}

	// results["streams"] is a(oa{sv}) — array of (object_path, dict)
	// Each stream dict contains "node_id" (uint32)
	const QDBusArgument streamsArg = results.value(QStringLiteral("streams"))
	                                        .value<QDBusArgument>();

	uint32_t nodeId = 0;
	streamsArg.beginArray();
	while (!streamsArg.atEnd())
	{
		streamsArg.beginStructure();
		QDBusObjectPath path;
		QVariantMap     props;
		streamsArg >> path >> props;
		streamsArg.endStructure();

		nodeId = props.value(QStringLiteral("node_id")).toUInt();
		break; // take the first stream
	}
	streamsArg.endArray();

	if (nodeId == 0)
	{
		emit failed(QStringLiteral("No PipeWire node ID in portal response"));
		return;
	}

	emit streamReady(nodeId);
}
