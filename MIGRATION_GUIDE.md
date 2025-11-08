# Guia de Migração - Otimizações de Performance

## ⚡ Mudanças nos Imports

### Antes (❌ Deprecated)

```typescript
import { useProfileStore, useSimulationStore } from '../../store';

// No componente:
const { profile, setProfile } = useProfileStore();
const { simulations, addSimulation } = useSimulationStore();
```

### Agora (✅ Recomendado)

```typescript
import { useProfile, useSetProfile } from '../../store/useProfileStore';
import { useSimulations, useAddSimulation } from '../../store/useSimulationStore';

// No componente:
const profile = useProfile();
const setProfile = useSetProfile();
const simulations = useSimulations();
const addSimulation = useAddSimulation();
```

---

## 📝 Exemplos de Migração

### Exemplo 1: Step1Screen

**Antes:**
```typescript
const { profile, setProfile } = useProfileStore();
```

**Depois:**
```typescript
import { useProfile, useSetProfile } from '../../store/useProfileStore';

const profile = useProfile();
const setProfile = useSetProfile();
```

### Exemplo 2: HomeScreen

**Antes:**
```typescript
const { profile } = useProfileStore();
const { simulations } = useSimulationStore();
```

**Depois:**
```typescript
import { useProfile } from '../../store/useProfileStore';
import { useSimulations } from '../../store/useSimulationStore';

const profile = useProfile();
const simulations = useSimulations();
```

### Exemplo 3: SimulationScreen

**Antes:**
```typescript
const { profile } = useProfileStore();
const { addSimulation } = useSimulationStore();
```

**Depois:**
```typescript
import { useProfile } from '../../store/useProfileStore';
import { useAddSimulation } from '../../store/useSimulationStore';

const profile = useProfile();
const addSimulation = useAddSimulation();
```

---

## ✅ Checklist de Arquivos para Atualizar

- [ ] `src/screens/Onboarding/Step1.tsx`
- [ ] `src/screens/Onboarding/Step2.tsx`
- [ ] `src/screens/Onboarding/Step3.tsx`
- [ ] `src/screens/Home/index.tsx`
- [ ] `src/screens/Simulation/index.tsx`
- [ ] `src/screens/Profile/index.tsx`

---

## 🎯 Hooks Disponíveis

### useProfileStore

```typescript
import {
  useProfile,        // Retorna: EmploymentProfile | null
  useSetProfile,     // Retorna: (partial: Partial<EmploymentProfile>) => void
  useResetProfile,   // Retorna: () => void
} from '../../store/useProfileStore';
```

### useSimulationStore

```typescript
import {
  useSimulations,       // Retorna: VacationSimulation[]
  useAddSimulation,     // Retorna: (simulation: SimulationInput) => void
  useClearSimulations,  // Retorna: () => void
} from '../../store/useSimulationStore';
```

---

## ⚠️ IMPORTANTE

A forma antiga ainda funciona, mas causa **re-renders desnecessários**.

**Use sempre os hooks específicos para performance máxima!**

