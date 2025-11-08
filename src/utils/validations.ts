import { z } from 'zod';

export const step1Schema = z.object({
  displayName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
});

export const step2Schema = z.object({
  admissionDate: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Data inválida. Use DD/MM/AAAA')
    .refine((date) => {
      const [day, month, year] = date.split('/').map(Number);
      const d = new Date(year, month - 1, day);
      return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
    }, 'Data inválida'),
  contractType: z.enum(['indeterminado', 'experiencia', 'aprendiz', 'outro']),
});

export const step3Schema = z.object({
  baseSalary: z
    .string()
    .min(1, 'Informe o salário')
    .refine((val) => {
      const num = parseFloat(val.replace(/[^\d,]/g, '').replace(',', '.'));
      return !isNaN(num) && num > 0;
    }, 'Salário deve ser maior que zero'),
  paymentFrequency: z.enum(['mensal', 'quinzenal', 'semanal']),
  paymentPeriod: z.enum(['inicio', 'meio', 'fim']),
});

export const step4Schema = z
  .object({
    hasVariablePay: z.boolean(),
    variablePayAverage: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.hasVariablePay) {
        const value = parseFloat(data.variablePayAverage?.replace(/[^\d,]/g, '').replace(',', '.') || '0');
        return value > 0;
      }
      return true;
    },
    {
      message: 'Informe a média de valores variáveis',
      path: ['variablePayAverage'],
    }
  );

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step4Data = z.infer<typeof step4Schema>;

const isValidDate = (dateString: string) => {
  const [day, month, year] = dateString.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

export const simulationSchema = z.object({
  startDate: z
    .string()
    .min(10, 'Data de início inválida (DD/MM/AAAA)')
    .max(10, 'Data de início inválida (DD/MM/AAAA)')
    .refine(isValidDate, 'Data de início inválida.'),
  vacationDays: z
    .string()
    .refine((val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 5 && num <= 30;
    }, 'Férias devem ter entre 5 e 30 dias.'),
  soldDays: z
    .string()
    .refine((val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 0 && num <= 10;
    }, 'Você pode vender até 10 dias.'),
  advance13th: z.boolean(),
});

export type SimulationData = z.infer<typeof simulationSchema>;

