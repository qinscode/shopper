import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { useApp } from '@/context/AppContext';

export default function SplashScreen() {
  const router = useRouter();
  const { state } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (state.hasCompletedOnboarding) {
        router.replace('/(app)/lists');
      } else {
        router.replace('/(onboarding)/onboarding');
      }
    }, 2000); // Show splash for 2 seconds

    return () => clearTimeout(timer);
  }, [state.hasCompletedOnboarding, router]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopper</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    ...Typography.textStyles.largeTitle,
    color: Colors.text,
    fontWeight: Typography.fontWeight.bold,
  },
});
