---
paths: packages/gundam-engine/**/*.ts
---

# Gundam Engine Rules

## Overview

The gundam-engine package implements the Gundam Card Game using the @tcg/core framework. It includes card definitions, game rules, and tooling for card management.

## Package Structure

```
packages/gundam-engine/
├── src/
│   ├── cards/             # Card definitions by set
│   ├── game-definition.ts # Main game definition
│   ├── moves/             # Move implementations
│   ├── phases/            # Phase definitions
│   └── zones/             # Zone configurations
└── tools/                 # Card management tooling
    ├── scraper/           # Card data scraping
    ├── parser/            # Card text parsing
    └── generator/         # Code generation
```

## Game Definition Pattern

Follow the same patterns as other engines:

```typescript
import { GameDefinition } from "@tcg/core";

export const gundamGameDefinition: GameDefinition<GundamState> = {
  name: "Gundam Card Game",
  minPlayers: 2,
  maxPlayers: 2,
  zones: gundamZones,
  moves: gundamMoves,
  setup: gundamSetup,
  winConditions: gundamWinConditions,
};
```

## Extending @tcg/core

### Custom State Type

```typescript
type GundamCardState = {
  // Gundam-specific card properties
  pilotedBy?: CardId;
  boosted: boolean;
  // ... other game-specific state
};

type GundamCard = CardInstance<GundamCardState>;
```

### Custom Zones

Define game-specific zones:

```typescript
const gundamZones: ZoneConfig[] = [
  { id: "deck", type: "hidden", ordered: true },
  { id: "hand", type: "hidden", ordered: false },
  { id: "battlefield", type: "public", ordered: false },
  // ... Gundam-specific zones
];
```

## Tools

### Scraper
Fetches card data from official sources:
```bash
cd packages/gundam-engine
bun run tools/scraper/scrape.ts
```

### Parser
Parses card text into structured ability definitions:
```bash
bun run tools/parser/parse.ts
```

### Generator
Generates TypeScript card definition files:
```bash
bun run tools/generator/generate.ts
```

## Best Practices

1. **Follow core patterns** - Use @tcg/core conventions
2. **Keep tools separate** - Tools are in `/tools`, not `/src`
3. **Test card interactions** - Focus on integration tests
4. **Document game rules** - Add rules references as needed

## Related Packages

- Core framework: `packages/core/`
- Similar engine: `packages/lorcana-engine/`
- Template: `packages/template-engine/`
