// src/screens/Auth/RegisterScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING } from '../../utils';
import { registerUser } from '../../services/authService';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    const result = await registerUser(email, password, name);
    setLoading(false);

    if (result.success) {
      Alert.alert('Succès', 'Compte créé avec succès !');
      // Navigation automatique via AuthContext
    } else {
      Alert.alert('Erreur d\'inscription', result.error);
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.primaryDark, '#000']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Retour</Text>
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/25/Wydad_AC_logo.svg/1200px-Wydad_AC_logo.svg.png' }}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>Rejoignez la famille Wydad</Text>
          </View>

          {/* Formulaire */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nom complet</Text>
              <TextInput
                style={styles.input}
                placeholder="Mohammed Alaoui"
                placeholderTextColor={COLORS.textSecondary}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="votre@email.com"
                placeholderTextColor={COLORS.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mot de passe</Text>
              <TextInput
                style={styles.input}
                placeholder="Min. 6 caractères"
                placeholderTextColor={COLORS.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirmer mot de passe</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={COLORS.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            {/* Bouton Inscription */}
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.primary} />
              ) : (
                <Text style={styles.registerButtonText}>CRÉER MON COMPTE</Text>
              )}
            </TouchableOpacity>

            {/* Lien Connexion */}
            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginText}>
                Déjà un compte ?{' '}
                <Text style={styles.loginTextBold}>Se connecter</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
    paddingTop: SPACING.xxl,
  },
  backButton: {
    marginBottom: SPACING.md,
  },
  backButtonText: {
    fontSize: FONTS.body1,
    color: COLORS.white,
    fontWeight: FONTS.semiBold,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONTS.h2,
    fontWeight: FONTS.bold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONTS.body1,
    color: COLORS.white,
    opacity: 0.8,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: SPACING.xl,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONTS.body2,
    color: COLORS.white,
    marginBottom: SPACING.sm,
    fontWeight: FONTS.semiBold,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: FONTS.body1,
    color: COLORS.white,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  registerButton: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  registerButtonText: {
    fontSize: FONTS.button,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
  },
  loginLink: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  loginText: {
    fontSize: FONTS.body2,
    color: COLORS.white,
  },
  loginTextBold: {
    fontWeight: FONTS.bold,
    textDecorationLine: 'underline',
  },
});
