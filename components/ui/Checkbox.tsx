import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { HapticFeedback } from '@/utils/haptics';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  size?: number;
  style?: ViewStyle;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onToggle,
  size = 24,
  style,
}) => {
  const handleToggle = () => {
    if (checked) {
      HapticFeedback.light();
    } else {
      HapticFeedback.success();
    }
    onToggle();
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        checked ? styles.checked : styles.unchecked,
        style,
      ]}
      onPress={handleToggle}
      activeOpacity={0.7}
    >
      {checked && (
        <Ionicons
          name="checkmark"
          size={size * 0.6}
          color={Colors.text}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  
  unchecked: {
    backgroundColor: 'transparent',
    borderColor: Colors.inactive,
  },
  
  checked: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
});