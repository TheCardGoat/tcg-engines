# @tcg/core

> Production-ready game engine for trading card games and turn-based strategy games

**@tcg/core** is a declarative, type-safe game engine built with **Immer** for immutable state management and **delta synchronization** for multiplayer games. It provides a complete framework for building complex card games with deterministic gameplay, network synchronization, and time-travel debugging.

## Features

- **🎮 Declarative Game Definition** - Define your game rules declaratively with TypeScript
- **🔄 Immutable State Management** - Powered by Immer for structural sharing and performance
- **🌐 Network Synchronization** - Delta patches enable server-authoritative multiplayer
- **🎲 Deterministic RNG** - Seeded random number generation for replay and testing
- **⏮️ Time-Travel Debugging** - Complete undo/redo with history replay
- **👁️ Player Views** - Automatic information hiding for multiplayer games
- **📊 Flow Orchestration** - Optional turn/phase/segment management
- **🎯 Type Safety** - Full TypeScript support with branded types
- **🧪 Test-Driven** - 95%+ test coverage with real engine instances

## Quick Start

### Installation

```bash
bun add @tcg/core
# or
npm install @tcg/core
```

### Create Your First Game

```typescript
import { RuleEngine, createPlayerId } from "@tcg/core";
import type { GameDefinition } from "@tcg/core";

// 1. Define your game state
type CoinFlipState = {
  players: Array<{
    id: string;
    name: string;
    score: number;
  }>;
  currentPlayerIndex: number;
  turnNumber: number;
  phase: "flip" | "ended";
};

// 2. Define your moves
type CoinFlipMoves = {
  flipCoin: Record<string, never>;
  endTurn: Record<string, never>;
};

// 3. Create game definition
const gameDefinition: GameDefinition<CoinFlipState, CoinFlipMoves> = {
  name: "Coin Flip",
  setup: (players) => ({
    players: players.map((p) => ({
      id: p.id,
      name: p.name || "Player",
      score: 0,
    })),
    currentPlayerIndex: 0,
    turnNumber: 1,
    phase: "flip",
  }),
  moves: {
    flipCoin: {
      reducer: (draft, context) => {
        // Use deterministic RNG
        const isHeads = context.rng?.flipCoin() ?? Math.random() >= 0.5;

        if (isHeads) {
          const player = draft.players[draft.currentPlayerIndex];
          if (player) {
            player.score += 1;
          }
        }
      },
    },
    endTurn: {
      reducer: (draft) => {
        draft.currentPlayerIndex =
          (draft.currentPlayerIndex + 1) % draft.players.length;
        draft.turnNumber += 1;
      },
    },
  },
  endIf: (state) => {
    const winner = state.players.find((p) => p.score >= 3);
    return winner
      ? { winner: winner.id, reason: "Reached 3 points" }
      : undefined;
  },
};

// 4. Create engine and play
const players = [
  { id: createPlayerId("p1"), name: "Alice" },
  { id: createPlayerId("p2"), name: "Bob" },
];

const engine = new RuleEngine(gameDefinition, players, {
  seed: "game-123", // Deterministic seed
});

// Execute moves
const result = engine.executeMove("flipCoin", {
  playerId: createPlayerId("p1"),
});

if (result.success) {
  console.log("Move successful!");

  // Check if game ended
  const gameEnd = engine.checkGameEnd();
  if (gameEnd) {
    console.log(`Winner: ${gameEnd.winner}`);
  }
}
```

## Core Concepts

### 1. GameDefinition

The heart of your game. Defines setup, moves, flow, and end conditions.

```typescript
const gameDefinition: GameDefinition<TState, TMoves> = {
  name: "My Game",

  // Setup: Create initial state
  setup: (players) => ({
    players: players.map(p => ({ id: p.id, hand: [], deck: [] })),
    turn: 1,
  }),

  // Moves: Define all possible actions
  moves: {
    drawCard: {
      condition: (state, context) => {
        // Optional: check if move is legal
        return state.currentPlayer === context.playerId;
      },
      reducer: (draft, context) => {
        // Modify state using Immer draft
        const player = draft.players.find(p => p.id === context.playerId);
        const card = draft.deck.pop();
        if (card) player.hand.push(card);
      },
    },
  },

  // Optional: Game end condition
  endIf: (state) => {
    const winner = state.players.find(p => p.score >= 10);
    return winner ? { winner: winner.id, reason: "Score limit" } : undefined;
  },

  // Optional: Filter state for each player
  playerView: (state, playerId) => ({
    ...state,
    players: state.players.map(p => ({
      ...p,
      hand: p.id === playerId ? p.hand : [], // Hide opponent hands
    })),
  }),
};
```

### 2. RuleEngine

The game engine that executes moves, manages state, and provides game services.

```typescript
// Create engine
const engine = new RuleEngine(gameDefinition, players, {
  seed: "deterministic-seed", // Optional: for deterministic gameplay
});

// Execute moves
const result = engine.executeMove("playCard", {
  playerId: createPlayerId("p1"),
  data: { cardId: "card-123" },
});

// Get current state
const state = engine.getState();

// Get player-specific view
const playerView = engine.getPlayerView(createPlayerId("p1"));

// Time travel
engine.undo();  // Undo last move
engine.redo();  // Redo undone move

// Replay from history
const finalState = engine.replay();

// Network sync
const patches = engine.getPatches(); // Get all patches
engine.applyPatches(patches);        // Apply patches from server

// Check game end
const gameEnd = engine.checkGameEnd();
```

### 3. Move System

Moves are the only way to modify game state. Each move has:

- **Condition** (optional): Determines if move is legal
- **Reducer**: Updates state using Immer draft
- **Context**: Provides playerId, data, targets, and RNG

```typescript
const moves: GameMoveDefinitions<GameState, GameMoves> = {
  playCard: {
    // Optional condition
    condition: (state, context) => {
      const player = state.players.find(p => p.id === context.playerId);
      return player?.hand.includes(context.data?.cardId as string) ?? false;
    },

    // Required reducer
    reducer: (draft, context) => {
      const player = draft.players.find(p => p.id === context.playerId);
      const cardId = context.data?.cardId as string;

      // Remove from hand
      const index = player.hand.indexOf(cardId);
      player.hand.splice(index, 1);

      // Add to field
      draft.field.push(cardId);

      // Use RNG for random effects
      if (context.rng?.flipCoin()) {
        player.life += 1;
      }
    },
  },
};
```

### 4. Flow Management (Optional)

For games with structured turns/phases/segments:

```typescript
const flow: FlowDefinition<GameState> = {
  turn: {
    onBegin: (context) => {
      context.state.phase = "draw";
    },
    phases: {
      draw: { order: 0, next: "main" },
      main: { order: 1, next: "end" },
      end: {
        order: 2,
        next: undefined, // End of turn
        onEnd: (context) => {
          // Next player's turn
          context.state.currentPlayer =
            (context.state.currentPlayer + 1) % context.state.players.length;
        },
      },
    },
  },
};
```

## Multiplayer Pattern

**@tcg/core** is designed for server-authoritative multiplayer:

```typescript
// SERVER
const serverEngine = new RuleEngine(gameDefinition, players, {
  seed: "server-seed",
});

// Client sends move
socket.on("move", (moveId, context) => {
  const result = serverEngine.executeMove(moveId, context);

  if (result.success) {
    // Broadcast patches to all clients
    io.emit("patches", result.patches);
  } else {
    // Send error to client
    socket.emit("error", result.error);
  }
});

// CLIENTS
const clientEngine = new RuleEngine(gameDefinition, players, {
  seed: "client-seed",
});

// Apply patches from server
socket.on("patches", (patches) => {
  clientEngine.applyPatches(patches);
  updateUI(clientEngine.getState());
});
```

## Deterministic Replay

Games are fully deterministic when using seeded RNG:

```typescript
// Game 1
const engine1 = new RuleEngine(gameDefinition, players, { seed: "test" });
engine1.executeMove("drawCard", { playerId: "p1" });
const state1 = engine1.getState();

// Game 2 - Same seed = Same outcome
const engine2 = new RuleEngine(gameDefinition, players, { seed: "test" });
engine2.executeMove("drawCard", { playerId: "p1" });
const state2 = engine2.getState();

// States are identical
console.log(state1 === state2); // true

// Replay from history
const replayedState = engine1.replay();
console.log(replayedState === state1); // true
```

## Advanced Features

### Branded Types

Safe type wrappers prevent ID mixups:

```typescript
import { createPlayerId, createCardId, createZoneId } from "@tcg/core";

const playerId = createPlayerId("p1");  // PlayerId type
const cardId = createCardId("c1");      // CardId type
const zoneId = createZoneId("hand");    // ZoneId type

// Type error: can't pass CardId where PlayerId expected ✅
engine.executeMove("draw", { playerId: cardId }); // ❌ Type error
```

### Zone Management

Built-in zone system for card locations:

```typescript
import { createZone, moveCard } from "@tcg/core";

const deck = createZone({
  id: createZoneId("deck"),
  visibility: "secret",  // Hidden from all players
  ordered: true,
});

const hand = createZone({
  id: createZoneId("hand"),
  visibility: "owner",   // Visible to owner only
  maxSize: 7,
});

// Move cards between zones
moveCard(state, cardId, sourcezone, destZone);
```

### Card Filtering DSL

Query cards with a fluent API:

```typescript
import { selectCards } from "@tcg/core";

// Find all creatures with power >= 3
const creatures = selectCards(state, {
  and: [
    { type: "creature" },
    { power: { gte: 3 } },
    { zone: createZoneId("field") },
  ],
});

// Fluent builder
const cards = new CardQuery(state)
  .inZone(createZoneId("hand"))
  .withType("spell")
  .withCost({ lte: 3 })
  .build();
```

### Targeting System

Define complex targeting requirements:

```typescript
const targetDefinition: TargetDefinition = {
  min: 1,
  max: 1,
  filter: {
    type: "creature",
    zone: createZoneId("field"),
  },
  restrictions: ["not-self", "not-controller"],
};

// Validate targets
const isValid = validateTargetSelection(
  state,
  targetDefinition,
  selectedTargets,
);
```

## API Reference

### RuleEngine

```typescript
class RuleEngine<TState, TMoves> {
  constructor(
    gameDefinition: GameDefinition<TState, TMoves>,
    players: Player[],
    options?: { seed?: string }
  );

  // State access
  getState(): TState;
  getPlayerView(playerId: PlayerId): TState;

  // Move execution
  executeMove(moveId: string, context: MoveContext): MoveExecutionResult;
  canExecuteMove(moveId: string, context: MoveContext): boolean;
  getValidMoves(playerId: PlayerId): string[];

  // History
  getHistory(): readonly HistoryEntry[];
  undo(): boolean;
  redo(): boolean;
  replay(upToIndex?: number): TState;

  // Network sync
  getPatches(sinceIndex?: number): Patch[];
  applyPatches(patches: Patch[]): void;

  // Game services
  getRNG(): SeededRNG;
  getFlowManager(): FlowManager<TState> | undefined;
  checkGameEnd(): GameEndResult | undefined;
}
```

### GameDefinition

```typescript
type GameDefinition<TState, TMoves> = {
  name: string;
  setup: (players: Player[]) => TState;
  moves: GameMoveDefinitions<TState, TMoves>;
  flow?: FlowDefinition<TState>;
  endIf?: (state: TState) => GameEndResult | undefined;
  playerView?: (state: TState, playerId: PlayerId) => TState;
};
```

### MoveContext

```typescript
type MoveContext = {
  playerId: PlayerId;
  sourceCardId?: CardId;
  targets?: string[][];
  data?: Record<string, unknown>;
  timestamp?: number;
  rng?: SeededRNG;
};
```

## Examples

See the `examples/` directory for complete game implementations:

- **Coin Flip Game** - Simple example validating the framework
- **Rock Paper Scissors** - Turn-based game with flow management
- **Card Battle** - Full card game with zones, targeting, and combat

## Testing

@tcg/core is built with Test-Driven Development:

```bash
# Run all tests
bun test

# Run specific test
bun test src/engine/__tests__/rule-engine.test.ts

# Watch mode
bun test --watch
```

## Architecture

```
@tcg/core
├── engine/          # RuleEngine - Main orchestration
├── game-definition/ # GameDefinition types and validation
├── moves/           # Move system and execution
├── flow/            # Turn/phase/segment management
├── zones/           # Zone management system
├── cards/           # Card instances and modifiers
├── filtering/       # Card query DSL
├── targeting/       # Targeting system
├── rng/             # Seeded random number generation
├── delta-sync/      # Patch utilities
└── types/           # Branded types and utilities
```

## Performance

- **Immutable Updates**: Immer provides structural sharing for efficient updates
- **Delta Sync**: Only transmit state changes, not entire state
- **Deterministic**: Seeded RNG enables caching and replay
- **Type Safety**: Zero runtime overhead for branded types

## Roadmap

- [ ] AI move enumeration utilities
- [ ] WebSocket transport layer
- [ ] React hooks for UI integration
- [ ] Vue composables
- [ ] Matchmaking service
- [ ] Tournament system
- [ ] Spectator mode
- [ ] Replay viewer

## Contributing

We welcome contributions! See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## License

MIT © The Card Goat Team

## Related Packages

- **@tcg/lorcana** - Disney Lorcana TCG implementation
- **@tcg/server** - Authoritative game server
- **@tcg/client** - Client SDK for web/mobile

---

**Built with ❤️ for trading card game developers**
