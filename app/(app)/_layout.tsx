import { Stack } from 'expo-router'
import React from 'react'

import { useThemeColors } from '@/hooks/useThemeColors'

export default function AppLayout() {
  const colors = useThemeColors()
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="lists" />
      <Stack.Screen name="create-list" />
      <Stack.Screen name="list/[id]" />
      <Stack.Screen name="add-items/[id]" />
      <Stack.Screen name="add-url/[...params]" />
      <Stack.Screen name="add-image/[...params]" />
      <Stack.Screen name="my-items/index" />
      <Stack.Screen name="my-items/create" />
      <Stack.Screen name="my-items/edit/[id]" />
      <Stack.Screen name="my-items/categories" />
    </Stack>
  )
}
