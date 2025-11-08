export type VacationSimulationInput = {
  startDate: string;
  vacationDays: number;
  soldDays: number;
  advance13th: boolean;
};

export type VacationSimulation = {
  id: string;
  createdAt: string;
  input: VacationSimulationInput;
  result: any;
};

