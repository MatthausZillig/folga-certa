import type { Mask } from 'react-native-mask-input';

export const dateMask: Mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

export const currencyMask: Mask = (text) => {
  const cleaned = text.replace(/\D/g, '');
  const formatted = cleaned.replace(/(\d)(\d{2})$/, '$1,$2');
  const withThousands = formatted.replace(/(?=(\d{3})+(\D))\B/g, '.');
  return `R$ ${withThousands}`.split('').map((char) => char);
};

export const formatCurrency = (value: string): number => {
  const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};

export const formatDate = (value: string): string => {
  return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').replace(/(\d{2})(\d)/, '$1/$2');
};

