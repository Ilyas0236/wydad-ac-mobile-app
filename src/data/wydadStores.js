// src/data/wydadStores.js

/**
 * Wydad AC Official Stores Data
 * Contains information about all Wydad stores in Casablanca
 */

// ============================================
// STORE TYPES
// ============================================
export const STORE_TYPES = {
  FLAGSHIP: 'flagship',
  BOUTIQUE: 'boutique',
  CORNER: 'corner',
};

export const STORE_TYPE_LABELS = {
  [STORE_TYPES.FLAGSHIP]: 'Boutique Principale',
  [STORE_TYPES.BOUTIQUE]: 'Boutique',
  [STORE_TYPES.CORNER]: 'Corner',
};

// ============================================
// STORE FEATURES
// ============================================
export const STORE_FEATURES = {
  PARKING: 'parking',
  WIFI: 'wifi',
  DISABLED_ACCESS: 'disabled_access',
  PAYMENT_CARD: 'payment_card',
  GIFT_WRAPPING: 'gift_wrapping',
  ONLINE_PICKUP: 'online_pickup',
};

export const FEATURE_LABELS = {
  [STORE_FEATURES.PARKING]: 'Parking',
  [STORE_FEATURES.WIFI]: 'Wi-Fi Gratuit',
  [STORE_FEATURES.DISABLED_ACCESS]: 'Accès PMR',
  [STORE_FEATURES.PAYMENT_CARD]: 'Paiement CB',
  [STORE_FEATURES.GIFT_WRAPPING]: 'Emballage Cadeau',
  [STORE_FEATURES.ONLINE_PICKUP]: 'Retrait Commande',
};

// ============================================
// STORES DATA
// ============================================
export const WYDAD_STORES = [
  {
    id: '1',
    name: "Boutique Officielle - Stade Mohammed V",
    address: "Boulevard de la Corniche, Casablanca",
    phone: "+212 522 270 927",
    hours: "9h00 - 20h00 (7j/7)",
    coordinates: {
      latitude: 33.5731,
      longitude: -7.6174,
    },
    type: STORE_TYPES.FLAGSHIP,
    description: "Boutique principale située au mythique Stade Mohammed V. La plus grande boutique officielle du Wydad avec l'assortiment le plus complet.",
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800',
    features: [
      STORE_FEATURES.PARKING,
      STORE_FEATURES.DISABLED_ACCESS,
      STORE_FEATURES.PAYMENT_CARD,
      STORE_FEATURES.GIFT_WRAPPING,
      STORE_FEATURES.ONLINE_PICKUP,
    ],
    rating: 4.8,
    reviewCount: 156,
  },
  {
    id: '2',
    name: "Wydad Store - Morocco Mall",
    address: "Morocco Mall, Ain Diab, Casablanca",
    phone: "+212 522 298 000",
    hours: "10h00 - 22h00",
    coordinates: {
      latitude: 33.5465,
      longitude: -7.6709,
    },
    type: STORE_TYPES.BOUTIQUE,
    description: "Point de vente situé dans le plus grand centre commercial du Maroc. Large sélection de produits officiels.",
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800',
    features: [
      STORE_FEATURES.PARKING,
      STORE_FEATURES.WIFI,
      STORE_FEATURES.DISABLED_ACCESS,
      STORE_FEATURES.PAYMENT_CARD,
      STORE_FEATURES.GIFT_WRAPPING,
    ],
    rating: 4.6,
    reviewCount: 89,
  },
  {
    id: '3',
    name: "Wydad Corner - Anfa Place",
    address: "Anfa Place Living Resort, Casablanca",
    phone: "+212 522 399 999",
    hours: "10h00 - 21h00",
    coordinates: {
      latitude: 33.5892,
      longitude: -7.6327,
    },
    type: STORE_TYPES.CORNER,
    description: "Corner moderne dans le complexe Anfa Place. Sélection exclusive de produits premium.",
    image: 'https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?w=800',
    features: [
      STORE_FEATURES.PARKING,
      STORE_FEATURES.DISABLED_ACCESS,
      STORE_FEATURES.PAYMENT_CARD,
    ],
    rating: 4.5,
    reviewCount: 67,
  },
  {
    id: '4',
    name: "Boutique Wydad - Centre-Ville",
    address: "Boulevard Mohammed V, Casablanca",
    phone: "+212 522 271 818",
    hours: "9h30 - 19h30 (Lun-Sam)",
    coordinates: {
      latitude: 33.5896,
      longitude: -7.6184,
    },
    type: STORE_TYPES.BOUTIQUE,
    description: "Boutique historique située au cœur de Casablanca. Proche de tous les transports en commun.",
    image: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=800',
    features: [
      STORE_FEATURES.PAYMENT_CARD,
      STORE_FEATURES.GIFT_WRAPPING,
      STORE_FEATURES.ONLINE_PICKUP,
    ],
    rating: 4.7,
    reviewCount: 124,
  },
];

// ============================================
// MAP REGION
// ============================================
export const CASABLANCA_REGION = {
  latitude: 33.5731,
  longitude: -7.5898,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get store by ID
 */
export const getStoreById = (storeId) => {
  return WYDAD_STORES.find(store => store.id === storeId);
};

/**
 * Get stores by type
 */
export const getStoresByType = (type) => {
  return WYDAD_STORES.filter(store => store.type === type);
};

/**
 * Get flagship stores
 */
export const getFlagshipStores = () => {
  return getStoresByType(STORE_TYPES.FLAGSHIP);
};

/**
 * Get stores with specific feature
 */
export const getStoresWithFeature = (feature) => {
  return WYDAD_STORES.filter(store => 
    store.features && store.features.includes(feature)
  );
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

/**
 * Get nearest store to user location
 */
export const getNearestStore = (userLatitude, userLongitude) => {
  if (!userLatitude || !userLongitude) return null;

  let nearestStore = null;
  let minDistance = Infinity;

  WYDAD_STORES.forEach(store => {
    const distance = calculateDistance(
      userLatitude,
      userLongitude,
      store.coordinates.latitude,
      store.coordinates.longitude
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestStore = { ...store, distance };
    }
  });

  return nearestStore;
};

/**
 * Get all stores sorted by distance from user
 */
export const getStoresByDistance = (userLatitude, userLongitude) => {
  if (!userLatitude || !userLongitude) return WYDAD_STORES;

  return WYDAD_STORES
    .map(store => ({
      ...store,
      distance: calculateDistance(
        userLatitude,
        userLongitude,
        store.coordinates.latitude,
        store.coordinates.longitude
      ),
    }))
    .sort((a, b) => a.distance - b.distance);
};

/**
 * Check if store is open now
 */
export const isStoreOpen = (hours) => {
  // Simple implementation - can be enhanced
  const now = new Date();
  const currentHour = now.getHours();
  
  // Extract opening and closing hours from hours string
  // Example: "9h00 - 20h00" or "10h00 - 22h00"
  const hoursMatch = hours.match(/(\d+)h\d+ - (\d+)h\d+/);
  
  if (hoursMatch) {
    const openHour = parseInt(hoursMatch[1]);
    const closeHour = parseInt(hoursMatch[2]);
    return currentHour >= openHour && currentHour < closeHour;
  }
  
  return true; // Default to open if can't parse
};

/**
 * Format distance for display
 */
export const formatDistance = (distanceInKm) => {
  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)}m`;
  }
  return `${distanceInKm.toFixed(1)}km`;
};

/**
 * Get store phone link (for calling)
 */
export const getPhoneLink = (phone) => {
  return `tel:${phone.replace(/\s/g, '')}`;
};

/**
 * Get store maps link (for navigation)
 */
export const getMapsLink = (latitude, longitude) => {
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
};

export default WYDAD_STORES;
