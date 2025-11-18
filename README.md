# AI/ML Model Serving App

A platform-agnostic mobile application for serving AI/ML models with camera functionality. Currently focused on Android platform with support from Android 9 (API 28) onwards.

## Features

- **Camera Preview with Circular Frame**: Real-time camera preview displayed in a circular overlay
- **Image Capture**: Capture button to take photos with fixed camera properties for image specialization
- **Gallery View**: Rectangle box displaying captured images
- **Inference Display**: Bottom section for showing model inference results (model integration pending)
- **Platform Support**: Android 9+ (API 28 and above)

## Tech Stack

- **React Native 0.82**: Cross-platform mobile framework
- **TypeScript**: Type-safe development
- **React Native Vision Camera**: Modern camera library with advanced features
- **React Native Safe Area Context**: Handle safe areas across devices

## Prerequisites

### For Windows Development

1. **Node.js** (v20 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   
2. **Java Development Kit (JDK) 17**
   - Download from [Oracle](https://www.oracle.com/java/technologies/downloads/) or use OpenJDK
   - Set `JAVA_HOME` environment variable
   
3. **Android Studio**
   - Download from [developer.android.com](https://developer.android.com/studio)
   - Install Android SDK (API 28 or higher)
   - Install Android SDK Build-Tools
   - Set `ANDROID_HOME` environment variable to your Android SDK location
   - Add platform-tools to PATH: `%ANDROID_HOME%\platform-tools`
   
4. **Android Device or Emulator**
   - Physical device with USB debugging enabled, or
   - Android Virtual Device (AVD) from Android Studio

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/lokesh-kurre/app-for-serving-aiml-model.git
cd app-for-serving-aiml-model
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Android Environment (Windows)

Add these environment variables to your system:

```
ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
JAVA_HOME=C:\Program Files\Java\jdk-17
```

Add to PATH:
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

### 4. Start Metro Bundler

```bash
npm start
```

### 5. Run on Android

**Important**: After installing dependencies, you must rebuild the native modules:

```bash
# Clean and rebuild (required for native modules)
cd android
.\gradlew.bat clean
cd ..

# Run the app (this rebuilds native code)
npm run android
```

Alternative manual build:

```bash
cd android
.\gradlew.bat clean
.\gradlew.bat assembleDebug
cd ..
npm run android
```

**Troubleshooting**: If you get native module errors (like `rnfsfiletyperegular`), see `TROUBLESHOOTING.md`.

## Camera Properties

The app uses fixed camera properties optimized for image specialization:

- **Quality Prioritization**: Maximum quality
- **Auto Stabilization**: Enabled
- **Exposure**: Fixed at neutral (0)
- **Zoom**: Fixed at device's neutral zoom
- **Zoom Gestures**: Disabled for consistency

## Project Structure

```
app-for-serving-aiml-model/
├── android/              # Android native project
├── ios/                  # iOS native project (future)
├── App.tsx              # Main application component
├── index.js             # Entry point
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Camera Features

### Camera Preview
- Circular frame overlay (250x250px)
- Real-time preview from back camera
- Fixed camera properties for consistent image quality

### Capture Functionality
- Large, accessible capture button
- Captures high-quality photos
- Auto-stabilization enabled
- Shutter sound for user feedback

### Gallery View
- Rectangle display box for captured images
- Shows most recent capture
- Full image preview

### Inference Display
- Bottom section reserved for model inference results
- Scrollable text area
- Ready for ML model integration

## Permissions

The app requires the following Android permissions:

- `CAMERA`: Access to device camera
- `INTERNET`: For future model API calls (if needed)

Permissions are requested at runtime on Android 6.0+.

## Development

### Linting

```bash
npm run lint
```

### Testing

```bash
npm test
```

### Building APK

For debug build:
```bash
cd android
.\gradlew.bat assembleDebug
```

For release build:
```bash
cd android
.\gradlew.bat assembleRelease
```

## Troubleshooting (Windows)

### Common Issues

1. **"Android SDK not found"**
   - Ensure ANDROID_HOME is set correctly
   - Restart terminal/IDE after setting environment variables

2. **"Failed to install the app"**
   - Enable USB debugging on your device
   - Check device is connected: `adb devices`
   - Try: `adb kill-server` then `adb start-server`

3. **"SDK location not found"**
   - Create `android/local.properties` file with:
     ```
     sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
     ```

4. **Metro bundler not starting**
   - Clear cache: `npm start -- --reset-cache`

5. **Build fails**
   - Clean project: `cd android && .\gradlew.bat clean`
   - Delete `android/app/build` folder

## Future Enhancements

- [ ] ML model integration for image inference
- [ ] Multiple image capture and gallery
- [ ] Image preprocessing pipeline
- [ ] Model selection interface
- [ ] iOS platform support
- [ ] Batch inference capability
- [ ] Export results functionality

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Create an issue on GitHub
- Check existing issues for solutions

## Platform Agnostic Design

This codebase is designed to be platform-agnostic:
- React Native allows building for both Android and iOS
- Shared business logic and UI components
- Platform-specific code isolated when necessary
- Easy to extend to other platforms in the future
