import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'

import { ProgressChip, FadeInListItem } from '@/components/ui'
import { Colors } from '@/constants/Colors'
import { Spacing, BorderRadius, Shadows } from '@/constants/Layout'
import { Typography } from '@/constants/Typography'
import { ShoppingList } from '@/types'
import { HapticFeedback } from '@/utils/haptics'

interface ArchiveListCardProps {
  item: ShoppingList
  index: number
  type: 'archived' | 'deleted'
  onRestore: (listId: string, listName: string) => void
  onPermanentDelete: (listId: string, listName: string) => void
  getListPreview: (list: ShoppingList) => string
  getCompletedCount: (list: ShoppingList) => number
  getDaysInTrash?: (deletedAt: Date) => number
}

export function ArchiveListCard({
  item,
  index,
  type,
  onRestore,
  onPermanentDelete,
  getListPreview,
  getCompletedCount,
  getDaysInTrash,
}: ArchiveListCardProps) {
  const completedCount = getCompletedCount(item)
  const totalCount = item.items.length

  const handleRestoreList = () => {
    Alert.alert(
      'Restore List',
      `Are you sure you want to restore "${item.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          onPress: () => {
            HapticFeedback.success()
            onRestore(item.id, item.name)
          },
        },
      ]
    )
  }

  const handleDeletePermanently = () => {
    Alert.alert(
      'Delete Permanently',
      `Are you sure you want to permanently delete "${item.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            HapticFeedback.medium()
            onPermanentDelete(item.id, item.name)
          },
        },
      ]
    )
  }

  const renderDateText = () => {
    if (type === 'deleted' && getDaysInTrash && item.deletedAt) {
      const daysInTrash = getDaysInTrash(item.deletedAt)
      return (
        <Text style={styles.deletedDate}>
          Deleted {daysInTrash} {daysInTrash === 1 ? 'day' : 'days'} ago
        </Text>
      )
    }

    return (
      <Text style={styles.archivedDate}>
        Archived {item.updatedAt.toLocaleDateString()}
      </Text>
    )
  }

  return (
    <FadeInListItem delay={index * 100}>
      <View style={[styles.listCard, type === 'deleted' && styles.deletedCard]}>
        <View style={styles.listCardContent}>
          <View style={styles.listCardLeft}>
            <Text style={styles.listTitle} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.listPreview} numberOfLines={1}>
              {getListPreview(item)}
            </Text>
            {renderDateText()}
          </View>

          <View style={styles.listCardRight}>
            <ProgressChip
              completed={completedCount}
              total={totalCount}
              size={36}
            />
          </View>
        </View>

        <View style={styles.listActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleRestoreList}
          >
            <Ionicons
              name="arrow-undo-outline"
              size={16}
              color={Colors.primary}
            />
            <Text style={[styles.actionText, { color: Colors.primary }]}>
              Restore
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDeletePermanently}
          >
            <Ionicons name="trash-outline" size={16} color={Colors.error} />
            <Text style={[styles.actionText, { color: Colors.error }]}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </FadeInListItem>
  )
}

const styles = StyleSheet.create({
  listCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    ...Shadows.medium,
  },

  deletedCard: {
    opacity: 0.8,
  },

  listCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },

  listCardLeft: {
    flex: 1,
  },

  listCardRight: {
    marginLeft: Spacing.md,
  },

  listTitle: {
    ...Typography.textStyles.subtitle,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },

  listPreview: {
    ...Typography.textStyles.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },

  archivedDate: {
    ...Typography.textStyles.caption,
    color: Colors.textTertiary,
    fontSize: 11,
  },

  deletedDate: {
    ...Typography.textStyles.caption,
    color: Colors.error,
    fontSize: 11,
  },

  listActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },

  actionText: {
    ...Typography.textStyles.caption,
    marginLeft: Spacing.xs,
  },
})
