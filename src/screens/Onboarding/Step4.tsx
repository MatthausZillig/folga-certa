import React, { useState } from 'react';
import { Button, Input, Switch, Text, View, XStack, YStack, Label } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useProfile, useSetProfile } from '../../store/useProfileStore';
import type { OnboardingStackParamList } from '../../navigation/types';

type Step4NavigationProp = StackNavigationProp<OnboardingStackParamList, 'Step4'>;

export const Step4Screen: React.FC = () => {
  const navigation = useNavigation<Step4NavigationProp>();
  const profile = useProfile();
  const setProfile = useSetProfile();
  const [hasVariable, setHasVariable] = useState(profile?.hasVariablePay || false);
  const [average, setAverage] = useState(profile?.variablePayAverage?.toString() || '');

  const handleNext = () => {
    const avgNum = hasVariable && average ? parseFloat(average) : undefined;
    setProfile({ hasVariablePay: hasVariable, variablePayAverage: avgNum });
    navigation.navigate('Step5');
  };

  const canContinue = !hasVariable || (hasVariable && parseFloat(average) > 0);

  return (
    <View flex={1} backgroundColor="$background">
      <YStack flex={1} justifyContent="center" padding="$6" gap="$5">
        <Text fontSize="$8" fontWeight="700" color="$text">
          Você recebe valores variáveis?
        </Text>
        <Text fontSize="$4" color="$muted">
          Como comissões, horas extras, bonificações, etc.
        </Text>
        <XStack alignItems="center" gap="$3" paddingVertical="$2">
          <Switch
            size="$4"
            checked={hasVariable}
            onCheckedChange={setHasVariable}
            backgroundColor={hasVariable ? '$accent' : '$border'}
          >
            <Switch.Thumb animation="quick" backgroundColor="$card" />
          </Switch>
          <Label fontSize="$4" color="$text">
            {hasVariable ? 'Sim, recebo' : 'Não recebo'}
          </Label>
        </XStack>
        {hasVariable && (
          <YStack gap="$3" animation="quick">
            <Text fontSize="$3" color="$text" fontWeight="600">
              Média mensal (aproximada)
            </Text>
            <Input
              placeholder="R$ 0,00"
              value={average}
              onChangeText={setAverage}
              backgroundColor="$card"
              borderColor="$border"
              color="$text"
              fontSize="$5"
              height={56}
              paddingHorizontal="$4"
              keyboardType="numeric"
            />
          </YStack>
        )}
        <Button
          backgroundColor="$accent"
          color="$textDark"
          onPress={handleNext}
          disabled={!canContinue}
          opacity={!canContinue ? 0.5 : 1}
          marginTop="$4"
          height={56}
          fontSize="$5"
          fontWeight="600"
        >
          Continuar
        </Button>
      </YStack>
    </View>
  );
};

export default Step4Screen;

