// src/utils/index.js

/**
 * Central export point for all utility modules
 */

export * from './colors';
export * from './typography';
export * from './spacing';

// Re-export defaults for convenience
export { default as COLORS } from './colors';
export { default as FONTS } from './typography';
export { default as SPACING } from './spacing';
