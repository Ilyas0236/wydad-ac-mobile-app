// src/screens/Auth/ProfileScreen.js
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../../utils';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  // ============================================
  // USER STATS (Mock data - replace with real data)
  // ============================================
  const userStats = {
    orders: 12,
    tickets: 5,
    favorites: 8,
  };

  // ============================================
  // HANDLERS
  // ============================================
  const handleLogout = useCallback(() => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { 
          text: 'Annuler', 
          style: 'cancel' 
        },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              console.log('🔄 Logging out...');
              await logout();
              console.log('✅ Logout successful');
            } catch (error) {
              console.error('❌ Logout error:', error);
              Alert.alert('Erreur', 'Impossible de se déconnecter');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  }, [logout]);

  const handleEditProfile = useCallback(() => {
    Alert.alert(
      'Modifier le profil',
      'Fonctionnalité en cours de développement',
      [{ text: 'OK' }]
    );
  }, []);

  const handleMyOrders = useCallback(() => {
    Alert.alert(
      'Mes Commandes',
      'Fonctionnalité en cours de développement',
      [{ text: 'OK' }]
    );
  }, []);

  const handleMyTickets = useCallback(() => {
    if (navigation) {
      navigation.navigate('TicketsTab', { screen: 'MyTickets' });
    }
  }, [navigation]);

  const handleFavorites = useCallback(() => {
    Alert.alert(
      'Favoris',
      'Fonctionnalité en cours de développement',
      [{ text: 'OK' }]
    );
  }, []);

  const handleSettings = useCallback(() => {
    Alert.alert(
      'Paramètres',
      'Fonctionnalité en cours de développement',
      [{ text: 'OK' }]
    );
  }, []);

  const handleHelp = useCallback(() => {
    Alert.alert(
      'Aide & Support',
      'Contactez-nous:\n\nEmail: support@wydad.com\nTel: +212 522 270 927',
      [{ text: 'OK' }]
    );
  }, []);

  // ============================================
  // RENDER
  // ============================================
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark, '#000']}
        style={styles.container}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Mon Profil</Text>
          </View>

          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: user?.photoURL || 
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'User')}&background=DC0714&color=fff&size=200`
                }}
                style={styles.avatar}
              />
              <TouchableOpacity 
                style={styles.editAvatarButton}
                onPress={handleEditProfile}
                activeOpacity={0.7}
              >
                <Ionicons name="camera" size={16} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.userName}>
              {user?.displayName || 'Utilisateur'}
            </Text>
            <Text style={styles.userEmail}>{user?.email}</Text>

            {/* Edit Profile Button */}
            <TouchableOpacity 
              style={styles.editProfileButton}
              onPress={handleEditProfile}
              activeOpacity={0.8}
            >
              <Ionicons name="create-outline" size={18} color={COLORS.primary} />
              <Text style={styles.editProfileText}>Modifier le profil</Text>
            </TouchableOpacity>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="cart" size={24} color={COLORS.accent} />
              <Text style={styles.statNumber}>{userStats.orders}</Text>
              <Text style={styles.statLabel}>Commandes</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="ticket" size={24} color={COLORS.accent} />
              <Text style={styles.statNumber}>{userStats.tickets}</Text>
              <Text style={styles.statLabel}>Billets</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="heart" size={24} color={COLORS.accent} />
              <Text style={styles.statNumber}>{userStats.favorites}</Text>
              <Text style={styles.statLabel}>Favoris</Text>
            </View>
          </View>

          {/* Menu Section */}
          <View style={styles.menuContainer}>
            <Text style={styles.sectionTitle}>Général</Text>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleMyOrders}
              activeOpacity={0.7}
            >
              <Ionicons name="cart-outline" size={24} color={COLORS.white} />
              <Text style={styles.menuText}>Mes Commandes</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleMyTickets}
              activeOpacity={0.7}
            >
              <Ionicons name="ticket-outline" size={24} color={COLORS.white} />
              <Text style={styles.menuText}>Mes Billets</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleFavorites}
              activeOpacity={0.7}
            >
              <Ionicons name="heart-outline" size={24} color={COLORS.white} />
              <Text style={styles.menuText}>Favoris</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Préférences</Text>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleSettings}
              activeOpacity={0.7}
            >
              <Ionicons name="settings-outline" size={24} color={COLORS.white} />
              <Text style={styles.menuText}>Paramètres</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleHelp}
              activeOpacity={0.7}
            >
              <Ionicons name="help-circle-outline" size={24} color={COLORS.white} />
              <Text style={styles.menuText}>Aide & Support</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>

            {/* Logout Button */}
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
              <Text style={styles.logoutText}>
                {loading ? 'Déconnexion...' : 'Déconnexion'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* App Version */}
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Wydad Fan App v1.0.0</Text>
            <Text style={styles.versionSubtext}>© 2026 Wydad Athletic Club</Text>
          </View>
        </ScrollView>
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
    fontSize: FONTS.h2,
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
    position: 'relative',
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
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
    marginBottom: SPACING.md,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    gap: SPACING.xs,
  },
  editProfileText: {
    fontSize: FONTS.body2,
    color: COLORS.primary,
    fontWeight: FONTS.semiBold,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statNumber: {
    fontSize: FONTS.h3,
    fontWeight: FONTS.bold,
    color: COLORS.white,
    marginTop: SPACING.xs,
  },
  statLabel: {
    fontSize: FONTS.caption,
    color: COLORS.white,
    opacity: 0.7,
    marginTop: 4,
  },
  menuContainer: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.body2,
    color: COLORS.white,
    opacity: 0.6,
    fontWeight: FONTS.semiBold,
    marginBottom: SPACING.md,
    marginTop: SPACING.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
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
    marginTop: SPACING.xl,
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
  versionContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  versionText: {
    fontSize: FONTS.caption,
    color: COLORS.white,
    opacity: 0.5,
  },
  versionSubtext: {
    fontSize: FONTS.caption,
    color: COLORS.white,
    opacity: 0.3,
    marginTop: 4,
  },
});
