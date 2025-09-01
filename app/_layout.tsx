import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import 'react-native-reanimated'

import { Colors } from '@/constants/Colors'
import { AppProvider } from '@/context/AppContext'
import { ThemeProvider as ThemePreferenceProvider } from '@/context/ThemeContext'
import { useColorScheme } from '@/hooks/useColorScheme'

const customDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.dark?.background ?? Colors.background,
    card: Colors.dark?.surface ?? Colors.surface,
    text: Colors.dark?.text ?? Colors.text,
    border: Colors.dark?.border ?? Colors.border,
    notification: Colors.dark?.primary ?? Colors.primary,
    primary: Colors.dark?.primary ?? Colors.primary,
  },
}

const customLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.light?.background ?? Colors.background,
    card: Colors.light?.surface ?? Colors.surface,
    text: Colors.light?.text ?? Colors.text,
    border: Colors.light?.border ?? Colors.border,
    notification: Colors.light?.primary ?? Colors.primary,
    primary: Colors.light?.primary ?? Colors.primary,
  },
}

function AppInner() {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'dark' ? customDarkTheme : customLightTheme
  return (
    <NavigationThemeProvider value={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(app)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
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
      <SafeAreaProvider>
        <ThemePreferenceProvider>
          <AppProvider>
            <AppInner />
          </AppProvider>
        </ThemePreferenceProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
