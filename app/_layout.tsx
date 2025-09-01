import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useMemo } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'

import { Colors } from '@/constants/Colors'
import { AppProvider } from '@/context/AppContext'
import { ThemeProvider as ThemePreferenceProvider } from '@/context/ThemeContext'
import { useColorScheme } from '@/hooks/useColorScheme'

function AppInner() {
  const colorScheme = useColorScheme()
  const navigationTheme = useMemo(() => {
    const base = colorScheme === 'dark' ? DarkTheme : DefaultTheme
    const schemeColors = Colors[colorScheme]
    return {
      ...base,
      colors: {
        ...base.colors,
        background: schemeColors.background,
        card: schemeColors.surface,
        text: schemeColors.text,
        border: schemeColors.border,
        notification: schemeColors.primary,
        primary: schemeColors.primary,
      },
    }
  }, [colorScheme])

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(app)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar
        style={colorScheme === 'dark' ? 'light' : 'dark'}
        backgroundColor={Colors[colorScheme].background}
      />
    </NavigationThemeProvider>
  )
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  if (!loaded) {
    return null
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemePreferenceProvider>
        <AppProvider>
          <AppInner />
        </AppProvider>
      </ThemePreferenceProvider>
    </GestureHandlerRootView>
  )
}
