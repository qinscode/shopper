import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'

import { useThemeColors } from '@/hooks/useThemeColors'
import { HapticFeedback } from '@/utils/haptics'

interface CheckboxProps {
  checked: boolean
  onToggle: () => void
  size?: number
  style?: ViewStyle
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onToggle,
  size = 26, // 稍微增大默认尺寸
  style,
}) => {
  const colors = useThemeColors()
  const handleToggle = () => {
    if (checked) {
      HapticFeedback.light()
    } else {
      HapticFeedback.success()
    }
    onToggle()
  }

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: checked ? colors.success : colors.textSecondary,
        },
        style,
      ]}
      onPress={handleToggle}
      activeOpacity={0.7}
    >
      {checked && (
        <Ionicons name="checkmark" size={size * 0.5} color={colors.success} />
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3, // 3pt线宽
    backgroundColor: 'transparent',
  },
})
