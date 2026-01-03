import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from './firebase';

class ProductService {
  constructor() {
    this.collectionName = 'products';
  }

  // Récupérer tous les produits
  async getAllProducts() {
    try {
      console.log('📦 Fetching products from Firestore...');
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      const products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(`✅ ${products.length} products loaded`);
      return products;
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      throw new Error('Impossible de charger les produits');
    }
  }

  // Récupérer produits en vedette
  async getFeaturedProducts() {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('featured', '==', true)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  }

  // Récupérer un produit par ID
  async getProductById(productId) {
    try {
      const docRef = doc(db, this.collectionName, productId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      throw new Error('Produit non trouvé');
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }
}

export default new ProductService();
