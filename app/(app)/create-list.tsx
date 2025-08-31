import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header, Input, Button } from '@/components/ui';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Layout';
import { useApp } from '@/context/AppContext';

export default function CreateListScreen() {
  const [listName, setListName] = useState('');
  const router = useRouter();
  const { dispatch, state } = useApp();

  const handleCancel = () => {
    router.back();
  };

  const handleContinue = () => {
    if (listName.trim().length === 0) {
      Alert.alert('Error', 'Please enter a list name');
      return;
    }

    // Generate ID before dispatch to track the new list
    const newId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    dispatch({
      type: 'CREATE_LIST',
      payload: { name: listName.trim() },
    });

    // Navigate to the new list detail page
    // Since we can't get the exact ID easily, we'll go back to lists first
    router.replace('/(app)/lists');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Name your list"
        showBackButton
        onBackPress={handleCancel}
      />
      
      <View style={styles.content}>
        <Input
          value={listName}
          onChangeText={setListName}
          placeholder="Weekly Household Shopping"
          autoFocus
          returnKeyType="done"
          onSubmitEditing={handleContinue}
        />
        
        <View style={styles.buttonContainer}>
          <View style={styles.buttonRow}>
            <Button
              title="Cancel"
              onPress={handleCancel}
              variant="secondary"
              style={styles.button}
            />
            <Button
              title="Continue"
              onPress={handleContinue}
              style={styles.button}
            />
          </View>
        </View>
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
    justifyContent: 'space-between',
  },
  
  buttonContainer: {
    paddingBottom: Spacing.xl,
  },
  
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  
  button: {
    flex: 1,
  },
});