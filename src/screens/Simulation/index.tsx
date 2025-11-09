import React, { useState, useEffect } from 'react';
import { Text, View, YStack, XStack, Button, Switch, Label } from 'tamagui';
import { ScrollView, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import MaskInput from 'react-native-mask-input';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { useProfile } from '../../store/useProfileStore';
import { useAddSimulation } from '../../store/useSimulationStore';
import { simulationSchema, type SimulationData, dateMask, calculateVacation, formatCurrencyBR } from '../../utils';
import type { VacationResult } from '../../utils/calcVacation';
import type { AppTabsParamList } from '../../navigation/types';

type SimulationScreenRouteProp = RouteProp<AppTabsParamList, 'Simulation'>;

export const SimulationScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<SimulationScreenRouteProp>();
  const profile = useProfile();
  const addSimulation = useAddSimulation();
  const [result, setResult] = useState<VacationResult | null>(null);
  const [isFromSavedSimulation, setIsFromSavedSimulation] = useState(false);

  useEffect(() => {
    if (route.params?.simulation) {
      setResult(route.params.simulation.result);
      setIsFromSavedSimulation(true);
    } else {
      setResult(null);
      setIsFromSavedSimulation(false);
    }
  }, [route.params]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<SimulationData>({
    resolver: zodResolver(simulationSchema),
    defaultValues: {
      startDate: '',
      vacationDays: '',
      soldDays: '0',
      advance13th: false,
    },
    mode: 'onTouched',
  });

  const onSubmit = (data: SimulationData) => {
    if (!profile) return;

    const input = {
      startDate: data.startDate.split('/').reverse().join('-'),
      vacationDays: parseInt(data.vacationDays, 10),
      soldDays: parseInt(data.soldDays, 10),
      advance13th: data.advance13th,
    };

    const calculationResult = calculateVacation(profile, input);

    addSimulation({
      input,
      result: calculationResult,
    });

    setResult(calculationResult);
  };

  const handleNewSimulation = () => {
    setResult(null);
    setIsFromSavedSimulation(false);
    reset();
    navigation.setParams({ simulation: undefined } as any);
  };

  const handleBack = () => {
    if (isFromSavedSimulation) {
      navigation.goBack();
    } else {
      setResult(null);
    }
  };

  if (result) {
    return (
      <View flex={1} backgroundColor="$background">
        <ScrollView>
          <YStack padding="$6" gap="$5">
            <XStack alignItems="center" gap="$3">
              <TouchableOpacity onPress={handleBack}>
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
              <YStack flex={1} gap="$1">
                <Text fontSize="$8" fontWeight="700" color="$text">
                  Resultado da Simulação
                </Text>
                <Text fontSize="$4" color="$muted">
                  Confira quanto você vai receber
                </Text>
              </YStack>
            </XStack>

            <YStack
              backgroundColor="$accent"
              padding="$6"
              borderRadius="$4"
              gap="$2"
              alignItems="center"
            >
              <Text fontSize="$4" color="$textDark" opacity={0.9}>
                Você vai receber antes das férias
              </Text>
              <Text fontSize="$9" fontWeight="700" color="$textDark">
                {formatCurrencyBR(result.liquidoFerias)}
              </Text>
              <Text fontSize="$3" color="$textDark" opacity={0.8}>
                líquido (pago até 2 dias antes)
              </Text>
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
                Como Funciona
              </Text>
              <Text fontSize="$3" color="$muted" lineHeight={20}>
                {result.explicacaoTexto}
              </Text>
            </YStack>

            <YStack
              backgroundColor="$card"
              padding="$5"
              borderRadius="$4"
              borderWidth={1}
              borderColor="$border"
              gap="$4"
            >
              <Text fontSize="$5" fontWeight="600" color="$text">
                Timeline de Pagamentos
              </Text>
              {result.timeline.map((event, idx) => (
                <YStack key={idx} gap="$2">
                  <XStack justifyContent="space-between" alignItems="center">
                    <YStack flex={1} gap="$1">
                      <Text fontSize="$3" color="$text" fontWeight="600">
                        {event.label}
                      </Text>
                      <Text fontSize="$2" color="$muted">
                        {event.date}
                      </Text>
                    </YStack>
                    {event.amount > 0 && (
                      <Text
                        fontSize="$5"
                        color={event.type === 'vacation' ? '$accent' : '$text'}
                        fontWeight="700"
                      >
                        {formatCurrencyBR(event.amount)}
                      </Text>
                    )}
                  </XStack>
                  <Text fontSize="$2" color="$muted" lineHeight={16}>
                    {event.description}
                  </Text>
                  {idx < result.timeline.length - 1 && (
                    <View height={1} backgroundColor="$border" marginVertical="$1" />
                  )}
                </YStack>
              ))}
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
                Detalhamento do Cálculo
              </Text>
              {result.breakdown.map((item, idx) => (
                <XStack key={idx} justifyContent="space-between" alignItems="center">
                  <Text fontSize="$3" color="$muted" flex={1}>
                    {item.label}
                  </Text>
                  <Text
                    fontSize="$4"
                    color={item.type === 'credit' ? '$text' : '#dc2626'}
                    fontWeight="600"
                  >
                    {item.type === 'debit' && item.value > 0 && '- '}
                    {formatCurrencyBR(item.value)}
                  </Text>
                </XStack>
              ))}
              <View height={1} backgroundColor="$border" marginVertical="$2" />
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize="$4" color="$text" fontWeight="600">
                  Total Líquido
                </Text>
                <Text fontSize="$5" color="$accent" fontWeight="700">
                  {formatCurrencyBR(result.liquidoFerias)}
                </Text>
              </XStack>
            </YStack>

            <YStack
              backgroundColor="$cardAlt"
              padding="$4"
              borderRadius="$4"
              gap="$2"
            >
              <Text fontSize="$3" color="$muted" lineHeight={18}>
                💡 Este cálculo é uma estimativa baseada nas regras da CLT vigentes. Valores exatos podem variar
                conforme acordos coletivos, convenções ou outras particularidades do seu contrato.
              </Text>
            </YStack>

            <Button
              backgroundColor="$accent"
              color="$textDark"
              height={56}
              fontSize="$5"
              fontWeight="600"
              onPress={handleNewSimulation}
            >
              Nova Simulação
            </Button>
          </YStack>
        </ScrollView>
      </View>
    );
  }

  return (
    <View flex={1} backgroundColor="$background">
      <ScrollView>
        <YStack padding="$6" gap="$5">
          <XStack alignItems="center" gap="$3">
            <TouchableOpacity onPress={() => navigation.goBack()}>
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
            <YStack flex={1} gap="$1">
              <Text fontSize="$8" fontWeight="700" color="$text">
                Simular Férias
              </Text>
              <Text fontSize="$4" color="$muted">
                Preencha os dados para calcular quanto você vai receber
              </Text>
            </YStack>
          </XStack>

          <YStack gap="$2">
            <Text fontSize="$3" color="$text" fontWeight="600">
              Data de início das férias
            </Text>
            <Controller
              control={control}
              name="startDate"
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
                    borderColor: errors.startDate ? '#dc2626' : '#DEE2E6',
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
            {errors.startDate && (
              <Text fontSize="$3" color="#dc2626">
                {errors.startDate.message}
              </Text>
            )}
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$3" color="$text" fontWeight="600">
              Número de dias de férias (5-30)
            </Text>
            <Controller
              control={control}
              name="vacationDays"
              render={({ field: { onChange, onBlur, value } }) => (
                <MaskInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Ex: 30"
                  keyboardType="numeric"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderColor: errors.vacationDays ? '#dc2626' : '#DEE2E6',
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
            {errors.vacationDays && (
              <Text fontSize="$3" color="#dc2626">
                {errors.vacationDays.message}
              </Text>
            )}
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$3" color="$text" fontWeight="600">
              Quantos dias quer vender? (0-10)
            </Text>
            <Text fontSize="$2" color="$muted" marginBottom="$1">
              Você pode vender até 1/3 das suas férias
            </Text>
            <Controller
              control={control}
              name="soldDays"
              render={({ field: { onChange, onBlur, value } }) => (
                <MaskInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Ex: 0"
                  keyboardType="numeric"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderColor: errors.soldDays ? '#dc2626' : '#DEE2E6',
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
            {errors.soldDays && (
              <Text fontSize="$3" color="#dc2626">
                {errors.soldDays.message}
              </Text>
            )}
          </YStack>

          <YStack gap="$4">
            <Text fontSize="$4" color="$text" fontWeight="600">
              Deseja adiantar o 13º salário?
            </Text>
            <Text fontSize="$3" color="$muted" marginBottom="$2">
              Você pode receber 50% do 13º junto com as férias
            </Text>
            <Controller
              control={control}
              name="advance13th"
              render={({ field: { onChange, value } }) => (
                <XStack alignItems="center" justifyContent="space-between">
                  <Label fontSize="$5" color="$text">
                    {value ? 'Sim, quero adiantar' : 'Não, obrigado'}
                  </Label>
                  <Switch size="$5" checked={value} onCheckedChange={onChange}>
                    <Switch.Thumb animation="quick" />
                  </Switch>
                </XStack>
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
            Calcular
          </Button>
        </YStack>
      </ScrollView>
    </View>
  );
};

export default SimulationScreen;
