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
  console.log("Card scraped successfully:", card);
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

### Other Information
- Effect Text (parsed but not converted to abilities yet)
- Source Title
- Product Information
- Card Image URL

## Output Format

The scraper converts the scraped data into a `GundamitoCard` object that matches the engine's type definitions:

```typescript
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
```

## Limitations

- **Abilities**: The scraper extracts effect text but doesn't parse it into structured abilities yet. The `abilities` array is left empty for manual implementation.
- **Error Handling**: Network errors or parsing failures are logged but may not be comprehensive.
- **Rate Limiting**: No built-in rate limiting - be respectful when scraping multiple cards.

## Future Enhancements

- [ ] Parse effect text into structured abilities
- [ ] Batch scraping for multiple cards
- [ ] Cache scraped data to avoid re-scraping
- [ ] Integration with card definition files
- [ ] Validation against existing card definitions
- [ ] Support for non-English versions