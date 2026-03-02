import React from 'react'
import { Text, Pressable, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring
} from 'react-native-reanimated'
import { BlurView } from 'expo-blur'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

interface Props {
    title: string
    onPress?: () => void
}

export default function PremiumButton({ title, onPress }: Props) {
    const scale = useSharedValue(1)

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }))

    return (
        <AnimatedPressable
            onPressIn={() => (scale.value = withSpring(0.97))}
            onPressOut={() => (scale.value = withSpring(1))}
            onPress={onPress}
            style={[styles.glowWrapper, animatedStyle]}
        >
            <BlurView intensity={40} tint="dark" style={styles.blur}>

                {/* Glow Border */}
                <LinearGradient
                    colors={['#3B82F6', '#1E3A8A', '#3B82F6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.borderGradient}
                >
                    {/* Inner Background */}
                    <LinearGradient
                        colors={['#0F172A', '#111827']}
                        style={styles.innerContainer}
                    >
                        <Text style={styles.text}>{title}</Text>
                    </LinearGradient>
                </LinearGradient>
            </BlurView>
        </AnimatedPressable>
    )
}

const styles = StyleSheet.create({
    glowWrapper: {
        borderRadius: 20,
        // shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        elevation: 20,
    },
    blur: {
        borderRadius: 20,
    },
    borderGradient: {
        padding: 2,
        borderRadius: 20,
    },
    innerContainer: {
        paddingVertical: 16,
        borderRadius: 18,
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
})