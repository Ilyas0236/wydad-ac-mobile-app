// src/utils/typography.js

/**
 * Typography System
 * Font sizes and weights for consistent text styling
 */

/**
 * Font Sizes
 */
export const FONT_SIZES = {
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 18,
  body1: 16,
  body2: 14,
  caption: 12,
  small: 10,
  button: 16,
  input: 16,
};

/**
 * Font Weights
 */
export const FONT_WEIGHTS = {
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
  black: '900',
};

/**
 * Line Heights
 */
export const LINE_HEIGHTS = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
};

/**
 * Letter Spacing
 */
export const LETTER_SPACING = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
};

/**
 * Combined FONTS object for backward compatibility
 */
export const FONTS = {
  // Font Sizes
  h1: FONT_SIZES.h1,
  h2: FONT_SIZES.h2,
  h3: FONT_SIZES.h3,
  h4: FONT_SIZES.h4,
  h5: FONT_SIZES.h5,
  body1: FONT_SIZES.body1,
  body2: FONT_SIZES.body2,
  caption: FONT_SIZES.caption,
  small: FONT_SIZES.small,
  button: FONT_SIZES.button,
  input: FONT_SIZES.input,
  
  // Font Weights
  light: FONT_WEIGHTS.light,
  regular: FONT_WEIGHTS.regular,
  medium: FONT_WEIGHTS.medium,
  semiBold: FONT_WEIGHTS.semiBold,
  bold: FONT_WEIGHTS.bold,
  extraBold: FONT_WEIGHTS.extraBold,
  black: FONT_WEIGHTS.black,
};

export default FONTS;
