import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'

import { type ThemeColors } from '@/constants/Colors'
import { Spacing } from '@/constants/Layout'
import { Typography } from '@/constants/Typography'
import { useThemeColors } from '@/hooks/useThemeColors'

interface EmptyStateProps {
  title: string
  subtitle: string
  icon?: React.ReactNode
  illustration?: React.ReactNode
  action?: React.ReactNode
  style?: ViewStyle
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  icon,
  illustration,
  action,
  style,
}) => {
  const colors = useThemeColors()
  const styles = React.useMemo(() => createStyles(colors), [colors])

  return (
    <View style={[styles.container, style]}>
      {(icon || illustration) && (
        <View style={styles.iconContainer}>{illustration || icon}</View>
      )}

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {action && <View style={styles.actionContainer}>{action}</View>}
    </View>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.screenPadding,
    },

    iconContainer: {
      marginBottom: Spacing.xl,
      alignItems: 'center',
    },

    textContainer: {
      alignItems: 'center',
      marginBottom: Spacing.xl,
    },

    title: {
      ...Typography.textStyles.title,
      color: colors.text,
      textAlign: 'center',
      marginBottom: Spacing.sm,
    },

    subtitle: {
      ...Typography.textStyles.body,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },

    actionContainer: {
      width: '100%',
    },
  })
