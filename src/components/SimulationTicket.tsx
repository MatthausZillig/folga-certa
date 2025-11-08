import React from 'react';
import { Text, View, XStack, YStack } from 'tamagui';
import { formatCurrencyBR } from '../utils';

type SimulationTicketProps = {
  vacationDays: number;
  startDate: string;
  endDate: string;
  liquidoFerias: number;
  advance13th?: boolean;
};

export const SimulationTicket: React.FC<SimulationTicketProps> = ({
  vacationDays,
  startDate,
  endDate,
  liquidoFerias,
  advance13th,
}) => {
  const formatDateShort = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${day} ${months[parseInt(month, 10) - 1]}`;
  };

  return (
    <View
      backgroundColor="$card"
      borderRadius="$4"
      borderWidth={1}
      borderColor="$border"
      overflow="hidden"
      position="relative"
    >
      <YStack>
        <YStack padding="$4" paddingBottom="$3" gap="$3">
          <YStack gap="$1">
            <Text fontSize="$1" color="$muted" fontWeight="600" textTransform="uppercase" letterSpacing={0.8}>
              Férias
            </Text>
            <Text fontSize="$6" color="$text" fontWeight="700" letterSpacing={-0.5}>
              {vacationDays} dias
            </Text>
          </YStack>

          <XStack gap="$3" alignItems="center" paddingTop="$1">
            <YStack gap="$1" flex={1}>
              <Text fontSize="$5" color="$text" fontWeight="700" letterSpacing={-0.3}>
                {formatDateShort(startDate)}
              </Text>
              <Text fontSize="$2" color="$muted" textTransform="uppercase" letterSpacing={0.5} fontWeight="600">
                Início
              </Text>
            </YStack>

            <View flex={1} height={1.5} backgroundColor="$border" position="relative" alignItems="center">
              <View
                width={6}
                height={6}
                borderRadius={3}
                backgroundColor="$accent"
                position="absolute"
                top="50%"
                left="50%"
                transform={[{ translateX: -3 }, { translateY: -3 }]}
              />
            </View>

            <YStack gap="$1" flex={1} alignItems="flex-end">
              <Text fontSize="$5" color="$text" fontWeight="700" letterSpacing={-0.3}>
                {formatDateShort(endDate)}
              </Text>
              <Text fontSize="$2" color="$muted" textTransform="uppercase" letterSpacing={0.5} fontWeight="600">
                Retorno
              </Text>
            </YStack>
          </XStack>
        </YStack>

        <XStack
          paddingVertical="$3"
          paddingHorizontal="$4"
          justifyContent="space-between"
          alignItems="center"
          backgroundColor="$cardAlt"
          borderTopWidth={1.5}
          borderTopColor="$border"
          borderStyle="dashed"
        >
          <YStack gap="$1">
            <Text fontSize="$2" color="$muted" textTransform="uppercase" letterSpacing={0.5} fontWeight="600">
              Valor Líquido
            </Text>
            <Text fontSize="$6" color="$accent" fontWeight="700" letterSpacing={-0.5}>
              {formatCurrencyBR(liquidoFerias)}
            </Text>
          </YStack>
        </XStack>
      </YStack>

      <View 
        position="absolute" 
        left={-6} 
        top="50%" 
        width={12} 
        height={12} 
        borderRadius={6} 
        backgroundColor="$background"
        borderWidth={1}
        borderColor="$border"
        borderRightWidth={0}
        transform={[{ translateY: -6 }]}
      />
      <View 
        position="absolute" 
        right={-6} 
        top="50%" 
        width={12} 
        height={12} 
        borderRadius={6} 
        backgroundColor="$background"
        borderWidth={1}
        borderColor="$border"
        borderLeftWidth={0}
        transform={[{ translateY: -6 }]}
      />
    </View>
  );
};
