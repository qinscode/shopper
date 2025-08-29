import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Header, EmptyState, Button, ListItem, ProgressChip, FloatingActionButton, FadeInListItem, Input } from '@/components/ui';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing, BorderRadius, Shadows } from '@/constants/Layout';
import { useApp } from '@/context/AppContext';
import { ShoppingList } from '@/types';
import { HapticFeedback } from '@/utils/haptics';

export default function ListsScreen() {
  const [searchText, setSearchText] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const router = useRouter();
  const { getVisibleLists, dispatch } = useApp();
  const allLists = getVisibleLists();
  
  // Filter lists based on search text
  const filteredLists = searchText.trim() === '' ? allLists : allLists.filter(list =>
    list.name.toLowerCase().includes(searchText.toLowerCase()) ||
    list.items.some(item => item.name.toLowerCase().includes(searchText.toLowerCase()))
  );

  const handleCreateList = () => {
    HapticFeedback.light();
    router.push('/(app)/create-list');
  };

  const handleToggleSearch = () => {
    HapticFeedback.light();
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchText('');
    }
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
                variant="large"
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

  if (allLists.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="Shopper"
          leftComponent={
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => {
                  HapticFeedback.light();
                  router.push('/(app)/archived-lists');
                }}
              >
                <Ionicons name="archive-outline" size={24} color={Colors.text} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => {
                  HapticFeedback.light();
                  router.push('/(app)/trash');
                }}
              >
                <Ionicons name="trash-outline" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
          }
          rightComponent={
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleToggleSearch}
            >
              <Ionicons name={isSearchVisible ? "close" : "search"} size={24} color={Colors.text} />
            </TouchableOpacity>
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
        title="Shopper"
        leftComponent={
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => {
                HapticFeedback.light();
                router.push('/(app)/archived-lists');
              }}
            >
              <Ionicons name="archive-outline" size={24} color={Colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => {
                HapticFeedback.light();
                router.push('/(app)/trash');
              }}
            >
              <Ionicons name="trash-outline" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
        }
        rightComponent={
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleToggleSearch}
          >
            <Ionicons name={isSearchVisible ? "close" : "search"} size={24} color={Colors.text} />
          </TouchableOpacity>
        }
      />
      
      {isSearchVisible && (
        <View style={styles.searchContainer}>
          <Input
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search lists or items..."
            autoFocus
            leftIcon={<Ionicons name="search" size={20} color={Colors.textSecondary} />}
            rightIcon={
              searchText.length > 0 ? (
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              ) : undefined
            }
          />
        </View>
      )}
      
      {filteredLists.length === 0 && searchText.trim() !== '' ? (
        <View style={styles.emptyContainer}>
          <EmptyState
            title="No results found"
            subtitle={`No lists or items match "${searchText}"`}
            icon={<Ionicons name="search-outline" size={48} color={Colors.textTertiary} />}
            action={
              <Button
                title="Clear Search"
                onPress={() => setSearchText('')}
                fullWidth
              />
            }
          />
        </View>
      ) : (
        <FlatList
          data={filteredLists}
          renderItem={renderListItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
      
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
  
  searchContainer: {
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
  },
  
  listContainer: {
    padding: 24, // 24pt页面左右安全间距
    paddingBottom: 100, // Space for FAB
  },
  
  listCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20, // 20-22pt卡片圆角
    marginBottom: 16, // 16pt卡片垂直间距
    ...Shadows.medium,
  },
  
  listCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20, // 减少内边距，从24pt到20pt
    paddingBottom: 12, // 减少底部间距
  },
  
  listCardLeft: {
    flex: 1,
  },
  
  listCardRight: {
    marginLeft: 16,
  },
  
  listTitle: {
    ...Typography.textStyles.subtitle,
    color: Colors.text,
    marginBottom: 8,
    fontWeight: Typography.fontWeight.semibold,
  },
  
  listPreview: {
    fontSize: 15, // 15-16pt预览文案字号
    color: '#B5B5B5', // Figma指定的预览文案颜色
    lineHeight: 20,
  },
  
  listActions: {
    flexDirection: 'row', // 横排
    paddingHorizontal: 24,
    paddingTop: 8, // 减少顶部间距
    paddingBottom: 16,
  },
  
  actionButton: {
    flexDirection: 'row', // 图标+文字横排
    alignItems: 'center',
    marginRight: 24,
  },
  
  actionText: {
    fontSize: 12, // 12-13pt文字大小
    color: Colors.textSecondary,
    marginLeft: 8,
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