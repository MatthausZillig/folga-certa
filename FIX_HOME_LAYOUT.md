# Fix: Layout da Home Screen

## Mudanças Implementadas

Ajustes visuais na tela inicial para melhorar o espaçamento e organização do card de perfil.

---

## 1. Safe Area no Topo

**Problema:**
- Texto "Olá, Matthaus!" estava muito rente ao topo do celular
- Encostava na status bar/notch

**Solução:**
```typescript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const insets = useSafeAreaInsets();

<YStack padding="$6" paddingTop={insets.top + 24} gap="$6">
```

**Resultado:**
- `insets.top`: Espaço da status bar/notch (44px em iPhone com notch)
- `+ 24`: Espaço adicional para respiro visual
- Total: ~68px de padding no topo (iPhone com notch)
- Total: ~24px de padding no topo (dispositivos sem notch)

---

## 2. Remoção do Box Shadow

**Problema:**
- Card "Seu Perfil" tinha shadow desnecessária
- Visual pesado

**Antes:**
```typescript
shadowColor="#000"
shadowOffset={{ width: 0, height: 2 }}
shadowOpacity={0.06}
shadowRadius={8}
elevation={3}
```

**Depois:**
```typescript
// Shadow removida completamente
```

**Resultado:**
- Visual mais limpo e flat
- Apenas borda mantida para definir o card
- Consistente com design minimalista

---

## 3. Separador no Card

**Problema:**
- Título "Seu Perfil" misturado com conteúdo
- Falta de hierarquia visual

**Solução:**
```typescript
import { Separator } from 'tamagui';

<YStack gap="$4">
  <Text fontSize="$5" fontWeight="600" color="$text">
    Seu Perfil
  </Text>
  
  <Separator borderColor="$border" />
  
  <YStack gap="$2">
    {/* Conteúdo do perfil */}
  </YStack>
</YStack>
```

**Resultado:**
- Linha horizontal separando título do conteúdo
- Hierarquia visual clara
- Gap de $4 (16px) entre elementos
- Cor da linha usa o token `$border` do tema

---

## Visual Comparativo

### Antes

```
┌─────────────────────────────┐
│ 🔋 10:44                    │ ← Status bar
│ Olá, Matthaus!              │ ← Texto colado no topo
│ Tudo pronto para simular    │
│                             │
│ ┌─────────────────────────┐ │
│ │ Seu Perfil              │ │ ← Com shadow
│ │ Salário base: R$ X      │ │ ← Sem separador
│ │ Admissão: XX/XX/XXXX    │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### Depois

```
┌─────────────────────────────┐
│ 🔋 10:44                    │ ← Status bar
│                             │ ← Safe area (insets.top)
│                             │ ← +24px respiro
│ Olá, Matthaus!              │ ← Texto confortável
│ Tudo pronto para simular    │
│                             │
│ ┌─────────────────────────┐ │
│ │ Seu Perfil              │ │ ← Sem shadow
│ │ ─────────────────────── │ │ ← Separador
│ │ Salário base: R$ X      │ │
│ │ Admissão: XX/XX/XXXX    │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

---

## Estrutura do Card "Seu Perfil"

### Antes
```
┌───────────────────────┐
│ Seu Perfil            │ gap: $3 (12px)
│ Salário base: R$ X    │
│ Admissão: XX/XX/XXXX  │
└───────────────────────┘
Shadow aplicado
```

### Depois
```
┌───────────────────────┐
│ Seu Perfil            │ gap: $4 (16px)
│ ─────────────────────  │ ← Separator
│                       │ gap: $4 (16px)
│ Salário base: R$ X    │
│ Admissão: XX/XX/XXXX  │
└───────────────────────┘
Sem shadow, apenas borda
```

---

## Espaçamentos Atualizados

### Card Gap
```typescript
// Antes
gap="$3"  // 12px

// Depois
gap="$4"  // 16px
```

**Motivo:**
- Com o separador, precisamos de mais espaço
- 16px cria melhor hierarquia visual

### Top Padding
```typescript
// Antes
padding="$6"  // 24px em todos os lados

// Depois
padding="$6"              // 24px lateral/bottom
paddingTop={insets.top + 24}  // Dinâmico no topo
```

**Benefício:**
- Adapta-se automaticamente ao dispositivo
- iPhone SE: ~24px
- iPhone 13+: ~68px
- Android com notch: ~48-58px

---

## Código Completo do Card

```typescript
<YStack
  backgroundColor="$card"
  padding="$5"
  borderRadius="$4"
  borderWidth={1}
  borderColor="$border"
  gap="$4"
>
  <Text fontSize="$5" fontWeight="600" color="$text">
    Seu Perfil
  </Text>
  
  <Separator borderColor="$border" />
  
  <YStack gap="$2">
    <XStack justifyContent="space-between">
      <Text fontSize="$3" color="$muted">
        Salário base:
      </Text>
      <Text fontSize="$3" color="$text" fontWeight="600">
        {formatCurrencyBR(profile?.baseSalary || 0)}
      </Text>
    </XStack>
    {/* Outros campos */}
  </YStack>
</YStack>
```

---

## Arquivo Modificado

### src/screens/Home/index.tsx

**Importações adicionadas:**
- `Separator` do Tamagui
- `useSafeAreaInsets` do react-native-safe-area-context

**Mudanças:**
1. Adicionado `const insets = useSafeAreaInsets()`
2. Mudado `padding="$6"` para `padding="$6" paddingTop={insets.top + 24}`
3. Removido todas as props de shadow do card:
   - `shadowColor`
   - `shadowOffset`
   - `shadowOpacity`
   - `shadowRadius`
   - `elevation`
4. Mudado `gap="$3"` para `gap="$4"` no card
5. Adicionado `<Separator borderColor="$border" />` após título

---

## Tokens Tamagui Usados

| Token | Valor | Uso |
|-------|-------|-----|
| `$6` | 24px | Padding lateral/bottom |
| `$4` | 16px | Gap no card |
| `$5` | 20px | Padding interno do card |
| `$border` | `#DEE2E6` | Cor do separador |

---

## Benefícios

### 1. Melhor UX
- Conteúdo não colado na status bar
- Mais confortável visualmente
- Respiro adequado no topo

### 2. Visual Mais Limpo
- Sem shadow desnecessária
- Design flat/minimalista
- Foco no conteúdo

### 3. Hierarquia Visual
- Separador cria divisão clara
- Título destacado
- Conteúdo organizado

### 4. Responsividade
- Adapta-se a diferentes dispositivos
- Safe area calculada dinamicamente
- Funciona em todos os iPhones/Androids

---

## Comportamento por Dispositivo

### iPhone SE (sem notch)
```
insets.top = 0
paddingTop = 0 + 24 = 24px
```

### iPhone 13+ (com notch)
```
insets.top = 44
paddingTop = 44 + 24 = 68px
```

### iPhone 14 Pro (Dynamic Island)
```
insets.top = 44
paddingTop = 44 + 24 = 68px
```

### Android (com status bar)
```
insets.top = 24-32
paddingTop = 24-32 + 24 = 48-56px
```

---

## Resultado Final

1. Texto "Olá, Matthaus!" com espaço adequado do topo
2. Card "Seu Perfil" sem shadow, visual limpo
3. Separador entre título e conteúdo do card
4. Hierarquia visual clara e organizada
5. Layout responsivo e adaptável

Home screen com visual profissional e confortável em todos os dispositivos!

