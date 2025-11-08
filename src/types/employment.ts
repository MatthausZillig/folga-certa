export type ContractType = 'indeterminado' | 'experiencia' | 'aprendiz' | 'outro';

export type PaymentFrequency = 'mensal' | 'quinzenal' | 'semanal';

export type Deduction = {
  label: string;
  amount: number;
};

export type PaymentPeriod = 'inicio' | 'meio' | 'fim';

export type EmploymentProfile = {
  displayName?: string;
  admissionDate?: string;
  contractType?: ContractType;
  baseSalary?: number;
  paymentFrequency?: PaymentFrequency;
  paymentPeriod?: PaymentPeriod;
  hasVariablePay?: boolean;
  variablePayAverage?: number;
  deductions?: Deduction[];
  useOfficialTables?: boolean;
  updatedAt?: string;
};

