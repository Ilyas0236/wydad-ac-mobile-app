// src/utils/spacing.js

/**
 * Spacing System
 * Consistent spacing scale for the entire app
 * Based on 4px base unit
 */
export const SPACING = {
  xxs: 2,   // Extra extra small
  xs: 4,    // Extra small
  sm: 8,    // Small
  md: 16,   // Medium (base unit)
  lg: 24,   // Large
  xl: 32,   // Extra large
  xxl: 48,  // Extra extra large
  xxxl: 64, // Huge
};

/**
 * Common padding/margin values
 */
export const PADDING = {
  container: SPACING.lg,
  card: SPACING.md,
  button: SPACING.md,
  input: SPACING.md,
  screen: SPACING.lg,
};

/**
 * Border radius values
 */
export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 9999, // Fully rounded
};

export default SPACING;
