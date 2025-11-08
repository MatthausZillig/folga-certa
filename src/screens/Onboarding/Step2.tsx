import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TouchableOpacity } from 'react-native';
import MaskInput from 'react-native-mask-input';
import { Button, Text, View, XStack, YStack } from 'tamagui';

import type { OnboardingStackParamList } from '../../navigation/types';
import { useProfileStore } from '../../store';
import type { ContractType } from '../../types';
import { dateMask, step2Schema, type Step2Data } from '../../utils';

type Step2NavigationProp = StackNavigationProp<OnboardingStackParamList, 'Step2'>;

const contractOptions: { value: ContractType; label: string }[] = [
  { value: 'indeterminado', label: 'Indeterminado (CLT)' },
  { value: 'experiencia', label: 'Experiência' },
  { value: 'aprendiz', label: 'Aprendiz' },
  { value: 'outro', label: 'Outro' },
];

export const Step2Screen: React.FC = () => {
  const navigation = useNavigation<Step2NavigationProp>();
  const { profile, setProfile } = useProfileStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      admissionDate: profile?.admissionDate || '',
      contractType: profile?.contractType || 'indeterminado',
    },
    mode: 'onBlur',
  });

  const onSubmit = (data: Step2Data) => {
    setProfile({ admissionDate: data.admissionDate, contractType: data.contractType });
    navigation.navigate('Step3');
  };

  return (
    <View flex={1} backgroundColor="$background">
      <YStack flex={1} justifyContent="center" padding="$6" gap="$5">
        <Text fontSize="$8" fontWeight="700" color="$text">
          Quando você foi admitido?
        </Text>
        <Text fontSize="$4" color="$muted">
          Informe a data de início do seu vínculo trabalhista
        </Text>
        <YStack gap="$2">
          <Text fontSize="$3" color="$text" fontWeight="600">
            Data de admissão
          </Text>
          <Controller
            control={control}
            name="admissionDate"
            render={({ field: { onChange, onBlur, value } }) => (
              <MaskInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                mask={dateMask}
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: errors.admissionDate ? '#dc2626' : '#DEE2E6',
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
          {errors.admissionDate && (
            <Text fontSize="$3" color="#dc2626">
              {errors.admissionDate.message}
            </Text>
          )}
        </YStack>
        <YStack gap="$3">
          <Text fontSize="$3" color="$text" fontWeight="600">
            Tipo de contrato
          </Text>
          <Controller
            control={control}
            name="contractType"
            render={({ field: { onChange, value } }) => (
              <YStack gap="$2">
                {contractOptions.map((item) => (
                  <TouchableOpacity key={item.value} onPress={() => onChange(item.value)}>
                    <XStack
                      backgroundColor={value === item.value ? '$accent' : '$card'}
                      padding="$3"
                      borderRadius="$4"
                      borderWidth={1}
                      borderColor={value === item.value ? '$accent' : '$border'}
                      alignItems="center"
                    >
                      <Text
                        fontSize="$4"
                        color={value === item.value ? '$textDark' : '$text'}
                      >
                        {item.label}
                      </Text>
                    </XStack>
                  </TouchableOpacity>
                ))}
              </YStack>
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
    </View>
  );
};

export default Step2Screen;

