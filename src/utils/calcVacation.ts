import type { EmploymentProfile } from '../types';

export type VacationInput = {
  startDate: string;
  vacationDays: number;
  soldDays: number;
  advance13th: boolean;
};

export type VacationTimelineEvent = {
  date: string;
  label: string;
  amount: number;
  type: 'salary' | 'vacation' | 'info' | '13th';
  description: string;
};

export type VacationResult = {
  feriasGozadasBruto: number;
  tercoConstitucionalGozado: number;
  abonoPecuniarioBruto: number;
  tercoConstitucionalAbono: number;
  advance13thValue: number;
  totalFeriasBruto: number;
  baseInssFerias: number;
  descontoInssFerias: number;
  baseIrrfFerias: number;
  descontoIrrfFerias: number;
  liquidoFerias: number;
  timeline: VacationTimelineEvent[];
  explicacaoTexto: string;
  breakdown: {
    label: string;
    value: number;
    type: 'credit' | 'debit';
  }[];
};

const calculateINSS = (baseCalculo: number): number => {
  if (baseCalculo <= 1412.0) {
    return baseCalculo * 0.075;
  } else if (baseCalculo <= 2666.68) {
    return 1412.0 * 0.075 + (baseCalculo - 1412.0) * 0.09;
  } else if (baseCalculo <= 4000.03) {
    return 1412.0 * 0.075 + (2666.68 - 1412.0) * 0.09 + (baseCalculo - 2666.68) * 0.12;
  } else if (baseCalculo <= 7786.02) {
    return (
      1412.0 * 0.075 +
      (2666.68 - 1412.0) * 0.09 +
      (4000.03 - 2666.68) * 0.12 +
      (baseCalculo - 4000.03) * 0.14
    );
  }
  return (
    1412.0 * 0.075 +
    (2666.68 - 1412.0) * 0.09 +
    (4000.03 - 2666.68) * 0.12 +
    (7786.02 - 4000.03) * 0.14
  );
};

const calculateIRRF = (baseCalculo: number): number => {
  if (baseCalculo <= 2259.2) {
    return 0;
  } else if (baseCalculo <= 2826.65) {
    return baseCalculo * 0.075 - 169.44;
  } else if (baseCalculo <= 3751.05) {
    return baseCalculo * 0.15 - 381.44;
  } else if (baseCalculo <= 4664.68) {
    return baseCalculo * 0.225 - 662.77;
  }
  return baseCalculo * 0.275 - 896.0;
};

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const getPaymentDateForMonth = (year: number, month: number, paymentDay: number): Date => {
  const targetDate = new Date(year, month, paymentDay);
  
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
  if (paymentDay > lastDayOfMonth) {
    targetDate.setDate(lastDayOfMonth);
  }
  
  return targetDate;
};

export const calculateVacation = (
  profile: EmploymentProfile,
  input: VacationInput
): VacationResult => {
  const remuneracaoBase = 
    (profile.baseSalary || 0) +
    (profile.variablePayAverage || 0);

  const valorDia = remuneracaoBase / 30;

  const feriasGozadasBruto = valorDia * input.vacationDays;
  const tercoConstitucionalGozado = feriasGozadasBruto / 3;

  const abonoPecuniarioBruto = valorDia * input.soldDays;
  const tercoConstitucionalAbono = abonoPecuniarioBruto / 3;

  const advance13thValue = input.advance13th ? remuneracaoBase / 2 : 0;

  const totalFeriasBruto =
    feriasGozadasBruto +
    tercoConstitucionalGozado +
    abonoPecuniarioBruto +
    tercoConstitucionalAbono;

  const baseInssFerias = feriasGozadasBruto + tercoConstitucionalGozado + abonoPecuniarioBruto + tercoConstitucionalAbono;
  const descontoInssFerias = calculateINSS(baseInssFerias);

  const irTributaAbono = false;
  const baseIrrfFerias =
    feriasGozadasBruto +
    tercoConstitucionalGozado +
    (irTributaAbono ? abonoPecuniarioBruto + tercoConstitucionalAbono : 0);
  
  const descontoIrrfFerias = Math.max(0, calculateIRRF(baseIrrfFerias - descontoInssFerias));

  const liquidoFerias = totalFeriasBruto + advance13thValue - descontoInssFerias - descontoIrrfFerias;

  const startDate = new Date(input.startDate + 'T00:00:00');
  
  const paymentDate = new Date(startDate);
  paymentDate.setDate(paymentDate.getDate() - 2);

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + input.vacationDays - 1);

  const returnDate = new Date(endDate);
  returnDate.setDate(returnDate.getDate() + 1);

  const getPaymentDayFromPeriod = (period?: string): number => {
    switch (period) {
      case 'inicio':
        return 5;
      case 'meio':
        return 15;
      case 'fim':
        return 25;
      default:
        return 5;
    }
  };

  const paymentDay = getPaymentDayFromPeriod(profile.paymentPeriod);

  const vacationStartMonth = startDate.getMonth();
  const vacationStartYear = startDate.getFullYear();
  const vacationStartDay = startDate.getDate();

  const timeline: VacationTimelineEvent[] = [];

  if (vacationStartDay > paymentDay) {
    const salaryBeforeVacationDate = getPaymentDateForMonth(
      vacationStartYear,
      vacationStartMonth,
      paymentDay
    );
    
    timeline.push({
      date: formatDate(salaryBeforeVacationDate),
      label: 'Salário do mês anterior',
      amount: remuneracaoBase,
      type: 'salary',
      description: `Pagamento do salário referente ao mês trabalhado antes das férias (${paymentDay > 28 ? 'último dia útil' : `dia ${paymentDay}`})`,
    });
  } else {
    const previousMonth = vacationStartMonth === 0 ? 11 : vacationStartMonth - 1;
    const previousYear = vacationStartMonth === 0 ? vacationStartYear - 1 : vacationStartYear;
    
    const salaryBeforeVacationDate = getPaymentDateForMonth(
      previousYear,
      previousMonth,
      paymentDay
    );
    
    if (salaryBeforeVacationDate < startDate) {
      timeline.push({
        date: formatDate(salaryBeforeVacationDate),
        label: 'Salário do mês anterior',
        amount: remuneracaoBase,
        type: 'salary',
        description: `Pagamento do salário referente ao mês trabalhado antes das férias (${paymentDay > 28 ? 'último dia útil' : `dia ${paymentDay}`})`,
      });
    }
  }

  timeline.push({
    date: formatDate(paymentDate),
    label: 'Pagamento de férias',
    amount: liquidoFerias,
    type: 'vacation',
    description: input.advance13th 
      ? 'Férias + 1/3 constitucional + venda de dias + adiantamento 13º (pago até 2 dias antes do início)'
      : 'Férias + 1/3 constitucional + venda de dias (pago até 2 dias antes do início)',
  });

  timeline.push({
    date: formatDate(startDate),
    label: 'Início das férias',
    amount: 0,
    type: 'info',
    description: `Você começa suas férias (${input.vacationDays} dias de descanso)`,
  });

  timeline.push({
    date: formatDate(endDate),
    label: 'Fim das férias',
    amount: 0,
    type: 'info',
    description: 'Último dia de férias',
  });

  const returnMonth = returnDate.getMonth();
  const returnYear = returnDate.getFullYear();
  const returnDay = returnDate.getDate();

  let nextPaymentMonth = vacationStartMonth;
  let nextPaymentYear = vacationStartYear;
  
  if (vacationStartDay <= paymentDay) {
    const daysWorkedBeforeVacation = vacationStartDay - 1;
    
    if (daysWorkedBeforeVacation > 0) {
      const proportionalAmount = valorDia * daysWorkedBeforeVacation;
      const paymentDateForWorkedDays = getPaymentDateForMonth(
        vacationStartYear,
        vacationStartMonth,
        paymentDay
      );
      
      timeline.push({
        date: formatDate(paymentDateForWorkedDays),
        label: 'Salário proporcional (mês das férias)',
        amount: proportionalAmount,
        type: 'salary',
        description: `Pagamento proporcional aos ${daysWorkedBeforeVacation} dias trabalhados no mês antes de sair de férias (dias 01 a ${String(daysWorkedBeforeVacation).padStart(2, '0')})`,
      });
    }
    
    nextPaymentMonth = returnMonth;
    nextPaymentYear = returnYear;
  } else {
    nextPaymentMonth = vacationStartMonth + 1;
    if (nextPaymentMonth > 11) {
      nextPaymentMonth = 0;
      nextPaymentYear += 1;
    }
  }

  if (returnDay <= paymentDay) {
    const daysWorkedAfterReturn = paymentDay - returnDay + 1;
    const proportionalReturnAmount = valorDia * daysWorkedAfterReturn;
    
    const nextSalaryDate = getPaymentDateForMonth(nextPaymentYear, nextPaymentMonth, paymentDay);
    
    timeline.push({
      date: formatDate(nextSalaryDate),
      label: 'Salário proporcional (volta)',
      amount: proportionalReturnAmount,
      type: 'salary',
      description: `Pagamento proporcional aos ${daysWorkedAfterReturn} dias trabalhados após retornar das férias (dias ${String(returnDay).padStart(2, '0')} a ${String(paymentDay).padStart(2, '0')})`,
    });
  } else {
    let fullSalaryMonth = nextPaymentMonth + 1;
    let fullSalaryYear = nextPaymentYear;
    if (fullSalaryMonth > 11) {
      fullSalaryMonth = 0;
      fullSalaryYear += 1;
    }
    
    const nextFullSalaryDate = getPaymentDateForMonth(fullSalaryYear, fullSalaryMonth, paymentDay);
    
    timeline.push({
      date: formatDate(nextFullSalaryDate),
      label: 'Próximo salário completo',
      amount: remuneracaoBase,
      type: 'salary',
      description: 'Retorno ao recebimento normal do salário mensal',
    });
  }

  const breakdown: VacationResult['breakdown'] = [
    {
      label: `Férias gozadas (${input.vacationDays} dias)`,
      value: feriasGozadasBruto,
      type: 'credit',
    },
    {
      label: '1/3 constitucional sobre férias',
      value: tercoConstitucionalGozado,
      type: 'credit',
    },
  ];

  if (input.soldDays > 0) {
    breakdown.push(
      {
        label: `Abono pecuniário (${input.soldDays} dias vendidos)`,
        value: abonoPecuniarioBruto,
        type: 'credit',
      },
      {
        label: '1/3 constitucional sobre venda',
        value: tercoConstitucionalAbono,
        type: 'credit',
      }
    );
  }

  if (advance13thValue > 0) {
    breakdown.push({
      label: 'Adiantamento de 13º salário (50%)',
      value: advance13thValue,
      type: 'credit',
    });
  }

  breakdown.push(
    {
      label: 'INSS sobre férias',
      value: descontoInssFerias,
      type: 'debit',
    },
    {
      label: 'IRRF sobre férias',
      value: descontoIrrfFerias,
      type: 'debit',
    }
  );

  const daysWorkedBeforeVacation = vacationStartDay <= paymentDay ? vacationStartDay - 1 : 0;
  
  const explicacaoTexto = `Com base no seu salário de ${formatCurrencyBR(remuneracaoBase)}, você deve receber aproximadamente ${formatCurrencyBR(liquidoFerias)} líquido até 2 dias antes de começar suas férias. ${
    vacationStartDay > paymentDay
      ? `Como você sai de férias após o dia ${paymentDay}, você ainda receberá o salário do mês anterior normalmente (${formatCurrencyBR(remuneracaoBase)}) no dia ${paymentDay}. `
      : daysWorkedBeforeVacation > 0 
        ? `Como você sai de férias antes do dia ${paymentDay}, você receberá proporcional aos ${daysWorkedBeforeVacation} dias trabalhados (${formatCurrencyBR(valorDia * daysWorkedBeforeVacation)}) no dia ${paymentDay}. `
        : `Você sai de férias no primeiro dia do mês. `
  }Após retornar das férias no dia ${formatDate(returnDate)}, você ${returnDay <= paymentDay ? `receberá proporcional aos ${paymentDay - returnDay + 1} dias trabalhados até o dia de pagamento` : 'voltará a receber seu salário completo no próximo mês'}.`;

  return {
    feriasGozadasBruto,
    tercoConstitucionalGozado,
    abonoPecuniarioBruto,
    tercoConstitucionalAbono,
    advance13thValue,
    totalFeriasBruto,
    baseInssFerias,
    descontoInssFerias,
    baseIrrfFerias,
    descontoIrrfFerias,
    liquidoFerias,
    timeline,
    explicacaoTexto,
    breakdown,
  };
};

export const formatCurrencyBR = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};
