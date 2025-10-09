# Gundam Card Converter Migration Guide

This document describes the migration from the old card converter system to the new @tcg/gundam architecture.

## Overview

The card scraping and parsing functionality has been migrated from:
- **Old Location**: `packages/engines/core-engine/src/game-engine/engines/gundam/src/card-converter/`
- **New Location**: `packages/gundam-engine/tools/`

## Key Changes

### 1. Architecture

**Old System:**
- Complex nested objects (GundamitoCard types)
- Resolution/Triggered/Continuous ability patterns
- ParsedEffect/ParsedClause structures
- Gap analysis and file organization components

**New System:**
- Simple plain objects following @tcg/core patterns
- Flat ability structure with trigger/activated/description/effect
- Focus on core functionality (scraper + parser + generator)
- Individual TypeScript files per card

### 2. Card Types

**Old Format:**
```typescript
interface GundamitoUnitCard {
  id: string;
  type: "unit";
  abilities: Array<{
    type: "resolution" | "triggered" | "continuous";
    effects: ParsedEffect[];
    // ... complex structure
  }>;
}
```

**New Format:**
```typescript
interface UnitCardDefinition {
  id: string;
  cardType: "UNIT";
  abilities?: Array<{
    trigger?: "ON_DEPLOY" | "ON_ATTACK" | ...;
    description: string;
    effect: { type: string; [key: string]: unknown };
  }>;
}
```

### 3. Ability Structure

**Old Format:**
```typescript
{
  type: "resolution",
  effects: [
    {
      type: "damage",
      target: { /* complex target structure */ },
      parameters: { /* effect data */ }
    }
  ],
  dependentEffects: true,
  resolveEffectsIndividually: false
}
```

**New Format:**
```typescript
{
  trigger: "ON_DEPLOY",
  description: "【Deploy】Deal 2 damage to target enemy Unit.",
  effect: {
    type: "DAMAGE",
    amount: 2,
    target: {
      type: "unit",
      controller: "opponent",
      filter: { zone: "battle-area" }
    }
  }
}
```

### 4. File Organization

**Old System:**
- Complex directory structure with type/set organization
- Helper functions and factory patterns
- Multiple layers of abstraction

**New System:**
- Simple set-based organization: `sets/st01/001-card-name.ts`
- Plain data objects (no helper functions)
- Direct exports from card files

## Migration Steps

### For Existing Card Data

If you have existing JSON card data:

1. **Place JSON files** in a temporary location
2. **Create a migration script**:

```typescript
import { parseCardText } from "./tools/parser/text-parser";
import { createCardDefinition } from "./tools/generator/card-generator";
import { saveCardFile } from "./tools/generator/file-writer";

// Read your JSON data
const cards = JSON.parse(readFileSync("cards.json", "utf-8"));

for (const oldCard of cards) {
  // Convert to ScrapedCardData format
  const scraped = {
    cardNumber: oldCard.id,
    name: oldCard.name,
    cardType: oldCard.type.toUpperCase(),
    // ... map other fields
  };
  
  // Parse abilities
  const parsed = parseCardText(oldCard.text || "");
  
  // Create definition
  const card = createCardDefinition(scraped, parsed);
  
  // Save file
  if (card) {
    await saveCardFile(card);
  }
}
```

### For New Cards

Use the scraping tools:

```bash
# Scrape from official website
bun run scripts/scrape-card.ts ST01-001
bun run scripts/scrape-set.ts ST01
```

## Compatibility Notes

### Removed Features

The following features from the old system are not included:

1. **Gap Analysis** - Type system analysis tools
2. **Validation System** - Complex validation rules
3. **File Organization** - Advanced file management
4. **Batch Processing** - Complex batch operations

These were removed to focus on core functionality. They can be added later if needed.

### Preserved Features

1. **Web Scraping** - Fetching cards from official website
2. **Text Parsing** - Converting card text to structured format
3. **Code Generation** - Creating TypeScript card files
4. **Keyword Extraction** - Identifying keyword abilities
5. **Trigger Detection** - Parsing ability triggers

## Testing

The new system includes comprehensive tests:

```bash
# Run all tests
bun test tools/

# Test specific components
bun test tools/scraper/
bun test tools/parser/
bun test tools/generator/
```

## Type Safety

All generated code is fully type-safe:

- Uses TypeScript's strict mode
- No `any` types
- Proper type guards
- CardDefinition union types

## Future Enhancements

Potential additions to match old system:

1. **Batch Processing** - Parallel scraping and generation
2. **Validation** - Card definition validation
3. **Database Integration** - Store cards in database
4. **API Server** - Serve card data via API
5. **Admin UI** - Web interface for card management

## Support

For questions or issues:

1. Check [tools/README.md](./tools/README.md) for usage
2. Review [ARCHITECTURE.md](./ARCHITECTURE.md) for design patterns
3. See [TYPES.md](./TYPES.md) for type system details

## Comparison Table

| Feature | Old System | New System |
|---------|-----------|------------|
| Card Scraping | ✅ | ✅ |
| Text Parsing | ✅ | ✅ |
| Code Generation | ✅ | ✅ |
| Gap Analysis | ✅ | ❌ |
| Validation | ✅ | ❌ |
| Batch Processing | ✅ | ✅ (basic) |
| Type Safety | ✅ | ✅ (improved) |
| File Organization | Complex | Simple |
| Ability Format | Complex | Simple |
| Output Format | Multiple files | Single file per card |

## Example Migration

**Old Card Definition:**
```typescript
export const gundamAerial: GundamitoUnitCard = {
  id: "ST01-006",
  type: "unit",
  abilities: [
    {
      type: "resolution",
      effects: [
        { type: "draw", parameters: { amount: 1 } }
      ]
    }
  ],
  // ... complex structure
};
```

**New Card Definition:**
```typescript
export const GundamAerial: UnitCardDefinition = {
  id: "st01-006",
  cardType: "UNIT",
  abilities: [
    {
      trigger: "ON_DEPLOY",
      description: "【Deploy】Draw 1 card.",
      effect: { type: "DRAW", amount: 1, player: "self" }
    }
  ],
  // ... simple structure
};
```

The new format is simpler, more maintainable, and follows @tcg/core patterns.

