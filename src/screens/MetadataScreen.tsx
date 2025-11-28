// src/screens/MetadataScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  LayoutChangeEvent,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import cl_data from '../assets/class_data.json';

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const DOUBLE_TAP_SCALE = 2;

export default function MetadataScreen({ route }) {
  const { capturedPhoto, inferenceResult } = route.params;
  const first10 = inferenceResult?.first10 ?? [];
  const top5 = inferenceResult?.top5 ?? [];

  // layout of preview area
  const [layout, setLayout] = useState({ w: 0, h: 0 });

  // FINAL fixed imageUri state handling
  const [imageUri, setImageUri] = useState<string | null>(null);
  useEffect(() => {
    setImageUri(`file://${capturedPhoto.path}`);
  }, [capturedPhoto.path]);

  // shared values
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const startScale = useSharedValue(1);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  // clamp helper
  const clampW = (v: number, min: number, max: number) => {
      'worklet';
      return Math.max(min, Math.min(max, v));
    };

  // PINCH
  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      startScale.value = scale.value;
    })
    .onUpdate((e) => {
      const s = startScale.value * e.scale;
      scale.value = clampW(s, MIN_SCALE, MAX_SCALE);
    })
    .onEnd(() => {
      scale.value = withTiming(clampW(scale.value, MIN_SCALE, MAX_SCALE), {
        duration: 150,
      });
    });

  // PAN
  const panGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      if (scale.value <= 1) return;

      const nextX = startX.value + e.translationX;
      const nextY = startY.value + e.translationY;

      const maxX = (scale.value * layout.w - layout.w) / 2;
      const maxY = (scale.value * layout.h - layout.h) / 2;

      translateX.value = clampW(nextX, -maxX, maxX);
      translateY.value = clampW(nextY, -maxY, maxY);
    });

  // DOUBLE TAP TO ZOOM
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart((e) => {
      const isZoomed = scale.value > 1.5;

      if (isZoomed) {
        scale.value = withTiming(1, { duration: 200 });
        translateX.value = withTiming(0, { duration: 200 });
        translateY.value = withTiming(0, { duration: 200 });
        return;
      }

      const cx = layout.w / 2;
      const cy = layout.h / 2;

      const dx = e.x - cx;
      const dy = e.y - cy;

      const target = DOUBLE_TAP_SCALE;

      const maxX = (target * layout.w - layout.w) / 2;
      const maxY = (target * layout.h - layout.h) / 2;

      const tx = clampW(-dx * (target - 1), -maxX, maxX);
      const ty = clampW(-dy * (target - 1), -maxY, maxY);

      scale.value = withTiming(target, { duration: 180 });
      translateX.value = withTiming(tx, { duration: 180 });
      translateY.value = withTiming(ty, { duration: 180 });
    });

  const composedGesture = Gesture.Simultaneous(
    pinchGesture,
    panGesture,
    doubleTapGesture
  );

  // animated image transform
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* IMAGE PREVIEW */}
      <View style={styles.topBox}>
        <View style={styles.headerBox}>
          <Text style={styles.headerText}>Input Image Preview</Text>
        </View>

        <View
          style={styles.previewArea}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setLayout({ w: width, h: height });
          }}
        >
          <GestureDetector gesture={composedGesture}>
            <Animated.View style={[styles.zoomContainer, animatedStyle]}>
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  style={styles.image}
                  resizeMode="contain"
                />
              ) : (
                <Text style={{ color: '#aaa' }}>Loading...</Text>
              )}
            </Animated.View>
          </GestureDetector>
        </View>
      </View>

      {/* METADATA SECTION */}
      <View style={styles.bottomBox}>
        <View style={styles.metaHeader}>
          <Text style={styles.metaText}>Inference Details</Text>
        </View>

        <ScrollView style={styles.metaContent}>
          <Text style={styles.metaLabel}>First 10 Scores:</Text>
          <Text style={styles.metaValue}>{first10.join(', ')}</Text>

          <View style={{ height: 20 }} />

          <Text style={styles.metaLabel}>Top 5 Predictions:</Text>
          {top5.map((item, idx) => (
            <Text key={idx} style={styles.metaValue}>
              #{idx + 1}: Class {item.idx} — {item.score} - {cl_data[item.idx]}
            </Text>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },

  topBox: { flex: 0.65, backgroundColor: '#111' },

  headerBox: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  headerText: { color: '#4A90E2', fontSize: 18, fontWeight: '600' },

  previewArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  zoomContainer: { width: '100%', height: '100%' },

  image: { width: '100%', height: '100%' },

  bottomBox: {
    flex: 0.35,
    backgroundColor: '#0d0d0d',
    borderTopColor: '#222',
    borderTopWidth: 1,
  },

  metaHeader: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  metaText: { color: '#67B26F', fontSize: 16, fontWeight: '600' },

  metaContent: { padding: 16 },

  metaLabel: { color: '#4A90E2', fontSize: 15, marginBottom: 6 },
  metaValue: { color: '#ccc', fontSize: 14, lineHeight: 20 },
});
