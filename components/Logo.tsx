import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface LogoProps {
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ size = 120 }) => {
  const logoSize = size;
  const fontSize = size * 0.3;
  const iconSize = size * 0.4;
  
  return (
    <View style={[styles.container, { width: logoSize, height: logoSize }]}>
      {/* Outer border circles */}
      <View style={[styles.outerCircle, { 
        width: logoSize, 
        height: logoSize,
        borderRadius: logoSize / 2,
      }]} />
      
      {/* Inner decorative circles */}
      <View style={[styles.innerCircle, { 
        width: logoSize * 0.7, 
        height: logoSize * 0.7,
        borderRadius: (logoSize * 0.7) / 2,
      }]} />
      
      {/* Camera icon representation using text */}
      <View style={styles.iconContainer}>
        <Text style={[styles.cameraIcon, { fontSize: iconSize }]}>📷</Text>
      </View>
      
      {/* AI indicator */}
      <View style={styles.aiIndicator}>
        <Text style={[styles.aiText, { fontSize: fontSize * 0.6 }]}>AI</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  outerCircle: {
    position: 'absolute',
    borderWidth: 4,
    borderColor: '#4A90E2',
    backgroundColor: 'transparent',
  },
  innerCircle: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: '#67B26F',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    textAlign: 'center',
  },
  aiIndicator: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#4A90E2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  aiText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
