import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { EmptyState, Button, Checkbox, ProgressChip } from '@/components/ui';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Layout';
import { useApp } from '@/context/AppContext';
import { ShoppingItem } from '@/types';
import { Stack } from 'expo-router';

export default function ListDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const listId = typeof id === 'string' ? id : id?.[0] || '';
  
  const { getList, dispatch } = useApp();
  const list = getList(listId);

  const completedCount = list ? list.items.filter(item => item.isCompleted).length : 0;
  const totalCount = list ? list.items.length : 0;

  const handleArchiveList = () => {
    Alert.alert(
      'Archive List',
      `Are you sure you want to archive "${list?.name}"?`,
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
      `Are you sure you want to delete "${list?.name}"? You can restore it from the trash later.`,
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

  if (!list) {
    return (
      <>
        <Stack.Screen 
          options={{
            headerShown: false
          }}
        />
        <SafeAreaView style={styles.container}>
          <View style={styles.customHeader}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color={Colors.text} />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle} numberOfLines={1}>
              List Not Found
            </Text>
            
            <View style={styles.headerRight} />
          </View>
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
      </>
    );
  }

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

  const handleSelectEmoji = (itemId: string) => {
    router.push(`/(app)/select-emoji/${listId}/${itemId}`);
  };

  const handleAddUrl = (itemId: string) => {
    router.push(`/(app)/add-url/${listId}/${itemId}`);
  };

  const renderRightActions = (itemId: string, itemName: string) => (
    <View style={styles.rightActionsContainer}>
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
        <Ionicons name="trash-outline" size={20} color={Colors.text} />
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }: { item: ShoppingItem }) => {
    const hasUrl = !!item.url;
    
    return (
      <Swipeable
        renderRightActions={() => renderRightActions(item.id, item.name)}
        rightThreshold={40}
      >
        <TouchableOpacity 
          style={styles.itemContainer}
          onPress={() => handleToggleItem(item.id)}
          activeOpacity={0.7}
        >
          {/* 左侧链接图标 - 点击进入修改链接页面 */}
          <TouchableOpacity 
            style={styles.itemLeftIcons}
            onPress={() => handleAddUrl(item.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons 
              name="link-outline" 
              size={18} 
              color={hasUrl ? Colors.primary : "#585858"} 
            />
          </TouchableOpacity>
          
          {/* 中间emoji和文字 */}
          <View style={styles.itemContent}>
            {/* emoji图标 */}
            {item.emoji ? (
              <TouchableOpacity 
                onPress={() => handleSelectEmoji(item.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={[
                  styles.emojiIcon,
                  item.isCompleted && styles.completedEmoji
                ]}>{item.emoji}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.defaultIconContainer}
                onPress={() => handleSelectEmoji(item.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Image 
                  source={require('@/assets/images/item_icon.png')}
                  style={styles.defaultIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
            
            {/* 文字 */}
            <Text 
              style={[
                styles.itemText,
                item.isCompleted && styles.completedText
              ]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
          </View>
          
          {/* 右侧勾选 */}
          <Checkbox
            checked={item.isCompleted}
            onToggle={() => handleToggleItem(item.id)}
          />
        </TouchableOpacity>
      </Swipeable>
    );
  };

  if (list.items.length === 0) {
    return (
      <>
        <Stack.Screen 
          options={{
            headerShown: false
          }}
        />
        <SafeAreaView style={styles.container}>
          <View style={styles.customHeader}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color={Colors.text} />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle} numberOfLines={1}>
              {list.name}
            </Text>
            
            <View style={styles.headerRight}>
              <ProgressChip
                completed={completedCount}
                total={totalCount}
                size={44}
                variant="small"
              />
              <TouchableOpacity 
                style={styles.menuButton}
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
            </View>
          </View>
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
      </>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false
        }}
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.customHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle} numberOfLines={1}>
            {list.name}
          </Text>
          
          <View style={styles.headerRight}>
            <ProgressChip
              completed={completedCount}
              total={totalCount}
              size={44}
              variant="small"
            />
            <TouchableOpacity 
              style={styles.menuButton}
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
          </View>
        </View>
        
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 24,
    backgroundColor: Colors.background,
  },
  
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -12,
  },
  
  headerTitle: {
    fontSize: 24,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    flex: 1,
    marginLeft: 12,
    marginRight: 16,
  },
  
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  menuButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  
  content: {
    flex: 1,
    padding: 24, // 24pt页面左右安全间距
  },
  
  shareSection: {
    marginBottom: Spacing.lg,
  },
  
  shareLabel: {
    fontSize: 17, // 17pt小节标题
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    opacity: 0.7, // #FFF 70%
  },
  
  listContainer: {
    flexGrow: 1,
    paddingBottom: Spacing.lg,
  },
  
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 20, // 20-22pt卡片圆角
    marginBottom: 16, // 16pt卡片间距
    paddingHorizontal: 16, // 水平16pt
    paddingVertical: 14, // 垂直14pt
  },
  
  itemLeftIcons: {
    width: 36, // 固定宽度
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 12, // 右侧间距
  },
  
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  emojiIcon: {
    fontSize: 18,
    lineHeight: 20,
    marginRight: 12,
  },
  
  completedEmoji: {
    opacity: 0.5, // 完成态降低透明度，与completedText一致
  },
  
  defaultIconContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginRight: 12,
  },
  
  defaultIcon: {
    width: 24,
    height: 24,
  },
  
  itemText: {
    flex: 1,
    fontSize: 17, // 17pt名称字号
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  
  completedText: {
    opacity: 0.5, // 完成态降低透明度
  },
  
  rightActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14, // 与itemContainer完全相同的paddingVertical
    marginBottom: 16, // 与itemContainer完全相同的marginBottom
  },
  
  deleteAction: {
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 46, // 计算出的纯内容高度（不含padding）
    borderRadius: 20,
    marginLeft: 8,
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
});