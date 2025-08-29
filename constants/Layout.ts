/**
 * Spacing and layout constants for consistent design
 */

export const Spacing = {
  // Base spacing unit
  base: 8,

  // Common spacing values
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,

  // Screen padding
  screenPadding: 20,

  // Component specific spacing
  buttonHeight: 52,
  inputHeight: 48,
  listItemHeight: 64,
  iconSize: 24,
  progressChipSize: 40,
};

export const BorderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999, // For pill-shaped buttons
};

export const Shadows = {
  small: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Android
  },
  medium: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4, // Android
  },
  large: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8, // Android
  },
};