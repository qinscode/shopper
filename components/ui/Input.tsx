import React, { forwardRef } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';

import { Colors } from '@/constants/Colors';
import { Spacing, BorderRadius } from '@/constants/Layout';
import { Typography } from '@/constants/Typography';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    { label, error, containerStyle, leftIcon, rightIcon, style, ...props },
    ref
  ) => {
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
            placeholderTextColor={Colors.textTertiary}
            {...props}
          />
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  label: {
    ...Typography.textStyles.body,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },

  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    height: Spacing.inputHeight,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    color: Colors.text,
    ...Typography.textStyles.body,
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  inputWithLeftIcon: {
    paddingLeft: Spacing.xxl,
  },

  inputWithRightIcon: {
    paddingRight: Spacing.xxl,
  },

  inputError: {
    borderColor: Colors.error,
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
    color: Colors.error,
    marginTop: Spacing.xs,
  },
});
