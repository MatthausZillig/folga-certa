import React from 'react';
import { Text, View, YStack } from 'tamagui';

export const ProfileScreen: React.FC = () => (
  <View flex={1} backgroundColor="$background" padding="$6">
    <YStack flex={1} justifyContent="center" alignItems="center">
      <Text fontSize="$6" color="$text">
        Perfil
      </Text>
    </YStack>
  </View>
);

export default ProfileScreen;

