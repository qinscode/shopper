import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'

import { type ThemeColors } from '@/constants/Colors'
import { Shadows } from '@/constants/Layout'
import { useThemeColors } from '@/hooks/useThemeColors'

interface FloatingActionButtonProps {
  onPress: () => void
  icon?: keyof typeof Ionicons.glyphMap
  size?: number
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  icon = 'add',
  size = 56,
}) => {
  const colors = useThemeColors()
  const styles = React.useMemo(() => createStyles(colors), [colors])
  const scale = useSharedValue(1)
  const rotation = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }))

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 200 })
  }

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 })
  }

  const handlePress = () => {
    rotation.value = withTiming(180, { duration: 200 }, () => {
      rotation.value = withTiming(360, { duration: 200 }, () => {
        rotation.value = 0
      })
    })
    runOnJS(onPress)()
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      <Animated.View
        style={[
          styles.container,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
          animatedStyle,
        ]}
      >
        <Ionicons name={icon} size={size * 0.4} color={colors.text} />
      </Animated.View>
    </TouchableOpacity>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...Shadows.large,
    },
  })
