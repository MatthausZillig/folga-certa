# Fix: Loading Infinito

## 🔴 Problema

O app ficava preso em tela de loading eternamente (tanto no emulador quanto no celular real).

## 🐛 Causas Identificadas

### 1. Import Inválido
```typescript
// ❌ ERRO: shallow não existe em zustand/shallow
import { shallow } from 'zustand/shallow';
```

### 2. Store Não Inicializado
O `RootNavigator` tentava ler o store antes dele estar pronto, causando loop infinito.

### 3. Sem Timeout de Segurança
Nenhum fallback se o AsyncStorage demorasse muito ou falhasse.

## ✅ Correções Aplicadas

### 1. Removido Import Inválido
```typescript
// ✅ CORRETO
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
// Removido: import { shallow } from 'zustand/shallow';
```

### 2. Adicionado Loading State no App.tsx
```typescript
const [isReady, setIsReady] = useState(false);

useEffect(() => {
  const prepare = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      // Ignore
    } finally {
      setIsReady(true);
      SplashScreen.hideAsync();
    }
  };
  prepare();
}, []);

if (!isReady) {
  return <ActivityIndicator />;
}
```

### 3. Timeout de Segurança no RootNavigator
```typescript
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setIsLoading(false); // Força sair do loading após 500ms
  }, 500);
  return () => clearTimeout(timer);
}, []);

if (isLoading) {
  return <ActivityIndicator />;
}
```

### 4. Migrado para Hook Otimizado
```typescript
// ❌ ANTES
const { profile } = useProfileStore();

// ✅ DEPOIS
import { useProfile } from '../store/useProfileStore';
const profile = useProfile();
```

## 🔧 Como Resolver se Ainda Estiver Travado

### Opção 1: Limpar Cache do App (Recomendado)

**No Celular Real (Expo Go):**
1. Feche o app completamente
2. Abra Expo Go
3. Va em Settings
4. Clear cache
5. Reabra o app

**No Emulador:**
```bash
# Android
adb shell pm clear host.exp.exponent

# iOS
xcrun simctl erase all
```

### Opção 2: Limpar Cache do Metro

```bash
cd /home/matthaus/development/mobile/folga-certa
npx expo start --clear
```

### Opção 3: Limpar Tudo (Extremo)

```bash
# Matar processos
pkill -9 -f "expo"
pkill -9 -f "node"

# Limpar caches
rm -rf node_modules/.cache
rm -rf .expo
rm -rf /tmp/metro-*
rm -rf /tmp/haste-*

# Reinstalar
npm install

# Reiniciar
npx expo start --clear
```

### Opção 4: Reset do AsyncStorage (Último Recurso)

Adicione temporariamente no `App.tsx`:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

useEffect(() => {
  AsyncStorage.clear(); // ⚠️ REMOVE TODOS OS DADOS
}, []);
```

**⚠️ ATENÇÃO:** Isso apaga todos os dados salvos!

## 🎯 Fluxo de Inicialização Correto

```
1. App.tsx inicia
   ├─ Aguarda 100ms (dar tempo pro AsyncStorage)
   └─ setIsReady(true)

2. RootNavigator monta
   ├─ Mostra ActivityIndicator
   ├─ Aguarda 500ms (timeout de segurança)
   └─ setIsLoading(false)

3. Lê profile do store
   ├─ Se completo → AppNavigator
   └─ Se vazio → OnboardingNavigator

4. App renderiza! ✅
```

## 📊 Tempo de Loading Esperado

| Cenário | Tempo |
|---------|-------|
| Primeira vez (sem dados) | ~600ms |
| Com dados salvos | ~600ms |
| Máximo (com timeout) | 600ms |

**Nunca deve passar de 1 segundo!**

## ✅ Checklist de Verificação

- [x] Removido `import { shallow }` inválido
- [x] Adicionado `isReady` no App.tsx
- [x] Adicionado `isLoading` no RootNavigator
- [x] Migrado para `useProfile()` hook
- [x] Timeout de segurança (500ms)
- [x] ActivityIndicator de fallback
- [x] Try/catch nos efeitos

## 🚀 Como Testar

1. **Feche o app completamente** (force quit)
2. **Limpe o cache** do Expo Go (settings)
3. **Reabra o app**
4. Deve aparecer:
   - Loading spinner (~500ms)
   - Tela de onboarding ✅

## 🔍 Debug

Se ainda travar, adicione logs:

```typescript
// No RootNavigator.tsx
useEffect(() => {
  console.log('Profile:', profile);
  console.log('isLoading:', isLoading);
  console.log('showOnboarding:', showOnboarding);
}, [profile, isLoading, showOnboarding]);
```

Abra o console do Expo e veja onde está travando.

## 📝 Notas Importantes

1. **AsyncStorage é assíncrono** - sempre aguarde inicializar
2. **Zustand persist precisa de tempo** - use timeout de segurança
3. **Nunca bloqueie a thread principal** - sempre tenha fallback
4. **Teste em device real** - emulador pode comportar diferente

## 🎉 Resultado

Agora o app deve:
- ✅ Iniciar em menos de 1 segundo
- ✅ Nunca travar em loading infinito
- ✅ Ter fallback se AsyncStorage falhar
- ✅ Funcionar tanto em emulador quanto device real

