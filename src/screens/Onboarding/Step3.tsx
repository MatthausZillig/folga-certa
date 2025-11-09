import React from 'react';
import { Button, Text, View, YStack, XStack, RadioGroup, Label } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import MaskInput from 'react-native-mask-input';

import { useProfile, useSetProfile } from '../../store/useProfileStore';
import type { OnboardingStackParamList } from '../../navigation/types';
import type { PaymentFrequency, PaymentPeriod } from '../../types';
import { step3Schema, type Step3Data, formatCurrency } from '../../utils';

type Step3NavigationProp = StackNavigationProp<OnboardingStackParamList, 'Step3'>;

const frequencyOptions: { value: PaymentFrequency; label: string }[] = [
  { value: 'mensal', label: 'Mensal' },
  { value: 'quinzenal', label: 'Quinzenal' },
  { value: 'semanal', label: 'Semanal' },
];

const periodOptions: { value: PaymentPeriod; label: string; description: string }[] = [
  { value: 'inicio', label: 'Início do mês', description: 'Dias 1 a 10' },
  { value: 'meio', label: 'Meio do mês', description: 'Dias 11 a 20' },
  { value: 'fim', label: 'Final do mês', description: 'Após dia 20' },
];

export const Step3Screen: React.FC = () => {
  const navigation = useNavigation<Step3NavigationProp>();
  const profile = useProfile();
  const setProfile = useSetProfile();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      baseSalary: profile?.baseSalary ? `R$ ${profile.baseSalary.toFixed(2).replace('.', ',')}` : '',
      paymentFrequency: profile?.paymentFrequency || 'mensal',
      paymentPeriod: profile?.paymentPeriod || 'inicio',
    },
    mode: 'onTouched',
  });

  const onSubmit = (data: Step3Data) => {
    const salaryNum = formatCurrency(data.baseSalary);
    setProfile({ 
      baseSalary: salaryNum, 
      paymentFrequency: data.paymentFrequency,
      paymentPeriod: data.paymentPeriod,
    });
    navigation.navigate('Step4');
  };

  return (
    <View flex={1} backgroundColor="$background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <YStack flex={1} justifyContent="center" padding="$6" gap="$5" minHeight={600}>
            <Text fontSize="$8" fontWeight="700" color="$text">
              Qual é o seu salário?
            </Text>
            <Text fontSize="$4" color="$muted">
              Informe o valor base do seu salário
            </Text>
        <YStack gap="$2">
          <Text fontSize="$3" color="$text" fontWeight="600">
            Salário base
          </Text>
          <Controller
            control={control}
            name="baseSalary"
            render={({ field: { onChange, onBlur, value } }) => (
              <MaskInput
                value={value}
                onChangeText={(masked) => {
                  onChange(masked);
                }}
                onBlur={onBlur}
                placeholder="R$ 0,00"
                keyboardType="numeric"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: errors.baseSalary ? '#dc2626' : '#DEE2E6',
                  borderWidth: 2,
                  borderRadius: 4,
                  color: '#212529',
                  fontSize: 20,
                  height: 56,
                  paddingHorizontal: 16,
                }}
                placeholderTextColor="#6C757D"
              />
            )}
          />
          {errors.baseSalary && (
            <Text fontSize="$3" color="#dc2626">
              {errors.baseSalary.message}
            </Text>
          )}
        </YStack>
        <YStack gap="$4">
          <Text fontSize="$4" color="$text" fontWeight="600">
            Frequência de pagamento
          </Text>
          <Controller
            control={control}
            name="paymentFrequency"
            render={({ field: { onChange, value } }) => (
              <RadioGroup value={value} onValueChange={onChange}>
                <YStack gap="$3">
                  {frequencyOptions.map((item) => (
                    <XStack key={item.value} gap="$3" alignItems="center">
                      <RadioGroup.Item value={item.value} id={item.value} size="$5">
                        <RadioGroup.Indicator />
                      </RadioGroup.Item>
                      <Label htmlFor={item.value} fontSize="$5" color="$text">
                        {item.label}
                      </Label>
                    </XStack>
                  ))}
                </YStack>
              </RadioGroup>
            )}
          />
        </YStack>
        <YStack gap="$4">
          <Text fontSize="$4" color="$text" fontWeight="600">
            Quando você recebe no mês?
          </Text>
          <Controller
            control={control}
            name="paymentPeriod"
            render={({ field: { onChange, value } }) => (
              <RadioGroup value={value} onValueChange={onChange}>
                <YStack gap="$3">
                  {periodOptions.map((item) => (
                    <XStack key={item.value} gap="$3" alignItems="center">
                      <RadioGroup.Item value={item.value} id={item.value} size="$5">
                        <RadioGroup.Indicator />
                      </RadioGroup.Item>
                      <YStack flex={1}>
                        <Label htmlFor={item.value} fontSize="$5" color="$text">
                          {item.label}
                        </Label>
                        <Text fontSize="$3" color="$muted">
                          {item.description}
                        </Text>
                      </YStack>
                    </XStack>
                  ))}
                </YStack>
              </RadioGroup>
            )}
          />
        </YStack>
        <Button
          backgroundColor="$accent"
          color="$textDark"
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid}
          opacity={!isValid ? 0.5 : 1}
          marginTop="$4"
          height={56}
          fontSize="$5"
          fontWeight="600"
            >
              Continuar
            </Button>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Step3Screen;
