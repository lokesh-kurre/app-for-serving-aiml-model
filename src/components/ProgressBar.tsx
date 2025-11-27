import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

type Props = {
  progress: number;      // 0.0 to 1.0
  height?: number;
  backgroundColor?: string;
  barColor?: string;
  borderRadius?: number;
};

export default function ProgressBar({
  progress,
  height = 6,
  backgroundColor = '#e2e8f0',
  barColor = '#0ea5e9',
  borderRadius = 4,
}: Props) {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 1,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View
      style={[
        styles.container,
        {
          height,
          backgroundColor,
          borderRadius,
        },
      ]}
    >
      <Animated.View
        style={{
          height: '100%',
          width: animatedWidth.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          }),
          backgroundColor: barColor,
          borderRadius,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
});
