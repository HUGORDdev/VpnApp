import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Animated,
  Image
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Wrapper from '@/components/Wrapper';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import CircularTicks from '@/components/CircularTicks';

const { width, height } = Dimensions.get('window');


const Home = () => {
  // ============ ÉTATS ============
  const [isConnected, setIsConnected] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [isSpeedTesting, setIsSpeedTesting] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // ============ ANIMATIONS ============

  const pulseAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Animation de glow (lueur) autour du bouton
  const glowAnim = useRef(new Animated.Value(0)).current;

  // ============ RÉFÉRENCES ============
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const speedTestIntervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Lance l'animation de pulsation
   * Crée un effet de vague qui s'étend à partir du bouton
   */
  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        // Expansion (0 à 1)
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        // Retour instantané (1 à 0)
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  /**
   * Lance l'animation de rotation du bouton
   * Effet de chargement lors de la connexion
   */
  const startRotationAnimation = () => {
    rotateAnim.setValue(0);
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  };

  /**
   * Lance l'animation de glow (lueur brillante)
   */

  /**
   * Arrête toutes les animations
   */
  const stopAllAnimations = () => {
    pulseAnim.setValue(0);
    rotateAnim.setValue(0);
    glowAnim.setValue(0);
  };

  /**
   * Simule un test de vitesse avec progression réaliste
   * Augmente graduellement les valeurs de download/upload
   */
  const simulateSpeedTest = () => {
    setDownloadSpeed(0);
    setUploadSpeed(0);
    setIsSpeedTesting(true);

    let progress = 0;
    speedTestIntervalRef.current = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        setDownloadSpeed(36.5);
        setUploadSpeed(36.5);
        setIsSpeedTesting(false);
        if (speedTestIntervalRef.current) {
          clearInterval(speedTestIntervalRef.current);
        }
      } else {
        setDownloadSpeed(Math.min(progress * 0.4, 36.5));
        setUploadSpeed(Math.min(progress * 0.35, 36.5));
      }
    }, 100);
  };

  /**
   * Gère la connexion/déconnexion au VPN
   * Lance les animations appropriées
   */
  const toggleConnection = () => {
    const newConnectionState = !isConnected;
    setIsConnected(newConnectionState);

    if (newConnectionState) {
      startPulseAnimation();
      simulateSpeedTest();
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      stopAllAnimations();
      setDownloadSpeed(0);
      setUploadSpeed(0);
      setTimerSeconds(0);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  /**
   * Formate les secondes en format HH:MM:SS
   */
  const formatTimer = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}.${String(minutes).padStart(2, '0')}.${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (speedTestIntervalRef.current) {
        clearInterval(speedTestIntervalRef.current);
      }
    };
  }, []);

  return (
    <Wrapper>
      <Image
        source={require('./../../assets/images/word.png')}
        style={styles.worldMap}
        resizeMode="contain"
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.iconCircle}>
            <AntDesign name="menu" size={24} color="white" />
          </Pressable>
          <View style={styles.headerRight}>
            <Pressable style={styles.premiumBtn}>
              <MaterialCommunityIcons name="crown" size={20} color="black" />
              <Text style={styles.premiumText}>Premium</Text>
            </Pressable>
            <Pressable style={styles.iconCircle}>
              <MaterialIcons name="speed" size={24} color="white" />
            </Pressable>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>
            {isConnected ? 'Secure Connection' : 'Not Connected'}
          </Text>
          <Text style={styles.timer}>
            {isConnected ? formatTimer(timerSeconds) : '00.00.00'}
          </Text>
          <Pressable style={styles.countryPicker}>
            <Text style={styles.countryText}>🇺🇸 United States</Text>
            <AntDesign name="down" size={12} color="white" />
          </Pressable>
        </View>

        <View style={styles.buttonWrapper}>

          <Pressable
            // onPress={toggleConnection}
            style={[
              styles.mainButton,
              isConnected && styles.mainButtonActive,
            ]}
            >
          <CircularTicks isConnected={isConnected} >
            </CircularTicks>
            <View style={styles.innerCircle}>
              <MaterialCommunityIcons
                name="power"
                size={60}
                color={isConnected ? '#2E5BFF' : 'white'}
                />
            </View>
          </Pressable>

          <Text style={styles.tapText}>
            {isConnected ? 'Connected' : 'Tap to Connect'}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>DOWNLOAD <MaterialIcons name="keyboard-double-arrow-down" size={16} color="white" /> </Text>
            {isSpeedTesting ? (
              <Text style={styles.statValue}>{downloadSpeed.toFixed(1)} Mb/s</Text>
            ) : (
              <Text style={styles.statValue}>
                {isConnected ? downloadSpeed.toFixed(1) : '0.0'} Mb/s
              </Text>
            )}
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>UPLOAD <MaterialIcons name="keyboard-double-arrow-down" size={16} color="white" /> </Text>
            {isSpeedTesting ? (
              <Text style={styles.statValue}>{uploadSpeed.toFixed(1)} Mb/s</Text>
            ) : (
              <Text style={styles.statValue}>
                {isConnected ? uploadSpeed.toFixed(1) : '0.0'} Mb/s
              </Text>
            )}
          </View>
        </View>
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  // ========== LAYOUT PRINCIPAL ==========
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  worldMap: {
    position: 'absolute',
    width: width * 1.5,
    height: height * 0.9,
    bottom: - height * 0.5,
    left: -width * 0.25,
    opacity: 0.1,
    tintColor: '#FFFFFF',
  },

  // ========== HEADER ==========
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  premiumBtn: {
    flexDirection: 'row',
    backgroundColor: '#FFD700',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: 'center',
    gap: 5,
  },
  premiumText: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 14,
  },
  iconCircle: {
    backgroundColor: '#1F2235',
    padding: 10,
    borderRadius: 50,
  },

  // ========== STATUT ET TIMER ==========
  statusContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  statusLabel: {
    color: '#94A3B8',
    fontSize: 16,
  },
  timer: {
    color: 'white',
    fontSize: 52,
    fontWeight: '700',
    marginVertical: 10,
    letterSpacing: 2,
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1F2235',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  countryText: {
    color: 'white',
    fontWeight: '500',
  },

  // ========== BOUTON CENTRAL ==========
  buttonWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },


  // Bouton principal
  mainButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#161616',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 8,
    elevation: 3,
    borderColor: '#0A0E17',
    // zIndex: 10,
  },

  // État actif du bouton (connecté)
  mainButtonActive: {
    borderColor: '#2E5BFF',
    shadowColor: '#2E5BFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 25,
    elevation: 20,
  },

  // Cercle intérieur du bouton
  innerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1b1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6
  },

  // Texte sous le bouton
  tapText: {
    color: 'white',
    marginTop: 30,
    fontSize: 18,
    fontWeight: '600',
  },

  // ========== STATISTIQUES ==========
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderRadius: 20,
    gap: 10
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#0A0E17',
    padding: 10,
    borderRadius: 20,
    elevation: 2
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '500',
  },
  statValue: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
  },
});

export default Home;