# Naruto workspace

## Ownership

```
submodules/naruto/
  packages/
    cards/   @tcg-engines/naruto-cards  — typed provisional card snapshot
    engine/  @tcg-engines/naruto-engine — pure, deterministic Preview engine
  tools/
    scraper/ @tcg-engines/naruto-scraper — opt-in community-source ingestion
```

Keep game-native cards, rules, effects, deck validation, and engine tests in
this workspace. Shared adapters and UI belong in `agnostic-simulator`; platform
routing and services belong in `platform`.

## Rules and data status

- There is no Naruto rules skill installed. Do not infer missing rules or call
  this an official rules implementation.
- `NARUTO_PREVIEW_RULES_PROFILE` is the runtime identity. Its `status` is
  always `provisional`; snapshots must retain it.
- `CONFIRMED_STRUCTURAL_RULES` is limited to facts reviewed against Bandai's
  current welcome page. The page states a 51-card deck but does not define its
  composition or say that it includes the Leader. The engine's separate Leader
  plus 50-card `DeckList.cardIds` model therefore lives in `PROVISIONAL_RULES`,
  alongside every other unconfirmed timing, combat, draw, deck-construction,
  and board decision.
- `packages/cards/card-source-manifest.json` is the source-of-record for data
  provenance. `community-card-source-snapshot.json` reproducibly cross-checks
  the public Naruto Card Game Simulator and ExBurst catalogs, but both are
  unofficial community sources. Preserve every recorded conflict, inference,
  and reviewed runtime override. Do not claim completeness or authoritative
  text until a primary-source importer exists.
- Live scraping is opt-in and owned by `tools/scraper`. Use only the public
  catalog/detail pages, honor `robots.txt`, never request either site's
  disallowed `/api/` routes, and never download or commit card images.
- Printed metadata is evidence only. Never generate engine effects, legal
  actions, prompts, or other executable behavior from scraped text.
- `EFFECT_COVERAGE` must have one entry for every card with skills or Support
  text. Mark unconfirmed semantics `partial` or `unsupported`; never let a
  regex fall-through silently look complete.

## Engine boundaries

- The engine is a pure logic library: no UI, I/O, networking, or runtime
  dependencies other than `@tcg-engines/naruto-cards`.
- Keep TypeScript strict; use discriminated unions and exhaustive switches.
- `applyAction` is immutable: rejected actions return the same state reference.
- Randomness flows only through `state.seed` and `rng.ts`.
- Mandatory draws must go through `drawCards` in `state-ops.ts` so deck-out
  loss cannot be bypassed by an effect.
- `queries.ts` stays pure; mutation belongs in `state-ops.ts`, `effects.ts`,
  or `reducer.ts`.
- Stable log and choice keys are the UI message catalog.

## Validation

```sh
cd submodules/naruto
pnpm install --frozen-lockfile
pnpm run ci-check        # typecheck, provenance verification, unit tests
pnpm run ci-check-full   # ci-check plus builds
pnpm --filter @tcg-engines/naruto-cards run verify-provenance
pnpm run scrape:cards -- --out packages/cards/community-card-source-snapshot.json # opt-in live refresh
```

Run `packages/engine/test/simulation.test.ts` after engine changes: it drives
20 seeded AI-vs-AI Preview games and asserts determinism.
