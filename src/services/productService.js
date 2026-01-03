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
  updateDoc,
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { db, COLLECTIONS, getCurrentUser, getUserId } from './firebase';

// ============================================
// COLLECTION REFERENCES
// ============================================
const productsRef = collection(db, COLLECTIONS.PRODUCTS);
const ordersRef = collection(db, COLLECTIONS.ORDERS);

// ============================================
// ERROR HANDLING
// ============================================
const handleError = (error, context) => {
  console.error(`❌ [ProductService] ${context}:`, error);
  throw new Error(`${context}: ${error.message}`);
};

// ============================================
// PRODUCTS OPERATIONS
// ============================================

/**
 * Get all products with optional category filter
 * @param {string|null} category 
 * @returns {Promise<Array>}
 */
export const getProducts = async (category = null) => {
  try {
    console.log(`🔄 Fetching products${category ? ` (category: ${category})` : ''}...`);
    
    let q;
    
    if (category && category !== 'all') {
      q = query(
        productsRef, 
        where('category', '==', category),
        orderBy('name', 'asc')
      );
    } else {
      q = query(productsRef, orderBy('name', 'asc'));
    }
    
    const snapshot = await getDocs(q);
    
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`✅ Fetched ${products.length} products`);
    return products;
  } catch (error) {
    handleError(error, 'Failed to fetch products');
  }
};

/**
 * Get product by ID
 * @param {string} productId 
 * @returns {Promise<Object|null>}
 */
export const getProductById = async (productId) => {
  try {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    console.log(`🔄 Fetching product: ${productId}`);
    
    const docRef = doc(db, COLLECTIONS.PRODUCTS, productId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      console.warn(`⚠️ Product not found: ${productId}`);
      return null;
    }
    
    const product = {
      id: docSnap.id,
      ...docSnap.data()
    };
    
    console.log(`✅ Product found: ${product.name}`);
    return product;
  } catch (error) {
    handleError(error, `Failed to fetch product ${productId}`);
  }
};

/**
 * Get products by category
 * @param {string} category 
 * @returns {Promise<Array>}
 */
export const getProductsByCategory = async (category) => {
  return getProducts(category);
};

/**
 * Get featured products
 * @returns {Promise<Array>}
 */
export const getFeaturedProducts = async () => {
  try {
    const q = query(
      productsRef,
      where('featured', '==', true),
      orderBy('name', 'asc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('❌ Error fetching featured products:', error);
    return [];
  }
};

/**
 * Search products by name
 * @param {string} searchTerm 
 * @returns {Promise<Array>}
 */
export const searchProducts = async (searchTerm) => {
  try {
    const allProducts = await getProducts();
    
    const searchLower = searchTerm.toLowerCase();
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower)
    );
  } catch (error) {
    console.error('❌ Error searching products:', error);
    return [];
  }
};

// ============================================
// ORDERS OPERATIONS
// ============================================

/**
 * Create order
 * @param {Object} orderData 
 * @returns {Promise<Object>}
 */
export const createOrder = async (orderData) => {
  try {
    console.log('🔄 Creating order...');
    
    // Get current user
    const user = getCurrentUser();
    if (!user) {
      throw new Error('User must be authenticated to create orders');
    }
    
    // Validate order data
    if (!validateOrderData(orderData)) {
      throw new Error('Invalid order data');
    }
    
    // Create order object
    const order = {
      ...orderData,
      userId: user.uid,
      userEmail: user.email,
      userName: user.displayName || 'Wydad Fan',
      orderDate: serverTimestamp(),
      status: 'pending',
      orderNumber: generateOrderNumber(),
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(ordersRef, order);
    
    console.log(`✅ Order created successfully: ${docRef.id}`);
    
    return {
      id: docRef.id,
      ...order,
      orderDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    handleError(error, 'Failed to create order');
  }
};

/**
 * Get user orders
 * @param {string} userId - Optional, uses current user if not provided
 * @returns {Promise<Array>}
 */
export const getUserOrders = async (userId = null) => {
  try {
    const targetUserId = userId || getUserId();
    
    if (!targetUserId) {
      console.warn('⚠️ No user authenticated');
      return [];
    }
    
    console.log(`🔄 Fetching orders for user: ${targetUserId}`);
    
    const q = query(
      ordersRef,
      where('userId', '==', targetUserId),
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
    
    console.log(`✅ Fetched ${orders.length} orders`);
    return orders;
  } catch (error) {
    console.error('❌ Error fetching user orders:', error);
    return [];
  }
};

/**
 * Get order by ID
 * @param {string} orderId 
 * @returns {Promise<Object|null>}
 */
export const getOrderById = async (orderId) => {
  try {
    const docRef = doc(db, COLLECTIONS.ORDERS, orderId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      console.warn(`⚠️ Order not found: ${orderId}`);
      return null;
    }
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      orderDate: data.orderDate?.toDate().toISOString()
    };
  } catch (error) {
    handleError(error, `Failed to fetch order ${orderId}`);
  }
};

/**
 * Update order status
 * @param {string} orderId 
 * @param {string} status 
 * @returns {Promise<boolean>}
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    console.log(`🔄 Updating order ${orderId} status to: ${status}`);
    
    const docRef = doc(db, COLLECTIONS.ORDERS, orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp()
    });
    
    console.log(`✅ Order status updated: ${orderId}`);
    return true;
  } catch (error) {
    handleError(error, `Failed to update order status ${orderId}`);
  }
};

/**
 * Cancel order
 * @param {string} orderId 
 * @returns {Promise<boolean>}
 */
export const cancelOrder = async (orderId) => {
  try {
    console.log(`🔄 Cancelling order: ${orderId}`);
    
    const docRef = doc(db, COLLECTIONS.ORDERS, orderId);
    await updateDoc(docRef, {
      status: 'cancelled',
      cancelledAt: serverTimestamp()
    });
    
    console.log(`✅ Order cancelled: ${orderId}`);
    return true;
  } catch (error) {
    handleError(error, `Failed to cancel order ${orderId}`);
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate unique order number
 * @returns {string}
 */
const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `WYD${timestamp}${random}`;
};

/**
 * Calculate cart total
 * @param {Array} cartItems 
 * @returns {number}
 */
export const calculateCartTotal = (cartItems) => {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return 0;
  }
  
  return cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

/**
 * Calculate cart item count
 * @param {Array} cartItems 
 * @returns {number}
 */
export const calculateCartItemCount = (cartItems) => {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return 0;
  }
  
  return cartItems.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
};

/**
 * Validate order data
 * @param {Object} orderData 
 * @returns {boolean}
 */
export const validateOrderData = (orderData) => {
  const required = ['items', 'totalPrice'];
  
  for (const field of required) {
    if (!orderData[field]) {
      console.error(`❌ Missing required field: ${field}`);
      return false;
    }
  }
  
  if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
    console.error('❌ Order must contain at least one item');
    return false;
  }
  
  if (orderData.totalPrice <= 0) {
    console.error('❌ Invalid total price');
    return false;
  }
  
  return true;
};

/**
 * Get product categories
 * @returns {Array}
 */
export const getProductCategories = () => {
  return [
    { id: 'all', name: 'Tout', icon: 'grid' },
    { id: 'Maillots', name: 'Maillots', icon: 'shirt' },
    { id: 'Accessoires', name: 'Accessoires', icon: 'bag' },
    { id: 'Équipements', name: 'Équipements', icon: 'football' },
    { id: 'Souvenirs', name: 'Souvenirs', icon: 'gift' }
  ];
};

/**
 * Format price for display
 * @param {number} price 
 * @returns {string}
 */
export const formatPrice = (price) => {
  return `${price.toFixed(2)} DH`;
};

// ============================================
// EXPORTS
// ============================================
export default {
  getProducts,
  getProductById,
  getProductsByCategory,
  getFeaturedProducts,
  searchProducts,
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  calculateCartTotal,
  calculateCartItemCount,
  validateOrderData,
  getProductCategories,
  formatPrice
};
