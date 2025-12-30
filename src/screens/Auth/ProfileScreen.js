// src/screens/Auth/ProfileScreen.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../../utils';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from '../../services/authService';

export default function ProfileScreen() {
  const { user } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            await logoutUser();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark, '#000']}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mon Profil</Text>
        </View>

        {/* Photo de profil */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://ui-avatars.com/api/?name=' + (user?.displayName || 'User') + '&background=DC0714&color=fff&size=200' }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.userName}>{user?.displayName || 'Utilisateur'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        {/* Menu Options */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="cart-outline" size={24} color={COLORS.white} />
            <Text style={styles.menuText}>Mes Commandes</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.white} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="ticket-outline" size={24} color={COLORS.white} />
            <Text style={styles.menuText}>Mes Billets</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.white} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="heart-outline" size={24} color={COLORS.white} />
            <Text style={styles.menuText}>Favoris</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.white} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="settings-outline" size={24} color={COLORS.white} />
            <Text style={styles.menuText}>Paramètres</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.white} />
          </TouchableOpacity>

          {/* Bouton Déconnexion */}
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
            <Text style={styles.logoutText}>Déconnexion</Text>
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
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: FONTS.h3,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  profileSection: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 4,
    borderColor: COLORS.accent,
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  userName: {
    fontSize: FONTS.h3,
    fontWeight: FONTS.bold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontSize: FONTS.body2,
    color: COLORS.white,
    opacity: 0.7,
  },
  menuContainer: {
    padding: SPACING.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuText: {
    flex: 1,
    fontSize: FONTS.body1,
    color: COLORS.white,
    marginLeft: SPACING.md,
    fontWeight: FONTS.medium,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    padding: SPACING.md,
    borderRadius: 12,
    marginTop: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.error,
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: FONTS.body1,
    color: COLORS.error,
    marginLeft: SPACING.sm,
    fontWeight: FONTS.semiBold,
  },
});
