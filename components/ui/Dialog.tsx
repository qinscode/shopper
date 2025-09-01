import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useRef } from 'react'
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native'

import { Spacing, BorderRadius, Shadows } from '@/constants/Layout'
import { Typography } from '@/constants/Typography'
import { useThemeColors } from '@/hooks/useThemeColors'

interface DialogButton {
  text: string
  onPress?: () => void
  style?: 'default' | 'primary' | 'destructive'
}

interface DialogProps {
  visible: boolean
  onClose: () => void
  title?: string
  message?: string
  buttons?: DialogButton[]
  showCloseButton?: boolean
}

const { width: screenWidth } = Dimensions.get('window')

export default function Dialog({
  visible,
  onClose,
  title,
  message,
  buttons = [{ text: 'OK', style: 'primary' }],
  showCloseButton = false,
}: DialogProps) {
  const colors = useThemeColors()
  const styles = createStyles(colors)

  const scaleAnim = useRef(new Animated.Value(0)).current
  const opacityAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0)
      opacityAnim.setValue(0)

      // Animate in
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      // Animate out
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [visible, scaleAnim, opacityAnim])

  const handleBackdropPress = () => {
    onClose()
  }

  const handleButtonPress = (button: DialogButton) => {
    onClose()
    // Small delay to let the modal close animation complete
    setTimeout(() => {
      button.onPress?.()
    }, 150)
  }

  const renderButton = (button: DialogButton, index: number) => {
    const isLast = index === buttons.length - 1
    const isPrimary = button.style === 'primary'
    const isDestructive = button.style === 'destructive'

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.button,
          isPrimary && styles.primaryButton,
          isDestructive && styles.destructiveButton,
          !isLast && styles.buttonMargin,
        ]}
        onPress={() => handleButtonPress(button)}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.buttonText,
            isPrimary && styles.primaryButtonText,
            isDestructive && styles.destructiveButtonText,
          ]}
        >
          {button.text}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]}>
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <View style={styles.backdropTouchable} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          {showCloseButton && (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}

          {title && (
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
            </View>
          )}

          {message && (
            <View style={styles.content}>
              <Text style={styles.message}>{message}</Text>
            </View>
          )}

          <View style={styles.footer}>{buttons.map(renderButton)}</View>
        </Animated.View>
      </Animated.View>
    </Modal>
  )
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: Spacing.xl,
    },

    backdropTouchable: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },

    container: {
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.xl,
      minWidth: screenWidth * 0.75,
      maxWidth: screenWidth * 0.9,
      paddingTop: Spacing.xl,
      paddingBottom: Spacing.lg,
      paddingHorizontal: Spacing.xl,
      ...Shadows.large,
      shadowColor: colors.shadow,
      elevation: 20,
    },

    closeButton: {
      position: 'absolute',
      top: Spacing.md,
      right: Spacing.md,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.surfaceElevated,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
    },

    header: {
      alignItems: 'center',
      marginBottom: Spacing.md,
    },

    title: {
      fontSize: 20,
      fontWeight: Typography.fontWeight.bold,
      color: colors.text,
      textAlign: 'center',
      lineHeight: 28,
    },

    content: {
      marginBottom: Spacing.xl,
    },

    message: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },

    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },

    button: {
      flex: 1,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      borderRadius: BorderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.border,
    },

    primaryButton: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },

    destructiveButton: {
      backgroundColor: colors.error,
      borderColor: colors.error,
    },

    buttonMargin: {
      marginRight: Spacing.md,
    },

    buttonText: {
      fontSize: 16,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.text,
    },

    primaryButtonText: {
      color: '#FFFFFF',
    },

    destructiveButtonText: {
      color: '#FFFFFF',
    },
  })
