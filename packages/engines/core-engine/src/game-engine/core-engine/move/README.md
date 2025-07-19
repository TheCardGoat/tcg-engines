# Game Moves

## Overview

Game moves are the primary way for players to interact with the game state. They represent player actions such as playing a card, attacking, or passing priority.

## Move Parameters

Moves receive a `FnContext` object containing:

- `G`: The current game state
- `coreOps`: Game operations to manipulate state
- `playerID`: ID of the player making the move

## Best Practices for Accessing Context

### Recommended: Use `coreOps.getCtx()`

Always prefer accessing context via `coreOps.getCtx()` rather than through the direct `ctx` parameter:

```typescript
export const betterMove = (
  { G, coreOps, playerID },
  ...args
) => {
  // Get the current context
  const ctx = coreOps.getCtx();
  
  // Now you can use ctx
  if (ctx.currentPhase !== "mainPhase") {
    return createInvalidMove("WRONG_PHASE", "error.message");
  }
  
  // Use coreOps for operations
  coreOps.moveCard({...});
  
  return G;
};
```

### Deprecated: Direct `ctx` Access

Avoid directly destructuring `ctx` from the function context:

```typescript
// DEPRECATED - Don't do this
export const oldMove = (
  { G, ctx, coreOps, playerID },
  ...args
) => {
  if (ctx.currentPhase !== "mainPhase") {
    return createInvalidMove("WRONG_PHASE", "error.message");
  }
  
  return G;
};
```

## Why Use `coreOps.getCtx()`?

1. **Always Up-to-date**: `coreOps.getCtx()` always returns the latest context state
2. **Consistent Pattern**: All state manipulations should go through coreOps
3. **Future-proof**: Direct ctx access may be removed in future versions

## Example

```typescript
export const exampleMove = (
  { G, coreOps, playerID },
  targetId: string
) => {
  try {
    const ctx = coreOps.getCtx();
    
    // Check game phase
    if (ctx.currentPhase !== "mainPhase") {
      return createInvalidMove("WRONG_PHASE", "error.message");
    }
    
    // Execute operation
    coreOps.moveCard({
      playerId: playerID,
      instanceId: targetId,
      to: "discard"
    });
    
    return G;
  } catch (error) {
    return G; // Return unchanged state on error
  }
};
``` 