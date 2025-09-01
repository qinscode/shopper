import React, { forwardRef } from 'react'
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native'

import { type ThemeColors } from '@/constants/Colors'
import { Spacing, BorderRadius } from '@/constants/Layout'
import { Typography } from '@/constants/Typography'
import { useThemeColors } from '@/hooks/useThemeColors'

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  containerStyle?: ViewStyle
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    { label, error, containerStyle, leftIcon, rightIcon, style, ...props },
    ref
  ) => {
    const colors = useThemeColors()
    const styles = React.useMemo(() => createStyles(colors), [colors])

    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={styles.inputContainer}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <TextInput
            ref={ref}
            style={[
              styles.input,
              leftIcon && styles.inputWithLeftIcon,
              rightIcon && styles.inputWithRightIcon,
              error && styles.inputError,
              style,
            ]}
            placeholderTextColor={colors.textTertiary}
            {...props}
          />
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    )
  }
)

Input.displayName = 'Input'

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      width: '100%',
    },

    label: {
      ...Typography.textStyles.body,
      color: colors.text,
      marginBottom: Spacing.xs,
    },

    inputContainer: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
    },

    input: {
      height: Spacing.inputHeight,
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.md,
      paddingHorizontal: Spacing.md,
      color: colors.text,
      ...Typography.textStyles.body,
      flex: 1,
      borderWidth: 1,
      borderColor: colors.border,
    },

    inputWithLeftIcon: {
      paddingLeft: Spacing.xxl,
    },

    inputWithRightIcon: {
      paddingRight: Spacing.xxl,
    },

    inputError: {
      borderColor: colors.error,
    },

    leftIcon: {
      position: 'absolute',
      left: Spacing.md,
      zIndex: 1,
    },

    rightIcon: {
      position: 'absolute',
      right: Spacing.md,
      zIndex: 1,
    },

    error: {
      ...Typography.textStyles.caption,
      color: colors.error,
      marginTop: Spacing.xs,
    },
  })
