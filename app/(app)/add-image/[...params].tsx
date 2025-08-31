import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header, Button } from '@/components/ui';
import { Colors } from '@/constants/Colors';
import { Spacing, BorderRadius, Shadows } from '@/constants/Layout';
import { Typography } from '@/constants/Typography';
import { useApp } from '@/context/AppContext';

export default function AddImageScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please select an image');
      return;
    }

    dispatch({
      type: 'UPDATE_ITEM',
      payload: {
        listId,
        itemId,
        updates: { imageUri: selectedImage },
      },
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
        title={`Add Image for ${item.name}`}
        showBackButton
        onBackPress={handleCancel}
      />
      
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          {selectedImage ? (
            <View style={styles.imagePreview}>
              <Image source={{ uri: selectedImage }} style={styles.image} />
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={handlePickImage}
              >
                <Text style={styles.changeImageText}>Change Image</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={80} color={Colors.textSecondary} />
              <Text style={styles.placeholderText}>No image selected</Text>
              
              <View style={styles.imageButtons}>
                <TouchableOpacity
                  style={styles.imageActionButton}
                  onPress={handlePickImage}
                >
                  <Ionicons name="images-outline" size={24} color={Colors.primary} />
                  <Text style={styles.imageActionText}>Choose from Library</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.imageActionButton}
                  onPress={handleTakePhoto}
                >
                  <Ionicons name="camera-outline" size={24} color={Colors.primary} />
                  <Text style={styles.imageActionText}>Take Photo</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        
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
              disabled={!selectedImage}
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
  
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    width: '100%',
    minHeight: 300,
    ...Shadows.medium,
  },
  
  placeholderText: {
    ...Typography.textStyles.body,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  
  imageButtons: {
    gap: Spacing.md,
  },
  
  imageActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    minWidth: 200,
  },
  
  imageActionText: {
    ...Typography.textStyles.body,
    color: Colors.primary,
    marginLeft: Spacing.sm,
  },
  
  imagePreview: {
    alignItems: 'center',
    width: '100%',
  },
  
  image: {
    width: 300,
    height: 300,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  
  changeImageButton: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  
  changeImageText: {
    ...Typography.textStyles.body,
    color: Colors.primary,
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