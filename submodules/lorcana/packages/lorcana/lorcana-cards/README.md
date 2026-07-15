# @tcg/lorcana-cards

Card definitions and data pipeline for Disney Lorcana.

## Scripts

### Full pipeline

```sh
bun run generate:all
```

Runs the complete pipeline in order: fetch API data, generate cards, build aux maps, generate localization files, embed i18n, and format. Use this when importing new cards or after a set release.

**Flags** (pass after `--`):

| Flag | Effect |
|------|--------|
| `--skip-fetch` | Use cached API inputs from `data/inputs/` instead of fetching |
| `--skip-aux` | Skip aux KV map generation |
| `--skip-localization` | Skip localization + i18n embedding |
| `--skip-i18n` | Skip only i18n embedding |
| `--skip-format` | Skip formatting |

```sh
bun run generate:all -- --skip-fetch
```

### Individual steps

| Script | Command | Description |
|--------|---------|-------------|
| Fetch inputs | `bun run fetch` | Fetch latest card data from Ravensburger and Lorcast APIs |
| Generate cards | `bun run generate` | Build canonical cards, printings, and write TS files from cached inputs |
| Generate aux | (run via `generate:all`) | Build aux KV maps and validation report |
| Generate localization | `bun run generate-localization` | Build per-locale localization JSON files |
| Embed i18n | `bun run embed-card-i18n` | Embed locale metadata into canonical cards and TS files |
| Update translations | `bun run update-translations` | Fetch latest API data and regenerate localization files |
| Smoke test | `bun run smoke-test:abilities` | Validate ability parsing across all cards |

### Other commands

```sh
bun run test              # Run tests
bun run check-types       # Typecheck
bun run format            # Format with oxfmt
bun run lint              # Lint with oxlint
```

## Pipeline overview

```
fetch-inputs → generate-cards → generate-card-aux → generate-localization → embed-card-i18n → format
```

- **Inputs**: Fetched from Ravensburger and Lorcast APIs into `data/inputs/`
- **Outputs**: Card TS files in `src/cards/`, JSON data in `src/data/`

See `scripts/README-generate-cards-all.md` for detailed pipeline documentation.
