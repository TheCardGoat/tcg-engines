---
paths: packages/lorcana-cards/**/*.ts
---

# Lorcana Cards Rules

## Overview

The lorcana-cards package contains card definitions for Disney Lorcana TCG. Cards are organized by set number and define abilities using the lorcana-engine ability system.

## Package Structure

```
packages/lorcana-cards/src/
├── cards/
│   ├── 001/              # Set 1 (The First Chapter)
│   │   ├── characters/   # Character cards
│   │   ├── actions/      # Action cards
│   │   ├── items/        # Item cards
│   │   ├── locations/    # Location cards
│   │   └── index.ts      # Set exports
│   ├── 002/              # Set 2 (Rise of the Floodborn)
│   └── ...
└── index.ts              # Main exports
```

## File Naming Convention

```
{cardNumber}-{name-in-kebab-case}.ts
{cardNumber}-{name-in-kebab-case}.test.ts
```

Examples:
- `115-mickey-mouse-brave-little-tailor.ts`
- `115-mickey-mouse-brave-little-tailor.test.ts`

## Card Definition Structure

### Character Card

```typescript
import type { CharacterCard } from "@tcg/lorcana";

export const mickeyMouseBraveLittleTailor: CharacterCard = {
  id: "a81",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Brave Little Tailor",
  fullName: "Mickey Mouse - Brave Little Tailor",
  inkType: ["ruby"],
  set: "001",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 8,
  strength: 5,
  willpower: 5,
  lore: 4,
  cardNumber: 115,
  inkable: true,
  externalIds: {
    ravensburger: "...",
  },
  abilities: [
    {
      id: "a81-1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};
```

## Ability Implementation

**For detailed ability patterns, refer to:** `.claude/skills/lorcana-cards/PATTERNS.md`

### Keyword Abilities

```typescript
abilities: [
  {
    id: "card-id-1",
    text: "Evasive",
    type: "keyword",
    keyword: "Evasive",
  },
]
```

### Triggered Abilities

```typescript
import { whenYouPlayThisCharacter } from "@tcg/lorcana/abilities";
import { drawACard } from "@tcg/lorcana/effects";

abilities: [
  whenYouPlayThisCharacter({
    name: "Ability Name",
    text: "When you play this character, draw a card.",
    effects: [drawACard],
  }),
]
```

## Card Types

| Type | Properties |
|------|------------|
| `character` | strength, willpower, lore, classifications |
| `action` | effect text |
| `item` | durability (if applicable) |
| `location` | move cost, willpower, lore |

## Ink Types

```typescript
type InkType = "amber" | "amethyst" | "emerald" | "ruby" | "sapphire" | "steel";
```

## Testing Cards

Each card should have a corresponding test file:

```typescript
import { describe, it, expect } from "bun:test";
import { mickeyMouseBraveLittleTailor } from "./115-mickey-mouse-brave-little-tailor";

describe("Mickey Mouse - Brave Little Tailor", () => {
  it("has correct base stats", () => {
    expect(mickeyMouseBraveLittleTailor.cost).toBe(8);
    expect(mickeyMouseBraveLittleTailor.strength).toBe(5);
    expect(mickeyMouseBraveLittleTailor.willpower).toBe(5);
    expect(mickeyMouseBraveLittleTailor.lore).toBe(4);
  });

  it("has Evasive keyword", () => {
    const evasive = mickeyMouseBraveLittleTailor.abilities.find(
      (a) => a.type === "keyword" && a.keyword === "Evasive"
    );
    expect(evasive).toBeDefined();
  });
});
```

## Best Practices

1. **Match printed card text** - `text` field should match official card text
2. **Unique IDs** - Use format `{setNumber}{cardNumber}` or similar
3. **Export from index** - Add new cards to the set's `index.ts`
4. **Write tests** - Every card with abilities needs tests
5. **Use helpers** - Leverage ability helpers from lorcana-engine

## Skills Reference

For comprehensive ability implementation patterns and helper documentation:
- `.claude/skills/lorcana-cards/PATTERNS.md`
- `.claude/skills/lorcana-cards/helpers-index/`
- `.claude/skills/lorcana-cards/examples/`
