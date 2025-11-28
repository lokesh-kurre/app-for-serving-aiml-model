# Quick Start Guide

Get the AI/ML Model Serving App running in 5 minutes!

## Prerequisites Checklist

Before starting, ensure you have:
- [ ] Windows 10 or 11
- [ ] Node.js 20+ installed
- [ ] Java JDK 17 installed
- [ ] Android Studio installed
- [ ] Android device or emulator ready

## Quick Setup (5 Steps)

### Step 1: Install Node.js (2 minutes)

1. Download from [nodejs.org](https://nodejs.org/)
2. Run installer with default options
3. Verify: Open Command Prompt and run:
   ```cmd
   node --version
   ```
   Should show: `v20.x.x` or higher

### Step 2: Install JDK (2 minutes)

1. Download JDK 17 from [Microsoft OpenJDK](https://learn.microsoft.com/en-us/java/openjdk/download)
2. Install to `C:\Program Files\Java\jdk-17`
3. Set environment variable:
   - Press `Win + R`, type `sysdm.cpl`, press Enter
   - Go to "Advanced" tab → "Environment Variables"
   - Under "System Variables" → "New"
   - Variable name: `JAVA_HOME`
   - Variable value: `C:\Program Files\Java\jdk-17`
   - Click OK

### Step 3: Install Android Studio (5 minutes)

1. Download from [developer.android.com/studio](https://developer.android.com/studio)
2. Run installer with default options
3. Open Android Studio
4. Go to: Settings → Appearance & Behavior → System Settings → Android SDK
5. Check these items:
   - Android 13.0 (API 33)
   - Android SDK Build-Tools
   - Android Emulator
6. Click "Apply" and wait for download

### Step 4: Set Android Environment (1 minute)

1. Press `Win + R`, type `sysdm.cpl`, press Enter
2. Go to "Advanced" tab → "Environment Variables"
3. Under "System Variables" → "New"
   - Variable name: `ANDROID_HOME`
   - Variable value: `C:\Users\YourUsername\AppData\Local\Android\Sdk`
     (Replace `YourUsername` with your Windows username)
4. Edit "Path" variable → Add these entries:
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\tools`
5. Click OK to save

### Step 5: Clone and Run (3 minutes)

1. Open Command Prompt
2. Clone the repository:
   ```cmd
   git clone https://github.com/lokesh-kurre/app-for-serving-aiml-model.git
   cd app-for-serving-aiml-model
   ```

3. Install dependencies:
   ```cmd
   npm install
   ```

4. Start the app:
   ```cmd
   npm start
   ```

5. In a new Command Prompt window:
   ```cmd
   cd app-for-serving-aiml-model
   npm run android
   ```

## Using the App

Once the app launches on your device/emulator:

1. **Grant Camera Permission**
   - Tap "Allow" when prompted
   
2. **See Camera Preview**
   - Camera feed appears in circular frame
   
3. **Capture Photo**
   - Tap the white circular button
   
4. **View Result**
   - Captured image appears in gallery section
   - Inference result shows at bottom

## Troubleshooting

### "SDK location not found"

**Fix**: Create `android/local.properties`:
```properties
sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
```

### "Command not found: adb"

**Fix**: Restart Command Prompt after setting ANDROID_HOME

### "Metro bundler not starting"

**Fix**: 
```cmd
npm start -- --reset-cache
```

### Build fails

**Fix**:
```cmd
cd android
.\gradlew.bat clean
cd ..
npm run android
```

### More help needed?

Check detailed guides:
- `WINDOWS_SETUP.md` - Complete Windows setup
- `README.md` - Full documentation
- `ARCHITECTURE.md` - Technical details

## Next Steps

After successful setup:

### Test the App
- Capture multiple photos
- Test on different Android versions
- Try different lighting conditions

### Prepare for ML Integration
1. Choose an ML framework:
   - TensorFlow Lite (recommended for Android)
   - ONNX Runtime
   - PyTorch Mobile

2. Prepare your model:
   - Convert to mobile format (.tflite, .onnx)
   - Test model size and performance
   - Prepare preprocessing requirements

3. Integrate model:
   - Add model files to `android/app/src/main/assets/`
   - Install ML runtime library
   - Update inference logic in `App.tsx`

### Customize the App
- Modify UI colors in `App.tsx` styles
- Adjust camera frame size
- Add new features (flash toggle, front camera, etc.)
- Customize inference display format

## Development Tips

### Fast Development Cycle
1. Keep Metro bundler running: `npm start`
2. Make changes in `App.tsx`
3. Save file
4. App auto-reloads (Fast Refresh)

### Debug Menu
On emulator: Press `Ctrl + M`
On device: Shake the device

### View Logs
```cmd
adb logcat | findstr "ReactNative"
```

## Common Commands

```cmd
# Start development
npm start

# Run on Android
npm run android

# Run tests
npm test

# Lint code
npm run lint

# Clean build
cd android
.\gradlew.bat clean
cd ..

# Rebuild app
npm run android
```

## Resources

### Documentation
- [README.md](README.md) - Full project documentation
- [WINDOWS_SETUP.md](WINDOWS_SETUP.md) - Detailed Windows setup
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical architecture
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - What's built

### External Links
- [React Native Docs](https://reactnative.dev/docs/environment-setup)
- [Vision Camera Docs](https://react-native-vision-camera.com/)
- [Android Developer Guide](https://developer.android.com/)

## Getting Help

Stuck? Try these steps:

1. **Check documentation**
   - Read the error message carefully
   - Search in WINDOWS_SETUP.md

2. **Search online**
   - Google the exact error message
   - Check Stack Overflow

3. **Ask for help**
   - Create a GitHub issue
   - Include: Windows version, Node version, error message, steps to reproduce

## Success! 🎉

If you see the camera preview with a circular frame, you're all set!

The app is ready for:
- Testing and validation
- ML model integration
- Custom feature development
- Production deployment

Happy coding! 🚀

---

**Estimated Total Time**: 15-20 minutes
**Difficulty Level**: Beginner-friendly
**Prerequisites**: Windows PC, internet connection
**Output**: Fully functional camera app on Android
