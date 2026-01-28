# @tcg/riftbound

Riftbound TCG engine implementation using the @tcg/core framework.

## Overview

This package provides a complete implementation of the Riftbound TCG game engine. It serves as both a production-ready game engine and a reference implementation for building TCG engines with @tcg/core.

## Installation

```bash
bun add @tcg/riftbound
```

## Usage

```typescript
import { RiftboundEngine } from "@tcg/riftbound";

// Create a new game engine instance
const engine = new RiftboundEngine();

// Initialize a game
const gameState = engine.createGame({
  players: ["player1", "player2"],
  // ... game configuration
});
```

## Architecture

The engine follows the @tcg/core framework patterns:

- **NO** `defineMove()`, `defineZone()`, `definePhase()`, `defineCard()` helpers
- Use `GameDefinition<TState, TMoves>` type directly
- Zones are simple state arrays: `Record<PlayerId, CardId[]>`
- Cards are plain objects in lookup tables
- Moves use `GameMoveDefinitions` with condition and reducer
- Flow is optional - use `FlowDefinition` or simple state tracking

## Package Structure

```
src/
├── engine/           # Main engine class
├── game-definition/  # Game definition implementation
│   ├── flow/         # Turn/phase flow
│   ├── moves/        # Game moves
│   ├── setup/        # Initial game setup
│   ├── trackers/     # State trackers
│   └── win-conditions/
├── operations/       # Game operations
├── testing/          # Test utilities
├── types/            # Type definitions
├── validators/       # Move validation
└── zones/            # Zone configurations
```

## Testing

```bash
bun test
```

## Related Packages

- `@tcg/riftbound-types` - Type definitions
- `@tcg/riftbound-cards` - Card definitions and parser
- `@tcg/core` - Core framework
