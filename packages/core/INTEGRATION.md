# @tcg/core Integration Guide

This guide explains how to build trading card game engines using the `@tcg/core` framework. It covers the architecture, extension points, and patterns for creating game-specific implementations.

## Table of Contents

- [Overview](#overview)
- [Package Structure](#package-structure)
- [Core Concepts](#core-concepts)
- [Step-by-Step Integration](#step-by-step-integration)
- [Extension Points](#extension-points)
- [Patterns and Best Practices](#patterns-and-best-practices)
- [Reference Implementation](#reference-implementation)

## Overview

The `@tcg/core` framework provides a foundation for building TCG engines with:

- **Immutable State Management**: All state changes create new state objects
- **Type-Safe Move System**: Strongly typed moves with validation and execution
- **Declarative Game Definitions**: Games defined through configuration, not imperative code
- **Flow Control**: Phase and turn management
- **Zone Abstractions**: Flexible zone system for card locations
- **Deterministic Execution**: Same inputs always produce same outputs

### What the Framework Provides

- Base game state structure
- Move execution system
- Flow manager for phases/turns
- Zone management primitives
- Card instance system
- Action/effect timing system
- Filtering and querying utilities
- RNG for determinism

### What You Implement

- Game-specific state shape
- Game-specific moves
- Phase definitions
- Zone configurations
- Card definitions
- Validation rules
- Win/loss conditions

## Package Structure

A TCG engine package should follow this structure:

```
packages/your-game-engine/
├── package.json              # Package configuration
├── tsconfig.json             # TypeScript configuration
├── turbo.json                # Turbo build configuration
├── biome.json                # Linting/formatting configuration
├── bunfig.toml               # Test runner configuration
├── README.md                 # Package overview
├── ARCHITECTURE.md           # Detailed architecture docs
└── src/
    ├── index.ts              # Public API exports
    ├── game-definition.ts    # Main game definition
    ├── types.ts              # Game-specific types
    ├── moves/                # Move implementations
    │   ├── index.ts
    │   ├── move-one.ts
    │   └── move-two.ts
    ├── phases/               # Phase definitions
    │   ├── index.ts
    │   ├── phase-one.ts
    │   └── phase-two.ts
    ├── zones/                # Zone configurations
    │   ├── index.ts
    │   ├── zone-one.ts
    │   └── zone-two.ts
    ├── cards/                # Card definitions
    │   ├── index.ts
    │   ├── card-types.ts
    │   └── sets/
    │       └── set-one/
    ├── abilities/            # Keyword abilities (if applicable)
    │   └── index.ts
    ├── utils/                # Utility functions
    │   └── index.ts
    └── __tests__/            # Test files
        ├── game-definition.test.ts
        ├── moves/
        ├── phases/
        └── integration/
```

## Core Concepts

### 1. Type-Driven Design

All game implementations start with type definitions that extend the core framework types:

```typescript
import type { GameState, Move, Zone, Card } from "@tcg/core";

// Extend core state with game-specific properties
export type YourGameState = GameState & {
  gameSpecific: {
    // Add your game's state properties here
    customField: string;
    playerResources: Record<PlayerId, number>;
    specialZone: CardId[];
  };
};

// Define game-specific move types
export type YourGameMove =
  | PlayCardMove
  | ActivateAbilityMove
  | EndTurnMove;
```

### 2. Immutable State Updates

All state changes must be immutable. Never mutate existing state:

```typescript
// ❌ BAD - mutates state
function addResource(state: GameState, playerId: PlayerId) {
  state.gameSpecific.resources[playerId]++;
  return state;
}

// ✅ GOOD - immutable update
function addResource(state: GameState, playerId: PlayerId) {
  return {
    ...state,
    gameSpecific: {
      ...state.gameSpecific,
      resources: {
        ...state.gameSpecific.resources,
        [playerId]: state.gameSpecific.resources[playerId] + 1,
      },
    },
  };
}
```

### 3. Move Pattern

Moves are the only way to modify game state. Each move has three parts:

```typescript
import { defineMove } from "@tcg/core";

export const YourMove = defineMove({
  type: "YOUR_MOVE",

  // 1. Validation - check if move is legal
  validate: (state, params) => {
    if (!isValidCondition(state, params)) {
      return { valid: false, error: "Invalid move" };
    }
    return { valid: true };
  },

  // 2. Execution - transform state immutably
  execute: (state, params) => {
    return {
      ...state,
      // ... new state
    };
  },

  // 3. Enumeration (optional) - list all valid instances
  enumerate: (state, playerId) => {
    return possibleMoves;
  },
});
```

### 4. Declarative Game Definition

Games are defined through a configuration object:

```typescript
import { defineGame } from "@tcg/core";

export const yourGame = defineGame({
  id: "your-game",
  name: "Your Game Name",

  // Initial state setup
  initialState: {
    // ... initial state
  },

  // Register moves
  moves: {
    playCard: PlayCardMove,
    endTurn: EndTurnMove,
  },

  // Define flow
  flow: {
    phases: [Phase1, Phase2, Phase3],
  },

  // Configure zones
  zones: {
    hand: HandZone,
    deck: DeckZone,
  },

  // Validation
  validation: {
    // ... rules
  },
});
```

## Step-by-Step Integration

### Step 1: Project Setup

Create your package structure and configuration files:

1. **package.json**: Define package name, dependencies, and scripts
2. **tsconfig.json**: Configure TypeScript with strict mode
3. **turbo.json**: Configure build tasks
4. **biome.json**: Configure linting and formatting
5. **bunfig.toml**: Configure test runner

See `packages/gundam-engine` for a complete example.

### Step 2: Define Types

Create `src/types.ts` with your game-specific type definitions:

```typescript
import type { GameState, PlayerId, CardId } from "@tcg/core";

export type YourGameState = GameState & {
  yourGame: {
    // Define your game's state structure
    resources: Record<PlayerId, number>;
    specialMechanicState: SomeType;
  };
};

export type YourGameMove =
  | MoveTypeOne
  | MoveTypeTwo
  | MoveTypeThree;

export type YourCard = {
  // Define card properties
  id: string;
  name: string;
  type: CardType;
  // ... other properties
};
```

### Step 3: Implement Moves

Create move files in `src/moves/`:

```typescript
// src/moves/play-card.ts
import { defineMove } from "@tcg/core";
import type { YourGameState } from "../types";

type PlayCardParams = {
  playerId: PlayerId;
  cardId: CardId;
};

export const PlayCardMove = defineMove<YourGameState, PlayCardParams>({
  type: "PLAY_CARD",

  validate: (state, params) => {
    const { playerId, cardId } = params;

    // Implement validation logic
    if (state.currentPlayer !== playerId) {
      return { valid: false, error: "Not your turn" };
    }

    const card = state.cards[cardId];
    if (!card) {
      return { valid: false, error: "Card not found" };
    }

    // Check resources, costs, etc.
    const hasResources = checkResources(state, playerId, card);
    if (!hasResources) {
      return { valid: false, error: "Insufficient resources" };
    }

    return { valid: true };
  },

  execute: (state, params) => {
    const { playerId, cardId } = params;

    // Immutably update state
    return {
      ...state,
      // ... implement state changes
    };
  },

  enumerate: (state, playerId) => {
    // Return all valid play card moves for this player
    const hand = getPlayerHand(state, playerId);
    const validCards = hand.filter((card) =>
      PlayCardMove.validate(state, { playerId, cardId: card.id }).valid
    );

    return validCards.map((card) => ({
      type: "PLAY_CARD",
      playerId,
      cardId: card.id,
    }));
  },
});
```

### Step 4: Define Phases

Create phase definitions in `src/phases/`:

```typescript
// src/phases/main-phase.ts
import { definePhase } from "@tcg/core";
import type { YourGameState } from "../types";

export const MainPhase = definePhase<YourGameState>({
  id: "main",
  name: "Main Phase",

  onEnter: (state) => {
    // Initialize phase state
    return state;
  },

  validMoves: [
    "PLAY_CARD",
    "ACTIVATE_ABILITY",
    "END_PHASE",
  ],

  onExit: (state) => {
    // Clean up phase state
    return state;
  },

  nextPhase: (state) => {
    // Determine next phase
    return "end";
  },
});
```

### Step 5: Configure Zones

Create zone configurations in `src/zones/`:

```typescript
// src/zones/hand-zone.ts
import { defineZone } from "@tcg/core";

export const HandZone = defineZone({
  id: "hand",
  name: "Hand",

  visibility: {
    owner: "public",
    opponent: "hidden",
  },

  ordered: false,
  maxCards: undefined, // No limit (or set a limit)

  canAddCard: (zone, card, state) => {
    // Validate card can be added
    return { allowed: true };
  },

  onCardEnter: (zone, card, state) => {
    // Handle card entering hand
    return state;
  },

  onCardLeave: (zone, card, state) => {
    // Handle card leaving hand
    return state;
  },
});
```

### Step 6: Create Game Definition

Bring it all together in `src/game-definition.ts`:

```typescript
import { defineGame } from "@tcg/core";
import type { YourGameState, YourGameMove } from "./types";
import * as moves from "./moves";
import * as phases from "./phases";
import * as zones from "./zones";

export const yourGame = defineGame<YourGameState, YourGameMove>({
  id: "your-game",
  name: "Your Game Name",

  initialState: {
    // Define initial state
    players: [],
    currentPlayer: "",
    turn: 1,
    phase: "setup",
    zones: {},
    cards: {},
    yourGame: {
      resources: {},
      specialMechanicState: {},
    },
  },

  moves: {
    playCard: moves.PlayCardMove,
    activateAbility: moves.ActivateAbilityMove,
    endTurn: moves.EndTurnMove,
  },

  flow: {
    phases: [
      phases.StartPhase,
      phases.MainPhase,
      phases.EndPhase,
    ],
  },

  zones: {
    hand: zones.HandZone,
    deck: zones.DeckZone,
    play: zones.PlayZone,
    discard: zones.DiscardZone,
  },

  validation: {
    // Define validation rules
  },
});
```

### Step 7: Export Public API

Define your package's public API in `src/index.ts`:

```typescript
// Export game definition
export { yourGame } from "./game-definition";

// Export types
export type * from "./types";

// Export utilities
export { createGame, validateDeck } from "./utils";

// Optionally export moves, phases, zones for advanced usage
export * as moves from "./moves";
export * as phases from "./phases";
export * as zones from "./zones";
```

### Step 8: Write Tests

Create behavior-driven tests in `src/__tests__/`:

```typescript
import { describe, it, expect } from "bun:test";
import { createGame } from "../utils";

describe("Your Game", () => {
  it("initializes with correct starting state", () => {
    const game = createGame({
      players: [
        { id: "p1", deck: testDeck1 },
        { id: "p2", deck: testDeck2 },
      ],
    });

    const state = game.getState();

    expect(state.players).toHaveLength(2);
    expect(state.turn).toBe(1);
    expect(state.phase).toBe("setup");
  });

  it("allows valid moves and rejects invalid ones", () => {
    const game = createGame(testSetup);

    // Valid move
    const validResult = game.executeMove({
      type: "PLAY_CARD",
      playerId: "p1",
      cardId: "card-1",
    });

    expect(validResult.success).toBe(true);

    // Invalid move
    const invalidResult = game.executeMove({
      type: "PLAY_CARD",
      playerId: "p2", // Not their turn
      cardId: "card-2",
    });

    expect(invalidResult.success).toBe(false);
    expect(invalidResult.error).toBeDefined();
  });
});
```

## Extension Points

The framework provides several extension points:

### 1. State Extension

Extend `GameState` with game-specific properties:

```typescript
type YourGameState = GameState & {
  yourGame: {
    customField: any;
  };
};
```

### 2. Move Registration

Define and register custom moves:

```typescript
const yourGame = defineGame({
  moves: {
    customMove: YourCustomMove,
  },
});
```

### 3. Phase System

Define custom phases and flow:

```typescript
const yourGame = defineGame({
  flow: {
    phases: [YourPhase1, YourPhase2],
  },
});
```

### 4. Zone Configuration

Configure game-specific zones:

```typescript
const yourGame = defineGame({
  zones: {
    customZone: YourCustomZone,
  },
});
```

### 5. Card System

Define cards using the card definition system:

```typescript
export const yourCard = defineCard({
  id: "card-1",
  name: "Card Name",
  // ... properties
});
```

### 6. Validation Rules

Add custom validation logic:

```typescript
const yourGame = defineGame({
  validation: {
    validateMove: (state, move) => {
      // Custom validation
    },
  },
});
```

## Patterns and Best Practices

### 1. Early Returns for Validation

```typescript
validate: (state, params) => {
  if (!condition1) {
    return { valid: false, error: "Error 1" };
  }

  if (!condition2) {
    return { valid: false, error: "Error 2" };
  }

  return { valid: true };
};
```

### 2. Helper Functions for State Access

```typescript
// Helper functions make code more readable
function getPlayerHand(state: GameState, playerId: PlayerId): Card[] {
  return state.zones.hand[playerId] || [];
}

function hasResources(
  state: GameState,
  playerId: PlayerId,
  amount: number
): boolean {
  return state.gameSpecific.resources[playerId] >= amount;
}
```

### 3. Type-Safe Move Parameters

```typescript
type MoveParams = {
  playerId: PlayerId;
  targetId: CardId;
  amount: number;
};

export const Move = defineMove<GameState, MoveParams>({
  // Full type safety
});
```

### 4. Composition Over Duplication

```typescript
// Extract common logic
function updatePlayerResource(
  state: GameState,
  playerId: PlayerId,
  delta: number
): GameState {
  return {
    ...state,
    gameSpecific: {
      ...state.gameSpecific,
      resources: {
        ...state.gameSpecific.resources,
        [playerId]: state.gameSpecific.resources[playerId] + delta,
      },
    },
  };
}

// Use in multiple moves
export const Move1 = defineMove({
  execute: (state, params) => {
    return updatePlayerResource(state, params.playerId, 1);
  },
});
```

### 5. Test Behavior, Not Implementation

```typescript
// ✅ Good - tests behavior
it("allows playing a card when resources are sufficient", () => {
  const game = createGame(testSetup);
  const result = game.executeMove({
    type: "PLAY_CARD",
    playerId: "p1",
    cardId: "card-1",
  });

  expect(result.success).toBe(true);
  expect(result.state.zones.play.p1).toContain("card-1");
});

// ❌ Bad - tests implementation
it("calls the playCard function", () => {
  const spy = jest.spyOn(moves, "playCard");
  // ...
});
```

## Reference Implementation

See `packages/gundam-engine` for a complete reference implementation that demonstrates all the patterns and concepts described in this guide.

The Gundam engine implements:

- Complex multi-phase turn structure
- Resource management system
- Unit deployment and combat
- Pilot pairing mechanics
- Shield and base systems
- Keyword abilities
- Comprehensive card definitions

Study this implementation to understand how to apply these patterns to your own TCG.

## Common Pitfalls

### 1. Mutating State

```typescript
// ❌ Never mutate state
state.field = newValue;

// ✅ Always create new state
return { ...state, field: newValue };
```

### 2. Missing Validation

```typescript
// ❌ Execution without validation
execute: (state, params) => {
  // Assume params are valid
};

// ✅ Validate before executing
validate: (state, params) => {
  // Check all preconditions
};
```

### 3. Side Effects in Pure Functions

```typescript
// ❌ Side effects
execute: (state, params) => {
  console.log("Executing"); // Side effect
  saveToDatabase(state);    // Side effect
  return newState;
};

// ✅ Pure function
execute: (state, params) => {
  return newState; // No side effects
};
```

### 4. Using `any` Types

```typescript
// ❌ Loses type safety
function doSomething(thing: any) { }

// ✅ Proper typing
function doSomething<T extends BaseType>(thing: T) { }
```

## Next Steps

1. Review the `packages/gundam-engine` reference implementation
2. Set up your package structure
3. Define your game-specific types
4. Implement moves following TDD
5. Define phases and flow
6. Configure zones
7. Add comprehensive tests
8. Document patterns you discover

## Getting Help

- Review existing implementations: `packages/gundam-engine`
- Check core API documentation: `packages/core/src/`
- Refer to development guidelines: `packages/engines/core-engine/CLAUDE.md`
- Study examples: `packages/core/src/examples/`

## Contributing Back

As you build your game implementation, you may discover:

- Missing features in the core framework
- Useful patterns that should be documented
- Common utilities that could be shared

Please contribute these learnings back to help improve the framework for everyone.

