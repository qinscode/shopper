import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Input, Button } from '@/components/ui';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Layout';
import { useApp } from '@/context/AppContext';

export default function AddUrlScreen() {
  const [url, setUrl] = useState('');
  const router = useRouter();
  const { params } = useLocalSearchParams();
  
  // Extract listId and itemId from params array
  const listId = Array.isArray(params) ? params[0] : '';
  const itemId = Array.isArray(params) ? params[1] : '';
  
  const { getList, dispatch } = useApp();
  const list = getList(listId);
  const item = list?.items.find(item => item.id === itemId);

  const handleCancel = () => {
    router.back();
  };

  const handleSave = () => {
    if (url.trim().length === 0) {
      Alert.alert('Error', 'Please enter a URL');
      return;
    }

    // Basic URL validation
    if (!url.includes('http') && !url.includes('www')) {
      const formattedUrl = url.startsWith('www') ? `https://${url}` : `https://${url}`;
      setUrl(formattedUrl);
    }

    dispatch({
      type: 'UPDATE_ITEM',
      payload: {
        listId,
        itemId,
        updates: { url: url.trim() }
      }
    });

    router.back();
  };

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="Item Not Found"
          showBackButton
          onBackPress={handleCancel}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={`Add Url for ${item.name}`}
        showBackButton
        onBackPress={handleCancel}
      />
      
      <View style={styles.content}>
        <Input
          value={url}
          onChangeText={setUrl}
          placeholder="http://amazon.bread"
          keyboardType="url"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={handleSave}
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
              title="Save"
              onPress={handleSave}
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