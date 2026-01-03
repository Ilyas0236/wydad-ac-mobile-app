// src/screens/Stores/StoresMapScreen.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  ScrollView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { COLORS, FONTS, SPACING } from '../../utils';
import {
  WYDAD_STORES,
  CASABLANCA_REGION,
  calculateDistance,
  formatDistance,
  getPhoneLink,
  getMapsLink,
  getNearestStore,
  STORE_TYPE_LABELS,
} from '../../data/wydadStores';

// ============================================
// CUSTOM MAP STYLE (Dark Theme)
// ============================================
const mapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#212121' }],
  },
  {
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#212121' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#2c2c2c' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#000000' }],
  },
];

export default function StoresMapScreen({ navigation }) {
  const mapRef = useRef(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(CASABLANCA_REGION);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);

  // ============================================
  // EFFECTS
  // ============================================
  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      const nearest = getNearestStore(userLocation.latitude, userLocation.longitude);
      if (nearest) {
        setSelectedStore(nearest);
      }
    }
  }, [userLocation]);

  // ============================================
  // GET USER LOCATION
  // ============================================
  const getUserLocation = useCallback(async () => {
    try {
      setLocationLoading(true);
      console.log('🔄 Requesting location permission...');

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission refusée',
          'Nous avons besoin de votre localisation pour afficher les boutiques à proximité.',
          [{ text: 'OK' }]
        );
        setLoading(false);
        return;
      }

      console.log('✅ Location permission granted');
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const userCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setUserLocation(userCoords);

      // Center map on user location
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          ...userCoords,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }, 1000);
      }

      console.log('✅ User location obtained:', userCoords);
    } catch (error) {
      console.error('❌ Error getting location:', error);
      Alert.alert('Erreur', 'Impossible d\'obtenir votre localisation');
    } finally {
      setLoading(false);
      setLocationLoading(false);
    }
  }, []);

  // ============================================
  // NAVIGATION
  // ============================================
  const openNavigation = useCallback((store) => {
    const url = getMapsLink(store.coordinates.latitude, store.coordinates.longitude);
    
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Erreur', 'Impossible d\'ouvrir l\'application de navigation');
      }
    });
  }, []);

  // ============================================
  // CALL STORE
  // ============================================
  const callStore = useCallback((phone) => {
    const url = getPhoneLink(phone);
    Linking.openURL(url);
  }, []);

  // ============================================
  // GET STORE ICON
  // ============================================
  const getStoreIcon = useCallback((type) => {
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
  }, []);

  // ============================================
  // HANDLE STORE SELECT
  // ============================================
  const handleStoreSelect = useCallback((store) => {
    setSelectedStore(store);
    
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        ...store.coordinates,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 500);
    }
  }, []);

  // ============================================
  // HANDLE BACK
  // ============================================
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // ============================================
  // LOADING STATE
  // ============================================
  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Chargement de la carte...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ============================================
  // RENDER
  // ============================================
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={handleBack} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Boutiques Wydad</Text>
        
        <TouchableOpacity
          onPress={getUserLocation}
          style={styles.locationButton}
          disabled={locationLoading}
          activeOpacity={0.7}
        >
          {locationLoading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Ionicons name="locate" size={24} color={COLORS.primary} />
          )}
        </TouchableOpacity>
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={mapRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        customMapStyle={mapStyle}
      >
        {WYDAD_STORES.map((store) => (
          <Marker
            key={store.id}
            coordinate={store.coordinates}
            onPress={() => handleStoreSelect(store)}
          >
            <View style={styles.markerContainer}>
              <View style={[
                styles.marker,
                selectedStore?.id === store.id && styles.markerActive
              ]}>
                <Ionicons 
                  name={getStoreIcon(store.type)} 
                  size={20} 
                  color={COLORS.white} 
                />
              </View>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Store List */}
      <View style={styles.storeListContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            {WYDAD_STORES.length} Boutiques à Casablanca
          </Text>
          {userLocation && selectedStore && (
            <View style={styles.nearestBadge}>
              <Ionicons name="navigate" size={14} color={COLORS.accent} />
              <Text style={styles.nearestText}>
                {formatDistance(
                  calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    selectedStore.coordinates.latitude,
                    selectedStore.coordinates.longitude
                  )
                )}
              </Text>
            </View>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storeList}
        >
          {WYDAD_STORES.map((store) => {
            const distance = userLocation
              ? calculateDistance(
                  userLocation.latitude,
                  userLocation.longitude,
                  store.coordinates.latitude,
                  store.coordinates.longitude
                )
              : null;

            return (
              <TouchableOpacity
                key={store.id}
                style={[
                  styles.storeCard,
                  selectedStore?.id === store.id && styles.storeCardActive,
                ]}
                onPress={() => handleStoreSelect(store)}
                activeOpacity={0.8}
              >
                {/* Store Header */}
                <View style={styles.storeCardHeader}>
                  <View style={styles.storeIconContainer}>
                    <Ionicons
                      name={getStoreIcon(store.type)}
                      size={24}
                      color={COLORS.primary}
                    />
                  </View>
                  <View style={styles.storeHeaderText}>
                    <Text style={styles.storeName} numberOfLines={2}>
                      {store.name}
                    </Text>
                    <Text style={styles.storeType}>
                      {STORE_TYPE_LABELS[store.type]}
                    </Text>
                  </View>
                </View>

                {/* Store Info */}
                <View style={styles.storeInfoContainer}>
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

                  {distance && (
                    <View style={styles.storeInfo}>
                      <Ionicons name="navigate-outline" size={16} color={COLORS.accent} />
                      <Text style={styles.storeDistance}>
                        {formatDistance(distance)}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Actions */}
                <View style={styles.storeActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => callStore(store.phone)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="call" size={20} color={COLORS.primary} />
                    <Text style={styles.actionText}>Appeler</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.actionButtonPrimary]}
                    onPress={() => openNavigation(store)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="navigate" size={20} color={COLORS.white} />
                    <Text style={styles.actionTextWhite}>Itinéraire</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: COLORS.white,
    marginTop: SPACING.md,
    fontSize: FONTS.body1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
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
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
  markerActive: {
    backgroundColor: COLORS.accent,
  },
  storeListContainer: {
    backgroundColor: '#000',
    paddingTop: SPACING.md,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  listTitle: {
    fontSize: FONTS.body1,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  nearestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    gap: 4,
  },
  nearestText: {
    fontSize: FONTS.caption,
    color: COLORS.accent,
    fontWeight: FONTS.semiBold,
  },
  storeList: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  storeCard: {
    width: 300,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: SPACING.md,
    marginRight: SPACING.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  storeCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(220, 7, 20, 0.1)',
  },
  storeCardHeader: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  storeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(220, 7, 20, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeHeaderText: {
    flex: 1,
  },
  storeName: {
    fontSize: FONTS.body1,
    fontWeight: FONTS.bold,
    color: COLORS.white,
    marginBottom: 4,
  },
  storeType: {
    fontSize: FONTS.caption,
    color: COLORS.accent,
    textTransform: 'uppercase',
  },
  storeInfoContainer: {
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
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
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.sm,
    borderRadius: 12,
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
