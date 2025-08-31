import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header, EmptyState, Button, ProgressChip, FadeInListItem } from '@/components/ui';
import { Colors } from '@/constants/Colors';
import { Spacing, BorderRadius, Shadows } from '@/constants/Layout';
import { Typography } from '@/constants/Typography';
import { useApp } from '@/context/AppContext';
import { ShoppingList } from '@/types';
import { HapticFeedback } from '@/utils/haptics';

export default function TrashScreen() {
  const router = useRouter();
  const { getDeletedLists, dispatch } = useApp();
  const deletedLists = getDeletedLists();

  const handleRestoreList = (listId: string, listName: string) => {
    Alert.alert(
      'Restore List',
      `Are you sure you want to restore "${listName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          onPress: () => {
            HapticFeedback.success();
            dispatch({ type: 'RESTORE_LIST', payload: { id: listId } });
          },
        },
      ],
    );
  };

  const handleDeletePermanently = (listId: string, listName: string) => {
    Alert.alert(
      'Delete Permanently',
      `Are you sure you want to permanently delete "${listName}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            HapticFeedback.medium();
            dispatch({ type: 'PERMANENTLY_DELETE_LIST', payload: { id: listId } });
          },
        },
      ],
    );
  };

  const handleEmptyTrash = () => {
    if (deletedLists.length === 0) {return;}
    
    Alert.alert(
      'Empty Trash',
      `Are you sure you want to permanently delete all ${deletedLists.length} lists? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Empty Trash',
          style: 'destructive',
          onPress: () => {
            HapticFeedback.medium();
            deletedLists.forEach(list => {
              dispatch({ type: 'PERMANENTLY_DELETE_LIST', payload: { id: list.id } });
            });
          },
        },
      ],
    );
  };

  const getListPreview = (list: ShoppingList): string => {
    const visibleItems = list.items.slice(0, 3);
    const itemNames = visibleItems.map(item => item.name).join(', ');
    const remainingCount = list.items.length - visibleItems.length;
    
    if (remainingCount > 0) {
      return `${itemNames} + ${remainingCount} more`;
    }
    
    return itemNames || 'No items';
  };

  const getCompletedCount = (list: ShoppingList): number => {
    return list.items.filter(item => item.isCompleted).length;
  };

  const getDaysInTrash = (deletedAt: Date): number => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - deletedAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const renderListItem = ({ item, index }: { item: ShoppingList; index: number }) => {
    const completedCount = getCompletedCount(item);
    const totalCount = item.items.length;
    const daysInTrash = getDaysInTrash(item.deletedAt!);

    return (
      <FadeInListItem delay={index * 100}>
        <View style={styles.listCard}>
          <View style={styles.listCardContent}>
            <View style={styles.listCardLeft}>
              <Text style={styles.listTitle} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.listPreview} numberOfLines={1}>
                {getListPreview(item)}
              </Text>
              <Text style={styles.deletedDate}>
                Deleted {daysInTrash} {daysInTrash === 1 ? 'day' : 'days'} ago
              </Text>
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
              onPress={() => handleRestoreList(item.id, item.name)}
            >
              <Ionicons name="arrow-undo-outline" size={16} color={Colors.primary} />
              <Text style={[styles.actionText, { color: Colors.primary }]}>Restore</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeletePermanently(item.id, item.name)}
            >
              <Ionicons name="trash-outline" size={16} color={Colors.error} />
              <Text style={[styles.actionText, { color: Colors.error }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </FadeInListItem>
    );
  };

  if (deletedLists.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="Trash"
          showBackButton
          onBackPress={() => router.back()}
        />
        <View style={styles.emptyContainer}>
          <EmptyState
            title="Trash is empty"
            subtitle="Deleted lists will appear here for 30 days before being permanently removed"
            icon={<Ionicons name="trash-outline" size={48} color={Colors.textTertiary} />}
            action={
              <Button
                title="Go Back"
                onPress={() => router.back()}
                fullWidth
              />
            }
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Trash"
        showBackButton
        onBackPress={() => router.back()}
        rightComponent={
          <TouchableOpacity onPress={handleEmptyTrash}>
            <Text style={styles.emptyTrashText}>Empty</Text>
          </TouchableOpacity>
        }
      />
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Items in trash are automatically deleted after 30 days
        </Text>
      </View>
      
      <FlatList
        data={deletedLists}
        renderItem={renderListItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  emptyContainer: {
    flex: 1,
  },
  
  infoContainer: {
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  
  infoText: {
    ...Typography.textStyles.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  
  emptyTrashText: {
    ...Typography.textStyles.body,
    color: Colors.error,
    fontWeight: Typography.fontWeight.semibold,
  },
  
  listContainer: {
    padding: Spacing.screenPadding,
  },
  
  listCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    ...Shadows.medium,
    opacity: 0.8, // Slightly faded to indicate deleted state
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
});