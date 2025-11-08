# Cálculo de Férias - Folga Certa

## Premissas Jurídicas (CLT)

### 1. Direito a Férias
- 30 dias após 12 meses de trabalho (período aquisitivo)
- Pagamento deve ser feito **até 2 dias antes** do início das férias (Art. 145 CLT)

### 2. Adicional de 1/3
- Terço constitucional incide sobre a remuneração de férias
- Aplicado tanto para dias gozados quanto vendidos

### 3. Venda de Férias (Abono Pecuniário)
- Pode vender até **1/3 dos dias** (máximo 10 dias de 30)
- Incide 1/3 também sobre os dias vendidos

### 4. Adiantamento de 13º
- Pode receber **50% do 13º salário** junto com as férias
- Primeira parcela não tem desconto de INSS/IRRF (somente a segunda parcela em dezembro)

## Fórmulas Implementadas

### 1. Remuneração Base
```typescript
remuneracaoBase = baseSalary + (variablePayAverage || 0)
```
Inclui salário base + média de variáveis (comissões, horas extras, etc.)

### 2. Valor Diário
```typescript
valorDia = remuneracaoBase / 30
```
CLT considera 30 dias para cálculo

### 3. Férias Gozadas
```typescript
feriasGozadasBruto = valorDia * vacationDays
tercoConstitucionalGozado = feriasGozadasBruto / 3
```

### 4. Abono Pecuniário (Venda de Dias)
```typescript
abonoPecuniarioBruto = valorDia * soldDays
tercoConstitucionalAbono = abonoPecuniarioBruto / 3
```

### 5. Total Bruto de Férias
```typescript
totalFeriasBruto = 
  feriasGozadasBruto +
  tercoConstitucionalGozado +
  abonoPecuniarioBruto +
  tercoConstitucionalAbono
```

## Tributação

### 1. Base de Cálculo INSS
```typescript
baseInssFerias = 
  feriasGozadasBruto +
  tercoConstitucionalGozado +
  abonoPecuniarioBruto +
  tercoConstitucionalAbono
```

Tabela progressiva INSS 2024:
- Até R$ 1.412,00: 7,5%
- R$ 1.412,01 a R$ 2.666,68: 9%
- R$ 2.666,69 a R$ 4.000,03: 12%
- R$ 4.000,04 a R$ 7.786,02: 14%

### 2. Base de Cálculo IRRF
```typescript
baseIrrfFerias = 
  feriasGozadasBruto +
  tercoConstitucionalGozado +
  (irTributaAbono ? abonoPecuniarioBruto + tercoConstitucionalAbono : 0)
```

**Nota**: Entendimento atual da PGFN é que abono pecuniário (até 1/3) **não incide IR**.
Implementamos como configurável (`irTributaAbono = false` por padrão).

Tabela progressiva IRRF 2024:
- Até R$ 2.259,20: Isento
- R$ 2.259,21 a R$ 2.826,65: 7,5% - R$ 169,44
- R$ 2.826,66 a R$ 3.751,05: 15% - R$ 381,44
- R$ 3.751,06 a R$ 4.664,68: 22,5% - R$ 662,77
- Acima de R$ 4.664,68: 27,5% - R$ 896,00

### 3. Cálculo do IRRF
```typescript
baseCalculoIRRF = baseIrrfFerias - descontoInssFerias
descontoIrrfFerias = aplicaTabelaIRRF(baseCalculoIRRF)
```

### 4. Valor Líquido das Férias
```typescript
liquidoFerias = 
  totalFeriasBruto +
  advance13thValue -
  descontoInssFerias -
  descontoIrrfFerias
```

**Importante**: Adiantamento de 13º (1ª parcela) **não tem desconto** de INSS/IRRF no momento do pagamento.

## Timeline de Pagamentos

A timeline agora considera **o dia específico de pagamento do salário** (configurado no perfil).

### Lógica de Pagamentos

#### Caso 1: Sai de férias DEPOIS do dia de pagamento
Exemplo: Recebe dia 5, sai de férias dia 10

1. **Salário do mês anterior** (dia 5)
   - Valor: Salário completo
   - Você ainda está trabalhando

2. **Pagamento de férias** (dia 8 - 2 dias antes do dia 10)
   - Valor: Férias + 1/3 + vendas + 13º
   - Pago até 2 dias antes do início

3. **Início das férias** (dia 10)
   - Marco informativo

4. **Fim das férias** 
   - Marco informativo

5. **Salário proporcional ou completo**
   - Depende de quando você volta em relação ao dia de pagamento

#### Caso 2: Sai de férias ANTES do dia de pagamento
Exemplo: Recebe dia 10, sai de férias dia 5

1. **Pagamento de férias** (dia 3 - 2 dias antes do dia 5)
   - Valor: Férias + 1/3 + vendas + 13º
   - Pago até 2 dias antes do início

2. **Início das férias** (dia 5)
   - Marco informativo

3. **Salário proporcional do mês das férias** (dia 10)
   - Valor: Proporcional aos dias trabalhados antes de sair (dias 1 a 4)
   - Calculado: (salário / 30) × dias_trabalhados

4. **Fim das férias**
   - Marco informativo

5. **Próximo salário**
   - Completo ou proporcional dependendo da data de retorno

### Cálculo do Próximo Salário Após Retorno

**Se voltar ANTES do dia de pagamento:**
- Recebe proporcional aos dias trabalhados após retornar
- Exemplo: Volta dia 5, recebe dia 10 → 5 dias trabalhados

**Se voltar DEPOIS do dia de pagamento:**
- Próximo pagamento será o salário completo do mês seguinte
- Exemplo: Volta dia 15, recebe dia 10 → salário completo só no dia 10 do mês seguinte

## Observações Importantes

1. **Dia de Pagamento Configurável**: O usuário informa no onboarding que dia do mês recebe o salário
2. **Datas Corretas**: Início das férias é a data exata informada (não subtrai 1 dia)
3. **Fim das Férias**: Calculado como `início + dias - 1` (30 dias = início dia 1, fim dia 30)
4. **Salários Proporcionais**: Sistema calcula automaticamente se há dias trabalhados antes/depois das férias no mesmo mês de pagamento
5. **Configurabilidade**: Tabelas de INSS/IRRF são parametrizadas e podem ser atualizadas
6. **Aproximação**: Valores são estimados e podem variar conforme:
   - Acordos coletivos
   - Convenções sindicais
   - Particularidades do contrato
   - Mudanças na legislação

## Referências Legais

- Art. 145 CLT - Pagamento de férias
- Art. 143 CLT - Abono pecuniário
- IN SRF 15/2001 - Tributação de férias
- Entendimento PGFN - Não incidência de IR sobre abono
- Tabelas INSS e IRRF vigentes em 2024

