# Fix: Navegação do Botão "Simular Férias"

## Problema

Quando o usuário:
1. Clica em um card de simulação salva na Home
2. Vê os detalhes da simulação
3. Volta para Home
4. Clica em "Simular Férias"

**Comportamento Errado:**
- Ia para os detalhes da última simulação visualizada (não limpava o parâmetro)

**Comportamento Esperado:**
- Deve sempre ir para o formulário de nova simulação

---

## Causa Raiz

O React Navigation **mantém os parâmetros da rota** mesmo quando você navega novamente para a mesma tela sem especificar novos parâmetros.

### Fluxo do Bug

```
1. Home → navigate('Simulation', { simulation: SimX })
   → SimulationScreen recebe params.simulation = SimX
   → Mostra resultado

2. SimulationScreen → goBack()
   → Home (params.simulation ainda existe na memória)

3. Home → navigate('Simulation')
   → SimulationScreen ainda tem params.simulation = SimX
   → Mostra resultado (ERRADO!)
```

### Por Que Acontecia?

```typescript
// Home (antes)
onPress={() => navigation.navigate('Simulation')}
// ❌ Não passava parâmetro nenhum, React Navigation mantinha o anterior
```

```typescript
// SimulationScreen useEffect (antes)
useEffect(() => {
  if (route.params?.simulation) {
    setResult(route.params.simulation.result);
    setIsFromSavedSimulation(true);
  } else {
    setIsFromSavedSimulation(false);  // ❌ Não limpava result
  }
}, [route.params]);
```

---

## Solução Implementada

### 1. Home - Passar `undefined` Explicitamente

```typescript
// Home (depois)
onPress={() => navigation.navigate('Simulation', { simulation: undefined })}
// ✅ Força limpeza do parâmetro
```

**Como funciona:**
- `undefined` é diferente de "não passar nada"
- React Navigation interpreta `undefined` como "limpar este parâmetro"
- Garante que `route.params.simulation` seja `undefined`

---

### 2. SimulationScreen - Limpar Result

```typescript
// SimulationScreen useEffect (depois)
useEffect(() => {
  if (route.params?.simulation) {
    setResult(route.params.simulation.result);
    setIsFromSavedSimulation(true);
  } else {
    setResult(null);                  // ✅ Limpa result
    setIsFromSavedSimulation(false);
  }
}, [route.params]);
```

**Como funciona:**
- Se `route.params?.simulation` existe → Mostra resultado salvo
- Se não existe → Limpa `result` e `isFromSavedSimulation`
- Garante que sempre mostre o formulário quando apropriado

---

## Fluxos Corrigidos

### Fluxo 1: Nova Simulação (Normal)

```
Home
  ↓ [Simular Férias] → navigate('Simulation', { simulation: undefined })
SimulationScreen
  ↓ useEffect detecta simulation = undefined
  ↓ setResult(null)
Formulário ✅
```

---

### Fluxo 2: Ver Simulação Salva

```
Home
  ↓ [Clica no card] → navigate('Simulation', { simulation: SimX })
SimulationScreen
  ↓ useEffect detecta simulation = SimX
  ↓ setResult(SimX.result)
Resultado ✅
```

---

### Fluxo 3: Salva → Home → Nova (Bug Corrigido)

```
Home
  ↓ [Clica no card] → navigate('Simulation', { simulation: SimX })
SimulationScreen (resultado)
  ↓ [Voltar] → goBack()
Home
  ↓ [Simular Férias] → navigate('Simulation', { simulation: undefined })
SimulationScreen
  ↓ useEffect detecta simulation = undefined
  ↓ setResult(null)
Formulário ✅ (CORRIGIDO!)
```

**Antes:** Mostrava resultado
**Depois:** Mostra formulário ✅

---

### Fluxo 4: Nova → Salva → Nova

```
Home
  ↓ [Simular Férias] → navigate('Simulation', { simulation: undefined })
SimulationScreen (formulário)
  ↓ [Calcular] → setResult(newResult)
SimulationScreen (resultado)
  ↓ [Voltar] (via back button) → setResult(null)
SimulationScreen (formulário)
  ↓ [Voltar] → goBack()
Home
  ↓ [Clica no card] → navigate('Simulation', { simulation: SimX })
SimulationScreen (resultado) ✅
```

---

## Código Completo

### HomeScreen (Button)

```typescript
<Button
  backgroundColor="$accent"
  color="$textDark"
  height={56}
  fontSize="$5"
  fontWeight="600"
  onPress={() => navigation.navigate('Simulation', { simulation: undefined })}
  pressStyle={{ opacity: 0.8 }}
>
  Simular Férias
</Button>
```

---

### HomeScreen (Card)

```typescript
<SimulationTicket
  key={sim.id}
  vacationDays={sim.input.vacationDays}
  startDate={sim.input.startDate}
  endDate={getEndDate(sim.input.startDate, sim.input.vacationDays)}
  liquidoFerias={sim.result?.liquidoFerias || 0}
  advance13th={sim.input.advance13th}
  onPress={() => navigation.navigate('Simulation', { simulation: sim })}
/>
```

---

### SimulationScreen (useEffect)

```typescript
useEffect(() => {
  if (route.params?.simulation) {
    setResult(route.params.simulation.result);
    setIsFromSavedSimulation(true);
  } else {
    setResult(null);
    setIsFromSavedSimulation(false);
  }
}, [route.params]);
```

---

## Comparação: Antes vs Depois

### Antes ❌

| Ação | Parâmetro Passado | Result State | Tela Mostrada |
|------|------------------|--------------|---------------|
| Simular Férias (1ª vez) | nenhum | null | Formulário ✅ |
| Clica no card | SimX | SimX.result | Resultado ✅ |
| Volta para Home | - | - | - |
| Simular Férias (2ª vez) | nenhum | SimX.result | Resultado ❌ |

---

### Depois ✅

| Ação | Parâmetro Passado | Result State | Tela Mostrada |
|------|------------------|--------------|---------------|
| Simular Férias (1ª vez) | undefined | null | Formulário ✅ |
| Clica no card | SimX | SimX.result | Resultado ✅ |
| Volta para Home | - | - | - |
| Simular Férias (2ª vez) | undefined | null | Formulário ✅ |

---

## Entendendo React Navigation Params

### Comportamento Padrão

```typescript
// Navegação 1
navigation.navigate('Screen', { param: 'A' })
// params = { param: 'A' }

// Navegação 2
navigation.navigate('Screen')
// params = { param: 'A' }  ← MANTÉM O ANTERIOR!
```

---

### Limpeza Explícita

```typescript
// Navegação 1
navigation.navigate('Screen', { param: 'A' })
// params = { param: 'A' }

// Navegação 2
navigation.navigate('Screen', { param: undefined })
// params = { param: undefined }  ← LIMPA!
```

---

## Alternativas Consideradas

### Alternativa 1: Reset no onFocus (Descartada)

```typescript
useFocusEffect(() => {
  if (!route.params?.simulation) {
    setResult(null);
  }
});
```

**Problema:**
- Complexidade desnecessária
- Hook adicional
- Timing de execução menos previsível

---

### Alternativa 2: navigation.push (Descartada)

```typescript
navigation.push('Simulation', { simulation: undefined })
```

**Problema:**
- Cria nova instância na stack
- Histórico fica poluído
- Botão voltar não funciona corretamente

---

### Alternativa 3: Parâmetro Explícito (Escolhida) ✅

```typescript
navigation.navigate('Simulation', { simulation: undefined })
```

**Vantagens:**
- Simples e direto
- Comportamento previsível
- Sem hooks adicionais
- Limpa parâmetro explicitamente

---

## Arquivos Modificados

### 1. src/screens/Home/index.tsx

**Mudança:**
```typescript
// Antes
onPress={() => navigation.navigate('Simulation')}

// Depois
onPress={() => navigation.navigate('Simulation', { simulation: undefined })}
```

**Linha:** 98

---

### 2. src/screens/Simulation/index.tsx

**Mudança:**
```typescript
// Antes
} else {
  setIsFromSavedSimulation(false);
}

// Depois
} else {
  setResult(null);
  setIsFromSavedSimulation(false);
}
```

**Linhas:** 29-32

---

## Testes Realizados

### Cenário 1: Nova Simulação
```
1. Abrir app
2. Clicar "Simular Férias"
3. ✅ Ver formulário
```

### Cenário 2: Ver Simulação Salva
```
1. Home
2. Clicar em card de simulação
3. ✅ Ver resultado
```

### Cenário 3: Salva → Home → Nova (Bug)
```
1. Home
2. Clicar em card de simulação
3. Ver resultado
4. Voltar para Home
5. Clicar "Simular Férias"
6. ✅ Ver formulário (antes mostrava resultado)
```

### Cenário 4: Múltiplas Navegações
```
1. Home → Simular Férias → Formulário ✅
2. Voltar
3. Home → Card → Resultado ✅
4. Voltar
5. Home → Simular Férias → Formulário ✅
6. Voltar
7. Home → Card → Resultado ✅
```

---

## Resultado Final

### Problema Resolvido ✅

1. ✅ Botão "Simular Férias" **sempre** vai para formulário
2. ✅ Cards de simulação **sempre** vão para resultado
3. ✅ Navegação consistente e previsível
4. ✅ Sem estado residual entre navegações

---

### Comportamento Garantido

| Origem | Ação | Destino |
|--------|------|---------|
| Home | Botão "Simular Férias" | Formulário ✅ |
| Home | Card de simulação | Resultado ✅ |
| Resultado (salva) | Voltar → Simular Férias | Formulário ✅ |
| Resultado (nova) | Voltar | Formulário ✅ |

Navegação funcionando perfeitamente agora! 🎉

