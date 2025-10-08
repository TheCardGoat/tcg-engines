# Engine Integration Guide

Complete guide for building trading card game engines using the `@tcg/core` framework.

## Table of Contents

1. [Overview](#overview)
2. [Package Setup](#package-setup)
3. [Game Definition](#game-definition)
4. [State Shape Design](#state-shape-design)
5. [Zone Configuration](#zone-configuration)
6. [Move System](#move-system)
7. [Flow Definition](#flow-definition)
8. [Card System](#card-system)
9. [Ability System](#ability-system)
10. [Testing Strategy](#testing-strategy)
11. [Best Practices](#best-practices)

---

## Overview

The `@tcg/core` framework provides a foundation for building trading card game engines with:

- **Immutable state management** via Immer
- **Delta-based synchronization** via Immer patches
- **Turn/phase/step orchestration** via XState flows
- **Type-safe move system** with validation and execution
- **Zone management** for cards (deck, hand, play, discard, etc.)
- **Deterministic gameplay** with seeded RNG

Your game engine extends this foundation by:

1. Defining game-specific state shape
2. Implementing move handlers for player actions
3. Configuring zones and their properties
4. Defining turn/phase/step flow
5. Creating card definitions and abilities

---

## Package Setup

### Directory Structure

Create your package with this recommended structure:

```
packages/your-game-engine/
├── src/
│   ├── game-definition/
│   │   ├── your-game-definition.ts
│   │   ├── state-shape.ts
│   │   ├── zones.ts
│   │   ├── flow.ts
│   │   ├── setup.ts
│   │   └── index.ts
│   ├── moves/
│   │   ├── move-1.ts
│   │   ├── move-2.ts
│   │   ├── validators/
│   │   └── index.ts
│   ├── cards/
│   │   ├── card-definitions/
│   │   ├── abilities/
│   │   ├── card-types.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── game-state.ts
│   │   ├── moves.ts
│   │   ├── cards.ts
│   │   └── index.ts
│   ├── queries/
│   │   ├── card-queries.ts
│   │   ├── game-queries.ts
│   │   └── index.ts
│   ├── rules/
│   │   ├── validators/
│   │   ├── effects/
│   │   └── index.ts
│   └── index.ts
├── package.json
├── tsconfig.json
├── biome.json
├── turbo.json
└── README.md
```

### package.json

```json
{
  "name": "@tcg/your-game",
  "version": "0.1.0",
  "description": "Your TCG engine built with @tcg/core",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.d.ts",
  "dependencies": {
    "@tcg/core": "workspace:*"
  },
  "devDependencies": {
    "@biomejs/biome": "2.0.4",
    "@types/bun": "1.2.14",
    "typescript": "5.8.3"
  }
}
```

### tsconfig.json

```json
{
  "extends": "../typescript-config/base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true
  }
}
```

### Boundaries Configuration

Use Turborepo boundaries to enforce dependencies:

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "extends": ["//"],
  "tags": ["game-engine"],
  "boundaries": {
    "tags": {
      "game-engine": {
        "dependencies": {
          "allow": ["@tcg/core"]
        }
      }
    }
  }
}
```

---

## Game Definition

The `GameDefinition` is the central configuration that tells the framework how your game works.

### Basic Structure

```typescript
// src/game-definition/your-game-definition.ts
import { createGameDefinition, type Player } from "@tcg/core";
import type { YourGameState } from "./state-shape";
import { yourGameZones } from "./zones";
import { yourGameFlow } from "./flow";
import { setupYourGame } from "./setup";
import { yourGameMoves } from "../moves";

export const yourGame = createGameDefinition<YourGameState>({
  // Unique game identifier
  id: "your-game",
  
  // Display name
  name: "Your Game Name",
  
  // Version (for compatibility checking)
  version: "1.0.0",
  
  // Player count constraints
  players: {
    min: 2,
    max: 2,  // or 4, 6, etc.
  },
  
  // Register all moves
  moves: yourGameMoves,
  
  // Zone configuration
  zones: yourGameZones,
  
  // Flow definition (turn/phase/step)
  flow: yourGameFlow,
  
  // Setup function
  setup: setupYourGame,
});

export type YourGame = typeof yourGame;
```

### Creating Game Instances

```typescript
import { RuleEngine } from "@tcg/core";
import { yourGame } from "./game-definition";

// Create engine
const engine = new RuleEngine(yourGame, {
  seed: "deterministic-seed",
});

// Setup initial state
const players: Player[] = [
  { id: "player1", name: "Alice" },
  { id: "player2", name: "Bob" },
];

const initialState = engine.setup({ players });
```

---

## State Shape Design

Define game-specific state that extends the base `GameState`.

### Base GameState

The framework provides:

```typescript
type GameState = {
  // Game metadata
  gameId: GameId;
  seed: string;
  
  // Players
  players: Record<PlayerId, Player>;
  currentPlayer: PlayerId;
  
  // Zones (populated based on zone config)
  zones: Record<ZoneId, Record<PlayerId, CardInstanceId[]>>;
  
  // Card instances
  cards: Record<CardInstanceId, CardInstance>;
  
  // Flow state (current phase/step)
  flow: FlowState;
  
  // History for replays
  history: HistoryEntry[];
};
```

### Extending GameState

Add game-specific data:

```typescript
// src/game-definition/state-shape.ts
import type { GameState, PlayerId, CardId } from "@tcg/core";

export type YourGameState = GameState & {
  yourGame: {
    // Game-specific resources
    resources: Record<PlayerId, {
      mana: number;
      health: number;
      // etc.
    }>;
    
    // Win condition tracking
    victoryPoints: Record<PlayerId, number>;
    
    // Temporary state during moves
    combatState?: {
      attacker: CardId;
      defender?: CardId;
      damage: number;
    };
    
    // Turn metadata
    turnMetadata: {
      cardsPlayedThisTurn: CardId[];
      actionsRemaining: number;
    };
    
    // Any other game-specific state
  };
};
```

### Design Principles

1. **Keep base `GameState` unchanged** - Add game-specific data to a namespaced property
2. **Use branded types** - `PlayerId`, `CardId`, etc. for type safety
3. **Avoid duplication** - Don't duplicate data that exists in `GameState`
4. **Nullable temporary state** - Use optional properties for transient state (like combat)
5. **Record for player data** - Use `Record<PlayerId, T>` for per-player data

---

## Zone Configuration

Zones are where cards exist during gameplay (deck, hand, play, discard, etc.).

### Defining Zones

```typescript
// src/game-definition/zones.ts
import type { ZoneConfiguration } from "@tcg/core";

export const yourGameZones: ZoneConfiguration = {
  // Deck - ordered, only owner sees
  deck: {
    visibility: "owner",
    ordered: true,
    shuffle: true,
  },
  
  // Hand - unordered, only owner sees
  hand: {
    visibility: "owner",
    ordered: false,
  },
  
  // Play zone - unordered, all players see
  play: {
    visibility: "all",
    ordered: false,
  },
  
  // Discard pile - ordered, all players see
  discard: {
    visibility: "all",
    ordered: true,
  },
  
  // Exile/banish zone - unordered, all see
  exile: {
    visibility: "all",
    ordered: false,
  },
};
```

### Zone Properties

- **`visibility`**: Who can see cards in this zone
  - `"all"` - All players can see
  - `"owner"` - Only the owner can see
  - `"none"` - No one can see (face-down)
  
- **`ordered`**: Whether card order matters
  - `true` - Order preserved (deck, discard pile)
  - `false` - Order doesn't matter (hand, play)
  
- **`shuffle`**: Whether zone should be shuffled on creation
  - `true` - Shuffle (deck)
  - `false` - Don't shuffle

### Zone Operations

The framework provides zone operations:

```typescript
import { 
  moveCard,
  getCardsInZone,
  shuffleZone,
  drawCard,
} from "@tcg/core";

// Move card between zones
moveCard(state, cardId, "hand", "play");

// Get all cards in zone
const handCards = getCardsInZone(state, "hand", playerId);

// Shuffle zone
shuffleZone(state, "deck", playerId, rng);

// Draw card
const drawnCard = drawCard(state, playerId);
```

---

## Move System

Moves are player actions that modify game state (play card, attack, pass turn, etc.).

### Move Structure

Each move has two parts: validation and execution.

```typescript
// src/moves/play-card.ts
import type { Move, MoveContext } from "@tcg/core";
import type { YourGameState } from "../types";

export const playCardMove: Move<YourGameState> = {
  // Unique move identifier
  id: "playCard",
  
  // Validate move is legal
  validate: (state: YourGameState, context: MoveContext) => {
    const { playerId, params } = context;
    const { cardId } = params;
    
    // Check it's player's turn
    if (state.currentPlayer !== playerId) {
      return {
        valid: false,
        error: "Not your turn",
        errorCode: "NOT_YOUR_TURN",
      };
    }
    
    // Check card is in hand
    if (!isCardInZone(state, cardId, "hand", playerId)) {
      return {
        valid: false,
        error: "Card not in hand",
        errorCode: "CARD_NOT_IN_HAND",
      };
    }
    
    // Check resource cost
    const cost = getCardCost(state, cardId);
    const available = getAvailableResources(state, playerId);
    if (available < cost) {
      return {
        valid: false,
        error: "Insufficient resources",
        errorCode: "INSUFFICIENT_RESOURCES",
      };
    }
    
    return { valid: true };
  },
  
  // Execute move (state is Immer draft)
  execute: (state: YourGameState, context: MoveContext) => {
    const { playerId, params } = context;
    const { cardId } = params;
    
    // Move card from hand to play
    moveCard(state, cardId, "hand", "play");
    
    // Deduct resource cost
    const cost = getCardCost(state, cardId);
    state.yourGame.resources[playerId].mana -= cost;
    
    // Mark card as played this turn
    state.cards[cardId].playedThisTurn = true;
    state.yourGame.turnMetadata.cardsPlayedThisTurn.push(cardId);
    
    // Trigger "when played" abilities
    triggerPlayedAbilities(state, cardId);
  },
};
```

### Move Parameters

Define type-safe move parameters:

```typescript
// src/types/moves.ts
export type PlayCardParams = {
  cardId: CardId;
  targets?: CardId[];
};

export type AttackParams = {
  attackerId: CardId;
  defenderId?: CardId;  // undefined for direct attack
};

export type PassTurnParams = {
  // No params needed
};
```

### Registering Moves

```typescript
// src/moves/index.ts
import { playCardMove } from "./play-card";
import { attackMove } from "./attack";
import { passTurnMove } from "./pass-turn";

export const yourGameMoves = {
  playCard: playCardMove,
  attack: attackMove,
  passTurn: passTurnMove,
  // ... other moves
};

export type YourGameMoves = typeof yourGameMoves;
```

### Validation Pattern

Extract validation logic into reusable functions:

```typescript
// src/moves/validators/play-card-validator.ts
export const canPlayCard = (
  state: YourGameState,
  playerId: PlayerId,
  cardId: CardId
): boolean => {
  return (
    isPlayersTurn(state, playerId) &&
    isCardInHand(state, cardId, playerId) &&
    hasEnoughResources(state, playerId, cardId) &&
    isValidPhase(state, "main")
  );
};
```

### Execution Pattern

With Immer, mutate state directly in execute:

```typescript
execute: (state, context) => {
  // Direct mutations work
  state.yourGame.resources[playerId].mana -= cost;
  state.zones.hand[playerId] = state.zones.hand[playerId].filter(
    id => id !== cardId
  );
  state.zones.play[playerId].push(cardId);
}
```

---

## Flow Definition

Define turn/phase/step structure using XState state machine.

### Basic Flow

```typescript
// src/game-definition/flow.ts
import { createFlow } from "@tcg/core";

export const yourGameFlow = createFlow({
  id: "yourGameFlow",
  initial: "turnStart",
  
  states: {
    turnStart: {
      on: {
        START_TURN: "beginningPhase",
      },
    },
    
    beginningPhase: {
      on: {
        READY_STEP_COMPLETE: "drawStep",
      },
    },
    
    drawStep: {
      on: {
        DRAW_COMPLETE: "mainPhase",
      },
    },
    
    mainPhase: {
      on: {
        PASS_PRIORITY: "endPhase",
      },
    },
    
    endPhase: {
      on: {
        END_TURN: "turnStart",
      },
    },
  },
});
```

### Phase Transitions

Moves can trigger phase transitions:

```typescript
// In passTurnMove execute:
execute: (state, context) => {
  // Transition to next phase
  state.flow.send("PASS_PRIORITY");
}
```

### Flow State Access

```typescript
// Check current phase
const isMainPhase = (state: YourGameState): boolean => {
  return state.flow.currentState === "mainPhase";
};
```

---

## Card System

Define cards and their properties.

### Card Definition

```typescript
// src/cards/card-definitions/example-card.ts
import type { CardDefinition } from "@tcg/core";
import type { YourGameCard } from "../card-types";

export const exampleCard: CardDefinition<YourGameCard> = {
  id: "example-001",
  name: "Example Card",
  type: "creature",
  cost: 3,
  
  // Game-specific properties
  power: 2,
  toughness: 3,
  
  // Abilities
  abilities: [
    {
      type: "triggered",
      trigger: "whenPlayed",
      effect: {
        type: "drawCards",
        amount: 1,
      },
    },
  ],
  
  text: "When this enters play, draw a card.",
};
```

### Card Types

Define game-specific card types:

```typescript
// src/cards/card-types.ts
import type { CardDefinition, CardId } from "@tcg/core";

export type YourGameCardType = 
  | "creature"
  | "spell"
  | "artifact"
  | "enchantment";

export type YourGameCard = {
  id: CardId;
  name: string;
  type: YourGameCardType;
  cost: number;
  
  // Creature properties
  power?: number;
  toughness?: number;
  
  // Abilities
  abilities: Ability[];
  
  // Text
  text?: string;
};
```

### Card Instance vs Definition

- **CardDefinition**: Static template (what the card does)
- **CardInstance**: Runtime instance (current state)

```typescript
// Definition (in code)
const definition: CardDefinition = {
  id: "card-001",
  name: "Example",
  power: 3,
};

// Instance (in game state)
const instance: CardInstance = {
  definitionId: "card-001",
  instanceId: "game-123-card-456",
  ownerId: "player1",
  zone: "play",
  
  // Current state
  damage: 1,
  tapped: true,
};
```

---

## Ability System

Implement card abilities.

### Ability Types

```typescript
export type Ability =
  | KeywordAbility
  | TriggeredAbility
  | ActivatedAbility
  | StaticAbility;

export type TriggeredAbility = {
  type: "triggered";
  trigger: TriggerTiming;
  effect: Effect;
  condition?: Condition;
};

export type ActivatedAbility = {
  type: "activated";
  cost: AbilityCost;
  effect: Effect;
};
```

### Ability Resolution

```typescript
// Trigger abilities when events occur
export const triggerPlayedAbilities = (
  state: YourGameState,
  cardId: CardId
) => {
  const card = getCard(state, cardId);
  
  for (const ability of card.abilities) {
    if (ability.type === "triggered" && ability.trigger === "whenPlayed") {
      resolveEffect(state, ability.effect, cardId);
    }
  }
};
```

---

## Testing Strategy

Use behavior-driven testing with real engine instances.

### Test Structure

```typescript
// src/__tests__/play-card.test.ts
import { describe, it, expect } from "bun:test";
import { RuleEngine } from "@tcg/core";
import { yourGame } from "../game-definition";

describe("Play Card Move", () => {
  it("moves card from hand to play", () => {
    const engine = new RuleEngine(yourGame);
    const state = engine.setup({ players });
    
    // Execute move
    const result = engine.executeMove("playCard", {
      playerId: "player1",
      params: { cardId: "card-123" },
    });
    
    // Verify result
    expect(result.success).toBe(true);
    
    const newState = engine.getState();
    expect(newState.zones.play.player1).toContain("card-123");
    expect(newState.zones.hand.player1).not.toContain("card-123");
  });
  
  it("deducts resource cost", () => {
    // Test implementation
  });
  
  it("rejects playing card without enough resources", () => {
    // Test implementation
  });
});
```

### Test Helpers

Create helper functions for common test scenarios:

```typescript
// src/__tests__/helpers.ts
export const createTestEngine = (options?: Partial<RuleEngineOptions>) => {
  return new RuleEngine(yourGame, {
    seed: "test-seed",
    ...options,
  });
};

export const createTestState = (overrides?: Partial<YourGameState>) => {
  const engine = createTestEngine();
  const state = engine.setup({ players: createTestPlayers() });
  return { ...state, ...overrides };
};
```

---

## Best Practices

### 1. Keep Core Agnostic

Don't modify `@tcg/core`. If you need core changes, discuss with framework maintainers.

### 2. Use Branded Types

```typescript
type CardId = string & { readonly __brand: "CardId" };
type PlayerId = string & { readonly __brand: "PlayerId" };
```

### 3. Validate Thoroughly

Validate all move preconditions before execution:

```typescript
validate: (state, context) => {
  // Check ALL conditions
  if (!condition1) return invalid("reason");
  if (!condition2) return invalid("reason");
  if (!condition3) return invalid("reason");
  
  return valid();
}
```

### 4. Pure Functions

Extract logic into pure functions:

```typescript
// Pure function - easy to test
export const calculateDamage = (
  attackPower: number,
  defense: number
): number => {
  return Math.max(0, attackPower - defense);
};

// Use in move
execute: (state, context) => {
  const damage = calculateDamage(attacker.power, defender.defense);
  state.cards[defenderId].damage += damage;
}
```

### 5. Query Functions

Use query functions instead of direct state access:

```typescript
// Good
const cards = getCardsInZone(state, "play", playerId);

// Avoid
const cards = state.zones.play[playerId];
```

### 6. Test Behavior, Not Implementation

```typescript
// Good - test observable behavior
it("increases victory points when questing", () => {
  engine.executeMove("quest", params);
  expect(getVictoryPoints(state, playerId)).toBe(expectedValue);
});

// Avoid - test implementation details
it("calls questValidator with correct params", () => {
  // Don't test internal function calls
});
```

### 7. Deterministic Tests

Use seeded RNG for reproducible tests:

```typescript
const engine = new RuleEngine(yourGame, {
  seed: "fixed-seed-123",
});
```

### 8. Document with Types

Use types as documentation:

```typescript
type PlayCardParams = {
  /** ID of the card to play */
  cardId: CardId;
  
  /** Optional targets for the card's ability */
  targets?: CardId[];
  
  /** Whether to pay alternate cost */
  alternateCardCost?: boolean;
};
```

---

## Complete Example

See `@tcg/lorcana` for a complete reference implementation demonstrating all these patterns.

## Support

- Framework issues: Open issue in `@tcg/core` repository
- Integration questions: Check `ENGINE_INTEGRATION.md` (this doc)
- Examples: See `@tcg/lorcana` reference implementation

---

**Last Updated**: 2025-10-08
**Framework Version**: 0.1.0

