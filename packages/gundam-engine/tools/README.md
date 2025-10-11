# Gundam Card Tools

This directory contains tools for scraping, parsing, and generating Gundam Card Game card definitions.

## Overview

The tooling pipeline is split into two phases:

### Phase 1: Scrape to JSON
1. **Scraper** - Fetches card data from the official Gundam Card Game website
2. **Storage** - Saves raw scraped data to JSON files

### Phase 2: JSON to TypeScript
1. **Parser** - Converts card text into structured ability format
2. **Generator** - Creates TypeScript card definition files

This separation allows you to:
- Scrape once, regenerate many times
- Manually fix scraped data before generation
- Version control raw card data
- Test parsers and generators independently

## Directory Structure

```
tools/
├── scraper/
│   ├── card-scraper.ts         # HTML scraping logic
│   └── __tests__/              # Scraper tests
├── storage/
│   └── json-storage.ts         # JSON data storage/loading
├── parser/
│   ├── text-parser.ts          # Text parsing logic
│   └── __tests__/              # Parser tests
├── generator/
│   ├── card-generator.ts       # Card definition generation
│   ├── file-writer.ts          # File I/O operations
│   └── __tests__/              # Generator tests
├── data/
│   └── scraped/                # JSON files with scraped data
│       ├── st01.json           # Set ST01 scraped data
│       ├── gd01.json           # Set GD01 scraped data
│       └── ...
└── scripts/
    ├── scrape-to-json.ts       # Scrape → JSON
    ├── generate-from-json.ts   # JSON → TypeScript
    └── regenerate-all-from-json.ts # Regenerate all sets
```

## Usage

### Two-Phase Workflow (Recommended)

#### Phase 1: Scrape to JSON

**Scrape a single card:**
```bash
bun run scripts/scrape-to-json.ts ST01-001
```

**Scrape an entire set:**
```bash
bun run scripts/scrape-to-json.ts ST01
```

This will:
1. Fetch card data from https://www.gundam-gcg.com
2. Save raw scraped data to `tools/data/scraped/{setcode}.json`

#### Phase 2: Generate TypeScript from JSON

**Generate cards for one set:**
```bash
bun run scripts/generate-from-json.ts ST01
```

**Regenerate all sets at once:**
```bash
bun run scripts/regenerate-all-from-json.ts
```

This will:
1. Load scraped data from JSON files
2. Parse card text into structured abilities
3. Generate TypeScript files at `src/cards/sets/{setcode}/`
4. Create set index files

### Legacy Workflow (One-Step)

The original scripts still work for convenience:

```bash
# Single card (scrape + generate in one step)
bun run scripts/scrape-card.ts ST01-001

# Entire set (scrape + generate in one step)
bun run scripts/scrape-set.ts ST01
```

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

### Storage

The storage module handles saving and loading scraped data to/from JSON files:

**Features:**
- Save scraped data to JSON with nice formatting
- Load scraped data from JSON
- Update or append individual cards
- Get all available set codes
- Load all scraped data at once

**Key Functions:**
- `saveScrapedDataToJson(cards, setCode)` - Save full set to JSON
- `saveScrapedCardToJson(card, setCode)` - Save/update single card
- `loadScrapedDataFromJson(setCode)` - Load set from JSON
- `getAvailableSetCodes()` - Get all available sets
- `loadAllScrapedData()` - Load all sets

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

## Benefits of Two-Phase Workflow

✅ **Separation of concerns** - Scraping decoupled from generation
✅ **Iterate on parsing** - Regenerate cards without re-scraping
✅ **Version control** - JSON data can be committed and tracked
✅ **Testing** - Easier to test with fixture data
✅ **Manual editing** - Can manually fix scraped data before generation
✅ **Faster iterations** - Improve parser/generator without network requests

## Future Improvements

- [ ] Add retry logic for failed scrapes
- [ ] Improve pattern matching with machine learning
- [ ] Support for multiple languages
- [ ] Automatic image downloading
- [ ] Validation against game rules
- [ ] Interactive card builder UI
- [x] Separate scraping from generation (JSON intermediate step)

