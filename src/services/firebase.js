// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================
// FIREBASE CONFIGURATION
// ============================================
const firebaseConfig = {
  apiKey: "AIzaSyBb2m-4LXwn900C1cI-wV7fGxI-kZYGmuE",
  authDomain: "wydad-ac-app.firebaseapp.com",
  projectId: "wydad-ac-app",
  storageBucket: "wydad-ac-app.firebasestorage.app",
  messagingSenderId: "455178697522",
  appId: "1:455178697522:web:ab93881010a8706dddb52b",
  measurementId: "G-WKJ1TP5S7X"
};

// ============================================
// INITIALIZE FIREBASE APP
// ============================================
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  throw error;
}

// ============================================
// INITIALIZE AUTH WITH PERSISTENCE
// ============================================
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  console.log('✅ Firebase Auth initialized with AsyncStorage persistence');
} catch (error) {
  // If already initialized, get the existing instance
  console.warn('⚠️ Auth already initialized, using existing instance');
  auth = getAuth(app);
}

// ============================================
// INITIALIZE FIRESTORE & STORAGE
// ============================================
const db = getFirestore(app);
const storage = getStorage(app);

console.log('✅ Firestore and Storage initialized');

// ============================================
// FIRESTORE COLLECTIONS REFERENCES
// ============================================
export const COLLECTIONS = {
  USERS: 'users',
  PRODUCTS: 'products',
  MATCHES: 'matches',
  TICKETS: 'tickets',
  ORDERS: 'orders',
  STORES: 'stores'
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if Firebase is initialized
 * @returns {boolean}
 */
export const isFirebaseInitialized = () => {
  return app !== null && app !== undefined;
};

/**
 * Get current authenticated user
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return auth.currentUser !== null;
};

/**
 * Get user ID
 * @returns {string|null}
 */
export const getUserId = () => {
  return auth.currentUser?.uid || null;
};

/**
 * Get user email
 * @returns {string|null}
 */
export const getUserEmail = () => {
  return auth.currentUser?.email || null;
};

// ============================================
// EXPORTS
// ============================================
export { auth, db, storage };
export default app;
