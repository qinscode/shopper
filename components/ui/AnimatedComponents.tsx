import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { ViewStyle } from 'react-native';

interface FadeInListItemProps {
  children: React.ReactNode;
  delay?: number;
  style?: ViewStyle;
}

export const FadeInListItem: React.FC<FadeInListItemProps> = ({
  children,
  delay = 0,
  style,
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  useEffect(() => {
    const timer = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 400 });
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 150,
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};

interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  style?: ViewStyle;
}

export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  delay = 0,
  style,
}) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 200,
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};