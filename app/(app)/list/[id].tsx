import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Header, EmptyState, Button, ListItem, ProgressChip, Checkbox } from '@/components/ui';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Layout';
import { useApp } from '@/context/AppContext';
import { ShoppingItem } from '@/types';

export default function ListDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const listId = typeof id === 'string' ? id : id?.[0] || '';
  
  const { getList, dispatch } = useApp();
  const list = getList(listId);

  if (!list) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="List Not Found"
          showBackButton
          onBackPress={() => router.back()}
        />
        <EmptyState
          title="List not found"
          subtitle="This list may have been deleted"
          action={
            <Button
              title="Go Back"
              onPress={() => router.back()}
              fullWidth
            />
          }
        />
      </SafeAreaView>
    );
  }

  const completedCount = list.items.filter(item => item.isCompleted).length;
  const totalCount = list.items.length;

  const handleAddItem = () => {
    router.push(`/(app)/add-items/${listId}`);
  };

  const handleToggleItem = (itemId: string) => {
    dispatch({
      type: 'TOGGLE_ITEM',
      payload: { listId, itemId }
    });
  };

  const handleDeleteItem = (itemId: string) => {
    dispatch({
      type: 'DELETE_ITEM',
      payload: { listId, itemId }
    });
  };

  const handleAddUrl = (itemId: string) => {
    router.push(`/(app)/add-url/${listId}/${itemId}`);
  };

  const handleAddImage = (itemId: string) => {
    router.push(`/(app)/add-image/${listId}/${itemId}`);
  };

  const handleArchiveList = () => {
    Alert.alert(
      'Archive List',
      `Are you sure you want to archive "${list.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive',
          onPress: () => {
            dispatch({
              type: 'ARCHIVE_LIST',
              payload: { id: listId }
            });
            router.back();
          }
        }
      ]
    );
  };

  const handleDeleteList = () => {
    Alert.alert(
      'Delete List',
      `Are you sure you want to delete "${list.name}"? You can restore it from the trash later.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch({
              type: 'DELETE_LIST',
              payload: { id: listId }
            });
            router.back();
          }
        }
      ]
    );
  };

  const renderRightActions = (itemId: string, itemName: string) => (
    <TouchableOpacity
      style={styles.deleteAction}
      onPress={() => {
        Alert.alert(
          'Delete Item',
          `Are you sure you want to delete "${itemName}"?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => handleDeleteItem(itemId)
            }
          ]
        );
      }}
    >
      <Ionicons name="trash-outline" size={24} color={Colors.text} />
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: ShoppingItem }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item.id, item.name)}
      rightThreshold={40}
    >
      <View style={styles.itemContainer}>
        <ListItem
          title={item.name}
          isCompleted={item.isCompleted}
          hasUrl={!!item.url}
          hasImage={!!item.imageUri}
          leftComponent={
            <Checkbox
              checked={item.isCompleted}
              onToggle={() => handleToggleItem(item.id)}
            />
          }
          style={styles.listItem}
        />
        
        <View style={styles.itemActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleAddUrl(item.id)}
          >
            <Ionicons name="link-outline" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleAddImage(item.id)}
          >
            <Ionicons name="image-outline" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </Swipeable>
  );

  if (list.items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title={list.name}
          showBackButton
          onBackPress={() => router.back()}
          rightComponent={
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => {
                  Alert.alert(
                    'List Options',
                    'Choose an action for this list',
                    [
                      {
                        text: 'Archive List',
                        onPress: handleArchiveList
                      },
                      {
                        text: 'Delete List',
                        style: 'destructive',
                        onPress: handleDeleteList
                      },
                      {
                        text: 'Cancel',
                        style: 'cancel'
                      }
                    ]
                  );
                }}
              >
                <Ionicons name="ellipsis-horizontal" size={24} color={Colors.text} />
              </TouchableOpacity>
              <ProgressChip completed={completedCount} total={totalCount} />
            </View>
          }
        />
        <EmptyState
          title="Your list is empty"
          subtitle="Click the button below to add an item now"
          icon={<Image source={require('@/assets/images/item_in_list_empty.png')} style={styles.emptyImage} resizeMode="contain" />}
          action={
            <Button
              title="+ Add Item"
              onPress={handleAddItem}
              fullWidth
            />
          }
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={list.name}
        showBackButton
        onBackPress={() => router.back()}
        rightComponent={
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => {
                Alert.alert(
                  'List Options',
                  'Choose an action for this list',
                  [
                    {
                      text: 'Archive List',
                      onPress: handleArchiveList
                    },
                    {
                      text: 'Delete List',
                      style: 'destructive',
                      onPress: handleDeleteList
                    },
                    {
                      text: 'Cancel',
                      style: 'cancel'
                    }
                  ]
                );
              }}
            >
              <Ionicons name="ellipsis-horizontal" size={24} color={Colors.text} />
            </TouchableOpacity>
            <ProgressChip completed={completedCount} total={totalCount} />
          </View>
        }
      />
      
      <View style={styles.content}>
        <View style={styles.shareSection}>
          <Text style={styles.shareLabel}>Share this list</Text>
        </View>
        
        <FlatList
          data={list.items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
        
        <Text style={styles.hint}>swipe left on any item to delete it</Text>
        
        <Button
          title="+ Add Item"
          onPress={handleAddItem}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
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
  
  shareSection: {
    marginBottom: Spacing.lg,
  },
  
  shareLabel: {
    ...Typography.textStyles.subtitle,
    color: Colors.text,
  },
  
  listContainer: {
    flexGrow: 1,
    paddingBottom: Spacing.lg,
  },
  
  itemContainer: {
    marginBottom: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: 12,
  },
  
  listItem: {
    marginVertical: 0,
    backgroundColor: 'transparent',
  },
  
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  
  actionButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  
  deleteAction: {
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderRadius: 12,
    marginBottom: Spacing.sm,
  },
  
  deleteText: {
    ...Typography.textStyles.caption,
    color: Colors.text,
    marginTop: Spacing.xs,
    fontWeight: Typography.fontWeight.semibold,
  },
  
  hint: {
    ...Typography.textStyles.caption,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  
  emptyImage: {
    width: 180,
    height: 120,
  },
  
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  headerButton: {
    marginRight: Spacing.md,
  },
});