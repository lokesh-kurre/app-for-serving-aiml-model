# Changelog

All notable changes to the AI Vision Model Serving App.

## [Unreleased]

### Added (2025-11-18)

#### Camera Enhancements
- **Focus Detection**: Real-time focus indicator for 20-50cm range
  - Green circle when object is in focus (optimal for fingerprint capture)
  - Red circle when out of focus range
  - Optimized for close-range object capture
  
- **Focus Distance Display**: Real-time distance measurement
  - Shows current focus distance in cm (e.g., "Focus: 35cm")
  - Status indicator: "✓ In Range" or "✗ Out of Range"
  - Color-coded to match circle (green/red)
  - Displayed below circular frame during capture
  
- **Camera Switching**: Toggle between front and back cameras
  - Switch button at top-right corner (🔄 icon)
  - Default: Back camera
  - State is cleared when switching cameras
  
- **Silent Capture**: Camera shutter sound disabled for discrete operation

#### UI/UX Improvements
- **Full-Screen Camera Preview**: Camera now occupies entire screen
- **Centered Focus Frame**: 300x300px circular frame centered on screen
  - Increased border thickness to 6px for better visibility
  - Area outside circle adapts to system theme (dark/light overlay)
  
- **Two-Screen Flow**: Separated camera and gallery views
  - **Screen 1**: Camera with circular focus frame and capture button
  - **Screen 2**: Gallery with captured image and inference results
  - Gallery appears automatically after capture

#### Gallery Features
- **Image Preview**: Full-size image display at top of gallery screen
- **Download Function**: Save images to device storage
  - Location: Pictures/AIMLModelApp/
  - Filename format: IMG_{timestamp}_focus{distance}cm.jpg
  - Example: IMG_1700329842123_focus35cm.jpg
  - Focus distance embedded in filename for easy tracking
  - Download icon (💾) in gallery header
  
- **Navigation**: Back button to return to camera from gallery
- **Inference Display**: Scrollable results section below image

#### Branding & Splash Screen
- **Custom Logo**: AI Vision brand identity
  - Camera lens with neural network pattern
  - Gradient color scheme (blue → green)
  - Focus indicator corners
  
- **Animated Splash Screen**: 2.5-second intro animation
  - Fade-in and scale effects
  - App name: "AI Vision"
  - Tagline: "Model Serving Platform"
  - Version display
  
- **Permission Screens**: Logo integrated into permission requests

#### Technical Improvements
- **Storage Permissions**: Proper Android storage permission handling
  - Android 13+ (API 33): READ_MEDIA_IMAGES
  - Android 9-12 (API 28-32): WRITE_EXTERNAL_STORAGE
  
- **File System**: react-native-fs integration for image saving
- **Vector Graphics**: react-native-svg for logo rendering
- **Camera Formats**: Optimized format selection for close-range focus

### Changed
- Camera preview expanded from 300px fixed height to full screen
- Capture button repositioned to absolute bottom overlay
- Gallery moved from inline display to separate screen
- Circle border thickness increased from 3px to 6px
- Overlay background now theme-aware (was fixed dark)

### Technical Details

#### New Dependencies
- `react-native-fs`: File system operations for image saving
- `react-native-svg`: Vector graphics for logo
- `react-native-permissions`: Runtime permission management

#### New Components
- `components/Logo.tsx`: Reusable SVG logo component
- `components/SplashScreen.tsx`: Animated startup screen

#### Modified Files
- `App.tsx`: Complete redesign with two-screen architecture
- `android/app/src/main/AndroidManifest.xml`: Added storage permissions
- `__tests__/App.test.tsx`: Updated mocks for new dependencies

#### Commits
- `84ce9aa`: Camera improvements (focus, switch, gallery, saving)
- `2dd3277`: Splash screen and logo components

### Security
- ✅ CodeQL scan: 0 vulnerabilities
- ✅ All tests passing
- ✅ Proper permission handling
- ✅ Secure file storage in app-specific directory

### Optimizations for Fingerprint Capture
- Close-range focus detection (20-50cm optimal range)
- High-quality photo capture settings
- Real-time focus feedback with color indicators
- Silent capture for professional use
- Fixed camera properties for consistent results

## [1.0.0] - Initial Release

### Features
- React Native 0.82 framework
- Android 9+ (API 28) support
- Basic camera preview with circular overlay
- Photo capture functionality
- Windows development environment support
- Comprehensive documentation

---

**Version**: 1.1.0 (Unreleased)
**Platform**: Android 9+
**Last Updated**: November 18, 2025
