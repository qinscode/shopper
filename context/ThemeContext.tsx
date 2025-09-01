import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  ColorSchemeName,
  useColorScheme as useRNColorScheme,
} from 'react-native'

import { applyTheme } from '@/constants/Colors'

export type ThemePreference = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  theme: NonNullable<ColorSchemeName>
  themePreference: ThemePreference
  setThemePreference: (pref: ThemePreference) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  themePreference: 'system',
  setThemePreference: () => {},
})

const STORAGE_KEY = 'theme-preference'

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemScheme = useRNColorScheme() ?? 'light'
  const [themePreference, setThemePreference] =
    useState<ThemePreference>('system')

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(value => {
      if (value === 'light' || value === 'dark' || value === 'system') {
        setThemePreference(value)
      }
    })
  }, [])

  const setPreference = (pref: ThemePreference) => {
    setThemePreference(pref)
    AsyncStorage.setItem(STORAGE_KEY, pref).catch(() => {})
  }

  const theme = themePreference === 'system' ? systemScheme : themePreference

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return (
    <ThemeContext.Provider
      value={{ theme, themePreference, setThemePreference: setPreference }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
