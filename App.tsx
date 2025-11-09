import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from './src/navigation';
import { AppThemeProvider } from './src/theme';

SplashScreen.preventAutoHideAsync();

const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const stores = keys.filter(key => key.startsWith('folga-certa-'));
        
        for (const key of stores) {
          try {
            const value = await AsyncStorage.getItem(key);
            if (value) {
              JSON.parse(value);
            }
          } catch (parseError) {
            await AsyncStorage.removeItem(key);
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        await AsyncStorage.clear();
      } finally {
        setIsReady(true);
        SplashScreen.hideAsync();
      }
    };

    prepare();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EBEFFF' }}>
        <ActivityIndicator size="large" color="#3960FB" />
      </View>
    );
  }

  return (
    <AppThemeProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </AppThemeProvider>
  );
};

export default App;
