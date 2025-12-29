// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { COLORS, FONTS, SPACING } from '../utils';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>⚽</Text>
          </View>
          <Text style={styles.title}>Wydad Athletic Club</Text>
          <Text style={styles.subtitle}>Bienvenue chez les Champions</Text>
        </View>
        
        {/* Menu */}
        <View style={styles.menu}>
          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: COLORS.primary }]}
            onPress={() => navigation.navigate('ProductList')}
          >
            <Text style={styles.menuIcon}>🛍️</Text>
            <Text style={styles.menuText}>Boutique</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: COLORS.accent }]}
            onPress={() => navigation.navigate('MatchList')}
          >
            <Text style={styles.menuIcon}>🎫</Text>
            <Text style={styles.menuTextDark}>Billets</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: COLORS.primaryDark }]}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.menuIcon}>👤</Text>
            <Text style={styles.menuText}>Profil</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.xl,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  logo: {
    fontSize: 40,
  },
  title: {
    fontSize: FONTS.h2,
    fontWeight: FONTS.bold,
    color: COLORS.textWhite,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONTS.body2,
    color: COLORS.textWhite,
    opacity: 0.9,
  },
  menu: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  menuItem: {
    borderRadius: 16,
    padding: SPACING.xl,
    alignItems: 'center',
    elevation: 4,
  },
  menuIcon: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  menuText: {
    fontSize: FONTS.h3,
    fontWeight: FONTS.bold,
    color: COLORS.textWhite,
  },
  menuTextDark: {
    fontSize: FONTS.h3,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
  },
});
