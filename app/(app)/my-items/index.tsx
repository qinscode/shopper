import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Header, Input, FloatingActionButton, FadeInListItem, EmptyState } from '@/components/ui';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing, BorderRadius, Shadows } from '@/constants/Layout';
import { useApp } from '@/context/AppContext';
import { CustomItem } from '@/types';
import { HapticFeedback } from '@/utils/haptics';

export default function MyItemsScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const router = useRouter();
  const { state, getMostUsedCustomItems, getCustomItemsByCategory } = useApp();

  const filteredCustomItems = React.useMemo(() => {
    let items = selectedCategory 
      ? getCustomItemsByCategory(selectedCategory)
      : state.customItems;

    if (searchText) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.brand?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return items.sort((a, b) => b.usageCount - a.usageCount);
  }, [searchText, selectedCategory, state.customItems, getCustomItemsByCategory]);

  const handleCreateItem = () => {
    HapticFeedback.light();
    router.push('/(app)/my-items/create');
  };

  const handleEditItem = (itemId: string) => {
    HapticFeedback.light();
    router.push(`/(app)/my-items/edit/${itemId}`);
  };

  const handleCategoryPress = (categoryId: string | null) => {
    HapticFeedback.selection();
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const renderCategoryFilter = () => (
    <View style={styles.categoryFilter}>
      <TouchableOpacity
        style={[
          styles.categoryChip,
          selectedCategory === null && styles.activeCategoryChip,
        ]}
        onPress={() => handleCategoryPress(null)}
      >
        <Text
          style={[
            styles.categoryChipText,
            selectedCategory === null && styles.activeCategoryChipText,
          ]}
        >
          All ({state.customItems.length})
        </Text>
      </TouchableOpacity>

      {state.categories.map((category) => {
        const itemCount = getCustomItemsByCategory(category.id).length;
        return (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.activeCategoryChip,
              { borderColor: category.color },
            ]}
            onPress={() => handleCategoryPress(category.id)}
          >
            <View style={styles.categoryChipContent}>
              <Ionicons name={category.icon as any || 'folder-outline'} size={16} color={
                selectedCategory === category.id ? Colors.text : category.color
              } />
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === category.id && styles.activeCategoryChipText,
                  { color: selectedCategory === category.id ? Colors.text : category.color },
                ]}
              >
                {category.name} ({itemCount})
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderCustomItem = ({ item, index }: { item: CustomItem; index: number }) => (
    <FadeInListItem delay={index * 50}>
      <TouchableOpacity
        style={styles.itemCard}
        onPress={() => handleEditItem(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.itemCardHeader}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.name}
            </Text>
            {item.brand && (
              <Text style={styles.itemBrand} numberOfLines={1}>
                {item.brand}
              </Text>
            )}
          </View>
          
          <View style={styles.itemBadges}>
            {item.usageCount > 0 && (
              <View style={styles.usageBadge}>
                <Text style={styles.usageText}>{item.usageCount}x</Text>
              </View>
            )}
          </View>
        </View>

        {item.category && (
          <View style={styles.itemCategory}>
            <View style={[
              styles.categoryDot, 
              { backgroundColor: state.categories.find(c => c.name === item.category)?.color || Colors.primary }
            ]} />
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        )}

        <View style={styles.itemFooter}>
          <View style={styles.itemAttachments}>
            {item.defaultUrl && (
              <Ionicons name="link" size={14} color={Colors.textSecondary} />
            )}
            {item.defaultImageUri && (
              <Ionicons name="image" size={14} color={Colors.textSecondary} />
            )}
            {item.tags && item.tags.length > 0 && (
              <Ionicons name="pricetag" size={14} color={Colors.textSecondary} />
            )}
          </View>
          
          {item.lastUsed && (
            <Text style={styles.lastUsedText}>
              Used {new Date(item.lastUsed).toLocaleDateString()}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </FadeInListItem>
  );

  if (state.customItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="My Items"
          showBackButton
          onBackPress={() => router.back()}
          rightComponent={
            <TouchableOpacity onPress={() => router.push('/(app)/my-items/categories')}>
              <Ionicons name="folder-open-outline" size={24} color={Colors.text} />
            </TouchableOpacity>
          }
        />
        <EmptyState
          title="No custom items yet"
          subtitle="Create your own item templates with default settings, categories, and quick add shortcuts"
          icon={<Ionicons name="library-outline" size={120} color={Colors.primary} />}
          action={
            <View style={styles.emptyActions}>
              <TouchableOpacity
                style={styles.emptyActionButton}
                onPress={() => router.push('/(app)/my-items/categories')}
              >
                <Ionicons name="folder-open-outline" size={20} color={Colors.primary} />
                <Text style={styles.emptyActionText}>Manage Categories</Text>
              </TouchableOpacity>
            </View>
          }
        />
        <View style={styles.fab}>
          <FloatingActionButton
            onPress={handleCreateItem}
            icon="add"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="My Items"
        showBackButton
        onBackPress={() => router.back()}
        rightComponent={
          <TouchableOpacity onPress={() => router.push('/(app)/my-items/categories')}>
            <Ionicons name="folder-open-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
        }
      />
      
      <View style={styles.content}>
        <Input
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search items..."
          leftIcon={<Ionicons name="search" size={20} color={Colors.textSecondary} />}
          rightIcon={
            searchText.length > 0 ? (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            ) : undefined
          }
          style={styles.searchInput}
        />

        {renderCategoryFilter()}

        <FlatList
          data={filteredCustomItems}
          renderItem={renderCustomItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.itemsList}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={styles.fab}>
        <FloatingActionButton
          onPress={handleCreateItem}
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
  
  content: {
    flex: 1,
    padding: Spacing.screenPadding,
  },
  
  searchInput: {
    marginBottom: Spacing.md,
  },
  
  categoryFilter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.lg,
  },
  
  categoryChip: {
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  
  activeCategoryChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  
  categoryChipContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  categoryChipText: {
    ...Typography.textStyles.caption,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
  
  activeCategoryChipText: {
    color: Colors.text,
    fontWeight: Typography.fontWeight.semibold,
  },
  
  itemsList: {
    paddingBottom: 100, // Space for FAB
  },
  
  itemCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  
  itemCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  
  itemInfo: {
    flex: 1,
  },
  
  itemName: {
    ...Typography.textStyles.subtitle,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  
  itemBrand: {
    ...Typography.textStyles.caption,
    color: Colors.textSecondary,
  },
  
  itemBadges: {
    alignItems: 'flex-end',
  },
  
  usageBadge: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  
  usageText: {
    ...Typography.textStyles.caption,
    color: Colors.text,
    fontSize: 10,
    fontWeight: Typography.fontWeight.bold,
  },
  
  itemCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  
  categoryText: {
    ...Typography.textStyles.caption,
    color: Colors.textSecondary,
  },
  
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  itemAttachments: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  
  lastUsedText: {
    ...Typography.textStyles.caption,
    color: Colors.textTertiary,
    fontSize: 10,
  },
  
  fab: {
    position: 'absolute',
    right: Spacing.screenPadding,
    bottom: Spacing.xl,
  },
  
  emptyActions: {
    width: '100%',
    marginTop: Spacing.lg,
  },
  
  emptyActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  
  emptyActionText: {
    ...Typography.textStyles.body,
    color: Colors.primary,
    marginLeft: Spacing.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
});