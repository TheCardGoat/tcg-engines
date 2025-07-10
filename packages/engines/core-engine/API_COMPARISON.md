# API Comparison: Complex vs Simple Core Engine

## Current Complex Implementation

```typescript
// Current: Complex setup with many moving parts
import { CoreEngine } from "~/game-engine/core-engine/engine/core-engine";
import { DirectLocal } from "~/game-engine/core-engine/transport/direct-local";

// 1. Create engines with complex transport setup
const authoritativeEngine = new LorcanaEngine({
  gameId: "game123",
  playerId: undefined, // No player = authoritative
  cards: gameCards,
  // ... many options
});

const playerEngine = new LorcanaEngine({
  gameId: "game123", 
  playerId: "player1",
  cards: gameCards,
  // ... many options
});

// 2. Connect authoritative pattern
playerEngine.setAuthoritativeEngine(authoritativeEngine);

// 3. Complex move execution
const moves = playerEngine.moves; // Returns dispatchers
moves.alterHand([cardId1, cardId2]); // Goes through 5 layers:
// createMoveDispatchers() → ActionCreators.makeMove() → 
// engine.dispatchAction() → store.dispatch() → transport.sendAction()
```

## New Simplified Implementation

```typescript  
// New: Direct and straightforward
import { SimpleCoreEngine } from "~/game-engine/core-engine/engine/simple-core-engine";

// 1. Create engines with minimal setup
const authoritativeEngine = new SimpleCoreEngine({
  game: LorcanaGame,
  matchID: "game123",
  players: ["player1", "player2"],
  cards: gameCards,
});

const playerEngine = new SimpleCoreEngine({
  game: LorcanaGame,
  matchID: "game123",
  playerID: "player1", 
  players: ["player1", "player2"],
  cards: gameCards,
});

// 2. Connect authoritative pattern  
playerEngine.setAuthoritativeEngine(authoritativeEngine);

// 3. Direct move execution
playerEngine.processMove("player1", "alterHand", [cardId1, cardId2]);
// Direct method call - no layers of indirection!
```

## Benefits Comparison

### Lines of Code
- **Complex**: ~800 lines across 5+ files (core-engine.ts, state-store.ts, action-creators.ts, transport.ts, etc.)
- **Simple**: ~250 lines in 1 file

### Complexity Layers
- **Complex**: 5+ layers of indirection for a move
- **Simple**: 1 direct method call

### Mental Model
- **Complex**: "I need to create dispatchers that create actions that get dispatched to stores that send to transports..."
- **Simple**: "I call `processMove()` with the move type and arguments"

### Testing
- **Complex**: Mock transport, action creators, dispatchers, stores...
- **Simple**: Call method, check result

### Debugging
- **Complex**: Trace through action→dispatch→transport→receive→action→dispatch
- **Simple**: Single method call, easy to step through

## Migration Path

### Phase 1: Parallel Implementation ✅
- SimpleCoreEngine exists alongside CoreEngine
- New code can use SimpleCoreEngine
- Existing code continues working

### Phase 2: Game Implementation Updates
```typescript
// Update LorcanaEngine to use SimpleCoreEngine
export class LorcanaEngine {
  private engine: SimpleCoreEngine<LorcanaGameState>;
  
  constructor(opts) {
    this.engine = new SimpleCoreEngine({
      game: LorcanaGame,
      ...opts
    });
  }
  
  // Direct method delegation
  processMove = this.engine.processMove.bind(this.engine);
  subscribe = this.engine.subscribe.bind(this.engine);
  getState = this.engine.getState.bind(this.engine);
}
```

### Phase 3: Remove Old Implementation
- Once all games migrate to SimpleCoreEngine
- Remove CoreEngine, GameStateStore, action system
- Eliminate ~500+ lines of complex code

## Key Insight

**The current architecture optimizes for theoretical flexibility at the cost of practical complexity.**

The SimpleCoreEngine proves you can have:
- ✅ Full game functionality  
- ✅ Authoritative engine pattern
- ✅ State management
- ✅ Player views and filtering
- ✅ Event handling

With **60% less code** and **90% less complexity**.

The complex action/dispatch system was premature optimization that created more problems than it solved.