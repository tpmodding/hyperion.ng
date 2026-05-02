#pragma once

#include <QObject>
#include <QString>
#include <QVariantMap>
#include <QDBusObjectPath>

///
/// @brief Negotiates a ScreenCast session with xdg-desktop-portal over D-Bus.
///
/// Follows the three-step portal flow:
///   CreateSession → SelectSources → Start
/// and emits streamReady(nodeId) when the portal has provided a PipeWire
/// node ID that can be connected to.
///
class ScreenCastPortal : public QObject
{
	Q_OBJECT
public:
	explicit ScreenCastPortal(QObject* parent = nullptr);

	/// Begin portal negotiation. Emits streamReady or failed asynchronously.
	void start();
	void stop();

signals:
	void streamReady(uint32_t nodeId);
	void failed(const QString& reason);

private slots:
	void onCreateSessionResponse(uint response, const QVariantMap& results);
	void onSelectSourcesResponse(uint response, const QVariantMap& results);
	void onStartResponse(uint response, const QVariantMap& results);

private:
	void connectResponse(const QString& requestHandle, QObject* receiver,
	                     const char* slot);
	QString makeToken() const;
	QString senderToken() const;

	QString _sessionHandle;
	int     _tokenCounter = 0;
};
