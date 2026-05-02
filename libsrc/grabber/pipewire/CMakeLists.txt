find_package(PkgConfig REQUIRED)
pkg_check_modules(PIPEWIRE REQUIRED libpipewire-0.3)

find_package(Qt${QT_VERSION_MAJOR} COMPONENTS DBus REQUIRED)

add_library(pipewire-grabber
	${CMAKE_SOURCE_DIR}/include/grabber/pipewire/PipewireGrabber.h
	${CMAKE_SOURCE_DIR}/include/grabber/pipewire/PipewireWrapper.h
	${CMAKE_SOURCE_DIR}/include/grabber/pipewire/ScreenCastPortal.h
	${CMAKE_SOURCE_DIR}/libsrc/grabber/pipewire/PipewireGrabber.cpp
	${CMAKE_SOURCE_DIR}/libsrc/grabber/pipewire/PipewireWrapper.cpp
	${CMAKE_SOURCE_DIR}/libsrc/grabber/pipewire/ScreenCastPortal.cpp
)

target_include_directories(pipewire-grabber
	PUBLIC
	${PIPEWIRE_INCLUDE_DIRS}
)

target_compile_options(pipewire-grabber
	PRIVATE
	${PIPEWIRE_CFLAGS_OTHER}
)

target_link_libraries(pipewire-grabber
	hyperion
	Qt${QT_VERSION_MAJOR}::DBus
	${PIPEWIRE_LIBRARIES}
)
