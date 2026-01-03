// src/components/ProductCard.js
import React, { useMemo } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { COLORS, FONTS, SPACING } from '../utils';

// ============================================
// PRODUCT CARD COMPONENT
// ============================================
const ProductCard = React.memo(({ product, onPress }) => {
  // ============================================
  // COMPUTED VALUES
  // ============================================
  const hasDiscount = useMemo(() => {
    return product.discount && product.discount > 0;
  }, [product.discount]);

  const isLowStock = useMemo(() => {
    return product.stock < 10 && product.stock > 0;
  }, [product.stock]);

  const isOutOfStock = useMemo(() => {
    return product.stock === 0;
  }, [product.stock]);

  // ============================================
  // HANDLERS
  // ============================================
  const handlePress = () => {
    if (onPress && !isOutOfStock) {
      onPress(product);
    }
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={isOutOfStock}
    >
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Discount Badge */}
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{product.discount}%</Text>
          </View>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <View style={styles.outOfStockOverlay}>
            <View style={styles.outOfStockBadge}>
              <Ionicons name="close-circle" size={20} color={COLORS.white} />
              <Text style={styles.outOfStockOverlayText}>Rupture</Text>
            </View>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        {/* Product Name */}
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        {/* Category */}
        <View style={styles.categoryContainer}>
          <Ionicons name="pricetag" size={12} color={COLORS.accent} />
          <Text style={styles.category}>{product.category}</Text>
        </View>

        {/* Price */}
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{product.price} MAD</Text>
          {hasDiscount && product.oldPrice && (
            <Text style={styles.oldPrice}>{product.oldPrice} MAD</Text>
          )}
        </View>

        {/* Stock Status */}
        {isLowStock && (
          <View style={styles.stockWarning}>
            <Ionicons name="warning" size={12} color={COLORS.warning} />
            <Text style={styles.lowStockText}>
              Plus que {product.stock} en stock !
            </Text>
          </View>
        )}
        
        {isOutOfStock && (
          <View style={styles.stockWarning}>
            <Ionicons name="close-circle" size={12} color={COLORS.error} />
            <Text style={styles.outOfStockText}>Rupture de stock</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
});

// ============================================
// PROP TYPES
// ============================================
ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    stock: PropTypes.number.isRequired,
    discount: PropTypes.number,
    oldPrice: PropTypes.number,
  }).isRequired,
  onPress: PropTypes.func,
};

ProductCard.defaultProps = {
  onPress: null,
};

ProductCard.displayName = 'ProductCard';

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
    flex: 1,
    marginHorizontal: SPACING.xs,
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
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.error,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    gap: SPACING.xs,
  },
  outOfStockOverlayText: {
    color: COLORS.white,
    fontSize: FONTS.body2,
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
    minHeight: 40,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: SPACING.sm,
  },
  category: {
    fontSize: FONTS.caption,
    color: COLORS.accent,
    textTransform: 'uppercase',
    fontWeight: FONTS.semiBold,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
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
  stockWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: SPACING.xs,
  },
  lowStockText: {
    fontSize: FONTS.caption,
    color: COLORS.warning,
    fontWeight: FONTS.semiBold,
  },
  outOfStockText: {
    fontSize: FONTS.caption,
    color: COLORS.error,
    fontWeight: FONTS.semiBold,
  },
});

export default ProductCard;
