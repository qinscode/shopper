import { Ionicons } from '@expo/vector-icons'
import { useRouter, useLocalSearchParams } from 'expo-router'
import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Keyboard,
  Image,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Header, Input, Button } from '@/components/ui'
import { Colors } from '@/constants/Colors'
import { Spacing, BorderRadius, Shadows } from '@/constants/Layout'
import { Typography } from '@/constants/Typography'
import { useApp } from '@/context/AppContext'
import { SUGGESTED_ITEMS, CustomItem } from '@/types'
import { HapticFeedback } from '@/utils/haptics'

export default function AddItemsScreen() {
  const [searchText, setSearchText] = useState('')
  const [recentlyAdded, setRecentlyAdded] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'suggestions' | 'custom'>(
    'suggestions'
  )
  const inputRef = useRef<TextInput>(null)
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const listId = typeof id === 'string' ? id : id?.[0] || ''

  const { dispatch, getList, state, getMostUsedCustomItems } = useApp()
  const list = getList(listId)

  // Filter out items that are already in the list
  const existingItemNames =
    list?.items.map(item => item.name.toLowerCase()) || []

  const filteredSuggestions = SUGGESTED_ITEMS.filter(
    item =>
      item.toLowerCase().includes(searchText.toLowerCase()) &&
      !existingItemNames.includes(item.toLowerCase())
  ).slice(0, 10) // Limit to 10 suggestions

  const filteredCustomItems = state.customItems.filter(
    item =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) &&
      !existingItemNames.includes(item.name.toLowerCase())
  )

  const handleAddItem = (itemName: string, customItemId?: string) => {
    if (existingItemNames.includes(itemName.toLowerCase())) {
      return // Don't add duplicate items
    }

    dispatch({
      type: 'ADD_ITEM',
      payload: { listId, name: itemName, customItemId },
    })

    // Track usage if it's a custom item
    if (customItemId) {
      dispatch({
        type: 'USE_CUSTOM_ITEM',
        payload: { id: customItemId },
      })
    }

    HapticFeedback.success()

    // Add to recently added list
    setRecentlyAdded(prev => {
      const updated = [itemName, ...prev.filter(name => name !== itemName)]
      return updated.slice(0, 5) // Keep only last 5 items
    })

    // Clear search text if it matches the added item
    if (searchText.toLowerCase() === itemName.toLowerCase()) {
      setSearchText('')
    }

    // Keep focus on input for quick adding
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  const handleAddCustomItem = () => {
    const trimmedText = searchText.trim()
    if (
      trimmedText.length > 0 &&
      !existingItemNames.includes(trimmedText.toLowerCase())
    ) {
      handleAddItem(trimmedText)
    }
  }

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'suggestions' && styles.activeTab]}
        onPress={() => {
          setActiveTab('suggestions')
          HapticFeedback.selection()
        }}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'suggestions' && styles.activeTabText,
          ]}
        >
          Suggestions ({filteredSuggestions.length})
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'custom' && styles.activeTab]}
        onPress={() => {
          setActiveTab('custom')
          HapticFeedback.selection()
        }}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'custom' && styles.activeTabText,
          ]}
        >
          My Items ({filteredCustomItems.length})
        </Text>
      </TouchableOpacity>
    </View>
  )

  const renderSuggestionItem = ({
    item,
    index,
  }: {
    item: string
    index: number
  }) => {
    const isAlreadyInList = existingItemNames.includes(item.toLowerCase())

    return (
      <TouchableOpacity
        style={[styles.suggestionItem, isAlreadyInList && styles.disabledItem]}
        onPress={() => !isAlreadyInList && handleAddItem(item)}
        disabled={isAlreadyInList}
        activeOpacity={0.7}
      >
        <View style={styles.suggestionContent}>
          <Text
            style={[
              styles.suggestionText,
              isAlreadyInList && styles.disabledText,
            ]}
          >
            {item}
          </Text>
          {isAlreadyInList && (
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={Colors.success}
            />
          )}
        </View>

        {!isAlreadyInList && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddItem(item)}
          >
            <Text style={styles.addButtonText}>ADD</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    )
  }

  const renderCustomItem = ({
    item,
    index,
  }: {
    item: CustomItem
    index: number
  }) => {
    const isAlreadyInList = existingItemNames.includes(item.name.toLowerCase())

    return (
      <TouchableOpacity
        style={[styles.customItem, isAlreadyInList && styles.disabledItem]}
        onPress={() => !isAlreadyInList && handleAddItem(item.name, item.id)}
        disabled={isAlreadyInList}
        activeOpacity={0.7}
      >
        <View style={styles.customItemContent}>
          <View style={styles.customItemLeft}>
            {item.defaultImageUri ? (
              <Image
                source={{ uri: item.defaultImageUri }}
                style={styles.customItemImage}
              />
            ) : (
              <View
                style={[
                  styles.customItemPlaceholder,
                  { backgroundColor: item.color || Colors.primary },
                ]}
              >
                <Text style={styles.customItemInitial}>
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.customItemInfo}>
            <Text
              style={[
                styles.customItemName,
                isAlreadyInList && styles.disabledText,
              ]}
            >
              {item.name}
            </Text>
            {item.brand && (
              <Text style={styles.customItemBrand}>{item.brand}</Text>
            )}
            {item.category && (
              <View style={styles.customItemCategory}>
                <View
                  style={[
                    styles.categoryDot,
                    {
                      backgroundColor:
                        state.categories.find(c => c.name === item.category)
                          ?.color || Colors.primary,
                    },
                  ]}
                />
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
            )}
            {item.usageCount > 0 && (
              <Text style={styles.usageCount}>
                Used {item.usageCount} times
              </Text>
            )}
          </View>

          <View style={styles.customItemRight}>
            {item.defaultUrl && (
              <Ionicons
                name="link"
                size={14}
                color={Colors.textSecondary}
                style={styles.attachment}
              />
            )}
            {isAlreadyInList && (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={Colors.success}
              />
            )}
          </View>
        </View>

        {!isAlreadyInList && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddItem(item.name, item.id)}
          >
            <Text style={styles.addButtonText}>ADD</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    )
  }

  const renderRecentItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.recentItem}
      onPress={() => handleAddItem(item)}
      activeOpacity={0.7}
    >
      <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
      <Text style={styles.recentText}>{item}</Text>
      <TouchableOpacity
        style={styles.quickAddButton}
        onPress={() => handleAddItem(item)}
      >
        <Ionicons name="add-circle-outline" size={20} color={Colors.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  )

  // Check if the current search text can be added as a custom item
  const canAddCustomItem =
    searchText.trim().length > 0 &&
    !existingItemNames.includes(searchText.trim().toLowerCase()) &&
    !filteredSuggestions.some(
      item => item.toLowerCase() === searchText.trim().toLowerCase()
    ) &&
    !filteredCustomItems.some(
      item => item.name.toLowerCase() === searchText.trim().toLowerCase()
    )

  const currentItems =
    activeTab === 'suggestions' ? filteredSuggestions : filteredCustomItems

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Add Items"
        showBackButton
        onBackPress={() => router.back()}
        rightComponent={
          <TouchableOpacity onPress={() => router.push('/(app)/my-items')}>
            <Ionicons name="library-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
        }
      />

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <Input
            ref={inputRef}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Type item name..."
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleAddCustomItem}
            style={styles.searchInput}
            leftIcon={
              <Ionicons name="search" size={20} color={Colors.textSecondary} />
            }
            rightIcon={
              searchText.length > 0 ? (
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={Colors.textSecondary}
                  />
                </TouchableOpacity>
              ) : undefined
            }
          />

          {canAddCustomItem && (
            <TouchableOpacity
              style={styles.customItemButton}
              onPress={handleAddCustomItem}
            >
              <View style={styles.customItemContent}>
                <Ionicons
                  name="add-circle-outline"
                  size={20}
                  color={Colors.primary}
                />
                <Text style={styles.customItemText}>
                  Add &#34;{searchText.trim()}&#34;
                </Text>
              </View>

              <Text style={styles.addButtonText}>ADD</Text>
            </TouchableOpacity>
          )}
        </View>

        {recentlyAdded.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recently Added</Text>
            <FlatList
              data={recentlyAdded}
              renderItem={renderRecentItem}
              keyExtractor={(item, index) => `recent-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentContainer}
            />
          </View>
        )}

        {renderTabBar()}

        <View style={styles.section}>
          {currentItems.length === 0 && searchText.length > 0 && (
            <View style={styles.noResultsContainer}>
              <Ionicons
                name="search-outline"
                size={48}
                color={Colors.textTertiary}
              />
              <Text style={styles.noResultsText}>No {activeTab} found</Text>
              {!canAddCustomItem && (
                <Text style={styles.noResultsSubtext}>
                  This item might already be in your list
                </Text>
              )}
            </View>
          )}

          {activeTab === 'suggestions' ? (
            <FlatList<string>
              data={filteredSuggestions}
              renderItem={renderSuggestionItem}
              keyExtractor={(item, index) => `${activeTab}-${index}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.suggestionsContainer}
              onScrollBeginDrag={() => Keyboard.dismiss()}
            />
          ) : (
            <FlatList<CustomItem>
              data={filteredCustomItems}
              renderItem={renderCustomItem}
              keyExtractor={(item, index) => `${activeTab}-${index}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.suggestionsContainer}
              onScrollBeginDrag={() => Keyboard.dismiss()}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    flex: 1,
    padding: Spacing.screenPadding,
  },

  searchContainer: {
    marginBottom: Spacing.lg,
  },

  searchInput: {
    marginBottom: Spacing.md,
  },

  customItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.small,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },

  customItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  customItemText: {
    ...Typography.textStyles.body,
    color: Colors.text,
    marginLeft: Spacing.sm,
    flex: 1,
  },

  section: {
    marginBottom: Spacing.lg,
  },

  sectionTitle: {
    ...Typography.textStyles.subtitle,
    color: Colors.text,
    marginBottom: Spacing.md,
    fontWeight: Typography.fontWeight.semibold,
  },

  recentContainer: {
    paddingRight: Spacing.md,
  },

  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    ...Shadows.small,
  },

  recentText: {
    ...Typography.textStyles.body,
    color: Colors.text,
    marginHorizontal: Spacing.sm,
  },

  quickAddButton: {
    marginLeft: Spacing.xs,
  },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: 4,
    marginBottom: Spacing.lg,
    ...Shadows.small,
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },

  activeTab: {
    backgroundColor: Colors.primary,
  },

  tabText: {
    ...Typography.textStyles.body,
    color: Colors.textSecondary,
    fontSize: 14,
  },

  activeTabText: {
    color: Colors.text,
    fontWeight: Typography.fontWeight.semibold,
  },

  suggestionsContainer: {
    paddingBottom: Spacing.xl,
  },

  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.small,
  },

  customItem: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    ...Shadows.small,
  },

  disabledItem: {
    opacity: 0.6,
  },

  suggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  suggestionText: {
    ...Typography.textStyles.body,
    color: Colors.text,
    flex: 1,
  },

  customItemLeft: {
    marginRight: Spacing.md,
  },

  customItemImage: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
  },

  customItemPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },

  customItemInitial: {
    ...Typography.textStyles.body,
    color: Colors.text,
    fontWeight: Typography.fontWeight.bold,
  },

  customItemInfo: {
    flex: 1,
  },

  customItemName: {
    ...Typography.textStyles.body,
    color: Colors.text,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: 2,
  },

  customItemBrand: {
    ...Typography.textStyles.caption,
    color: Colors.textSecondary,
    marginBottom: 2,
  },

  customItemCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },

  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: Spacing.xs,
  },

  categoryText: {
    ...Typography.textStyles.caption,
    color: Colors.textSecondary,
    fontSize: 11,
  },

  usageCount: {
    ...Typography.textStyles.caption,
    color: Colors.textTertiary,
    fontSize: 10,
  },

  customItemRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  attachment: {
    marginBottom: Spacing.xs,
  },

  disabledText: {
    color: Colors.textSecondary,
  },

  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    marginLeft: Spacing.md,
  },

  addButtonText: {
    ...Typography.textStyles.caption,
    color: Colors.text,
    fontWeight: Typography.fontWeight.semibold,
  },

  doneText: {
    ...Typography.textStyles.body,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semibold,
  },

  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },

  noResultsText: {
    ...Typography.textStyles.subtitle,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    textAlign: 'center',
  },

  noResultsSubtext: {
    ...Typography.textStyles.caption,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
})
