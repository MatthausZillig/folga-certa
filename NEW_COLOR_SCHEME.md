# Novo Esquema de Cores - Folga Certa

## 🎨 Paleta de Cores Inspirada em Urbanist

Baseado na paleta moderna com azuis vibrantes e neutros suaves.

---

## 🌈 Cores Principais

### Cores Base

| Nome | Hex | Uso |
|------|-----|-----|
| **White** | `#FFFFFF` | Fundo dos cards, texto em dark mode |
| **Lavender** | `#EBEFFF` | Fundo geral do app (light mode) |
| **Periwinkle** | `#C2CEFE` | Acentos secundários, hover states |
| **Neon Blue** | `#3960FB` | Cor principal de ação (botões, valores) |
| **Penn Blue** | `#14258B` | Fundo dark mode, textos importantes |
| **Black** | `#000000` | Texto principal (light mode) |

### Cores Neutras

| Nome | Hex | Uso |
|------|-----|-----|
| **Gray 300** | `#DEE2E6` | Bordas (light mode) |
| **Gray 400** | `#ADB5BD` | Texto muted (dark mode) |
| **Gray 500** | `#6C757D` | Texto muted (light mode) |

---

## 🎯 Mapeamento de Tokens

### Tema Light

```typescript
background: '#EBEFFF'    // Lavender - Fundo suave azulado
card: '#FFFFFF'          // White - Cards brancos
cardAlt: '#EBEFFF'       // Lavender - Seção alternativa
text: '#000000'          // Black - Texto principal
muted: '#6C757D'         // Gray 500 - Texto secundário
border: '#DEE2E6'        // Gray 300 - Bordas sutis
accent: '#3960FB'        // Neon Blue - Botões e destaques
accentAlt: '#C2CEFE'     // Periwinkle - Hover/estados alternativos
```

### Tema Dark

```typescript
background: '#14258B'    // Penn Blue - Fundo azul escuro
card: '#14258B'          // Penn Blue - Cards no mesmo tom
cardAlt: '#14258B'       // Penn Blue - Consistência
text: '#FFFFFF'          // White - Texto claro
muted: '#ADB5BD'         // Gray 400 - Texto secundário
border: '#C2CEFE'        // Periwinkle - Bordas visíveis
accent: '#3960FB'        // Neon Blue - Mantém identidade
accentAlt: '#C2CEFE'     // Periwinkle - Estados alternativos
```

---

## 📱 Comparação: Antes vs Depois

### Antes (Cinzas)
```
Fundo: #F8F9FA (Cinza muito claro)
Cards: #FFFFFF (Branco)
Texto: #212529 (Cinza escuro)
Accent: #343A40 (Cinza escuro)
Bordas: #DEE2E6 (Cinza claro)

Visual: Neutro, corporativo, sem personalidade
```

### Depois (Azuis Modernos)
```
Fundo: #EBEFFF (Lavanda suave)
Cards: #FFFFFF (Branco)
Texto: #000000 (Preto puro)
Accent: #3960FB (Azul vibrante)
Bordas: #DEE2E6 (Cinza claro)

Visual: Moderno, confiante, profissional com personalidade
```

---

## 🎨 Aplicação nas Telas

### HomeScreen

```typescript
// Fundo
backgroundColor="$background" // #EBEFFF (Lavender)

// Card de Perfil
backgroundColor="$card"       // #FFFFFF (White)
borderColor="$border"         // #DEE2E6 (Gray)

// Botão "Simular Férias"
backgroundColor="$accent"     // #3960FB (Neon Blue)
color="$textDark"            // #FFFFFF (White)

// Texto Principal
color="$text"                // #000000 (Black)

// Texto Secundário
color="$muted"               // #6C757D (Gray)
```

### SimulationTicket

```typescript
// Card Principal
backgroundColor="$card"       // #FFFFFF (White)
borderColor="$border"         // #DEE2E6 (Gray)

// Rodapé
backgroundColor="$cardAlt"    // #EBEFFF (Lavender)

// Valor Líquido
color="$accent"              // #3960FB (Neon Blue)

// Ponto Central da Linha
backgroundColor="$accent"     // #3960FB (Neon Blue)

// Recortes Laterais
backgroundColor="$background" // #EBEFFF (Lavender)
borderColor="$border"        // #DEE2E6 (Gray)
```

---

## 🌓 Dark Mode (Preparado para o Futuro)

### Quando implementado:

```typescript
// Fundo Dark
background: '#14258B'    // Penn Blue - Azul profundo

// Cards Dark
card: '#14258B'         // Mesmo tom do fundo

// Texto Dark
text: '#FFFFFF'         // Branco puro

// Bordas Dark
border: '#C2CEFE'       // Periwinkle - Mais visível

// Accent Dark
accent: '#3960FB'       // Neon Blue - Mantém consistência
```

---

## ✨ Características da Nova Paleta

### 1. **Moderna e Profissional**
- Azuis transmitem confiança e segurança
- Paleta comum em fintechs e apps financeiros

### 2. **Contraste Adequado**
- Texto preto (#000000) em fundo lavanda (#EBEFFF)
- WCAG AA compliant para acessibilidade

### 3. **Vibrante mas Suave**
- Neon Blue (#3960FB) para ações importantes
- Lavender (#EBEFFF) suave e não cansativo

### 4. **Hierarquia Clara**
- Accent (Neon Blue) para ações primárias
- Muted (Gray 500) para informações secundárias
- Border (Gray 300) para separadores sutis

### 5. **Inspiração em Apps Premium**
- Paleta similar a apps de viagem modernos
- Visual "clean" e "fresh"
- Profissionalismo sem ser corporativo demais

---

## 🎯 Onde as Cores São Usadas

### Neon Blue (#3960FB) - Cor de Ação
- ✅ Botões primários ("Simular Férias")
- ✅ Valores monetários destacados
- ✅ Ponto central da linha do ticket
- ✅ Links e elementos clicáveis

### Lavender (#EBEFFF) - Fundo Suave
- ✅ Background geral do app
- ✅ Rodapé dos tickets
- ✅ Cards alternativos
- ✅ Estados de hover (futuro)

### White (#FFFFFF) - Cards
- ✅ Cards principais
- ✅ Tickets de simulação
- ✅ Card de perfil
- ✅ Superfícies elevadas

### Black (#000000) - Texto Principal
- ✅ Títulos
- ✅ Valores importantes
- ✅ Informações chave
- ✅ Labels

### Gray 500 (#6C757D) - Texto Secundário
- ✅ Subtítulos
- ✅ Descrições
- ✅ Labels de campos
- ✅ Informações auxiliares

---

## 📊 Resultado Visual

### Impressão Geral
- 🎨 **Moderno**: Paleta atual e contemporânea
- 💼 **Profissional**: Confiável para finanças
- ✨ **Vibrante**: Azul que transmite energia
- 😊 **Amigável**: Não é intimidador
- 🎯 **Focado**: Hierarquia visual clara

### Comparação com Outros Apps
- **Nubank**: Roxo vibrante (mais jovem)
- **Banco Inter**: Laranja (mais energético)
- **Folga Certa**: Azul moderno (profissional + amigável) ✅

---

## 🔄 Migração Automática

Todos os componentes já estão usando tokens do tema (`$accent`, `$background`, etc.), então a mudança é **automática** ao atualizar o `tamagui.config.ts`.

Não é necessário alterar:
- ❌ Componentes individuais
- ❌ Estilos inline
- ❌ Cores hardcoded

---

## 🎉 Conclusão

O novo esquema de cores:
- ✅ É moderno e profissional
- ✅ Mantém acessibilidade (contraste)
- ✅ Cria identidade visual forte
- ✅ Transmite confiança (azul)
- ✅ É agradável visualmente
- ✅ Funciona em light e dark mode
- ✅ Está alinhado com design system moderno

**O app agora tem uma identidade visual única e memorável!** 🎨✨

