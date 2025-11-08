import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { EmploymentProfile } from '../types';

type ProfileState = {
  profile: EmploymentProfile | null;
  setProfile: (partial: Partial<EmploymentProfile>) => void;
  resetProfile: () => void;
  _version: number;
};

const STORE_VERSION = 2;

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      _version: STORE_VERSION,
      setProfile: (partial) =>
        set((state) => ({
          profile: {
            ...state.profile,
            ...partial,
            updatedAt: new Date().toISOString(),
          },
        })),
      resetProfile: () => set({ profile: null }),
    }),
    {
      name: 'folga-certa-profile',
      version: STORE_VERSION,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persistedState: any, version: number) => {
        if (version < STORE_VERSION) {
          return {
            profile: null,
            _version: STORE_VERSION,
          };
        }
        return persistedState;
      },
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          AsyncStorage.removeItem('folga-certa-profile');
        }
      },
    }
  )
);

export const useProfile = () => useProfileStore((state) => state.profile);
export const useSetProfile = () => useProfileStore((state) => state.setProfile);
export const useResetProfile = () => useProfileStore((state) => state.resetProfile);
