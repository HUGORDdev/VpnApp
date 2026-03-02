import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface Props {
  size: number
}

export default function CircularNumbers({ size }: Props) {
  const numbers = [0, 20, 40, 60, 80, 100]
  const radius = size / 2 - 35 // marge interne importante

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size },
      ]}
    >
      {numbers.map((num, index) => {
        const angle = (index / numbers.length) * 360

        return (
          <View
            key={index}
            style={[
              styles.numberWrapper,
              {
                transform: [
                  { rotate: `${angle}deg` },
                  { translateY: -radius },
                  { rotate: `-${angle}deg` },
                ],
              },
            ]}
          >
            <Text style={styles.numberText}>{num}</Text>
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberWrapper: {
    position: 'absolute',
  },
  numberText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '600',
  },
})