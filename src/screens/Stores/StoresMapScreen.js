// src/screens/Stores/StoresMapScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Linking,
  ScrollView,
  Platform,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { COLORS, FONTS, SPACING } from '../../utils';
import { WYDAD_STORES, CASABLANCA_REGION } from '../../data/wydadStores';

export default function StoresMapScreen({ navigation }) {
  const [selectedStore, setSelectedStore] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(CASABLANCA_REGION);

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    } catch (error) {
      console.log('Error getting location:', error);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance.toFixed(1);
  };

  const openNavigation = (store) => {
    const { latitude, longitude } = store.coordinates;
    const label = encodeURIComponent(store.name);
    
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${label})`,
    });

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // Fallback vers Google Maps web
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`);
      }
    });
  };

  const callStore = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const getStoreIcon = (type) => {
    switch (type) {
      case 'flagship':
        return 'storefront';
      case 'boutique':
        return 'basket';
      case 'corner':
        return 'cube';
      default:
        return 'location';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Boutiques Wydad</Text>
        <TouchableOpacity onPress={getUserLocation} style={styles.locationButton}>
          <Ionicons name="locate" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={mapRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {WYDAD_STORES.map((store) => (
          <Marker
            key={store.id}
            coordinate={store.coordinates}
            onPress={() => setSelectedStore(store)}
          >
            <View style={styles.markerContainer}>
              <View style={styles.marker}>
                <Ionicons name={getStoreIcon(store.type)} size={20} color={COLORS.white} />
              </View>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Store List */}
      <View style={styles.storeListContainer}>
        <Text style={styles.listTitle}>
          {WYDAD_STORES.length} Boutiques à Casablanca
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storeList}
        >
          {WYDAD_STORES.map((store) => (
            <TouchableOpacity
              key={store.id}
              style={[
                styles.storeCard,
                selectedStore?.id === store.id && styles.storeCardActive,
              ]}
              onPress={() => setSelectedStore(store)}
            >
              <View style={styles.storeCardHeader}>
                <Ionicons 
                  name={getStoreIcon(store.type)} 
                  size={24} 
                  color={COLORS.primary} 
                />
                <Text style={styles.storeName}>{store.name}</Text>
              </View>
              
              <View style={styles.storeInfo}>
                <Ionicons name="location-outline" size={16} color={COLORS.textSecondary} />
                <Text style={styles.storeAddress} numberOfLines={1}>
                  {store.address}
                </Text>
              </View>

              <View style={styles.storeInfo}>
                <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
                <Text style={styles.storeHours}>{store.hours}</Text>
              </View>

              {userLocation && (
                <View style={styles.storeInfo}>
                  <Ionicons name="navigate-outline" size={16} color={COLORS.accent} />
                  <Text style={styles.storeDistance}>
                    {calculateDistance(
                      userLocation.latitude,
                      userLocation.longitude,
                      store.coordinates.latitude,
                      store.coordinates.longitude
                    )} km
                  </Text>
                </View>
              )}

              <View style={styles.storeActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => callStore(store.phone)}
                >
                  <Ionicons name="call" size={20} color={COLORS.primary} />
                  <Text style={styles.actionText}>Appeler</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionButton, styles.actionButtonPrimary]}
                  onPress={() => openNavigation(store)}
                >
                  <Ionicons name="navigate" size={20} color={COLORS.white} />
                  <Text style={styles.actionTextWhite}>Itinéraire</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONTS.h3,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  locationButton: {
    padding: SPACING.sm,
    backgroundColor: 'rgba(220, 7, 20, 0.1)',
    borderRadius: 8,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    backgroundColor: COLORS.primary,
    padding: SPACING.sm,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  storeListContainer: {
    backgroundColor: COLORS.background,
    paddingTop: SPACING.md,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  listTitle: {
    fontSize: FONTS.body1,
    fontWeight: FONTS.bold,
    color: COLORS.white,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  storeList: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  storeCard: {
    width: 280,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginRight: SPACING.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  storeCardActive: {
    borderColor: COLORS.primary,
  },
  storeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  storeName: {
    fontSize: FONTS.body1,
    fontWeight: FONTS.bold,
    color: COLORS.white,
    flex: 1,
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    gap: SPACING.xs,
  },
  storeAddress: {
    fontSize: FONTS.body2,
    color: COLORS.textSecondary,
    flex: 1,
  },
  storeHours: {
    fontSize: FONTS.body2,
    color: COLORS.textSecondary,
  },
  storeDistance: {
    fontSize: FONTS.body2,
    color: COLORS.accent,
    fontWeight: FONTS.semiBold,
  },
  storeActions: {
    flexDirection: 'row',
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.sm,
    borderRadius: 8,
    backgroundColor: 'rgba(220, 7, 20, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    gap: SPACING.xs,
  },
  actionButtonPrimary: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  actionText: {
    fontSize: FONTS.body2,
    color: COLORS.primary,
    fontWeight: FONTS.semiBold,
  },
  actionTextWhite: {
    fontSize: FONTS.body2,
    color: COLORS.white,
    fontWeight: FONTS.semiBold,
  },
});
