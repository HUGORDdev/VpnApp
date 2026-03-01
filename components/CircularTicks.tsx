import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Line } from 'react-native-svg';

const CircularTicks = ({ isConnected,child }: { isConnected: boolean,child:ReactNode }) => {
  const totalTicks = 60; // Nombre de traits autour du cercle
  const radius = 100;    // Rayon du cercle de traits
  const centerX = 110;   // Centre du SVG
  const centerY = 110;
  const tickLength = 10; // Longueur de chaque petit trait

  const ticks = Array.from({ length: totalTicks }).map((_, i) => {
    const angle = (i * 360) / totalTicks;
    const angleRad = (angle * Math.PI) / 180;

    // Point de départ (proche du bouton)
    const x1 = centerX + (radius - tickLength) * Math.cos(angleRad);
    const y1 = centerY + (radius - tickLength) * Math.sin(angleRad);

    // Point d'arrivée (vers l'extérieur)
    const x2 = centerX + radius * Math.cos(angleRad);
    const y2 = centerY + radius * Math.sin(angleRad);

    return (
      <Line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isConnected ? "#2E5BFF" : "#1F2235"} // Bleu si connecté, gris sinon
        strokeWidth="2"
        strokeLinecap="round"
        opacity={isConnected ? (i % 2 === 0 ? 1 : 0.4) : 0.3} // Effet de rythme visuel
      />
    );
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg height="220" width="220" viewBox="0 0 220 220">
        {ticks}
        {child}
      </Svg>
    </View>
  );
};

export default CircularTicks;