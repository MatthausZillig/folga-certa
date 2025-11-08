# Fix: value.replace is not a function (it is undefined)

## 🐛 Problema

```
ERROR [TypeError: value.replace is not a function (it is undefined)]
```

Este erro ocorria ao abrir a tela de Profile pela primeira vez.

---

## 🔍 Causa Raiz

### Problema 1: Função Errada

Estávamos usando `formatCurrency()` que tem a **assinatura errada**:

```typescript
// src/utils/masks.ts
export const formatCurrency = (value: string): number => {
  const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};
```

- ❌ **Entrada:** `string`
- ❌ **Saída:** `number`

Mas precisávamos:
- ✅ **Entrada:** `number`
- ✅ **Saída:** `string` (para exibição)

### Problema 2: defaultValues Incorretos

No formulário, estávamos tentando usar essa função para converter `number → string`:

```typescript
// ❌ ERRADO
defaultValues: {
  baseSalary: profile?.baseSalary ? formatCurrency(profile.baseSalary) : '',
  // profile.baseSalary é number
  // formatCurrency espera string
  // retorna number, mas precisamos de string
}
```

**Resultado:** 
- `formatCurrency(3000)` → tentava fazer `(3000).replace()` → **ERRO!**

### Problema 3: Validação sem Proteção

```typescript
// ❌ ERRADO
.refine((val) => {
  const num = parseFloat(val.replace(/[^\d,]/g, '').replace(',', '.'));
  // Se val for undefined → val.replace() → ERRO!
})
```

---

## ✅ Solução

### 1. Funções Helper Criadas

Criamos funções específicas para conversão entre `number` e `string`:

```typescript
// Converte number → string para input
const formatNumberToInput = (value: number | undefined): string => {
  if (!value) return '';
  return value.toString().replace('.', ',');
};

// Converte string → number do input
const parseInputToNumber = (value: string): number => {
  const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};
```

### 2. Corrigidos defaultValues

```typescript
// ✅ CORRETO
defaultValues: {
  displayName: profile?.displayName || '',
  admissionDate: profile?.admissionDate || '',
  contractType: profile?.contractType || 'indeterminado',
  baseSalary: formatNumberToInput(profile?.baseSalary),  // ✅ number → string
  paymentFrequency: profile?.paymentFrequency || 'mensal',
  paymentPeriod: profile?.paymentPeriod || 'inicio',
  hasVariablePay: profile?.hasVariablePay || false,
  variablePayAverage: formatNumberToInput(profile?.variablePayAverage),  // ✅ number → string
}
```

### 3. Corrigido onSubmit

```typescript
// ✅ CORRETO
const onSubmit = (data: ProfileFormData) => {
  const baseSalaryNum = parseInputToNumber(data.baseSalary);  // ✅ string → number
  const variablePayAverageNum =
    data.hasVariablePay && data.variablePayAverage
      ? parseInputToNumber(data.variablePayAverage)  // ✅ string → number
      : undefined;
  
  setProfile({
    baseSalary: baseSalaryNum,  // ✅ Salva como number
    variablePayAverage: variablePayAverageNum,
    // ...
  });
};
```

### 4. Adicionada Proteção na Validação

```typescript
// ✅ CORRETO
baseSalary: z
  .string()
  .min(1, 'Informe o salário')
  .refine((val) => {
    if (!val) return false;  // ✅ Proteção contra undefined
    const num = parseFloat(val.replace(/[^\d,]/g, '').replace(',', '.'));
    return !isNaN(num) && num > 0;
  }, 'Salário deve ser maior que zero'),
```

### 5. Corrigida Exibição de Valores

Trocamos `formatCurrency` por `formatCurrencyBR` para exibição:

```typescript
// ✅ CORRETO - Para exibição (número → moeda formatada)
import { formatCurrencyBR } from '../../utils';

// Modo leitura
<Text>
  Salário base: {formatCurrencyBR(profile.baseSalary || 0)}
</Text>
// Exibe: "R$ 3.000,00"
```

---

## 🔄 Fluxo Corrigido

### Carregar Perfil (Modo Leitura)

```
1. profile.baseSalary = 3000 (number)
   ↓
2. formatCurrencyBR(3000)
   ↓
3. "R$ 3.000,00" (string)
   ↓
4. Exibe na UI ✅
```

### Editar Perfil (Carregar Formulário)

```
1. profile.baseSalary = 3000 (number)
   ↓
2. formatNumberToInput(3000)
   ↓
3. "3000" → replace('.', ',') → "3000"
   ↓
4. defaultValues.baseSalary = "3000" (string)
   ↓
5. Input recebe string ✅
```

### Salvar Perfil

```
1. Input value = "3000" (string)
   ↓
2. parseInputToNumber("3000")
   ↓
3. replace(/[^\d,]/g, '') → "3000"
   ↓
4. replace(',', '.') → "3000"
   ↓
5. parseFloat("3000") → 3000 (number)
   ↓
6. setProfile({ baseSalary: 3000 }) ✅
```

---

## 📊 Antes vs Depois

### Antes ❌

```typescript
// Import errado
import { formatCurrency } from '../../utils';

// defaultValues errado
baseSalary: profile?.baseSalary ? formatCurrency(profile.baseSalary) : '',
// Tentava: formatCurrency(3000) → (3000).replace() → ERRO!

// onSubmit complexo
const baseSalaryNum = parseFloat(data.baseSalary.replace(/[^\d,]/g, '').replace(',', '.'));

// Validação sem proteção
.refine((val) => {
  const num = parseFloat(val.replace(...));  // val pode ser undefined
})

// Exibição incorreta
{formatCurrency(profile.baseSalary || 0)}  // Retorna number, não string formatada
```

### Depois ✅

```typescript
// Import correto
import { formatCurrencyBR } from '../../utils';

// Helper functions
const formatNumberToInput = (value: number | undefined): string => {
  if (!value) return '';
  return value.toString().replace('.', ',');
};

const parseInputToNumber = (value: string): number => {
  const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};

// defaultValues correto
baseSalary: formatNumberToInput(profile?.baseSalary),
// Converte: 3000 → "3000" ✅

// onSubmit limpo
const baseSalaryNum = parseInputToNumber(data.baseSalary);
// Converte: "3000" → 3000 ✅

// Validação com proteção
.refine((val) => {
  if (!val) return false;  // ✅ Proteção
  const num = parseFloat(val.replace(...));
})

// Exibição correta
{formatCurrencyBR(profile.baseSalary || 0)}
// Exibe: "R$ 3.000,00" ✅
```

---

## 🎯 Funções Corretas para Cada Caso

### 1. Exibir Valor Monetário

```typescript
// Use: formatCurrencyBR
import { formatCurrencyBR } from '../../utils';

<Text>
  {formatCurrencyBR(profile.baseSalary || 0)}
</Text>
// Output: "R$ 3.000,00"
```

### 2. Converter Number → String (para Input)

```typescript
// Use: formatNumberToInput
const formatNumberToInput = (value: number | undefined): string => {
  if (!value) return '';
  return value.toString().replace('.', ',');
};

defaultValues: {
  baseSalary: formatNumberToInput(profile?.baseSalary)
}
// Input: 3000 → Output: "3000"
```

### 3. Converter String → Number (do Input)

```typescript
// Use: parseInputToNumber
const parseInputToNumber = (value: string): number => {
  const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};

const baseSalaryNum = parseInputToNumber(data.baseSalary);
// Input: "3.000,50" → Output: 3000.5
```

---

## 🛡️ Proteções Implementadas

### 1. Proteção contra Undefined

```typescript
const formatNumberToInput = (value: number | undefined): string => {
  if (!value) return '';  // ✅ Retorna string vazia se undefined
  return value.toString().replace('.', ',');
};
```

### 2. Proteção na Validação

```typescript
.refine((val) => {
  if (!val) return false;  // ✅ Valida que existe valor
  const num = parseFloat(val.replace(/[^\d,]/g, '').replace(',', '.'));
  return !isNaN(num) && num > 0;
})
```

### 3. Fallback em Parsing

```typescript
const parseInputToNumber = (value: string): number => {
  const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;  // ✅ Retorna 0 se parseFloat falhar
};
```

---

## 📝 Arquivos Modificados

### src/screens/Profile/index.tsx

1. ✅ Importado `formatCurrencyBR` ao invés de `formatCurrency`
2. ✅ Criadas funções helper: `formatNumberToInput` e `parseInputToNumber`
3. ✅ Corrigidos `defaultValues` no `useForm`
4. ✅ Corrigido `onSubmit` para usar `parseInputToNumber`
5. ✅ Adicionada proteção no schema de validação
6. ✅ Trocados todos `formatCurrency()` por `formatCurrencyBR()` na exibição

---

## ✅ Checklist de Correções

- [x] Importar função correta (`formatCurrencyBR`)
- [x] Criar `formatNumberToInput()` helper
- [x] Criar `parseInputToNumber()` helper
- [x] Corrigir `defaultValues` do formulário
- [x] Corrigir `onSubmit` parsing
- [x] Adicionar proteção na validação
- [x] Corrigir exibição de valores monetários
- [x] Testar com perfil existente
- [x] Testar sem perfil (primeira vez)

---

## 🎉 Resultado

### Antes ❌
```
- Erro ao abrir tela de Profile
- "value.replace is not a function"
- App crashava
```

### Depois ✅
```
- Tela de Profile abre normalmente
- Valores carregados corretamente
- Edição funciona perfeitamente
- Validação com proteção
- Nenhum erro ✅
```

---

## 🔮 Lições Aprendidas

### 1. Tipos Importam

Sempre verificar:
- ✅ Qual tipo a função **espera** (parâmetros)
- ✅ Qual tipo a função **retorna**
- ✅ Se os tipos são compatíveis com o uso

### 2. Naming é Importante

```typescript
// ❌ Nome ambíguo
formatCurrency(value: string): number

// ✅ Nomes claros
formatCurrencyBR(value: number): string  // Para exibição
parseInputToNumber(value: string): number  // Para parsing
formatNumberToInput(value: number): string  // Para input
```

### 3. Sempre Proteger contra Undefined

```typescript
// ✅ BOM
if (!value) return '';
if (!val) return false;
return parseFloat(cleaned) || 0;
```

---

## 🚀 App Funcionando Perfeitamente!

Tela de Profile agora:
- ✅ Abre sem erros
- ✅ Exibe valores corretamente
- ✅ Permite edição
- ✅ Valida dados
- ✅ Salva corretamente

Problema resolvido! 🎊

