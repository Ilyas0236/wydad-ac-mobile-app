// src/screens/Ticketing/MatchListScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../../utils';
import MatchCard from '../../components/MatchCard';

export default function MatchListScreen({ navigation }) {
  const [selectedFilter, setSelectedFilter] = useState('all');

  // DONNÉES DE TEST - 8 matchs Wydad
  const matches = [
    {
      id: '1',
      homeTeam: 'Wydad AC',
      homeTeamLogo: 'https://upload.wikimedia.org/wikipedia/en/d/d3/Wydad_AC_logo.png',
      awayTeam: 'Raja Casablanca',
      awayTeamLogo: 'https://upload.wikimedia.org/wikipedia/en/5/54/Raja_Casablanca_logo.png',
      competition: 'Botola Pro',
      date: '2026-01-15T20:00:00',
      stadium: 'Stade Mohammed V',
      price: 150,
      status: 'available',
    },
    {
      id: '2',
      homeTeam: 'Wydad AC',
      homeTeamLogo: 'https://upload.wikimedia.org/wikipedia/en/d/d3/Wydad_AC_logo.png',
      awayTeam: 'Al Ahly',
      awayTeamLogo: 'https://upload.wikimedia.org/wikipedia/en/8/8d/Al_Ahly_SC_logo.png',
      competition: 'CAF Champions League',
      date: '2026-01-22T21:00:00',
      stadium: 'Stade Mohammed V',
      price: 200,
      status: 'selling-fast',
    },
    {
      id: '3',
      homeTeam: 'FUS Rabat',
      homeTeamLogo: 'https://upload.wikimedia.org/wikipedia/en/3/3b/FUS_Rabat_logo.png',
      awayTeam: 'Wydad AC',
      awayTeamLogo: 'https://upload.wikimedia.org/wikipedia/en/d/d3/Wydad_AC_logo.png',
      competition: 'Botola Pro',
      date: '2026-01-29T19:00:00',
      stadium: 'Stade Moulay Abdallah',
      price: 120,
      status: 'available',
    },
    {
      id: '4',
      homeTeam: 'Wydad AC',
      homeTeamLogo: 'https://upload.wikimedia.org/wikipedia/en/d/d3/Wydad_AC_logo.png',
      awayTeam: 'Mamelodi Sundowns',
      awayTeamLogo: 'https://upload.wikimedia.org/wikipedia/en/d/da/Mamelodi_Sundowns_FC_logo.png',
      competition: 'CAF Champions League',
      date: '2026-02-05T21:00:00',
      stadium: 'Stade Mohammed V',
      price: 200,
      status: 'available',
    },
    {
      id: '5',
      homeTeam: 'Wydad AC',
      homeTeamLogo: 'https://upload.wikimedia.org/wikipedia/en/d/d3/Wydad_AC_logo.png',
      awayTeam: 'FAR Rabat',
      awayTeamLogo: 'https://upload.wikimedia.org/wikipedia/en/c/c3/AS_FAR_logo.png',
      competition: 'Botola Pro',
      date: '2026-02-12T20:00:00',
      stadium: 'Stade Mohammed V',
      price: 130,
      status: 'available',
    },
    {
      id: '6',
      homeTeam: 'Wydad AC',
      homeTeamLogo: 'https://upload.wikimedia.org/wikipedia/en/d/d3/Wydad_AC_logo.png',
      awayTeam: 'Espérance Tunis',
      awayTeamLogo: 'https://upload.wikimedia.org/wikipedia/en/4/44/Esperance_Sportive_de_Tunis_logo.png',
      competition: 'CAF Champions League',
      date: '2026-02-19T21:00:00',
      stadium: 'Stade Mohammed V',
      price: 220,
      status: 'selling-fast',
    },
    {
      id: '7',
      homeTeam: 'Olympique Safi',
      homeTeamLogo: 'https://upload.wikimedia.org/wikipedia/en/7/75/Olympic_Safi_logo.png',
      awayTeam: 'Wydad AC',
      awayTeamLogo: 'https://upload.wikimedia.org/wikipedia/en/d/d3/Wydad_AC_logo.png',
      competition: 'Botola Pro',
      date: '2026-02-26T19:30:00',
      stadium: 'Stade El Massira',
      price: 100,
      status: 'available',
    },
    {
      id: '8',
      homeTeam: 'Wydad AC',
      homeTeamLogo: 'https://upload.wikimedia.org/wikipedia/en/d/d3/Wydad_AC_logo.png',
      awayTeam: 'Simba SC',
      awayTeamLogo: 'https://upload.wikimedia.org/wikipedia/en/c/ce/Simba_SC_logo.png',
      competition: 'CAF Champions League',
      date: '2026-03-05T21:00:00',
      stadium: 'Stade Mohammed V',
      price: 180,
      status: 'sold-out',
    },
  ];

  const filters = [
    { id: 'all', name: 'Tous', icon: 'list' },
    { id: 'botola', name: 'Botola Pro', icon: 'football' },
    { id: 'caf', name: 'CAF CL', icon: 'trophy' },
    { id: 'available', name: 'Disponible', icon: 'checkmark-circle' },
  ];

  const filterMatches = () => {
    switch (selectedFilter) {
      case 'botola':
        return matches.filter(m => m.competition === 'Botola Pro');
      case 'caf':
        return matches.filter(m => m.competition === 'CAF Champions League');
      case 'available':
        return matches.filter(m => m.status === 'available');
      default:
        return matches;
    }
  };

  const handleMatchPress = (match) => {
    if (match.status !== 'sold-out') {
      navigation.navigate('TicketBooking', { match });
    }
  };

  const renderFilterButton = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === item.id && styles.filterButtonActive,
      ]}
      onPress={() => setSelectedFilter(item.id)}
    >
      <Ionicons
        name={item.icon}
        size={18}
        color={selectedFilter === item.id ? COLORS.white : COLORS.textSecondary}
      />
      <Text
        style={[
          styles.filterText,
          selectedFilter === item.id && styles.filterTextActive,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#000', COLORS.primaryDark]}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Billetterie</Text>
            <Text style={styles.headerSubtitle}>
              {filterMatches().length} matchs disponibles
            </Text>
          </View>
          <TouchableOpacity
            style={styles.ticketsButton}
            onPress={() => navigation.navigate('MyTickets')}
          >
            <Ionicons name="ticket" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <FlatList
          data={filters}
          renderItem={renderFilterButton}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        />

        {/* Matches List */}
        <FlatList
          data={filterMatches()}
          renderItem={({ item }) => (
            <MatchCard match={item} onPress={handleMatchPress} />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={60} color={COLORS.textSecondary} />
              <Text style={styles.emptyText}>Aucun match disponible</Text>
            </View>
          }
        />
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
  headerTitle: {
    fontSize: FONTS.h2,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: FONTS.body2,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  ticketsButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(220, 7, 20, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  filtersContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: SPACING.sm,
    gap: SPACING.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: FONTS.body2,
    color: COLORS.textSecondary,
    fontWeight: FONTS.medium,
  },
  filterTextActive: {
    color: COLORS.white,
    fontWeight: FONTS.bold,
  },
  listContent: {
    padding: SPACING.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  emptyText: {
    fontSize: FONTS.body1,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
});
