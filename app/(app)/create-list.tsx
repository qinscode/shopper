import { useRouter } from 'expo-router'
import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  Alert,
  Image,
  Keyboard,
  Platform,
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

      <View style={styles.content}>
        {!keyboardVisible && (
          <View style={styles.illustrationContainer}>
            <Image
              source={require('@/assets/images/name_your_list.png')}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>
        )}

        <View
          style={[
            styles.formSection,
            keyboardVisible && styles.formSectionExpanded,
          ]}
        >
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
    </SafeAreaView>
  )
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

  illustrationContainer: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },

  illustration: {
    width: 240,
    height: 160,
  },

  formSection: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
  },

  formSectionExpanded: {
    flex: 2,
    justifyContent: 'flex-start',
    paddingTop: Spacing.xl,
  },

  input: {
    marginBottom: Spacing.lg,
  },

  buttonContainer: {
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.lg,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },

  button: {
    flex: 1,
  },
})
