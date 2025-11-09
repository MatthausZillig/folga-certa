import type { VacationSimulation } from '../types';

export type RootStackParamList = {
  Onboarding: undefined;
  App: undefined;
};

export type OnboardingStackParamList = {
  Step1: undefined;
  Step2: undefined;
  Step3: undefined;
  Step4: undefined;
  Step5: undefined;
  Step6: undefined;
};

export type AppTabsParamList = {
  Home: undefined;
  Simulation: { simulation?: VacationSimulation } | undefined;
  Profile: undefined;
};

