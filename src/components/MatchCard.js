// src/components/MatchCard.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../utils';

export default function MatchCard({ match, onPress }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('fr-FR', options);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = () => {
    switch (match.status) {
      case 'available':
        return COLORS.success;
      case 'selling-fast':
        return COLORS.accent;
      case 'sold-out':
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusText = () => {
    switch (match.status) {
      case 'available':
        return 'Disponible';
      case 'selling-fast':
        return 'Vente rapide';
      case 'sold-out':
        return 'Complet';
      default:
        return '';
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(match)}
      disabled={match.status === 'sold-out'}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['rgba(220, 7, 20, 0.2)', 'rgba(0, 0, 0, 0.8)']}
        style={styles.gradient}
      >
        {/* Header - Competition */}
        <View style={styles.header}>
          <View style={styles.competitionBadge}>
            <Ionicons name="trophy" size={14} color={COLORS.accent} />
            <Text style={styles.competitionText}>{match.competition}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        </View>

        {/* Teams */}
        <View style={styles.teamsContainer}>
          {/* Wydad */}
          <View style={styles.team}>
            <Image
              source={{ uri: match.homeTeamLogo }}
              style={styles.teamLogo}
              resizeMode="contain"
            />
            <Text style={styles.teamName}>{match.homeTeam}</Text>
          </View>

          {/* VS */}
          <View style={styles.vsContainer}>
            <Text style={styles.vsText}>VS</Text>
          </View>

          {/* Adversaire */}
          <View style={styles.team}>
            <Image
              source={{ uri: match.awayTeamLogo }}
              style={styles.teamLogo}
              resizeMode="contain"
            />
            <Text style={styles.teamName}>{match.awayTeam}</Text>
          </View>
        </View>

        {/* Info Match */}
        <View style={styles.infoContainer}>
          {/* Date & Heure */}
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
            <Text style={styles.infoText}>
              {formatDate(match.date)} • {formatTime(match.date)}
            </Text>
          </View>

          {/* Stade */}
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color={COLORS.primary} />
            <Text style={styles.infoText}>{match.stadium}</Text>
          </View>
        </View>

        {/* Footer - Prix */}
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>À partir de</Text>
            <Text style={styles.priceValue}>{match.price} MAD</Text>
          </View>

          <View style={[styles.actionButton, match.status === 'sold-out' && styles.actionButtonDisabled]}>
            <Text style={[styles.actionButtonText, match.status === 'sold-out' && styles.actionButtonTextDisabled]}>
              {match.status === 'sold-out' ? 'Complet' : 'Réserver'}
            </Text>
            {match.status !== 'sold-out' && (
              <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
            )}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(220, 7, 20, 0.3)',
  },
  gradient: {
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  competitionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
    gap: 4,
  },
  competitionText: {
    fontSize: FONTS.caption,
    color: COLORS.accent,
    fontWeight: FONTS.semiBold,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
  },
  statusText: {
    fontSize: FONTS.caption,
    color: COLORS.white,
    fontWeight: FONTS.bold,
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  team: {
    flex: 1,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  teamLogo: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 30,
    padding: SPACING.sm,
  },
  teamName: {
    fontSize: FONTS.body2,
    color: COLORS.white,
    fontWeight: FONTS.bold,
    textAlign: 'center',
  },
  vsContainer: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: SPACING.sm,
  },
  vsText: {
    fontSize: FONTS.body2,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  infoContainer: {
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  infoText: {
    fontSize: FONTS.body2,
    color: COLORS.white,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  priceValue: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 12,
    gap: SPACING.xs,
  },
  actionButtonDisabled: {
    backgroundColor: COLORS.textSecondary,
  },
  actionButtonText: {
    fontSize: FONTS.button,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  actionButtonTextDisabled: {
    color: COLORS.white,
  },
});
