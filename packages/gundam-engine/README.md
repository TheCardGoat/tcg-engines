# @tcg/gundam

> Gundam Card Game engine implementation using the `@tcg/core` framework

## Overview

`@tcg/gundam` is a comprehensive implementation of the Bandai Gundam Card Game using the `@tcg/core` framework. This package serves dual purposes:

1. **Reference Implementation**: Demonstrates best practices for building TCG engines with `@tcg/core`, validating the framework's extensibility and guiding future game implementations.
2. **Production Engine**: Provides a fully-featured, production-ready Gundam Card Game engine that can be integrated into multiplayer games, AI opponents, and simulation tools.

## Purpose

This implementation helps validate and refine the `@tcg/core` framework by:

- Demonstrating how to extend the core framework for game-specific mechanics
- Validating that the framework remains truly game-agnostic
- Identifying gaps and improvement opportunities in the core API
- Serving as living documentation for other TCG implementations

## Game Overview

The Gundam Card Game is a two-player competitive trading card game featuring:

- **Card Types**: Units (Mobile Suits), Pilots, Commands, Bases, and Resources
- **Key Mechanics**: Resource management, unit deployment, pilot pairing, attacking
- **Win Conditions**: Shield depletion, deck out, or concession
- **Zones**: Deck, Hand, Battle Area, Shield Area, Resource Area, Trash, Removal

For detailed game rules, see the [reference implementation](../engines/core-engine/src/game-engine/engines/gundam/RULES.md).

## Installation

This package is part of a monorepo and uses workspace dependencies:

```bash
bun install
```

## Usage

```typescript
import { createGundamGame } from "@tcg/gundam";

// Create a new game instance
const game = createGundamGame({
  players: [
    { id: "player1", deck: player1Deck },
    { id: "player2", deck: player2Deck },
  ],
  seed: "optional-seed-for-determinism",
});

// Execute moves
const result = game.executeMove({
  type: "PLAY_RESOURCE",
  playerId: "player1",
});

// Query game state
const currentState = game.getState();
const validMoves = game.getValidMoves("player1");
```

## Development

### Project Structure

```
src/
├── index.ts              # Main exports
├── game-definition.ts    # Game definition using @tcg/core
├── types.ts              # Gundam-specific type definitions
├── moves/                # Move definitions
│   └── index.ts
├── cards/                # Card definitions
│   └── index.ts
├── zones/                # Zone configurations
│   └── index.ts
├── phases/               # Phase definitions
│   └── index.ts
└── __tests__/            # Test files
    └── game-definition.test.ts
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

### Scripts

```bash
# Type checking
bun run check-types

# Formatting
bun run format

# Linting
bun run lint

# Testing
bun run test
bun run test:watch
bun run test:coverage

# Run all checks
bun run check
```

### Development Principles

1. **Test-Driven Development**: All features must be test-driven (TDD)
2. **Type Safety**: Full TypeScript strict mode, no `any` types
3. **Immutability**: All state is immutable
4. **Determinism**: Same inputs always produce same outputs
5. **Behavior Testing**: Test behavior through public APIs, not implementation

See the [workspace CLAUDE.md](../engines/core-engine/CLAUDE.md) for detailed development guidelines.

## Framework Integration

This package demonstrates how to build TCG engines with `@tcg/core`. Key integration points:

- **Game Definition**: Define game rules, phases, and flow using `GameDefinition`
- **State Management**: Extend core state types with game-specific properties
- **Move System**: Implement move handlers that transform game state
- **Card Definitions**: Define cards using the declarative card definition system
- **Zone Management**: Configure game-specific zones and transitions

See [packages/core/INTEGRATION.md](../core/INTEGRATION.md) for a comprehensive integration guide.

## Related Packages

- [`@tcg/core`](../core) - Core TCG engine framework
- [`@lorcanito/core-engine`](../engines/core-engine) - Existing Lorcana implementation (for reference)

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Package architecture and design patterns
- [packages/core/INTEGRATION.md](../core/INTEGRATION.md) - Framework integration guide
- [Game Rules](../engines/core-engine/src/game-engine/engines/gundam/RULES.md) - Complete Gundam Card Game rules

## Status

🚧 **Under Development**: This package is currently in initial setup phase. The structure and configuration are established, but game logic implementation is pending.

## Contributing

This package follows the workspace development guidelines. Before contributing:

1. Read [CLAUDE.md](../engines/core-engine/CLAUDE.md) for development practices
2. Review [ARCHITECTURE.md](./ARCHITECTURE.md) for structural guidelines
3. Follow TDD principles for all implementations
4. Ensure `bun run check` passes before committing

## License

See [LICENSE](../../LICENSE) in the repository root.

