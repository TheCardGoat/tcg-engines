# API Specification

This is the API specification for the spec detailed in @.agent-os/packages/engine-core/specs/2025-10-07-core-engine-foundation/spec.md

## Core API

### RuleEngine Class

**Purpose:** Main entry point for game execution, state management, and move processing.

#### Constructor

```typescript
constructor(definition: GameDefinition<TState, TMoves>, options?: EngineOptions)
```

**Parameters:**
- `definition`: GameDefinition object with setup, moves, flow, etc.
- `options`: Optional configuration (historyLimit, enableFreeze, etc.)

**Returns:** GameEngine instance

**Errors:** Throws if GameDefinition is invalid

---

#### `getState(): TState`

**Purpose:** Get current game state (full state, not filtered)

**Response:**
```typescript
TState // Current game state object
```

---

#### `getPlayerView(playerId: string): TState`

**Purpose:** Get player-specific view with hidden information filtered

**Parameters:**
- `playerId`: ID of player requesting view

**Response:**
```typescript
TState // Filtered state for specific player
```

---

#### `executeMove(move: Move<TMoves>): MoveResult<TState>`

**Purpose:** Execute a move and update game state

**Parameters:**
```typescript
type Move<TMoves> = {
  name: keyof TMoves;
  args: TMoves[name];
  playerId: string;
};
```

**Response:**
```typescript
type MoveResult<TState> = {
  success: true;
  state: TState;
  patches: Patch[];
  inversePatches: Patch[];
} | {
  success: false;
  error: string;
  reason: 'invalid_move' | 'condition_failed' | 'execution_error';
};
```

**Errors:**
- `invalid_move`: Move name doesn't exist in GameDefinition
- `condition_failed`: Move condition returned false
- `execution_error`: Move reducer threw an error

---

#### `canExecuteMove(move: Move<TMoves>): boolean`

**Purpose:** Check if a move can be executed without executing it

**Parameters:** Same as `executeMove`

**Response:** `true` if move is valid, `false` otherwise

---

#### `getValidMoves(playerId: string): ValidMove[]`

**Purpose:** Get all valid moves for a player in current state

**Parameters:**
- `playerId`: ID of player

**Response:**
```typescript
type ValidMove = {
  name: string;
  // args would need to be enumerated by game-specific logic
};
```

**Note:** This is a framework hook; games must implement move enumeration logic

---

#### `undo(): UndoResult`

**Purpose:** Undo last move and revert state

**Response:**
```typescript
type UndoResult = {
  success: true;
  state: TState;
} | {
  success: false;
  reason: 'no_history' | 'move_not_undoable';
};
```

---

#### `redo(): RedoResult`

**Purpose:** Reapply a previously undone move

**Response:**
```typescript
type RedoResult = {
  success: true;
  state: TState;
} | {
  success: false;
  reason: 'no_redo_available';
};
```

---

#### `replay(actions: ActionLog<TMoves>): ReplayResult<TState>`

**Purpose:** Reconstruct game state from action log

**Parameters:**
```typescript
type ActionLog<TMoves> = Array<{
  moveId: string;
  move: Move<TMoves>;
  timestamp: number;
}>;
```

**Response:**
```typescript
type ReplayResult<TState> = {
  success: true;
  state: TState;
  finalPatches: Patch[];
} | {
  success: false;
  error: string;
  failedAtMove: number;
};
```

---

#### `getPatches(): Patch[]`

**Purpose:** Get all patches since game start or last checkpoint

**Response:**
```typescript
Patch[] // Array of Immer patches
```

---

#### `applyPatches(patches: Patch[]): ApplyPatchesResult`

**Purpose:** Apply external patches to current state (for network sync)

**Parameters:**
- `patches`: Array of Immer patches from another engine instance

**Response:**
```typescript
type ApplyPatchesResult = {
  success: true;
  state: TState;
} | {
  success: false;
  error: string;
};
```

---

### GameDefinition Type

**Purpose:** Declarative configuration for game rules

```typescript
type GameDefinition<TState, TMoves> = {
  name: string;
  minPlayers: number;
  maxPlayers: number;
  
  setup: (players: Player[]) => TState;
  
  moves: {
    [K in keyof TMoves]: MoveDefinition<TState, TMoves[K]>;
  };
  
  flow: FlowDefinition<TState>;
  
  endIf?: (state: TState) => GameEndResult | undefined;
  
  playerView?: (state: TState, playerId: string) => TState;
};
```

---

### Utility Functions

#### `serializePatches(patches: Patch[]): string`

**Purpose:** Convert patches to JSON string for network transmission

---

#### `deserializePatches(json: string): Patch[]`

**Purpose:** Parse JSON string back to patches

---

#### `applyPatchesToState<T>(state: T, patches: Patch[]): T`

**Purpose:** Apply patches to arbitrary state object

---

#### `createPlayerId(id: string): PlayerId`

**Purpose:** Create branded PlayerId type

---

#### `createGameId(id: string): GameId`

**Purpose:** Create branded GameId type

---

## Usage Examples

### Creating a Simple Game

```typescript
type CoinFlipState = {
  players: Player[];
  flips: Array<{ player: string; result: 'heads' | 'tails' }>;
  winner?: string;
};

type CoinFlipMoves = {
  flip: { prediction: 'heads' | 'tails' };
};

const coinFlipGame: GameDefinition<CoinFlipState, CoinFlipMoves> = {
  name: 'Coin Flip',
  minPlayers: 2,
  maxPlayers: 2,
  
  setup: (players) => ({
    players,
    flips: [],
  }),
  
  moves: {
    flip: {
      move: (state, { prediction }) => {
        const result = Math.random() > 0.5 ? 'heads' : 'tails';
        state.flips.push({ 
          player: state.players[0].id, 
          result 
        });
        
        if (result === prediction) {
          state.winner = state.players[0].id;
        }
      },
      condition: (state) => !state.winner,
    },
  },
  
  flow: {
    turn: {
      order: 'sequential',
      phases: [
        { id: 'flip', endIf: (state) => state.flips.length > 0 },
      ],
    },
  },
  
  endIf: (state) => 
    state.winner ? { winner: state.winner } : undefined,
};

const engine = new GameEngine(coinFlipGame);
```

### Executing Moves

```typescript
const result = engine.executeMove({
  name: 'flip',
  args: { prediction: 'heads' },
  playerId: 'player1',
});

if (result.success) {
  console.log('New state:', result.state);
  console.log('Patches:', result.patches);
}
```

### Network Synchronization (Server-Authoritative)

```typescript
// Client - sends move to server
const move = { 
  name: 'playCard', 
  args: { cardId: '123' }, 
  playerId: myId 
};
socket.send(JSON.stringify({ type: 'MOVE', move }));

// Client - receives authoritative patches from server
socket.on('patches', (patchesJson) => {
  const patches = deserializePatches(patchesJson);
  clientEngine.applyPatches(patches);
  updateUI(clientEngine.getPlayerView(myPlayerId));
});

// Server - receives move, executes authoritatively, broadcasts patches
socket.on('message', (message) => {
  const { type, move } = JSON.parse(message);
  
  if (type === 'MOVE') {
    const result = serverEngine.executeMove(move);
    
    if (result.success) {
      // Broadcast authoritative patches to all clients
      broadcastToAllClients({
        type: 'patches',
        patches: serializePatches(result.patches)
      });
    } else {
      // Send error to requesting client
      socket.send({ type: 'ERROR', error: result.error });
    }
  }
});
```

### Replay

```typescript
const actionLog = loadGameLog('game-123');
const replayResult = engine.replay(actionLog);

if (replayResult.success) {
  console.log('Final state:', replayResult.state);
}
```

