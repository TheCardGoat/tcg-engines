---
paths: packages/core/**/*.ts
---

# @tcg/core Framework Rules

## Overview

The core package is the foundation framework for building trading card games. It provides declarative game definitions, immutable state management, and comprehensive game orchestration.

## Architecture

### RuleEngine

The main orchestration class that manages game state:

```typescript
import { RuleEngine } from "@tcg/core";

const engine = new RuleEngine(gameDefinition);
engine.setup(setupConfig);
engine.executeMove(move);
```

Key methods:
- `setup()` - Initialize game with players and decks
- `executeMove()` - Execute a player move
- `getState()` - Get current immutable state
- `canMake()` - Check if a move is legal

### GameDefinition

Declarative configuration defining game rules:

```typescript
const gameDefinition: GameDefinition = {
  name: "My TCG",
  minPlayers: 2,
  maxPlayers: 2,
  zones: [...],
  moves: [...],
  setup: (config) => initialState,
  winConditions: [...],
};
```

## Core Modules

| Module | Purpose |
|--------|---------|
| `engine/` | RuleEngine orchestration |
| `game-definition/` | GameDefinition types and validation |
| `moves/` | Move system and execution |
| `flow/` | Turn/phase/segment management |
| `zones/` | Zone management system |
| `cards/` | Card instances and modifiers |
| `filtering/` | Card query DSL |
| `targeting/` | Targeting system |
| `rng/` | Seeded random number generation |
| `testing/` | Testing utilities |
| `validation/` | Type guards and validators |
| `types/` | Branded types and utilities |

## Card System

### CardInstanceBase

Every card has these mandatory fields:

```typescript
type CardInstanceBase = {
  id: CardId;
  definitionId: string;
  owner: PlayerId;
  controller: PlayerId;
  zone: ZoneId;
  position?: number;
  tapped: boolean;
  flipped: boolean;
  revealed: boolean;
  phased: boolean;
};
```

### Custom Card State

Games extend with custom state:

```typescript
type LorcanaCardState = {
  damage: number;
  canQuest: boolean;
};

type LorcanaCard = CardInstance<LorcanaCardState>;
```

## Move System

### Move Definition

```typescript
const playCardMove: MoveDefinition = {
  type: "playCard",

  // Validation
  canMake: (state, params) => {
    const card = getCard(state, params.cardId);
    return card?.zone === "hand" && hasResources(state, card.cost);
  },

  // Execution
  execute: (state, params) => {
    moveCard(state, params.cardId, "hand", "play");
    deductResources(state, params.cost);
  },

  // Move enumeration for AI/UI
  enumerate: (state) => {
    return getCardsInZone(state, "hand").map((card) => ({
      type: "playCard",
      params: { cardId: card.id },
    }));
  },
};
```

## Zone Operations

Use zone operation helpers:

```typescript
import { moveCard, shuffleZone, drawCards } from "@tcg/core/operations";

// Move a single card
moveCard(state, cardId, "deck", "hand");

// Shuffle a zone
shuffleZone(state, playerId, "deck");

// Draw cards
drawCards(state, playerId, 7);
```

## Testing Utilities

### createTestEngine

Factory function for creating test engines:

```typescript
import { createTestEngine, createTestPlayers } from "@tcg/core/testing";

// Create with default 2 players
const engine = createTestEngine(gameDefinition);

// Create with custom players
const players = createTestPlayers(4, ["Alice", "Bob", "Charlie", "Dave"]);
const engine = createTestEngine(gameDefinition, players);

// Create with seed for deterministic tests
const engine = createTestEngine(gameDefinition, undefined, {
  seed: "test-seed-123",
});
```

### Move Assertions

```typescript
import {
  expectMoveSuccess,
  expectMoveFailure,
  expectStateProperty,
} from "@tcg/core/testing";

// Assert move succeeds
expectMoveSuccess(engine, "playCard", {
  playerId: "p1",
  data: { cardId: "card-123" },
});

// Assert move fails with error code
expectMoveFailure(engine, "invalidMove", { playerId: "p1" }, "CONDITION_FAILED");

// Assert state property value
expectStateProperty(engine, "turnNumber", 1);
```

## Best Practices

1. **Immutable state** - Always use Immer for state changes
2. **Pure move handlers** - No side effects in canMake/execute
3. **Deterministic RNG** - Use provided seeded RNG, never Math.random()
4. **Type-safe IDs** - Use branded types for CardId, PlayerId, ZoneId

## Documentation

- Full documentation: `packages/core/README.md`
- Engine integration: `packages/core/docs/ENGINE_INTEGRATION.md`
- Zone operations: `packages/core/docs/guides/zone-operations.md`
- Testing utilities: `packages/core/docs/guides/testing-utilities.md`
