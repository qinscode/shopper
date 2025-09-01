import { useRouter } from 'expo-router'
import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
  View,
  StyleSheet,
  Alert,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Animated,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Header, Input, Button } from '@/components/ui'
import { type ThemeColors } from '@/constants/Colors'
import { Spacing } from '@/constants/Layout'
import { useApp } from '@/context/AppContext'
import { useThemeColors } from '@/hooks/useThemeColors'

export default function CreateListScreen() {
  const [listName, setListName] = useState('')
  const [, setKeyboardVisible] = useState(false)
  const router = useRouter()
  const { dispatch } = useApp()
  const colors = useThemeColors()
  const styles = useMemo(() => createStyles(colors), [colors])

  // Animation values
  const illustrationScale = useRef(new Animated.Value(1)).current
  const containerPadding = useRef(new Animated.Value(Spacing.xl * 2)).current
  const illustrationOpacity = useRef(new Animated.Value(1)).current

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true)
        // Animate to compact state
        Animated.parallel([
          Animated.timing(illustrationScale, {
            toValue: 0.75, // Scale down to 75%
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(containerPadding, {
            toValue: Spacing.lg,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(illustrationOpacity, {
            toValue: 0.8,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start()
      }
    )

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false)
        // Animate back to normal state
        Animated.parallel([
          Animated.timing(illustrationScale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(containerPadding, {
            toValue: Spacing.xl * 2,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(illustrationOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start()
      }
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
            <Animated.View
              style={[
                styles.illustrationContainer,
                {
                  paddingTop: containerPadding,
                  paddingBottom: containerPadding.interpolate({
                    inputRange: [Spacing.lg, Spacing.xl * 2],
                    outputRange: [Spacing.md, Spacing.xl],
                  }),
                },
              ]}
            >
              <Animated.Image
                source={require('@/assets/images/name_your_list.png')}
                style={[
                  styles.illustration,
                  {
                    transform: [{ scale: illustrationScale }],
                    opacity: illustrationOpacity,
                  },
                ]}
                resizeMode="contain"
              />
            </Animated.View>

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

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
    },

    illustration: {
      width: 240,
      height: 160,
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
