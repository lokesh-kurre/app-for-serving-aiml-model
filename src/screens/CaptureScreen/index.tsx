import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Text,
  StatusBar,
} from 'react-native';

import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';

import Slider from '@react-native-community/slider';
import styles from './styles';
import { parseInferResult } from '../../utils/parseInferResult'

const { AimlPathModule } = NativeModules;

export default function CaptureScreen({ navigation }) {
  const camera = useRef(null);

  // Permissions
  const { hasPermission, requestPermission } = useCameraPermission();
  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission]);

  // Camera device
  const [cameraPosition, setCameraPosition] = useState<'back' | 'front'>('back');
  const device = useCameraDevice(cameraPosition);

  // Camera controls
  const [flash, setFlash] = useState<'off' | 'on' | 'auto'>('off');
  const [zoom, setZoom] = useState(0);
  const [exposure, setExposure] = useState(0);
  const [hdr, setHdr] = useState(false);
  const [whiteBalance, setWhiteBalance] = useState<'auto' | 'sunny' | 'cloudy'>(
    'auto'
  );

  // Focus UI
  const [focusPoint, setFocusPoint] = useState(null);
  const [showFocus, setShowFocus] = useState(false);

  // Resolution logic (ONLY for back camera)
  const formats = device?.formats ?? [];
  const photoFormats = formats.filter((f) => f.photoWidth && f.photoHeight);

  const defaultFormat =
    photoFormats.find((f) => f.photoWidth === 1280 && f.photoHeight === 720) ||
    photoFormats[0];

  const [selectedFormat, setSelectedFormat] = useState(defaultFormat);
  const [showResolutionList, setShowResolutionList] = useState(false);

  if (!device) {
    return (
      <View style={styles.noCameraContainer}>
        <Text style={{ color: '#fff' }}>No Camera Found</Text>
      </View>
    );
  }

  // -------------------------------
  // Focus tap
  // -------------------------------
  const onFocusTap = (e) => {
    const { locationX, locationY } = e.nativeEvent;

    setFocusPoint({ x: locationX, y: locationY });
    setShowFocus(true);

    setTimeout(() => setShowFocus(false), 800);
  };

  // -------------------------------
  // Capture + inference
  // -------------------------------
  const isNavigating = useRef(false);

  const captureImage = async () => {
    if (!camera.current || isNavigating.current) return;

    isNavigating.current = true;

    try {
      const photo = await camera.current.takePhoto({
        flash,
        enableShutterSound: false,
      });

      const modelResult = await AimlPathModule.inferFromPath(
          photo.path
      );
      const { first10, top5 } = parseInferResult(modelResult);


      navigation.navigate('Metadata', {
        capturedPhoto: photo,
        inferenceResult: { first10, top5 },
      });
    } catch (err) {
      console.error('capture error', err);
    }

    setTimeout(() => {
      isNavigating.current = false;
    }, 300);
  };

  // -------------------------------
  // Toggling controls
  // -------------------------------
  const toggleFlash = () =>
    setFlash((f) => (f === 'off' ? 'on' : f === 'on' ? 'auto' : 'off'));

  const toggleHDR = () => setHdr((h) => !h);

  const toggleWhiteBalance = () =>
    setWhiteBalance((w) =>
      w === 'auto' ? 'sunny' : w === 'sunny' ? 'cloudy' : 'auto'
    );

  const switchCamera = () =>
    setCameraPosition((p) => (p === 'back' ? 'front' : 'back'));

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <Pressable
      style={styles.container}
      onPress={() => showResolutionList && setShowResolutionList(false)}
    >
      <StatusBar hidden />

      {/* Camera */}
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
        zoom={zoom}
        exposure={exposure}
        enableHdr={hdr}
        flash={flash}
        whiteBalance={whiteBalance}
        format={selectedFormat}
        fps={30}
        onTouchStart={onFocusTap}
      />

      {/* Focus indicator */}
      {showFocus && focusPoint && (
        <View
          style={[
            styles.focusIndicator,
            { left: focusPoint.x - 30, top: focusPoint.y - 30 },
          ]}
        />
      )}

      {/* TOP camera settings */}
      <View style={styles.topControlRow}>
        <TouchableOpacity onPress={toggleFlash} style={styles.topButton}>
          <Text style={styles.topButtonText}>⚡ {flash}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleHDR} style={styles.topButton}>
          <Text style={styles.topButtonText}>HDR {hdr ? 'ON' : 'OFF'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleWhiteBalance} style={styles.topButton}>
          <Text style={styles.topButtonText}>WB {whiteBalance}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setExposure((e) => e + 0.1)}
          style={styles.topButton}
        >
          <Text style={styles.topButtonText}>☀ EXP+</Text>
        </TouchableOpacity>
      </View>

      {/* RESOLUTION DROPDOWN — ONLY BACK CAMERA */}
      {cameraPosition === 'back' && (
        <View style={styles.resolutionContainer}>
          <TouchableOpacity
            style={styles.resolutionToggle}
            onPress={() => setShowResolutionList((s) => !s)}
            activeOpacity={0.7}
          >
            <Text style={styles.resolutionText}>
              {selectedFormat
                ? `${selectedFormat.photoWidth}×${selectedFormat.photoHeight} ▼`
                : 'Resolution ▼'}
            </Text>
          </TouchableOpacity>

          {showResolutionList && (
            <View style={styles.resolutionList}>
              <ScrollView
                nestedScrollEnabled
                showsVerticalScrollIndicator
                contentContainerStyle={{ paddingVertical: 5 }}
              >
                {photoFormats.map((fmt, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.resItem}
                    onPress={() => {
                      setSelectedFormat(fmt);
                      setShowResolutionList(false);
                    }}
                  >
                    <Text style={styles.resItemText}>
                      {fmt.photoWidth}×{fmt.photoHeight}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      )}

      {/* Zoom slider */}
      <View style={styles.zoomSliderContainer}>
        <Slider
          value={zoom}
          minimumValue={0}
          maximumValue={device?.maxZoom ?? 4}
          onValueChange={setZoom}
          style={styles.zoomSlider}
          thumbTintColor="#fff"
          minimumTrackTintColor="#4A90E2"
          maximumTrackTintColor="#666"
        />
      </View>

      {/* Bottom controls */}
      <View style={styles.bottomControls}>
        <TouchableOpacity style={styles.bottomBtn}>
          <Text style={styles.bottomIcon}>🖼️</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureButton} onPress={captureImage}>
          <View style={styles.captureInner} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomBtn} onPress={switchCamera}>
          <Text style={styles.bottomIcon}>🔄</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}
