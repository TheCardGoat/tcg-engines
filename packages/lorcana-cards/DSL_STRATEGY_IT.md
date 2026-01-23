# Strategia DSL per Abilità Carte Lorcana
 Prova PR
## 📊 Analisi Dati

### Situazione Attuale
- **4340 file carte** totali
- **1279 carte** con `missingImplementation: true`
- **162 carte** con solo keyword abilities (Evasive, Bodyguard, etc.)
- **41 carte** con keyword + altre abilità
- **1340 carte** con `abilities: []` (vuote o vanilla)

### Pattern Frequenti Identificati

#### Keyword (233 totali)
1. **Evasive** - 51 occorrenze
2. **Support** - 32 occorrenze
3. **Bodyguard** - 31 occorrenze
4. **Rush** - 24 occorrenze
5. **Challenger** - 23 occorrenze
6. **Ward** - 20 occorrenze
7. **Shift** - 20 occorrenze
8. **Resist** - 15 occorrenze
9. **Singer** - 12 occorrenze
10. **Reckless** - 12 occorrenze
11. **Boost** - 5 occorrenze

#### Trigger Events (75+ carte)
- `event: "play"` - Quando giochi questa carta
- `event: "quest"` - Quando questo personaggio quest
- `event: "banish"` - Quando questa carta viene bandita
- `timing: "when"` vs `"whenever"` - Pattern comune

#### Effect Types (273+ occorrenze)
- `draw` - Pesca carte
- `deal-damage` - Infliggi danno
- `return-to-hand` - Ritorna alla mano
- `banish` - Bandisci
- `remove-damage` - Rimuovi danno
- `sequence` - Sequenza di effetti
- `optional` - Effetto opzionale

---

## 🎯 Strategia Proposta: **Layered Abstraction**

### Principio Guida
**80/20 Rule**: Coprire l'80% dei casi con helper semplici, lasciare il 20% complesso alla sintassi completa.

---

## 📋 Livello 1: Keyword Abilities (Priorità ALTA)

**Impatto**: 162 carte + 41 carte = **203 carte** (copertura immediata)

### Helper da Creare

```typescript
// Simple keywords (no value)
evasive(text?)
bodyguard(text?)
rush(text?)
ward(text?)
support(text?)
reckless(text?)
vanish(text?)
alert(text?)

// Parameterized keywords
boost(value, text?)
shift(cost, text?)
challenger(value, text?)
resist(value, text?)
singer(value, text?)
```

**Vantaggi**:
- Copre ~80% delle keyword
- Riduce verbosità del 70%
- Facile da usare

**Esempio**:
```typescript
// Prima
{ id: "r2h-1", text: "Evasive", type: "keyword", keyword: "Evasive" }

// Dopo
evasive("Evasive (Only characters with Evasive can challenge this character.)")
```

---

## 📋 Livello 2: Trigger Patterns (Priorità ALTA)

**Impatto**: 75+ carte con triggered abilities

### Helper da Creare

```typescript
// Trigger comuni
whenPlay({ name?, text, if?, then })
wheneverQuest({ name?, text, if?, then })
whenBanished({ name?, text, if?, then })
wheneverCharacterQuests({ name?, text, on?, if?, then })
```

**Vantaggi**:
- Copre ~60% dei trigger
- Elimina ripetizione di `trigger: { event, timing, on }`
- Più leggibile

**Esempio**:
```typescript
// Prima
{
  type: "triggered",
  trigger: { event: "play", timing: "when", on: "SELF" },
  effect: { type: "draw", amount: 1, target: "CONTROLLER" }
}

// Dopo
whenPlay({
  text: "When you play this character, draw a card.",
  then: draw(1)
})
```

---

## 📋 Livello 3: Effect Builders (Priorità MEDIA)

**Impatto**: 273+ occorrenze di effetti comuni

### Helper da Creare

```typescript
// Basic effects
draw(amount, target?)
discard(amount, target?, chosen?)
dealDamage(amount, target?)
gainLore(amount)
removeDamage(amount, target?, upTo?)

// Movement effects
returnToHand(target)
banish(target)
exert(target)
ready(target)

// Composite effects
sequence(...effects)
optional(effect, chooser?)
```

**Vantaggi**:
- Copre ~70% degli effetti
- Riduce errori di sintassi
- Più leggibile

**Esempio**:
```typescript
// Prima
{
  type: "sequence",
  steps: [
    { type: "draw", amount: 1, target: "CONTROLLER" },
    { type: "discard", amount: 1, target: "CONTROLLER", chosen: true }
  ]
}

// Dopo
sequence(draw(1), discard(1, "CONTROLLER", true))
```

---

## 📋 Livello 4: Condition Helpers (Priorità BASSA)

**Impatto**: Condizioni comuni ma meno frequenti

### Helper da Creare

```typescript
hasCardUnder()
duringYourTurn()
hasCharacterNamed(name)
hasDamage()
isDamaged()
```

**Vantaggi**:
- Copre ~40% delle condizioni
- Migliora leggibilità

---

## 📋 Livello 5: ID Generation (Priorità ALTA)

**Impatto**: Tutte le carte (4340)

### Helper Principale

```typescript
abilities(cardId, ...abilityBuilders)
```

**Funzionalità**:
- Genera automaticamente ID: `${cardId}-1`, `${cardId}-2`, etc.
- Elimina `id: "14y-1"` manuali
- Previene errori di numerazione

**Esempio**:
```typescript
// Prima
abilities: [
  { id: "14y-1", ... },
  { id: "14y-2", ... }
]

// Dopo
abilities: abilities("14y",
  boost(2),
  wheneverQuest({...})
)
```

---

## 🏗️ Architettura Proposta

### Struttura File

```
packages/lorcana-cards/src/cards/
  ├── ability-helpers.ts    # Helper functions principali
  ├── keywords.ts           # Keyword helpers
  ├── triggers.ts           # Trigger helpers
  ├── effects.ts            # Effect helpers
  └── conditions.ts         # Condition helpers
```

**Oppure** (più semplice):
```
packages/lorcana-cards/src/cards/
  └── ability-helpers.ts    # Tutto in un file (più facile da trovare)
```

### Naming Convention

- **Verbi imperativi**: `draw()`, `banish()`, `exert()`
- **Nomi descrittivi**: `whenPlay()`, `wheneverQuest()`
- **CamelCase**: `hasCardUnder()`, `duringYourTurn()`
- **Nomi che leggono come il testo della carta**

---

## 📊 Priorità di Implementazione

### Fase 1: Quick Wins (1-2 giorni)
1. ✅ `abilities()` - ID generation
2. ✅ Keyword helpers (top 5: Evasive, Support, Bodyguard, Rush, Challenger)
3. ✅ `whenPlay()` - Trigger più comune

**Impatto**: ~100 carte immediatamente più semplici

### Fase 2: Core Patterns (3-5 giorni)
4. ✅ `wheneverQuest()`, `whenBanished()`
5. ✅ Effect builders base: `draw()`, `discard()`, `dealDamage()`
6. ✅ `sequence()`, `optional()`

**Impatto**: ~200 carte più semplici

### Fase 3: Advanced (1 settimana)
7. ✅ Keyword rimanenti (Shift, Boost, Singer, etc.)
8. ✅ Effect builders avanzati (return, banish, etc.)
9. ✅ Condition helpers

**Impatto**: Copertura ~80% dei casi

### Fase 4: Refinement (Ongoing)
10. ✅ Helper per pattern emergenti
11. ✅ Documentazione e esempi
12. ✅ Migrazione graduale

---

## 🎨 Esempio Completo: Prima vs Dopo

### Carta: Gaston - Frightful Bully

**Prima (Verboso)**:
```typescript
abilities: [
  {
    id: "14y-1",
    text: "Boost 2 {I}...",
    type: "keyword",
    keyword: "Boost",
    value: 2,
  },
  {
    id: "14y-2",
    text: "TOP THAT! Whenever this character quests...",
    name: "TOP THAT!",
    type: "triggered",
    trigger: {
      event: "quest",
      timing: "whenever",
      on: "SELF",
    },
    condition: {
      type: "has-card-under",
    },
    effect: {
      type: "restriction",
      restriction: "cant-challenge",
      target: "CHOSEN_OPPOSING_CHARACTER",
      duration: "until-start-of-next-turn",
    },
  },
]
```

**Dopo (Con DSL)**:
```typescript
abilities: abilities("14y",
  boost(2, "Boost 2 {I} (Once during your turn...)"),
  wheneverQuest({
    name: "TOP THAT!",
    text: "TOP THAT! Whenever this character quests...",
    if: hasCardUnder(),
    then: restrict("cant-challenge", "CHOSEN_OPPOSING_CHARACTER", "until-start-of-next-turn")
  })
)
```

**Risultato**: 
- 50% meno codice
- 70% più leggibile
- 0% errori di ID manuali

---

## 🔄 Strategia di Migrazione

### Approccio: Graduale e Non-Breaking

1. **Backward Compatible**: Gli helper generano la stessa struttura attuale
2. **Coesistenza**: Puoi usare helper e sintassi completa insieme
3. **Migrazione Opportunistica**: 
   - Nuove carte → usa DSL
   - Carte modificate → migra a DSL
   - Carte esistenti → lascia come sono (fino a quando necessario)

### Non Fare
- ❌ Riscrivere tutte le carte subito
- ❌ Forzare pattern artificiali
- ❌ Creare helper per casi edge (1-2 occorrenze)

---

## 📈 Metriche di Successo

### Obiettivi
- **Copertura**: 80% dei pattern comuni
- **Riduzione codice**: 50-70% per carte semplici
- **Velocità implementazione**: 2x più veloce per nuove carte
- **Errori**: -30% errori di sintassi/typo

### Come Misurare
- Conta carte migrate a DSL
- Misura riduzione linee di codice
- Traccia tempo medio per implementare nuova carta

---

## 🚀 Prossimi Passi

1. **Decidere struttura file** (un file vs moduli)
2. **Implementare Fase 1** (abilities + top 5 keywords + whenPlay)
3. **Testare su 5-10 carte** (validare approccio)
4. **Iterare e migliorare** (basato su feedback)
5. **Documentare** (esempi e best practices)

---

## ❓ Domande Aperte

1. **Struttura**: Un file unico o moduli separati?
2. **Naming**: Preferisci `whenPlay()` o `onPlay()`?
3. **Estensibilità**: Come gestire casi edge non coperti?
4. **Type Safety**: Quanto strict vogliamo essere?
5. **Documentazione**: Dove e come documentare?

---

## 📝 Note Finali

- **Non reinventare la ruota**: Usa i tipi esistenti da `@tcg/lorcana-types`
- **Mantieni semplicità**: Helper semplici > Helper complessi
- **Type-safe**: TypeScript deve aiutare, non ostacolare
- **Leggibilità > Brevità**: Codice chiaro è meglio di codice corto
