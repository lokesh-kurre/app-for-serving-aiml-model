/**
 * AI/ML Model Serving App
 * Platform-agnostic codebase for serving AI/ML models
 *
 * @format
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  StatusBar,
  ScrollView,
  useColorScheme,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  PhotoFile,
  useCameraFormat,
} from 'react-native-vision-camera';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SplashScreen } from './components/SplashScreen';
import { Logo } from './components/Logo';

// Lazy load react-native-fs to avoid initialization errors
let RNFS: any = null;
try {
  RNFS = require('react-native-fs');
} catch (error) {
  console.warn('react-native-fs not available:', error);
}

type CameraPosition = 'back' | 'front';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [capturedPhoto, setCapturedPhoto] = useState<PhotoFile | null>(null);
  const [inferenceResult, setInferenceResult] = useState<string>(
    'No inference result yet',
  );
  const [showGallery, setShowGallery] = useState(false);
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>('back');
  const [isFocused, setIsFocused] = useState(false);
  const [focusDistance, setFocusDistance] = useState<number>(0); // Focus distance in cm
  
  const { hasPermission, requestPermission } = useCameraPermission();
  const camera = useRef<Camera>(null);
  const device = useCameraDevice(cameraPosition);
  const colorScheme = useColorScheme();
  
  // Select camera format with autofocus for close range (20-50cm)
  const format = useCameraFormat(device, [
    { photoResolution: { width: 1920, height: 1080 } },
    { fps: 30 },
  ]);

  // Handle splash screen finish
  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  const handleSwitchCamera = useCallback(() => {
    // Don't save any state when switching camera
    setCameraPosition(prev => prev === 'back' ? 'front' : 'back');
    setIsFocused(false);
  }, []);

  useEffect(() => {
    if (!hasPermission && !showSplash) {
      requestPermission();
    }
  }, [hasPermission, requestPermission, showSplash]);

  // Simulate focus detection based on distance (20-50cm range)
  // In a real implementation, you would use camera focus events or depth sensors
  useEffect(() => {
    if (device && !showGallery && !showSplash) {
      const interval = setInterval(() => {
        // Simulated focus distance between 10-70cm
        const simulatedDistance = Math.floor(Math.random() * 60) + 10; // 10-70cm
        setFocusDistance(simulatedDistance);
        
        // Check if in focus range (20-50cm)
        const inFocusRange = simulatedDistance >= 20 && simulatedDistance <= 50;
        setIsFocused(inFocusRange);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [device, showGallery, showSplash]);

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  const requestStoragePermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      return true;
    }
    
    try {
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.error('Permission error:', err);
      return false;
    }
  };

  const handleCapture = async () => {
    if (camera.current) {
      try {
        const photo = await camera.current.takePhoto({
          flash: 'off',
          enableShutterSound: false, // Disabled as requested
        });
        setCapturedPhoto(photo);
        // Placeholder for model inference
        setInferenceResult(
          `Model inference will be integrated here. Photo captured successfully!\nFocus Distance: ${focusDistance}cm\nFocus Status: ${isFocused ? 'In Range (20-50cm)' : 'Out of Range'}`,
        );
        setShowGallery(true); // Navigate to gallery screen
      } catch (error) {
        console.error('Failed to capture photo:', error);
        Alert.alert('Error', 'Failed to capture photo');
      }
    }
  };

  const handleSaveImage = async () => {
    if (!capturedPhoto) {
      return;
    }

    // Check if RNFS is available
    if (!RNFS) {
      Alert.alert(
        'Feature Not Available',
        'File system module not initialized. The image is captured but saving to gallery is not available in this build.',
      );
      return;
    }

    const hasStoragePermission = await requestStoragePermission();
    if (!hasStoragePermission) {
      Alert.alert('Permission Denied', 'Storage permission is required to save images');
      return;
    }

    try {
      const timestamp = new Date().getTime();
      const fileName = `IMG_${timestamp}_focus${focusDistance}cm.jpg`;
      const picturesDir = Platform.OS === 'android' 
        ? `${RNFS.ExternalStorageDirectoryPath}/Pictures/AIMLModelApp`
        : `${RNFS.DocumentDirectoryPath}/AIMLModelApp`;
      
      // Create directory if it doesn't exist
      const dirExists = await RNFS.exists(picturesDir);
      if (!dirExists) {
        await RNFS.mkdir(picturesDir);
      }

      const destPath = `${picturesDir}/${fileName}`;
      await RNFS.copyFile(capturedPhoto.path, destPath);
      
      Alert.alert('Success', `Image saved to Pictures/AIMLModelApp/${fileName}`);
    } catch (error) {
      console.error('Failed to save image:', error);
      Alert.alert('Error', 'Failed to save image: ' + (error as Error).message);
    }
  };

  const handleBackToCamera = () => {
    setShowGallery(false);
    setCapturedPhoto(null);
  };

  if (!hasPermission) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.container}>
          <Logo size={120} />
          <Text style={styles.permissionText}>
            Camera permission is required to use this app
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaProvider>
    );
  }

  if (!device) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.container}>
          <Logo size={100} />
          <Text style={styles.permissionText}>No camera device found</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  // Gallery Screen
  if (showGallery && capturedPhoto) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.container}>
          {/* Back button at top */}
          <View style={styles.galleryHeaderVertical}>
            <TouchableOpacity onPress={handleBackToCamera} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          </View>

          {/* Gallery Preview with Save button on right */}
          <View style={styles.galleryPreviewSection}>
            <View style={styles.galleryImageContainer}>
              <Image
                source={{ uri: `file://${capturedPhoto.path}` }}
                style={styles.galleryImage}
                resizeMode="contain"
              />
            </View>
            <TouchableOpacity onPress={handleSaveImage} style={styles.saveButtonVertical}>
              <Text style={styles.downloadButtonText}>💾 Save</Text>
            </TouchableOpacity>
          </View>

          {/* Inference Result below */}
          <View style={styles.galleryInferenceContainer}>
            <Text style={styles.inferenceTitle}>Inference Result</Text>
            <ScrollView style={styles.inferenceScrollView}>
              <Text style={styles.inferenceText}>{inferenceResult}</Text>
            </ScrollView>
          </View>
        </View>
      </SafeAreaProvider>
    );
  }

  // Camera Screen
  // Opaque overlay - solid black or white based on theme
  const overlayColor = colorScheme === 'dark' ? '#000000' : '#FFFFFF';
  // Circle is green ONLY when both in focus AND within range (20-50cm)
  const circleColor = isFocused ? '#00ff00' : '#ff0000';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.container}>
        {/* Camera Preview - Full Screen */}
        <View style={styles.cameraFullScreen}>
          <Camera
            ref={camera}
            style={styles.camera}
            device={device}
            isActive={!showGallery}
            photo={true}
            format={format}
            // Fixed camera properties for image specialization
            exposure={0}
            zoom={device.neutralZoom}
            enableZoomGesture={false}
          />
          
          {/* Circular overlay - centered on screen with opaque background */}
          <View style={[styles.circularOverlay, { backgroundColor: overlayColor }]}>
            <View style={[styles.circleFrame, { borderColor: circleColor }]} />
            {/* Focal Distance Display */}
            <View style={styles.focusDistanceContainer}>
              <Text style={styles.focusDistanceText}>
                Focal Distance: {focusDistance}cm
              </Text>
            </View>
          </View>
        </View>

        {/* Capture and Switch Camera Buttons at Bottom */}
        <View style={styles.captureButtonContainer}>
          {/* Capture Button - Center */}
          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleCapture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          
          {/* Camera Switch Button - Beside Capture Button */}
          <TouchableOpacity 
            style={styles.switchCameraButton}
            onPress={handleSwitchCamera}>
            <Text style={styles.switchCameraText}>🔄</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cameraFullScreen: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  circularOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleFrame: {
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 6,
    backgroundColor: 'transparent',
  },
  focusDistanceContainer: {
    position: 'absolute',
    bottom: -80,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  focusDistanceText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  focusStatusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  captureButtonContainer: {
    height: 120,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#ccc',
  },
  captureButtonInner: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#fff',
  },
  switchCameraButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    borderWidth: 3,
    borderColor: '#ccc',
  },
  switchCameraText: {
    fontSize: 28,
  },
  galleryHeaderVertical: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#000',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  galleryPreviewSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 10,
    paddingVertical: 10,
    height: '50%',
  },
  galleryImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  saveButtonVertical: {
    padding: 10,
    marginLeft: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  galleryInferenceContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#0a0a0a',
  },
  inferenceTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  inferenceScrollView: {
    flex: 1,
  },
  inferenceText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default App;
