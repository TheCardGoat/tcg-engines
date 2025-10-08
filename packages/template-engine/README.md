# @tcg/template - Template Card Game Engine

A minimal working example showing how to build a trading card game engine using `@tcg/core`.

**Use this as a starting point for your own game!** Clone this package and modify it to implement your game's rules.

## Features

- ✅ **Complete working implementation** - Not just placeholders
- ✅ **Follows @tcg/core best practices** - Uses actual framework APIs
- ✅ **Minimal complexity** - Easy to understand and extend
- ✅ **Fully tested** - Shows TDD approach
- ✅ **Production patterns** - Multiplayer, determinism, player views

## Quick Start

```bash
# Install dependencies
bun install

# Run tests
bun test

# Run linter
bun run lint

# Type check
bun run typecheck
```

## Usage

```typescript
import { createTemplateGame, createPlayerId } from "@tcg/template";

// Create game
const game = createTemplateGame([
  { id: createPlayerId("p1"), name: "Alice" },
  { id: createPlayerId("p2"), name: "Bob" },
]);

// Execute moves
game.executeMove("drawCard", { playerId: createPlayerId("p1") });
game.executeMove("endPhase", { playerId: createPlayerId("p1") });

// Get state
const state = game.getState();
console.log(`Current phase: ${state.phase}`);

// Get player-specific view (hides opponent's hand)
const playerView = game.getPlayerView(createPlayerId("p1"));

// Check game end
const gameEnd = game.checkGameEnd();
if (gameEnd) {
  console.log(`Winner: ${gameEnd.winner}`);
}
```

## Project Structure

```
src/
├── index.ts              # Main exports
├── types.ts              # Game state and move types
├── game-definition.ts    # GameDefinition with moves
└── __tests__/
    └── game-definition.test.ts
```

## How to Adapt for Your Game

### 1. Define Your Game State

Edit `src/types.ts` to match your game's state:

```typescript
export type YourGameState = {
  players: Array<{
    id: PlayerId;
    // Add your player properties (health, mana, etc.)
  }>;

  // Add your turn/phase tracking

  // Define your zones
  zones: {
    deck: Record<PlayerId, CardId[]>;
    // Add more zones as needed
  };

  // Card instances
  cards: Record<CardId, CardInstance>;
};
```

### 2. Define Your Moves

Edit `src/game-definition.ts` to implement your game's moves:

```typescript
const moves: GameMoveDefinitions<YourGameState, YourGameMoves> = {
  yourMove: {
    condition: (state, context) => {
      // Validate move is legal
      return true;
    },
    reducer: (draft, context) => {
      // Modify game state
      draft.someProperty = newValue;
    },
  },
};
```

### 3. Configure Game Definition

Update the `GameDefinition` in `src/game-definition.ts`:

```typescript
export const yourGameDefinition: GameDefinition<YourGameState, YourGameMoves> = {
  name: "Your Game Name",

  setup: (players) => ({
    // Initialize game state
  }),

  moves,

  endIf: (state) => {
    // Check win conditions
    if (someCondition) {
      return { winner: winnerId, reason: "Victory condition met" };
    }
    return undefined;
  },

  playerView: (state, playerId) => ({
    // Filter state for each player
    // Hide opponent secrets
  }),
};
```

### 4. Write Tests

Follow the test patterns in `src/__tests__/game-definition.test.ts`:

- Test initialization
- Test each move (success and failure cases)
- Test game end conditions
- Test player views
- Test determinism

## Key Concepts

### No Helper Functions

`@tcg/core` is **declarative**. It uses TypeScript types, not helper functions:

✅ **DO:**
```typescript
const moves: GameMoveDefinitions<State, Moves> = { ... };
const gameDefinition: GameDefinition<State, Moves> = { ... };
```

❌ **DON'T:**
```typescript
const move = defineMove({ ... });  // Doesn't exist
const zone = defineZone({ ... });   // Doesn't exist
```

### Zones Are State Properties

Zones are just arrays in your state:

```typescript
zones: {
  hand: Record<PlayerId, CardId[]>;
  deck: Record<PlayerId, CardId[]>;
}
```

### Cards Are Plain Data

Card definitions are plain objects:

```typescript
export const CARDS = {
  "fireball": { id: "fireball", name: "Fireball", cost: 3 },
};
```

### Moves Use Immer

Move reducers receive an Immer draft - mutate it directly:

```typescript
reducer: (draft, context) => {
  draft.player.health -= 5;  // Direct mutation
}
```

## Production Patterns

### Multiplayer

```typescript
// SERVER
const server = new RuleEngine(gameDefinition, players);

socket.on("move", (moveId, context) => {
  const result = server.executeMove(moveId, context);
  if (result.success) {
    io.emit("patches", result.patches); // Broadcast
  }
});

// CLIENT
const client = new RuleEngine(gameDefinition, players);

socket.on("patches", (patches) => {
  client.applyPatches(patches); // Sync
});
```

### Deterministic Replay

```typescript
// Record game with seed
const game = new RuleEngine(definition, players, { seed: "replay-123" });

// Later: replay entire game
const finalState = game.replay();
```

### Player Views

```typescript
playerView: (state, playerId) => ({
  ...state,
  zones: {
    ...state.zones,
    hand: Object.fromEntries(
      Object.entries(state.zones.hand).map(([pid, cards]) => [
        pid,
        pid === playerId ? cards : [] // Hide opponent hands
      ])
    ),
  },
})
```

## Next Steps

1. **Read the Setup Guide**: See `/GAME_ENGINE_SETUP_GUIDE.md` for comprehensive documentation
2. **Extend This Template**: Add your game's unique rules and cards
3. **Add Flow Management**: Implement complex turn structures with `FlowDefinition`
4. **Add Card Abilities**: Use the targeting system for spell/ability resolution
5. **Add AI**: Use move enumeration for bot players

## Resources

- [@tcg/core README](../core/README.md) - Core framework documentation
- [GAME_ENGINE_SETUP_GUIDE.md](../../GAME_ENGINE_SETUP_GUIDE.md) - Complete setup guide
- [Integration Tests](../core/src/__tests__/integration-*.test.ts) - Advanced patterns

---

**Built with @tcg/core** - A declarative framework for trading card games
