import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="onboarding" />
    </Stack>
  );
}