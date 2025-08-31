import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

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
  size = 26, // 稍微增大默认尺寸
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
          size={size * 0.5}
          color="#2ECC71" // Figma规格的绿色
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3, // 3pt线宽
  },

  unchecked: {
    backgroundColor: 'transparent',
    borderColor: '#585858', // Figma规格：灰线 #585858
  },

  checked: {
    backgroundColor: 'transparent', // 保持透明，只显示绿色勾选
    borderColor: '#2ECC71', // 绿色边框
  },
});
