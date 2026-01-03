// src/navigation/AppNavigator.js
import React, { useMemo } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ProfileScreen from '../screens/Auth/ProfileScreen';
import ProductListScreen from '../screens/Shop/ProductListScreen';
import ProductDetailScreen from '../screens/Shop/ProductDetailScreen';
import CartScreen from '../screens/Shop/CartScreen';
import PaymentScreen from '../screens/Shop/PaymentScreen';
import MatchListScreen from '../screens/Tickets/MatchListScreen';
import TicketBookingScreen from '../screens/Tickets/TicketBookingScreen';
import MyTicketsScreen from '../screens/Tickets/MyTicketsScreen';
import StoresMapScreen from '../screens/Stores/StoresMapScreen';

// Import contexts
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ============================================
// LINKING CONFIGURATION
// ============================================
const linking = {
  prefixes: ['wydadfan://', 'https://wydadfan.app'],
  config: {
    screens: {
      Login: 'login',
      Register: 'register',
      Main: {
        screens: {
          HomeTab: {
            screens: {
              Home: 'home',
              StoresMap: 'stores',
            },
          },
          ShopTab: {
            screens: {
              ProductList: 'shop',
              ProductDetail: 'shop/product/:id',
              Cart: 'cart',
              Payment: 'payment',
            },
          },
          TicketsTab: {
            screens: {
              MatchList: 'tickets',
              TicketBooking: 'tickets/booking/:matchId',
              MyTickets: 'my-tickets',
            },
          },
          ProfileTab: 'profile',
        },
      },
    },
  },
};

// ============================================
// HOME STACK
// ============================================
function HomeStack() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="StoresMap" component={StoresMapScreen} />
    </Stack.Navigator>
  );
}

// ============================================
// SHOP STACK
// ============================================
function ShopStack() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
    </Stack.Navigator>
  );
}

// ============================================
// TICKETS STACK
// ============================================
function TicketsStack() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MatchList" component={MatchListScreen} />
      <Stack.Screen name="TicketBooking" component={TicketBookingScreen} />
      <Stack.Screen name="MyTickets" component={MyTicketsScreen} />
    </Stack.Navigator>
  );
}

// ============================================
// MAIN TABS
// ============================================
function MainTabs() {
  const { cart } = useCart();

  // Calculate cart badge count
  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.darkGray || '#1A1A1A',
          borderTopColor: COLORS.primary,
          borderTopWidth: 2,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary || '#666',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ShopTab') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'TicketsTab') {
            iconName = focused ? 'ticket' : 'ticket-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStack}
        options={{ tabBarLabel: 'Accueil' }}
      />
      <Tab.Screen 
        name="ShopTab" 
        component={ShopStack}
        options={{ 
          tabBarLabel: 'Boutique',
          tabBarBadge: cartCount > 0 ? cartCount : null,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.accent,
            color: '#000',
            fontSize: 10,
            fontWeight: 'bold',
          }
        }}
      />
      <Tab.Screen 
        name="TicketsTab" 
        component={TicketsStack}
        options={{ tabBarLabel: 'Billets' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profil' }}
      />
    </Tab.Navigator>
  );
}

// ============================================
// LOADING SCREEN
// ============================================
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}

// ============================================
// MAIN APP NAVIGATOR
// ============================================
export default function AppNavigator() {
  const { user, loading } = useAuth();

  // Show loading screen while checking auth state
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          animation: 'fade',
        }}
      >
        {!user ? (
          // Auth screens (not logged in)
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ animation: 'slide_from_bottom' }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{ animation: 'slide_from_right' }}
            />
          </>
        ) : (
          // Main app screens (logged in)
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});
