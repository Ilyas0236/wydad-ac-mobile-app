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
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Collection references
const matchesCollection = collection(db, 'matches');
const ticketsCollection = collection(db, 'tickets');

// ============================================
// MATCHES
// ============================================

/**
 * Get all matches
 */
export const getMatches = async () => {
  try {
    const q = query(matchesCollection, orderBy('date', 'asc'));
    const snapshot = await getDocs(q);
    
    const matches = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Convert Firestore Timestamp to Date string
        date: data.date?.toDate ? data.date.toDate().toISOString() : data.date
      };
    });
    
    console.log('✅ Matches récupérés:', matches.length);
    return matches;
  } catch (error) {
    console.error('❌ Error fetching matches:', error);
    throw error;
  }
};

/**
 * Get match by ID
 */
export const getMatchById = async (matchId) => {
  try {
    const docRef = doc(db, 'matches', matchId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        date: data.date?.toDate ? data.date.toDate().toISOString() : data.date
      };
    }
    
    console.log('❌ Match not found:', matchId);
    return null;
  } catch (error) {
    console.error('❌ Error fetching match:', error);
    throw error;
  }
};

// ============================================
// TICKETS
// ============================================

/**
 * Book a ticket
 */
export const bookTicket = async (ticketData) => {
  try {
    const ticket = {
      ...ticketData,
      bookingDate: Timestamp.now(),
      status: 'confirmed',
      qrCode: generateQRCode()
    };
    
    const docRef = await addDoc(ticketsCollection, ticket);
    
    console.log('✅ Ticket booked:', docRef.id);
    
    return {
      id: docRef.id,
      ...ticket,
      bookingDate: ticket.bookingDate.toDate().toISOString()
    };
  } catch (error) {
    console.error('❌ Error booking ticket:', error);
    throw error;
  }
};

/**
 * Get user tickets
 */
export const getUserTickets = async (userId) => {
  try {
    const q = query(
      ticketsCollection,
      where('userId', '==', userId),
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
    
    console.log('✅ User tickets récupérés:', tickets.length);
    return tickets;
  } catch (error) {
    console.error('❌ Error fetching user tickets:', error);
    // Return empty array instead of throwing
    return [];
  }
};

/**
 * Cancel ticket
 */
export const cancelTicket = async (ticketId) => {
  try {
    const docRef = doc(db, 'tickets', ticketId);
    await updateDoc(docRef, {
      status: 'cancelled',
      cancelledAt: Timestamp.now()
    });
    
    console.log('✅ Ticket cancelled:', ticketId);
    return true;
  } catch (error) {
    console.error('❌ Error cancelling ticket:', error);
    throw error;
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate unique QR code
 */
const generateQRCode = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9).toUpperCase();
  return `WYD-${timestamp}-${random}`;
};

/**
 * Calculate ticket price based on category
 */
export const calculateTicketPrice = (category, quantity = 1) => {
  const prices = {
    'Virage': 50,
    'Tribune': 100,
    'VIP': 200,
    'Pelouse': 30
  };
  
  const basePrice = prices[category] || 50;
  return basePrice * quantity;
};

/**
 * Format match date for display
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
    return dateString;
  }
};
