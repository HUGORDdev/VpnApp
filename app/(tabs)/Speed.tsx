import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Wrapper from '@/components/Wrapper';
import { RotatingLoader } from '../../components/AnimationComponents';

const { width, height } = Dimensions.get('window');

const Speed = () => {
  // ============ ÉTATS ============
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testPhase, setTestPhase] = useState<
    'idle' | 'download' | 'upload' | 'ping' | 'complete'
  >('idle');

  // Vitesses mesurées
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [pingSpeed, setPingSpeed] = useState(0);

  // ============ ANIMATIONS ============
  const gaugeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // ============ RÉFÉRENCES ============
  const testIntervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Lance le test de vitesse
   * Simule un test réaliste avec 3 phases
   */
  const startSpeedTest = () => {
    setIsTestRunning(true);
    setDownloadSpeed(0);
    setUploadSpeed(0);
    setPingSpeed(0);

    // Phase 1: Download (2.5 secondes)
    setTestPhase('download');
    let downloadProgress = 0;
    const downloadInterval = setInterval(() => {
      downloadProgress += Math.random() * 20;
      if (downloadProgress >= 100) {
        setDownloadSpeed(87.5);
        clearInterval(downloadInterval);

        // Phase 2: Upload (2.5 secondes)
        setTestPhase('upload');
        let uploadProgress = 0;
        const uploadInterval = setInterval(() => {
          uploadProgress += Math.random() * 18;
          if (uploadProgress >= 100) {
            setUploadSpeed(45.3);
            clearInterval(uploadInterval);

            // Phase 3: Ping (1 seconde)
            setTestPhase('ping');
            let pingProgress = 0;
            const pingInterval = setInterval(() => {
              pingProgress += Math.random() * 50;
              if (pingProgress >= 100) {
                setPingSpeed(12);
                setTestPhase('complete');
                setIsTestRunning(false);
                clearInterval(pingInterval);

                // Anime la jauge jusqu'au bout
                Animated.timing(gaugeAnim, {
                  toValue: 1,
                  duration: 500,
                  useNativeDriver: true,
                }).start();
              } else {
                setPingSpeed(pingProgress);
                Animated.timing(gaugeAnim, {
                  toValue: 0.6 + pingProgress / 500,
                  duration: 100,
                  useNativeDriver: true,
                }).start();
              }
            }, 100);
          } else {
            setUploadSpeed((uploadProgress * 45.3) / 100);
            Animated.timing(gaugeAnim, {
              toValue: 0.4 + uploadProgress / 500,
              duration: 100,
              useNativeDriver: true,
            }).start();
          }
        }, 100);
      } else {
        setDownloadSpeed((downloadProgress * 87.5) / 100);
        Animated.timing(gaugeAnim, {
          toValue: downloadProgress / 500,
          duration: 100,
          useNativeDriver: true,
        }).start();
      }
    }, 100);
  };

  /**
   * Lance l'animation de rotation du loader
   */
  const startRotationAnimation = () => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  };

  /**
   * Arrête les animations
   */
  const stopAnimations = () => {
    if (testIntervalRef.current) {
      clearInterval(testIntervalRef.current);
    }
    rotateAnim.setValue(0);
  };

  /**
   * Réinitialise le test
   */
  const resetTest = () => {
    stopAnimations();
    setTestPhase('idle');
    setDownloadSpeed(0);
    setUploadSpeed(0);
    setPingSpeed(0);
    gaugeAnim.setValue(0);
  };

  /**
   * Nettoyage au démontage
   */
  useEffect(() => {
    return () => {
      stopAnimations();
    };
  }, []);

  // ============ INTERPOLATIONS ============
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Convertir 0-1 en 0-360 pour la jauge
  const gaugeRotate = gaugeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // ============ RENDU ============
  return (
    <Wrapper >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Pressable>
            <AntDesign name="left" size={24} color="white" />
          </Pressable>
          <Text style={styles.headerTitle}>Speed Test</Text>
          <Pressable>
            <MaterialCommunityIcons name="information-outline" size={24} color="white" />
          </Pressable>
        </View>

        <View style={styles.gaugeContainer}>
          <View style={styles.gaugeBg}>
            {isTestRunning && (
              <Animated.View
                style={[
                  styles.gaugeProgress,
                  {
                    transform: [{ rotate: gaugeRotate }],
                  },
                ]}
              />
            )}

            <View style={styles.gaugeContent}>
              {isTestRunning && testPhase !== 'complete' ? (
                <View style={styles.testingContainer}>
                  <Text style={styles.testingText}>
                    {testPhase === 'download' && 'Testing Download...'}
                    {testPhase === 'upload' && 'Testing Upload...'}
                    {testPhase === 'ping' && 'Testing Ping...'}
                  </Text>
                </View>
              ) : (
                <View style={styles.speedValue}>
                  <Text style={styles.mainSpeed}>
                    {downloadSpeed.toFixed(1)}
                  </Text>
                  <Text style={styles.speedUnit}>Mbps</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="wifi-strength-1" size={20} color="#2E5BFF" />
              </View>
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Ping</Text>
                <Text style={styles.detailValue}>{pingSpeed.toFixed(0)} ms</Text>
              </View>
            </View>

            <View style={styles.flagContainer}>
              <Text style={styles.flagEmoji}>🇺🇸</Text>
              <Text style={styles.flagText}>United States</Text>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="pulse" size={20} color="#2E5BFF" />
              </View>
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Jitter</Text>
                <Text style={styles.detailValue}>
                  {Math.max(0, pingSpeed * 0.1).toFixed(1)} ms
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.speedRow}>
            <View style={styles.speedBox}>
              <View style={styles.speedBoxHeader}>
                <MaterialCommunityIcons name="download" size={20} color="#00FF00" />
                <Text style={styles.speedBoxLabel}>Download</Text>
              </View>
              <Text style={styles.speedBoxValue}>
                {downloadSpeed.toFixed(1)}
              </Text>
              <Text style={styles.speedBoxUnit}>Mbps</Text>
            </View>

            <View style={styles.speedBox}>
              <View style={styles.speedBoxHeader}>
                <MaterialCommunityIcons name="upload" size={20} color="#FF6B6B" />
                <Text style={styles.speedBoxLabel}>Upload</Text>
              </View>
              <Text style={styles.speedBoxValue}>
                {uploadSpeed.toFixed(1)}
              </Text>
              <Text style={styles.speedBoxUnit}>Mbps</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionContainer}>
          {isTestRunning ? (
            <Pressable
              onPress={resetTest}
              style={[styles.button, styles.stopButton]}
            >
              <Text style={styles.buttonText}>Stop Test</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={startSpeedTest}
              style={[styles.button, styles.startButton]}
            >
              <Text style={styles.buttonText}>
                {testPhase === 'idle' ? 'Request Connection' : 'Test Again'}
              </Text>
            </Pressable>
          )}
        </View>

        {testPhase === 'complete' && (
          <View style={styles.infoBox}>
            <View style={styles.infoHeader}>
              <MaterialCommunityIcons name="check-circle" size={24} color="#2ED573" />
              <Text style={styles.infoTitle}>Test Complete</Text>
            </View>
            <Text style={styles.infoText}>
              Your connection is excellent! You can stream 4K videos without buffering.
            </Text>
          </View>
        )}

        <View style={styles.spacing} />
      </ScrollView>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  // ========== LAYOUT PRINCIPAL ==========
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  spacing: {
    height: 30,
  },

  // ========== HEADER ==========
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },

  // ========== JAUGE CIRCULAIRE ==========
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  gaugeBg: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#1F2235',
    borderWidth: 3,
    borderColor: '#2E5BFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2E5BFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
    overflow: 'hidden',
  },
  gaugeProgress: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 12,
    borderColor: '#2E5BFF',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  gaugeContent: {
    zIndex: 10,
    alignItems: 'center',
  },
  speedValue: {
    alignItems: 'center',
  },
  mainSpeed: {
    fontSize: 64,
    fontWeight: '700',
    color: '#2E5BFF',
  },
  speedUnit: {
    fontSize: 18,
    color: '#94A3B8',
    marginTop: 4,
  },
  testingContainer: {
    alignItems: 'center',
    gap: 12,
  },
  testingText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  largeEmoji: {
    fontSize: 40,
  },

  // ========== DÉTAILS DU TEST ==========
  detailsContainer: {
    marginVertical: 20,
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1F2235',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2E5BFF',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(46, 91, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailInfo: {
    gap: 2,
  },
  detailLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
  },
  detailValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  flagContainer: {
    alignItems: 'center',
    gap: 4,
  },
  flagEmoji: {
    fontSize: 32,
  },
  flagText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '500',
  },

  // ========== SPEED BOXES ==========
  speedRow: {
    flexDirection: 'row',
    gap: 12,
  },
  speedBox: {
    flex: 1,
    backgroundColor: '#1F2235',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2E5BFF',
    alignItems: 'center',
  },
  speedBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  speedBoxLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  speedBoxValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2E5BFF',
  },
  speedBoxUnit: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
  },

  // ========== BOUTONS ==========
  actionContainer: {
    marginVertical: 20,
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    elevation: 10,
    borderWidth: 1,
  },
  startButton: {
    backgroundColor: '#1F2235',
  },
  stopButton: {
    backgroundColor: '#ff4757',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },

  // ========== INFO BOX ==========
  infoBox: {
    backgroundColor: '#1F2235',
    borderWidth: 1,
    borderColor: '#2ED573',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoTitle: {
    color: '#2ED573',
    fontSize: 16,
    fontWeight: '700',
  },
  infoText: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default Speed;