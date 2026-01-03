// src/screens/Auth/LoginScreen.js
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
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../../utils';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ============================================
  // VALIDATION
  // ============================================
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre email');
      return false;
    }

    if (!validateEmail(email)) {
      Alert.alert('Erreur', 'Veuillez entrer un email valide');
      return false;
    }

    if (!password) {
      Alert.alert('Erreur', 'Veuillez entrer votre mot de passe');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }

    return true;
  };

  // ============================================
  // HANDLERS
  // ============================================
  const handleLogin = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      console.log('🔄 Attempting login...');

      const result = await login(email.trim(), password);

      if (result.success) {
        console.log('✅ Login successful');
        // Navigation automatique via AuthContext
      } else {
        console.error('❌ Login failed:', result.error);
        Alert.alert('Erreur de connexion', result.error);
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  }, [email, password, login]);

  const handleRegister = useCallback(() => {
    navigation.navigate('Register');
  }, [navigation]);

  const handleForgotPassword = useCallback(() => {
    Alert.alert(
      'Mot de passe oublié',
      'Fonctionnalité en cours de développement',
      [{ text: 'OK' }]
    );
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
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
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={{ 
                  uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/25/Wydad_AC_logo.svg/1200px-Wydad_AC_logo.svg.png' 
                }}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.title}>Wydad Athletic Club</Text>
              <Text style={styles.subtitle}>Bienvenue</Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
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
                    placeholder="••••••••"
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

              {/* Forgot Password */}
              <TouchableOpacity
                onPress={handleForgotPassword}
                style={styles.forgotPassword}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotPasswordText}>
                  Mot de passe oublié ?
                </Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.primary} />
                ) : (
                  <>
                    <Text style={styles.loginButtonText}>SE CONNECTER</Text>
                    <Ionicons name="arrow-forward" size={20} color={COLORS.primary} />
                  </>
                )}
              </TouchableOpacity>

              {/* Register Link */}
              <TouchableOpacity
                style={styles.registerLink}
                onPress={handleRegister}
                activeOpacity={0.7}
              >
                <Text style={styles.registerText}>
                  Pas de compte ?{' '}
                  <Text style={styles.registerTextBold}>S'inscrire</Text>
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
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logo: {
    width: 100,
    height: 100,
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
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.md,
  },
  forgotPasswordText: {
    fontSize: FONTS.body2,
    color: COLORS.white,
    opacity: 0.8,
  },
  loginButton: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: FONTS.button,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
  },
  registerLink: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  registerText: {
    fontSize: FONTS.body2,
    color: COLORS.white,
  },
  registerTextBold: {
    fontWeight: FONTS.bold,
    textDecorationLine: 'underline',
    color: COLORS.accent,
  },
});
