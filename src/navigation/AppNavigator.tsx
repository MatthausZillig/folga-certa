import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { HomeScreen } from '../screens/Home';
import { SimulationScreen } from '../screens/Simulation';
import { ProfileScreen } from '../screens/Profile';
import type { AppTabsParamList } from './types';

const Tab = createBottomTabNavigator<AppTabsParamList>();

export const AppNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#343A40',
      tabBarInactiveTintColor: '#6C757D',
      tabBarStyle: {
        backgroundColor: '#FFFFFF',
        borderTopColor: '#DEE2E6',
      },
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarLabel: 'Início',
      }}
    />
    <Tab.Screen
      name="Simulation"
      component={SimulationScreen}
      options={{
        tabBarLabel: 'Simular',
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarLabel: 'Perfil',
      }}
    />
  </Tab.Navigator>
);

