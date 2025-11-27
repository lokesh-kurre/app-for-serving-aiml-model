import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import ProgressBar from '../components/ProgressBar';
import Logo from '../components/Logo';

type Props = {
  navigation: any;
};

export default function SplashScreen({ navigation }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let isMounted = true;

    // Simulate smooth progress for 1.5 sec
    const startTime = Date.now();
    const duration = 1500;

    const tick = () => {
      const now = Date.now();
      const delta = Math.min((now - startTime) / duration, 1);

      if (isMounted) setProgress(delta);

      if (delta < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);

    // Call nativeInit during loading
    globalThis.aimlLoadModel("tflite").then((ok) => {
      // Even if false, we continue UI-wise but you can change logic later
      console.log("nativeInit:", ok);
    });

    // Final navigation after 1.5 sec
    const navTimer = setTimeout(() => {
      navigation.replace("Capture");
    }, duration);

    return () => {
      isMounted = false;
      clearTimeout(navTimer);
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a1a" />

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Logo size={150} />
      </View>

      {/* App name */}
      <View style={styles.textContainer}>
        <Text style={styles.appName}>AI Vision</Text>
        <Text style={styles.subtitle}>Model Serving Platform</Text>

        <View style={styles.taglineContainer}>
          <Text style={styles.tagline}>• Capture • Analyze • Infer •</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressWrapper}>
        <ProgressBar progress={progress} height={8} barColor="#4A90E2" />
      </View>

      {/* Version footer */}
      <View style={styles.footer}>
        <Text style={styles.version}>v1.0.0</Text>
      </View>
    </View>
  );
}

// ------------------------
// Styles: kept exactly in your style
// ------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#67B26F',
    marginBottom: 20,
    fontWeight: '500',
  },
  taglineContainer: {
    marginTop: 10,
  },
  tagline: {
    fontSize: 14,
    color: '#4A90E2',
    letterSpacing: 1,
  },
  progressWrapper: {
    marginTop: 40,
    width: '70%',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
  },
  version: {
    fontSize: 12,
    color: '#666',
  },
});
