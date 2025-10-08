# Game Engine Setup Guide

> Complete guide for creating trading card game engines using @tcg/core

This guide walks you through building a production-ready TCG engine from scratch using the @tcg/core framework. It explains the correct API usage, project structure, and provides working examples.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Understanding @tcg/core](#understanding-tcgcore)
3. [Project Structure](#project-structure)
4. [Step-by-Step Implementation](#step-by-step-implementation)
5. [Testing Strategy](#testing-strategy)
6. [Best Practices](#best-practices)
7. [Common Patterns](#common-patterns)
8. [Troubleshooting](#troubleshooting)

---

## Quick Start

### 1. Create New Game Engine Package

```bash
cd packages/
mkdir my-game-engine
cd my-game-engine
bun init -y
```

### 2. Install Dependencies

```json
{
  "name": "@tcg/my-game",
  "version": "0.1.0",
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

### 3. Create Minimal Working Game

See [template-engine](./packages/template-engine) for a complete working example.

---

## Understanding @tcg/core

### Core Concepts

**@tcg/core is a declarative framework** that provides:

- **GameDefinition** - Type-safe game rules configuration
- **RuleEngine** - Game state orchestrator
- **Moves** - Only way to modify state
- **Flow** - Optional turn/phase/segment management
- **Zones** - Card location management (part of state)
- **RNG** - Deterministic random number generation

### What @tcg/core is NOT

❌ **Not a class-based framework** - No inheritance or base classes
❌ **No `defineX()` helpers** - Uses TypeScript types instead
❌ **No separate zone configs** - Zones are just state properties
❌ **No magic** - Explicit, predictable state management

---

## Project Structure

### Recommended Directory Layout

```
packages/my-game-engine/
├── package.json
├── tsconfig.json
├── biome.json
├── README.md
└── src/
    ├── index.ts                    # Main exports
    ├── game-definition.ts          # GameDefinition configuration
    ├── types.ts                    # Game-specific types
    ├── moves/                      # Move implementations
    │   ├── index.ts
    │   ├── draw-card.ts
    │   ├── play-card.ts
    │   └── attack.ts
    ├── cards/                      # Card data (not framework types)
    │   ├── index.ts
    │   └── sets/
    │       └── base-set.ts
    ├── queries/                    # Reusable card/state queries
    │   └── index.ts
    ├── utils/                      # Helper functions
    │   └── index.ts
    └── __tests__/                  # Tests (co-located with source)
        └── game-definition.test.ts
```

---

## Step-by-Step Implementation

### Step 1: Define Game State Type

**`src/types.ts`**

```typescript
import type { PlayerId, CardId, ZoneId } from "@tcg/core";

// Define your game state
export type MyGameState = {
  // Players
  players: Array<{
    id: string;
    name: string;
    life: number;
  }>;

  // Turn tracking
  currentPlayerIndex: number;
  turnNumber: number;
  phase: "draw" | "main" | "combat" | "end";

  // Zones (as simple arrays or records)
  zones: {
    deck: Record<string, CardId[]>;
    hand: Record<string, CardId[]>;
    field: Record<string, CardId[]>;
    graveyard: Record<string, CardId[]>;
  };

  // Cards (the actual card data)
  cards: Record<CardId, CardInstance>;
};

// Card instance in play
export type CardInstance = {
  id: CardId;
  definitionId: string;  // References card definition
  ownerId: PlayerId;
  tapped: boolean;
  damage: number;
  counters: Record<string, number>;
};

// Move type union
export type MyGameMoves = {
  drawCard: Record<string, never>;
  playCard: { cardId: CardId };
  attack: { attackerId: CardId; targetId: CardId };
  endPhase: Record<string, never>;
};
```

### Step 2: Create GameDefinition

**`src/game-definition.ts`**

```typescript
import type { GameDefinition, GameMoveDefinitions } from "@tcg/core";
import type { MyGameState, MyGameMoves } from "./types";

// Define moves
const moves: GameMoveDefinitions<MyGameState, MyGameMoves> = {
  drawCard: {
    condition: (state, context) => {
      const player = state.players[state.currentPlayerIndex];
      return player !== undefined && state.phase === "draw";
    },
    reducer: (draft, context) => {
      const playerId = context.playerId;
      const deck = draft.zones.deck[playerId];

      if (deck && deck.length > 0) {
        const card = deck.pop();
        if (card) {
          draft.zones.hand[playerId]?.push(card);
        }
      }
    },
  },

  playCard: {
    condition: (state, context) => {
      if (state.phase !== "main") return false;
      if (!context.data?.cardId) return false;

      const cardId = context.data.cardId as string;
      const hand = state.zones.hand[context.playerId];

      return hand?.includes(cardId) ?? false;
    },
    reducer: (draft, context) => {
      const playerId = context.playerId;
      const cardId = context.data?.cardId as string;

      // Remove from hand
      const hand = draft.zones.hand[playerId];
      if (hand) {
        const index = hand.indexOf(cardId);
        if (index >= 0) {
          hand.splice(index, 1);
        }
      }

      // Add to field
      draft.zones.field[playerId]?.push(cardId);
    },
  },

  attack: {
    condition: (state, context) => {
      if (state.phase !== "combat") return false;

      const attackerId = context.data?.attackerId as string;
      const attacker = state.cards[attackerId];

      return attacker !== undefined && !attacker.tapped;
    },
    reducer: (draft, context) => {
      const attackerId = context.data?.attackerId as string;
      const targetId = context.data?.targetId as string;

      // Tap attacker
      draft.cards[attackerId]!.tapped = true;

      // Deal damage
      const attacker = draft.cards[attackerId];
      const target = draft.cards[targetId];

      if (attacker && target) {
        target.damage += 1;
      }
    },
  },

  endPhase: {
    reducer: (draft) => {
      // Progress phase
      const phaseOrder = ["draw", "main", "combat", "end"] as const;
      const currentIndex = phaseOrder.indexOf(draft.phase);

      if (currentIndex === phaseOrder.length - 1) {
        // Next player's turn
        draft.currentPlayerIndex = (draft.currentPlayerIndex + 1) % draft.players.length;
        draft.turnNumber += 1;
        draft.phase = "draw";

        // Untap all cards
        for (const card of Object.values(draft.cards)) {
          if (card && card.ownerId === draft.players[draft.currentPlayerIndex]?.id) {
            card.tapped = false;
          }
        }
      } else {
        draft.phase = phaseOrder[currentIndex + 1];
      }
    },
  },
};

// Create game definition
export const myGameDefinition: GameDefinition<MyGameState, MyGameMoves> = {
  name: "My Card Game",

  setup: (players) => ({
    players: players.map(p => ({
      id: p.id,
      name: p.name || "Player",
      life: 20,
    })),
    currentPlayerIndex: 0,
    turnNumber: 1,
    phase: "draw",
    zones: {
      deck: Object.fromEntries(players.map(p => [p.id, []])),
      hand: Object.fromEntries(players.map(p => [p.id, []])),
      field: Object.fromEntries(players.map(p => [p.id, []])),
      graveyard: Object.fromEntries(players.map(p => [p.id, []])),
    },
    cards: {},
  }),

  moves,

  endIf: (state) => {
    const loser = state.players.find(p => p.life <= 0);
    if (loser) {
      const winner = state.players.find(p => p.id !== loser.id);
      return winner ? { winner: winner.id, reason: "Opponent eliminated" } : undefined;
    }
    return undefined;
  },

  playerView: (state, playerId) => ({
    ...state,
    zones: {
      ...state.zones,
      hand: Object.fromEntries(
        Object.entries(state.zones.hand).map(([pid, cards]) => [
          pid,
          pid === playerId ? cards : [], // Hide opponent hands
        ])
      ),
      deck: Object.fromEntries(
        Object.entries(state.zones.deck).map(([pid, cards]) => [
          pid,
          pid === playerId ? cards : [], // Hide opponent decks
        ])
      ),
    },
  }),
};
```

### Step 3: Create Main Export

**`src/index.ts`**

```typescript
// Re-export core types for convenience
export type {
  GameDefinition,
  RuleEngine,
  MoveContext,
  MoveExecutionResult,
} from "@tcg/core";

// Export game definition
export { myGameDefinition } from "./game-definition";

// Export types
export type { MyGameState, MyGameMoves, CardInstance } from "./types";

// Helper to create game
import { RuleEngine, type Player } from "@tcg/core";
import { myGameDefinition } from "./game-definition";

export function createMyGame(players: Player[], seed?: string) {
  return new RuleEngine(myGameDefinition, players, { seed });
}
```

### Step 4: Write Tests

**`src/__tests__/game-definition.test.ts`**

```typescript
import { describe, expect, it } from "bun:test";
import { createPlayerId } from "@tcg/core";
import { createMyGame } from "../index";

describe("My Card Game", () => {
  it("initializes with correct state", () => {
    const game = createMyGame([
      { id: createPlayerId("p1"), name: "Alice" },
      { id: createPlayerId("p2"), name: "Bob" },
    ]);

    const state = game.getState();

    expect(state.players).toHaveLength(2);
    expect(state.players[0]?.life).toBe(20);
    expect(state.currentPlayerIndex).toBe(0);
    expect(state.phase).toBe("draw");
  });

  it("executes moves and updates state", () => {
    const game = createMyGame([
      { id: createPlayerId("p1"), name: "Alice" },
      { id: createPlayerId("p2"), name: "Bob" },
    ]);

    const result = game.executeMove("drawCard", {
      playerId: createPlayerId("p1"),
    });

    expect(result.success).toBe(true);
  });

  it("validates move conditions", () => {
    const game = createMyGame([
      { id: createPlayerId("p1"), name: "Alice" },
      { id: createPlayerId("p2"), name: "Bob" },
    ]);

    // Try to play card in wrong phase
    const result = game.executeMove("playCard", {
      playerId: createPlayerId("p1"),
      data: { cardId: "nonexistent" },
    });

    expect(result.success).toBe(false);
  });
});
```

---

## Testing Strategy

### Test Structure

```typescript
describe("Game Name", () => {
  describe("Initialization", () => {
    it("creates game with correct starting state");
    it("assigns players correctly");
    it("shuffles decks deterministically with seed");
  });

  describe("Moves", () => {
    describe("drawCard", () => {
      it("draws card from deck to hand");
      it("fails when deck is empty");
      it("fails when not in draw phase");
    });

    describe("playCard", () => {
      it("moves card from hand to field");
      it("validates card ownership");
      it("validates phase restrictions");
    });
  });

  describe("Win Conditions", () => {
    it("detects win when opponent life reaches 0");
    it("detects win when opponent deck is empty");
  });

  describe("Network Sync", () => {
    it("generates patches for state changes");
    it("applies patches to synchronize clients");
  });
});
```

### Best Practices

1. **Test behavior, not implementation** - Focus on what players experience
2. **Use real engine instances** - No mocking
3. **Test determinism** - Same seed → same outcomes
4. **Test network patterns** - Server-authoritative validation
5. **Test player views** - Information hiding works correctly

---

## Best Practices

### 1. State Management

**✅ DO:**
```typescript
// Zones as simple arrays
zones: {
  hand: Record<PlayerId, CardId[]>;
  deck: Record<PlayerId, CardId[]>;
}

// Cards as lookup table
cards: Record<CardId, CardInstance>;
```

**❌ DON'T:**
```typescript
// Don't create complex zone objects
zones: Array<ZoneConfig>; // ❌

// Don't use separate zone management system
const zoneManager = new ZoneManager(); // ❌
```

### 2. Moves

**✅ DO:**
```typescript
// Moves in GameMoveDefinitions
const moves: GameMoveDefinitions<State, Moves> = {
  myMove: {
    condition: (state, context) => /* validate */,
    reducer: (draft, context) => /* modify */,
  },
};
```

**❌ DON'T:**
```typescript
// Don't create move classes
class MyMove extends Move { } // ❌

// Don't use defineMove() - doesn't exist
const move = defineMove({ }); // ❌
```

### 3. Card Definitions

**✅ DO:**
```typescript
// Cards as plain data
export const fireballCard = {
  id: "fireball",
  name: "Fireball",
  cost: 3,
  effect: "DEAL_DAMAGE",
  damage: 3,
};

// Store in lookup
export const CARDS = {
  fireball: fireballCard,
  // ...
};
```

**❌ DON'T:**
```typescript
// Don't use defineCard() - doesn't exist
const card = defineCard({ }); // ❌

// Don't create card classes
class Card { } // ❌
```

### 4. Flow Management

**✅ DO:**
```typescript
// Optional FlowDefinition for turn structure
flow: {
  turn: {
    onBegin: (context) => { /* ... */ },
    phases: {
      draw: { order: 0, next: "main" },
      main: { order: 1, next: "end" },
    },
  },
}
```

**❌ DON'T:**
```typescript
// Don't use definePhase() - doesn't exist
const phase = definePhase({ }); // ❌

// Don't manage phases separately from state
```

### 5. Type Safety

**✅ DO:**
```typescript
// Use branded types from @tcg/core
import { createCardId, createPlayerId, createZoneId } from "@tcg/core";
import type { CardId, PlayerId, ZoneId } from "@tcg/core";

const playerId = createPlayerId("p1");
const cardId = createCardId("card-123");
```

**❌ DON'T:**
```typescript
// Don't use plain strings
const playerId: string = "p1"; // ❌
```

---

## Common Patterns

### Pattern 1: Card Filtering

```typescript
import { selectCards } from "@tcg/core";

// Find all creatures with power >= 3
const creatures = selectCards(state.cards, {
  and: [
    { type: "creature" },
    { power: { gte: 3 } },
  ],
});
```

### Pattern 2: RNG Usage

```typescript
// In move reducer
reducer: (draft, context) => {
  const rng = context.rng;
  if (!rng) return;

  // Deterministic random
  const index = rng.randomInt(0, deck.length - 1);
  const card = deck[index];
}
```

### Pattern 3: Player View Filtering

```typescript
playerView: (state, playerId) => ({
  ...state,
  // Hide opponent hands
  zones: {
    ...state.zones,
    hand: Object.fromEntries(
      Object.entries(state.zones.hand).map(([pid, cards]) => [
        pid,
        pid === playerId ? cards : [],
      ])
    ),
  },
})
```

### Pattern 4: Server-Authoritative Multiplayer

```typescript
// SERVER
const server = new RuleEngine(gameDefinition, players);

socket.on("move", (moveId, context) => {
  const result = server.executeMove(moveId, context);
  if (result.success) {
    io.emit("patches", result.patches); // Broadcast to all
  }
});

// CLIENT
const client = new RuleEngine(gameDefinition, players);

socket.on("patches", (patches) => {
  client.applyPatches(patches); // Sync state
});
```

---

## Troubleshooting

### Issue: TypeScript errors about missing types

**Problem**: `defineMove`, `defineZone`, `definePhase` don't exist

**Solution**: Use TypeScript types directly:
- `GameDefinition<TState, TMoves>`
- `GameMoveDefinitions<TState, TMoves>`
- `FlowDefinition<TState>`

### Issue: Zones not working

**Problem**: Trying to use zone configs like `defineZone({})`

**Solution**: Zones are just state properties:
```typescript
zones: {
  hand: Record<PlayerId, CardId[]>;
}
```

### Issue: Cards not defined

**Problem**: Looking for `defineCard()` helper

**Solution**: Cards are plain data objects. Store in a lookup:
```typescript
export const CARDS = {
  "card-1": { id: "card-1", name: "Fireball", /* ... */ },
};
```

### Issue: Phases not executing

**Problem**: Trying to use `definePhase({})`

**Solution**: Use `FlowDefinition` or manage phase in state:
```typescript
// In state
phase: "draw" | "main" | "end";

// In moves
if (state.phase !== "main") return false;
```

---

## Examples

See these packages for working examples:

- **[template-engine](./packages/template-engine)** - Minimal working game
- **[core/examples](./packages/core/src/examples)** - Coin flip game
- **gundam-engine** - Skeleton with documentation (not implemented)
- **lorcana-engine** - Skeleton with documentation (not implemented)

---

## Additional Resources

- [@tcg/core README](./packages/core/README.md) - Core framework documentation
- [@tcg/core API Reference](./packages/core/README.md#api-reference)
- [Test Examples](./packages/core/src/__tests__/) - Integration test patterns

---

## Contributing

When creating a new game engine:

1. Follow this guide's structure
2. Write tests first (TDD)
3. Keep state simple (plain objects and arrays)
4. Use @tcg/core types (don't create wrappers)
5. Test determinism and network sync
6. Document game-specific rules clearly

---

**Built with ❤️ by The Card Goat Team**
