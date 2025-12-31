// src/screens/HomeScreen.js
import React from 'react';


import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../utils';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark, '#000']}
        style={styles.container}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Bienvenue,</Text>
              <Text style={styles.userName}>{user?.displayName || 'Fan Wydad'} 🏆</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('ProfileTab')}>
              <Ionicons name="person-circle-outline" size={40} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Image
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/25/Wydad_AC_logo.svg/1200px-Wydad_AC_logo.svg.png' }}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Wydad Athletic Club</Text>
            <Text style={styles.subtitle}>Bienvenue chez les Champions</Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: COLORS.primary }]}
              onPress={() => navigation.navigate('ShopTab')}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>🛍️</Text>
              </View>
              <Text style={styles.actionTitle}>Boutique</Text>
              <Text style={styles.actionSubtitle}>Produits officiels</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#FFD700' }]}
              onPress={() => navigation.navigate('TicketsTab')}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>🎫</Text>
              </View>
              <Text style={[styles.actionTitle, { color: '#000' }]}>Billets</Text>
              <Text style={[styles.actionSubtitle, { color: '#333' }]}>Réserver matchs</Text>
            </TouchableOpacity>
          </View>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>🏆 3</Text>
              <Text style={styles.statLabel}>Champions League</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>⭐ 22</Text>
              <Text style={styles.statLabel}>Botola</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>👥 12M</Text>
              <Text style={styles.statLabel}>Fans</Text>
            </View>
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color={COLORS.accent} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Prochain Match</Text>
              <Text style={styles.infoText}>Wydad vs Raja - 15 Jan 2026</Text>
            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  greeting: {
    fontSize: FONTS.body1,
    color: COLORS.white,
    opacity: 0.8,
  },
  userName: {
    fontSize: FONTS.h3,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
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
  },
  subtitle: {
    fontSize: FONTS.body1,
    color: COLORS.white,
    opacity: 0.8,
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  actionCard: {
    flex: 1,
    borderRadius: 20,
    padding: SPACING.lg,
    alignItems: 'center',
    minHeight: 160,
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: SPACING.md,
  },
  icon: {
    fontSize: 48,
  },
  actionTitle: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.bold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  actionSubtitle: {
    fontSize: FONTS.body2,
    color: COLORS.white,
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: SPACING.lg,
    gap: SPACING.md,
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
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: FONTS.caption,
    color: COLORS.white,
    opacity: 0.7,
    textAlign: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    margin: SPACING.lg,
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.accent,
    alignItems: 'center',
  },
  infoTextContainer: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  infoTitle: {
    fontSize: FONTS.body2,
    fontWeight: FONTS.semiBold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  infoText: {
    fontSize: FONTS.body2,
    color: COLORS.white,
    opacity: 0.8,
  },
});
