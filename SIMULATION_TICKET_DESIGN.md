# Novo Design: Simulation Ticket

## 🎨 Inspiração

Baseado no design de tickets de viagem (como passagens aéreas), criamos um card visual e moderno para as simulações de férias.

## ✨ Características do Design

### 1. **Layout de Ticket**
```
┌─────────────────────────────────────┐
│ FÉRIAS                      + 13º   │
│ 30 dias                             │
│                                     │
│ 10 Mar  ─────●─────  09 Abr        │
│ INÍCIO                    RETORNO   │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─│
│ VALOR LÍQUIDO         Refundable   │
│ R$ 26.314,88                        │
└─────────────────────────────────────┘
  ◯                                 ◯
```

### 2. **Elementos Visuais**

#### Seção Superior
- **Label**: "FÉRIAS" em uppercase pequeno
- **Dias**: Grande e bold (30 dias)
- **Badge opcional**: "+13º" quando tem adiantamento

#### Seção de Datas
- **Origem → Destino** estilo ticket
- **Linha conectora** com ponto central
- **Datas formatadas**: "10 Mar" (curto e limpo)
- **Labels**: "INÍCIO" e "RETORNO" em uppercase

#### Divisor
- **Linha tracejada** separando seções
- Visual de "corte" do ticket

#### Seção Inferior (rodapé colorido)
- **Fundo diferenciado** (`$cardAlt`)
- **Valor destacado** em fonte grande
- **Badge "Refundable"** (simulação pode ser refeita)

#### Detalhes do Ticket
- **Semicírculos laterais** (efeito de perfuração)
- **Sombra sutil** para profundidade
- **Bordas arredondadas**

## 🎯 Componente: SimulationTicket

### Props
```typescript
type SimulationTicketProps = {
  vacationDays: number;      // Número de dias
  startDate: string;         // Data início (YYYY-MM-DD)
  endDate: string;           // Data fim (YYYY-MM-DD)
  liquidoFerias: number;     // Valor líquido
  advance13th?: boolean;     // Se tem adiantamento 13º
};
```

### Exemplo de Uso
```typescript
<SimulationTicket
  vacationDays={30}
  startDate="2025-03-10"
  endDate="2025-04-09"
  liquidoFerias={26314.88}
  advance13th={true}
/>
```

## 🎨 Cores do Tema

### Tema Light
- **Card principal**: `$card` (#FFFFFF)
- **Rodapé**: `$cardAlt` (#F8F9FA)
- **Texto principal**: `$text` (#212529)
- **Texto secundário**: `$muted` (#6C757D)
- **Destaque**: `$accent` (#343A40)
- **Bordas**: `$border` (#DEE2E6)

### Tema Dark
- **Card principal**: `$card` (#343A40)
- **Rodapé**: `$cardAlt` (#343A40)
- **Texto principal**: `$text` (#F8F9FA)
- **Texto secundário**: `$muted` (#ADB5BD)
- **Destaque**: `$accent` (#F8F9FA)
- **Bordas**: `$border` (#495057)

## 📱 Responsividade

### Adaptações
- **Sombra**: Funciona em iOS e Android (elevation + shadow)
- **Semicírculos**: Posicionados com absolute
- **Linha tracejada**: Usa `borderStyle: 'dashed'`
- **Flexbox**: Layout responsivo automático

## ✅ Melhorias Implementadas

### HomeScreen Refatorado

#### Antes ❌
```typescript
<XStack
  backgroundColor="$card"
  padding="$4"
  borderRadius="$4"
  borderWidth={1}
  borderColor="$border"
>
  <YStack>
    <Text>30 dias</Text>
    <Text>Início: 10/03/2025</Text>
  </YStack>
  <YStack>
    <Text>R$ 26.314,88</Text>
    <Text>líquido</Text>
  </YStack>
</XStack>
```

#### Depois ✅
```typescript
<SimulationTicket
  vacationDays={30}
  startDate="2025-03-10"
  endDate="2025-04-09"
  liquidoFerias={26314.88}
  advance13th={true}
/>
```

### Novos Recursos

1. **Estado Vazio Melhorado**
   - Emoji grande (🏖️)
   - Texto amigável
   - Card com borda tracejada

2. **Contador de Simulações**
   - "5 simulações" no header
   - "+ 15 simulações antigas" no footer

3. **Hooks Otimizados**
   - `useProfile()` ao invés de `useProfileStore()`
   - `useSimulations()` ao invés de `useSimulationStore()`
   - Melhor performance

4. **Emoji no Botão**
   - "✈️  Simular Férias" mais amigável
   - Emoji de saudação "👋"

## 🎭 Detalhes de Implementação

### Formato de Data
```typescript
const formatDateShort = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-');
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
                  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return `${day} ${months[parseInt(month, 10) - 1]}`;
};

// "2025-03-10" → "10 Mar"
```

### Cálculo de Data de Retorno
```typescript
const getEndDate = (startDate: string, days: number) => {
  const date = new Date(startDate + 'T00:00:00');
  date.setDate(date.getDate() + days - 1);
  return formatDate(date);
};

// Início: 10/03, 30 dias → Fim: 09/04
```

### Semicírculos (Efeito Perfuração)
```typescript
<View 
  position="absolute" 
  left={-8} 
  top="50%" 
  width={16} 
  height={16} 
  borderRadius={8} 
  backgroundColor="$background" 
/>
```

### Ponto Central na Linha
```typescript
<View flex={1} height={1} backgroundColor="$border">
  <View
    position="absolute"
    left="50%"
    top="50%"
    width={6}
    height={6}
    borderRadius={3}
    backgroundColor="$accent"
    transform={[{ translateX: -3 }, { translateY: -3 }]}
  />
</View>
```

## 🚀 Resultado

### Antes
- Card simples e plano
- Informações básicas
- Visual genérico
- Pouco destaque

### Depois
- Design de ticket moderno
- Visual profissional
- Informações organizadas
- Destaque para valores
- Badge de 13º
- Efeitos visuais (sombra, perfuração)
- Estado vazio melhorado
- Contador de simulações

## 📊 Comparação Visual

### Card Antigo
```
┌─────────────────────┐
│ 30 dias             │
│ Início: 10/03       │
│          R$ 26.314  │
│          líquido    │
└─────────────────────┘
```

### Card Novo (Ticket)
```
┌─────────────────────────┐
│ FÉRIAS          + 13º   │
│ 30 dias                 │
│                         │
│ 10 Mar ───●─── 09 Abr  │
│ INÍCIO         RETORNO  │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│ R$ 26.314,88 Refundable│
└─────────────────────────┘
  ◯                     ◯
```

## 🎉 Benefícios

✅ **Visual Profissional**: Parece um app premium  
✅ **Fácil Leitura**: Informações bem organizadas  
✅ **Familiar**: Design conhecido (ticket de viagem)  
✅ **Moderno**: Sombras, bordas, efeitos  
✅ **Consistente**: Usa o theme do app  
✅ **Responsivo**: Funciona em qualquer tela  
✅ **Performático**: Componente leve e otimizado  

O novo design transforma simulações em "tickets de férias" visuais e atrativos! 🎫✨

