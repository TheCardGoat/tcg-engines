# Gundam Card Tools

This directory contains tools for scraping, parsing, and generating Gundam Card Game card definitions.

## Overview

The tooling pipeline consists of three main components:

1. **Scraper** - Fetches card data from the official Gundam Card Game website
2. **Parser** - Converts card text into structured ability format
3. **Generator** - Creates TypeScript card definition files

## Directory Structure

```
tools/
├── scraper/
│   ├── card-scraper.ts         # HTML scraping logic
│   └── __tests__/              # Scraper tests
├── parser/
│   ├── text-parser.ts          # Text parsing logic
│   └── __tests__/              # Parser tests
└── generator/
    ├── card-generator.ts       # Card definition generation
    ├── file-writer.ts          # File I/O operations
    └── __tests__/              # Generator tests
```

## Usage

### Scrape a Single Card

```bash
bun run scripts/scrape-card.ts ST01-001
```

This will:
1. Fetch card data from https://www.gundam-gcg.com
2. Parse the card's effect text into structured abilities
3. Generate a TypeScript file at `src/cards/sets/st01/001-card-name.ts`

### Scrape an Entire Set

```bash
bun run scripts/scrape-set.ts ST01
```

This will:
1. Scrape all cards in the set (sequential from 001 until failures)
2. Parse and generate each card
3. Create a set index file at `src/cards/sets/st01/index.ts`

### Generate Master Index

```bash
bun run scripts/generate-index.ts
```

This will scan all set directories and create the master index file at `src/cards/index.ts`.

## Components

### Scraper

The scraper fetches card data from the official website and extracts:

- Card number, name, rarity
- Type, color, level, cost
- Stats (AP, HP)
- Zones, traits, link requirements
- Effect text (raw HTML)
- Image URL and source title

**Key Functions:**
- `scrapeCard(cardNumber)` - Scrape a single card
- `scrapeSet(setCode)` - Scrape all cards in a set
- `parseCardHTML(html)` - Parse HTML to extract card data

### Parser

The parser converts raw card text into structured ability format:

**Handles:**
- Keyword abilities (`<Repair>`, `<Blocker>`, etc.)
- Triggered abilities (`【Deploy】`, `【Attack】`, etc.)
- Activated abilities (`【Activate･Main】`, etc.)
- Effect parsing (draw, damage, search, etc.)

**Key Functions:**
- `parseCardText(text)` - Main parsing function
- `extractKeywords(text)` - Extract keyword abilities
- `parseAbilityText(text)` - Parse triggered/activated abilities

### Generator

The generator creates TypeScript card definition files:

**Features:**
- Type-safe card definitions
- Proper import statements
- Formatted TypeScript code
- Kebab-case filenames
- PascalCase variable names

**Key Functions:**
- `createCardDefinition(scraped, parsed)` - Convert to CardDefinition
- `generateCardFile(card)` - Generate TypeScript code
- `saveCardFile(card)` - Write file to disk

## Type System

All cards follow the `CardDefinition` type from `src/cards/card-types.ts`:

```typescript
type CardDefinition = 
  | UnitCardDefinition 
  | PilotCardDefinition 
  | CommandCardDefinition 
  | BaseCardDefinition_Structure
  | ResourceCardDefinition;
```

### Ability Format

Abilities are structured as:

```typescript
type ParsedAbility = {
  trigger?: "ON_DEPLOY" | "ON_ATTACK" | ...;
  activated?: { timing: "MAIN" | "ACTION"; cost?: string };
  description: string;
  effect: {
    type: string;  // "DRAW", "DAMAGE", "SEARCH_DECK", etc.
    [key: string]: unknown;
  };
};
```

## Testing

Run tests for all components:

```bash
# All tests
bun test tools/

# Specific component
bun test tools/scraper/
bun test tools/parser/
bun test tools/generator/
```

## Development

### Adding New Effect Patterns

Edit `tools/parser/text-parser.ts` and add patterns to the `parseEffect` function:

```typescript
// Example: Adding a new discard pattern
const discardMatch = text.match(/discard (\d+) cards?/i);
if (discardMatch) {
  return {
    type: "DISCARD",
    amount: parseInt(discardMatch[1], 10),
    player: "self",
  };
}
```

### Adding New Keywords

Edit `KEYWORD_PATTERNS` in `text-parser.ts`:

```typescript
const KEYWORD_PATTERNS: Record<string, KeywordAbility["keyword"]> = {
  // Existing patterns...
  "<New Keyword>": "New-Keyword",
};
```

## Known Limitations

1. **Complex Abilities**: Very complex card interactions may not parse perfectly and require manual refinement
2. **Edge Cases**: Unusual wording may not match patterns
3. **English Only**: Currently only supports English card text
4. **Rate Limiting**: Add delays between requests to avoid server issues

## Future Improvements

- [ ] Add retry logic for failed scrapes
- [ ] Improve pattern matching with machine learning
- [ ] Support for multiple languages
- [ ] Automatic image downloading
- [ ] Validation against game rules
- [ ] Interactive card builder UI

