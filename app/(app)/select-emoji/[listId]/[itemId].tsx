import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Layout';
import { Typography } from '@/constants/Typography';
import { useApp } from '@/context/AppContext';
import { HapticFeedback } from '@/utils/haptics';

const EMOJI_DATA = [
  '🛒', '🥕', '🍎', '🥛', '🍞', '🧻', '🧴', '🥩', 
  '🐟', '🍌', '🥚', '🧀', '🍊', '🥔', '🥒', '🍅',
  '🍇', '🥬', '🫐', '🍓', '🥝', '🍑', '🍈', '🥭',
  '🍍', '🥥', '🥑', '🍆', '🌶️', '🫑', '🌽', '🥦',
  '🧄', '🧅', '🍄', '🥜', '🌰', '🍯', '🥓', '🍗',
  '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🥪', '🌮',
  '🌯', '🥙', '🧆', '🥚', '🍳', '🥞', '🧇', '🥐',
  '🍞', '🥖', '🥨', '🧀', '🥛', '🍼', '☕', '🫖',
  '🍵', '🧃', '🥤', '🧋', '🍶', '🍾', '🍷', '🍸',
  '🍹', '🍺', '🍻', '🥂', '🥃', '🧊', '🥄', '🍴',
];

export default function SelectEmojiScreen() {
  const router = useRouter();
  const { listId, itemId } = useLocalSearchParams();
  const listIdStr = typeof listId === 'string' ? listId : listId?.[0] || '';
  const itemIdStr = typeof itemId === 'string' ? itemId : itemId?.[0] || '';
  
  const { getList, dispatch } = useApp();
  const list = getList(listIdStr);
  const item = list?.items.find(i => i.id === itemIdStr);

  const [customInput, setCustomInput] = useState('');

  // 处理自定义输入的逻辑
  const processCustomInput = (input: string): string => {
    if (!input.trim()) {return '';}
    
    // 如果输入的是emoji（检查是否为单个emoji字符）
    const emojiRegex = /^[\u{1F300}-\u{1F9FF}]|^[\u{2600}-\u{27BF}]|^[\u{1F600}-\u{1F64F}]|^[\u{1F680}-\u{1F6FF}]|^[\u{1F1E0}-\u{1F1FF}]/u;
    if (emojiRegex.test(input)) {
      // 取第一个emoji字符
      const match = input.match(emojiRegex);
      return match ? match[0] : input.charAt(0);
    }
    
    // 如果是文字，取第一个字符
    return input.charAt(0).toUpperCase();
  };

  const handleCustomSubmit = () => {
    if (!customInput.trim()) {
      Alert.alert('提示', '请输入emoji或文字');
      return;
    }
    
    const processedEmoji = processCustomInput(customInput);
    handleSelectEmoji(processedEmoji);
    setCustomInput('');
  };

  const handleSelectEmoji = (emoji: string) => {
    HapticFeedback.light();
    dispatch({
      type: 'UPDATE_ITEM',
      payload: { listId: listIdStr, itemId: itemIdStr, updates: { emoji } },
    });
    router.back();
  };

  const handleRemoveEmoji = () => {
    HapticFeedback.light();
    dispatch({
      type: 'UPDATE_ITEM',
      payload: { listId: listIdStr, itemId: itemIdStr, updates: { emoji: undefined } },
    });
    router.back();
  };

  const renderEmojiItem = ({ item: emoji }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.emojiButton,
        item?.emoji === emoji && styles.selectedEmoji,
      ]}
      onPress={() => handleSelectEmoji(emoji)}
      activeOpacity={0.7}
    >
      <Text style={styles.emojiText}>{emoji}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Choose Emoji',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
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
                placeholderTextColor={Colors.textTertiary}
                maxLength={10}
                returnKeyType="done"
                onSubmitEditing={handleCustomSubmit}
              />
              <TouchableOpacity
                style={[styles.submitButton, !customInput.trim() && styles.submitButtonDisabled]}
                onPress={handleCustomSubmit}
                disabled={!customInput.trim()}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name="checkmark" 
                  size={20} 
                  color={customInput.trim() ? Colors.primary : Colors.textTertiary} 
                />
              </TouchableOpacity>
            </View>
            {customInput.trim() && (
              <View style={styles.preview}>
                <Text style={styles.previewLabel}>Preview:</Text>
                <View style={styles.previewEmoji}>
                  <Text style={styles.previewText}>{processCustomInput(customInput)}</Text>
                </View>
              </View>
            )}
          </View>
          
          <FlatList
            data={EMOJI_DATA}
            renderItem={renderEmojiItem}
            keyExtractor={(item) => item}
            numColumns={6}
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
                <Ionicons name="trash-outline" size={20} color={Colors.error} />
                <Text style={styles.removeText}>Remove emoji</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  content: {
    flex: 1,
    padding: 24,
  },
  
  subtitle: {
    fontSize: 17,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  
  customInputSection: {
    marginBottom: 32,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
  },
  
  inputLabel: {
    fontSize: 16,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
    marginBottom: 12,
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 12,
  },
  
  submitButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  
  submitButtonDisabled: {
    backgroundColor: Colors.surface,
  },
  
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.background,
  },
  
  previewLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: 12,
  },
  
  previewEmoji: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  
  selectedEmoji: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '20',
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
    backgroundColor: Colors.surface,
  },
  
  removeText: {
    fontSize: 16,
    color: Colors.error,
    marginLeft: 8,
    fontWeight: Typography.fontWeight.medium,
  },
});