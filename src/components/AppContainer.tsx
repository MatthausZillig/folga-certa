import React from 'react';
import { View } from 'react-native';

type AppContainerProps = {
  children?: React.ReactNode;
};

export const AppContainer: React.FC<AppContainerProps> = ({ children }) => <View>{children}</View>;

export default AppContainer;

