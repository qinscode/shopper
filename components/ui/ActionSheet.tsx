import { Ionicons } from '@expo/vector-icons'
import React from 'react'
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
import { PanGestureHandler, State } from 'react-native-gesture-handler'

import { Spacing, BorderRadius } from '@/constants/Layout'
import { Typography } from '@/constants/Typography'
import { useThemeColors } from '@/hooks/useThemeColors'

interface ActionSheetOption {
  text: string
  onPress?: () => void
  style?: 'default' | 'destructive' | 'cancel'
  icon?: keyof typeof Ionicons.glyphMap
}

interface ActionSheetProps {
  visible: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  options: ActionSheetOption[]
}

const { height: screenHeight } = Dimensions.get('window')

export default function ActionSheet({
  visible,
  onClose,
  title,
  subtitle,
  options,
}: ActionSheetProps) {
  const colors = useThemeColors()
  const styles = createStyles(colors)

  const slideAnim = React.useRef(new Animated.Value(screenHeight)).current
  const translateY = React.useRef(new Animated.Value(0)).current
  const opacity = React.useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    if (visible) {
      slideAnim.setValue(screenHeight)
      opacity.setValue(0)
      translateY.setValue(0)

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 10,
          friction: 5,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [visible, slideAnim, opacity])

  const handleBackdropPress = () => {
    onClose()
  }

  const handleOptionPress = (option: ActionSheetOption) => {
    onClose()
    // Small delay to let the modal close animation complete
    setTimeout(() => {
      option.onPress?.()
    }, 200)
  }

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  )

  const handleGestureStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationY, velocityY } = event.nativeEvent

      // If dragged down more than 100px or with enough velocity, close the modal
      if (translationY > 100 || velocityY > 500) {
        onClose()
      } else {
        // Snap back to original position
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start()
      }
    }
  }

  const renderOption = (option: ActionSheetOption, index: number) => {
    const isLast = index === options.length - 1
    const isCancel = option.style === 'cancel'
    const isDestructive = option.style === 'destructive'

    return (
      <View key={index}>
        {isCancel && index > 0 && <View style={styles.separator} />}
        <TouchableOpacity
          style={[
            styles.option,
            isCancel && styles.cancelOption,
            isLast && styles.lastOption,
          ]}
          onPress={() => handleOptionPress(option)}
          activeOpacity={0.7}
        >
          <View style={styles.optionContent}>
            {option.icon && (
              <Ionicons
                name={option.icon}
                size={20}
                color={
                  isDestructive
                    ? colors.error
                    : isCancel
                      ? colors.textSecondary
                      : colors.text
                }
                style={styles.optionIcon}
              />
            )}
            <Text
              style={[
                styles.optionText,
                isDestructive && styles.destructiveText,
                isCancel && styles.cancelText,
              ]}
            >
              {option.text}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
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
      <Animated.View style={[styles.backdrop, { opacity }]}>
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <View style={styles.backdropTouchable} />
        </TouchableWithoutFeedback>

        <PanGestureHandler
          onGestureEvent={handleGestureEvent}
          onHandlerStateChange={handleGestureStateChange}
        >
          <Animated.View
            style={[
              styles.container,
              {
                transform: [
                  { translateY: Animated.add(slideAnim, translateY) },
                ],
              },
            ]}
          >
            <View style={styles.handle} />

            {(title || subtitle) && (
              <View style={styles.header}>
                {title && <Text style={styles.title}>{title}</Text>}
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
              </View>
            )}

            <View style={styles.optionsContainer}>
              {options.map(renderOption)}
            </View>

            <View style={styles.safeArea} />
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </Modal>
  )
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
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
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingTop: 12,
      maxHeight: screenHeight * 0.8,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: -4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 20,
    },

    handle: {
      width: 48,
      height: 5,
      backgroundColor: colors.textTertiary,
      borderRadius: 3,
      alignSelf: 'center',
      marginBottom: 20,
      marginTop: 8,
    },

    header: {
      paddingHorizontal: 24,
      paddingBottom: 16,
      alignItems: 'center',
    },

    title: {
      fontSize: 18,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.text,
      marginBottom: 4,
    },

    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },

    optionsContainer: {
      paddingHorizontal: 24,
    },

    option: {
      paddingVertical: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },

    lastOption: {
      borderBottomWidth: 0,
    },

    cancelOption: {
      borderBottomWidth: 0,
      marginTop: 8,
    },

    separator: {
      height: 8,
      backgroundColor: colors.background,
      marginHorizontal: -24,
    },

    optionContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },

    optionIcon: {
      marginRight: 12,
    },

    optionText: {
      fontSize: 17,
      fontWeight: Typography.fontWeight.medium,
      color: colors.text,
      textAlign: 'center',
    },

    destructiveText: {
      color: colors.error,
    },

    cancelText: {
      color: colors.textSecondary,
      fontWeight: Typography.fontWeight.semibold,
    },

    safeArea: {
      height: 34, // Safe area bottom padding
    },
  })
