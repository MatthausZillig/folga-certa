import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Step1Screen, Step2Screen, Step3Screen, Step4Screen, Step5Screen, Step6Screen } from '../screens/Onboarding';
import type { OnboardingStackParamList } from './types';

const Stack = createStackNavigator<OnboardingStackParamList>();

type OnboardingNavigatorProps = {
  onComplete: () => void;
};

export const OnboardingNavigator: React.FC<OnboardingNavigatorProps> = ({ onComplete }) => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Step1" component={Step1Screen} />
    <Stack.Screen name="Step2" component={Step2Screen} />
    <Stack.Screen name="Step3" component={Step3Screen} />
    <Stack.Screen name="Step4" component={Step4Screen} />
    <Stack.Screen name="Step5" component={Step5Screen} />
    <Stack.Screen name="Step6">
      {() => <Step6Screen onComplete={onComplete} />}
    </Stack.Screen>
  </Stack.Navigator>
);

