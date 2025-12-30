// src/screens/Shop/CartScreen.js
import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../../utils';
import { useCart } from '../../context/CartContext';

export default function CartScreen({ navigation }) {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();

  const handleRemoveItem = (itemId) => {
    Alert.alert(
      'Supprimer',
      'Voulez-vous retirer cet article du panier ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => removeFromCart(itemId)
        },
      ]
    );
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Panier vide', 'Ajoutez des articles avant de commander');
      return;
    }
    navigation.navigate('Payment');
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      {/* Image */}
      <Image
        source={{ uri: item.image }}
        style={styles.itemImage}
        resizeMode="cover"
      />

      {/* Info */}
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.name}
        </Text>
        {item.size && (
          <Text style={styles.itemSize}>Taille: {item.size}</Text>
        )}
        <Text style={styles.itemPrice}>{item.price} MAD</Text>
      </View>

      {/* Quantity Controls */}
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
          disabled={item.quantity <= 1}
        >
          <Ionicons 
            name="remove" 
            size={16} 
            color={item.quantity <= 1 ? COLORS.textSecondary : COLORS.white} 
          />
        </TouchableOpacity>

        <Text style={styles.quantityText}>{item.quantity}</Text>

        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <Ionicons name="add" size={16} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Delete Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleRemoveItem(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color={COLORS.error} />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cart-outline" size={100} color={COLORS.textSecondary} />
      <Text style={styles.emptyTitle}>Panier vide</Text>
      <Text style={styles.emptyText}>
        Ajoutez des produits pour commencer vos achats
      </Text>
      <TouchableOpacity
        style={styles.shopButton}
        onPress={() => navigation.navigate('ProductList')}
      >
        <Text style={styles.shopButtonText}>Découvrir la boutique</Text>
      </TouchableOpacity>
    </View>
  );

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
          <Text style={styles.headerTitle}>Mon Panier</Text>
          {cart.length > 0 && (
            <TouchableOpacity onPress={clearCart}>
              <Text style={styles.clearText}>Vider</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Cart List */}
        {cart.length === 0 ? (
          renderEmptyCart()
        ) : (
          <>
            <FlatList
              data={cart}
              renderItem={renderCartItem}
              keyExtractor={item => item.id + (item.size || '')}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />

            {/* Footer */}
            <View style={styles.footer}>
              {/* Summary */}
              <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Sous-total</Text>
                  <Text style={styles.summaryValue}>{getTotalPrice()} MAD</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Livraison</Text>
                  <Text style={styles.summaryValue}>Gratuite</Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>{getTotalPrice()} MAD</Text>
                </View>
              </View>

              {/* Checkout Button */}
              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={handleCheckout}
              >
                <Text style={styles.checkoutButtonText}>
                  Commander ({cart.length})
                </Text>
                <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </>
        )}
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
    fontSize: FONTS.h3,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  clearText: {
    fontSize: FONTS.body2,
    color: COLORS.error,
    fontWeight: FONTS.semiBold,
  },
  listContent: {
    padding: SPACING.lg,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#FFF',
  },
  itemInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  itemName: {
    fontSize: FONTS.body1,
    fontWeight: FONTS.semiBold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  itemSize: {
    fontSize: FONTS.caption,
    color: COLORS.accent,
    marginBottom: SPACING.xs,
  },
  itemPrice: {
    fontSize: FONTS.body1,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginRight: SPACING.md,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  quantityText: {
    fontSize: FONTS.body1,
    fontWeight: FONTS.bold,
    color: COLORS.white,
    minWidth: 24,
    textAlign: 'center',
  },
  deleteButton: {
    padding: SPACING.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyTitle: {
    fontSize: FONTS.h2,
    fontWeight: FONTS.bold,
    color: COLORS.white,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONTS.body1,
    color: COLORS.white,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  shopButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 12,
  },
  shopButtonText: {
    fontSize: FONTS.button,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  footer: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  summaryContainer: {
    marginBottom: SPACING.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  summaryLabel: {
    fontSize: FONTS.body2,
    color: COLORS.white,
  },
  summaryValue: {
    fontSize: FONTS.body2,
    fontWeight: FONTS.medium,
    color: COLORS.white,
  },
  totalRow: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  totalLabel: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  totalValue: {
    fontSize: FONTS.h3,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  checkoutButtonText: {
    fontSize: FONTS.button,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
});
