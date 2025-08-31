import { useRouter } from 'expo-router'
import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  Alert,
  Image,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Header, Input, Button } from '@/components/ui'
import { Colors } from '@/constants/Colors'
import { Spacing } from '@/constants/Layout'
import { useApp } from '@/context/AppContext'

export default function CreateListScreen() {
  const [listName, setListName] = useState('')
  const [keyboardVisible, setKeyboardVisible] = useState(false)
  const router = useRouter()
  const { dispatch, state } = useApp()

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    )

    return () => {
      keyboardDidShowListener?.remove()
      keyboardDidHideListener?.remove()
    }
  }, [])

  const handleCancel = () => {
    router.back()
  }

  const handleContinue = () => {
    if (listName.trim().length === 0) {
      Alert.alert('Error', 'Please enter a list name')
      return
    }

    // Generate ID before dispatch to track the new list
    const newId =
      Date.now().toString() + Math.random().toString(36).substr(2, 9)

    dispatch({
      type: 'CREATE_LIST',
      payload: { name: listName.trim() },
    })

    // Navigate to the new list detail page
    // Since we can't get the exact ID easily, we'll go back to lists first
    router.replace('/(app)/lists')
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Name your list"
        showBackButton
        onBackPress={handleCancel}
      />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View
              style={[
                styles.illustrationContainer,
                keyboardVisible && styles.illustrationContainerCompact,
              ]}
            >
              <Image
                source={require('@/assets/images/name_your_list.png')}
                style={[
                  styles.illustration,
                  keyboardVisible && styles.illustrationCompact,
                ]}
                resizeMode="contain"
              />
            </View>

            <View style={styles.formSection}>
              <Input
                value={listName}
                onChangeText={setListName}
                placeholder="Weekly Household Shopping"
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleContinue}
                style={styles.input}
              />
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
                  title="Continue"
                  onPress={handleContinue}
                  style={styles.button}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  keyboardAvoidingView: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  content: {
    flex: 1,
    padding: Spacing.screenPadding,
    justifyContent: 'space-between',
    minHeight: '100%',
  },

  illustrationContainer: {
    alignItems: 'center',
    paddingTop: Spacing.xl * 2,
    paddingBottom: Spacing.xl,
  },

  illustrationContainerCompact: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },

  illustration: {
    width: 240,
    height: 160,
  },

  illustrationCompact: {
    width: 180,
    height: 120,
  },

  formSection: {
    paddingVertical: Spacing.lg,
  },

  input: {
    marginBottom: Spacing.lg,
  },

  buttonContainer: {
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.lg,
    marginTop: 'auto',
  },

  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },

  button: {
    flex: 1,
  },
})
