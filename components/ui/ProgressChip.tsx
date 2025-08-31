import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Svg, { Circle } from 'react-native-svg'

import { Colors } from '@/constants/Colors'
import { Spacing } from '@/constants/Layout'
import { Typography } from '@/constants/Typography'

interface ProgressChipProps {
  completed: number
  total: number
  size?: number
  variant?: 'small' | 'large' // 新增变体支持
}

export const ProgressChip: React.FC<ProgressChipProps> = ({
  completed,
  total,
  size,
  variant = 'small',
}) => {
  // 根据变体设置默认大小和线宽
  const defaultSize = variant === 'large' ? 60 : Spacing.progressChipSize
  const actualSize = size || defaultSize
  const strokeWidth = variant === 'large' ? 5 : 3
  const backgroundStrokeWidth = variant === 'large' ? 5 : 2

  const progress = total > 0 ? completed / total : 0
  const radius = actualSize / 2 - strokeWidth / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - progress * circumference
  const isComplete = completed === total && total > 0

  // Figma颜色规格
  const completedColor = '#2ECC71' // 完成色
  const uncompletedColor = '#6F6F6F' // 未完成色

  return (
    <View style={[styles.container, { width: actualSize, height: actualSize }]}>
      <Svg width={actualSize} height={actualSize} style={styles.svg}>
        {/* Background circle */}
        <Circle
          cx={actualSize / 2}
          cy={actualSize / 2}
          r={radius}
          stroke={uncompletedColor}
          strokeWidth={backgroundStrokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        {progress > 0 && (
          <Circle
            cx={actualSize / 2}
            cy={actualSize / 2}
            r={radius}
            stroke={completedColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${actualSize / 2} ${actualSize / 2})`}
          />
        )}
      </Svg>
      <Text style={[styles.text, { fontSize: actualSize * 0.25 }]}>
        {completed}/{total}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  svg: {
    position: 'absolute',
  },

  text: {
    ...Typography.textStyles.caption,
    color: Colors.text,
    fontWeight: Typography.fontWeight.semibold,
    textAlign: 'center',
  },
})
