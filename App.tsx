/**
 * AI/ML Model Serving App
 * Platform-agnostic codebase for serving AI/ML models
 *
 * @format
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  StatusBar,
  ScrollView,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  PhotoFile,
} from 'react-native-vision-camera';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
  const [capturedPhoto, setCapturedPhoto] = useState<PhotoFile | null>(null);
  const [inferenceResult, setInferenceResult] = useState<string>(
    'No inference result yet',
  );
  const { hasPermission, requestPermission } = useCameraPermission();
  const camera = useRef<Camera>(null);
  const device = useCameraDevice('back');

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const handleCapture = async () => {
    if (camera.current) {
      try {
        const photo = await camera.current.takePhoto({
          flash: 'off',
          enableShutterSound: true,
        });
        setCapturedPhoto(photo);
        // Placeholder for model inference
        setInferenceResult(
          'Model inference will be integrated here. Photo captured successfully!',
        );
      } catch (error) {
        console.error('Failed to capture photo:', error);
        setInferenceResult('Failed to capture photo');
      }
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          Camera permission is required to use this app
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>No camera device found</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.container}>
        {/* Camera Preview with Circular Frame */}
        <View style={styles.cameraContainer}>
          <Camera
            ref={camera}
            style={styles.camera}
            device={device}
            isActive={true}
            photo={true}
            // Fixed camera properties for image specialization
            exposure={0}
            zoom={device.neutralZoom}
            enableZoomGesture={false}
          />
          {/* Circular overlay */}
          <View style={styles.circularOverlay}>
            <View style={styles.circleFrame} />
          </View>
        </View>

        {/* Capture Button */}
        <View style={styles.captureButtonContainer}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleCapture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>

        {/* Gallery View - Rectangle Box for Captured Images */}
        <View style={styles.galleryContainer}>
          <Text style={styles.galleryTitle}>Captured Image</Text>
          <View style={styles.imageBox}>
            {capturedPhoto ? (
              <Image
                source={{ uri: `file://${capturedPhoto.path}` }}
                style={styles.capturedImage}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.placeholderText}>
                No image captured yet
              </Text>
            )}
          </View>
        </View>

        {/* Inference Result Display */}
        <View style={styles.inferenceContainer}>
          <Text style={styles.inferenceTitle}>Inference Result</Text>
          <ScrollView style={styles.inferenceScrollView}>
            <Text style={styles.inferenceText}>{inferenceResult}</Text>
          </ScrollView>
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
    marginTop: 100,
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
  cameraContainer: {
    height: 300,
    width: '100%',
    position: 'relative',
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  circularOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  circleFrame: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  captureButtonContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#ccc',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  galleryContainer: {
    height: 180,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#1a1a1a',
  },
  galleryTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  imageBox: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  capturedImage: {
    width: '100%',
    height: '100%',
  },
  placeholderText: {
    color: '#888',
    fontSize: 14,
  },
  inferenceContainer: {
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
