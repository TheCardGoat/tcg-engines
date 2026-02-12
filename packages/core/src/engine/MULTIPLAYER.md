# MultiplayerEngine - Network Synchronization Guide

## Overview

`MultiplayerEngine` is a reusable wrapper around `RuleEngine` that encapsulates multiplayer patterns for server-authoritative gameplay. It provides a clean abstraction for network synchronization using Immer patches.

## Key Features

- **Server-Authoritative Architecture**: Server is the source of truth
- **Patch-Based Synchronization**: Efficient delta updates using Immer patches
- **Client Tracking**: Monitor which clients are synchronized
- **Reconnection Support**: Batch patch application for catching up
- **Type-Safe**: Full TypeScript support with branded types
- **Network Agnostic**: Works with any transport layer (WebSocket, HTTP, etc.)

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Server                               │
│  ┌───────────────────────────────────────────────────┐  │
│  │           MultiplayerEngine (Server Mode)         │  │
│  │  - Executes moves authoritatively                 │  │
│  │  - Generates patches                              │  │
│  │  - Broadcasts patches to clients                  │  │
│  │  - Tracks client sync state                       │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           │ Patches
                           ▼
        ┌──────────────────────────────────────────┐
        │          Network Layer                   │
        │   (WebSocket, HTTP, Custom Protocol)     │
        └──────────────────────────────────────────┘
                           │
                           │ Patches
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Clients                              │
│  ┌───────────────────────────────────────────────────┐  │
│  │           MultiplayerEngine (Client Mode)         │  │
│  │  - Applies patches from server                    │  │
│  │  - Maintains synced state                         │  │
│  │  - Validates moves locally (optional)             │  │
│  │  - Provides player views                          │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Quick Start

### Server Setup

```typescript
import { MultiplayerEngine } from "@tcg/core";

const server = new MultiplayerEngine(gameDefinition, players, {
  mode: "server",
  seed: "game-123-seed",

  // Callback when moves generate patches
  onPatchBroadcast: (broadcast) => {
    // Send patches to all connected clients via your network layer
    websocket.broadcast({
      type: "PATCH_UPDATE",
      patches: broadcast.patches,
      historyIndex: broadcast.historyIndex,
    });
  },

  // Callback when moves are rejected
  onMoveRejected: (moveId, error, errorCode) => {
    console.error(`Move ${moveId} rejected: ${error}`);
  },
});

// Execute moves (server only)
const result = server.executeMove("playCard", {
  playerId: createPlayerId("p1"),
  data: { cardId: "card-123" },
});

// Patches are automatically broadcast via onPatchBroadcast callback
```

### Client Setup

```typescript
import { MultiplayerEngine } from "@tcg/core";

const client = new MultiplayerEngine(gameDefinition, players, {
  mode: "client",

  // Callback when patches are applied
  onPatchesApplied: (patches) => {
    console.log(`Applied ${patches.length} patches from server`);
    updateUI(); // Refresh your game UI
  },
});

// Receive and apply patches from server
websocket.on("message", (data) => {
  if (data.type === "PATCH_UPDATE") {
    client.applyServerPatches(data.patches);
  }
});

// Get current state
const state = client.getState();

// Get player-specific view (hides private information)
const playerView = client.getPlayerView(playerId);

// Check valid moves for UI (enable/disable buttons)
const validMoves = client.getValidMoves(playerId);
const canDraw = client.canExecuteMove("drawCard", { playerId });
```

## Common Patterns

### Pattern 1: Move Request Flow

```typescript
// CLIENT SIDE
// User clicks "Draw Card" button
function handleDrawCard() {
  // Optional: Check if move is valid (for immediate UI feedback)
  const canDraw = client.canExecuteMove("drawCard", { playerId });

  if (!canDraw) {
    showError("Cannot draw card right now");
    return;
  }

  // Send move request to server
  websocket.send({
    type: "MOVE_REQUEST",
    moveId: "drawCard",
    playerId: "p1",
  });
}

// SERVER SIDE
// Receive move request from client
websocket.on("message", (msg) => {
  if (msg.type === "MOVE_REQUEST") {
    const result = server.executeMove(msg.moveId, {
      playerId: msg.playerId,
    });

    // On success, patches automatically broadcast to all clients
    // On failure, send error back to requesting client
    if (!result.success) {
      websocket.send({
        type: "MOVE_ERROR",
        error: result.error,
        errorCode: result.errorCode,
      });
    }
  }
});
```

### Pattern 2: Client Reconnection

```typescript
// SERVER SIDE
function handleReconnection(clientId: string, lastKnownIndex: number) {
  // Get all patches since client's last known state
  const catchupPatches = server.getCatchupPatches(lastKnownIndex + 1);

  return {
    type: "CATCHUP",
    patches: catchupPatches,
    currentIndex: server.getCurrentHistoryIndex(),
  };
}

// CLIENT SIDE
function reconnect(lastKnownIndex: number) {
  websocket.send({
    type: "RECONNECT",
    lastKnownIndex,
  });
}

websocket.on("message", (msg) => {
  if (msg.type === "CATCHUP") {
    // Apply all missed patches at once
    client.applyServerPatches(msg.patches);
    console.log(`Caught up from ${lastKnownIndex} to ${msg.currentIndex}`);
  }
});
```

### Pattern 3: Client State Tracking

```typescript
// SERVER SIDE
// Register client when they connect
server.registerClient("client-123", -1);

// Update sync index when client acknowledges patches
websocket.on("message", (msg) => {
  if (msg.type === "PATCH_ACK") {
    server.updateClientSyncIndex(msg.clientId, msg.historyIndex);
  }
});

// Check client sync state
const clientState = server.getClientState("client-123");
if (clientState && !clientState.connected) {
  console.log("Client disconnected, can remove from game");
}

// Get all clients for monitoring
const allClients = server.getAllClients();
console.log(`${allClients.filter((c) => c.connected).length} clients online`);
```

### Pattern 4: Optimistic UI Updates

```typescript
// CLIENT SIDE
function handlePlayCard(cardId: string) {
  // Check if move is valid
  if (!client.canExecuteMove("playCard", { playerId, data: { cardId } })) {
    return;
  }

  // Optimistic UI update (optional)
  showCardPlaying(cardId);

  // Send to server
  websocket.send({
    type: "MOVE_REQUEST",
    moveId: "playCard",
    data: { cardId },
  });

  // Server will broadcast patches if successful
  // If rejected, patches won't arrive and server sends error
}

websocket.on("message", (msg) => {
  if (msg.type === "MOVE_ERROR") {
    // Revert optimistic update
    hideCardPlaying(msg.data?.cardId);
    showError(msg.error);
  }
});
```

## API Reference

### Server-Only Methods

| Method                                      | Description                          |
| ------------------------------------------- | ------------------------------------ |
| `executeMove(moveId, context)`              | Execute a move and generate patches  |
| `getCatchupPatches(sinceIndex)`             | Get patches for reconnecting clients |
| `registerClient(clientId, lastSyncedIndex)` | Track a connected client             |
| `unregisterClient(clientId)`                | Mark client as disconnected          |
| `updateClientSyncIndex(clientId, index)`    | Update client's sync state           |
| `getClientState(clientId)`                  | Get a client's sync state            |
| `getAllClients()`                           | Get all registered clients           |
| `getHistory()`                              | Get full move history                |
| `getCurrentHistoryIndex()`                  | Get current history position         |

### Client-Only Methods

| Method                        | Description               |
| ----------------------------- | ------------------------- |
| `applyServerPatches(patches)` | Apply patches from server |

### Common Methods (Both Server & Client)

| Method                            | Description                      |
| --------------------------------- | -------------------------------- |
| `getState()`                      | Get current game state           |
| `getPlayerView(playerId)`         | Get player-specific view         |
| `canExecuteMove(moveId, context)` | Check if move is valid           |
| `getValidMoves(playerId)`         | Get all valid moves for player   |
| `checkGameEnd()`                  | Check if game has ended          |
| `getEngine()`                     | Access underlying RuleEngine     |
| `getMode()`                       | Get current mode (server/client) |

## Examples

See `multiplayer-engine.example.ts` for comprehensive examples including:

- Basic server setup
- Client implementation
- WebSocket integration
- Reconnection handling
- Full game simulation

## Integration with Existing Projects

### Using in Lorcana Engine

```typescript
// packages/lorcana-engine/src/multiplayer/server.ts
import { MultiplayerEngine } from "@tcg/core";
import { lorcanaGameDefinition } from "../game-definition";

export function createLorcanaServer(players) {
  return new MultiplayerEngine(lorcanaGameDefinition, players, {
    mode: "server",
    seed: generateGameSeed(),
    onPatchBroadcast: broadcastToClients,
  });
}
```

### Using in Gundam Engine

```typescript
// packages/gundam-engine/src/multiplayer/server.ts
import { MultiplayerEngine } from "@tcg/core";
import { gundamGameDefinition } from "../game-definition";

export function createGundamServer(players) {
  return new MultiplayerEngine(gundamGameDefinition, players, {
    mode: "server",
    seed: generateGameSeed(),
    onPatchBroadcast: broadcastToClients,
  });
}
```

## Benefits Over Direct RuleEngine Usage

1. **Encapsulation**: Hides multiplayer complexity behind clean API
2. **Safety**: Server/client separation prevents invalid operations
3. **Callbacks**: Built-in hooks for network integration
4. **Client Tracking**: Automatic sync state management
5. **Reconnection**: Built-in catchup patch support
6. **Type Safety**: Full TypeScript support with mode enforcement
7. **Reusability**: Works across all game projects

## Testing

See `multiplayer-engine.test.ts` for comprehensive test suite covering:

- Server mode operations
- Client mode operations
- Server-client synchronization
- Client reconnection
- Error handling
- Callbacks and hooks

## Performance Considerations

1. **Patch Size**: Immer patches are minimal - only changes are transmitted
2. **Batching**: Consider batching multiple patches for better network efficiency
3. **Compression**: Use gzip/compression for network transmission
4. **ACK Protocol**: Track client acknowledgments to prevent packet loss
5. **Delta Encoding**: Patches are already delta-encoded by Immer

## Best Practices

1. **Always use server mode for authoritative engine**
2. **Use client mode for all connected players**
3. **Implement reconnection logic for network stability**
4. **Validate moves on both client (UI) and server (authority)**
5. **Use player views to hide private information**
6. **Track client sync state for monitoring**
7. **Implement proper error handling and user feedback**
8. **Test with network latency simulation**

## Troubleshooting

### States Out of Sync

- Ensure all clients apply patches in order
- Check that server seed is set for deterministic RNG
- Verify no client-side state mutations outside patches

### Patches Not Broadcasting

- Check `onPatchBroadcast` callback is registered
- Verify move execution returned `success: true`
- Check network layer is transmitting messages

### Client Can't Execute Moves

- Ensure client is in "client" mode
- Moves should only be executed on server
- Clients should only `applyServerPatches`

### Reconnection Issues

- Use `getCatchupPatches(lastKnownIndex)` correctly
- Ensure `lastKnownIndex` is tracked on client
- Verify patches are applied in correct order

## Migration from RuleEngine

If you're currently using `RuleEngine` directly:

```typescript
// OLD CODE
const server = new RuleEngine(gameDefinition, players);
const result = server.executeMove("playCard", context);
if (result.success) {
  broadcastToClients(result.patches);
}

// NEW CODE
const server = new MultiplayerEngine(gameDefinition, players, {
  mode: "server",
  onPatchBroadcast: (broadcast) => broadcastToClients(broadcast.patches),
});
const result = server.executeMove("playCard", context);
// Patches automatically broadcast via callback
```

## Related Documentation

- `rule-engine.ts` - Core game engine implementation
- `integration-network-sync.test.ts` - Integration test patterns
- `multiplayer-engine.example.ts` - Comprehensive examples
- Game Definition documentation for defining moves and state
