import { Stack } from 'expo-router'
import React from 'react'

import { useThemeColors } from '@/hooks/useThemeColors'

export default function OnboardingLayout() {
  const colors = useThemeColors()
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="onboarding" />
    </Stack>
  )
}
