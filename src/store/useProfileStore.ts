import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { EmploymentProfile } from '../types';

type ProfileState = {
  profile: EmploymentProfile | null;
  setProfile: (partial: Partial<EmploymentProfile>) => void;
  resetProfile: () => void;
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
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
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const useProfile = () => useProfileStore((state) => state.profile);
export const useSetProfile = () => useProfileStore((state) => state.setProfile);
export const useResetProfile = () => useProfileStore((state) => state.resetProfile);
