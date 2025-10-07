# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/packages/engine-core/specs/2025-10-07-core-engine-foundation/spec.md

## Technical Requirements

### Core Engine Architecture

The engine is composed of several interconnected systems:
1. **Rule Engine Core** - Main engine managing state and moves
2. **Zone Management** - Card zone abstraction with visibility rules
3. **Card System** - Generic card instance model with computed properties
4. **Card Filtering DSL** - Declarative query language for card selection
5. **Targeting System** - Comprehensive targeting infrastructure
6. **Flow Manager** - XState-based turn/phase orchestration
7. **RNG System** - Seeded random number generation
8. **AI Enumeration** - Valid move and target enumeration

See @sub-specs/tcg-features-spec.md for detailed specifications of zones, cards, computed properties, filtering, targeting, RNG, and flow management.

### 1. GameDefinition Type System

**Type Structure:**
```typescript
type GameDefinition<TState, TMoves> = {
  name: string;
  minPlayers: number;
  maxPlayers: number;
  setup: (players: Player[]) => TState;
  moves: MoveDefinitions<TState, TMoves>;
  flow: FlowDefinition<TState>;
  endIf?: (state: TState) => GameEndResult | undefined;
  playerView?: (state: TState, playerId: string) => TState;
};
```

**Requirements:**
- Generic over state type `TState` and moves type `TMoves` for full type safety
- `setup` function must be pure and deterministic (same players → same initial state)
- `moves` must be exhaustive mapping of move names to move configurations
- `flow` defines turn structure (phases and steps) with lifecycle hooks
- `endIf` checked after every move to determine if game has ended
- `playerView` filters state to hide private information per player

**Validation:**
- GameDefinition must be validated at engine initialization
- Move names must be unique
- Phase/step IDs must be unique within their scope
- All referenced functions must be present

### 2. Rule Engine Core

**Class Structure:**
```typescript
class RuleEngine<TState, TMoves> {
  constructor(definition: GameDefinition<TState, TMoves>);
  
  // State access
  getState(): TState;
  getPlayerView(playerId: string): TState;
  
  // Move execution
  executeMove(move: Move<TMoves>): MoveResult<TState>;
  canExecuteMove(move: Move<TMoves>): boolean;
  getValidMoves(playerId: string): Move<TMoves>[];
  
  // History
  undo(): boolean;
  redo(): boolean;
  getHistory(): StateHistory;
  
  // Replay
  replay(actions: Move<TMoves>[]): TState;
  
  // State management
  getPatches(): Patch[];
  applyPatches(patches: Patch[]): void;
}
```

**Requirements:**
- Engine must be fully deterministic (same moves → same state)
- All state updates must go through Immer produce()
- Every move execution must generate patches
- Engine must maintain action history for undo/redo
- Engine must support serialization/deserialization

**Error Handling:**
- Invalid moves must return descriptive errors (don't throw)
- Move validation failures must specify which condition failed
- State corruption must be detected and reported

### 3. Immer-Based State Management

**State Manager:**
```typescript
class StateManager<TState> {
  private currentState: TState;
  private history: StateSnapshot<TState>[];
  
  updateState(updater: (draft: Draft<TState>) => void): {
    nextState: TState;
    patches: Patch[];
    inversePatches: Patch[];
  };
  
  applyPatches(patches: Patch[]): TState;
  undo(): TState | undefined;
  redo(): TState | undefined;
}
```

**Requirements:**
- All state updates must use Immer's `produce()` function
- Must capture both forward patches and inverse patches
- State must be deeply frozen in development mode (for debugging)
- History must be bounded (configurable max size)
- Patches must be serializable to JSON

**Performance:**
- State updates must complete in <10ms for typical game states
- Patch generation must be automatic (no manual tracking)
- Memory usage must be reasonable (consider structural sharing)

### 4. Move System

**Move Definition:**
```typescript
type MoveDefinition<TState, TMove> = {
  // Move execution (pure function using Immer draft)
  move: (state: Draft<TState>, move: TMove) => void;
  
  // Validation conditions
  condition?: (state: TState, move: TMove) => boolean;
  
  // Move metadata
  undoable?: boolean; // default: true
  client?: boolean; // can clients predict this move? default: true
};

type MoveDefinitions<TState, TMoves> = {
  [K in keyof TMoves]: MoveDefinition<TState, TMoves[K]>;
};
```

**Requirements:**
- Move reducers must be pure functions (no side effects)
- Move reducers receive Immer draft (can "mutate" safely)
- Condition functions must be pure and fast (<1ms)
- Moves must include player ID for validation
- Type safety must be preserved through execution

**Validation Flow:**
1. Check if move name exists in GameDefinition
2. Validate move structure matches expected type
3. Run condition function (if defined)
4. Execute move reducer in Immer produce()
5. Generate patches and return result

### 5. Flow Manager

**Flow Definition:**
```typescript
type FlowDefinition<TState> = {
  turn: {
    order: 'sequential' | 'custom';
    onBegin?: (state: Draft<TState>) => void;
    onEnd?: (state: Draft<TState>) => void;
    endIf?: (state: TState) => boolean;
    
    phases: PhaseDefinition<TState>[];
  };
};

type PhaseDefinition<TState> = {
  id: string;
  onBegin?: (state: Draft<TState>) => void;
  onEnd?: (state: Draft<TState>) => void;
  endIf?: (state: TState) => boolean;
  
  steps?: StepDefinition<TState>[];
};

type StepDefinition<TState> = {
  id: string;
  onBegin?: (state: Draft<TState>) => void;
  onEnd?: (state: Draft<TState>) => void;
  endIf?: (state: TState) => boolean;
};
```

**Requirements:**
- Flow must automatically advance through phases/steps
- Lifecycle hooks (onBegin/onEnd) execute in Immer context
- `endIf` conditions checked after each move
- Current phase/step must be stored in game state
- Flow must support both simple and complex turn structures

**Flow Execution:**
1. Initialize with first phase/step
2. Call onBegin hooks for phase/step
3. Wait for moves from players
4. After each move, check step.endIf, then phase.endIf, then turn.endIf
5. If condition met, call onEnd hooks and advance to next phase/step
6. Repeat until game ends

### 6. Delta Synchronization

**Patch Utilities:**
```typescript
// Immer provides Patch type
import type { Patch } from 'immer';

export function serializePatches(patches: Patch[]): string;
export function deserializePatches(json: string): Patch[];
export function applyPatchesToState<T>(state: T, patches: Patch[]): T;
export function reversePatch(patch: Patch): Patch;
```

**Requirements:**
- Patches must be JSON-serializable for network transmission
- Patches must be minimal (only changed paths)
- Applying patches must be idempotent with same input
- Patch application must validate state structure
- Support batch application of multiple patches

**Network Synchronization Pattern (Server-Authoritative):**
```typescript
// Client side - sends MOVE to server
const move = { name: 'playCard', args: { cardId: '123' }, playerId: myId };
socket.send(JSON.stringify({ type: 'MOVE', move }));

// Client receives patches from server
socket.on('patches', (patchesJson) => {
  const patches = deserializePatches(patchesJson);
  clientEngine.applyPatches(patches); // Update client state
  updateUI(clientEngine.getPlayerView(myId));
});

// Server side - receives MOVE, executes, broadcasts patches
socket.on('message', (message) => {
  const { type, move } = JSON.parse(message);
  
  if (type === 'MOVE') {
    // Server executes move (authoritative)
    const result = serverEngine.executeMove(move);
    
    if (result.success) {
      // Broadcast patches to all clients
      const patchesJson = serializePatches(result.patches);
      broadcast({ type: 'patches', patches: patchesJson });
    } else {
      // Send error back to client
      socket.send(JSON.stringify({ type: 'ERROR', error: result.error }));
    }
  }
});

// Optional: Client-side optimistic updates
const optimisticResult = clientEngine.executeMove(move); // Predict outcome
if (optimisticResult.success) {
  updateUI(optimisticResult.state); // Show immediately
}
socket.send(JSON.stringify({ type: 'MOVE', move }));
// Server patches will reconcile if prediction was wrong
```

### 7. Player View Filtering

**Player View:**
```typescript
type PlayerViewFn<TState> = (
  state: TState,
  playerId: string
) => TState;

// Example implementation
const defaultPlayerView: PlayerViewFn<GameState> = (state, playerId) => {
  return produce(state, (draft) => {
    // Hide opponent hands
    for (const player of draft.players) {
      if (player.id !== playerId) {
        draft.hand = draft.hand.map(card => ({ ...card, hidden: true }));
      }
    }
    
    // Hide deck contents
    draft.deck = draft.deck.map(() => ({ hidden: true }));
  });
};
```

**Requirements:**
- Player views must be generated on-demand (not stored)
- Views must hide opponent private information
- Views must be deterministic (same state + playerId → same view)
- Views must preserve state structure (same type as full state)
- Framework provides default view (hides nothing), games can override

**Private Information Examples:**
- Opponent's hand cards
- Deck order and contents
- Face-down cards
- Hidden game state (future draws, etc.)

### 8. Replay System

**Replay:**
```typescript
type ActionLog<TMoves> = Array<{
  moveId: string;
  move: Move<TMoves>;
  timestamp: number;
  playerId: string;
}>;

class GameEngine<TState, TMoves> {
  replay(actions: ActionLog<TMoves>): TState {
    let state = this.definition.setup(this.players);
    
    for (const action of actions) {
      const result = this.executeMove(action.move);
      if (!result.success) {
        throw new ReplayError(`Failed at action ${action.moveId}`);
      }
      state = result.state;
    }
    
    return state;
  }
}
```

**Requirements:**
- Replay must be deterministic (same actions → same final state)
- Replay must validate each move before applying
- Replay must handle move failures gracefully
- Replay must support starting from any point in history
- Replay must be fast (10,000+ moves in <1s)

**Use Cases:**
- Debugging: Reproduce bugs from production games
- Testing: Verify game logic with known action sequences
- Spectating: Show game state at any point in time
- Analytics: Analyze completed games for balance

## Type Safety Requirements

### Strict TypeScript

- Enable `strict: true` in tsconfig.json
- No `any` types allowed (use `unknown` if necessary)
- No type assertions (use type guards instead)
- No `@ts-ignore` comments
- All public APIs must have explicit return types

### Generic Type Flow

```typescript
// Full type safety through the stack
type MyGameState = { /* ... */ };
type MyMoves = {
  playCard: { cardId: string };
  endTurn: {};
};

const definition: GameDefinition<MyGameState, MyMoves> = { /* ... */ };
const engine = new GameEngine(definition);

// TypeScript knows exact move structure
engine.executeMove({
  name: 'playCard',
  args: { cardId: '123' } // ✅ Type-checked
});

engine.executeMove({
  name: 'playCard',
  args: { wrong: 'field' } // ❌ Type error
});
```

### Branded Types

```typescript
// Use branded types for IDs to prevent mixing
type PlayerId = string & { readonly brand: unique symbol };
type GameId = string & { readonly brand: unique symbol };
type CardId = string & { readonly brand: unique symbol };

// Helper functions for creating branded types
export const createPlayerId = (id: string): PlayerId => id as PlayerId;
```

## Testing Requirements

### Test Coverage

- **Minimum 95% behavior coverage** across all core modules
- Every public API must have tests
- Every move validation path must be tested
- Every flow transition must be tested
- Edge cases must be explicitly tested

### Test Structure

```typescript
// Use factory functions for test data
const createTestGame = (overrides?: Partial<GameState>): GameState => ({
  players: [createPlayer('p1'), createPlayer('p2')],
  currentTurn: 0,
  phase: 'setup',
  ...overrides
});

// Test behavior, not implementation
describe('GameEngine move execution', () => {
  it('rejects moves when condition fails', () => {
    const engine = new GameEngine(testDefinition);
    const result = engine.executeMove({ name: 'invalid', args: {} });
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('condition failed');
  });
});
```

### Test Requirements

- Use Bun test runner
- No mocking/stubbing (use real objects)
- Tests must be deterministic (no random failures)
- Tests must be fast (<100ms each)
- Tests must be isolated (no shared state)

## Performance Requirements

### Benchmarks

- **Move execution**: <10ms for typical moves
- **Patch generation**: <5ms per state update
- **Replay**: 10,000+ moves in <1s
- **Player view generation**: <20ms
- **Memory**: <50MB for typical game state

### Optimization Guidelines

- Use Immer's structural sharing efficiently
- Avoid unnecessary object cloning
- Keep history bounded (max 100 states by default)
- Lazy-evaluate player views (don't precompute)
- Consider using `immer.freeze()` in development only

## External Dependencies

### Core Dependencies

- **immer** (^10.0.0) - Immutable state updates and patch generation
  - **Justification:** Core to framework architecture, provides automatic delta generation and type-safe "mutable" API
  
- **xstate** (^5.0.0) - State machine for game flow orchestration
  - **Justification:** Provides visualizable, type-safe turn/phase/step management with guards and actions
  
- **zod** (^3.22.0) - Runtime validation and card filtering DSL
  - **Justification:** Type-safe schema validation for GameDefinition and foundation for card filtering query language
  
- **seedrandom** (^3.0.5) - Seeded random number generation
  - **Justification:** Deterministic RNG essential for replay consistency and testing
  
- **nanoid** (^5.0.0) - Unique ID generation for games, players, cards
  - **Justification:** Lightweight, secure, URL-safe IDs for tracking entities

### Dev Dependencies

- **typescript** (^5.5.0) - Type system and compiler
- **@types/node** (^22.0.0) - Node.js type definitions
- **@types/seedrandom** (^3.0.0) - Type definitions for seedrandom
- **biome** (^2.0.4) - Linting and formatting
- **bun-types** (latest) - Bun runtime types

### Peer Dependencies

- None - Framework is standalone and not tied to any UI library or runtime (beyond Node.js/Bun)

## Migration from Existing Core Engine

### Patterns to Extract

From `packages/engines/core-engine`:

1. **Card Abstraction** - Zone-based card management, card instance model
2. **Move Validation** - Condition-based validation pattern
3. **Flow Management** - Segment/phase/step hierarchy
4. **Error Handling** - Result types, domain errors
5. **Testing Patterns** - Factory functions, behavior tests

### Simplifications

1. **State Management**: Replace Redux/TanStack → Simple Immer
2. **Delta Sync**: Replace rfc6902 → Built-in Immer patches
3. **Type System**: Remove Lorcana-specific types → Generic types
4. **Dependencies**: Minimize from 20+ → 2 core dependencies

### Migration Strategy

- Study existing patterns without copying code directly
- Start fresh with simpler architecture
- Validate against real-world complexity (Lorcana use cases)
- Ensure new framework can support existing game implementations

