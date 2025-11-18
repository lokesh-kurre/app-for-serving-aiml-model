# Troubleshooting Guide

## Common Issues and Solutions

### Issue: "typeerror: cannot read property rnfsfiletyperegular of null"

**Symptom**: App crashes on startup with error about `react-native-fs`.

**Cause**: The `react-native-fs` native module is not properly linked or initialized.

**Solutions**:

#### Solution 1: Rebuild the App (Recommended)

After installing dependencies, rebuild the native Android project:

```bash
# Clean and rebuild
cd android
.\gradlew.bat clean
cd ..

# Reinstall dependencies
npm install

# Run the app (this will rebuild)
npm run android
```

#### Solution 2: Manual Linking Check

For React Native 0.82+, autolinking should work automatically. Verify by:

1. Check that `react-native-fs` is in `package.json` dependencies
2. Run `npx react-native config` to verify autolinking
3. Rebuild the app completely

#### Solution 3: Alternative Without Native Module

If the issue persists, the app includes fallback handling. The save functionality will show a message that the feature is not available, but all other features (camera, capture, gallery view) will work normally.

### Issue: "Can't find ViewManager 'RNSVGLinearGradient'"

**Symptom**: Build completes but app crashes with ViewManager not found error for SVG components.

**Cause**: `react-native-svg` native module not properly linked or causing conflicts.

**Solution**:

The app has been updated to use native React Native components instead of SVG. If you installed the old version:

```bash
# Remove node modules
rm -rf node_modules
npm install

# Clean and rebuild
cd android
.\gradlew.bat clean
cd ..
npm run android
```

**What was fixed**:
- Replaced SVG logo with React Native View-based logo (no native dependencies)
- Removed `react-native-svg` dependency
- Logo now uses emoji and styled Views for visual design

### Issue: "Task :app:checkDebugDuplicateClasses FAILED"

**Symptom**: Build fails with duplicate class errors when running `npm run android`.

**Cause**: Conflicting dependency versions causing duplicate classes (commonly kotlin-stdlib or libc++_shared.so).

**Solution**:

The build configuration has been updated to handle this automatically. If you still see this error:

```bash
# Clean everything
cd android
.\gradlew.bat clean
.\gradlew.bat cleanBuildCache
cd ..

# Remove node modules and reinstall
rm -rf node_modules
npm install

# Rebuild
npm run android
```

**What was fixed**:
- Added `packagingOptions` to handle duplicate native libraries
- Added dependency resolution strategy to force consistent Kotlin versions
- Configured gradle to pick first occurrence of duplicate files
- Removed problematic `react-native-svg` dependency

### Issue: Camera Permission Denied

**Solution**: 
1. Go to device Settings → Apps → AIMLModelApp → Permissions
2. Enable Camera permission
3. Restart the app

### Issue: Storage Permission Denied

**Solution**:
1. Go to device Settings → Apps → AIMLModelApp → Permissions
2. Enable Storage/Files permission
3. Try saving image again

### Issue: Build Fails on Windows

**Common Causes**:

1. **ANDROID_HOME not set**:
   ```cmd
   setx ANDROID_HOME "C:\Users\YourUsername\AppData\Local\Android\Sdk"
   ```

2. **JAVA_HOME not set**:
   ```cmd
   setx JAVA_HOME "C:\Program Files\Java\jdk-17"
   ```

3. **Gradle daemon issues**:
   ```bash
   cd android
   .\gradlew.bat --stop
   .\gradlew.bat clean
   ```

### Issue: Metro Bundler Won't Start

**Solution**:
```bash
# Reset cache
npm start -- --reset-cache
```

### Issue: App Shows Black Screen

**Possible Causes**:
1. Metro bundler not running - Start with `npm start`
2. Camera permission not granted - Check app permissions
3. Device not in developer mode - Enable USB debugging

### Issue: Focus Distance Always Shows 0cm

**Cause**: This is expected on first load. The simulated focus detection starts after camera initializes.

**Note**: In production, this would connect to actual camera focus callbacks.

## Getting Help

If you encounter issues not listed here:

1. Check the logs:
   ```bash
   # Android logs
   adb logcat | findstr "ReactNative"
   ```

2. Verify environment setup (see `WINDOWS_SETUP.md`)

3. Check that all dependencies are installed:
   ```bash
   npm install
   ```

4. Try a clean rebuild:
   ```bash
   # Delete build artifacts
   cd android
   .\gradlew.bat clean
   cd ..
   
   # Clear node modules
   rm -rf node_modules
   npm install
   
   # Rebuild
   npm run android
   ```

## Native Module Debugging

For issues with native modules like `react-native-fs`:

1. **Check React Native configuration**:
   ```bash
   npx react-native config
   ```

2. **Verify autolinking**:
   - Should show `react-native-fs` in the list of linked packages

3. **Check Android build**:
   ```bash
   cd android
   .\gradlew.bat :app:dependencies
   ```

4. **Force clean and rebuild**:
   ```bash
   cd android
   .\gradlew.bat clean
   .\gradlew.bat assembleDebug --refresh-dependencies
   ```

## Development Tips

- Always run `npm install` after pulling new changes
- Rebuild native code after adding new native dependencies
- Use `npm start -- --reset-cache` if JavaScript changes don't appear
- Check Metro bundler console for JavaScript errors
- Use Android Studio's Logcat for native crashes

## Platform-Specific Notes

### Windows Development
- Use `.\gradlew.bat` instead of `./gradlew`
- Paths use backslashes: `C:\path\to\sdk`
- Environment variables need system restart to take effect

### Android 9+ (API 28+)
- All permissions must be requested at runtime
- Storage permissions work differently on Android 13+
- Camera focus features depend on device hardware

## Known Limitations

1. **Focus Distance**: Currently simulated (10-70cm range)
   - Production version would use actual camera APIs
   - Updates every second for demonstration

2. **File Saving**: Requires native module initialization
   - Fallback handling prevents crashes
   - All other features work without file saving

3. **Camera Formats**: Device-dependent
   - Some devices may not support all focus ranges
   - Fingerprint capture optimized for 20-50cm

## Success Indicators

App is working correctly when:
- ✅ Splash screen shows and animates
- ✅ Camera preview appears in circular frame
- ✅ Focus distance updates (10-70cm range)
- ✅ Circle changes color (green/red) based on distance
- ✅ Capture button works and navigates to gallery
- ✅ Captured image displays in gallery view
- ✅ Back button returns to camera

## Contact

For persistent issues:
- Create an issue on GitHub
- Include: Device model, Android version, error logs
- Describe steps to reproduce
