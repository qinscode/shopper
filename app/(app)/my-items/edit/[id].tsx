import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { useRouter, useLocalSearchParams } from 'expo-router'
import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Header, Input, Button } from '@/components/ui'
import { Colors } from '@/constants/Colors'
import { Spacing, BorderRadius } from '@/constants/Layout'
import { Typography } from '@/constants/Typography'
import { useApp } from '@/context/AppContext'
import { HapticFeedback } from '@/utils/haptics'

export default function EditCustomItemScreen() {
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [defaultUrl, setDefaultUrl] = useState('')
  const [defaultImageUri, setDefaultImageUri] = useState('')
  const [notes, setNotes] = useState('')
  const [tags, setTags] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  )
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { id } = useLocalSearchParams()
  const itemId = typeof id === 'string' ? id : id?.[0] || ''

  const { state, dispatch, getCustomItem } = useApp()

  useEffect(() => {
    const item = getCustomItem(itemId)
    if (item) {
      setName(item.name)
      setBrand(item.brand || '')
      setCategory(item.category || '')
      setDefaultUrl(item.defaultUrl || '')
      setDefaultImageUri(item.defaultImageUri || '')
      setNotes(item.notes || '')
      setTags(item.tags?.join(', ') || '')

      // Find category ID
      const categoryId = state.categories.find(
        c => c.name === item.category
      )?.id
      setSelectedCategoryId(categoryId || null)
    } else {
      Alert.alert('Error', 'Item not found')
      router.back()
    }
  }, [itemId, getCustomItem, state.categories, router])

  const handleSave = async () => {
    if (name.trim().length === 0) {
      Alert.alert('Error', 'Please enter an item name')
      return
    }

    setLoading(true)

    try {
      const selectedCategory = state.categories.find(
        c => c.id === selectedCategoryId
      )
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      dispatch({
        type: 'UPDATE_CUSTOM_ITEM',
        payload: {
          id: itemId,
          updates: {
            name: name.trim(),
            brand: brand.trim() || undefined,
            category: selectedCategory?.name,
            defaultUrl: defaultUrl.trim() || undefined,
            defaultImageUri: defaultImageUri || undefined,
            notes: notes.trim() || undefined,
            tags: tagsArray.length > 0 ? tagsArray : undefined,
          },
        },
      })

      HapticFeedback.success()
      router.back()
    } catch (error) {
      Alert.alert('Error', 'Failed to update item')
      HapticFeedback.error()
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = () => {
    Alert.alert('Delete Item', `Are you sure you want to delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          dispatch({
            type: 'DELETE_CUSTOM_ITEM',
            payload: { id: itemId },
          })
          HapticFeedback.success()
          router.back()
        },
      },
    ])
  }

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert(
        'Permission needed',
        'Camera roll permissions are required to add images.'
      )
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled) {
      setDefaultImageUri(result.assets[0].uri)
      HapticFeedback.light()
    }
  }

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert(
        'Permission needed',
        'Camera permissions are required to take photos.'
      )
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled) {
      setDefaultImageUri(result.assets[0].uri)
      HapticFeedback.light()
    }
  }

  const handleRemoveImage = () => {
    setDefaultImageUri('')
    HapticFeedback.light()
  }

  const renderCategorySelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Category</Text>
      <View style={styles.categoryGrid}>
        <TouchableOpacity
          style={[
            styles.categoryOption,
            selectedCategoryId === null && styles.selectedCategoryOption,
          ]}
          onPress={() => {
            setSelectedCategoryId(null)
            setCategory('')
            HapticFeedback.selection()
          }}
        >
          <Ionicons
            name="close-circle-outline"
            size={20}
            color={
              selectedCategoryId === null ? Colors.text : Colors.textSecondary
            }
          />
          <Text
            style={[
              styles.categoryOptionText,
              selectedCategoryId === null && styles.selectedCategoryOptionText,
            ]}
          >
            None
          </Text>
        </TouchableOpacity>

        {state.categories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryOption,
              selectedCategoryId === cat.id && styles.selectedCategoryOption,
              { borderColor: cat.color },
            ]}
            onPress={() => {
              setSelectedCategoryId(cat.id)
              setCategory(cat.name)
              HapticFeedback.selection()
            }}
          >
            <Ionicons
              name={(cat.icon as any) || 'folder-outline'}
              size={20}
              color={selectedCategoryId === cat.id ? Colors.text : cat.color}
            />
            <Text
              style={[
                styles.categoryOptionText,
                selectedCategoryId === cat.id &&
                  styles.selectedCategoryOptionText,
                {
                  color:
                    selectedCategoryId === cat.id ? Colors.text : cat.color,
                },
              ]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  const renderImageSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Default Image</Text>

      {defaultImageUri ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: defaultImageUri }}
            style={styles.previewImage}
          />
          <View style={styles.imageActions}>
            <TouchableOpacity
              style={styles.imageActionButton}
              onPress={handlePickImage}
            >
              <Ionicons
                name="images-outline"
                size={20}
                color={Colors.primary}
              />
              <Text style={styles.imageActionText}>Change</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imageActionButton}
              onPress={handleRemoveImage}
            >
              <Ionicons name="trash-outline" size={20} color={Colors.error} />
              <Text style={[styles.imageActionText, { color: Colors.error }]}>
                Remove
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons
            name="image-outline"
            size={48}
            color={Colors.textSecondary}
          />
          <Text style={styles.imagePlaceholderText}>No image selected</Text>
          <View style={styles.imageActions}>
            <TouchableOpacity
              style={styles.imageActionButton}
              onPress={handlePickImage}
            >
              <Ionicons
                name="images-outline"
                size={20}
                color={Colors.primary}
              />
              <Text style={styles.imageActionText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imageActionButton}
              onPress={handleTakePhoto}
            >
              <Ionicons
                name="camera-outline"
                size={20}
                color={Colors.primary}
              />
              <Text style={styles.imageActionText}>Camera</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Edit Item"
        showBackButton
        onBackPress={() => router.back()}
        rightComponent={
          <TouchableOpacity onPress={handleDelete}>
            <Ionicons name="trash-outline" size={24} color={Colors.error} />
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Input
            label="Item Name *"
            value={name}
            onChangeText={setName}
            placeholder="e.g., Organic Bananas"
          />
        </View>

        <View style={styles.section}>
          <Input
            label="Brand"
            value={brand}
            onChangeText={setBrand}
            placeholder="e.g., Chiquita"
          />
        </View>

        {renderCategorySelector()}

        <View style={styles.section}>
          <Input
            label="Default URL"
            value={defaultUrl}
            onChangeText={setDefaultUrl}
            placeholder="https://..."
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {renderImageSection()}

        <View style={styles.section}>
          <Input
            label="Tags"
            value={tags}
            onChangeText={setTags}
            placeholder="organic, healthy, weekly (comma separated)"
            multiline
          />
        </View>

        <View style={styles.section}>
          <Input
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            placeholder="Additional notes or specifications..."
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Update Item"
            onPress={handleSave}
            loading={loading}
            fullWidth
          />

          <Button
            title="Delete Item"
            onPress={handleDelete}
            variant="secondary"
            style={styles.deleteButton}
            textStyle={{ color: Colors.error }}
            fullWidth
          />
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

  content: {
    flex: 1,
    padding: Spacing.screenPadding,
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

  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },

  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  selectedCategoryOption: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  categoryOptionText: {
    ...Typography.textStyles.body,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },

  selectedCategoryOptionText: {
    color: Colors.text,
    fontWeight: Typography.fontWeight.semibold,
  },

  imageContainer: {
    alignItems: 'center',
  },

  imagePlaceholder: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },

  imagePlaceholderText: {
    ...Typography.textStyles.body,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },

  previewImage: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },

  imageActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },

  imageActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  imageActionText: {
    ...Typography.textStyles.body,
    color: Colors.primary,
    marginLeft: Spacing.sm,
  },

  buttonContainer: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.xxl,
    gap: Spacing.md,
  },

  deleteButton: {
    borderColor: Colors.error,
  },
})
