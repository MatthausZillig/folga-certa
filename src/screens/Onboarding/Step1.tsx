import React from 'react';
import { Button, Input, Text, View, YStack } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useProfile, useSetProfile } from '../../store/useProfileStore';
import type { OnboardingStackParamList } from '../../navigation/types';
import { step1Schema, type Step1Data } from '../../utils/validations';

type Step1NavigationProp = StackNavigationProp<OnboardingStackParamList, 'Step1'>;

export const Step1Screen: React.FC = () => {
  const navigation = useNavigation<Step1NavigationProp>();
  const profile = useProfile();
  const setProfile = useSetProfile();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      displayName: profile?.displayName || '',
    },
    mode: 'onBlur',
  });

  const onSubmit = (data: Step1Data) => {
    setProfile({ displayName: data.displayName });
    navigation.navigate('Step2');
  };

  return (
    <View flex={1} backgroundColor="$background">
      <YStack flex={1} justifyContent="center" padding="$6" gap="$4">
        <Text fontSize="$8" fontWeight="700" color="$text">
          Qual é o seu nome?
        </Text>
        <Text fontSize="$4" color="$muted">
          Vamos começar pelo básico. Como podemos te chamar?
        </Text>
        <YStack gap="$2">
          <Controller
            control={control}
            name="displayName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Seu nome"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                backgroundColor="$card"
                borderColor={errors.displayName ? '#dc2626' : '$border'}
                borderWidth={2}
                color="$text"
                fontSize="$5"
                height={56}
                paddingHorizontal="$4"
                placeholderTextColor="$muted"
              />
            )}
          />
          {errors.displayName && (
            <Text fontSize="$3" color="#dc2626">
              {errors.displayName.message}
            </Text>
          )}
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

export default Step1Screen;

