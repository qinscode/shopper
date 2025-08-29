import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Layout';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  leftComponent,
  rightComponent,
  style,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {showBackButton && onBackPress && (
            <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color={Colors.text} />
            </TouchableOpacity>
          )}
          {!showBackButton && leftComponent}
        </View>
        
        <View style={styles.centerSection}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
        
        <View style={styles.rightSection}>
          {rightComponent}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
  },
  
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: Spacing.md,
  },
  
  leftSection: {
    minWidth: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  
  rightSection: {
    minWidth: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -Spacing.sm, // Adjust for visual balance
  },
  
  title: {
    ...Typography.textStyles.title,
    color: Colors.text,
    textAlign: 'center',
  },
});