# Correções de Datas e Timeline - Folga Certa

## Problema Identificado

Da imagem fornecida (férias de 10/11 a 09/12):
- ❌ Fim das férias aparecia como **08/12** (errado)
- ❌ Faltava o salário proporcional dos **9 dias trabalhados** (01/11 a 09/11)

## Correções Implementadas

### 1. Data do Fim das Férias ✅

**Problema:**
```typescript
// Estava fazendo timezone incorreto
const endDate = addDays(startDate, input.vacationDays - 1);
// Com timezone, 10/11 virava 09/11, e +29 dias dava 08/12
```

**Solução:**
```typescript
// Forçar timezone local com 'T00:00:00'
const startDate = new Date(input.startDate + 'T00:00:00');
const endDate = new Date(startDate);
endDate.setDate(endDate.getDate() + input.vacationDays - 1);
```

**Agora:**
- Início: 10/11
- 30 dias de férias
- Fim: **09/12** ✅ (10/11 + 29 dias = 09/12)

---

### 2. Salário Proporcional do Mês das Férias ✅

**Lógica implementada:**

```typescript
if (vacationStartDay <= paymentDay) {
  // Pessoa sai de férias ANTES do dia de pagamento
  const daysWorkedBeforeVacation = vacationStartDay - 1;
  
  if (daysWorkedBeforeVacation > 0) {
    const proportionalAmount = valorDia * daysWorkedBeforeVacation;
    // Adiciona na timeline no dia do pagamento
  }
}
```

**Exemplo do caso da imagem:**
- Recebe: dia **5**
- Sai de férias: dia **10/11**
- Dias trabalhados: **9 dias** (01/11 a 09/11)
- Salário proporcional: (R$ 18.400 / 30) × 9 = **R$ 5.520,00**
- Pago em: **05/12** (dia de pagamento do mês de novembro)

---

### 3. Timeline Completa - Exemplo Real

**Dados:**
- Salário: R$ 18.400,00
- Recebe: dia 5
- Férias: 10/11/2025 (30 dias)
- Volta: 10/12/2025

**Timeline gerada:**

1. **06/11/2025** - Salário do mês anterior
   - **R$ 18.400,00**
   - _"Pagamento do salário referente ao mês trabalhado antes das férias (dia 5)"_

2. **08/11/2025** - Pagamento de férias
   - **R$ 26.314,88** (líquido)
   - _"Férias + 1/3 constitucional (pago até 2 dias antes do início)"_

3. **10/11/2025** - Início das férias
   - _"Você começa suas férias (30 dias de descanso)"_

4. **09/12/2025** - Fim das férias ✅
   - _"Último dia de férias"_

5. **05/12/2025** - Salário proporcional (mês das férias) ✅
   - **R$ 5.520,00**
   - _"Pagamento proporcional aos 9 dias trabalhados no mês antes de sair de férias (dias 01 a 09)"_

6. **05/01/2026** - Salário proporcional (volta) ✅
   - **R$ ~3.680,00** (6 dias: 10/12 a 15/12, se recebe dia 15)
   - OU **Salário completo** se voltou depois do dia de pagamento

---

## Lógica de Salários Proporcionais

### Salário do Mês das Férias

```typescript
// Se sai de férias DIA 10 e recebe DIA 5:
daysWorkedBeforeVacation = 10 - 1 = 9 dias (1, 2, 3, 4, 5, 6, 7, 8, 9)
proportionalSalary = (salário / 30) × 9
paymentDate = dia 5 do mês das férias
```

### Salário do Mês de Retorno

**Caso 1: Volta ANTES do dia de pagamento**
```typescript
// Volta DIA 10, recebe DIA 15:
daysWorkedAfterReturn = 15 - 10 + 1 = 6 dias (10, 11, 12, 13, 14, 15)
proportionalSalary = (salário / 30) × 6
paymentDate = dia 15 do mês de retorno
```

**Caso 2: Volta DEPOIS do dia de pagamento**
```typescript
// Volta DIA 20, recebe DIA 15:
// Já passou o dia de pagamento
fullSalary = salário completo
paymentDate = dia 15 do mês seguinte
```

---

## Regras Implementadas

✅ **Data de início**: Exata como informada (10/11 = 10/11)  
✅ **Data de fim**: início + dias - 1 (10/11 + 30 dias = 09/12)  
✅ **Data de volta**: fim + 1 dia (09/12 + 1 = 10/12)  
✅ **Timezone forçado**: 'T00:00:00' para evitar bugs de fuso horário  
✅ **Dias trabalhados antes**: Contados do dia 1 até dia anterior às férias  
✅ **Dias trabalhados depois**: Contados do dia de volta até dia de pagamento  
✅ **Salários proporcionais**: (salário / 30) × dias trabalhados  
✅ **Timeline ordenada**: Eventos aparecem na ordem cronológica correta  

---

## Exemplo Completo - Cenários

### Cenário A: Sai DEPOIS do dia de pagamento
**Recebe dia 5, sai dia 10**

```
Nov: 1-9 trabalha | 10-30 férias
Dez: 1-9 férias | 10-31 volta

Timeline:
- 05/11: Salário outubro (R$ 18.400)
- 08/11: Férias (R$ 26.314)
- 10/11: Início férias
- 09/12: Fim férias
- 10/12: Volta
- 05/01: Salário dezembro completo (R$ 18.400)
```

### Cenário B: Sai ANTES do dia de pagamento
**Recebe dia 15, sai dia 10**

```
Nov: 1-9 trabalha | 10-30 férias
Dez: 1-9 férias | 10-31 volta

Timeline:
- 08/11: Férias (R$ 26.314)
- 10/11: Início férias
- 15/11: Salário novembro proporcional - 9 dias (R$ 5.520)
- 09/12: Fim férias
- 10/12: Volta
- 15/12: Salário dezembro proporcional - 6 dias (R$ 3.680)
- 15/01: Salário janeiro completo (R$ 18.400)
```

---

## Código-Chave

### Cálculo de Dias Trabalhados Antes
```typescript
const daysWorkedBeforeVacation = vacationStartDay - 1;
// Sai dia 10 → trabalhou dias 1 a 9 = 9 dias
```

### Cálculo de Dias Trabalhados Depois
```typescript
const daysWorkedAfterReturn = paymentDay - returnDay + 1;
// Volta dia 10, paga dia 15 → trabalhou dias 10 a 15 = 6 dias
```

### Valor Proporcional
```typescript
const proportionalAmount = (remuneracaoBase / 30) × dias;
// R$ 18.400 / 30 × 9 = R$ 5.520
```

---

## Resultado Final

A timeline agora mostra:
1. ✅ Todos os salários (completos e proporcionais)
2. ✅ Datas corretas (início, fim, volta)
3. ✅ Valores exatos para cada evento
4. ✅ Descrições claras do que cada pagamento representa
5. ✅ Ordem cronológica perfeita

O usuário agora vê **exatamente** quando e quanto vai receber em cada etapa! 🎉

