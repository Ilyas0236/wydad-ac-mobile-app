// src/screens/Shop/ProductDetailScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../utils';

export default function ProductDetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Product Detail - À venir</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    color: COLORS.white,
    fontSize: FONTS.h3,
  },
});
