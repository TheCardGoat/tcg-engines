# Naruto community card scraper

This opt-in tool reads two public, unofficial card catalogs:

- `https://narutocardgamesimulator.com/en/collection`
- `https://exburst.dev/naruto/cardlist`

It extracts the first site's serialized card map, renders ExBurst's public list
and card-detail pages in a rate-limited headless browser, and writes one
cross-source snapshot. It never calls either site's disallowed `/api/` routes,
never downloads card images, and does not infer executable rules from printed
text.

## Refresh

```sh
cd submodules/naruto
pnpm install --frozen-lockfile
pnpm exec playwright install chromium # first run only
pnpm run scrape:cards -- --out packages/cards/community-card-source-snapshot.json
pnpm --filter @tcg-engines/naruto-cards run verify-provenance
```

Review `reconciliation.conflicts`, every inferred identity, and any source-only
cards before committing a refresh. The live command is intentionally excluded
from CI; parser behavior is covered by checked-in HTML and bundle fixtures.
