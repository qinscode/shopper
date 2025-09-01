import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { type ThemeColors } from '@/constants/Colors'
import { Spacing } from '@/constants/Layout'
import { Typography } from '@/constants/Typography'
import { useThemeColors } from '@/hooks/useThemeColors'

import { ProgressChip } from './ProgressChip'

interface DetailHeaderProps {
  title: string
  completed: number
  total: number
  onBackPress: () => void
  onMenuPress?: () => void
}

export const DetailHeader: React.FC<DetailHeaderProps> = ({
  title,
  completed,
  total,
  onBackPress,
  onMenuPress,
}) => {
  const insets = useSafeAreaInsets()
  const colors = useThemeColors()
  const styles = React.useMemo(() => createStyles(colors), [colors])

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.rightSection}>
          <ProgressChip
            completed={completed}
            total={total}
            size={44}
            variant="small"
          />
          {onMenuPress && (
            <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
              <Ionicons
                name="ellipsis-horizontal"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
          )}
        </View>
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
      height: 56, // 增加高度让标题更舒适
      paddingHorizontal: 24, // 24pt左右内边距
    },

    backButton: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: -12, // 调整视觉平衡
    },

    title: {
      fontSize: 24, // 24-26pt标题字号
      fontWeight: Typography.fontWeight.semibold, // Semibold
      color: colors.text,
      flex: 1,
      marginLeft: 12, // 标题与圆环间距12-16pt
      marginRight: 16,
    },

    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    menuButton: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 8,
    },
  })
