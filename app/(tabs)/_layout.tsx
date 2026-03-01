import { Tabs } from "expo-router";
import { View, StyleSheet } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#1a2a4e',
          borderTopWidth: 0,
          height: 80, // On augmente un peu la hauteur
          paddingBottom: 10,
        },
        tabBarActiveTintColor: '#2E5BFF',
        tabBarInactiveTintColor: '#aaa',
      }}
    >
      <Tabs.Screen name="Home" options={{
        headerShown: false,
        tabBarIcon: ({focused}) => <Feather name="home" size={24} color={focused ? "#2E5BFF" : "#aaa"} />
      }} />
      
      <Tabs.Screen name="Server" options={{
        headerShown: false,
        tabBarIcon: ({focused}) => <Fontisto name="world-o" size={24} color={focused ? "#2E5BFF" : "#aaa"} />
      }} />

      <Tabs.Screen name="Speed" options={{
        headerShown: false,
        tabBarLabel: '', 
        tabBarIcon: ({focused}) => (
          <View style={styles.centerButton}>
            <Ionicons name="speedometer-outline" size={32} color="white" />
          </View>
        ),
      }} />
      
      <Tabs.Screen name="Prenium" options={{
          headerShown: false,
          tabBarIcon: ({focused}) => <MaterialCommunityIcons name="crown-outline" size={24} color={focused ? "#2E5BFF" : "#aaa"} />
      }} />

      <Tabs.Screen name="Profile" options={{
        headerShown: false,
        tabBarIcon: ({focused}) => <Feather name="user" size={24} color={focused ? "#2E5BFF" : "#aaa"} />
      }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  centerButton: {
    width: 80,
    height: 80,
    backgroundColor: '#2E5BFF',
    borderRadius: 40, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30, 
    shadowColor: "#2E5BFF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    // elevation: 5, // Pour Android
  }
});