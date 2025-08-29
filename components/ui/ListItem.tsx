import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing, BorderRadius, Shadows } from '@/constants/Layout';

interface ListItemProps {
  title: string;
  subtitle?: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  showChevron?: boolean;
  isCompleted?: boolean;
  hasUrl?: boolean;
  hasImage?: boolean;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leftComponent,
  rightComponent,
  onPress,
  style,
  showChevron = false,
  isCompleted = false,
  hasUrl = false,
  hasImage = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {leftComponent && (
          <View style={styles.leftSection}>
            {leftComponent}
          </View>
        )}
        
        <View style={styles.middleSection}>
          <View style={styles.attachmentsRow}>
            {hasUrl && (
              <Ionicons name="link" size={16} color={Colors.textSecondary} style={styles.attachment} />
            )}
            {hasImage && (
              <Ionicons name="image" size={16} color={Colors.textSecondary} style={styles.attachment} />
            )}
          </View>
          <Text style={[styles.title, isCompleted && styles.completedTitle]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
        
        <View style={styles.rightSection}>
          {rightComponent}
          {showChevron && (
            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    marginVertical: Spacing.xs,
    ...Shadows.small,
  },
  
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    minHeight: Spacing.listItemHeight,
  },
  
  leftSection: {
    marginRight: Spacing.md,
  },
  
  middleSection: {
    flex: 1,
  },
  
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Spacing.md,
  },
  
  attachmentsRow: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
  },
  
  attachment: {
    marginRight: Spacing.xs,
  },
  
  title: {
    ...Typography.textStyles.body,
    color: Colors.text,
  },
  
  completedTitle: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  
  subtitle: {
    ...Typography.textStyles.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
});