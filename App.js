// App.js
import { StyleSheet, Text, View, Image } from 'react-native';
import { COLORS, FONTS, SPACING } from './src/utils';

export default function App() {
  return (
    <View style={styles.container}>
      {/* Logo Wydad avec Image */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('./assets/images/logowac.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
      
      <Text style={styles.title}>🏆 Wydad AC</Text>
      <Text style={styles.subtitle}>E-commerce & Billetterie</Text>
      
      <View style={styles.badge}>
        <Text style={styles.badgeText}>✅ Architecture OK !</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    elevation: 8,
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: FONTS.h1,
    fontWeight: FONTS.bold,
    color: COLORS.textWhite,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONTS.h4,
    color: COLORS.textWhite,
    opacity: 0.9,
    marginBottom: SPACING.xl,
  },
  badge: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    marginTop: SPACING.xl,
  },
  badgeText: {
    fontSize: FONTS.body1,
    fontWeight: FONTS.semiBold,
    color: COLORS.success,
  },
});
