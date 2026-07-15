# Input Files

This directory contains input data fetched from the Riftcodex API. These files are gitignored and must be fetched before running any generation scripts.

## Data Source

- **Riftcodex API**: `https://api.riftcodex.com/cards`
  - Complete card data including stats, images, text, and metadata

## Usage

### Fetch inputs:
```bash
bun fetch
```

Or run from the repository root:
```bash
bun packages/riftbound-cards/scripts/fetch-inputs.ts
```

## Files

- `riftcodex-input.json` - Raw card data from the Riftcodex API (gitignored)

## Workflow

### When card data updates (new set release, etc.):
1. Run `bun fetch` to download the latest card data
2. Generated files will be created in `src/data/`

### For developers cloning the repo:
1. Clone the repository
2. Run `bun install` to install dependencies
3. Run `bun fetch` to download card data
4. Now you have complete data for development
