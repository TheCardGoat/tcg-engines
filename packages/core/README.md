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
- **🏗️ Zone Management** - Comprehensive zone operations for card locations
- **🔍 Testing Utilities** - Complete TDD toolkit with assertions and factories
- **🛠️ Card Tooling** - Reusable infrastructure for parsers, generators, and validators
- **✅ Validation System** - Type guards and runtime validators for data integrity
- **📝 Logging System** - Structured logging with configurable verbosity levels
- **📡 Telemetry System** - Event-based telemetry for analytics and debugging

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

## Logging & Telemetry

Production-grade logging and telemetry for debugging, transparency, and analytics.

### Logging System

Structured logging with zero-overhead SILENT mode:

```typescript
import { RuleEngine, LogLevel } from '@tcg/core';

const engine = new RuleEngine(gameDefinition, players, {
  seed: 'game-123',
  logger: {
    level: 'DEVELOPER',  // SILENT, NORMAL_PLAYER, ADVANCED_PLAYER, DEVELOPER
    pretty: true         // Human-readable output
  }
});

// Access logger for custom logging
const logger = engine.getLogger();
logger.info('Custom event', { eventId: 'custom-123', data: { value: 42 } });

// Create child loggers for subsystems
const aiLogger = logger.child('ai');
aiLogger.debug('Evaluating move options', { count: 12 });
```

**Verbosity Levels:**
- `SILENT` (0): No logging - zero overhead
- `NORMAL_PLAYER` (INFO): Basic game events
- `ADVANCED_PLAYER` (DEBUG): Detailed game mechanics
- `DEVELOPER` (TRACE): Full internal details

**Learn more:** [Logging Guide](./docs/LOGGING.md)

### Telemetry System

Event-based telemetry for tracking player actions and engine events:

```typescript
const engine = new RuleEngine(gameDefinition, players, {
  seed: 'game-123',
  telemetry: {
    enabled: true,
    hooks: {
      onPlayerAction: (event) => {
        analytics.track('game.move', {
          moveId: event.moveId,
          playerId: event.playerId,
          duration: event.duration
        });
      },
      onStateChange: (event) => {
        database.savePatches(event.patches);
      },
      onEngineError: (event) => {
        errorReporter.captureException(event.error, event.context);
      }
    }
  }
});

// EventEmitter style
const telemetry = engine.getTelemetry();
telemetry.on('playerAction', (event) => {
  console.log(`Move: ${event.moveId}, Result: ${event.result}`);
});
```

**Event Types:**
- `PlayerActionEvent`: Move execution tracking
- `StateChangeEvent`: State mutations with patches
- `RuleEvaluationEvent`: Condition checks
- `FlowTransitionEvent`: Phase/turn/segment changes
- `EngineErrorEvent`: Error tracking
- `PerformanceEvent`: Performance metrics

**Learn more:** [Telemetry Guide](./docs/TELEMETRY.md)

## Testing Utilities

Comprehensive testing utilities for TDD workflow:

```typescript
import {
  createTestEngine,
  expectMoveSuccess,
  expectStateProperty,
  createTestCard,
  withSeed,
} from '@tcg/core/testing';

// Create test engine with deterministic seed
const engine = createTestEngine(gameDefinition, players, { seed: 'test' });

// Test move execution
expectMoveSuccess(engine, 'playCard', {
  playerId: 'p1',
  data: { cardId: 'card-123' }
});

// Verify state changes
expectStateProperty(engine, 'players[0].hand.length', 6);
expectStateProperty(engine, 'field.length', 1);

// Test with deterministic RNG
const shuffled = withSeed('test-seed', (rng) => {
  return rng.shuffle([1, 2, 3, 4, 5]);
});

// Create test data
const card = createTestCard({ type: 'creature', basePower: 3 });
const deck = createTestDeck(['card1', 'card2', 'card3'], 'player1');
```

**Learn more:** [Testing Utilities Guide](./docs/guides/testing-utilities.md)

## Card Tooling

Build card management pipelines with reusable infrastructure:

```typescript
import {
  CardParser,
  CardGenerator,
  FileWriter,
  formatTypeScript,
  generateVariableName,
} from '@tcg/core/tooling';

// Extend CardParser for game-specific parsing
class MyCardParser extends CardParser<string, MyCard> {
  protected doParse(text: string): ParserResult<MyCard> {
    // Parse logic here
    return { success: true, data: card, warnings: [] };
  }
}

// Extend CardGenerator for code generation
class MyCardGenerator extends CardGenerator<MyCard> {
  protected generateContent(card: MyCard): string {
    return `export const ${generateVariableName(card.name)} = ${JSON.stringify(card)};`;
  }

  protected generateFileName(card: MyCard): string {
    return `${card.name.toLowerCase()}.ts`;
  }
}

// Use file utilities
const writer = new FileWriter('./cards');
const formatted = await formatTypeScript(code);
await writer.write('card.ts', formatted);
```

**Learn more:** [Card Tooling Guide](./docs/guides/card-tooling.md)

## Validation Utilities

Type-safe runtime validation with type guards and validators:

```typescript
import {
  createTypeGuard,
  isCardOfType,
  ValidatorBuilder,
  combineTypeGuards,
} from '@tcg/core/validation';

// Type guards for filtering
const isCreature = isCardOfType('creature');
const creatures = cards.filter(isCreature);

// Complex filtering
const isRareLegendary = combineTypeGuards([
  isCardOfType('creature'),
  isCardWithField('rarity', 'rare'),
  isCardWithField('legendary', true),
]);

// Runtime validation
const validator = new ValidatorBuilder<CardData>()
  .required('name', 'Name is required')
  .type('cost', 'number', 'Cost must be a number')
  .min('cost', 0, 'Cost must be non-negative')
  .max('cost', 10, 'Cost cannot exceed 10')
  .custom('power', (power) => power > 0, 'Power must be positive')
  .build();

const result = validator.validate(cardData);
if (!result.success) {
  console.error('Validation errors:', result.errors);
}
```

**Learn more:** [Validation Guide](./docs/guides/validation.md)

## Comprehensive Zone Operations

Complete zone management utilities:

```typescript
import {
  createZone,
  addCard,
  removeCard,
  moveCard,
  draw,
  shuffle,
  mill,
  search,
  peek,
  findCardInZones,
  createPlayerZones,
  moveCardInState,
} from '@tcg/core';

// Basic operations
let deck = createZone(config, [card1, card2, card3]);
deck = addCardToTop(deck, card4);
deck = shuffle(deck, 'game-seed-123');

// Draw cards
const { fromZone, toZone, drawnCards } = draw(deck, hand, 3);

// Search zones
const creatures = search(zone, (cardId) => {
  const card = getCard(cardId);
  return card.type === 'creature';
});

// State helpers
const hands = createPlayerZones(playerIds, () => createZone(handConfig));
const newState = moveCardInState(state, 'hand', 'graveyard', cardId);
```

**Learn more:** [Zone Operations Guide](./docs/guides/zone-operations.md)

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
├── logging/         # Structured logging system
├── telemetry/       # Event-based telemetry
├── delta-sync/      # Patch utilities
├── testing/         # Testing utilities (@tcg/core/testing)
├── tooling/         # Card tooling infrastructure (@tcg/core/tooling)
├── validation/      # Type guards and validators (@tcg/core/validation)
└── types/           # Branded types and utilities
```

## Documentation

### Guides

- **[Logging Guide](./docs/LOGGING.md)** - Structured logging system
- **[Telemetry Guide](./docs/TELEMETRY.md)** - Event-based telemetry
- **[Zone Operations Guide](./docs/guides/zone-operations.md)** - Comprehensive zone management utilities
- **[Testing Utilities Guide](./docs/guides/testing-utilities.md)** - TDD workflow and test patterns
- **[Card Tooling Guide](./docs/guides/card-tooling.md)** - Building card management pipelines
- **[Validation Guide](./docs/guides/validation.md)** - Type guards and runtime validation

### Examples

- **[Zone Management Examples](./docs/examples/zone-management.ts)** - Runnable zone operation examples
- **[Test Patterns Examples](./docs/examples/test-patterns.ts)** - Complete testing examples
- **[Card Parser Extension](./docs/examples/card-parser-extension.ts)** - Extending CardParser
- **[Custom Validator](./docs/examples/custom-validator.ts)** - Building validators

## Performance

- **Immutable Updates**: Immer provides structural sharing for efficient updates
- **Delta Sync**: Only transmit state changes, not entire state
- **Deterministic**: Seeded RNG enables caching and replay
- **Type Safety**: Zero runtime overhead for branded types

## Move Enumeration

Discover all available moves with their valid parameters for AI agents and UI components:

```typescript
// Get all valid moves with parameters
const moves = engine.enumerateMoves(playerId, {
  validOnly: true,
  includeMetadata: true
});

for (const move of moves) {
  console.log(`Move: ${move.metadata?.displayName}`);
  console.log(`  Params:`, move.params);
  
  // Execute the move
  if (move.isValid) {
    engine.executeMove(move.moveId, {
      playerId: move.playerId,
      params: move.params
    });
  }
}
```

**Define enumerators in move definitions:**

```typescript
const playCardMove: MoveDefinition<GameState, PlayCardParams> = {
  id: 'play-card',
  name: 'Play Card',
  
  // Enumerate all cards in hand
  enumerator: (state, context) => {
    const handCards = context.zones.getCardsInZone('hand', context.playerId);
    return handCards.map(cardId => ({ cardId }));
  },
  
  condition: (state, context) => {
    // Validate the move
    return isCardPlayable(state, context.params.cardId);
  },
  
  reducer: (draft, context) => {
    // Execute the move
    playCard(draft, context.params.cardId);
  }
};
```

**Perfect for:**
- 🤖 AI agents that need to explore all possible moves
- 🎮 UI components building dynamic action menus
- 📊 Game analysis and move tree exploration
- 🔍 Debugging and testing game states

**Learn more:** [Move Enumeration Guide](./docs/guides/move-enumeration.md)

## Roadmap

- [x] Move enumeration system for AI and UI
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
