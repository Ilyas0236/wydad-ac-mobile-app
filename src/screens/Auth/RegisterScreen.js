// src/screens/Auth/RegisterScreen.js
import React, { useState, useCallback } from 'react';
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
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../../utils';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ============================================
  // VALIDATION
  // ============================================
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre nom');
      return false;
    }

    if (name.trim().length < 2) {
      Alert.alert('Erreur', 'Le nom doit contenir au moins 2 caractères');
      return false;
    }

    if (!email.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre email');
      return false;
    }

    if (!validateEmail(email)) {
      Alert.alert('Erreur', 'Veuillez entrer un email valide');
      return false;
    }

    if (!password) {
      Alert.alert('Erreur', 'Veuillez entrer un mot de passe');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }

    if (!confirmPassword) {
      Alert.alert('Erreur', 'Veuillez confirmer votre mot de passe');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return false;
    }

    return true;
  };

  // ============================================
  // HANDLERS
  // ============================================
  const handleRegister = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      console.log('🔄 Attempting registration...');

      const result = await register(email.trim(), password, name.trim());

      if (result.success) {
        console.log('✅ Registration successful');
        Alert.alert(
          'Succès',
          'Compte créé avec succès ! Bienvenue dans la famille Wydad ! 🏆',
          [{ text: 'OK' }]
        );
        // Navigation automatique via AuthContext
      } else {
        console.error('❌ Registration failed:', result.error);
        Alert.alert('Erreur d\'inscription', result.error);
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  }, [name, email, password, confirmPassword, register]);

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleLoginPress = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword(prev => !prev);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" />
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
            keyboardShouldPersistTaps="handled"
          >
            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
              <Text style={styles.backButtonText}>Retour</Text>
            </TouchableOpacity>

            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={{
                  uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/25/Wydad_AC_logo.svg/1200px-Wydad_AC_logo.svg.png'
                }}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.title}>Créer un compte</Text>
              <Text style={styles.subtitle}>Rejoignez la famille Wydad 🏆</Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              {/* Name Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nom complet</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={COLORS.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Mohammed Alaoui"
                    placeholderTextColor={COLORS.textSecondary}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    editable={!loading}
                  />
                </View>
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={COLORS.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="votre@email.com"
                    placeholderTextColor={COLORS.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Mot de passe</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={COLORS.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Min. 6 caractères"
                    placeholderTextColor={COLORS.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={togglePasswordVisibility}
                    style={styles.eyeIcon}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color={COLORS.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirmer mot de passe</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={COLORS.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="••••••••"
                    placeholderTextColor={COLORS.textSecondary}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={toggleConfirmPasswordVisibility}
                    style={styles.eyeIcon}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color={COLORS.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Register Button */}
              <TouchableOpacity
                style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.primary} />
                ) : (
                  <>
                    <Text style={styles.registerButtonText}>CRÉER MON COMPTE</Text>
                    <Ionicons name="arrow-forward" size={20} color={COLORS.primary} />
                  </>
                )}
              </TouchableOpacity>

              {/* Login Link */}
              <TouchableOpacity
                style={styles.loginLink}
                onPress={handleLoginPress}
                activeOpacity={0.7}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
    paddingTop: SPACING.md,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    gap: SPACING.xs,
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONTS.body1,
    color: COLORS.white,
    opacity: 0.8,
    textAlign: 'center',
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
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: SPACING.md,
    zIndex: 1,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: SPACING.md,
    paddingLeft: SPACING.xl + SPACING.md,
    fontSize: FONTS.body1,
    color: COLORS.white,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  passwordInput: {
    paddingRight: SPACING.xl + SPACING.md,
  },
  eyeIcon: {
    position: 'absolute',
    right: SPACING.md,
    padding: SPACING.sm,
  },
  registerButton: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  registerButtonDisabled: {
    opacity: 0.7,
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
    color: COLORS.accent,
  },
});
