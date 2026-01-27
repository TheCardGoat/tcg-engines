# Scraped Card Data

This directory contains raw scraped card data in JSON format.

## Structure

Each file is named after the set code (e.g., `st01.json`, `gd01.json`).

## Format

Each JSON file contains an array of `ScrapedCardData` objects:

```json
[
  {
    "cardNumber": "ST01-001",
    "name": "Gundam",
    "cardType": "UNIT",
    "rarity": "R",
    "level": "5",
    "cost": "3",
    "color": "red",
    "ap": "8",
    "hp": "5",
    "zone": "Space, Earth",
    "trait": "Gundam (Mobile Suit)",
    "link": "[Amuro Ray]",
    "effectText": "【Deploy】 Draw 1 card.",
    "sourceTitle": "Mobile Suit Gundam",
    "imageUrl": "https://www.gundam-gcg.com/en/cardlist/images/ST01-001.png"
  }
]
```

## Usage

This intermediate JSON format allows you to:
1. **Separate scraping from generation** - Scrape once, regenerate many times
2. **Version control** - Track changes to scraped data over time
3. **Manual editing** - Fix scraping errors before generating TypeScript files
4. **Testing** - Use as fixtures for testing parsers and generators

## Workflow

1. Scrape data: `bun run scripts/scrape-to-json.ts ST01`
2. Generate cards: `bun run scripts/generate-from-json.ts ST01`
