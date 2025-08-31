import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header, EmptyState, Button, ArchiveListCard } from '@/components/ui';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Layout';
import { useApp } from '@/context/AppContext';
import { ShoppingList } from '@/types';
import { getListPreview, getCompletedCount } from '@/utils/listHelpers';

export default function ArchivedListsScreen() {
  const router = useRouter();
  const { getArchivedLists, dispatch } = useApp();
  const archivedLists = getArchivedLists();

  const handleRestoreList = (listId: string) => {
    dispatch({ type: 'RESTORE_LIST', payload: { id: listId } });
  };

  const handleDeletePermanently = (listId: string) => {
    dispatch({ type: 'PERMANENTLY_DELETE_LIST', payload: { id: listId } });
  };

  const renderListItem = ({
    item,
    index,
  }: {
    item: ShoppingList;
    index: number;
  }) => (
    <ArchiveListCard
      item={item}
      index={index}
      type="archived"
      onRestore={handleRestoreList}
      onPermanentDelete={handleDeletePermanently}
      getListPreview={getListPreview}
      getCompletedCount={getCompletedCount}
    />
  );

  if (archivedLists.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="Archived Lists"
          showBackButton
          onBackPress={() => router.back()}
        />
        <View style={styles.emptyContainer}>
          <EmptyState
            title="No archived lists"
            subtitle="Lists you archive will appear here"
            icon={
              <Ionicons
                name="archive-outline"
                size={48}
                color={Colors.textTertiary}
              />
            }
            action={
              <Button title="Go Back" onPress={() => router.back()} fullWidth />
            }
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Archived Lists"
        showBackButton
        onBackPress={() => router.back()}
      />

      <FlatList
        data={archivedLists}
        renderItem={renderListItem}
        keyExtractor={item => item.id}
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

  listContainer: {
    padding: Spacing.screenPadding,
  },
});
