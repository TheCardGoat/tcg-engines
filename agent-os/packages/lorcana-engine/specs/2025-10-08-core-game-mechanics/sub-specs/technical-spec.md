# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/packages/lorcana-engine/specs/2025-10-08-core-game-mechanics/spec.md

## Technical Requirements

### 1. Game State Type Definition

**File**: `src/types/lorcana-state.ts`

Define `LorcanaState` type extending `@tcg/core` GameState:

```typescript
import type { GameState, PlayerId, CardId } from "@tcg/core";

export type LorcanaState = GameState & {
  lorcana: {
    // Lore tracking (win at 20)
    lore: Record<PlayerId, number>;
    
    // Ink tracking
    ink: {
      available: Record<PlayerId, number>;
      total: Record<PlayerId, number>;
      usedInkThisTurn: Record<PlayerId, boolean>;
    };
    
    // Challenge state during challenge resolution
    challengeState?: {
      attacker: CardId;
      defender: CardId;
      attackerDamage: number;
      defenderDamage: number;
    };
    
    // Turn metadata
    turnMetadata: {
      cardsPlayedThisTurn: CardId[];
      charactersQuestingThisTurn: CardId[];
      inkedThisTurn: boolean;
    };
    
    // Character states
    characterStates: Record<CardId, {
      playedThisTurn: boolean; // "drying" character
      damage: number;
      exerted: boolean;
    }>;
    
    // Item/Location states
    permanentStates: Record<CardId, {
      damage: number; // for locations
      exerted: boolean; // for items (though items don't exert in Lorcana)
    }>;
  };
};
```

**Rules References**: 
- Section 3.1 (Starting a Game) - lore starts at 0
- Section 4.2.2 (Set Step) - "drying" characters
- Section 4.3.3 (Inkwell) - once per turn
- Section 9 (Damage Counters)

### 2. Zone Configuration

**File**: `src/game-definition/zones.ts`

```typescript
import type { ZoneDefinition } from "@tcg/core";

export const lorcanaZones = {
  deck: {
    visibility: "owner", // private zone (Rule 8.2.2)
    ordered: true, // cards remain in order
    facedown: true,
  },
  hand: {
    visibility: "owner", // private zone (Rule 8.3.2)
    ordered: false,
    facedown: false,
  },
  play: {
    visibility: "all", // public zone (Rule 8.4.3)
    ordered: false,
    facedown: false,
  },
  discard: {
    visibility: "all", // public zone (Rule 8.6.3)
    ordered: true, // maintain order
    facedown: false,
  },
  inkwell: {
    visibility: "owner", // private zone (Rule 8.5.3)
    ordered: false,
    facedown: true, // always facedown (Rule 8.5.2)
  },
} satisfies Record<string, ZoneDefinition>;
```

**Rules References**:
- Section 8.2 (Deck) - private, ordered, facedown
- Section 8.3 (Hand) - private, can rearrange
- Section 8.4 (Play) - public, all can see
- Section 8.5 (Inkwell) - private, facedown
- Section 8.6 (Discard) - public, ordered

### 3. Turn Flow Definition

**File**: `src/game-definition/flow.ts`

Implement turn flow with three phases and Beginning Phase steps:

```typescript
// Phases: Beginning → Main → End of Turn
// Beginning has 3 steps: Ready → Set → Draw

export const beginningPhase = {
  ready: {
    onEnter: (state: Draft<LorcanaState>) => {
      const activePlayer = state.currentPlayer;
      // Ready all cards in play and inkwell (Rule 4.2.1.1)
      readyAllCards(state, activePlayer);
      // Apply "During your turn" effects (Rule 4.2.1.2)
      applyDuringYourTurnEffects(state, activePlayer);
      // End "at start of turn" effects (Rule 4.2.1.3)
      endAtStartOfTurnEffects(state, activePlayer);
      // Trigger "at start of turn" abilities (Rule 4.2.1.4)
      triggerStartOfTurnAbilities(state, activePlayer);
    },
  },
  set: {
    onEnter: (state: Draft<LorcanaState>) => {
      const activePlayer = state.currentPlayer;
      // Characters no longer "drying" (Rule 4.2.2.1)
      markCharactersAsDry(state, activePlayer);
      // Gain lore from locations (Rule 4.2.2.2)
      gainLocationLore(state, activePlayer);
      // Resolve start-of-turn triggers from Ready step (Rule 4.2.2.3)
      resolveBag(state);
    },
  },
  draw: {
    onEnter: (state: Draft<LorcanaState>) => {
      // Skip draw on first turn (Rule 4.2.3.2)
      if (!isFirstTurn(state)) {
        const activePlayer = state.currentPlayer;
        drawCard(state, activePlayer);
      }
      // Resolve any triggered effects (Rule 4.2.3.3)
      resolveBag(state);
    },
  },
};

export const mainPhase = {
  // Player can take turn actions in any order (Rule 4.3)
  // No automatic transitions - player-driven
};

export const endOfTurnPhase = {
  onEnter: (state: Draft<LorcanaState>) => {
    // Add end-of-turn triggers to bag (Rule 4.4.1.1)
    triggerEndOfTurnAbilities(state);
    // Resolve all triggers (Rule 4.4.1.2)
    resolveBag(state);
    // End "this turn" effects (Rule 4.4.1.3)
    endThisTurnEffects(state);
    // Transition to next player (Rule 4.4.1.4)
    advanceToNextPlayer(state);
  },
};
```

**Rules References**:
- Section 4.1 (Phases) - three phases
- Section 4.2 (Beginning Phase) - Ready, Set, Draw steps
- Section 4.3 (Main Phase) - turn actions
- Section 4.4 (End of Turn Phase) - cleanup and advance

### 4. Core Move Implementations

#### 4.1 Play Card Move

**File**: `src/moves/play-card.ts`

```typescript
export const playCardMove: Move<LorcanaState, PlayCardParams> = {
  validate: (state, context) => {
    const { playerId, params } = context;
    const { cardId, alternateCost } = params;
    
    // Must be active player (Rule 4.3.4.2)
    if (state.currentPlayer !== playerId) {
      return { valid: false, error: "Not your turn" };
    }
    
    // Must be Main Phase
    if (state.phase !== "main") {
      return { valid: false, error: "Can only play cards in Main Phase" };
    }
    
    // Card must be in hand
    if (!isCardInZone(state, cardId, "hand", playerId)) {
      return { valid: false, error: "Card not in hand" };
    }
    
    // Calculate total cost (Rule 4.3.4.5)
    const totalCost = calculateTotalCost(state, cardId, alternateCost);
    
    // Check if player can pay cost (Rule 4.3.4.6)
    if (!canPayCost(state, playerId, totalCost)) {
      return { valid: false, error: "Cannot pay cost" };
    }
    
    return { valid: true };
  },
  
  execute: (state, context) => {
    const { playerId, params } = context;
    const { cardId, alternateCost } = params;
    
    // Pay cost (Rule 4.3.4.6)
    payCost(state, playerId, cardId, alternateCost);
    
    // Card is now "played" (Rule 4.3.4.7)
    const card = getCard(state, cardId);
    
    if (isCharacter(card) || isItem(card) || isLocation(card)) {
      // Move to play zone
      moveCard(state, cardId, "hand", "play");
      
      if (isCharacter(card)) {
        // Mark as "drying" (Rule 4.2.2.1, 6.1.4)
        state.lorcana.characterStates[cardId].playedThisTurn = true;
      }
    } else if (isAction(card)) {
      // Resolve action effect immediately (Rule 4.3.4.7)
      resolveActionEffect(state, card);
      // Move to discard
      moveCard(state, cardId, "hand", "discard");
    }
    
    // Track card played this turn
    state.lorcana.turnMetadata.cardsPlayedThisTurn.push(cardId);
    
    // Trigger "when played" abilities (Rule 4.3.4.8)
    triggerWhenPlayedAbilities(state, cardId);
  },
};
```

#### 4.2 Quest Move

**File**: `src/moves/quest.ts`

```typescript
export const questMove: Move<LorcanaState, QuestParams> = {
  validate: (state, context) => {
    const { playerId, params } = context;
    const { cardId } = params;
    
    // Must be active player
    if (state.currentPlayer !== playerId) {
      return { valid: false, error: "Not your turn" };
    }
    
    // Must be Main Phase
    if (state.phase !== "main") {
      return { valid: false, error: "Can only quest in Main Phase" };
    }
    
    // Must be a character (Rule 4.3.5.1)
    const card = getCard(state, cardId);
    if (!isCharacter(card)) {
      return { valid: false, error: "Only characters can quest" };
    }
    
    // Character must be ready (Rule 4.3.5.5)
    if (state.lorcana.characterStates[cardId].exerted) {
      return { valid: false, error: "Character is exerted" };
    }
    
    // Character must be dry (Rule 4.3.5.5, 6.1.4)
    if (state.lorcana.characterStates[cardId].playedThisTurn) {
      return { valid: false, error: "Character is drying" };
    }
    
    // Character can't have Reckless (Rule 4.3.5.5, 10.5.2)
    if (hasKeyword(card, "reckless")) {
      return { valid: false, error: "Reckless characters cannot quest" };
    }
    
    return { valid: true };
  },
  
  execute: (state, context) => {
    const { playerId, params } = context;
    const { cardId } = params;
    
    // Exert the character (Rule 4.3.5.7)
    state.lorcana.characterStates[cardId].exerted = true;
    
    // Gain lore (Rule 4.3.5.8)
    const card = getCard(state, cardId);
    const loreValue = card.loreValue || 0;
    state.lorcana.lore[playerId] += loreValue;
    
    // Track questing this turn
    state.lorcana.turnMetadata.charactersQuestingThisTurn.push(cardId);
    
    // Trigger "whenever quests" abilities (Rule 4.3.5.9)
    triggerWheneverQuestsAbilities(state, cardId);
  },
};
```

#### 4.3 Challenge Move

**File**: `src/moves/challenge.ts`

```typescript
export const challengeMove: Move<LorcanaState, ChallengeParams> = {
  validate: (state, context) => {
    const { playerId, params } = context;
    const { attackerId, defenderId } = params;
    
    // Must be active player
    if (state.currentPlayer !== playerId) {
      return { valid: false, error: "Not your turn" };
    }
    
    // Attacker must be dry and ready (Rule 4.3.6.6)
    const attackerState = state.lorcana.characterStates[attackerId];
    if (attackerState.playedThisTurn) {
      return { valid: false, error: "Attacker is drying" };
    }
    if (attackerState.exerted) {
      return { valid: false, error: "Attacker is exerted" };
    }
    
    // Defender must be exerted or be a location (Rule 4.3.6.7, 4.3.6.21)
    const defender = getCard(state, defenderId);
    if (isCharacter(defender)) {
      if (!state.lorcana.characterStates[defenderId].exerted) {
        return { valid: false, error: "Can only challenge exerted characters" };
      }
    }
    // Locations can always be challenged (Rule 4.3.6.21)
    
    // Check for challenging restrictions (Rule 4.3.6.8)
    // - Bodyguard: must challenge bodyguard if present
    // - Evasive: only Evasive can challenge Evasive
    const restrictionError = checkChallengingRestrictions(state, attackerId, defenderId);
    if (restrictionError) {
      return { valid: false, error: restrictionError };
    }
    
    return { valid: true };
  },
  
  execute: (state, context) => {
    const { params } = context;
    const { attackerId, defenderId } = params;
    
    // Exert attacker (Rule 4.3.6.9)
    state.lorcana.characterStates[attackerId].exerted = true;
    
    // Set challenge state
    state.lorcana.challengeState = {
      attacker: attackerId,
      defender: defenderId,
      attackerDamage: 0,
      defenderDamage: 0,
    };
    
    // Apply "while challenging" effects (Rule 4.3.6.11)
    applyWhileChallengingEffects(state, attackerId);
    
    // Trigger challenge abilities (Rule 4.3.6.12)
    triggerChallengeAbilities(state, attackerId, defenderId);
    
    // Resolve triggered abilities
    resolveBag(state);
    
    // Challenge Damage step (Rule 4.3.6.13)
    dealChallengeDamage(state);
    
    // Resolve banishment triggers (Rule 4.3.6.17)
    resolveBag(state);
    
    // End "while challenging" effects (Rule 4.3.6.18)
    endWhileChallengingEffects(state);
    
    // Clear challenge state
    state.lorcana.challengeState = undefined;
  },
};
```

#### 4.4 Ink Card Move

**File**: `src/moves/ink-card.ts`

```typescript
export const inkCardMove: Move<LorcanaState, InkCardParams> = {
  validate: (state, context) => {
    const { playerId, params } = context;
    const { cardId } = params;
    
    // Must be active player
    if (state.currentPlayer !== playerId) {
      return { valid: false, error: "Not your turn" };
    }
    
    // Must be Main Phase
    if (state.phase !== "main") {
      return { valid: false, error: "Can only ink in Main Phase" };
    }
    
    // Can only ink once per turn (Rule 4.3.3)
    if (state.lorcana.turnMetadata.inkedThisTurn) {
      return { valid: false, error: "Already inked this turn" };
    }
    
    // Card must be in hand
    if (!isCardInZone(state, cardId, "hand", playerId)) {
      return { valid: false, error: "Card not in hand" };
    }
    
    // Card must have inkwell symbol (Rule 4.3.3.1)
    const card = getCard(state, cardId);
    if (!card.inkable) {
      return { valid: false, error: "Card is not inkable" };
    }
    
    return { valid: true };
  },
  
  execute: (state, context) => {
    const { playerId, params } = context;
    const { cardId } = params;
    
    // Move card to inkwell facedown and ready (Rule 4.3.3.2)
    moveCard(state, cardId, "hand", "inkwell");
    
    // Increase ink total
    state.lorcana.ink.total[playerId] += 1;
    state.lorcana.ink.available[playerId] += 1;
    
    // Mark as inked this turn
    state.lorcana.turnMetadata.inkedThisTurn = true;
    
    // Trigger any inkwell abilities (Rule 4.3.3.3)
    triggerInkwellAbilities(state, cardId);
  },
};
```

#### 4.5 Pass Turn Move

**File**: `src/moves/pass-turn.ts`

```typescript
export const passTurnMove: Move<LorcanaState> = {
  validate: (state, context) => {
    const { playerId } = context;
    
    // Must be active player
    if (state.currentPlayer !== playerId) {
      return { valid: false, error: "Not your turn" };
    }
    
    // Must be Main Phase
    if (state.phase !== "main") {
      return { valid: false, error: "Can only pass turn from Main Phase" };
    }
    
    // No abilities waiting to resolve (Rule 4.4.1)
    if (hasPendingAbilities(state)) {
      return { valid: false, error: "Abilities waiting to resolve" };
    }
    
    // All Reckless characters must have challenged if able (Rule 10.5.3)
    const recklessError = checkRecklessRequirement(state, playerId);
    if (recklessError) {
      return { valid: false, error: recklessError };
    }
    
    return { valid: true };
  },
  
  execute: (state, context) => {
    // Transition to End of Turn Phase
    // Flow system handles End of Turn Phase logic
    state.phase = "endOfTurn";
  },
};
```

### 5. Setup System

**File**: `src/game-definition/setup.ts`

```typescript
export const setupLorcanaGame = (config: GameConfig): LorcanaState => {
  const { players, seed } = config;
  
  // Create RNG with seed
  const rng = createSeededRNG(seed);
  
  // Initialize base state
  const state: LorcanaState = {
    // Core framework state
    players: Object.keys(players),
    currentPlayer: null,
    turn: 0,
    phase: "setup",
    zones: initializeZones(players),
    cards: {},
    
    // Lorcana-specific state
    lorcana: {
      lore: {},
      ink: {
        available: {},
        total: {},
        usedInkThisTurn: {},
      },
      turnMetadata: {
        cardsPlayedThisTurn: [],
        charactersQuestingThisTurn: [],
        inkedThisTurn: false,
      },
      characterStates: {},
      permanentStates: {},
    },
  };
  
  // Initialize lore and ink for each player (Rule 3.1.4)
  for (const playerId of Object.keys(players)) {
    state.lorcana.lore[playerId] = 0;
    state.lorcana.ink.available[playerId] = 0;
    state.lorcana.ink.total[playerId] = 0;
    state.lorcana.ink.usedInkThisTurn[playerId] = false;
  }
  
  // Determine starting player randomly (Rule 3.1.2)
  state.currentPlayer = determineStartingPlayer(players, rng);
  
  // Shuffle decks and deal starting hands (Rule 3.1.3, 3.1.5)
  for (const [playerId, playerConfig] of Object.entries(players)) {
    // Load deck cards
    const deckCards = loadDeckCards(playerConfig.deckId);
    
    // Shuffle deck
    shuffleDeck(state, playerId, deckCards, rng);
    
    // Draw 7 cards (Rule 3.1.5)
    for (let i = 0; i < 7; i++) {
      drawCard(state, playerId);
    }
  }
  
  // Allow mulligan (alter hands) in turn order (Rule 3.1.6)
  // This would require interaction, so store pending mulligan state
  // Or auto-mulligan based on config
  
  return state;
};
```

### 6. Triggered Ability System ("The Bag")

**File**: `src/game-definition/bag.ts`

```typescript
// The "bag" is where triggered abilities wait to resolve (Rule 1.7, 8.7)

type TriggeredAbility = {
  abilityId: string;
  sourceCardId: CardId;
  playerId: PlayerId;
  effect: (state: Draft<LorcanaState>) => void;
};

export const addToBag = (
  state: Draft<LorcanaState>,
  ability: TriggeredAbility
) => {
  // Add to player's bag section
  if (!state.bag) state.bag = {};
  if (!state.bag[ability.playerId]) state.bag[ability.playerId] = [];
  state.bag[ability.playerId].push(ability);
};

export const resolveBag = (state: Draft<LorcanaState>) => {
  // Active player resolves all their abilities first (Rule 8.7.4, 8.7.5)
  const activePlayer = state.currentPlayer;
  while (hasAbilitiesInBag(state, activePlayer)) {
    const ability = chooseAbilityFromBag(state, activePlayer);
    resolveAbility(state, ability);
    // New triggers may be added during resolution (Rule 8.7.4)
  }
  
  // Then each opponent in turn order (Rule 8.7.6)
  for (const playerId of getOpponentsInTurnOrder(state)) {
    while (hasAbilitiesInBag(state, playerId)) {
      const ability = chooseAbilityFromBag(state, playerId);
      resolveAbility(state, ability);
    }
  }
};
```

### 7. Game State Check System

**File**: `src/game-definition/game-state-check.ts`

```typescript
// Game state check occurs after steps, actions, and abilities (Rule 1.9.2)

export const performGameStateCheck = (state: Draft<LorcanaState>) => {
  let hasChanges = true;
  
  // Repeat until no more required actions (Rule 1.9.2)
  while (hasChanges) {
    hasChanges = false;
    
    // Check win conditions first (Rule 1.9.2)
    for (const playerId of state.players) {
      // 20+ lore wins (Rule 1.9.1.1, 3.2.1.1)
      if (state.lorcana.lore[playerId] >= 20) {
        state.winner = playerId;
        state.gameOver = true;
        return;
      }
      
      // Attempted draw from empty deck loses (Rule 1.9.1.2, 3.2.1.2)
      if (state.attemptedDrawWithEmptyDeck?.[playerId]) {
        state.losers = state.losers || [];
        state.losers.push(playerId);
        hasChanges = true;
      }
    }
    
    // Check other required actions (Rule 1.9.2)
    // Banish characters/locations with damage >= Willpower (Rule 1.9.1.3)
    for (const [cardId, charState] of Object.entries(state.lorcana.characterStates)) {
      const card = state.cards[cardId];
      if (charState.damage >= card.willpower) {
        banishCard(state, cardId);
        hasChanges = true;
      }
    }
    
    // Check locations
    for (const [cardId, permState] of Object.entries(state.lorcana.permanentStates)) {
      const card = state.cards[cardId];
      if (isLocation(card) && permState.damage >= card.willpower) {
        banishCard(state, cardId);
        hasChanges = true;
      }
    }
  }
  
  // Add triggered abilities from game state check to bag (Rule 1.9.4)
  addTriggeredAbilitiesToBag(state);
};
```

## Implementation Notes

### Test-Driven Development

All implementations must follow TDD principles:

1. Write failing test for specific rule behavior
2. Implement minimal code to pass test
3. Refactor if beneficial
4. All tests reference Comprehensive Rules section numbers

### Type Safety

- Use branded types for IDs: `CardId`, `PlayerId`, `ZoneId`
- No `any` types allowed
- All move parameters validated through type system
- Use discriminated unions for card types

### Immutability

- All state changes through Immer's Draft type
- No direct mutations outside of move executors
- Delta patches automatically generated by framework

### Rules Accuracy

Every implementation must reference specific Comprehensive Rules sections:
- Comment with rule numbers (e.g., `// Rule 4.3.5.7`)
- Test names reference rules
- Validation matches exact rule conditions

### Integration with @tcg/core

- Extend framework types, don't replace
- Use framework's zone system
- Use framework's move validation pattern
- Use framework's triggered ability queue
- Use framework's game state check hooks

## Testing Requirements

### Unit Tests

- Each move has validation tests covering all rule conditions
- Each move has execution tests verifying state transformations
- Zone transitions tested for each move
- Cost calculation tested with modifiers

### Integration Tests

- Complete turn cycle from Beginning to End
- Full game from setup to 20 lore win
- Full game from setup to deck-out loss
- Challenge with character banishment
- Triggered ability priority resolution

### Rule Coverage Tests

Test files must reference specific rules:
- `play-card-rules.test.ts` - covers Rules 4.3.4.x
- `quest-rules.test.ts` - covers Rules 4.3.5.x
- `challenge-rules.test.ts` - covers Rules 4.3.6.x
- `turn-structure-rules.test.ts` - covers Rules 4.1-4.4
- `game-state-check-rules.test.ts` - covers Rules 1.9.x

## File Structure

```
src/
├── types/
│   ├── lorcana-state.ts
│   ├── lorcana-moves.ts
│   └── index.ts
├── game-definition/
│   ├── lorcana-game-definition.ts
│   ├── zones.ts
│   ├── flow.ts
│   ├── setup.ts
│   ├── bag.ts
│   ├── game-state-check.ts
│   └── index.ts
├── moves/
│   ├── play-card.ts
│   ├── quest.ts
│   ├── challenge.ts
│   ├── ink-card.ts
│   ├── pass-turn.ts
│   └── index.ts
└── __tests__/
    ├── integration/
    │   ├── complete-turn-cycle.test.ts
    │   ├── lore-win.test.ts
    │   ├── deck-out-loss.test.ts
    │   └── challenge-banishment.test.ts
    └── rules/
        ├── play-card-rules.test.ts
        ├── quest-rules.test.ts
        ├── challenge-rules.test.ts
        ├── turn-structure-rules.test.ts
        └── game-state-check-rules.test.ts
```

## Success Criteria

1. All tests pass with `bun test`
2. Type checking passes with `tsc --noEmit`
3. Linting passes with `biome check`
4. Integration tests demonstrate complete game scenarios
5. Each move validated against Comprehensive Rules
6. Game state checks work correctly
7. Triggered ability "bag" system functions properly
8. Turn structure follows three-phase model with proper steps

