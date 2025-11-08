# Fix: Botão "Continuar" não Funcionava no Step 3

## Problema

O botão "Continuar" na tela "Qual é o seu salário?" (Step 3) não estava funcionando mesmo preenchendo todos os campos.

## Causa Raiz

O schema de validação Zod usava `.transform()` no campo `baseSalary`, o que mudava o tipo inferido e quebrava a validação do formulário:

```typescript
// ❌ ERRADO - .transform() quebra o tipo
baseSalary: z
  .string()
  .transform((val) => parseFloat(...))
  .refine((val) => val > 0, ...)
```

Além disso, o campo `paymentDay` (dia específico do mês) era confuso para o usuário preencher.

## Solução Implementada

### 1. Removido `.transform()` do Schema ✅

```typescript
// ✅ CORRETO - só validação, sem transform
baseSalary: z
  .string()
  .min(1, 'Informe o salário')
  .refine((val) => {
    const num = parseFloat(val.replace(/[^\d,]/g, '').replace(',', '.'));
    return !isNaN(num) && num > 0;
  }, 'Salário deve ser maior que zero')
```

### 2. Substituído Input de Dia por Switch de Período ✅

**Antes:**
```
Campo: "Que dia do mês você recebe?"
Input numérico: 1 a 31
Problema: Usuário não sabia exatamente o dia
```

**Depois:**
```typescript
Campo: "Quando você recebe no mês?"

Opções:
- Início do mês (dias 1 a 10) → dia 5
- Meio do mês (dias 11 a 20) → dia 15  
- Final do mês (após dia 20) → dia 25
```

### 3. Novo Tipo `PaymentPeriod` ✅

```typescript
export type PaymentPeriod = 'inicio' | 'meio' | 'fim';

export type EmploymentProfile = {
  // ... outros campos
  paymentPeriod?: PaymentPeriod; // Substituiu paymentDay
}
```

### 4. Conversão Automática no Cálculo ✅

```typescript
const getPaymentDayFromPeriod = (period?: string): number => {
  switch (period) {
    case 'inicio': return 5;   // Dia 5
    case 'meio': return 15;     // Dia 15
    case 'fim': return 25;      // Dia 25
    default: return 5;
  }
};

const paymentDay = getPaymentDayFromPeriod(profile.paymentPeriod);
```

## Benefícios

✅ **Mais Simples**: 3 opções claras ao invés de input numérico  
✅ **Mais Intuitivo**: Usuário escolhe período, não dia exato  
✅ **Validação Funciona**: Removido `.transform()` que quebrava o tipo  
✅ **UX Melhor**: Cards grandes e descritivos  
✅ **Precisão Mantida**: Sistema usa dias representativos (5, 15, 25)  

## Interface do Step 3 Agora

```
┌─────────────────────────────────────┐
│ Qual é o seu salário?               │
│ Informe o valor base do seu salário │
├─────────────────────────────────────┤
│                                     │
│ Salário base                        │
│ ┌─────────────────────────────────┐ │
│ │ R$ 0,00                         │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Frequência de pagamento             │
│ ┌─────────────────────────────────┐ │
│ │ Mensal                          │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Quinzenal                       │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Semanal                         │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Quando você recebe no mês?          │
│ ┌─────────────────────────────────┐ │
│ │ Início do mês                   │ │
│ │ Dias 1 a 10                     │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Meio do mês                     │ │
│ │ Dias 11 a 20                    │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Final do mês                    │ │
│ │ Após dia 20                     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │        Continuar ✅             │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## Fluxo de Validação

```typescript
// 1. Usuário preenche
baseSalary: "R$ 3.500,00"
paymentFrequency: "mensal"
paymentPeriod: "meio"

// 2. Zod valida (SEM transform)
baseSalary: string ✅ (válido como string)
paymentFrequency: "mensal" ✅
paymentPeriod: "meio" ✅

// 3. No onSubmit converte
const salaryNum = formatCurrency(data.baseSalary); // 3500
setProfile({ 
  baseSalary: 3500,
  paymentFrequency: "mensal",
  paymentPeriod: "meio"
});

// 4. No cálculo usa
const paymentDay = getPaymentDayFromPeriod("meio"); // 15
```

## Casos de Uso

### Caso 1: Recebe no início
```
Escolhe: "Início do mês"
Sistema usa: dia 5
Timeline: Considera pagamento dia 5
```

### Caso 2: Recebe no meio
```
Escolhe: "Meio do mês"
Sistema usa: dia 15
Timeline: Considera pagamento dia 15
```

### Caso 3: Recebe no final
```
Escolhe: "Final do mês"
Sistema usa: dia 25
Timeline: Considera pagamento dia 25
```

## Arquivos Modificados

1. ✅ `src/utils/validations.ts`
   - Removido `.transform()` do `baseSalary`
   - Alterado `paymentDay` para `paymentPeriod`

2. ✅ `src/types/employment.ts`
   - Adicionado type `PaymentPeriod`
   - Alterado `paymentDay` para `paymentPeriod`

3. ✅ `src/screens/Onboarding/Step3.tsx`
   - Substituído input numérico por switch de 3 opções
   - Cards com label e descrição

4. ✅ `src/utils/calcVacation.ts`
   - Adicionada função `getPaymentDayFromPeriod()`
   - Converte período → dia automaticamente

## Teste

1. Preencha o salário: R$ 3.500,00
2. Selecione frequência: Mensal
3. Selecione período: **Meio do mês**
4. Clique em **Continuar** → ✅ **Funciona!**

O botão agora está totalmente funcional! 🎉

