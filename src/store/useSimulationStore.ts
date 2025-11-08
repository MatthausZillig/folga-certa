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
  _version: number;
};

const STORE_VERSION = 2;

export const useSimulationStore = create<SimulationState>()(
  persist(
    (set) => ({
      simulations: [],
      _version: STORE_VERSION,
      addSimulation: (simulation) =>
        set((state) => ({
          simulations: [
            {
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
              ...simulation,
            },
            ...state.simulations,
          ].slice(0, 20),
        })),
      clearSimulations: () => set({ simulations: [] }),
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
        }
      },
    }
  )
);

export const useSimulations = () => useSimulationStore((state) => state.simulations);
export const useAddSimulation = () => useSimulationStore((state) => state.addSimulation);
export const useClearSimulations = () => useSimulationStore((state) => state.clearSimulations);
