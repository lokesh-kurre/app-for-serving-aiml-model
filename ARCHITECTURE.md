# Architecture Documentation

## App Overview

This is a platform-agnostic AI/ML model serving application built with React Native. The app provides a camera interface for capturing images and displaying inference results from AI/ML models.

## Technology Stack

- **Framework**: React Native 0.82
- **Language**: TypeScript
- **Camera Library**: react-native-vision-camera
- **UI Components**: React Native core components
- **Platform**: Android (iOS support planned)

## Component Structure

### Main App Component (`App.tsx`)

The main component implements the entire camera and inference UI:

```
┌─────────────────────────────────────┐
│         Status Bar (Black)          │
├─────────────────────────────────────┤
│                                     │
│     Camera Preview (300px)          │
│   ┌─────────────────────────┐      │
│   │                         │      │
│   │   ○ Circular Frame      │      │
│   │   (250x250px overlay)   │      │
│   │                         │      │
│   └─────────────────────────┘      │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      Capture Button (70px)          │
│            ◉                        │
│                                     │
├─────────────────────────────────────┤
│   Gallery View (180px)              │
│   ┌─────────────────────────────┐  │
│   │ Captured Image              │  │
│   │ (Rectangle Box)             │  │
│   └─────────────────────────────┘  │
├─────────────────────────────────────┤
│   Inference Results (Flex)          │
│   ┌─────────────────────────────┐  │
│   │ Model inference will be     │  │
│   │ integrated here...          │  │
│   │                             │  │
│   └─────────────────────────────┘  │
└─────────────────────────────────────┘
```

## Key Features Implementation

### 1. Camera Preview with Circular Frame

- **Component**: `Camera` from react-native-vision-camera
- **Overlay**: Circular frame (250x250px) with white border
- **Background**: Semi-transparent black overlay for focus
- **Fixed Properties**:
  - Exposure: 0 (neutral)
  - Zoom: Device neutral zoom
  - Zoom gestures: Disabled

### 2. Capture Button

- **Style**: Circular button (70px diameter)
- **Visual**: White with grey border, inner circle design
- **Functionality**: Captures photo with quality settings
- **Callback**: Updates gallery and inference sections

### 3. Gallery View

- **Container**: Rectangle box (180px height)
- **Display**: Shows most recently captured image
- **Placeholder**: Text message when no image
- **Resize Mode**: Cover for proper aspect ratio

### 4. Inference Display

- **Container**: Flexible height scrollable area
- **Content**: Text display for model results
- **Placeholder**: Default message before capture
- **Future**: Will integrate with ML model output

## Camera Configuration

The app uses fixed camera properties for consistent image quality:

```typescript
{
  device: useCameraDevice('back'),
  isActive: true,
  photo: true,
  exposure: 0,              // Neutral exposure
  zoom: device.neutralZoom, // No zoom applied
  enableZoomGesture: false  // Disable user zoom
}
```

## Photo Capture Configuration

```typescript
{
  flash: 'off',
  enableShutterSound: true
}
```

## State Management

### State Variables

1. **capturedPhoto**: Stores the latest captured PhotoFile
2. **inferenceResult**: Stores the inference result text
3. **hasPermission**: Camera permission status
4. **device**: Selected camera device (back camera)

### Hooks Used

- `useState`: For local state management
- `useRef`: For camera reference
- `useEffect`: For permission requests
- `useCameraDevice`: For camera device selection
- `useCameraPermission`: For permission handling

## Permission Flow

```
App Loads
    ↓
Check Camera Permission
    ↓
┌─────────────┬──────────────┐
│ Granted     │ Not Granted  │
│    ↓        │      ↓       │
│ Show Camera │ Show Request │
│             │    Button    │
└─────────────┴──────────────┘
```

## File Structure

```
app-for-serving-aiml-model/
├── App.tsx                 # Main application component
├── index.js               # Entry point
├── package.json           # Dependencies
├── android/              # Android native code
│   ├── app/
│   │   ├── build.gradle  # minSdkVersion: 28
│   │   └── src/main/
│   │       └── AndroidManifest.xml  # Camera permissions
│   └── build.gradle      # Root build config
├── ios/                  # iOS native code (future)
└── __tests__/           # Test files
    └── App.test.tsx     # App component tests
```

## Android Configuration

### Minimum SDK Version

- **minSdkVersion**: 28 (Android 9.0)
- **targetSdkVersion**: 36
- **compileSdkVersion**: 36

### Permissions

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" android:required="true" />
<uses-feature android:name="android.hardware.camera.autofocus" />
```

## Styling Approach

- **Dark Theme**: Black background (#000) for camera app aesthetic
- **Contrast**: White text and borders for visibility
- **Modular Sections**: Clear separation between preview, capture, gallery, and inference
- **Responsive**: Uses flex layout for different screen sizes

## Future Enhancements

### Phase 1: ML Integration
- [ ] Add TensorFlow Lite or ONNX Runtime
- [ ] Implement image preprocessing
- [ ] Connect inference pipeline
- [ ] Display structured results

### Phase 2: Advanced Features
- [ ] Multiple camera support (front/back toggle)
- [ ] Gallery with multiple images
- [ ] Model selection UI
- [ ] Batch processing
- [ ] Result export functionality

### Phase 3: Cross-Platform
- [ ] iOS implementation
- [ ] Platform-specific optimizations
- [ ] Unified styling across platforms

## Development Guidelines

### Testing
- Mock camera module for unit tests
- Test permission flows
- Test capture and state updates

### Performance
- Camera preview runs on native thread
- Minimal re-renders with proper state management
- Efficient image loading and display

### Code Quality
- TypeScript for type safety
- ESLint for code standards
- Consistent styling patterns
- Clear component structure

## Dependencies

### Production
- `react`: 19.1.1
- `react-native`: 0.82.1
- `react-native-vision-camera`: Latest
- `react-native-safe-area-context`: ^5.5.2

### Development
- TypeScript
- ESLint
- Jest
- Babel

## Platform Support

### Current
- ✅ Android 9+ (API 28+)

### Planned
- ⏳ iOS 13+
- ⏳ Web (future consideration)

## Build System

- **Android**: Gradle
- **iOS**: CocoaPods
- **JS Bundle**: Metro bundler
- **Package Manager**: npm

## Security Considerations

- Runtime permission requests
- No hardcoded credentials
- Secure image storage (temporary files)
- Camera access only when needed (isActive flag)
