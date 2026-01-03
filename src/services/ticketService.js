// src/services/ticketService.js
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
  deleteDoc,
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { db, COLLECTIONS, getCurrentUser, getUserId } from './firebase';

// ============================================
// COLLECTION REFERENCES
// ============================================
const matchesRef = collection(db, COLLECTIONS.MATCHES);
const ticketsRef = collection(db, COLLECTIONS.TICKETS);

// ============================================
// ERROR HANDLING
// ============================================
const handleError = (error, context) => {
  console.error(`❌ [TicketService] ${context}:`, error);
  throw new Error(`${context}: ${error.message}`);
};

// ============================================
// MATCHES OPERATIONS
// ============================================

/**
 * Get all matches ordered by date
 * @returns {Promise<Array>}
 */
export const getMatches = async () => {
  try {
    console.log('🔄 Fetching matches from Firebase...');
    
    const q = query(matchesRef, orderBy('date', 'asc'));
    const snapshot = await getDocs(q);
    
    const matches = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate ? data.date.toDate().toISOString() : data.date
      };
    });
    
    console.log(`✅ Fetched ${matches.length} matches`);
    return matches;
  } catch (error) {
    handleError(error, 'Failed to fetch matches');
  }
};

/**
 * Get match by ID
 * @param {string} matchId 
 * @returns {Promise<Object|null>}
 */
export const getMatchById = async (matchId) => {
  try {
    if (!matchId) {
      throw new Error('Match ID is required');
    }

    console.log(`🔄 Fetching match: ${matchId}`);
    
    const docRef = doc(db, COLLECTIONS.MATCHES, matchId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      console.warn(`⚠️ Match not found: ${matchId}`);
      return null;
    }
    
    const data = docSnap.data();
    const match = {
      id: docSnap.id,
      ...data,
      date: data.date?.toDate ? data.date.toDate().toISOString() : data.date
    };
    
    console.log(`✅ Match found: ${match.homeTeam} vs ${match.awayTeam}`);
    return match;
  } catch (error) {
    handleError(error, `Failed to fetch match ${matchId}`);
  }
};

/**
 * Get upcoming matches (future dates only)
 * @returns {Promise<Array>}
 */
export const getUpcomingMatches = async () => {
  try {
    const now = Timestamp.now();
    const q = query(
      matchesRef,
      where('date', '>=', now),
      orderBy('date', 'asc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate().toISOString()
    }));
  } catch (error) {
    console.error('❌ Error fetching upcoming matches:', error);
    return [];
  }
};

/**
 * Get available matches (status = 'available')
 * @returns {Promise<Array>}
 */
export const getAvailableMatches = async () => {
  try {
    const q = query(
      matchesRef,
      where('status', '==', 'available'),
      orderBy('date', 'asc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate().toISOString()
    }));
  } catch (error) {
    console.error('❌ Error fetching available matches:', error);
    return [];
  }
};

// ============================================
// TICKETS OPERATIONS
// ============================================

/**
 * Book a ticket
 * @param {Object} ticketData 
 * @returns {Promise<Object>}
 */
export const bookTicket = async (ticketData) => {
  try {
    console.log('🔄 Booking ticket...');
    
    // Get current user
    const user = getCurrentUser();
    if (!user) {
      throw new Error('User must be authenticated to book tickets');
    }
    
    // Validate ticket data
    if (!validateTicketData(ticketData)) {
      throw new Error('Invalid ticket data');
    }
    
    // Create ticket object
    const ticket = {
      ...ticketData,
      userId: user.uid,
      userEmail: user.email,
      userName: user.displayName || 'Wydad Fan',
      bookingDate: serverTimestamp(),
      status: 'confirmed',
      qrCode: generateQRCode(),
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(ticketsRef, ticket);
    
    console.log(`✅ Ticket booked successfully: ${docRef.id}`);
    
    return {
      id: docRef.id,
      ...ticket,
      bookingDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    handleError(error, 'Failed to book ticket');
  }
};

/**
 * Get user tickets
 * @param {string} userId - Optional, uses current user if not provided
 * @returns {Promise<Array>}
 */
export const getUserTickets = async (userId = null) => {
  try {
    const targetUserId = userId || getUserId();
    
    if (!targetUserId) {
      console.warn('⚠️ No user authenticated');
      return [];
    }
    
    console.log(`🔄 Fetching tickets for user: ${targetUserId}`);
    
    const q = query(
      ticketsRef,
      where('userId', '==', targetUserId),
      orderBy('bookingDate', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    const tickets = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        bookingDate: data.bookingDate?.toDate ? data.bookingDate.toDate().toISOString() : data.bookingDate
      };
    });
    
    console.log(`✅ Fetched ${tickets.length} tickets`);
    return tickets;
  } catch (error) {
    console.error('❌ Error fetching user tickets:', error);
    return [];
  }
};

/**
 * Get ticket by ID
 * @param {string} ticketId 
 * @returns {Promise<Object|null>}
 */
export const getTicketById = async (ticketId) => {
  try {
    const docRef = doc(db, COLLECTIONS.TICKETS, ticketId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      console.warn(`⚠️ Ticket not found: ${ticketId}`);
      return null;
    }
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      bookingDate: data.bookingDate?.toDate().toISOString()
    };
  } catch (error) {
    handleError(error, `Failed to fetch ticket ${ticketId}`);
  }
};

/**
 * Cancel ticket
 * @param {string} ticketId 
 * @returns {Promise<boolean>}
 */
export const cancelTicket = async (ticketId) => {
  try {
    console.log(`🔄 Cancelling ticket: ${ticketId}`);
    
    const docRef = doc(db, COLLECTIONS.TICKETS, ticketId);
    await updateDoc(docRef, {
      status: 'cancelled',
      cancelledAt: serverTimestamp()
    });
    
    console.log(`✅ Ticket cancelled: ${ticketId}`);
    return true;
  } catch (error) {
    handleError(error, `Failed to cancel ticket ${ticketId}`);
  }
};

/**
 * Delete ticket (admin only)
 * @param {string} ticketId 
 * @returns {Promise<boolean>}
 */
export const deleteTicket = async (ticketId) => {
  try {
    console.log(`🔄 Deleting ticket: ${ticketId}`);
    
    const docRef = doc(db, COLLECTIONS.TICKETS, ticketId);
    await deleteDoc(docRef);
    
    console.log(`✅ Ticket deleted: ${ticketId}`);
    return true;
  } catch (error) {
    handleError(error, `Failed to delete ticket ${ticketId}`);
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate unique QR code
 * @returns {string}
 */
const generateQRCode = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11).toUpperCase();
  return `WYD-${timestamp}-${random}`;
};

/**
 * Calculate ticket price based on category
 * @param {string} category 
 * @param {number} quantity 
 * @returns {number}
 */
export const calculateTicketPrice = (category, quantity = 1) => {
  const prices = {
    'Virage': 50,
    'Tribune': 100,
    'Pelouse': 30,
    'VIP': 200,
    'Tribune Premium': 150
  };
  
  const basePrice = prices[category] || 50;
  return basePrice * quantity;
};

/**
 * Format match date for display
 * @param {string} dateString 
 * @returns {string}
 */
export const formatMatchDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('❌ Error formatting date:', error);
    return dateString;
  }
};

/**
 * Validate ticket data before booking
 * @param {Object} ticketData 
 * @returns {boolean}
 */
export const validateTicketData = (ticketData) => {
  const required = ['matchId', 'category', 'quantity', 'totalPrice'];
  
  for (const field of required) {
    if (!ticketData[field]) {
      console.error(`❌ Missing required field: ${field}`);
      return false;
    }
  }
  
  if (ticketData.quantity < 1 || ticketData.quantity > 10) {
    console.error('❌ Invalid quantity (must be between 1 and 10)');
    return false;
  }
  
  if (ticketData.totalPrice <= 0) {
    console.error('❌ Invalid price');
    return false;
  }
  
  return true;
};

/**
 * Get ticket categories
 * @returns {Array}
 */
export const getTicketCategories = () => {
  return [
    { id: 'Virage', name: 'Virage', price: 50 },
    { id: 'Pelouse', name: 'Pelouse', price: 30 },
    { id: 'Tribune', name: 'Tribune', price: 100 },
    { id: 'Tribune Premium', name: 'Tribune Premium', price: 150 },
    { id: 'VIP', name: 'VIP', price: 200 }
  ];
};

// ============================================
// EXPORTS
// ============================================
export default {
  getMatches,
  getMatchById,
  getUpcomingMatches,
  getAvailableMatches,
  bookTicket,
  getUserTickets,
  getTicketById,
  cancelTicket,
  deleteTicket,
  calculateTicketPrice,
  formatMatchDate,
  validateTicketData,
  getTicketCategories
};
