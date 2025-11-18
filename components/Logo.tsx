import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, G, Defs, LinearGradient, Stop } from 'react-native-svg';

interface LogoProps {
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ size = 120 }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <Defs>
          <LinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#4A90E2" stopOpacity="1" />
            <Stop offset="100%" stopColor="#67B26F" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        
        {/* Outer circle */}
        <Circle
          cx="60"
          cy="60"
          r="55"
          stroke="url(#grad1)"
          strokeWidth="4"
          fill="none"
        />
        
        {/* Inner camera lens design */}
        <Circle
          cx="60"
          cy="60"
          r="40"
          fill="url(#grad1)"
          opacity="0.2"
        />
        
        {/* Camera lens center */}
        <Circle
          cx="60"
          cy="60"
          r="25"
          stroke="url(#grad1)"
          strokeWidth="3"
          fill="none"
        />
        
        {/* AI Brain neural network pattern */}
        <G opacity="0.8">
          {/* Nodes */}
          <Circle cx="40" cy="45" r="3" fill="url(#grad1)" />
          <Circle cx="60" cy="35" r="3" fill="url(#grad1)" />
          <Circle cx="80" cy="45" r="3" fill="url(#grad1)" />
          <Circle cx="45" cy="70" r="3" fill="url(#grad1)" />
          <Circle cx="75" cy="70" r="3" fill="url(#grad1)" />
          <Circle cx="60" cy="85" r="3" fill="url(#grad1)" />
          
          {/* Connections */}
          <Path
            d="M40,45 L60,35 L80,45 M40,45 L45,70 M80,45 L75,70 M45,70 L60,85 M75,70 L60,85"
            stroke="url(#grad1)"
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
          />
        </G>
        
        {/* Focus indicator corners */}
        <Path
          d="M30,30 L30,40 M30,30 L40,30"
          stroke="url(#grad1)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <Path
          d="M90,30 L90,40 M90,30 L80,30"
          stroke="url(#grad1)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <Path
          d="M30,90 L30,80 M30,90 L40,90"
          stroke="url(#grad1)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <Path
          d="M90,90 L90,80 M90,90 L80,90"
          stroke="url(#grad1)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
