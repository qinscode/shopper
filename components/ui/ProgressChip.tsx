import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Layout';

interface ProgressChipProps {
  completed: number;
  total: number;
  size?: number;
}

export const ProgressChip: React.FC<ProgressChipProps> = ({
  completed,
  total,
  size = Spacing.progressChipSize,
}) => {
  const progress = total > 0 ? completed / total : 0;
  const circumference = 2 * Math.PI * (size / 2 - 3); // Adjust for stroke width
  const strokeDashoffset = circumference - progress * circumference;
  const isComplete = completed === total && total > 0;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 3}
          stroke={Colors.inactive}
          strokeWidth="2"
          fill="none"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 3}
          stroke={isComplete ? Colors.success : Colors.primary}
          strokeWidth="3"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Text style={[styles.text, { fontSize: size * 0.3 }]}>
        {completed}/{total}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  
  svg: {
    position: 'absolute',
  },
  
  text: {
    ...Typography.textStyles.caption,
    color: Colors.text,
    fontWeight: Typography.fontWeight.semibold,
    textAlign: 'center',
  },
});