cmake_minimum_required(VERSION 3.13)
project(aiml_wrapper)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# ---------- React Native paths ----------
# CMAKE_SOURCE_DIR = android/app/src/main/cpp
set(RN_ROOT ${CMAKE_SOURCE_DIR}/../../../../../node_modules/react-native)
set(RN_REACT_COMMON ${RN_ROOT}/ReactCommon)
set(RN_REACT_ANDROID ${RN_ROOT}/ReactAndroid)

# Directory where RN builds its .so files
# Example:
# node_modules/react-native/ReactAndroid/build/intermediates/library_jni/debug/arm64-v8a/libreactnativejni.so
set(RN_JNI_LIBS ${RN_REACT_ANDROID}/build/intermediates/library_jni/debug/${ANDROID_ABI})

# ---------- Build your wrapper ----------
add_library(aiml_wrapper SHARED
        AimlModule.cpp
        AimlInstaller.cpp
)

# ---------- Import prebuilt libs ----------
add_library(aiml_shared SHARED IMPORTED)
set_target_properties(aiml_shared PROPERTIES
        IMPORTED_LOCATION
        ${CMAKE_SOURCE_DIR}/../jniLibs/${ANDROID_ABI}/libaiml_shared.so
)

add_library(tensorflowlite SHARED IMPORTED)
set_target_properties(tensorflowlite PROPERTIES
        IMPORTED_LOCATION
        ${CMAKE_SOURCE_DIR}/../jniLibs/${ANDROID_ABI}/libtensorflowlite.so
)

# ---------- Import React Native required libs ----------
add_library(reactnativejni SHARED IMPORTED)
set_target_properties(reactnativejni PROPERTIES
        IMPORTED_LOCATION
        ${RN_JNI_LIBS}/libreactnativejni.so
)

add_library(hermes SHARED IMPORTED)
set_target_properties(hermes PROPERTIES
        IMPORTED_LOCATION
        ${RN_JNI_LIBS}/libhermes.so
)

# ---------- Includes (JSI + RN headers) ----------
target_include_directories(aiml_wrapper PUBLIC
        ${CMAKE_SOURCE_DIR}
        ${CMAKE_SOURCE_DIR}/aiml

        ${RN_REACT_COMMON}
        ${RN_REACT_COMMON}/jsi

        ${RN_REACT_ANDROID}/src/main/jni
        ${RN_REACT_ANDROID}/src/main/jni/react
)

# ---------- Link everything ----------
target_link_libraries(
        aiml_wrapper
        aiml_shared
        tensorflowlite
        reactnativejni     # <-- contains the actual JSI
        hermes             # <-- Hermes VM JSI backend
        log
        android
)
