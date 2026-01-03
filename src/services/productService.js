// src/services/productService.js
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc,
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

const productsCollection = collection(db, 'products');
const ordersCollection = collection(db, 'orders');

// ============================================
// PRODUCTS
// ============================================

/**
 * Get all products (with optional category filter)
 */
export const getProducts = async (category = null) => {
  try {
    let q;
    
    if (category && category !== 'all') {
      q = query(
        productsCollection, 
        where('category', '==', category),
        orderBy('name', 'asc')
      );
    } else {
      q = query(productsCollection, orderBy('name', 'asc'));
    }
    
    const snapshot = await getDocs(q);
    
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log('✅ Products récupérés:', products.length);
    return products;
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    throw error;
  }
};

/**
 * Get product by ID
 */
export const getProductById = async (productId) => {
  try {
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    }
    
    console.log('❌ Product not found:', productId);
    return null;
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    throw error;
  }
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (category) => {
  return getProducts(category);
};

// ============================================
// ORDERS
// ============================================

/**
 * Create order
 */
export const createOrder = async (orderData) => {
  try {
    const order = {
      ...orderData,
      orderDate: Timestamp.now(),
      status: 'pending',
      orderNumber: generateOrderNumber()
    };
    
    const docRef = await addDoc(ordersCollection, order);
    
    console.log('✅ Order created:', docRef.id);
    
    return {
      id: docRef.id,
      ...order,
      orderDate: order.orderDate.toDate().toISOString()
    };
  } catch (error) {
    console.error('❌ Error creating order:', error);
    throw error;
  }
};

/**
 * Get user orders
 */
export const getUserOrders = async (userId) => {
  try {
    const q = query(
      ordersCollection,
      where('userId', '==', userId),
      orderBy('orderDate', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    const orders = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        orderDate: data.orderDate?.toDate ? data.orderDate.toDate().toISOString() : data.orderDate
      };
    });
    
    console.log('✅ User orders récupérés:', orders.length);
    return orders;
  } catch (error) {
    console.error('❌ Error fetching user orders:', error);
    return [];
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate unique order number
 */
const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `WYD${timestamp}${random}`;
};

/**
 * Calculate cart total
 */
export const calculateCartTotal = (cartItems) => {
  return cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};
