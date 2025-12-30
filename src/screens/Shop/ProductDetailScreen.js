// src/screens/Shop/ProductDetailScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../../utils';
import { useCart } from '../../context/CartContext';

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');

  const sizes = ['S', 'M', 'L', 'XL'];

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity,
      size: selectedSize,
    });
    Alert.alert(
      'Ajouté au panier !',
      `${product.name} a été ajouté à votre panier`,
      [
        { text: 'Continuer mes achats', style: 'cancel' },
        { 
          text: 'Voir le panier', 
          onPress: () => navigation.navigate('Cart') 
        },
      ]
    );
  };

  const totalPrice = product.price * quantity;

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#000', COLORS.primaryDark]}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Détails du produit</Text>
          <TouchableOpacity style={styles.cartButton}>
            <Ionicons name="heart-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: product.image }}
              style={styles.image}
              resizeMode="cover"
            />
            {product.discount > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{product.discount}%</Text>
              </View>
            )}
          </View>

          {/* Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.category}>{product.category}</Text>
            <Text style={styles.name}>{product.name}</Text>

            {/* Prix */}
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{product.price} MAD</Text>
              {product.discount > 0 && (
                <Text style={styles.oldPrice}>{product.oldPrice} MAD</Text>
              )}
            </View>

            {/* Stock */}
            <View style={styles.stockContainer}>
              <Ionicons 
                name={product.stock > 0 ? "checkmark-circle" : "close-circle"} 
                size={20} 
                color={product.stock > 0 ? COLORS.success : COLORS.error} 
              />
              <Text style={[
                styles.stockText,
                { color: product.stock > 0 ? COLORS.success : COLORS.error }
              ]}>
                {product.stock > 0 ? `En stock (${product.stock})` : 'Rupture de stock'}
              </Text>
            </View>

            {/* Tailles (si vêtement) */}
            {product.category === 'Maillots' || product.category === 'Vêtements' ? (
              <View style={styles.sizeContainer}>
                <Text style={styles.sectionTitle}>Taille</Text>
                <View style={styles.sizeOptions}>
                  {sizes.map((size) => (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.sizeButton,
                        selectedSize === size && styles.sizeButtonActive
                      ]}
                      onPress={() => setSelectedSize(size)}
                    >
                      <Text style={[
                        styles.sizeText,
                        selectedSize === size && styles.sizeTextActive
                      ]}>
                        {size}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : null}

            {/* Quantité */}
            <View style={styles.quantityContainer}>
              <Text style={styles.sectionTitle}>Quantité</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Ionicons 
                    name="remove" 
                    size={20} 
                    color={quantity <= 1 ? COLORS.textSecondary : COLORS.white} 
                  />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Ionicons 
                    name="add" 
                    size={20} 
                    color={quantity >= product.stock ? COLORS.textSecondary : COLORS.white} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Description */}
            <View style={styles.descriptionContainer}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>
                Produit officiel du Wydad Athletic Club. Haute qualité, 
                confortable et aux couleurs du club champion. Montrez votre 
                fierté rouge ! 🔴⭐
              </Text>
            </View>

            {/* Caractéristiques */}
            <View style={styles.featuresContainer}>
              <View style={styles.feature}>
                <Ionicons name="shield-checkmark" size={20} color={COLORS.accent} />
                <Text style={styles.featureText}>Produit officiel</Text>
              </View>
              <View style={styles.feature}>
                <Ionicons name="sync" size={20} color={COLORS.accent} />
                <Text style={styles.featureText}>Retour 14 jours</Text>
              </View>
              <View style={styles.feature}>
                <Ionicons name="car" size={20} color={COLORS.accent} />
                <Text style={styles.featureText}>Livraison gratuite</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>{totalPrice} MAD</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.addButton,
              product.stock === 0 && styles.addButtonDisabled
            ]}
            onPress={handleAddToCart}
            disabled={product.stock === 0}
          >
            <Ionicons name="cart" size={20} color={COLORS.white} />
            <Text style={styles.addButtonText}>
              {product.stock > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
            </Text>
          </TouchableOpacity>
        </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.semiBold,
    color: COLORS.white,
  },
  cartButton: {
    padding: SPACING.sm,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#FFF',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  discountText: {
    color: COLORS.white,
    fontSize: FONTS.body2,
    fontWeight: FONTS.bold,
  },
  infoContainer: {
    padding: SPACING.lg,
  },
  category: {
    fontSize: FONTS.caption,
    color: COLORS.accent,
    textTransform: 'uppercase',
    fontWeight: FONTS.semiBold,
    marginBottom: SPACING.xs,
  },
  name: {
    fontSize: FONTS.h3,
    fontWeight: FONTS.bold,
    color: COLORS.white,
    marginBottom: SPACING.md,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  price: {
    fontSize: FONTS.h2,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
  },
  oldPrice: {
    fontSize: FONTS.h4,
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  stockText: {
    fontSize: FONTS.body2,
    fontWeight: FONTS.medium,
  },
  sectionTitle: {
    fontSize: FONTS.body1,
    fontWeight: FONTS.semiBold,
    color: COLORS.white,
    marginBottom: SPACING.md,
  },
  sizeContainer: {
    marginBottom: SPACING.lg,
  },
  sizeOptions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  sizeButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sizeText: {
    fontSize: FONTS.body1,
    fontWeight: FONTS.semiBold,
    color: COLORS.white,
  },
  sizeTextActive: {
    color: COLORS.white,
  },
  quantityContainer: {
    marginBottom: SPACING.lg,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: FONTS.h3,
    fontWeight: FONTS.bold,
    color: COLORS.white,
    minWidth: 30,
    textAlign: 'center',
  },
  descriptionContainer: {
    marginBottom: SPACING.lg,
  },
  description: {
    fontSize: FONTS.body2,
    color: COLORS.white,
    opacity: 0.8,
    lineHeight: 22,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  featureText: {
    fontSize: FONTS.caption,
    color: COLORS.white,
    fontWeight: FONTS.medium,
  },
  footer: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  totalLabel: {
    fontSize: FONTS.body1,
    color: COLORS.white,
  },
  totalPrice: {
    fontSize: FONTS.h3,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  addButtonDisabled: {
    backgroundColor: COLORS.textSecondary,
    opacity: 0.5,
  },
  addButtonText: {
    fontSize: FONTS.button,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
});
