# @tcg/gundam

> Gundam Card Game engine implementation using @tcg/core

## Overview

This package implements the Gundam Card Game using the `@tcg/core` framework. It provides:

- Complete game rules and mechanics
- Card definitions for all sets
- Type-safe move system
- Phase and turn management
- Zone configurations
- Tooling for card management

## Installation

```bash
bun install @tcg/gundam
```

## Quick Start

```typescript
import { gundamGame } from "@tcg/gundam";

// Create a new game instance
const game = gundamGame.create({
  players: ["player1", "player2"],
  // ... game options
});

// Execute moves
const newState = game.executeMove({
  type: "DEPLOY_UNIT",
  playerId: "player1",
  cardId: "card-123",
});
```

## Project Structure

```
packages/gundam-engine/
├── src/
│   ├── cards/              # Card definitions
│   │   ├── card-types.ts   # Type definitions
│   │   ├── sets/           # Cards organized by set
│   │   │   ├── st01/       # Starter Set 01
│   │   │   ├── st02/       # Starter Set 02
│   │   │   └── gd01/       # Booster Set GD01
│   │   └── index.ts
│   ├── game-definition.ts  # Main game definition
│   ├── types.ts            # Game-specific types
│   ├── moves/              # Move implementations
│   ├── phases/             # Phase definitions
│   └── zones/              # Zone configurations
├── tools/                  # Card management tools
│   ├── scraper/            # Web scraping
│   ├── parser/             # Text parsing
│   └── generator/          # Code generation
└── scripts/                # CLI scripts
    ├── scrape-card.ts      # Scrape single card
    ├── scrape-set.ts       # Scrape entire set
    └── generate-index.ts   # Generate indexes
```

## Card Management

### Scraping Cards

Fetch card data from the official website:

```bash
# Single card
bun run scripts/scrape-card.ts ST01-001

# Entire set
bun run scripts/scrape-set.ts ST01
```

### Card Definitions

Cards are plain TypeScript objects following @tcg/core patterns:

```typescript
import type { UnitCardDefinition } from "./cards/card-types";

export const RX782Gundam: UnitCardDefinition = {
  id: "st01-001",
  name: "RX-78-2 Gundam",
  cardNumber: "ST01-001",
  setCode: "ST01",
  cardType: "UNIT",
  
  // Stats
  level: 3,
  cost: 2,
  ap: 5,
  hp: 6,
  color: "blue",
  
  // Properties
  zones: ["space", "earth"],
  traits: ["earth-federation", "white-base"],
  linkRequirements: ["amuro-ray"],
  
  // Abilities
  keywords: [
    { keyword: "First-Strike" }
  ],
  abilities: [
    {
      trigger: "ON_DEPLOY",
      description: "【Deploy】Search your deck for a Pilot card named 'Amuro Ray'.",
      effect: {
        type: "SEARCH_DECK",
        filter: { cardType: "PILOT", name: "Amuro Ray" },
        destination: "hand",
        count: 1
      }
    }
  ],
  
  rarity: "legendary",
  imageUrl: "https://...",
  sourceTitle: "Mobile Suit Gundam"
};
```

## Development

### Setup

```bash
bun install
```

### Testing

```bash
# All tests
bun test

# Specific component
bun test tools/
bun test src/
```

### Type Checking

```bash
bun run tsc --noEmit
```

### Linting

```bash
bun run oxlint --fix ./src
```

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture overview
- [TYPES.md](./TYPES.md) - Type system documentation
- [tools/README.md](./tools/README.md) - Card management tools

## Contributing

1. Follow the development guidelines in [ARCHITECTURE.md](./ARCHITECTURE.md)
2. Write tests for new features
3. Ensure type safety (no `any` types)
4. Run linting and type checking before committing

## License

See [LICENSE](../../LICENSE)
