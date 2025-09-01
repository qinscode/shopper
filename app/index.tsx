import { useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'

import { Colors } from '@/constants/Colors'
import { Spacing } from '@/constants/Layout'
import { Typography } from '@/constants/Typography'
import { useApp } from '@/context/AppContext'
import { useThemeColors } from '@/hooks/useThemeColors'

export default function SplashScreen() {
  const router = useRouter()
  const { state } = useApp()
  const colors = useThemeColors()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (state.hasCompletedOnboarding) {
        router.replace('/(app)/lists')
      } else {
        router.replace('/(onboarding)/onboarding')
      }
    }, 2000) // Show splash for 2 seconds

    return () => clearTimeout(timer)
  }, [state.hasCompletedOnboarding, router])

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Image
          source={require('@/assets/images/loading.png')}
          style={styles.illustration}
          resizeMode="contain"
        />
        <Text style={[styles.title, { color: colors.text }]}>Shopper</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    transform: [{ translateY: -60 }], // 向上移动整个组合
  },

  illustration: {
    width: 280,
    height: 200,
    marginBottom: Spacing.md, // 进一步缩小间距
  },

  title: {
    ...Typography.textStyles.largeTitle,
    fontWeight: Typography.fontWeight.bold,
  },
})
