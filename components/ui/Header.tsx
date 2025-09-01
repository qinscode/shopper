import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { type ThemeColors } from '@/constants/Colors'
import { Spacing } from '@/constants/Layout'
import { Typography } from '@/constants/Typography'
import { useThemeColors } from '@/hooks/useThemeColors'

interface HeaderProps {
  title: string
  showBackButton?: boolean
  onBackPress?: () => void
  leftComponent?: React.ReactNode
  rightComponent?: React.ReactNode
  titleAlign?: 'center' | 'left' // 新增标题对齐方式
  style?: ViewStyle
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  leftComponent,
  rightComponent,
  titleAlign = 'center',
  style,
}) => {
  const insets = useSafeAreaInsets()
  const colors = useThemeColors()
  const styles = React.useMemo(() => createStyles(colors), [colors])

  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {showBackButton && onBackPress && (
            <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color={colors.text} />
            </TouchableOpacity>
          )}
          {!showBackButton && leftComponent}
        </View>

        <View
          style={
            titleAlign === 'left'
              ? styles.centerSectionLeft
              : styles.centerSection
          }
        >
          <Text
            style={[styles.title, titleAlign === 'left' && styles.titleLeft]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>

        <View style={styles.rightSection}>{rightComponent}</View>
      </View>
    </View>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },

    content: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 44,
      paddingHorizontal: Spacing.md,
    },

    leftSection: {
      minWidth: 44,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },

    centerSection: {
      flex: 1,
      alignItems: 'center',
    },

    centerSectionLeft: {
      flex: 1,
      alignItems: 'flex-start',
    },

    rightSection: {
      minWidth: 44,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },

    backButton: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: -Spacing.sm, // Adjust for visual balance
    },

    title: {
      ...Typography.textStyles.title,
      color: colors.text,
      textAlign: 'center',
    },

    titleLeft: {
      textAlign: 'left',
    },
  })
