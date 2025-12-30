// src/components/ProductCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../utils';

export default function ProductCard({ product, onPress }) {
  const hasDiscount = product.discount > 0;

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{product.discount}%</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        
        <Text style={styles.category}>{product.category}</Text>

        {/* Prix */}
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{product.price} MAD</Text>
          {hasDiscount && (
            <Text style={styles.oldPrice}>{product.oldPrice} MAD</Text>
          )}
        </View>

        {/* Stock */}
        {product.stock < 10 && product.stock > 0 && (
          <Text style={styles.lowStock}>Plus que {product.stock} en stock !</Text>
        )}
        {product.stock === 0 && (
          <Text style={styles.outOfStock}>Rupture de stock</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#FFF',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
  },
  discountText: {
    color: COLORS.white,
    fontSize: FONTS.caption,
    fontWeight: FONTS.bold,
  },
  infoContainer: {
    padding: SPACING.md,
  },
  name: {
    fontSize: FONTS.body1,
    fontWeight: FONTS.semiBold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  category: {
    fontSize: FONTS.caption,
    color: COLORS.accent,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  price: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  oldPrice: {
    fontSize: FONTS.body2,
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
  },
  lowStock: {
    fontSize: FONTS.caption,
    color: COLORS.warning,
    marginTop: SPACING.xs,
  },
  outOfStock: {
    fontSize: FONTS.caption,
    color: COLORS.error,
    marginTop: SPACING.xs,
    fontWeight: FONTS.semiBold,
  },
});
