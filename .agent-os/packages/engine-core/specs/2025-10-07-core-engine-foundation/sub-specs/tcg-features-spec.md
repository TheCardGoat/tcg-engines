# TCG-Specific Features Specification

This document details the first-class TCG features that make `@tcg/core` a specialized framework for trading card games.

## 1. Zone Management System

### Overview

Zones are fundamental to all TCGs - they represent distinct areas where cards exist (deck, hand, play area, graveyard, etc.). The framework must provide comprehensive zone management as a core feature.

### Zone Types

```typescript
type ZoneVisibility = 'public' | 'private' | 'secret';

type ZoneConfig = {
  id: string;
  name: string;
  visibility: ZoneVisibility;
  owner?: PlayerId; // undefined for shared zones
  ordered: boolean; // does order matter? (deck yes, play area maybe not)
  faceDown?: boolean; // are cards face-up by default
  maxSize?: number; // deck size limit, hand size limit, etc.
};
```

**Visibility Types:**
- **public**: All players can see all cards (e.g., play area, graveyard)
- **private**: Owner can see cards, opponents see count (e.g., hand)
- **secret**: No one can see cards, only count (e.g., deck, face-down cards)

### Zone Operations

```typescript
type ZoneOperations = {
  // Move cards between zones
  moveCard(cardId: CardId, fromZone: ZoneId, toZone: ZoneId, position?: number): void;
  moveCards(cardIds: CardId[], fromZone: ZoneId, toZone: ZoneId): void;
  
  // Draw cards from deck to hand
  draw(playerId: PlayerId, count: number): CardId[];
  
  // Shuffle zone (typically deck)
  shuffle(zoneId: ZoneId, seed?: string): void;
  
  // Search zone for cards
  search(zoneId: ZoneId, filter: CardFilter): Card[];
  
  // Look at top N cards
  peek(zoneId: ZoneId, count: number): Card[];
  
  // Reveal cards (make temporarily visible)
  reveal(cardIds: CardId[], duration?: 'permanent' | 'until-end-of-turn'): void;
  
  // Zone queries
  getZoneSize(zoneId: ZoneId): number;
  getCardsInZone(zoneId: ZoneId): Card[];
  getTopCard(zoneId: ZoneId): Card | undefined;
  getBottomCard(zoneId: ZoneId): Card | undefined;
};
```

### Zone State Integration

```typescript
type GameStateWithZones<TCustomZones = {}> = {
  zones: TCustomZones;
  zoneConfigs: Record<string, ZoneConfig>;
  // ... other game state
};

// Zones are part of immutable state
const initialState: GameState = produce(baseState, (draft) => {
  // Initialize zones
  draft.zones.deck = createZone({ 
    id: 'deck', 
    visibility: 'secret',
    ordered: true,
    faceUp: false 
  });
  
  draft.zones.hand = createZone({ 
    id: 'hand', 
    visibility: 'private',
    ordered: false,
    faceUp: true 
  });
  
  // Add cards to deck
  draft.zones.deck.cards = shuffleCards(allCards, seed);
});
```

### Example Usage

```typescript
// In a move reducer
moves: {
  drawCard: {
    move: (state, { playerId }) => {
      const card = state.zones.deck.cards.shift(); // Remove from deck
      if (card) {
        state.zones.hand.cards.push(card); // Add to hand
      }
    },
    condition: (state, { playerId }) => {
      return state.zones.deck.cards.length > 0;
    }
  },
  
  playCard: {
    move: (state, { playerId, cardId }) => {
      const cardIndex = state.zones.hand.cards.findIndex(c => c.id === cardId);
      const card = state.zones.hand.cards.splice(cardIndex, 1)[0];
      state.zones.play.cards.push(card);
      card.zone = 'play';
    }
  }
}
```

---

## 2. Card State Management

### Card Instance Model

**Core Concept:** Card instances have a **mandatory base type** with core TCG fields, and games extend with custom state.

```typescript
// Mandatory base fields that ALL TCGs need
type CardInstanceBase = {
  // Identity (mandatory)
  id: CardId;
  definitionId: string; // references card definition
  owner: PlayerId;
  controller: PlayerId; // can differ from owner
  
  // Location (mandatory)
  zone: ZoneId;
  position?: number; // position within zone if ordered
  
  // State flags (mandatory)
  tapped: boolean;
  flipped: boolean; // face-up/face-down
  revealed: boolean; // temporarily visible to all
  phased: boolean; // phased out (not in play but not in another zone)
};

// Generic card instance - games extend with custom state
type CardInstance<TCustomState = {}> = CardInstanceBase & TCustomState;

// Example: Magic the Gathering custom state
type MagicCardState = {
  summoningSick: boolean;
  damageTaken: number;
  counters: Record<string, number>; // +1/+1, -1/-1, etc.
  attachments: CardId[];
  attachedTo?: CardId;
  modifiers: Modifier[];
};

type MagicCard = CardInstance<MagicCardState>;

// Example: Hearthstone custom state (different needs)
type HearthstoneCardState = {
  damageTaken: number;
  divineShield: boolean;
  stealth: boolean;
  frozen: boolean;
  silenced: boolean;
};

type HearthstoneCard = CardInstance<HearthstoneCardState>;
```

### Modifier System

```typescript
type Modifier = {
  id: string;
  type: 'stat' | 'ability' | 'type' | 'keyword';
  property: string; // which property to modify (e.g., 'power', 'toughness')
  value: number | string | boolean;
  duration: 'permanent' | 'until-end-of-turn' | 'while-condition';
  condition?: (state: GameState) => boolean;
  source: CardId; // what card created this modifier
  layer?: number; // modifier layer (for complex interactions)
};
```

### Computed Properties Pattern

**Problem:** Card power = base power + modifiers. How do we compute this?

**Solution:** Pure functions that compute values from state (never store computed values in state).

```typescript
// Card Definition (static data)
type CardDefinition = {
  id: string;
  name: string;
  type: string;
  basePower?: number;
  baseToughness?: number;
  baseCost?: number;
  abilities: string[];
  // ... other static properties
};

// Card Instance (mutable state)
type CardInstance<TCustomState> = CardInstanceBase & TCustomState & {
  // Only store RAW state, never computed values
  modifiers: Modifier[];
};

// Computed Properties (pure functions)
const getCardPower = (card: CardInstance, state: GameState): number => {
  const definition = getCardDefinition(card.definitionId);
  const basePower = definition.basePower ?? 0;
  
  // Sum all power modifiers
  const modifierBonus = card.modifiers
    .filter(m => m.type === 'stat' && m.property === 'power')
    .filter(m => !m.condition || m.condition(state)) // check conditions
    .reduce((sum, m) => sum + (m.value as number), 0);
  
  return basePower + modifierBonus;
};

const getCardToughness = (card: CardInstance, state: GameState): number => {
  const definition = getCardDefinition(card.definitionId);
  const baseToughness = definition.baseToughness ?? 0;
  
  const modifierBonus = card.modifiers
    .filter(m => m.type === 'stat' && m.property === 'toughness')
    .filter(m => !m.condition || m.condition(state))
    .reduce((sum, m) => sum + (m.value as number), 0);
  
  return baseToughness + modifierBonus;
};

const getCardCost = (card: CardInstance, state: GameState): number => {
  const definition = getCardDefinition(card.definitionId);
  const baseCost = definition.baseCost ?? 0;
  
  // Cost reduction effects
  const costReduction = card.modifiers
    .filter(m => m.type === 'stat' && m.property === 'cost')
    .filter(m => !m.condition || m.condition(state))
    .reduce((sum, m) => sum + (m.value as number), 0);
  
  return Math.max(0, baseCost + costReduction); // Can't go negative
};

// Usage in game logic
const attackCreature = (attacker: CardInstance, defender: CardInstance, state: GameState) => {
  const attackPower = getCardPower(attacker, state);
  const defenderToughness = getCardToughness(defender, state);
  
  if (attackPower >= defenderToughness) {
    // Destroy defender
  }
};
```

**Why This Pattern?**

1. **Deterministic** - Same state always produces same computed value
2. **Replayable** - No hidden state, everything computable from base state
3. **Testable** - Easy to test: given state, expect output
4. **Immutable** - State only stores raw data, never derived data
5. **Cacheable** - Can memoize computed functions if needed for performance

**Example with Conditional Modifiers:**

```typescript
// Add modifier that gives +2 power while card is tapped
const addConditionalModifier = (card: CardInstance, state: Draft<GameState>) => {
  card.modifiers.push({
    id: nanoid(),
    type: 'stat',
    property: 'power',
    value: 2,
    duration: 'while-condition',
    condition: (s) => {
      const c = s.cards[card.id];
      return c.tapped; // Only apply if tapped
    },
    source: card.id
  });
};

// When computing power, condition is checked
const power = getCardPower(card, state); // 3 + 2 = 5 (if tapped)
```

### Card Operations

```typescript
type CardOperations = {
  // State changes
  tap(cardId: CardId): void;
  untap(cardId: CardId): void;
  flip(cardId: CardId): void; // flip face-up/face-down
  reveal(cardId: CardId): void;
  hide(cardId: CardId): void;
  
  // Counters
  addCounter(cardId: CardId, counterType: string, amount: number): void;
  removeCounter(cardId: CardId, counterType: string, amount: number): void;
  getCounters(cardId: CardId, counterType: string): number;
  
  // Attachments
  attach(sourceId: CardId, targetId: CardId): void;
  detach(sourceId: CardId): void;
  
  // Modifiers
  addModifier(cardId: CardId, modifier: Modifier): void;
  removeModifier(cardId: CardId, modifierId: string): void;
  getModifiers(cardId: CardId): Modifier[];
  
  // Damage
  dealDamage(cardId: CardId, amount: number): void;
  healDamage(cardId: CardId, amount: number): void;
  
  // Queries
  getCard(cardId: CardId): CardInstance | undefined;
  isCardTapped(cardId: CardId): boolean;
  isCardInZone(cardId: CardId, zoneId: ZoneId): boolean;
};
```

---

## 3. Card Filtering DSL

### Overview

A declarative query language for selecting cards based on properties, zones, and game state. Essential for implementing card effects like "all creatures with power > 5".

### Filter Syntax

```typescript
type CardFilter = {
  // Zone filtering
  zone?: ZoneId | ZoneId[];
  owner?: PlayerId | PlayerId[];
  controller?: PlayerId | PlayerId[];
  
  // Card properties (from definition)
  type?: string | string[];
  subtype?: string | string[];
  name?: string | RegExp;
  cost?: NumberFilter;
  
  // Game-specific properties
  power?: NumberFilter;
  toughness?: NumberFilter;
  loyalty?: NumberFilter;
  
  // State filtering
  tapped?: boolean;
  revealed?: boolean;
  hasCounters?: string; // has any of this counter type
  
  // Composite filters
  and?: CardFilter[];
  or?: CardFilter[];
  not?: CardFilter;
  
  // Custom predicates
  where?: (card: CardInstance, state: GameState) => boolean;
};

type NumberFilter = 
  | number // exact match
  | { eq: number } // equal
  | { gte: number } // greater than or equal
  | { lte: number } // less than or equal
  | { gt: number } // greater than
  | { lt: number } // less than
  | { between: [number, number] }; // range
```

### Usage Examples

```typescript
// All creatures with power >= 5
const filter1: CardFilter = {
  zone: 'play',
  type: 'creature',
  power: { gte: 5 }
};

// All tapped permanents you control
const filter2: CardFilter = {
  zone: 'play',
  controller: myPlayerId,
  tapped: true
};

// All cards in hand or graveyard
const filter3: CardFilter = {
  zone: ['hand', 'graveyard'],
  owner: myPlayerId
};

// Complex: creatures with power > toughness
const filter4: CardFilter = {
  type: 'creature',
  where: (card, state) => {
    const definition = getCardDefinition(card.definitionId);
    return definition.power > definition.toughness;
  }
};

// Using the DSL
const cards = selectCards(state, filter1);
const count = countCards(state, filter2);
const exists = anyCard(state, filter3);
```

### Builder API

```typescript
// Fluent builder for complex queries
const cards = CardQuery.from(state)
  .inZone('play')
  .ofType('creature')
  .where(card => card.power > 5)
  .controlledBy(playerId)
  .tapped(false)
  .execute();

// Reusable filters
const untappedCreatures = CardQuery.define()
  .ofType('creature')
  .tapped(false);

const myCreatures = untappedCreatures
  .controlledBy(myPlayerId)
  .execute(state);
```

---

## 4. Targeting System

### Overview

Targeting is fundamental to TCGs but often complex. The framework must provide first-class targeting support to handle:
- Target selection and validation
- Targeting restrictions (e.g., "target creature you don't control")
- Min/max target requirements
- Multi-target support
- Optional vs required targets
- Target legality checks

### Target Definition

```typescript
type TargetDefinition = {
  id: string; // unique target slot ID
  filter: CardFilter; // what can be targeted
  count: number | { min: number; max: number }; // how many targets
  required: boolean; // must select target(s) to execute move
  restrictions?: TargetRestriction[];
};

type TargetRestriction =
  | { type: 'not-self' } // Can't target the source card
  | { type: 'not-controller' } // Can't target cards you control
  | { type: 'not-owner' } // Can't target cards you own
  | { type: 'different-targets' } // All targets must be different
  | { type: 'same-controller' } // All targets must share controller
  | { type: 'custom'; check: (target: CardId, state: GameState) => boolean };
```

### Move with Targeting

```typescript
moves: {
  dealDamage: {
    // Define targets for this move
    targets: {
      creature: {
        id: 'creature',
        filter: { zone: 'play', type: 'creature' },
        count: 1,
        required: true,
        restrictions: [
          { type: 'not-controller' } // Can't target your own creatures
        ]
      }
    },
    
    // Target is validated before move executes
    move: (state, { damage }, { targets, rng }) => {
      const targetId = targets.creature[0]; // Guaranteed to exist (required: true)
      const card = state.cards[targetId];
      card.damageTaken += damage;
    },
    
    condition: (state, { playerId }) => {
      // Player must have mana to cast
      return state.players[playerId].mana >= 3;
    }
  },
  
  // Multi-target example
  multiTarget: {
    targets: {
      creatures: {
        id: 'creatures',
        filter: { zone: 'play', type: 'creature' },
        count: { min: 1, max: 3 }, // 1-3 targets
        required: true,
        restrictions: [
          { type: 'different-targets' } // Can't pick same creature twice
        ]
      }
    },
    move: (state, { effect }, { targets }) => {
      const targetIds = targets.creatures; // Array of 1-3 card IDs
      for (const id of targetIds) {
        // Apply effect to each target
        state.cards[id].tapped = true;
      }
    }
  },
  
  // Optional target example
  optionalBuff: {
    targets: {
      ally: {
        id: 'ally',
        filter: { zone: 'play', type: 'creature', controller: '$self' },
        count: 1,
        required: false // Optional - can cast without target
      }
    },
    move: (state, { bonus }, { targets }) => {
      if (targets.ally && targets.ally.length > 0) {
        const targetId = targets.ally[0];
        state.cards[targetId].modifiers.push({
          id: nanoid(),
          type: 'stat',
          property: 'power',
          value: bonus,
          duration: 'until-end-of-turn',
          source: 'optionalBuff'
        });
      }
      // Effect still resolves even without target
    }
  }
}
```

### Target Validation

```typescript
type TargetValidator = {
  // Check if a specific card is a legal target
  isLegalTarget(
    state: GameState,
    targetDef: TargetDefinition,
    cardId: CardId,
    moveContext: MoveContext
  ): boolean;
  
  // Get all legal targets for a target definition
  getLegalTargets(
    state: GameState,
    targetDef: TargetDefinition,
    moveContext: MoveContext
  ): CardId[];
  
  // Validate complete target selection
  validateTargetSelection(
    state: GameState,
    targetDef: TargetDefinition,
    selectedTargets: CardId[],
    moveContext: MoveContext
  ): ValidationResult;
};

// Implementation example
const isLegalTarget = (
  state: GameState,
  targetDef: TargetDefinition,
  cardId: CardId,
  context: MoveContext
): boolean => {
  const card = state.cards[cardId];
  if (!card) return false;
  
  // Check filter
  if (!matchesFilter(card, targetDef.filter, state)) {
    return false;
  }
  
  // Check restrictions
  for (const restriction of targetDef.restrictions ?? []) {
    switch (restriction.type) {
      case 'not-self':
        if (cardId === context.sourceCard) return false;
        break;
      
      case 'not-controller':
        if (card.controller === context.playerId) return false;
        break;
      
      case 'not-owner':
        if (card.owner === context.playerId) return false;
        break;
      
      case 'custom':
        if (!restriction.check(cardId, state)) return false;
        break;
    }
  }
  
  return true;
};
```

### Target Enumeration (for AI)

```typescript
// Enumerate all valid target combinations for a move
const enumerateTargetCombinations = (
  state: GameState,
  moveName: string,
  context: MoveContext
): CardId[][] => {
  const moveDef = getMoveDefinition(moveName);
  const targetDef = moveDef.targets;
  
  if (!targetDef) return [[]]; // No targets needed
  
  const combinations: CardId[][] = [];
  const legalTargets = getLegalTargets(state, targetDef, context);
  
  // Handle count
  if (typeof targetDef.count === 'number') {
    // Exact count: generate all permutations of that size
    const perms = generatePermutations(legalTargets, targetDef.count);
    combinations.push(...perms);
  } else {
    // Min/max: generate all valid sizes
    for (let size = targetDef.count.min; size <= targetDef.count.max; size++) {
      const perms = generatePermutations(legalTargets, size);
      combinations.push(...perms);
    }
  }
  
  // If optional, include empty selection
  if (!targetDef.required) {
    combinations.push([]);
  }
  
  return combinations;
};

// Usage in AI move enumeration
const validMoves = enumerateValidMoves(state, playerId);
// Returns:
// [
//   { name: 'dealDamage', args: { damage: 3 }, targets: ['card-1'] },
//   { name: 'dealDamage', args: { damage: 3 }, targets: ['card-2'] },
//   { name: 'multiTarget', args: {}, targets: ['card-1'] },
//   { name: 'multiTarget', args: {}, targets: ['card-1', 'card-2'] },
//   { name: 'multiTarget', args: {}, targets: ['card-1', 'card-2', 'card-3'] },
//   // ... all valid combinations
// ]
```

### Advanced Targeting: Modal Spells

```typescript
// Modal spells: choose one or more modes
moves: {
  charm: {
    modes: [
      {
        id: 'mode1',
        name: 'Draw cards',
        targets: {
          player: {
            id: 'player',
            filter: { type: 'player' },
            count: 1,
            required: true
          }
        },
        execute: (state, { targets }) => {
          // Draw 2 cards
        }
      },
      {
        id: 'mode2',
        name: 'Destroy creature',
        targets: {
          creature: {
            id: 'creature',
            filter: { zone: 'play', type: 'creature' },
            count: 1,
            required: true
          }
        },
        execute: (state, { targets }) => {
          // Destroy targeted creature
        }
      }
    ],
    modeSelection: { min: 1, max: 2 }, // Choose 1-2 modes
    
    move: (state, { selectedModes }, { targets }) => {
      for (const modeId of selectedModes) {
        const mode = findMode(modeId);
        mode.execute(state, { targets });
      }
    }
  }
}
```

### Targeting Context

```typescript
type MoveContext = {
  playerId: PlayerId;
  sourceCard?: CardId; // Card causing this move (for abilities)
  timestamp: number;
  rng: SeededRNG;
  targets: Record<string, CardId[]>; // Resolved targets
};

// Context is passed to move reducer
moves: {
  cardAbility: {
    targets: { /* ... */ },
    move: (state, args, context) => {
      const { playerId, sourceCard, targets, rng } = context;
      
      // Use source card
      const source = state.cards[sourceCard!];
      
      // Use targets
      const targetIds = targets.creature;
      
      // Use RNG
      const roll = rng.rollDice(6);
    }
  }
}
```

### Target Re-validation

**Problem:** Target becomes illegal after selection but before resolution (e.g., target is destroyed).

**Solution:** Re-validate targets before executing move.

```typescript
const executeMove = (move: Move, state: GameState): MoveResult => {
  // 1. Validate move
  if (!isValidMove(move, state)) {
    return { success: false, error: 'Invalid move' };
  }
  
  // 2. Resolve targets
  const targets = resolveTargets(move, state);
  
  // 3. Re-validate targets (they might have become illegal)
  for (const [targetKey, targetIds] of Object.entries(targets)) {
    const targetDef = move.targets[targetKey];
    
    for (const targetId of targetIds) {
      if (!isLegalTarget(state, targetDef, targetId, moveContext)) {
        return { 
          success: false, 
          error: `Target ${targetId} is no longer legal` 
        };
      }
    }
  }
  
  // 4. Execute move with validated targets
  return applyMove(move, state, { targets });
};
```

---

## 5. AI Move Enumeration

### Overview

APIs for enumerating all valid moves and legal targets at any game state, enabling AI opponents and move suggestion systems.

### Move Enumeration

```typescript
type EnumeratedMove = {
  name: string; // move name
  args: Record<string, unknown>; // move arguments
  playerId: PlayerId;
  targets?: CardId[]; // required targets
  priority: number; // move priority/rank (for AI heuristics)
  evaluation?: number; // heuristic score (if AI eval enabled)
};

type MoveEnumerator = {
  // Get all valid moves for a player
  enumerateValidMoves(state: GameState, playerId: PlayerId): EnumeratedMove[];
  
  // Get valid targets for a specific move
  enumerateValidTargets(
    state: GameState, 
    moveName: string, 
    partialArgs: Record<string, unknown>
  ): CardId[];
  
  // Check if specific move+args is valid
  isValidMove(state: GameState, move: EnumeratedMove): boolean;
  
  // Get move count (without generating all)
  countValidMoves(state: GameState, playerId: PlayerId): number;
};
```

### Target Enumeration

```typescript
// In move definition, specify target requirements
moves: {
  dealDamage: {
    targets: {
      creature: {
        filter: { zone: 'play', type: 'creature' },
        count: 1, // exactly 1 target
        required: true
      }
    },
    move: (state, { targetId, damage }) => {
      const card = state.cards[targetId];
      card.damageTaken += damage;
    }
  },
  
  multiTarget: {
    targets: {
      creatures: {
        filter: { zone: 'play', type: 'creature' },
        count: { min: 1, max: 3 }, // 1-3 targets
        required: true
      }
    },
    move: (state, { targetIds }) => {
      for (const id of targetIds) {
        // apply effect to each
      }
    }
  }
};

// Enumerator automatically generates all valid target combinations
const moves = enumerator.enumerateValidMoves(state, playerId);
// Returns:
// [
//   { name: 'dealDamage', args: { targetId: 'card-1', damage: 3 } },
//   { name: 'dealDamage', args: { targetId: 'card-2', damage: 3 } },
//   { name: 'multiTarget', args: { targetIds: ['card-1'] } },
//   { name: 'multiTarget', args: { targetIds: ['card-1', 'card-2'] } },
//   // ... all valid combinations
// ]
```

### AI Integration

```typescript
// Simple AI using move enumeration
class SimpleAI {
  selectMove(state: GameState, playerId: PlayerId): EnumeratedMove {
    const validMoves = enumerator.enumerateValidMoves(state, playerId);
    
    // Random AI: pick random move
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }
}

// Heuristic AI using evaluation
class HeuristicAI {
  selectMove(state: GameState, playerId: PlayerId): EnumeratedMove {
    const validMoves = enumerator.enumerateValidMoves(state, playerId);
    
    // Score each move
    const scoredMoves = validMoves.map(move => ({
      move,
      score: this.evaluateMove(state, move)
    }));
    
    // Pick best move
    return scoredMoves.sort((a, b) => b.score - a.score)[0].move;
  }
  
  private evaluateMove(state: GameState, move: EnumeratedMove): number {
    // Game-specific heuristics
    // E.g., prefer playing high-power creatures, dealing damage to opponent, etc.
    return 0;
  }
}
```

---

## 5. Seeded RNG System

### Overview

Deterministic random number generation using seeds, ensuring replay consistency and enabling reproducible testing.

### RNG API

```typescript
type SeededRNG = {
  // Get current seed
  getSeed(): string;
  
  // Set seed (for replay)
  setSeed(seed: string): void;
  
  // Generate random number [0, 1)
  random(): number;
  
  // Generate random integer [min, max)
  randomInt(min: number, max: number): number;
  
  // Pick random element from array
  pick<T>(array: T[]): T;
  
  // Shuffle array (Fisher-Yates with seed)
  shuffle<T>(array: T[]): T[];
  
  // Roll dice
  rollDice(sides: number): number;
  
  // Flip coin
  flipCoin(): 'heads' | 'tails';
  
  // Create child RNG (for sub-operations)
  createChild(): SeededRNG;
};
```

### Integration with Moves

```typescript
// RNG is provided to move reducers via context
moves: {
  shuffleDeck: {
    move: (state, _, { rng }) => {
      state.zones.deck.cards = rng.shuffle(state.zones.deck.cards);
    }
  },
  
  rollDice: {
    move: (state, { playerId }, { rng }) => {
      const roll = rng.rollDice(6);
      state.players[playerId].lastRoll = roll;
      
      if (roll >= 4) {
        // success
      }
    }
  },
  
  drawRandomCard: {
    move: (state, { playerId }, { rng }) => {
      const card = rng.pick(state.zones.deck.cards);
      // move card to hand
    }
  }
};

// Move execution includes RNG context
type MoveContext = {
  rng: SeededRNG;
  timestamp: number;
  playerId: PlayerId;
};
```

### Seeding Strategy

```typescript
// Game initialization with seed
const game = new RuleEngine(definition, {
  seed: 'game-12345-seed', // deterministic replay
});

// Auto-generate seed if not provided
const game2 = new RuleEngine(definition); 
// seed = nanoid() or timestamp-based

// Get seed for replay
const seed = game.getSeed();

// Replay with same seed produces identical results
const replay = new RuleEngine(definition, { seed });
replay.replay(actionLog); // identical state
```

### Testing with Seeds

```typescript
describe('Deck shuffling', () => {
  it('produces same order with same seed', () => {
    const game1 = new RuleEngine(definition, { seed: 'test-seed-1' });
    game1.executeMove({ name: 'shuffleDeck' });
    
    const game2 = new RuleEngine(definition, { seed: 'test-seed-1' });
    game2.executeMove({ name: 'shuffleDeck' });
    
    expect(game1.getState().zones.deck.cards).toEqual(
      game2.getState().zones.deck.cards
    );
  });
  
  it('produces different order with different seed', () => {
    const game1 = new RuleEngine(definition, { seed: 'seed-1' });
    game1.executeMove({ name: 'shuffleDeck' });
    
    const game2 = new RuleEngine(definition, { seed: 'seed-2' });
    game2.executeMove({ name: 'shuffleDeck' });
    
    expect(game1.getState().zones.deck.cards).not.toEqual(
      game2.getState().zones.deck.cards
    );
  });
});
```

---

## 6. XState Flow Management

### Overview

Using XState for turn/phase/step orchestration provides:
- Visualizable state machines
- Guard conditions for transitions
- Actions on enter/exit
- Hierarchical states (nested phases/steps)
- Built-in history and replay

### Flow Definition with XState

```typescript
import { createMachine, assign } from 'xstate';

type FlowContext = {
  currentPlayer: PlayerId;
  turnNumber: number;
  phaseData: Record<string, unknown>;
};

type FlowEvent =
  | { type: 'NEXT_PHASE' }
  | { type: 'PASS_PRIORITY' }
  | { type: 'EXECUTE_MOVE'; move: Move }
  | { type: 'END_TURN' };

const gameMachine = createMachine<FlowContext, FlowEvent>({
  id: 'tcg-game',
  initial: 'setup',
  context: {
    currentPlayer: 'player1',
    turnNumber: 1,
    phaseData: {}
  },
  states: {
    setup: {
      on: {
        NEXT_PHASE: 'gameplay'
      }
    },
    gameplay: {
      initial: 'turnStart',
      states: {
        turnStart: {
          entry: 'onTurnStart',
          on: {
            NEXT_PHASE: 'draw'
          }
        },
        draw: {
          entry: 'onDrawPhaseStart',
          on: {
            NEXT_PHASE: {
              target: 'main1',
              guard: 'hasDrawnCard'
            }
          }
        },
        main1: {
          entry: 'onMain1Start',
          on: {
            EXECUTE_MOVE: {
              actions: 'executeMove'
            },
            NEXT_PHASE: 'combat'
          }
        },
        combat: {
          initial: 'declareAttackers',
          states: {
            declareAttackers: {
              on: {
                NEXT_PHASE: {
                  target: 'declareBlockers',
                  guard: 'attackersDeclared'
                }
              }
            },
            declareBlockers: {
              on: {
                NEXT_PHASE: 'damage'
              }
            },
            damage: {
              entry: 'resolveCombatDamage',
              on: {
                NEXT_PHASE: '#tcg-game.gameplay.main2'
              }
            }
          }
        },
        main2: {
          on: {
            NEXT_PHASE: 'end'
          }
        },
        end: {
          entry: 'onTurnEnd',
          on: {
            NEXT_PHASE: {
              target: 'turnStart',
              actions: 'nextPlayer'
            }
          }
        }
      }
    },
    gameOver: {
      type: 'final'
    }
  }
}, {
  actions: {
    onTurnStart: assign((context) => ({
      turnNumber: context.turnNumber + 1
    })),
    executeMove: (context, event) => {
      if (event.type === 'EXECUTE_MOVE') {
        // Execute move through engine
      }
    },
    nextPlayer: assign((context) => ({
      currentPlayer: getNextPlayer(context.currentPlayer)
    }))
  },
  guards: {
    hasDrawnCard: (context) => {
      // Check if player has drawn
      return true;
    },
    attackersDeclared: (context) => {
      // Check if attackers were declared
      return true;
    }
  }
});
```

### Integration with Engine

```typescript
type GameDefinition<TState, TMoves> = {
  // ... other properties
  
  // XState machine for flow
  flowMachine: StateMachine<FlowContext, FlowEvent>;
  
  // Map game state to flow context
  getFlowContext: (state: TState) => FlowContext;
  
  // Map flow context back to game state
  applyFlowContext: (state: Draft<TState>, context: FlowContext) => void;
};

// Engine manages both game state and flow state
class RuleEngine<TState, TMoves> {
  private gameState: TState;
  private flowService: ActorRef<FlowEvent>;
  
  constructor(definition: GameDefinition<TState, TMoves>) {
    this.flowService = interpret(definition.flowMachine).start();
    
    // Sync flow transitions to game state
    this.flowService.subscribe((state) => {
      this.onFlowTransition(state);
    });
  }
  
  executeMove(move: Move<TMoves>): MoveResult {
    // Execute move on game state
    const result = this.applyMove(move);
    
    // Send event to flow machine
    this.flowService.send({ type: 'EXECUTE_MOVE', move });
    
    return result;
  }
  
  nextPhase(): void {
    this.flowService.send({ type: 'NEXT_PHASE' });
  }
}
```

### Benefits of XState

1. **Visualization**: Generate state diagrams automatically
2. **Type Safety**: Full TypeScript support with context and events
3. **Testing**: Easy to test state transitions in isolation
4. **History**: Built-in state history for debugging
5. **Hierarchical**: Nested states for complex flows (sub-phases, sub-steps)
6. **Deterministic**: Same events always produce same transitions

---

## Summary

These seven first-class features form the foundation of a comprehensive TCG framework:

1. **Zone Management** - Cards live in zones with visibility rules (private/public/secret)
2. **Card State** - Generic card instance model with mandatory core fields + game-specific extensions
3. **Computed Properties** - Pure functions for derived values (power = base + modifiers)
4. **Card Filtering DSL** - Query cards declaratively with type-safe filters
5. **Targeting System** - Comprehensive targeting infrastructure with validation, restrictions, and multi-target support
6. **AI Move Enumeration** - Generate all valid moves and targets for AI
7. **Seeded RNG** - Deterministic randomness for replay consistency
8. **XState Flow** - Visualizable, type-safe turn orchestration

Together, these features enable developers to build any TCG without reinventing core infrastructure.

