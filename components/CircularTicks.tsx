import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';

type Props = {
  isConnected: boolean;
  size?: number;
};

const CircularTicks: React.FC<Props> = ({ isConnected, size = 180 }) => {
  const totalTicks = 60; 
  const outerDiameter = size; 
  const center = outerDiameter / 2;
  const tickLength = Math.max(6, Math.round(size * 0.06));
  const radius = center - 8; 
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isConnected) {
      rotateAnim.setValue(0);
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotateAnim.stopAnimation();
      rotateAnim.setValue(0);
    }
  }, [isConnected, rotateAnim]);

  const ticks = Array.from({ length: totalTicks }).map((_, i) => {
    const angle = (i * 360) / totalTicks;
    const angleRad = (angle * Math.PI) / 180;

    const x1 = center + (radius - tickLength) * Math.cos(angleRad);
    const y1 = center + (radius - tickLength) * Math.sin(angleRad);
    const x2 = center + radius * Math.cos(angleRad);
    const y2 = center + radius * Math.sin(angleRad);

    return (
      <Line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isConnected ? '#2E5BFF' : '#1F2235'}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={isConnected ? (i % 2 === 0 ? 1 : 0.45) : 0.25}
      />
    );
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Svg height={outerDiameter} width={outerDiameter} viewBox={`0 0 ${outerDiameter} ${outerDiameter}`}>
          {ticks}
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CircularTicks;