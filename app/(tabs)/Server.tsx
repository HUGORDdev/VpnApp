import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Animated,
  FlatList,
  TextInput,
  ScrollView,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Wrapper from '@/components/Wrapper';
import { FadeInOut } from './../../components/AnimationComponents';
import { servers } from '@/components/Constant';

const { width } = Dimensions.get('window');

/**
 * Interface pour les données de serveur
 */
export interface ServerData {
  id: string;
  country: string;
  flag: string;
  city: string;
  locations: number;
  ping: number;
  status: 'available' | 'slow' | 'recommended';
}

const Server = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'recommended' | 'global'>(
    'recommended'
  );
  const [selectedServerId, setSelectedServerId] = useState('us-1');
  const [filteredServers, setFilteredServers] = useState<ServerData[]>([]);

  

  const fadeAnim = useRef(new Animated.Value(0)).current;

  /**
   * Filtre les serveurs selon la recherche et le tab
   */
  useEffect(() => {
    let filtered = servers;

    // Filter par tab
    if (selectedTab === 'recommended') {
      filtered = filtered.filter((s) => s.status === 'recommended');
    }

    // Filter par recherche
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (s) =>
          s.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setFilteredServers(filtered);
  }, [searchQuery, selectedTab]);

  const handleSelectServer = (serverId: string) => {
    setSelectedServerId(serverId);
  };

  /**
   * Affiche un badge de statut
   */
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'recommended':
        return {
          icon: 'star',
          label: 'Recommended',
          color: '#FFD700',
        };
      case 'slow':
        return {
          icon: 'alert-circle',
          label: 'Slow',
          color: '#FF6B6B',
        };
      default:
        return {
          icon: 'check-circle',
          label: 'Available',
          color: '#2ED573',
        };
    }
  };

  /**
   * Rendu d'un item serveur
   */
  const renderServerItem = ({ item }: { item: ServerData }) => {
    const isSelected = selectedServerId === item.id;
    const statusBadge = getStatusBadge(item.status);

    return (
      <Pressable
        onPress={() => handleSelectServer(item.id)}
        style={[
          styles.serverItem,
          isSelected && styles.serverItemSelected,
        ]}
      >
        <View style={styles.serverLeft}>
          <Text style={styles.flagEmoji}>{item.flag}</Text>
          <View style={styles.serverInfo}>
            <Text style={styles.serverCountry}>{item.country}</Text>
            <View style={styles.serverMeta}>
              <MaterialCommunityIcons
                name="map-marker"
                size={12}
                color="#94A3B8"
              />
              <Text style={styles.serverCity}>{item.city}</Text>
              <Text style={styles.serverDot}>•</Text>
              <Text style={styles.serverLocations}>
                {item.locations} Locations
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.serverRight}>
          <View
            style={[
              styles.statusBadge,
              { borderColor: statusBadge.color },
            ]}
          >
            <MaterialCommunityIcons
              name={statusBadge.icon as any}
              size={12}
              color={statusBadge.color}
            />
            <Text style={[styles.statusText, { color: statusBadge.color }]}>
              {statusBadge.label}
            </Text>
          </View>

          <View style={styles.pingContainer}>
            <Text style={styles.pingLabel}>Ping</Text>
            <Text style={styles.pingValue}>{item.ping}ms</Text>
          </View>

          <Pressable
            style={[
              styles.connectBtn,
              isSelected && styles.connectBtnActive,
            ]}
          >
            {isSelected ? (
              <MaterialCommunityIcons
                name="check-circle"
                size={20}
                color="#2E5BFF"
              />
            ) : (
              <MaterialCommunityIcons
                name="plus-circle-outline"
                size={20}
                color="#94A3B8"
              />
            )}
          </Pressable>
        </View>
      </Pressable>
    );
  };

  return (
    <Wrapper>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable>
            <AntDesign name="arrow-left" size={24} color="white" />
          </Pressable>
          <Text style={styles.headerTitle}>Select server</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.searchContainer}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color="#94A3B8"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search countries..."
            placeholderTextColor="#5A6B7A"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          {searchQuery.trim() && (
            <Pressable
              onPress={() => setSearchQuery('')}
              style={styles.clearBtn}
            >
              <AntDesign name="close" size={18} color="#94A3B8" />
            </Pressable>
          )}
        </View>

        <View style={styles.tabsContainer}>
          <Pressable
            onPress={() => setSelectedTab('recommended')}
            style={[
              styles.tab,
              selectedTab === 'recommended' && styles.tabActive,
            ]}
          >
            <MaterialCommunityIcons
              name="star"
              size={16}
              color={selectedTab === 'recommended' ? '#2E5BFF' : '#94A3B8'}
            />
            <Text
              style={[
                styles.tabText,
                selectedTab === 'recommended' && styles.tabTextActive,
              ]}
            >
              Recommended
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setSelectedTab('global')}
            style={[
              styles.tab,
              selectedTab === 'global' && styles.tabActive,
            ]}
          >
            <MaterialCommunityIcons
              name="earth"
              size={16}
              color={selectedTab === 'global' ? '#2E5BFF' : '#94A3B8'}
            />
            <Text
              style={[
                styles.tabText,
                selectedTab === 'global' && styles.tabTextActive,
              ]}
            >
              Global
            </Text>
          </Pressable>
        </View>

        <Animated.View style={{ opacity: fadeAnim }}>
          <FlatList
            data={filteredServers}
            renderItem={renderServerItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="magnify"
                  size={48}
                  color="#94A3B8"
                />
                <Text style={styles.emptyStateText}>
                  No servers found for "{searchQuery}"
                </Text>
              </View>
            }
          />
        </Animated.View>

        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="lightbulb-on"
              size={20}
              color="#FFD700"
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Smart Selection</Text>
              <Text style={styles.infoText}>
                Enable auto-selection to automatically connect to the best
                server based on your location.
              </Text>
            </View>
          </View>

          <Pressable style={styles.autoSelectBtn}>
            <MaterialCommunityIcons
              name="auto-fix"
              size={16}
              color="white"
            />
            <Text style={styles.autoSelectText}>Enable Auto Selection</Text>
          </Pressable>
        </View>

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
  headerSpacer: {
    width: 24,
  },

  // ========== RECHERCHE ==========
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2235',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
    borderWidth: 1,
    // borderColor: '#2E5BFF',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    paddingVertical: 12,
  },
  clearBtn: {
    padding: 8,
  },

  // ========== TABS ==========
  tabsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#1F2235',
    borderWidth: 1,
    // borderColor: '#2E5BFF',
    gap: 6,
  },
  tabActive: {
    backgroundColor: 'rgba(46, 91, 255, 0.15)',
    borderColor: '#2E5BFF',
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#2E5BFF',
  },

  // ========== LISTE DES SERVEURS ==========
  listContainer: {
    gap: 8,
    marginBottom: 20,
  },
  serverItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1F2235',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    // borderColor: '#2E5BFF',
  },
  serverItemSelected: {
    backgroundColor: 'rgba(46, 91, 255, 0.15)',
    borderColor: '#2E5BFF',
  },
  serverLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flagEmoji: {
    fontSize: 32,
  },
  serverInfo: {
    flex: 1,
    gap: 4,
  },
  serverCountry: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  serverMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  serverCity: {
    color: '#94A3B8',
    fontSize: 12,
  },
  serverDot: {
    color: '#94A3B8',
  },
  serverLocations: {
    color: '#94A3B8',
    fontSize: 12,
  },
  serverRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  pingContainer: {
    alignItems: 'center',
  },
  pingLabel: {
    color: '#94A3B8',
    fontSize: 10,
  },
  pingValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  connectBtn: {
    padding: 8,
  },
  connectBtnActive: {
    backgroundColor: 'rgba(46, 91, 255, 0.2)',
    borderRadius: 8,
  },
  separator: {
    height: 8,
  },

  // ========== STATE VIDE ==========
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyStateText: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
  },

  // ========== INFO BOX ==========
  infoBox: {
    backgroundColor: '#1F2235',
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  infoContent: {
    flex: 1,
    gap: 4,
  },
  infoTitle: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '700',
  },
  infoText: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 16,
  },
  autoSelectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E5BFF',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  autoSelectText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default Server;