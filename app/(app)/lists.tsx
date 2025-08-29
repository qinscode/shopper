import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Header, EmptyState, Button, ListItem, ProgressChip, FloatingActionButton, FadeInListItem } from '@/components/ui';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing, BorderRadius, Shadows } from '@/constants/Layout';
import { useApp } from '@/context/AppContext';
import { ShoppingList } from '@/types';
import { HapticFeedback } from '@/utils/haptics';

export default function ListsScreen() {
  const router = useRouter();
  const { getVisibleLists, dispatch } = useApp();
  const lists = getVisibleLists();

  const handleCreateList = () => {
    HapticFeedback.light();
    router.push('/(app)/create-list');
  };

  const handleOpenList = (listId: string) => {
    HapticFeedback.light();
    router.push(`/(app)/list/${listId}`);
  };

  const handleDuplicateList = (listId: string) => {
    HapticFeedback.medium();
    dispatch({ type: 'DUPLICATE_LIST', payload: { id: listId } });
  };

  const handleHideList = (listId: string) => {
    HapticFeedback.light();
    dispatch({ type: 'HIDE_LIST', payload: { id: listId } });
  };

  const getListPreview = (list: ShoppingList): string => {
    const visibleItems = list.items.slice(0, 3);
    const itemNames = visibleItems.map(item => item.name).join(', ');
    const remainingCount = list.items.length - visibleItems.length;
    
    if (remainingCount > 0) {
      return `${itemNames} + ${remainingCount} more`;
    }
    
    return itemNames || 'No items yet';
  };

  const getCompletedCount = (list: ShoppingList): number => {
    return list.items.filter(item => item.isCompleted).length;
  };

  const renderListItem = ({ item, index }: { item: ShoppingList; index: number }) => {
    const completedCount = getCompletedCount(item);
    const totalCount = item.items.length;

    return (
      <FadeInListItem delay={index * 100}>
        <View style={styles.listCard}>
          <TouchableOpacity
            style={styles.listCardContent}
            onPress={() => handleOpenList(item.id)}
            activeOpacity={0.7}
          >
            <View style={styles.listCardLeft}>
              <Text style={styles.listTitle} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.listPreview} numberOfLines={1}>
                {getListPreview(item)}
              </Text>
            </View>
            
            <View style={styles.listCardRight}>
              <ProgressChip
                completed={completedCount}
                total={totalCount}
                size={36}
              />
            </View>
          </TouchableOpacity>
          
          <View style={styles.listActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDuplicateList(item.id)}
            >
              <Ionicons name="copy-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.actionText}>Duplicate</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleHideList(item.id)}
            >
              <Ionicons name="eye-off-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.actionText}>Hide</Text>
            </TouchableOpacity>
          </View>
        </View>
      </FadeInListItem>
    );
  };

  if (lists.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="Your shopping Lists"
          rightComponent={
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => {
                  HapticFeedback.light();
                  router.push('/(app)/my-items');
                }}
              >
                <Ionicons name="library-outline" size={24} color={Colors.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="search" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
          }
        />
        <View style={styles.emptyContainer}>
          <EmptyState
            title="You have not added any shopping lists"
            subtitle="Tap the button below to create one now"
            icon={<Image source={require('@/assets/images/empty.png')} style={styles.emptyImage} resizeMode="contain" />}
            action={
              <Button
                title="+ Create"
                onPress={handleCreateList}
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
        title="Your shopping Lists"
        rightComponent={
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => {
                HapticFeedback.light();
                router.push('/(app)/my-items');
              }}
            >
              <Ionicons name="library-outline" size={24} color={Colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="search" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
        }
      />
      
      <FlatList
        data={lists}
        renderItem={renderListItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      
      <View style={styles.fab}>
        <FloatingActionButton
          onPress={handleCreateList}
          icon="add"
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
  
  emptyContainer: {
    flex: 1,
  },
  
  listContainer: {
    padding: Spacing.screenPadding,
    paddingBottom: 100, // Space for FAB
  },
  
  listCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    ...Shadows.medium,
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
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
  
  fab: {
    position: 'absolute',
    right: Spacing.screenPadding,
    bottom: Spacing.xl,
  },
  
  emptyImage: {
    width: 200,
    height: 150,
  },
  
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  headerButton: {
    marginLeft: Spacing.md,
  },
});