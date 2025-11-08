import React from 'react';
import { Button, Text, View, YStack } from 'tamagui';

import { useProfile } from '../../store/useProfileStore';

type Step6Props = {
  onComplete: () => void;
};

export const Step6Screen: React.FC<Step6Props> = ({ onComplete }) => {
  const profile = useProfile();

  return (
    <View flex={1} backgroundColor="$background" padding="$6">
      <YStack flex={1} justifyContent="center" alignItems="center" gap="$6">
        <View
          width={80}
          height={80}
          borderRadius={40}
          backgroundColor="$accent"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize={48} color="white">
            ✓
          </Text>
        </View>
        <YStack gap="$3" alignItems="center">
          <Text fontSize="$9" fontWeight="700" color="$text" textAlign="center">
            Tudo pronto, {profile?.displayName}!
          </Text>
          <Text fontSize="$4" color="$muted" textAlign="center" maxWidth={300}>
            Seu perfil foi configurado. Agora você pode simular suas férias e entender melhor seus
            valores.
          </Text>
        </YStack>
      </YStack>
      <Button
        backgroundColor="$accent"
        color="$textDark"
        onPress={onComplete}
        height={56}
        fontSize="$5"
        fontWeight="600"
        marginHorizontal="$6"
        marginBottom="$6"
      >
        Ir para o app
      </Button>
    </View>
  );
};

export default Step6Screen;

