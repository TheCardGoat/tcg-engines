# Gundam Card Scraper

This directory contains tools for scraping card information from the official Gundam Card Game website and converting it to `GundamitoCard` objects for use in the engine.

## Files

- `gundam-card-scraper.ts` - Core scraping and conversion logic
- `scrape-card.ts` - Command-line interface for scraping single cards
- `test-scraper.ts` - Test script for development
- `README.md` - This documentation file

## Usage

### Scraping a Single Card

Use the command-line script to scrape any card by its card number:

```bash
# From the core-engine directory
bun run src/game-engine/engines/gundam/src/card-converter/scrape-card.ts ST01-006

# Or if made executable
./src/game-engine/engines/gundam/src/card-converter/scrape-card.ts ST01-006
```

### Examples

```bash
# Scrape Gundam Aerial (Permet Score Six)
bun run src/game-engine/engines/gundam/src/card-converter/scrape-card.ts ST01-006

# Scrape Gundam (RX-78-2)
bun run src/game-engine/engines/gundam/src/card-converter/scrape-card.ts ST01-001

# Scrape any other card
bun run src/game-engine/engines/gundam/src/card-converter/scrape-card.ts GD01-001
```

### Programmatic Usage

You can also use the scraper programmatically:

```typescript
import { scrapeAndCreateGundamitoCard } from "./gundam-card-scraper";

const card = await scrapeAndCreateGundamitoCard("ST01-006");
if (card) {
  logger.log("Card scraped successfully:", card);
}
```

## What Gets Scraped

The scraper extracts the following information from each card:

### Basic Information
- Card Number (e.g., ST01-006)
- Card Name
- Rarity (C, U, R, SR, LR)
- Cost
- Level
- Color (Blue, White, Green, Red)
- Type (Unit, Pilot, Command, Base, Resource)

### Unit-Specific Information
- Attack Points (AP)
- Health Points (HP)
- Deployment Zones (Space, Earth)
- Traits
- Link Requirements

### Pilot-Specific Information
- AP Modifier
- HP Modifier
- Traits

### Command-Specific Information
- Effect Text
- Pilot Properties (for command cards that can function as pilots):
  - Pilot Name (extracted from 【Pilot】[Name] pattern)
  - AP Modifier
  - HP Modifier
  - Traits

### Other Information
- Source Title
- Product Information
- Card Image URL

## Output Format

The scraper converts the scraped data into a `GundamitoCard` object that matches the engine's type definitions:

```typescript
// Unit card example
{
  "id": "ST01-006",
  "implemented": false,
  "missingTestCase": true,
  "cost": 4,
  "level": 5,
  "number": 6,
  "name": "Gundam Aerial (Permet Score Six)",
  "color": "white",
  "set": "ST01",
  "rarity": "legendary",
  "type": "unit",
  "zones": ["space", "earth"],
  "traits": ["academy"],
  "linkRequirement": ["suletta mercury"],
  "ap": 4,
  "hp": 4,
  "abilities": []
}

// Command card with pilot properties example
{
  "id": "GD01-101",
  "implemented": false,
  "missingTestCase": true,
  "cost": 1,
  "level": 2,
  "number": 101,
  "name": "Deep Devotion",
  "color": "blue",
  "set": "GD01",
  "rarity": "rare",
  "type": "command",
  "subType": "pilot",
  "pilotName": "Lucrezia Noin",
  "traits": ["oz"],
  "apModifier": 1,
  "hpModifier": 0,
  "text": "【Main】/【Action】Choose 1 friendly Link Unit. It recovers 3 HP.\n【Pilot】[Lucrezia Noin]",
  "abilities": []
}
```

## Limitations

- **Abilities**: The scraper extracts effect text but doesn't parse it into structured abilities yet. The `abilities` array is left empty for manual implementation.
- **Error Handling**: Network errors or parsing failures are logged but may not be comprehensive.
- **Rate Limiting**: No built-in rate limiting - be respectful when scraping multiple cards.

## Trait Discovery & Management

The scraper includes comprehensive trait discovery to help identify and manage new traits:

### Automatic Discovery Features

1. **Individual Card Warnings**: Unknown traits are logged when scraping single cards
2. **Set-Level Summary**: All discovered traits are listed when scraping entire sets  
3. **Usage Analysis**: The `analyzeTraitUsage()` function provides detailed trait statistics

### Unknown Trait Handling

When the scraper encounters unknown traits, it:
- ✅ **Logs warnings** with clear instructions for resolution
- ✅ **Continues processing** without crashing (graceful degradation)
- ✅ **Tracks all discovered traits** for batch analysis
- ❌ **Does not add unknown traits** to card definitions (type safety)

### Adding New Traits

To add support for new traits:

1. **Update Type Definition** (`shared-types.ts`):
   ```typescript
   export type Traits =
     | "existing traits..."
     | "new-trait-name";
   ```

2. **Update Trait Mappings** (`gundam-card-scraper.ts`):
   ```typescript
   const traitMappings: Record<string, Traits> = {
     // existing mappings...
     "new-pattern": "new-trait-name",
   };
   ```

### Examples

**Unknown Trait Warning:**
```
🔍 Unknown traits found in "(PLANT, Coordinator)": [plant, coordinator]
   Consider adding these to the Traits type and traitMappings
```

**Set Discovery Summary:**
```
🔍 Traits discovered in GD01: [academy, civilian, oz, zeon]
```

**Usage Analysis:**
```
📊 Trait Usage Analysis
========================================
• oz: 12 cards
• academy: 8 cards  
• zeon: 3 cards
  Examples: GD01-045 (Zaku II), GD01-067 (Gouf), GD01-089 (Gelgoog)
```

## Future Enhancements

- [ ] Parse effect text into structured abilities
- [ ] Batch scraping for multiple cards
- [ ] Cache scraped data to avoid re-scraping
- [ ] Integration with card definition files
- [ ] Validation against existing card definitions
- [ ] Support for non-English versions