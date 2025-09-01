import { Ionicons } from '@expo/vector-icons'
import { useRouter, useLocalSearchParams, Stack } from 'expo-router'
import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Alert,
  useWindowDimensions,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Colors, ThemeColors } from '@/constants/Colors'
import { Spacing } from '@/constants/Layout'
import { Typography } from '@/constants/Typography'
import { useApp } from '@/context/AppContext'
import { useThemeColors } from '@/hooks/useThemeColors'
import { HapticFeedback } from '@/utils/haptics'

const EMOJI_DATA = [
  '🛒',
  '🥕',
  '🍎',
  '🥛',
  '🍞',
  '🧻',
  '🧴',
  '🥩',
  '🐟',
  '🍌',
  '🥚',
  '🧀',
  '🍊',
  '🥔',
  '🥒',
  '🍅',
  '🍇',
  '🥬',
  '🫐',
  '🍓',
  '🥝',
  '🍑',
  '🍈',
  '🥭',
  '🍍',
  '🥥',
  '🥑',
  '🍆',
  '🌶️',
  '🫑',
  '🌽',
  '🥦',
  '🧄',
  '🧅',
  '🍄',
  '🥜',
  '🌰',
  '🍯',
  '🥓',
  '🍗',
  '🍖',
  '🦴',
  '🌭',
  '🍔',
  '🍟',
  '🍕',
  '🥪',
  '🌮',
  '🌯',
  '🥙',
  '🧆',
  '🥚',
  '🍳',
  '🥞',
  '🧇',
  '🥐',
  '🍞',
  '🥖',
  '🥨',
  '🧀',
  '🥛',
  '🍼',
  '☕',
  '🫖',
  '🍵',
  '🧃',
  '🥤',
  '🧋',
  '🍶',
  '🍾',
  '🍷',
  '🍸',
  '🍹',
  '🍺',
  '🍻',
  '🥂',
  '🥃',
  '🧊',
  '🥄',
  '🍴',
]

export default function SelectEmojiScreen() {
  const router = useRouter()
  const { listId, itemId } = useLocalSearchParams()
  const listIdStr = typeof listId === 'string' ? listId : listId?.[0] || ''
  const itemIdStr = typeof itemId === 'string' ? itemId : itemId?.[0] || ''

  const { getList, dispatch } = useApp()
  const list = getList(listIdStr)
  const item = list?.items.find(i => i.id === itemIdStr)

  const [customInput, setCustomInput] = useState('')
  const colors = useThemeColors()
  const styles = React.useMemo(() => createStyles(colors), [colors])

  const { width } = useWindowDimensions()
  const CONTENT_PADDING = Spacing.lg
  const ITEM_MARGIN = Spacing.sm
  const MIN_ITEM_SIZE = 48
  const gridWidth = width - CONTENT_PADDING * 2
  const numColumns = Math.max(
    3,
    Math.floor(gridWidth / (MIN_ITEM_SIZE + ITEM_MARGIN * 2))
  )
  const emojiSize = gridWidth / numColumns - ITEM_MARGIN * 2

  // 处理自定义输入的逻辑
  const processCustomInput = (input: string): string => {
    if (!input.trim()) {
      return ''
    }

    // 如果输入的是emoji（检查是否为单个emoji字符）
    const emojiRegex =
      /^[\u{1F300}-\u{1F9FF}]|^[\u{2600}-\u{27BF}]|^[\u{1F600}-\u{1F64F}]|^[\u{1F680}-\u{1F6FF}]|^[\u{1F1E0}-\u{1F1FF}]/u
    if (emojiRegex.test(input)) {
      // 取第一个emoji字符
      const match = input.match(emojiRegex)
      return match ? match[0] : input.charAt(0)
    }

    // 如果是文字，取第一个字符
    return input.charAt(0).toUpperCase()
  }

  const handleCustomSubmit = () => {
    if (!customInput.trim()) {
      Alert.alert('提示', '请输入emoji或文字')
      return
    }

    const processedEmoji = processCustomInput(customInput)
    handleSelectEmoji(processedEmoji)
    setCustomInput('')
  }

  const handleSelectEmoji = (emoji: string) => {
    HapticFeedback.light()
    dispatch({
      type: 'UPDATE_ITEM',
      payload: { listId: listIdStr, itemId: itemIdStr, updates: { emoji } },
    })
    router.back()
  }

  const handleRemoveEmoji = () => {
    HapticFeedback.light()
    dispatch({
      type: 'UPDATE_ITEM',
      payload: {
        listId: listIdStr,
        itemId: itemIdStr,
        updates: { emoji: undefined },
      },
    })
    router.back()
  }

  const renderEmojiItem = ({ item: emoji }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.emojiButton,
        {
          width: emojiSize,
          height: emojiSize,
          margin: ITEM_MARGIN,
        },
        item?.emoji === emoji && styles.selectedEmoji,
      ]}
      onPress={() => handleSelectEmoji(emoji)}
      activeOpacity={0.7}
    >
      <Text style={styles.emojiText}>{emoji}</Text>
    </TouchableOpacity>
  )

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Choose Emoji',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontSize: 18, fontWeight: '600' },
        }}
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.subtitle}>
            Choose an emoji for &#34;{item?.name}&#34;
          </Text>

          {/* 自定义输入区域 */}
          <View style={styles.customInputSection}>
            <Text style={styles.inputLabel}>Or create custom:</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={customInput}
                onChangeText={setCustomInput}
                placeholder="Enter emoji or text..."
                placeholderTextColor={colors.textTertiary}
                maxLength={10}
                returnKeyType="done"
                onSubmitEditing={handleCustomSubmit}
              />
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  !customInput.trim() && styles.submitButtonDisabled,
                ]}
                onPress={handleCustomSubmit}
                disabled={!customInput.trim()}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="checkmark"
                  size={20}
                  color={
                    customInput.trim() ? colors.primary : colors.textTertiary
                  }
                />
              </TouchableOpacity>
            </View>
            {customInput.trim() && (
              <View style={styles.preview}>
                <Text style={styles.previewLabel}>Preview:</Text>
                <View style={styles.previewEmoji}>
                  <Text style={styles.previewText}>
                    {processCustomInput(customInput)}
                  </Text>
                </View>
              </View>
            )}
          </View>

          <FlatList
            data={EMOJI_DATA}
            renderItem={renderEmojiItem}
            keyExtractor={item => item}
            numColumns={numColumns}
            key={numColumns}
            contentContainerStyle={styles.emojiGrid}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.actions}>
            {item?.emoji && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={handleRemoveEmoji}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={20} color={colors.error} />
                <Text style={styles.removeText}>Remove emoji</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    </>
  )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    content: {
      flex: 1,
      padding: 24,
    },

    subtitle: {
      fontSize: 17,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 24,
    },

    customInputSection: {
      marginBottom: 32,
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
    },

    inputLabel: {
      fontSize: 16,
      fontWeight: Typography.fontWeight.medium,
      color: colors.text,
      marginBottom: 12,
    },

    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 4,
    },

    textInput: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      paddingVertical: 12,
    },

    submitButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
    },

    submitButtonDisabled: {
      backgroundColor: colors.surface,
    },

    preview: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.background,
    },

    previewLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginRight: 12,
    },

    previewEmoji: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },

    previewText: {
      fontSize: 18,
    },

    emojiGrid: {
      paddingBottom: 20,
    },

    emojiButton: {
      width: 48,
      height: 48,
      margin: 8,
      borderRadius: 12,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },

    selectedEmoji: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '20',
    },

    emojiText: {
      fontSize: 24,
    },

    actions: {
      paddingTop: 20,
      alignItems: 'center',
    },

    removeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 20,
      backgroundColor: colors.surface,
    },

    removeText: {
      fontSize: 16,
      color: colors.error,
      marginLeft: 8,
      fontWeight: Typography.fontWeight.medium,
    },
  })
