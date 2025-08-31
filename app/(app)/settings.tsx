import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Colors } from '@/constants/Colors'
import { Spacing, BorderRadius, Shadows } from '@/constants/Layout'
import { Typography } from '@/constants/Typography'
import { HapticFeedback } from '@/utils/haptics'

interface SettingsItemProps {
  title: string
  subtitle?: string
  icon: string
  iconColor?: string
  onPress: () => void
  isLast?: boolean
  rightText?: string
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  title,
  subtitle,
  icon,
  iconColor = Colors.textSecondary,
  onPress,
  isLast = false,
  rightText,
}) => (
  <TouchableOpacity
    style={[styles.settingsItem, isLast && styles.lastSettingsItem]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.settingsItemLeft}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon as any} size={22} color={iconColor} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.settingsTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <View style={styles.settingsItemRight}>
      {rightText && <Text style={styles.rightText}>{rightText}</Text>}
      <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
    </View>
  </TouchableOpacity>
)

export default function SettingsScreen() {
  const router = useRouter()

  const handleBack = () => {
    HapticFeedback.light()
    router.back()
  }

  const handleArchivedLists = () => {
    HapticFeedback.light()
    router.push('/(app)/archived-lists')
  }

  const handleTrash = () => {
    HapticFeedback.light()
    router.push('/(app)/trash')
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Settings</Text>

        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lists</Text>

          <View style={styles.cardContainer}>
            <SettingsItem
              title="Archived Lists"
              subtitle="View and manage archived lists"
              icon="archive-outline"
              onPress={handleArchivedLists}
            />

            <SettingsItem
              title="Trash"
              subtitle="View and restore deleted lists"
              icon="trash-outline"
              onPress={handleTrash}
              isLast={true}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.cardContainer}>
            <SettingsItem
              title="App Version"
              icon="information-circle-outline"
              rightText="Version 1.0.0"
              onPress={() => {
                HapticFeedback.light()
                Alert.alert(
                  'About Shopper',
                  'Version: 1.0.0\nAuthor: Jack Qin\n\nA lightweight shopping list app built with React Native and Expo.',
                  [{ text: 'OK', style: 'default' }]
                )
              }}
              isLast={true}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 24,
    backgroundColor: Colors.background,
  },

  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -12,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    flex: 1,
    marginLeft: 12,
  },

  headerRight: {
    width: 44,
  },

  content: {
    flex: 1,
  },

  section: {
    marginBottom: Spacing.xl,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },

  cardContainer: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.screenPadding,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.small,
  },

  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },

  lastSettingsItem: {
    borderBottomWidth: 0,
  },

  settingsItemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },

  textContainer: {
    flex: 1,
  },

  settingsTitle: {
    fontSize: 16,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
    marginBottom: 2,
  },

  settingsSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },

  rightText: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginRight: Spacing.sm,
  },
})
