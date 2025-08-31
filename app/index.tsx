import { useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'

import { Colors } from '@/constants/Colors'
import { Spacing } from '@/constants/Layout'
import { Typography } from '@/constants/Typography'
import { useApp } from '@/context/AppContext'

export default function SplashScreen() {
  const router = useRouter()
  const { state } = useApp()

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
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('@/assets/images/loading.png')}
          style={styles.illustration}
          resizeMode="contain"
        />
        <Text style={styles.title}>Shopper</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    color: Colors.text,
    fontWeight: Typography.fontWeight.bold,
  },
})
