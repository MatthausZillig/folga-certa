import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { VacationSimulation } from '../types';

type SimulationInput = {
  input: {
    startDate: string;
    vacationDays: number;
    soldDays: number;
    advance13th: boolean;
  };
  result: any;
};

type SimulationState = {
  simulations: VacationSimulation[];
  addSimulation: (simulation: SimulationInput) => void;
  clearSimulations: () => void;
  cleanOldSimulations: () => void;
  _version: number;
};

const STORE_VERSION = 2;
const MAX_AGE_DAYS = 7;

const isSimulationOld = (createdAt: string): boolean => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > MAX_AGE_DAYS;
};

export const useSimulationStore = create<SimulationState>()(
  persist(
    (set) => ({
      simulations: [],
      _version: STORE_VERSION,
      addSimulation: (simulation) =>
        set((state) => {
          const freshSimulations = state.simulations.filter(
            (sim) => !isSimulationOld(sim.createdAt)
          );
          return {
            simulations: [
              {
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                ...simulation,
              },
              ...freshSimulations,
            ].slice(0, 20),
          };
        }),
      clearSimulations: () => set({ simulations: [] }),
      cleanOldSimulations: () =>
        set((state) => ({
          simulations: state.simulations.filter(
            (sim) => !isSimulationOld(sim.createdAt)
          ),
        })),
    }),
    {
      name: 'folga-certa-simulations',
      version: STORE_VERSION,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persistedState: any, version: number) => {
        if (version < STORE_VERSION) {
          return {
            simulations: [],
            _version: STORE_VERSION,
          };
        }
        return persistedState;
      },
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          AsyncStorage.removeItem('folga-certa-simulations');
        } else if (state) {
          state.cleanOldSimulations();
        }
      },
    }
  )
);

export const useSimulations = () => useSimulationStore((state) => state.simulations);
export const useAddSimulation = () => useSimulationStore((state) => state.addSimulation);
export const useClearSimulations = () => useSimulationStore((state) => state.clearSimulations);
export const useCleanOldSimulations = () => useSimulationStore((state) => state.cleanOldSimulations);
