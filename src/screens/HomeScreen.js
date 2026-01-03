// src/screens/HomeScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../utils';
import { useAuth } from '../context/AuthContext';
import { getUpcomingMatches } from '../services/ticketService';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [nextMatch, setNextMatch] = useState(null);

  // ============================================
  // LOAD NEXT MATCH
  // ============================================
  useEffect(() => {
    loadNextMatch();
  }, []);

  const loadNextMatch = async () => {
    try {
      const matches = await getUpcomingMatches();
      if (matches && matches.length > 0) {
        setNextMatch(matches[0]); // First upcoming match
      }
    } catch (error) {
      console.error('❌ Error loading next match:', error);
    }
  };

  // ============================================
  // NAVIGATION HANDLERS
  // ============================================
  const handleShopPress = useCallback(() => {
    navigation.navigate('ShopTab');
  }, [navigation]);

  const handleTicketsPress = useCallback(() => {
    navigation.navigate('TicketsTab');
  }, [navigation]);

  const handleStoresMapPress = useCallback(() => {
    navigation.navigate('StoresMap');
  }, [navigation]);

  const handleProfilePress = useCallback(() => {
    navigation.navigate('ProfileTab');
  }, [navigation]);

  const handleNextMatchPress = useCallback(() => {
    if (nextMatch) {
      navigation.navigate('TicketsTab', { 
        screen: 'TicketBooking',
        params: { match: nextMatch }
      });
    } else {
      navigation.navigate('TicketsTab');
    }
  }, [navigation, nextMatch]);

  // ============================================
  // FORMAT MATCH DATE
  // ============================================
  const formatMatchDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark, '#000']}
        style={styles.container}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Bienvenue,</Text>
              <Text style={styles.userName}>
                {user?.displayName || 'Fan Wydad'} 🏆
              </Text>
            </View>
            <TouchableOpacity 
              onPress={handleProfilePress}
              activeOpacity={0.7}
            >
              <Ionicons name="person-circle-outline" size={40} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Image
              source={{ 
                uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/25/Wydad_AC_logo.svg/1200px-Wydad_AC_logo.svg.png' 
              }}
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
              onPress={handleShopPress}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>🛍️</Text>
              </View>
              <Text style={styles.actionTitle}>Boutique</Text>
              <Text style={styles.actionSubtitle}>Produits officiels</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#FFD700' }]}
              onPress={handleTicketsPress}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>🎫</Text>
              </View>
              <Text style={[styles.actionTitle, { color: '#000' }]}>Billets</Text>
              <Text style={[styles.actionSubtitle, { color: '#333' }]}>Réserver matchs</Text>
            </TouchableOpacity>
          </View>

          {/* Stores Map Card */}
          <TouchableOpacity
            style={styles.mapCard}
            onPress={handleStoresMapPress}
            activeOpacity={0.8}
          >
            <View style={styles.mapCardLeft}>
              <Ionicons name="location" size={40} color={COLORS.primary} />
              <View style={styles.mapCardText}>
                <Text style={styles.mapCardTitle}>Boutiques Wydad</Text>
                <Text style={styles.mapCardSubtitle}>4 boutiques à Casablanca</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.white} />
          </TouchableOpacity>

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

          {/* Next Match Card */}
          <TouchableOpacity
            style={styles.infoCard}
            onPress={handleNextMatchPress}
            activeOpacity={0.8}
          >
            <Ionicons name="information-circle" size={24} color={COLORS.accent} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Prochain Match</Text>
              {nextMatch ? (
                <Text style={styles.infoText}>
                  {nextMatch.homeTeam} vs {nextMatch.awayTeam} - {formatMatchDate(nextMatch.date)}
                </Text>
              ) : (
                <Text style={styles.infoText}>Aucun match programmé</Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.accent} />
          </TouchableOpacity>
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
  scrollContent: {
    paddingBottom: SPACING.xl,
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONTS.body1,
    color: COLORS.white,
    opacity: 0.8,
    textAlign: 'center',
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
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: FONTS.body2,
    color: COLORS.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  mapCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  mapCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  mapCardText: {
    marginLeft: SPACING.md,
  },
  mapCardTitle: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.bold,
    color: COLORS.white,
    marginBottom: 4,
  },
  mapCardSubtitle: {
    fontSize: FONTS.body2,
    color: COLORS.textSecondary,
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
