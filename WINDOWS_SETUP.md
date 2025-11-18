# Windows Development Setup Guide

This guide provides detailed instructions for setting up the AI/ML Model Serving App development environment on Windows.

## Prerequisites Installation

### 1. Node.js (Required)

**Version**: 20.x or higher

1. Download the Windows installer from [nodejs.org](https://nodejs.org/)
2. Run the installer and follow the setup wizard
3. Verify installation:
   ```cmd
   node --version
   npm --version
   ```

### 2. Java Development Kit (Required)

**Version**: JDK 17 (recommended)

1. Download from [Oracle JDK](https://www.oracle.com/java/technologies/downloads/#java17) or [Microsoft OpenJDK](https://learn.microsoft.com/en-us/java/openjdk/download)
2. Install to a path without spaces (e.g., `C:\Program Files\Java\jdk-17`)
3. Set JAVA_HOME environment variable:
   - Open "Environment Variables" (Win + Search "environment")
   - Under "System Variables", click "New"
   - Variable name: `JAVA_HOME`
   - Variable value: `C:\Program Files\Java\jdk-17` (your JDK path)
4. Verify installation:
   ```cmd
   java -version
   ```

### 3. Android Studio (Required)

**Version**: Latest stable version

1. Download from [developer.android.com/studio](https://developer.android.com/studio)
2. Run the installer
3. During installation, ensure these components are selected:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device
   - Performance (Intel HAXM or AMD Processor)

### 4. Android SDK Setup

After installing Android Studio:

1. Open Android Studio
2. Go to: **Tools → SDK Manager**
3. In the **SDK Platforms** tab, check:
   - ✅ Android 13.0 (Tiramisu) - API Level 33
   - ✅ Android 12.0 (S) - API Level 31
   - ✅ Android 11.0 (R) - API Level 30
   - ✅ Android 10.0 (Q) - API Level 29
   - ✅ Android 9.0 (Pie) - API Level 28 (Minimum required)
4. In the **SDK Tools** tab, check:
   - ✅ Android SDK Build-Tools
   - ✅ Android Emulator
   - ✅ Android SDK Platform-Tools
   - ✅ Google Play services
   - ✅ Intel x86 Emulator Accelerator (HAXM installer)
5. Click "Apply" to install

### 5. Configure Environment Variables

1. Open "Edit the system environment variables" from Start menu
2. Click "Environment Variables"

#### Add ANDROID_HOME

Under "System Variables":
- Click "New"
- Variable name: `ANDROID_HOME`
- Variable value: `C:\Users\YourUsername\AppData\Local\Android\Sdk`
  (Replace `YourUsername` with your Windows username)

#### Update PATH

Under "System Variables", find "Path" and click "Edit":
- Add: `%ANDROID_HOME%\platform-tools`
- Add: `%ANDROID_HOME%\tools`
- Add: `%ANDROID_HOME%\tools\bin`
- Add: `%JAVA_HOME%\bin`

#### Verify Environment Variables

Open a new Command Prompt and run:
```cmd
echo %ANDROID_HOME%
echo %JAVA_HOME%
adb version
```

### 6. Git (Optional but Recommended)

1. Download from [git-scm.com](https://git-scm.com/download/win)
2. Install with default options
3. Verify: `git --version`

## Project Setup

### 1. Clone the Repository

```cmd
git clone https://github.com/lokesh-kurre/app-for-serving-aiml-model.git
cd app-for-serving-aiml-model
```

### 2. Install Dependencies

```cmd
npm install
```

This will install all required Node.js packages including:
- React Native
- React Native Vision Camera
- TypeScript
- Testing libraries

### 3. Create local.properties (If needed)

If you encounter "SDK location not found" errors:

Create `android/local.properties`:
```properties
sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
```

Note: Use double backslashes (`\\`) in the path.

## Setting Up Android Emulator

### Option 1: Using Android Studio AVD Manager

1. Open Android Studio
2. Go to **Tools → Device Manager**
3. Click "Create Device"
4. Select a device (e.g., Pixel 5)
5. Select system image:
   - Recommended: API Level 33 (Android 13)
   - Minimum: API Level 28 (Android 9)
6. Configure AVD settings:
   - RAM: 2048 MB or higher
   - VM Heap: 512 MB
   - Internal Storage: 2048 MB
7. Click "Finish"

### Option 2: Using Physical Device

1. Enable Developer Options on your Android device:
   - Go to **Settings → About Phone**
   - Tap "Build Number" 7 times
2. Enable USB Debugging:
   - Go to **Settings → Developer Options**
   - Enable "USB Debugging"
3. Connect device to computer via USB
4. Accept debugging prompt on device
5. Verify connection:
   ```cmd
   adb devices
   ```

## Building and Running the App

### Start Metro Bundler

In the project root, open Command Prompt:

```cmd
npm start
```

Keep this terminal window open. Metro bundler will watch for file changes.

### Run on Android

Open a new Command Prompt in the project root:

```cmd
npm run android
```

Or manually build:

```cmd
cd android
gradlew.bat clean
gradlew.bat assembleDebug
cd ..
npm run android
```

### Expected Result

- App installs on emulator/device
- Camera permission dialog appears
- After granting permission, camera preview displays
- Capture button appears below camera
- Gallery and inference sections are visible

## Common Issues and Solutions

### Issue 1: "SDK location not found"

**Solution**:
- Verify ANDROID_HOME is set correctly
- Create `android/local.properties` as described above
- Restart Command Prompt/IDE

### Issue 2: "JAVA_HOME is not set"

**Solution**:
```cmd
setx JAVA_HOME "C:\Program Files\Java\jdk-17"
```
Restart Command Prompt after setting.

### Issue 3: "adb: command not found"

**Solution**:
- Verify `%ANDROID_HOME%\platform-tools` is in PATH
- Restart Command Prompt
- Try full path: `%ANDROID_HOME%\platform-tools\adb devices`

### Issue 4: Metro bundler won't start

**Solution**:
```cmd
npm start -- --reset-cache
```

### Issue 5: Build fails with Gradle errors

**Solution**:
```cmd
cd android
gradlew.bat clean
cd ..
npm start -- --reset-cache
npm run android
```

### Issue 6: App crashes on launch

**Solution**:
- Ensure device/emulator runs Android 9 or higher
- Grant camera permission manually in device settings
- Clear app data and reinstall

### Issue 7: "Unable to load script"

**Solution**:
- Ensure Metro bundler is running (`npm start`)
- On device, shake to open dev menu
- Select "Reload"

### Issue 8: Camera shows black screen

**Solution**:
- Grant camera permission in app
- Check device settings → App permissions → Camera
- Try closing and reopening the app

## Development Workflow

### Making Changes

1. Edit `App.tsx` or other source files
2. Save the file
3. App automatically reloads (Fast Refresh)
4. If it doesn't, press `R` twice in Metro terminal

### Running Tests

```cmd
npm test
```

### Linting Code

```cmd
npm run lint
```

### Building Release APK

```cmd
cd android
gradlew.bat assembleRelease
```

APK location: `android\app\build\outputs\apk\release\app-release.apk`

## Performance Tips

### Speed up build times

1. **Enable Gradle Daemon**: Already enabled in `gradle.properties`

2. **Increase Gradle Memory**: Edit `android\gradle.properties`:
   ```properties
   org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=512m
   ```

3. **Use Parallel Builds**: Add to `gradle.properties`:
   ```properties
   org.gradle.parallel=true
   ```

### Optimize Metro Bundler

Add to `metro.config.js`:
```javascript
module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
```

## IDE Recommendations

### Visual Studio Code

**Recommended Extensions**:
- React Native Tools (Microsoft)
- ESLint
- Prettier - Code formatter
- React-Native/React/Redux snippets

**Settings** (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": ["javascript", "typescript", "javascriptreact", "typescriptreact"]
}
```

### Android Studio

- Better for editing native Android code
- Built-in Android emulator management
- Gradle build integration

## Debugging

### React Native Debugger

1. With app running, press `Ctrl + M` on emulator
2. Select "Debug" from menu
3. Chrome DevTools will open

### VS Code Debugger

1. Install "React Native Tools" extension
2. Press `F5` to start debugging
3. Set breakpoints in TypeScript code

### Android Logcat

View native Android logs:
```cmd
adb logcat | findstr "ReactNative"
```

## Network Configuration

### Accessing Local API (Future)

If you need to connect to a local API server:

1. Find your PC's IP address:
   ```cmd
   ipconfig
   ```
   Look for "IPv4 Address"

2. Use this IP in app:
   ```typescript
   const API_URL = 'http://192.168.1.100:3000'; // Your PC IP
   ```

## Troubleshooting Checklist

Before asking for help, verify:

- [ ] Node.js 20+ installed
- [ ] JDK 17 installed
- [ ] JAVA_HOME environment variable set
- [ ] Android SDK installed
- [ ] ANDROID_HOME environment variable set
- [ ] PATH includes platform-tools
- [ ] `adb devices` shows connected device/emulator
- [ ] `npm install` completed without errors
- [ ] Metro bundler is running
- [ ] Camera permissions granted on device

## Useful Commands Reference

```cmd
# Check versions
node --version
npm --version
java -version

# Check environment
echo %JAVA_HOME%
echo %ANDROID_HOME%

# ADB commands
adb devices                    # List connected devices
adb shell                      # Open device shell
adb logcat                     # View device logs
adb install app.apk            # Install APK
adb uninstall com.aimlmodelapp # Uninstall app

# Gradle commands (from android/ directory)
gradlew.bat tasks              # List available tasks
gradlew.bat clean              # Clean build
gradlew.bat assembleDebug      # Build debug APK
gradlew.bat assembleRelease    # Build release APK
gradlew.bat installDebug       # Install debug APK

# NPM commands
npm install                    # Install dependencies
npm start                      # Start Metro bundler
npm run android                # Run on Android
npm test                       # Run tests
npm run lint                   # Run linter
npm audit fix                  # Fix vulnerabilities
```

## Additional Resources

- [React Native Docs](https://reactnative.dev/docs/environment-setup)
- [React Native Vision Camera](https://react-native-vision-camera.com/)
- [Android Developer Docs](https://developer.android.com/)
- [Stack Overflow - React Native Tag](https://stackoverflow.com/questions/tagged/react-native)

## Getting Help

If you encounter issues:

1. Check this guide's "Common Issues" section
2. Search [GitHub Issues](https://github.com/lokesh-kurre/app-for-serving-aiml-model/issues)
3. Create a new issue with:
   - Windows version
   - Node.js version
   - Error message/logs
   - Steps to reproduce

## Next Steps

After successful setup:

1. Explore the codebase in `App.tsx`
2. Read `ARCHITECTURE.md` for component details
3. Modify UI and test Fast Refresh
4. Add new features following existing patterns
5. Prepare for ML model integration

Happy coding! 🚀
