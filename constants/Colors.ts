/**
 * Shopper App Color Palette
 * Supports light and dark themes with teal-green primary color
 */

const lightColors = {
  primary: '#20B2A6',
  primaryDark: '#1A9B8F',
  tint: '#20B2A6',
  background: '#FFFFFF',
  surface: '#F2F2F2',
  surfaceElevated: '#E5E5E5',
  text: '#000000',
  textSecondary: '#4A4A4A',
  textTertiary: '#6B6B6B',
  success: '#20B2A6',
  error: '#FF3B30',
  warning: '#FF9500',
  inactive: '#C5C5C7',
  border: '#E0E0E0',
  overlay: 'rgba(0, 0, 0, 0.1)',
  shadow: 'rgba(0, 0, 0, 0.2)',
}

const darkColors = {
  primary: '#20B2A6',
  primaryDark: '#1A9B8F',
  tint: '#20B2A6',
  background: '#0A0A0B',
  surface: '#1A1A1C',
  surfaceElevated: '#2A2A2C',
  text: '#FFFFFF',
  textSecondary: '#9B9B9B',
  textTertiary: '#6B6B6B',
  success: '#20B2A6',
  error: '#FF6B6B',
  warning: '#FFB366',
  inactive: '#4A4A4C',
  border: '#2A2A2C',
  overlay: 'rgba(0, 0, 0, 0.7)',
  shadow: 'rgba(0, 0, 0, 0.3)',
}

const Colors = {
  light: lightColors,
  dark: darkColors,
  ...lightColors, // default to light; will be updated on theme changes
}

export type ThemeColors = typeof lightColors

export function applyTheme(theme: 'light' | 'dark') {
  Object.assign(Colors, Colors[theme])
}

export { Colors }
export default Colors
