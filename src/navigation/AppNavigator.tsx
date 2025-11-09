import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Calculator, User } from '@tamagui/lucide-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeScreen } from '../screens/Home';
import { SimulationScreen } from '../screens/Simulation';
import { ProfileScreen } from '../screens/Profile';
import {
  AnimatedTabBarIcon,
  AnimatedTabBarButton,
  AnimatedTabBarIndicator,
  AnimatedTabBarLabel,
} from '../components';
import type { AppTabsParamList } from './types';

const Tab = createBottomTabNavigator<AppTabsParamList>();

export const AppNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3960FB',
        tabBarInactiveTintColor: '#6C757D',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#DEE2E6',
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarButton: (props) => <AnimatedTabBarButton {...props} />,
          tabBarLabel: ({ focused, color }) => (
            <View style={{ alignItems: 'center' }}>
              <AnimatedTabBarLabel focused={focused} label="Início" color={color} />
              <AnimatedTabBarIndicator focused={focused} />
            </View>
          ),
          tabBarIcon: ({ focused, color, size }) => (
            <AnimatedTabBarIcon focused={focused} color={color} size={size} icon={Home} />
          ),
        }}
      />
      <Tab.Screen
        name="Simulation"
        component={SimulationScreen}
        options={{
          tabBarButton: (props) => <AnimatedTabBarButton {...props} />,
          tabBarLabel: ({ focused, color }) => (
            <View style={{ alignItems: 'center' }}>
              <AnimatedTabBarLabel focused={focused} label="Simular" color={color} />
              <AnimatedTabBarIndicator focused={focused} />
            </View>
          ),
          tabBarIcon: ({ focused, color, size }) => (
            <AnimatedTabBarIcon focused={focused} color={color} size={size} icon={Calculator} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarButton: (props) => <AnimatedTabBarButton {...props} />,
          tabBarLabel: ({ focused, color }) => (
            <View style={{ alignItems: 'center' }}>
              <AnimatedTabBarLabel focused={focused} label="Perfil" color={color} />
              <AnimatedTabBarIndicator focused={focused} />
            </View>
          ),
          tabBarIcon: ({ focused, color, size }) => (
            <AnimatedTabBarIcon focused={focused} color={color} size={size} icon={User} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

