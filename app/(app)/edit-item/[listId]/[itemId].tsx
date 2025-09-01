import { Ionicons } from '@expo/vector-icons'
import { useRouter, useLocalSearchParams } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Input, Button } from '@/components/ui'
import { type ThemeColors } from '@/constants/Colors'
import { Spacing } from '@/constants/Layout'
import { Typography } from '@/constants/Typography'
import { useApp } from '@/context/AppContext'
import { useThemeColors } from '@/hooks/useThemeColors'
import { HapticFeedback } from '@/utils/haptics'

export default function EditItemScreen() {
  const router = useRouter()
  const { listId, itemId } = useLocalSearchParams()
  const { getList, dispatch } = useApp()

  const listIdStr = typeof listId === 'string' ? listId : listId?.[0] || ''
  const itemIdStr = typeof itemId === 'string' ? itemId : itemId?.[0] || ''

  const list = getList(listIdStr)
  const item = list?.items.find(item => item.id === itemIdStr)

  const [itemName, setItemName] = useState(item?.name || '')
  const colors = useThemeColors()
  const styles = createStyles(colors)

  useEffect(() => {
    if (item) {
      setItemName(item.name)
    }
  }, [item])

  const handleSave = () => {
    const trimmedName = itemName.trim()

    if (!trimmedName) {
      Alert.alert('Error', 'Item name cannot be empty')
      return
    }

    if (!item) {
      Alert.alert('Error', 'Item not found')
      return
    }

    if (trimmedName === item.name) {
      // No changes, just go back
      router.back()
      return
    }

    HapticFeedback.light()

    dispatch({
      type: 'UPDATE_ITEM',
      payload: {
        listId: listIdStr,
        itemId: itemIdStr,
        updates: { name: trimmedName },
      },
    })

    router.back()
  }

  const handleCancel = () => {
    HapticFeedback.light()
    router.back()
  }

  if (!item || !list) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Item Not Found</Text>

          <View style={styles.headerRight} />
        </View>
        <View style={styles.content}>
          <Button title="Go Back" onPress={handleCancel} fullWidth />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Edit Item</Text>

        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Input
            value={itemName}
            onChangeText={setItemName}
            placeholder="Enter item name"
            autoFocus
            multiline={false}
            maxLength={100}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            onPress={handleCancel}
            variant="secondary"
            fullWidth
            style={styles.button}
          />
          <Button
            title="Save"
            onPress={handleSave}
            fullWidth
            style={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}
const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 56,
      paddingHorizontal: 24,
      backgroundColor: colors.background,
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
      color: colors.text,
      flex: 1,
      marginLeft: 12,
      textAlign: 'center',
    },

    headerRight: {
      width: 44,
    },

    content: {
      flex: 1,
      padding: Spacing.screenPadding,
    },

    inputContainer: {
      marginBottom: Spacing.xl,
    },

    buttonContainer: {
      flexDirection: 'row',
      gap: Spacing.md,
      marginTop: 'auto',
      paddingBottom: Spacing.lg,
    },

    button: {
      flex: 1,
    },
  })
