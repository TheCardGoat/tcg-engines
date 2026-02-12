# Flow State Serialization

## Overview

The FlowManager supports full serialization and deserialization of game state for persistence and replay functionality. This enables:

- **Game Saving**: Store complete game state to database
- **Game Loading**: Restore and continue from any saved point
- **Replay System**: Step through game history
- **Cross-session Play**: Players can resume games later

## Core Concepts

### Serializable State

All flow state is JSON-serializable:

```typescript
type SerializedFlowState = {
  currentPhase?: string;
  currentSegment?: string;
  turnNumber: number;
  currentPlayer: string;
};
```

### Restoration Options

```typescript
type FlowManagerOptions = {
  /** Skip initialization hooks when restoring */
  skipInitialization?: boolean;
  /** Restore from serialized flow state */
  restoreFrom?: SerializedFlowState;
};
```

## Usage Examples

### Basic Save/Load Pattern

```typescript
import { FlowManager, type FlowDefinition, type SerializedFlowState } from "@tcg/core/flow";

// Define your game flow
const flow: FlowDefinition<GameState> = {
  turn: {
    phases: {
      ready: { order: 0, next: "draw" },
      draw: { order: 1, next: "main" },
      main: { order: 2, next: "end" },
      end: { order: 3, next: undefined },
    },
  },
};

// Play game
const manager = new FlowManager(flow, initialState);
manager.nextPhase(); // Progress game

// === Save to database ===
const saveData = {
  gameState: manager.getGameState(),
  flowState: manager.serializeFlowState(),
  timestamp: Date.now(),
};

await db.games.insert(saveData);

// === Later: Load from database ===
const loaded = await db.games.findById(gameId);

// Restore exact state
const restored = new FlowManager(flow, loaded.gameState, {
  restoreFrom: loaded.flowState,
});

// Continue playing from where you left off
restored.nextPhase();
```

### Database Schema Example

```typescript
type SavedGame = {
  id: string;
  gameState: GameState; // Your game-specific state
  flowState: SerializedFlowState; // Flow position
  players: string[];
  createdAt: Date;
  updatedAt: Date;
};

async function saveGame(manager: FlowManager<GameState>): Promise<string> {
  const saveData: SavedGame = {
    id: generateId(),
    gameState: manager.getGameState(),
    flowState: manager.serializeFlowState(),
    players: /* extract from state */,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.collection('games').insertOne(saveData);
  return saveData.id;
}

async function loadGame(gameId: string): Promise<FlowManager<GameState>> {
  const saved = await db.collection('games').findOne({ id: gameId });

  if (!saved) throw new Error('Game not found');

  return new FlowManager(gameFlow, saved.gameState, {
    restoreFrom: saved.flowState,
  });
}
```

### Replay System

```typescript
type GameSnapshot = {
  gameState: GameState;
  flowState: SerializedFlowState;
  moveNumber: number;
};

class ReplaySystem {
  private snapshots: GameSnapshot[] = [];

  // Record snapshot after each move
  recordSnapshot(manager: FlowManager<GameState>) {
    this.snapshots.push({
      gameState: manager.getGameState(),
      flowState: manager.serializeFlowState(),
      moveNumber: this.snapshots.length,
    });
  }

  // Jump to specific move
  jumpToMove(moveNumber: number): FlowManager<GameState> {
    const snapshot = this.snapshots[moveNumber];
    if (!snapshot) throw new Error("Snapshot not found");

    return new FlowManager(gameFlow, snapshot.gameState, {
      restoreFrom: snapshot.flowState,
    });
  }

  // Step forward/backward
  stepForward(current: number) {
    return this.jumpToMove(current + 1);
  }
  stepBackward(current: number) {
    return this.jumpToMove(current - 1);
  }
}
```

### Network Synchronization

```typescript
// Server: Send snapshot to clients
socket.on("requestGameState", async (gameId) => {
  const manager = activeGames.get(gameId);

  socket.emit("gameState", {
    game: manager.getGameState(),
    flow: manager.serializeFlowState(),
  });
});

// Client: Receive and restore
socket.on("gameState", (snapshot) => {
  const manager = new FlowManager(gameFlow, snapshot.game, {
    restoreFrom: snapshot.flow,
  });

  // Client now has exact game state
  renderGame(manager);
});
```

### Spectator Mode

```typescript
async function createSpectatorView(gameId: string): Promise<FlowManager<GameState>> {
  const liveGame = await db.games.findById(gameId);

  // Spectators get read-only copy at current state
  return new FlowManager(gameFlow, liveGame.gameState, {
    restoreFrom: liveGame.flowState,
  });
}
```

### Auto-save Every N Turns

```typescript
class AutoSaveManager {
  private saveInterval = 5; // Save every 5 turns

  async checkAndSave(manager: FlowManager<GameState>, gameId: string) {
    const flowState = manager.serializeFlowState();

    if (flowState.turnNumber % this.saveInterval === 0) {
      await this.saveGame(gameId, manager);
    }
  }

  private async saveGame(gameId: string, manager: FlowManager<GameState>) {
    await db.games.update(gameId, {
      gameState: manager.getGameState(),
      flowState: manager.serializeFlowState(),
      updatedAt: new Date(),
    });
  }
}
```

## Important Considerations

### 1. Hooks Are Not Re-executed on Restore

When restoring from serialized state, lifecycle hooks (`onBegin`, `onEnd`) are **not** executed. This is intentional because:

- The hooks already executed in the original game session
- Their effects are already in the game state
- Re-executing would duplicate side effects

```typescript
// Original game - hooks execute
const original = new FlowManager(flow, state);
// onBegin hooks run, modify state

// Save
const saved = {
  game: original.getGameState(), // Contains hook effects
  flow: original.serializeFlowState(),
};

// Restore - hooks DON'T re-execute
const restored = new FlowManager(flow, saved.game, {
  restoreFrom: saved.flow, // Skips initialization
});
// State already contains all hook effects
```

### 2. Phase/Segment Position Preserved

The exact flow position is maintained:

```typescript
// Original at main phase, damage segment
manager.getCurrentPhase(); // "main"
manager.getCurrentSegment(); // "damage"

// After save/restore
restored.getCurrentPhase(); // "main"
restored.getCurrentSegment(); // "damage"

// Can continue exactly where left off
restored.nextSegment();
```

### 3. All Game State Must Be Serializable

Ensure your game state only contains JSON-serializable data:

✅ **Serializable**:

- Primitives (string, number, boolean)
- Plain objects
- Arrays
- null

❌ **Not Serializable**:

- Functions
- Dates (convert to timestamp)
- Maps/Sets (convert to arrays)
- Class instances (use plain objects)

```typescript
// ❌ Bad
type BadGameState = {
  createdAt: Date; // Loses type on serialize
  players: Map<string, Player>; // Not serializable
};

// ✅ Good
type GoodGameState = {
  createdAt: number; // Unix timestamp
  players: Record<string, Player>; // Plain object
};
```

### 4. Flow Definition Must Match

The same `FlowDefinition` must be used when restoring:

```typescript
// ❌ Won't work correctly
const v1Flow = {
  /* old definition */
};
const v2Flow = {
  /* updated definition */
};

const manager = new FlowManager(v1Flow, state);
const saved = manager.serializeFlowState();

// Phase names might not exist in v2
const restored = new FlowManager(v2Flow, state, {
  restoreFrom: saved, // Mismatch!
});

// ✅ Use matching definition
const restored = new FlowManager(v1Flow, state, {
  restoreFrom: saved,
});
```

## Best Practices

### 1. Version Your Saves

```typescript
type VersionedSave = {
  version: number;
  gameState: GameState;
  flowState: SerializedFlowState;
};

async function saveGameWithVersion(manager: FlowManager<GameState>) {
  const save: VersionedSave = {
    version: CURRENT_GAME_VERSION,
    gameState: manager.getGameState(),
    flowState: manager.serializeFlowState(),
  };

  await db.games.insert(save);
}
```

### 2. Validate Before Restore

```typescript
function validateSavedGame(save: any): save is SavedGame {
  return (
    typeof save.gameState === "object" &&
    typeof save.flowState === "object" &&
    typeof save.flowState.turnNumber === "number"
  );
}

async function safeLoadGame(gameId: string) {
  const saved = await db.games.findById(gameId);

  if (!validateSavedGame(saved)) {
    throw new Error("Invalid save data");
  }

  return new FlowManager(gameFlow, saved.gameState, {
    restoreFrom: saved.flowState,
  });
}
```

### 3. Compress Large States

```typescript
import { compress, decompress } from "lz-string";

async function saveCompressed(manager: FlowManager<GameState>) {
  const data = {
    game: manager.getGameState(),
    flow: manager.serializeFlowState(),
  };

  const compressed = compress(JSON.stringify(data));
  await db.games.insert({ id, data: compressed });
}

async function loadCompressed(gameId: string) {
  const saved = await db.games.findById(gameId);
  const data = JSON.parse(decompress(saved.data));

  return new FlowManager(gameFlow, data.game, {
    restoreFrom: data.flow,
  });
}
```

## Testing Serialization

```typescript
import { describe, it, expect } from "bun:test";

describe("Game Serialization", () => {
  it("should survive round-trip serialization", () => {
    const original = new FlowManager(flow, initialState);
    original.nextPhase();
    original.nextPhase();

    // Serialize
    const serialized = JSON.stringify({
      game: original.getGameState(),
      flow: original.serializeFlowState(),
    });

    // Deserialize
    const data = JSON.parse(serialized);
    const restored = new FlowManager(flow, data.game, {
      restoreFrom: data.flow,
    });

    // Verify exact match
    expect(restored.getGameState()).toEqual(original.getGameState());
    expect(restored.getCurrentPhase()).toBe(original.getCurrentPhase());
    expect(restored.getCurrentSegment()).toBe(original.getCurrentSegment());
  });
});
```

## Performance Considerations

- **Serialization**: O(n) where n is state size
- **Deserialization**: O(n) for parsing + O(1) for flow restoration
- **Memory**: Keep snapshots minimal (delta compression for large histories)
- **Database**: Index on `gameId`, `updatedAt` for fast lookups

## See Also

- [Flow Definition Guide](./flow-definition.ts)
- [Flow Manager API](./flow-manager.ts)
- [Serialization Tests](./flow/__tests__/flow-serialization.test.ts)
