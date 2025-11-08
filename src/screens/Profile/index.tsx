import React, { useState } from 'react';
import { Button, Input, Switch, Text, View, XStack, YStack, Label, ScrollView as TamaguiScrollView } from 'tamagui';
import { ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import MaskInput from 'react-native-mask-input';
import { z } from 'zod';
import { useNavigation } from '@react-navigation/native';

import { useProfile, useSetProfile, useResetProfile } from '../../store/useProfileStore';
import type { ContractType, PaymentFrequency, PaymentPeriod, Deduction } from '../../types';
import { dateMask, formatCurrencyBR } from '../../utils';

const profileSchema = z.object({
  displayName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  admissionDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Data inválida (dd/mm/aaaa)'),
  contractType: z.enum(['indeterminado', 'experiencia', 'aprendiz', 'outro']),
  baseSalary: z
    .string()
    .min(1, 'Informe o salário')
    .refine((val) => {
      if (!val) return false;
      const num = parseFloat(val.replace(/[^\d,]/g, '').replace(',', '.'));
      return !isNaN(num) && num > 0;
    }, 'Salário deve ser maior que zero'),
  paymentFrequency: z.enum(['mensal', 'quinzenal', 'semanal']),
  paymentPeriod: z.enum(['inicio', 'meio', 'fim']),
  hasVariablePay: z.boolean(),
  variablePayAverage: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const contractOptions: { value: ContractType; label: string }[] = [
  { value: 'indeterminado', label: 'Indeterminado (CLT)' },
  { value: 'experiencia', label: 'Experiência' },
  { value: 'aprendiz', label: 'Aprendiz' },
  { value: 'outro', label: 'Outro' },
];

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

const formatNumberToInput = (value: number | undefined): string => {
  if (!value) return '';
  return value.toString().replace('.', ',');
};

const parseInputToNumber = (value: string): number => {
  const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const profile = useProfile();
  const setProfile = useSetProfile();
  const resetProfile = useResetProfile();
  const [deductions, setDeductions] = useState<Deduction[]>(profile?.deductions || []);
  const [isEditing, setIsEditing] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onBlur',
    defaultValues: {
      displayName: profile?.displayName || '',
      admissionDate: profile?.admissionDate || '',
      contractType: profile?.contractType || 'indeterminado',
      baseSalary: formatNumberToInput(profile?.baseSalary),
      paymentFrequency: profile?.paymentFrequency || 'mensal',
      paymentPeriod: profile?.paymentPeriod || 'inicio',
      hasVariablePay: profile?.hasVariablePay || false,
      variablePayAverage: formatNumberToInput(profile?.variablePayAverage),
    },
  });

  const hasVariablePay = watch('hasVariablePay');

  const onSubmit = (data: ProfileFormData) => {
    const baseSalaryNum = parseInputToNumber(data.baseSalary);
    const variablePayAverageNum =
      data.hasVariablePay && data.variablePayAverage
        ? parseInputToNumber(data.variablePayAverage)
        : undefined;

    setProfile({
      displayName: data.displayName,
      admissionDate: data.admissionDate,
      contractType: data.contractType,
      baseSalary: baseSalaryNum,
      paymentFrequency: data.paymentFrequency,
      paymentPeriod: data.paymentPeriod,
      hasVariablePay: data.hasVariablePay,
      variablePayAverage: variablePayAverageNum,
      deductions,
    });

    setIsEditing(false);
    Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
  };

  const handleResetProfile = () => {
    Alert.alert(
      'Redefinir Perfil',
      'Tem certeza que deseja apagar todos os dados? Você precisará refazer o onboarding.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: () => {
            resetProfile();
            setDeductions([]);
          },
        },
      ]
    );
  };

  const handleAddDeduction = () => {
    const newDeduction: Deduction = { label: 'Novo Desconto', amount: 0 };
    setDeductions([...deductions, newDeduction]);
  };

  const handleRemoveDeduction = (index: number) => {
    setDeductions(deductions.filter((_, i) => i !== index));
  };

  const handleUpdateDeduction = (index: number, field: 'label' | 'amount', value: string | number) => {
    const updated = [...deductions];
    if (field === 'label') {
      updated[index].label = value as string;
    } else {
      updated[index].amount = typeof value === 'string' ? parseFloat(value) || 0 : value;
    }
    setDeductions(updated);
  };

  if (!profile) {
    return (
      <View flex={1} backgroundColor="$background" padding="$6" justifyContent="center" alignItems="center">
        <Text fontSize="$6" color="$text">
          Nenhum perfil encontrado
        </Text>
      </View>
    );
  }

  return (
    <View flex={1} backgroundColor="$background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack padding="$6" gap="$5">
          <XStack alignItems="center" gap="$3">
            <TouchableOpacity onPress={() => isEditing ? setIsEditing(false) : navigation.goBack()}>
              <View
                width={40}
                height={40}
                borderRadius="$3"
                backgroundColor="$card"
                borderWidth={1}
                borderColor="$border"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="$6" color="$text">
                  ←
                </Text>
              </View>
            </TouchableOpacity>
            <YStack flex={1}>
              <Text fontSize="$8" fontWeight="700" color="$text">
                {isEditing ? 'Editar Perfil' : 'Meu Perfil'}
              </Text>
            </YStack>
            {!isEditing && (
              <Button
                backgroundColor="$accent"
                color="$textDark"
                height={40}
                fontSize="$3"
                fontWeight="600"
                onPress={() => setIsEditing(true)}
                pressStyle={{ opacity: 0.8 }}
              >
                Editar
              </Button>
            )}
          </XStack>

          {!isEditing ? (
            <YStack gap="$4">
              <YStack
                backgroundColor="$card"
                padding="$5"
                borderRadius="$4"
                borderWidth={1}
                borderColor="$border"
                gap="$3"
              >
                <Text fontSize="$5" fontWeight="600" color="$text">
                  Informações Pessoais
                </Text>
                <YStack gap="$2">
                  <XStack justifyContent="space-between">
                    <Text fontSize="$3" color="$muted">
                      Nome:
                    </Text>
                    <Text fontSize="$3" color="$text" fontWeight="600">
                      {profile.displayName}
                    </Text>
                  </XStack>
                  <XStack justifyContent="space-between">
                    <Text fontSize="$3" color="$muted">
                      Admissão:
                    </Text>
                    <Text fontSize="$3" color="$text" fontWeight="600">
                      {profile.admissionDate}
                    </Text>
                  </XStack>
                  <XStack justifyContent="space-between">
                    <Text fontSize="$3" color="$muted">
                      Contrato:
                    </Text>
                    <Text fontSize="$3" color="$text" fontWeight="600">
                      {contractOptions.find((opt) => opt.value === profile.contractType)?.label}
                    </Text>
                  </XStack>
                </YStack>
              </YStack>

              <YStack
                backgroundColor="$card"
                padding="$5"
                borderRadius="$4"
                borderWidth={1}
                borderColor="$border"
                gap="$3"
              >
                <Text fontSize="$5" fontWeight="600" color="$text">
                  Remuneração
                </Text>
                <YStack gap="$2">
                  <XStack justifyContent="space-between">
                    <Text fontSize="$3" color="$muted">
                      Salário base:
                    </Text>
                    <Text fontSize="$3" color="$text" fontWeight="600">
                      {formatCurrencyBR(profile.baseSalary || 0)}
                    </Text>
                  </XStack>
                  <XStack justifyContent="space-between">
                    <Text fontSize="$3" color="$muted">
                      Frequência:
                    </Text>
                    <Text fontSize="$3" color="$text" fontWeight="600">
                      {frequencyOptions.find((opt) => opt.value === profile.paymentFrequency)?.label}
                    </Text>
                  </XStack>
                  <XStack justifyContent="space-between">
                    <Text fontSize="$3" color="$muted">
                      Período de pagamento:
                    </Text>
                    <Text fontSize="$3" color="$text" fontWeight="600">
                      {periodOptions.find((opt) => opt.value === profile.paymentPeriod)?.label}
                    </Text>
                  </XStack>
                  {profile.hasVariablePay && (
                    <XStack justifyContent="space-between">
                      <Text fontSize="$3" color="$muted">
                        Média variável:
                      </Text>
                      <Text fontSize="$3" color="$text" fontWeight="600">
                        {formatCurrencyBR(profile.variablePayAverage || 0)}
                      </Text>
                    </XStack>
                  )}
                </YStack>
              </YStack>

              {deductions.length > 0 && (
                <YStack
                  backgroundColor="$card"
                  padding="$5"
                  borderRadius="$4"
                  borderWidth={1}
                  borderColor="$border"
                  gap="$3"
                >
                  <Text fontSize="$5" fontWeight="600" color="$text">
                    Descontos Fixos
                  </Text>
                  <YStack gap="$2">
                    {deductions.map((deduction, index) => (
                      <XStack key={index} justifyContent="space-between">
                        <Text fontSize="$3" color="$muted">
                          {deduction.label}:
                        </Text>
                        <Text fontSize="$3" color="$text" fontWeight="600">
                          {formatCurrencyBR(deduction.amount)}
                        </Text>
                      </XStack>
                    ))}
                  </YStack>
                </YStack>
              )}

              <Button
                backgroundColor="transparent"
                borderWidth={1}
                borderColor="$accent"
                color="$accent"
                height={48}
                fontSize="$4"
                fontWeight="600"
                onPress={handleResetProfile}
                marginTop="$4"
              >
                Redefinir Perfil
              </Button>
            </YStack>
          ) : (
            <YStack gap="$4">
              <YStack gap="$3">
                <Text fontSize="$4" color="$text" fontWeight="600">
                  Nome
                </Text>
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
                      borderColor={errors.displayName ? 'red' : '$border'}
                      color="$text"
                      fontSize="$4"
                      height={48}
                      paddingHorizontal="$4"
                    />
                  )}
                />
                {errors.displayName && (
                  <Text fontSize="$2" color="red">
                    {errors.displayName.message}
                  </Text>
                )}
              </YStack>

              <YStack gap="$3">
                <Text fontSize="$4" color="$text" fontWeight="600">
                  Data de Admissão
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
                      placeholder="dd/mm/aaaa"
                      keyboardType="numeric"
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderWidth: 1,
                        borderColor: errors.admissionDate ? 'red' : '#DEE2E6',
                        color: '#000000',
                        fontSize: 16,
                        height: 48,
                        paddingHorizontal: 16,
                        borderRadius: 8,
                      }}
                    />
                  )}
                />
                {errors.admissionDate && (
                  <Text fontSize="$2" color="red">
                    {errors.admissionDate.message}
                  </Text>
                )}
              </YStack>

              <YStack gap="$3">
                <Text fontSize="$4" color="$text" fontWeight="600">
                  Tipo de Contrato
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
                              fontWeight="600"
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

              <YStack gap="$3">
                <Text fontSize="$4" color="$text" fontWeight="600">
                  Salário Base
                </Text>
                <Controller
                  control={control}
                  name="baseSalary"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="R$ 0,00"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      backgroundColor="$card"
                      borderColor={errors.baseSalary ? 'red' : '$border'}
                      color="$text"
                      fontSize="$4"
                      height={48}
                      paddingHorizontal="$4"
                      keyboardType="numeric"
                    />
                  )}
                />
                {errors.baseSalary && (
                  <Text fontSize="$2" color="red">
                    {errors.baseSalary.message}
                  </Text>
                )}
              </YStack>

              <YStack gap="$3">
                <Text fontSize="$4" color="$text" fontWeight="600">
                  Frequência de Pagamento
                </Text>
                <Controller
                  control={control}
                  name="paymentFrequency"
                  render={({ field: { onChange, value } }) => (
                    <YStack gap="$2">
                      {frequencyOptions.map((item) => (
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
                              fontWeight="600"
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

              <YStack gap="$3">
                <Text fontSize="$4" color="$text" fontWeight="600">
                  Período de Pagamento
                </Text>
                <Controller
                  control={control}
                  name="paymentPeriod"
                  render={({ field: { onChange, value } }) => (
                    <YStack gap="$2">
                      {periodOptions.map((item) => (
                        <TouchableOpacity key={item.value} onPress={() => onChange(item.value)}>
                          <XStack
                            backgroundColor={value === item.value ? '$accent' : '$card'}
                            padding="$3"
                            borderRadius="$4"
                            borderWidth={1}
                            borderColor={value === item.value ? '$accent' : '$border'}
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <YStack>
                              <Text
                                fontSize="$4"
                                color={value === item.value ? '$textDark' : '$text'}
                                fontWeight="600"
                              >
                                {item.label}
                              </Text>
                              <Text fontSize="$2" color={value === item.value ? '$textDark' : '$muted'}>
                                {item.description}
                              </Text>
                            </YStack>
                          </XStack>
                        </TouchableOpacity>
                      ))}
                    </YStack>
                  )}
                />
              </YStack>

              <YStack gap="$3">
                <Text fontSize="$4" color="$text" fontWeight="600">
                  Remuneração Variável
                </Text>
                <Controller
                  control={control}
                  name="hasVariablePay"
                  render={({ field: { onChange, value } }) => (
                    <XStack alignItems="center" gap="$3" paddingVertical="$2">
                      <Switch
                        size="$4"
                        checked={value}
                        onCheckedChange={onChange}
                        backgroundColor={value ? '$accent' : '$border'}
                      >
                        <Switch.Thumb animation="quick" backgroundColor="$card" />
                      </Switch>
                      <Label fontSize="$4" color="$text">
                        {value ? 'Sim, recebo' : 'Não recebo'}
                      </Label>
                    </XStack>
                  )}
                />
                {hasVariablePay && (
                  <Controller
                    control={control}
                    name="variablePayAverage"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        placeholder="Média mensal (R$ 0,00)"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        backgroundColor="$card"
                        borderColor="$border"
                        color="$text"
                        fontSize="$4"
                        height={48}
                        paddingHorizontal="$4"
                        keyboardType="numeric"
                      />
                    )}
                  />
                )}
              </YStack>

              <YStack gap="$3">
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="$4" color="$text" fontWeight="600">
                    Descontos Fixos
                  </Text>
                  <Button
                    backgroundColor="$accent"
                    color="$textDark"
                    height={32}
                    fontSize="$2"
                    fontWeight="600"
                    onPress={handleAddDeduction}
                    pressStyle={{ opacity: 0.8 }}
                  >
                    + Adicionar
                  </Button>
                </XStack>
                {deductions.map((deduction, index) => (
                  <XStack key={index} gap="$2" alignItems="center">
                    <Input
                      flex={1}
                      placeholder="Nome"
                      value={deduction.label}
                      onChangeText={(text) => handleUpdateDeduction(index, 'label', text)}
                      backgroundColor="$card"
                      borderColor="$border"
                      color="$text"
                      fontSize="$3"
                      height={40}
                      paddingHorizontal="$3"
                    />
                    <Input
                      width={100}
                      placeholder="Valor"
                      value={deduction.amount.toString()}
                      onChangeText={(text) => handleUpdateDeduction(index, 'amount', text)}
                      backgroundColor="$card"
                      borderColor="$border"
                      color="$text"
                      fontSize="$3"
                      height={40}
                      paddingHorizontal="$3"
                      keyboardType="numeric"
                    />
                    <Button
                      backgroundColor="transparent"
                      color="$muted"
                      width={40}
                      height={40}
                      onPress={() => handleRemoveDeduction(index)}
                    >
                      ✕
                    </Button>
                  </XStack>
                ))}
              </YStack>

              <XStack gap="$3" marginTop="$4">
                <Button
                  flex={1}
                  backgroundColor="transparent"
                  borderWidth={1}
                  borderColor="$border"
                  color="$text"
                  height={48}
                  fontSize="$4"
                  fontWeight="600"
                  onPress={() => setIsEditing(false)}
                  pressStyle={{ opacity: 0.8 }}
                >
                  Cancelar
                </Button>
                <Button
                  flex={1}
                  backgroundColor="$accent"
                  color="$textDark"
                  height={48}
                  fontSize="$4"
                  fontWeight="600"
                  onPress={handleSubmit(onSubmit)}
                  disabled={!isValid || !isDirty}
                  opacity={!isValid || !isDirty ? 0.5 : 1}
                  pressStyle={{ opacity: 0.8 }}
                >
                  Salvar
                </Button>
              </XStack>
            </YStack>
          )}
        </YStack>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
