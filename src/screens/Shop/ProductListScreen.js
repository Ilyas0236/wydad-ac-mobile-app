// src/screens/Shop/ProductListScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../../utils';
import ProductCard from '../../components/ProductCard';

export default function ProductListScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Données mock (temporaires - à remplacer par Firebase après le déjeuner)
  useEffect(() => {
    setTimeout(() => {
      setProducts([
        {
          id: '1',
          name: 'Maillot Domicile 2025',
          category: 'Maillots',
          price: 450,
          oldPrice: 600,
          discount: 25,
          image: 'https://www.sportsdirect.com/images/products/51710703_l.jpg',
          stock: 50,
        },
        {
          id: '2',
          name: 'Écharpe Officielle',
          category: 'Accessoires',
          price: 120,
          oldPrice: 0,
          discount: 0,
          image: 'https://m.media-amazon.com/images/I/61wHGxMxLwL._AC_UX679_.jpg',
          stock: 100,
        },
        {
          id: '3',
          name: 'Casquette Wydad',
          category: 'Accessoires',
          price: 80,
          oldPrice: 100,
          discount: 20,
          image: 'https://m.media-amazon.com/images/I/71zXqKDEV0L._AC_UX679_.jpg',
          stock: 30,
        },
        {
          id: '4',
          name: 'Survêtement Entraînement',
          category: 'Vêtements',
          price: 550,
          oldPrice: 700,
          discount: 21,
          image: 'https://contents.mediadecathlon.com/p2166906/k$2de4b0dd9eb5ac76566e9f0a80c8bb8e/sq/survetement-de-football-adulte-trk500-noir.jpg',
          stock: 8,
        },
        {
          id: '5',
          name: 'Ballon Officiel',
          category: 'Équipement',
          price: 200,
          oldPrice: 0,
          discount: 0,
          image: 'https://m.media-amazon.com/images/I/71kxLPqNOlL._AC_UX679_.jpg',
          stock: 25,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProduct = ({ item }) => (
    <ProductCard
      product={item}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Chargement des produits...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#000', COLORS.primaryDark, COLORS.primary]}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Boutique Wydad</Text>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Ionicons name="cart-outline" size={28} color={COLORS.white} />
            {/* Badge nombre articles - à implémenter avec CartContext */}
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un produit..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Products List */}
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="sad-outline" size={64} color={COLORS.textSecondary} />
              <Text style={styles.emptyText}>Aucun produit trouvé</Text>
            </View>
          }
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: COLORS.white,
    marginTop: SPACING.md,
    fontSize: FONTS.body1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: FONTS.h3,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  cartButton: {
    padding: SPACING.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    margin: SPACING.lg,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchInput: {
    flex: 1,
    padding: SPACING.md,
    fontSize: FONTS.body1,
    color: COLORS.white,
  },
  listContent: {
    padding: SPACING.lg,
    paddingTop: 0,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SPACING.xxl,
  },
  emptyText: {
    fontSize: FONTS.body1,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
});
