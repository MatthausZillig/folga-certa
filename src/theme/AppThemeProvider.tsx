import React from 'react';
import { useColorScheme } from 'react-native';
import { TamaguiProvider, Theme } from 'tamagui';

import { tamaguiConfig } from './tamagui.config';

type AppThemeProviderProps = {
  children: React.ReactNode;
};

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({ children }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={theme}>
      <Theme name={theme}>{children}</Theme>
    </TamaguiProvider>
  );
};

export default AppThemeProvider;

