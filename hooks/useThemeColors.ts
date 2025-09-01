import { Colors, type ThemeColors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'

export function useThemeColors(): ThemeColors {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light'
  return Colors[scheme]
}
