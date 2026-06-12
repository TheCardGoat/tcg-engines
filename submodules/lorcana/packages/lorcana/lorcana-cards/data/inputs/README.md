# Input Files

This directory contains input data fetched from external APIs. These files are gitignored and must be fetched before running the generate script.

## Data Sources

- **Ravensburger API**: `https://api.lorcana.ravensburger.com/v3/catalog/en`
  - Primary source for stats, images, variants

- **Lorcast API**: `https://api.lorcast.com/v0/sets`
  - Source for card text with symbols ({S}, {I}, {D})

## Usage

### Fetch inputs and generate all data files:

```bash
bun generate:all
```

### Or run separately:

```bash
# Fetch from APIs
bun fetch

# Generate data files from inputs
bun generate
```

## Workflow

### When card data updates (new set release, etc.):

1. Run `bun generate:all` to fetch APIs and regenerate all files
2. Runtime card identity comes from generated TypeScript package cards in `src/cards/`
3. Auxiliary files (`cards.aux.*.json`, `sets.json`) are gitignored

### For developers cloning the repo:

1. Clone repo (gets generated TypeScript package cards in `src/cards/`)
2. Run `bun generate:all` to fetch inputs and generate auxiliary files
3. Now have complete data for development

## Output Files (in `src/data/`)

After running the generation pipeline, the following files are produced:

- **`canonical-cards.json`**: Optional ignored intermediate output for generation/debugging.
  Runtime builds do not import this file; `@tcg/lorcana-cards/data` derives canonical card
  records from generated TypeScript package cards.
- **`sets.json`**: Set metadata (gitignored, regenerated)
- **`cards.aux.printing-metadata.json`**: Minimal printing metadata without image variants (replaces `printings.json`)
- **`cards.aux.kv.json`**: Auxiliary key-value lookups:
  - `canonicalIdByShortId`: shortId → canonicalId
  - `representativeShortIdByCanonicalId`: canonicalId → representative shortId
  - `printingIdToShortId`: printingId → shortId
  - `printingIdsByCanonicalId`: canonicalId → all printing IDs
  - `baseReprintIdsByCanonicalId`: canonicalId → base reprint IDs (excludes special rarities)
  - `localizationShortIdByCultureInvariantId`: culture_invariant_id → shortId for localization
- **`cards.aux.validation-report.json`**: Validation results for IDs, canonicalIds, reprints, and localization

**Note:** `printings.json` is no longer generated. Use `cards.aux.printing-metadata.json` + `cards.aux.kv.json` instead.
