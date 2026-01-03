// src/screens/Tickets/MatchListScreen.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../../utils';
import MatchCard from '../../components/MatchCard';
import { getMatches } from '../../services/ticketService';

export default function MatchListScreen({ navigation }) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // ============================================
  // DATA FETCHING
  // ============================================

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching matches from Firebase...');
      const data = await getMatches();
      
      console.log('✅ Matches loaded:', data.length);
      setMatches(data);
    } catch (err) {
      setError('Impossible de charger les matchs');
      console.error('❌ Error loading matches:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMatches();
    setRefreshing(false);
  }, [fetchMatches]);

  // ============================================
  // FILTERS
  // ============================================

  const filters = useMemo(() => [
    { id: 'all', name: 'Tous', icon: 'list' },
    { id: 'Botola Pro', name: 'Botola Pro', icon: 'football' },
    { id: 'CAF Champions League', name: 'CAF CL', icon: 'trophy' },
    { id: 'available', name: 'Disponible', icon: 'checkmark-circle' },
  ], []);

  const filteredMatches = useMemo(() => {
    if (selectedFilter === 'all') {
      return matches;
    }
    
    if (selectedFilter === 'available') {
      return matches.filter(m => m.status === 'available');
    }
    
    return matches.filter(m => m.competition === selectedFilter);
  }, [matches, selectedFilter]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleMatchPress = useCallback((match) => {
    if (match.status !== 'sold-out') {
      navigation.navigate('TicketBooking', { match });
    }
  }, [navigation]);

  const handleMyTicketsPress = useCallback(() => {
    navigation.navigate('MyTickets');
  }, [navigation]);

  const handleFilterPress = useCallback((filterId) => {
    setSelectedFilter(filterId);
  }, []);

  // ============================================
  // RENDER FUNCTIONS
  // ============================================

  const renderFilterButton = useCallback(({ item }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === item.id && styles.filterButtonActive,
      ]}
      onPress={() => handleFilterPress(item.id)}
      activeOpacity={0.7}
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
  ), [selectedFilter, handleFilterPress]);

  const renderMatchCard = useCallback(({ item }) => (
    <MatchCard match={item} onPress={handleMatchPress} />
  ), [handleMatchPress]);

  const renderEmptyComponent = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Ionicons name="calendar-outline" size={60} color={COLORS.textSecondary} />
      <Text style={styles.emptyText}>Aucun match disponible</Text>
      <TouchableOpacity 
        style={styles.retryButton} 
        onPress={fetchMatches}
        activeOpacity={0.8}
      >
        <Text style={styles.retryButtonText}>Actualiser</Text>
      </TouchableOpacity>
    </View>
  ), [fetchMatches]);

  // ============================================
  // LOADING STATE
  // ============================================

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Chargement des matchs...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ============================================
  // ERROR STATE
  // ============================================

  if (error && matches.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle="light-content" />
        <LinearGradient colors={['#000', COLORS.primaryDark]} style={styles.container}>
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={64} color={COLORS.error} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={fetchMatches}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#000', COLORS.primaryDark]}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Billetterie</Text>
            <Text style={styles.headerSubtitle}>
              {filteredMatches.length} match{filteredMatches.length > 1 ? 's' : ''} disponible{filteredMatches.length > 1 ? 's' : ''}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.ticketsButton}
            onPress={handleMyTicketsPress}
            activeOpacity={0.7}
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
          data={filteredMatches}
          renderItem={renderMatchCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
          ListEmptyComponent={renderEmptyComponent}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: COLORS.white,
    marginTop: SPACING.md,
    fontSize: FONTS.body1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONTS.body1,
    textAlign: 'center',
    marginVertical: SPACING.lg,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    marginTop: SPACING.md,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: FONTS.button,
    fontWeight: FONTS.bold,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerLeft: {
    flex: 1,
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
    paddingBottom: SPACING.xl * 2,
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
    marginBottom: SPACING.md,
  },
});
