import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Layout';

interface EmptyStateProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  icon,
  action,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      
      {action && <View style={styles.actionContainer}>{action}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.screenPadding,
  },
  
  iconContainer: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  
  textContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  
  title: {
    ...Typography.textStyles.title,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  
  subtitle: {
    ...Typography.textStyles.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  
  actionContainer: {
    width: '100%',
  },
});