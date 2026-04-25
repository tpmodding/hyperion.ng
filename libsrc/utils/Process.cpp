#ifdef _WIN32

	#include <QCoreApplication>
	#include <QProcess>
	#include <utils/Logger.h>
	#include <QString>
	#include <QByteArray>

	namespace Process
	{
		void restartHyperion(int exitCode)
		{
			QSharedPointer<Logger> log = Logger::getInstance("Process");
			Info(log, "Restarting hyperion ...");

			auto arguments = QCoreApplication::arguments();
			if (!arguments.contains("--wait-hyperion"))
				arguments << "--wait-hyperion";

			QProcess::startDetached(QCoreApplication::applicationFilePath(), arguments);

			//Exit with non-zero code to ensure service deamon restarts hyperion
			QCoreApplication::exit(exitCode);
		}

		QByteArray command_exec(const QString& /*cmd*/, const QByteArray& /*data*/)
		{
			return QSTRING_CSTR(QString());
		}
	};

#else

	#include <utils/Process.h>
	#include <utils/Logger.h>

	#include <QCoreApplication>
	#include <QProcess>
	#include <QStringList>
	#include <iostream>

	namespace Process
	{
		void restartHyperion(int exitCode)
		{
			QSharedPointer<Logger> log = Logger::getInstance("Process");
			Info(log, "Restarting hyperion ...");

			std::cout << std::endl
				<< "      *******************************************" << std::endl
				<< "      *      hyperion will restart now          *" << std::endl
				<< "      *******************************************" << std::endl << std::endl;

			auto arguments = QCoreApplication::arguments();
			if (!arguments.contains("--wait-hyperion"))
				arguments << "--wait-hyperion";

			QProcess::startDetached(QCoreApplication::applicationFilePath(), arguments);

			//Exit with non-zero code to ensure service deamon restarts hyperion
			QCoreApplication::exit(exitCode);
		}

		QByteArray command_exec(const QString& cmd, const QByteArray& /*data*/)
		{
			const int sep = cmd.indexOf(' ');
			const QString program = (sep < 0) ? cmd : cmd.left(sep);
			const QStringList args = (sep < 0) ? QStringList() : QStringList{ cmd.mid(sep + 1) };

			QProcess process;
			process.start(program, args);
			process.waitForFinished(-1);
			return process.readAllStandardOutput();
		}
	};

#endif
