import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Header, EmptyState, Button, ArchiveListCard } from '@/components/ui'
import { Spacing } from '@/constants/Layout'
import { Typography } from '@/constants/Typography'
import { useApp } from '@/context/AppContext'
import { useThemeColors } from '@/hooks/useThemeColors'
import { ShoppingList } from '@/types'
import { HapticFeedback } from '@/utils/haptics'
import {
  getListPreview,
  getCompletedCount,
  getRelativeTime,
} from '@/utils/listHelpers'

export default function TrashScreen() {
  const router = useRouter()
  const { getDeletedLists, dispatch } = useApp()
  const deletedLists = getDeletedLists()
  const colors = useThemeColors()

  const handleRestoreList = (listId: string) => {
    dispatch({ type: 'RESTORE_LIST', payload: { id: listId } })
  }

  const handleDeletePermanently = (listId: string) => {
    dispatch({ type: 'PERMANENTLY_DELETE_LIST', payload: { id: listId } })
  }

  const handleEmptyTrash = () => {
    if (deletedLists.length === 0) {
      return
    }

    Alert.alert(
      'Empty Trash',
      `Are you sure you want to permanently delete all ${deletedLists.length} lists? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Empty Trash',
          style: 'destructive',
          onPress: () => {
            HapticFeedback.medium()
            deletedLists.forEach(list => {
              dispatch({
                type: 'PERMANENTLY_DELETE_LIST',
                payload: { id: list.id },
              })
            })
          },
        },
      ]
    )
  }

  const renderListItem = ({
    item,
    index,
  }: {
    item: ShoppingList
    index: number
  }) => (
    <ArchiveListCard
      item={item}
      index={index}
      type="deleted"
      onRestore={handleRestoreList}
      onPermanentDelete={handleDeletePermanently}
      getListPreview={getListPreview}
      getCompletedCount={getCompletedCount}
      getRelativeTime={getRelativeTime}
    />
  )

  if (deletedLists.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <Header
          title="Trash"
          showBackButton
          onBackPress={() => router.back()}
        />
        <View style={styles.emptyContainer}>
          <EmptyState
            title="Trash is empty"
            subtitle="Deleted lists will appear here for 30 days before being permanently removed"
            illustration={
              <Image
                source={require('@/assets/images/trash.png')}
                style={styles.illustration}
                resizeMode="contain"
              />
            }
            action={
              <Button title="Go Back" onPress={() => router.back()} fullWidth />
            }
          />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Header
        title="Trash"
        showBackButton
        onBackPress={() => router.back()}
        rightComponent={
          <TouchableOpacity onPress={handleEmptyTrash}>
            <Text style={[styles.emptyTrashText, { color: colors.error }]}>
              Empty
            </Text>
          </TouchableOpacity>
        }
      />

      <View
        style={[
          styles.infoContainer,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          Items in trash are automatically deleted after 30 days
        </Text>
      </View>

      <FlatList
        data={deletedLists}
        renderItem={renderListItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  emptyContainer: {
    flex: 1,
  },

  illustration: {
    width: 200,
    height: 200,
  },

  infoContainer: {
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },

  infoText: {
    ...Typography.textStyles.caption,
    textAlign: 'center',
  },

  emptyTrashText: {
    ...Typography.textStyles.body,
    fontWeight: Typography.fontWeight.semibold,
  },

  listContainer: {
    padding: Spacing.screenPadding,
  },
})
