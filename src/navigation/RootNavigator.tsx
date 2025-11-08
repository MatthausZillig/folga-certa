import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useProfile } from '../store/useProfileStore';
import { OnboardingNavigator } from './OnboardingNavigator';
import { AppNavigator } from './AppNavigator';

export const RootNavigator: React.FC = () => {
  const profile = useProfile();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const isProfileComplete = !!(
      profile?.displayName &&
      profile?.admissionDate &&
      profile?.contractType &&
      profile?.baseSalary &&
      profile?.paymentFrequency
    );
    setShowOnboarding(!isProfileComplete);
  }, [profile, isLoading]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EBEFFF' }}>
        <ActivityIndicator size="large" color="#3960FB" />
      </View>
    );
  }

  if (showOnboarding) {
    return <OnboardingNavigator onComplete={handleOnboardingComplete} />;
  }

  return <AppNavigator />;
};
