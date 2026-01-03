// src/context/CartContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createOrder } from '../services/productService';
import { useAuth } from './AuthContext';

// ============================================
// CREATE CONTEXT
// ============================================
const CartContext = createContext();

// ============================================
// CONSTANTS
// ============================================
const CART_STORAGE_KEY = '@wydad_cart';

// ============================================
// CART PROVIDER
// ============================================
export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // ============================================
  // LOAD CART FROM STORAGE
  // ============================================
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      console.log('🔄 Loading cart from AsyncStorage...');
      
      const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
      
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
        console.log(`✅ Cart loaded: ${parsedCart.length} items`);
      } else {
        console.log('⚠️ No saved cart found');
      }
    } catch (error) {
      console.error('❌ Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // SAVE CART TO STORAGE
  // ============================================
  const saveCart = async (cartData) => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
      console.log('✅ Cart saved to AsyncStorage');
    } catch (error) {
      console.error('❌ Error saving cart:', error);
    }
  };

  // ============================================
  // ADD TO CART
  // ============================================
  const addToCart = useCallback((product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      let newCart;
      
      if (existingItem) {
        console.log(`📦 Updating quantity for: ${product.name}`);
        newCart = prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        console.log(`➕ Adding to cart: ${product.name}`);
        newCart = [...prevCart, { ...product, quantity }];
      }
      
      saveCart(newCart);
      return newCart;
    });
  }, []);

  // ============================================
  // REMOVE FROM CART
  // ============================================
  const removeFromCart = useCallback((productId) => {
    setCart((prevCart) => {
      console.log(`🗑️ Removing from cart: ${productId}`);
      const newCart = prevCart.filter(item => item.id !== productId);
      saveCart(newCart);
      return newCart;
    });
  }, []);

  // ============================================
  // UPDATE QUANTITY
  // ============================================
  const updateQuantity = useCallback((productId, quantity) => {
    setCart((prevCart) => {
      if (quantity <= 0) {
        console.log(`🗑️ Removing item (quantity = 0): ${productId}`);
        const newCart = prevCart.filter(item => item.id !== productId);
        saveCart(newCart);
        return newCart;
      }
      
      console.log(`🔄 Updating quantity for ${productId}: ${quantity}`);
      const newCart = prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      );
      saveCart(newCart);
      return newCart;
    });
  }, []);

  // ============================================
  // INCREMENT QUANTITY
  // ============================================
  const incrementQuantity = useCallback((productId) => {
    setCart((prevCart) => {
      const newCart = prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      saveCart(newCart);
      return newCart;
    });
  }, []);

  // ============================================
  // DECREMENT QUANTITY
  // ============================================
  const decrementQuantity = useCallback((productId) => {
    setCart((prevCart) => {
      const item = prevCart.find(i => i.id === productId);
      
      if (item && item.quantity <= 1) {
        // Remove if quantity would be 0
        const newCart = prevCart.filter(i => i.id !== productId);
        saveCart(newCart);
        return newCart;
      }
      
      const newCart = prevCart.map(i =>
        i.id === productId
          ? { ...i, quantity: i.quantity - 1 }
          : i
      );
      saveCart(newCart);
      return newCart;
    });
  }, []);

  // ============================================
  // CLEAR CART
  // ============================================
  const clearCart = useCallback(async () => {
    try {
      console.log('🗑️ Clearing cart...');
      setCart([]);
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
      console.log('✅ Cart cleared');
    } catch (error) {
      console.error('❌ Error clearing cart:', error);
    }
  }, []);

  // ============================================
  // GET TOTAL PRICE
  // ============================================
  const getTotalPrice = useCallback(() => {
    return cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }, [cart]);

  // ============================================
  // GET ITEM COUNT
  // ============================================
  const getItemCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // ============================================
  // GET CART ITEM
  // ============================================
  const getCartItem = useCallback((productId) => {
    return cart.find(item => item.id === productId);
  }, [cart]);

  // ============================================
  // IS IN CART
  // ============================================
  const isInCart = useCallback((productId) => {
    return cart.some(item => item.id === productId);
  }, [cart]);

  // ============================================
  // CHECKOUT (Create Order)
  // ============================================
  const checkout = useCallback(async (shippingInfo, paymentInfo) => {
    try {
      if (!user) {
        throw new Error('User must be logged in to checkout');
      }

      if (cart.length === 0) {
        throw new Error('Cart is empty');
      }

      console.log('🔄 Creating order...');

      const orderData = {
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        totalPrice: getTotalPrice(),
        itemCount: getItemCount(),
        shippingInfo,
        paymentInfo,
      };

      const order = await createOrder(orderData);

      console.log('✅ Order created successfully:', order.id);

      // Clear cart after successful order
      await clearCart();

      return { success: true, order };
    } catch (error) {
      console.error('❌ Checkout error:', error);
      return { success: false, error: error.message };
    }
  }, [user, cart, getTotalPrice, getItemCount, clearCart]);

  // ============================================
  // CONTEXT VALUE
  // ============================================
  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    getTotalPrice,
    getItemCount,
    getCartItem,
    isInCart,
    checkout,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// ============================================
// CUSTOM HOOK
// ============================================
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export default CartContext;
