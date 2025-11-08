import React from 'react';
import { Text, View, YStack, XStack, Button } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { ScrollView } from 'react-native';

import { useProfile } from '../../store/useProfileStore';
import { useSimulations } from '../../store/useSimulationStore';
import { formatCurrencyBR } from '../../utils';
import { SimulationTicket } from '../../components/SimulationTicket';
import type { AppTabsParamList } from '../../navigation/types';

type HomeNavigationProp = BottomTabNavigationProp<AppTabsParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const profile = useProfile();
  const simulations = useSimulations();

  const getEndDate = (startDate: string, days: number) => {
    const date = new Date(startDate + 'T00:00:00');
    date.setDate(date.getDate() + days - 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <View flex={1} backgroundColor="$background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack padding="$6" gap="$6">
          <YStack gap="$2">
            <Text fontSize="$8" fontWeight="700" color="$text">
              Olá, {profile?.displayName}!
            </Text>
            <Text fontSize="$4" color="$muted">
              Tudo pronto para simular suas férias
            </Text>
          </YStack>

          <YStack
            backgroundColor="$card"
            padding="$5"
            borderRadius="$4"
            borderWidth={1}
            borderColor="$border"
            gap="$3"
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.06}
            shadowRadius={8}
            elevation={3}
          >
            <Text fontSize="$5" fontWeight="600" color="$text">
              Seu Perfil
            </Text>
            <YStack gap="$2">
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$muted">
                  Salário base:
                </Text>
                <Text fontSize="$3" color="$text" fontWeight="600">
                  {formatCurrencyBR(profile?.baseSalary || 0)}
                </Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$muted">
                  Admissão:
                </Text>
                <Text fontSize="$3" color="$text" fontWeight="600">
                  {profile?.admissionDate}
                </Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$muted">
                  Contrato:
                </Text>
                <Text fontSize="$3" color="$text" fontWeight="600">
                  {profile?.contractType === 'indeterminado'
                    ? 'Indeterminado'
                    : profile?.contractType === 'experiencia'
                    ? 'Experiência'
                    : profile?.contractType === 'aprendiz'
                    ? 'Aprendiz'
                    : 'Outro'}
                </Text>
              </XStack>
            </YStack>
          </YStack>

          <Button
            backgroundColor="$accent"
            color="$textDark"
            height={56}
            fontSize="$5"
            fontWeight="600"
            onPress={() => navigation.navigate('Simulation')}
            pressStyle={{ opacity: 0.8 }}
          >
            Simular Férias
          </Button>

          {simulations.length > 0 && (
            <YStack gap="$4">
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize="$6" fontWeight="600" color="$text">
                  Suas Simulações
                </Text>
                <Text fontSize="$3" color="$muted">
                  {simulations.length} {simulations.length === 1 ? 'simulação' : 'simulações'}
                </Text>
              </XStack>
              
              <YStack gap="$4">
                {simulations.slice(0, 5).map((sim) => (
                  <SimulationTicket
                    key={sim.id}
                    vacationDays={sim.input.vacationDays}
                    startDate={sim.input.startDate}
                    endDate={getEndDate(sim.input.startDate, sim.input.vacationDays)}
                    liquidoFerias={sim.result?.liquidoFerias || 0}
                    advance13th={sim.input.advance13th}
                  />
                ))}
              </YStack>

              {simulations.length > 5 && (
                <Text fontSize="$3" color="$muted" textAlign="center">
                  + {simulations.length - 5} simulações antigas
                </Text>
              )}
            </YStack>
          )}

          {simulations.length === 0 && (
            <YStack
              padding="$6"
              backgroundColor="$cardAlt"
              borderRadius="$4"
              borderWidth={1}
              borderColor="$border"
              borderStyle="dashed"
              alignItems="center"
              gap="$3"
              shadowColor="#000"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.04}
              shadowRadius={6}
              elevation={2}
            >
              <Text fontSize="$5" fontWeight="600" color="$text" textAlign="center">
                Nenhuma simulação ainda
              </Text>
              <Text fontSize="$3" color="$muted" textAlign="center">
                Comece simulando suas próximas férias!
              </Text>
            </YStack>
          )}
        </YStack>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
