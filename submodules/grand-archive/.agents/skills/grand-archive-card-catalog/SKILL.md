---
name: grand-archive-card-catalog
description: Import, validate, and query Grand Archive card metadata from the official Index API. Use for card catalog updates, printings, official card text, images, set data, and source-provenance questions; not for gameplay interpretation.
---

# Grand Archive Card Catalog

The source of record is the official [Index API](https://api.gatcg.com/openapi.json). Fetch raw snapshots with `pnpm run scrape`; normalize a selected snapshot with `pnpm run generate -- --input <path>`. The scraper retains source URL, retrieval time, and SHA-256, while the generated catalog contains only typed metadata.

Treat unfamiliar official vocabulary as a type-model gap: add it to the game-native vocabulary deliberately, with a sample from the API. Do not widen closed types to `string` or interpret rules text into engine behavior during ingestion.

Card and edition UUIDs are distinct. Preserve the card UUID as canonical identity, retain every edition as a printing, and use `https://api.gatcg.com` as the base for relative edition image paths.
