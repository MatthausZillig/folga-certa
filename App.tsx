import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { RootNavigator } from './src/navigation';
import { AppThemeProvider } from './src/theme';

SplashScreen.preventAutoHideAsync();

const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        // Ignore
      } finally {
        setIsReady(true);
        SplashScreen.hideAsync();
      }
    };

    prepare();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' }}>
        <ActivityIndicator size="large" color="#343A40" />
      </View>
    );
  }

  return (
    <AppThemeProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AppThemeProvider>
  );
};

export default App;
