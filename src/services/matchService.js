// src/services/matchService.js
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from './firebase';

class MatchService {
  constructor() {
    this.collectionName = 'matches';
  }

  async getAllMatches() {
    try {
      console.log('🎟️ Fetching matches from Firestore...');
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      const matches = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(`✅ ${matches.length} matches loaded`);
      return matches;
    } catch (error) {
      console.error('❌ Error fetching matches:', error);
      throw new Error('Impossible de charger les matchs');
    }
  }

  async getAvailableMatches() {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('status', '==', 'available')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching available matches:', error);
      return [];
    }
  }

  async getMatchById(matchId) {
    try {
      const docRef = doc(db, this.collectionName, matchId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      throw new Error('Match non trouvé');
    } catch (error) {
      console.error('Error fetching match:', error);
      throw error;
    }
  }
}

export default new MatchService();
