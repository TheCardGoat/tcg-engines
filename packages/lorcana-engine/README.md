# @tcg/lorcana

Disney Lorcana TCG engine built with `@tcg/core` framework.

## Overview

This package implements the complete Disney Lorcana trading card game using the `@tcg/core` framework. It serves as both a production-ready Lorcana engine and a reference implementation demonstrating best practices for building TCG engines.

## Status

🚧 **Work in Progress** - Package structure and configuration complete. Game logic implementation in progress.

## Installation

This is a workspace package. Install dependencies from the monorepo root:

```bash
bun install
```

## Development

### Available Scripts

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

### Project Structure

```
src/
├── game-definition/     # Game definition and configuration
├── moves/               # Move handlers
├── cards/               # Card definitions and abilities
├── types/               # TypeScript type definitions
├── queries/             # State query functions
├── rules/               # Rule implementations
└── index.ts             # Main entry point
```

Each directory contains a README.md explaining its purpose and usage.

## Architecture

This package integrates with `@tcg/core` by:

1. **Defining game-specific state** - Extends base `GameState` with Lorcana data
2. **Registering moves** - Implements move handlers for all player actions
3. **Configuring zones** - Defines zones (Deck, Hand, Play, Discard, Inkwell)
4. **Defining flow** - Specifies turn/phase/step structure
5. **Implementing abilities** - Creates keyword, triggered, and activated abilities

## Usage Example

```typescript
import { RuleEngine } from "@tcg/core";
import { lorcanaGame } from "@tcg/lorcana";

// Create engine instance
const engine = new RuleEngine(lorcanaGame, {
  seed: "game-seed-123",
});

// Setup game with player decks
const initialState = engine.setup({
  players: {
    player1: { deckId: "deck-1" },
    player2: { deckId: "deck-2" },
  },
});

// Execute moves
const result = engine.executeMove("playCard", {
  playerId: "player1",
  params: { cardId: "card-123" },
});

// Get current state
const state = engine.getState();
```

## Dependencies

- `@tcg/core` - Core TCG engine framework
- All dependencies from `@tcg/core` (Immer, Zod, nanoid, seedrandom, etc.)

## Boundaries

This package uses Turborepo boundaries to enforce clean architecture:

- ✅ Can depend on: `@tcg/core`
- ❌ Cannot depend on: Other game engines, UI packages, networking

## Testing

All game mechanics are tested through behavior-driven tests:

```typescript
describe("Quest Move", () => {
  it("gains lore equal to card's lore value", () => {
    const engine = createTestEngine();
    // Test implementation
  });
  
  it("exerts the character", () => {
    // Test implementation
  });
  
  it("rejects questing with exerted character", () => {
    // Test implementation
  });
});
```

## Documentation

- **Product Mission**: `.agent-os/packages/lorcana-engine/product/mission.md`
- **Tech Stack**: `.agent-os/packages/lorcana-engine/product/tech-stack.md`
- **Roadmap**: `.agent-os/packages/lorcana-engine/product/roadmap.md`
- **Integration Guide**: `@packages/core/ENGINE_INTEGRATION.md`

## Contributing

This package follows strict coding standards:

- TypeScript strict mode (no `any` types)
- Test-driven development (TDD mandatory)
- Behavior-driven testing (no mocking)
- Immutable state (via Immer)
- Pure functions preferred
- Biome for formatting and linting

See `@.agent-os/standards/` for detailed guidelines.

## License

MIT

## References

- [Disney Lorcana Official Site](https://www.disneylorcana.com/)
- [Lorcana Official Rules](https://www.disneylorcana.com/rules)
- `@tcg/core` framework documentation

