// src/components/MatchCard.js
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { COLORS, FONTS, SPACING } from '../utils';

// ============================================
// MATCH CARD COMPONENT
// ============================================
const MatchCard = React.memo(({ match, onPress }) => {
  // ============================================
  // DATE FORMATTING
  // ============================================
  const formattedDate = useMemo(() => {
    try {
      const date = new Date(match.date);
      const options = { weekday: 'short', day: 'numeric', month: 'short' };
      return date.toLocaleDateString('fr-FR', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return match.date;
    }
  }, [match.date]);

  const formattedTime = useMemo(() => {
    try {
      const date = new Date(match.date);
      return date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  }, [match.date]);

  // ============================================
  // STATUS HELPERS
  // ============================================
  const statusColor = useMemo(() => {
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
  }, [match.status]);

  const statusText = useMemo(() => {
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
  }, [match.status]);

  const isSoldOut = match.status === 'sold-out';

  // ============================================
  // HANDLERS
  // ============================================
  const handlePress = () => {
    if (!isSoldOut && onPress) {
      onPress(match);
    }
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      disabled={isSoldOut}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['rgba(220, 7, 20, 0.2)', 'rgba(0, 0, 0, 0.8)']}
        style={styles.gradient}
      >
        {/* Header - Competition & Status */}
        <View style={styles.header}>
          <View style={styles.competitionBadge}>
            <Ionicons name="trophy" size={14} color={COLORS.accent} />
            <Text style={styles.competitionText}>{match.competition}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{statusText}</Text>
          </View>
        </View>

        {/* Teams */}
        <View style={styles.teamsContainer}>
          {/* Home Team (Wydad) */}
          <View style={styles.team}>
            <Image
              source={{ uri: match.homeTeamLogo }}
              style={styles.teamLogo}
              resizeMode="contain"
            />
            <Text style={styles.teamName} numberOfLines={2}>
              {match.homeTeam}
            </Text>
          </View>

          {/* VS Badge */}
          <View style={styles.vsContainer}>
            <Text style={styles.vsText}>VS</Text>
          </View>

          {/* Away Team */}
          <View style={styles.team}>
            <Image
              source={{ uri: match.awayTeamLogo }}
              style={styles.teamLogo}
              resizeMode="contain"
            />
            <Text style={styles.teamName} numberOfLines={2}>
              {match.awayTeam}
            </Text>
          </View>
        </View>

        {/* Match Info */}
        <View style={styles.infoContainer}>
          {/* Date & Time */}
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
            <Text style={styles.infoText}>
              {formattedDate} • {formattedTime}
            </Text>
          </View>

          {/* Stadium */}
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color={COLORS.primary} />
            <Text style={styles.infoText} numberOfLines={1}>
              {match.stadium}
            </Text>
          </View>
        </View>

        {/* Footer - Price & Action */}
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>À partir de</Text>
            <Text style={styles.priceValue}>{match.price} MAD</Text>
          </View>

          <View style={[
            styles.actionButton, 
            isSoldOut && styles.actionButtonDisabled
          ]}>
            <Text style={[
              styles.actionButtonText,
              isSoldOut && styles.actionButtonTextDisabled
            ]}>
              {isSoldOut ? 'Complet' : 'Réserver'}
            </Text>
            {!isSoldOut && (
              <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
            )}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
});

// ============================================
// PROP TYPES
// ============================================
MatchCard.propTypes = {
  match: PropTypes.shape({
    id: PropTypes.string.isRequired,
    homeTeam: PropTypes.string.isRequired,
    awayTeam: PropTypes.string.isRequired,
    homeTeamLogo: PropTypes.string.isRequired,
    awayTeamLogo: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    stadium: PropTypes.string.isRequired,
    competition: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    status: PropTypes.oneOf(['available', 'selling-fast', 'sold-out']).isRequired,
  }).isRequired,
  onPress: PropTypes.func,
};

MatchCard.defaultProps = {
  onPress: null,
};

MatchCard.displayName = 'MatchCard';

// ============================================
// STYLES
// ============================================
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
    flex: 1,
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

export default MatchCard;
