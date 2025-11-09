import React, { memo, useMemo } from 'react';
import { Text, View, XStack, YStack } from 'tamagui';
import { TouchableOpacity } from 'react-native';
import { formatCurrencyBR } from '../utils';

type SimulationTicketProps = {
  vacationDays: number;
  startDate: string;
  endDate: string;
  liquidoFerias: number;
  advance13th?: boolean;
  onPress?: () => void;
};

const SimulationTicketComponent: React.FC<SimulationTicketProps> = ({
  vacationDays,
  startDate,
  endDate,
  liquidoFerias,
  advance13th,
  onPress,
}) => {
  const formatDateShort = useMemo(() => {
    return (dateStr: string) => {
      const [year, month, day] = dateStr.split('-');
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      return `${day} ${months[parseInt(month, 10) - 1]}`;
    };
  }, []);

  const formattedLiquido = useMemo(() => formatCurrencyBR(liquidoFerias), [liquidoFerias]);

  const content = (
    <View
      backgroundColor="$card"
      borderRadius="$4"
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
          backgroundColor="$card"
          borderTopWidth={1.5}
          borderTopColor="$border"
          borderStyle="dashed"
        >
          <YStack gap="$1">
            <Text fontSize="$2" color="$muted" textTransform="uppercase" letterSpacing={0.5} fontWeight="600">
              Valor Líquido
            </Text>
            <Text fontSize="$6" color="$accent" fontWeight="700" letterSpacing={-0.5}>
              {formattedLiquido}
            </Text>
          </YStack>
        </XStack>
      </YStack>

      <View 
        position="absolute" 
        left={-8} 
        top="62%" 
        width={16} 
        height={16} 
        borderRadius={8} 
        backgroundColor="$background"
        transform={[{ translateY: -8 }]}
      />
      <View 
        position="absolute" 
        right={-8} 
        top="62%" 
        width={16} 
        height={16} 
        borderRadius={8} 
        backgroundColor="$background"
        transform={[{ translateY: -8 }]}
      />
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

export const SimulationTicket = memo(SimulationTicketComponent);
