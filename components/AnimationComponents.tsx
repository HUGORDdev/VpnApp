import React, { useRef, useEffect } from 'react';
import { Animated, View, StyleSheet, Pressable } from 'react-native';

/**
 * 🌊 COMPOSANT: Pulsation (Pulse Effect)
 * 
 * Crée un cercle qui s'agrandit et disparaît en boucle
 * Idéal pour montrer l'activité ou la transmission de données
 */
interface PulseEffectProps {
  isActive: boolean;
  size?: number;
  color?: string;
  duration?: number;
}

export const PulseEffect: React.FC<PulseEffectProps> = ({
  isActive,
  size = 200,
  color = 'rgba(46, 91, 255, 0.25)',
  duration = 1500,
}) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(0);
    }
  }, [isActive]);

  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.8],
  });

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0],
  });

  return (
    <Animated.View
      style={[
        styles.pulse,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          transform: [{ scale }],
          opacity,
        },
      ]}
    />
  );
};

/**
 * 💡 COMPOSANT: Glow Effect
 * 
 * Crée un halo brillant qui clignote doucement
 * Idéal pour attirer l'attention sur le bouton principal
 */
interface GlowEffectProps {
  isActive: boolean;
  size?: number;
  color?: string;
  shadowRadius?: number;
}

export const GlowEffect: React.FC<GlowEffectProps> = ({
  isActive,
  size = 160,
  color = '#2E5BFF',
  shadowRadius = 30,
}) => {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      glowAnim.setValue(0);
    }
  }, [isActive]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.8],
  });

  return (
    <Animated.View
      style={[
        styles.glow,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity: glowOpacity,
          shadowColor: color,
          shadowRadius,
        },
      ]}
    />
  );
};

/**
 * 🔄 COMPOSANT: Rotating Loader
 * 
 * Crée un élément qui tourne continuellement
 * Idéal pour montrer qu'une action est en cours
 */
interface RotatingLoaderProps {
  isActive: boolean;
  size?: number;
  duration?: number;
  children?: React.ReactNode;
}

export const RotatingLoader: React.FC<RotatingLoaderProps> = ({
  isActive,
  size = 50,
  duration = 2000,
  children,
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotateAnim.setValue(0);
    }
  }, [isActive]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        transform: [{ rotate: rotateInterpolate }],
      }}
    >
      {children}
    </Animated.View>
  );
};

/**
 * 📊 COMPOSANT: Animated Counter
 * 
 * Anime l'augmentation d'une valeur numérique
 * Idéal pour les statistiques (vitesse, temps, etc.)
 */
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  precision?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1000,
  precision = 1,
}) => {
  const countAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(countAnim, {
      toValue: value,
      duration,
      useNativeDriver: false,
    }).start();
  }, [value]);

  return (
    <Animated.Text
      style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
      }}
    >
      {countAnim.interpolate({
        inputRange: [0, value],
        outputRange: ['0', value.toFixed(precision)],
      })}
    </Animated.Text>
  );
};

/**
 * 👆 COMPOSANT: Pressable avec Spring Animation
 * 
 * Un bouton qui réagit avec une animation ressort quand on appuie
 */
interface PressableWithSpringProps {
  onPress: () => void;
  children: React.ReactNode;
  style?: any;
}

export const PressableWithSpring: React.FC<PressableWithSpringProps> = ({
  onPress,
  children,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      speed: 20,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      speed: 20,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={style}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

/**
 * 🌈 COMPOSANT: Fade In/Out
 * 
 * Anime l'apparition/disparition d'un élément
 */
interface FadeInOutProps {
  isVisible: boolean;
  duration?: number;
  children: React.ReactNode;
}

export const FadeInOut: React.FC<FadeInOutProps> = ({
  isVisible,
  duration = 500,
  children,
}) => {
  const fadeAnim = useRef(new Animated.Value(isVisible ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isVisible ? 1 : 0,
      duration,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {children}
    </Animated.View>
  );
};

/**
 * 📈 COMPOSANT: Slide Animation
 * 
 * Anime un élément qui glisse depuis un côté
 */
interface SlideAnimationProps {
  isVisible: boolean;
  direction?: 'left' | 'right' | 'up' | 'down';
  distance?: number;
  duration?: number;
  children: React.ReactNode;
}

export const SlideAnimation: React.FC<SlideAnimationProps> = ({
  isVisible,
  direction = 'left',
  distance = 100,
  duration = 500,
  children,
}) => {
  const slideAnim = useRef(
    new Animated.Value(isVisible ? 0 : distance)
  ).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : distance,
      duration,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  const getTransform = () => {
    switch (direction) {
      case 'left':
        return { translateX: slideAnim };
      case 'right':
        return { translateX: slideAnim.interpolate({
          inputRange: [0, distance],
          outputRange: [0, distance],
        })};
      case 'up':
        return { translateY: slideAnim };
      case 'down':
        return { translateY: slideAnim.interpolate({
          inputRange: [0, distance],
          outputRange: [0, distance],
        })};
      default:
        return { translateX: slideAnim };
    }
  };

  return (
    <Animated.View style={{ transform: [getTransform()] }}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  pulse: {
    position: 'absolute',
  },
  glow: {
    position: 'absolute',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    elevation: 20,
  },
});

export default {
  PulseEffect,
  GlowEffect,
  RotatingLoader,
  AnimatedCounter,
  PressableWithSpring,
  FadeInOut,
  SlideAnimation,
};