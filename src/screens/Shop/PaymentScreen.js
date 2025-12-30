// src/screens/Shop/PaymentScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../../utils';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function PaymentScreen({ navigation }) {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  
  // Champs carte bancaire
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  
  // Champs adresse livraison
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const paymentMethods = [
    { id: 'card', name: 'Carte Bancaire', icon: 'card-outline' },
    { id: 'mobile', name: 'Mobile Money', icon: 'phone-portrait-outline' },
    { id: 'cash', name: 'Cash à la livraison', icon: 'cash-outline' },
  ];

  const handlePayment = async () => {
    // Validation
    if (!address || !phone) {
      Alert.alert('Erreur', 'Veuillez remplir l\'adresse et le téléphone');
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardName || !cardNumber || !cardExpiry || !cardCVV) {
        Alert.alert('Erreur', 'Veuillez remplir tous les champs de la carte');
        return;
      }
      if (cardNumber.length < 16) {
        Alert.alert('Erreur', 'Numéro de carte invalide');
        return;
      }
    }

    setLoading(true);

    // SIMULER le traitement du paiement (2 secondes)
    setTimeout(async () => {
      try {
        // Ici vous pouvez créer la commande dans Firebase
        const order = {
          userId: user?.uid || 'guest',
          userEmail: user?.email || 'guest@wydad.com',
          items: cart,
          total: getTotalPrice(),
          paymentMethod,
          address,
          phone,
          status: 'paid',
          createdAt: new Date().toISOString(),
        };

        console.log('Commande créée:', order);
        // await addDoc(collection(db, 'orders'), order);

        // Vider le panier
        clearCart();

        setLoading(false);

        // Alert de succès
        Alert.alert(
          '✅ Paiement réussi !',
          `Votre commande de ${getTotalPrice()} MAD a été confirmée.\n\nVous recevrez un email de confirmation.`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Retourner à la boutique
                navigation.navigate('ShopTab', { screen: 'ProductList' });
              },
            },
          ]
        );
      } catch (error) {
        setLoading(false);
        Alert.alert('Erreur', 'Impossible de finaliser la commande');
      }
    }, 2000);
  };

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
          <Text style={styles.headerTitle}>Paiement</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Résumé commande */}
          <View style={styles.summaryCard}>
            <Text style={styles.sectionTitle}>Résumé</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Articles ({cart.length})</Text>
              <Text style={styles.summaryValue}>{getTotalPrice()} MAD</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Livraison</Text>
              <Text style={styles.summaryValueFree}>Gratuite</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{getTotalPrice()} MAD</Text>
            </View>
          </View>

          {/* Adresse de livraison */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Livraison</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Adresse complète *</Text>
              <TextInput
                style={styles.input}
                placeholder="Rue, Quartier, Ville"
                placeholderTextColor={COLORS.textSecondary}
                value={address}
                onChangeText={setAddress}
                multiline
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Téléphone *</Text>
              <TextInput
                style={styles.input}
                placeholder="+212 6XX XXX XXX"
                placeholderTextColor={COLORS.textSecondary}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Méthode de paiement */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Méthode de paiement</Text>
            
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethodButton,
                  paymentMethod === method.id && styles.paymentMethodButtonActive
                ]}
                onPress={() => setPaymentMethod(method.id)}
              >
                <Ionicons 
                  name={method.icon} 
                  size={24} 
                  color={paymentMethod === method.id ? COLORS.primary : COLORS.white} 
                />
                <Text style={[
                  styles.paymentMethodText,
                  paymentMethod === method.id && styles.paymentMethodTextActive
                ]}>
                  {method.name}
                </Text>
                <View style={[
                  styles.radioButton,
                  paymentMethod === method.id && styles.radioButtonActive
                ]}>
                  {paymentMethod === method.id && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}

            {/* Formulaire carte bancaire */}
            {paymentMethod === 'card' && (
              <View style={styles.cardForm}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Nom sur la carte *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MOHAMMED ALAOUI"
                    placeholderTextColor={COLORS.textSecondary}
                    value={cardName}
                    onChangeText={setCardName}
                    autoCapitalize="characters"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Numéro de carte *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="1234 5678 9012 3456"
                    placeholderTextColor={COLORS.textSecondary}
                    value={cardNumber}
                    onChangeText={(text) => setCardNumber(text.replace(/\s/g, ''))}
                    keyboardType="numeric"
                    maxLength={16}
                  />
                </View>

                <View style={styles.rowInputs}>
                  <View style={[styles.inputContainer, { flex: 1 }]}>
                    <Text style={styles.label}>Expiration *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="MM/AA"
                      placeholderTextColor={COLORS.textSecondary}
                      value={cardExpiry}
                      onChangeText={setCardExpiry}
                      keyboardType="numeric"
                      maxLength={5}
                    />
                  </View>

                  <View style={[styles.inputContainer, { flex: 1 }]}>
                    <Text style={styles.label}>CVV *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="123"
                      placeholderTextColor={COLORS.textSecondary}
                      value={cardCVV}
                      onChangeText={setCardCVV}
                      keyboardType="numeric"
                      maxLength={3}
                      secureTextEntry
                    />
                  </View>
                </View>
              </View>
            )}

            {/* Info Mobile Money */}
            {paymentMethod === 'mobile' && (
              <View style={styles.infoBox}>
                <Ionicons name="information-circle" size={20} color={COLORS.accent} />
                <Text style={styles.infoText}>
                  Vous recevrez un SMS pour confirmer le paiement via votre opérateur mobile.
                </Text>
              </View>
            )}

            {/* Info Cash */}
            {paymentMethod === 'cash' && (
              <View style={styles.infoBox}>
                <Ionicons name="information-circle" size={20} color={COLORS.accent} />
                <Text style={styles.infoText}>
                  Payez en espèces à la réception de votre commande.
                </Text>
              </View>
            )}
          </View>

          {/* Sécurité */}
          <View style={styles.securityInfo}>
            <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
            <Text style={styles.securityText}>
              Paiement 100% sécurisé · Données cryptées
            </Text>
          </View>
        </ScrollView>

        {/* Footer - Bouton Payer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.payButton}
            onPress={handlePayment}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Ionicons name="lock-closed" size={20} color={COLORS.white} />
                <Text style={styles.payButtonText}>
                  Payer {getTotalPrice()} MAD
                </Text>
              </>
            )}
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
    fontSize: FONTS.h3,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  summaryCard: {
    backgroundColor: 'rgba(220, 7, 20, 0.2)',
    margin: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    margin: SPACING.lg,
    marginTop: 0,
    padding: SPACING.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.bold,
    color: COLORS.white,
    marginBottom: SPACING.md,
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
  summaryValueFree: {
    fontSize: FONTS.body2,
    fontWeight: FONTS.medium,
    color: COLORS.success,
  },
  totalRow: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  totalLabel: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  totalValue: {
    fontSize: FONTS.h3,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  inputContainer: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONTS.body2,
    color: COLORS.white,
    marginBottom: SPACING.sm,
    fontWeight: FONTS.medium,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: FONTS.body1,
    color: COLORS.white,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  paymentMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  paymentMethodButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(220, 7, 20, 0.1)',
  },
  paymentMethodText: {
    flex: 1,
    fontSize: FONTS.body1,
    color: COLORS.white,
    marginLeft: SPACING.md,
    fontWeight: FONTS.medium,
  },
  paymentMethodTextActive: {
    color: COLORS.primary,
    fontWeight: FONTS.semiBold,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonActive: {
    borderColor: COLORS.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  cardForm: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: SPACING.md,
    borderRadius: 12,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  infoText: {
    flex: 1,
    fontSize: FONTS.body2,
    color: COLORS.white,
    lineHeight: 20,
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.lg,
  },
  securityText: {
    fontSize: FONTS.body2,
    color: COLORS.success,
    fontWeight: FONTS.medium,
  },
  footer: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  payButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  payButtonText: {
    fontSize: FONTS.button,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
});
