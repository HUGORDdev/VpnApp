import { StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    
      <SafeAreaView style={styles.safeArea}>
        {children}
      </SafeAreaView>
  );
};

export default Wrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor:'#0A0E17'
  }
});