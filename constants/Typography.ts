/**
 * Typography system for the Shopper app
 * Based on design specification requirements
 */

export const Typography = {
  // Font families
  fontFamily: {
    regular: 'System', // Using system font for now
    medium: 'System',
    bold: 'System',
  },

  // Font sizes
  fontSize: {
    small: 12,
    body: 16,
    subtitle: 18,
    title: 24,
    largeTitle: 32,
  },

  // Line heights
  lineHeight: {
    small: 16,
    body: 24,
    subtitle: 26,
    title: 32,
    largeTitle: 40,
  },

  // Font weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // Text styles based on design spec usage
  textStyles: {
    largeTitle: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: '700' as const,
    },
    title: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '600' as const,
    },
    subtitle: {
      fontSize: 18,
      lineHeight: 26,
      fontWeight: '500' as const,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400' as const,
    },
    buttonLabel: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600' as const,
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400' as const,
    },
  },
};
