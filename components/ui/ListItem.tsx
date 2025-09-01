import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native'

import { type ThemeColors } from '@/constants/Colors'
import { Spacing, BorderRadius, Shadows } from '@/constants/Layout'
import { Typography } from '@/constants/Typography'
import { useThemeColors } from '@/hooks/useThemeColors'

interface ListItemProps {
  title: string
  subtitle?: string
  leftComponent?: React.ReactNode
  rightComponent?: React.ReactNode
  onPress?: () => void
  style?: ViewStyle
  showChevron?: boolean
  isCompleted?: boolean
  hasUrl?: boolean
  hasImage?: boolean
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leftComponent,
  rightComponent,
  onPress,
  style,
  showChevron = false,
  isCompleted = false,
  hasUrl = false,
  hasImage = false,
}) => {
  const colors = useThemeColors()
  const styles = React.useMemo(() => createStyles(colors), [colors])

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {leftComponent && (
          <View style={styles.leftSection}>{leftComponent}</View>
        )}

        <View style={styles.middleSection}>
          <View style={styles.attachmentsRow}>
            {hasUrl && (
              <Ionicons
                name="link"
                size={16}
                color={colors.textSecondary}
                style={styles.attachment}
              />
            )}
            {hasImage && (
              <Ionicons
                name="image"
                size={16}
                color={colors.textSecondary}
                style={styles.attachment}
              />
            )}
          </View>
          <Text
            style={[styles.title, isCompleted && styles.completedTitle]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        <View style={styles.rightSection}>
          {rightComponent}
          {showChevron && (
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textSecondary}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.md,
      marginVertical: Spacing.xs,
      ...Shadows.small,
    },

    content: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.md,
      minHeight: Spacing.listItemHeight,
    },

    leftSection: {
      marginRight: Spacing.md,
    },

    middleSection: {
      flex: 1,
    },

    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: Spacing.md,
    },

    attachmentsRow: {
      flexDirection: 'row',
      marginBottom: Spacing.xs,
    },

    attachment: {
      marginRight: Spacing.xs,
    },

    title: {
      ...Typography.textStyles.body,
      color: colors.text,
    },

    completedTitle: {
      textDecorationLine: 'line-through',
      color: colors.textSecondary,
    },

    subtitle: {
      ...Typography.textStyles.caption,
      color: colors.textSecondary,
      marginTop: Spacing.xs,
    },
  })
