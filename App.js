// App.js
import React from 'react';
import { LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';

// ============================================
// IGNORE SPECIFIC WARNINGS (Optional)
// ============================================
LogBox.ignoreLogs([
  'Setting a timer',
  'AsyncStorage has been extracted',
  'Non-serializable values were found in the navigation state',
]);

// ============================================
// MAIN APP COMPONENT
// ============================================
export default function App() {
  console.log('🚀 Wydad Fan App starting...');

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <AppNavigator />
          <StatusBar style="light" backgroundColor="#000" />
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
