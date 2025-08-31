import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import {
  Header,
  Input,
  Button,
  FloatingActionButton,
  FadeInListItem,
} from '@/components/ui'
import { Colors } from '@/constants/Colors'
import { Spacing, BorderRadius, Shadows } from '@/constants/Layout'
import { Typography } from '@/constants/Typography'
import { useApp } from '@/context/AppContext'
import { ItemCategory } from '@/types'
import { HapticFeedback } from '@/utils/haptics'

const CATEGORY_COLORS = [
  '#4CAF50',
  '#2196F3',
  '#F44336',
  '#FF9800',
  '#9C27B0',
  '#FF5722',
  '#607D8B',
  '#795548',
  '#E91E63',
  '#3F51B5',
  '#00BCD4',
  '#8BC34A',
  '#FFC107',
  '#673AB7',
  '#009688',
]

const CATEGORY_ICONS = [
  'basket-outline',
  'nutrition-outline',
  'fish-outline',
  'leaf-outline',
  'wine-outline',
  'fast-food-outline',
  'person-outline',
  'home-outline',
  'medical-outline',
  'shirt-outline',
  'library-outline',
  'car-outline',
  'phone-portrait-outline',
  'game-controller-outline',
  'musical-notes-outline',
]

export default function CategoriesScreen() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ItemCategory | null>(
    null
  )
  const [newCategoryName, setNewCategoryName] = useState('')
  const [selectedColor, setSelectedColor] = useState(CATEGORY_COLORS[0])
  const [selectedIcon, setSelectedIcon] = useState(CATEGORY_ICONS[0])

  const router = useRouter()
  const { state, dispatch, getCustomItemsByCategory } = useApp()

  const handleCreateCategory = () => {
    if (newCategoryName.trim().length === 0) {
      Alert.alert('Error', 'Please enter a category name')
      return
    }

    if (
      state.categories.some(
        cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase()
      )
    ) {
      Alert.alert('Error', 'A category with this name already exists')
      return
    }

    if (editingCategory) {
      dispatch({
        type: 'UPDATE_CATEGORY',
        payload: {
          id: editingCategory.id,
          updates: {
            name: newCategoryName.trim(),
            color: selectedColor,
            icon: selectedIcon,
          },
        },
      })
      HapticFeedback.success()
      setEditingCategory(null)
    } else {
      dispatch({
        type: 'CREATE_CATEGORY',
        payload: {
          name: newCategoryName.trim(),
          color: selectedColor,
          icon: selectedIcon,
        },
      })
      HapticFeedback.success()
    }

    // Reset form
    setNewCategoryName('')
    setSelectedColor(CATEGORY_COLORS[0])
    setSelectedIcon(CATEGORY_ICONS[0])
    setShowCreateForm(false)
  }

  const handleEditCategory = (category: ItemCategory) => {
    setEditingCategory(category)
    setNewCategoryName(category.name)
    setSelectedColor(category.color)
    setSelectedIcon(category.icon || CATEGORY_ICONS[0])
    setShowCreateForm(true)
    HapticFeedback.light()
  }

  const handleDeleteCategory = (category: ItemCategory) => {
    const itemsInCategory = getCustomItemsByCategory(category.id)

    if (itemsInCategory.length > 0) {
      Alert.alert(
        'Cannot Delete Category',
        `This category contains ${itemsInCategory.length} custom item${itemsInCategory.length === 1 ? '' : 's'}. Please remove or reassign these items first.`
      )
      return
    }

    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${category.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch({
              type: 'DELETE_CATEGORY',
              payload: { id: category.id },
            })
            HapticFeedback.success()
          },
        },
      ]
    )
  }

  const cancelEdit = () => {
    setEditingCategory(null)
    setNewCategoryName('')
    setSelectedColor(CATEGORY_COLORS[0])
    setSelectedIcon(CATEGORY_ICONS[0])
    setShowCreateForm(false)
  }

  const renderColorPicker = () => (
    <View style={styles.colorPicker}>
      <Text style={styles.pickerLabel}>Color</Text>
      <View style={styles.colorGrid}>
        {CATEGORY_COLORS.map(color => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorOption,
              { backgroundColor: color },
              selectedColor === color && styles.selectedColorOption,
            ]}
            onPress={() => {
              setSelectedColor(color)
              HapticFeedback.selection()
            }}
          >
            {selectedColor === color && (
              <Ionicons name="checkmark" size={16} color="white" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  const renderIconPicker = () => (
    <View style={styles.iconPicker}>
      <Text style={styles.pickerLabel}>Icon</Text>
      <View style={styles.iconGrid}>
        {CATEGORY_ICONS.map(icon => (
          <TouchableOpacity
            key={icon}
            style={[
              styles.iconOption,
              selectedIcon === icon && styles.selectedIconOption,
            ]}
            onPress={() => {
              setSelectedIcon(icon)
              HapticFeedback.selection()
            }}
          >
            <Ionicons
              name={icon as any}
              size={20}
              color={selectedIcon === icon ? Colors.primary : selectedColor}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  const renderCreateForm = () => (
    <View style={styles.createForm}>
      <Text style={styles.formTitle}>
        {editingCategory ? 'Edit Category' : 'Create New Category'}
      </Text>

      <Input
        label="Category Name"
        value={newCategoryName}
        onChangeText={setNewCategoryName}
        placeholder="e.g., Electronics"
        autoFocus
      />

      {renderColorPicker()}
      {renderIconPicker()}

      <View style={styles.formButtons}>
        <Button
          title="Cancel"
          onPress={cancelEdit}
          variant="secondary"
          style={styles.formButton}
        />
        <Button
          title={editingCategory ? 'Update' : 'Create'}
          onPress={handleCreateCategory}
          style={styles.formButton}
        />
      </View>
    </View>
  )

  const renderCategoryItem = ({
    item,
    index,
  }: {
    item: ItemCategory
    index: number
  }) => {
    const itemCount = getCustomItemsByCategory(item.id).length

    return (
      <FadeInListItem delay={index * 50}>
        <View style={styles.categoryCard}>
          <View style={styles.categoryCardContent}>
            <View style={styles.categoryInfo}>
              <View
                style={[
                  styles.categoryIconContainer,
                  { backgroundColor: item.color },
                ]}
              >
                <Ionicons
                  name={(item.icon as any) || 'folder-outline'}
                  size={24}
                  color="white"
                />
              </View>
              <View style={styles.categoryDetails}>
                <Text style={styles.categoryName}>{item.name}</Text>
                <Text style={styles.categoryItemCount}>
                  {itemCount} item{itemCount === 1 ? '' : 's'}
                </Text>
              </View>
            </View>

            <View style={styles.categoryActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEditCategory(item)}
              >
                <Ionicons
                  name="pencil-outline"
                  size={20}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDeleteCategory(item)}
              >
                <Ionicons name="trash-outline" size={20} color={Colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </FadeInListItem>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Categories"
        showBackButton
        onBackPress={() => router.back()}
      />

      <View style={styles.content}>
        {showCreateForm && renderCreateForm()}

        <FlatList
          data={state.categories}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.categoriesList}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {!showCreateForm && (
        <View style={styles.fab}>
          <FloatingActionButton
            onPress={() => setShowCreateForm(true)}
            icon="add"
          />
        </View>
      )}
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

  createForm: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadows.medium,
  },

  formTitle: {
    ...Typography.textStyles.subtitle,
    color: Colors.text,
    marginBottom: Spacing.lg,
    fontWeight: Typography.fontWeight.semibold,
  },

  colorPicker: {
    marginBottom: Spacing.lg,
  },

  iconPicker: {
    marginBottom: Spacing.lg,
  },

  pickerLabel: {
    ...Typography.textStyles.body,
    color: Colors.text,
    marginBottom: Spacing.sm,
    fontWeight: Typography.fontWeight.semibold,
  },

  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },

  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },

  selectedColorOption: {
    borderColor: Colors.text,
  },

  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },

  iconOption: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },

  selectedIconOption: {
    backgroundColor: Colors.surfaceElevated,
    borderColor: Colors.primary,
  },

  formButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },

  formButton: {
    flex: 1,
  },

  categoriesList: {
    paddingBottom: 100, // Space for FAB
  },

  categoryCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },

  categoryCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },

  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },

  categoryDetails: {
    flex: 1,
  },

  categoryName: {
    ...Typography.textStyles.subtitle,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },

  categoryItemCount: {
    ...Typography.textStyles.caption,
    color: Colors.textSecondary,
  },

  categoryActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  actionButton: {
    padding: Spacing.sm,
  },

  fab: {
    position: 'absolute',
    right: Spacing.screenPadding,
    bottom: Spacing.xl,
  },
})
