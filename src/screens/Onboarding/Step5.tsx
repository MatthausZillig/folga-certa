import React, { useState } from 'react';
import { Button, Input, Text, View, XStack, YStack } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScrollView } from 'react-native';

import { useProfileStore } from '../../store';
import type { OnboardingStackParamList } from '../../navigation/types';
import type { Deduction } from '../../types';

type Step5NavigationProp = StackNavigationProp<OnboardingStackParamList, 'Step5'>;

export const Step5Screen: React.FC = () => {
  const navigation = useNavigation<Step5NavigationProp>();
  const { profile, setProfile } = useProfileStore();
  const [deductions, setDeductions] = useState<Deduction[]>(profile?.deductions || []);
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');

  const handleAdd = () => {
    if (label.trim() && parseFloat(amount) > 0) {
      setDeductions([...deductions, { label: label.trim(), amount: parseFloat(amount) }]);
      setLabel('');
      setAmount('');
    }
  };

  const handleRemove = (index: number) => {
    setDeductions(deductions.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    setProfile({ deductions });
    navigation.navigate('Step6');
  };

  return (
    <View flex={1} backgroundColor="$background" padding="$6">
      <YStack flex={1} gap="$4">
        <YStack gap="$2">
          <Text fontSize="$8" fontWeight="700" color="$text">
            Descontos fixos
          </Text>
          <Text fontSize="$4" color="$muted">
            Plano de saúde, vale transporte, etc. (opcional)
          </Text>
        </YStack>
        <ScrollView style={{ flex: 1 }}>
          <YStack gap="$3" paddingBottom="$4">
            {deductions.map((item, index) => (
              <XStack
                key={index}
                backgroundColor="$card"
                padding="$3"
                borderRadius="$4"
                borderWidth={1}
                borderColor="$border"
                alignItems="center"
                justifyContent="space-between"
              >
                <YStack flex={1}>
                  <Text fontSize="$4" color="$text" fontWeight="600">
                    {item.label}
                  </Text>
                  <Text fontSize="$3" color="$muted">
                    R$ {item.amount.toFixed(2)}
                  </Text>
                </YStack>
                <Button
                  size="$3"
                  backgroundColor="transparent"
                  color="$muted"
                  onPress={() => handleRemove(index)}
                >
                  ×
                </Button>
              </XStack>
            ))}
            <YStack gap="$2" marginTop="$3">
              <Input
                placeholder="Nome do desconto"
                value={label}
                onChangeText={setLabel}
                backgroundColor="$card"
                borderColor="$border"
                color="$text"
                fontSize="$4"
                height={48}
                paddingHorizontal="$3"
              />
              <XStack gap="$2">
                <Input
                  flex={1}
                  placeholder="Valor (R$)"
                  value={amount}
                  onChangeText={setAmount}
                  backgroundColor="$card"
                  borderColor="$border"
                  color="$text"
                  fontSize="$4"
                  height={48}
                  paddingHorizontal="$3"
                  keyboardType="numeric"
                />
                <Button
                  size="$4"
                  backgroundColor="$accent"
                  color="$textDark"
                  onPress={handleAdd}
                  disabled={!label.trim() || !(parseFloat(amount) > 0)}
                >
                  +
                </Button>
              </XStack>
            </YStack>
          </YStack>
        </ScrollView>
      </YStack>
      <Button
        backgroundColor="$accent"
        color="$textDark"
        onPress={handleNext}
        height={56}
        fontSize="$5"
        fontWeight="600"
        marginHorizontal="$6"
        marginBottom="$6"
      >
        Continuar
      </Button>
    </View>
  );
};

export default Step5Screen;

