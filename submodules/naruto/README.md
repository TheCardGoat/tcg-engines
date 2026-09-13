# @tcg-engines/naruto

TypeScript workspace for a deterministic **Preview** engine and a provisional
card-data snapshot for Bandai's unreleased Naruto Card Game.

> The game is under development. This is not an official rules implementation.
> `NARUTO_PREVIEW_RULES_PROFILE` records the exact profile and version carried
> by every created game state. Only a small structural subset is confirmed from
> [Bandai's welcome page](https://www.naruto-cardgame.com/en/welcome/). The
> public 51-card statement does not define its composition; `DeckList` models
> it provisionally as one `leaderId` plus a 50-card `cardIds` main deck, five identified Chakra card
> ids, and one identified Summon card id. The 5/1 counts are confirmed
> structure; the Preview side-card ids come from the unverified snapshot.
> Combat,
> timing, effects, mulligan, and other runtime behavior remain provisional.

## Packages

| Package | Name | Purpose |
| --- | --- | --- |
| `packages/cards` | `@tcg-engines/naruto-cards` | Typed provisional card snapshot, accessors, provenance manifest. |
| `packages/engine` | `@tcg-engines/naruto-engine` | Pure Preview engine: state, reducer, effects, combat/chain, and deterministic AI. |
| `tools/scraper` | `@tcg-engines/naruto-scraper` | Opt-in community-catalog scraper, source snapshot, and conflict reconciliation. |

No UI or networking is included; consuming code provides rendering and
transport. The platform must describe this as a Preview until the official
rulebook and a provenance-backed card importer exist.

## Quickstart

```ts
import {
  applyAction,
  chooseAiAction,
  createInitialState,
  deciderOf,
  PREVIEW_DECKS,
  previewDeckList,
} from "@tcg-engines/naruto-engine";

let state = createInitialState({
  seed: 42,
  decks: {
    p1: previewDeckList(PREVIEW_DECKS[0]!),
    p2: previewDeckList(PREVIEW_DECKS[2]!),
  },
});

while (!state.winner) {
  const decider = deciderOf(state);
  if (decider === null) break;
  const action = chooseAiAction(state, decider);
  if (!action) break;
  const next = applyAction(state, action);
  if (next === state) throw new Error("illegal action");
  state = next;
}
```

Key properties:

- **Versioned Preview profile**: `state.rulesProfile` is serializable and
  identifies the provisional rule profile used for a replay or runtime.
- **Deterministic**: seeded RNG plus action history reproduces a game.
- **Immutable reducer**: illegal actions return the same state reference.
- **Explicit choices**: effects queue `pendingChoice`; UI resolves it with
  `RESOLVE_CHOICE`.
- **Auditable effects**: `EFFECT_COVERAGE` accounts for every rules-bearing
  card in this unverified snapshot and keeps incomplete semantics visible. It
  is implemented against that snapshot, not source-complete revealed coverage.

## Card-data provenance

The original PR source did not identify its card dump. The game-owned scraper
now reproduces and cross-checks the public catalogs at
[Naruto Card Game Simulator](https://narutocardgamesimulator.com/en/collection)
and [ExBurst](https://exburst.dev/naruto/cardlist). The checked-in
[community source snapshot](packages/cards/community-card-source-snapshot.json)
retains both payloads, hashes, inferred identity matches, unresolved conflicts,
and two ExBurst-only sample cards. It does not download or ship images and does
not request either site's disallowed `/api/` routes.

[card-source-manifest.json](packages/cards/card-source-manifest.json) records
the reviewed runtime override and verifies that the runtime catalog cannot
drift silently from the source snapshot:

```sh
pnpm --filter @tcg-engines/naruto-cards run verify-provenance
```

Refresh the community snapshot explicitly with:

```sh
pnpm exec playwright install chromium # first run only
pnpm run scrape:cards -- --out packages/cards/community-card-source-snapshot.json
```

Live scraping is intentionally outside CI. Both catalogs are unofficial, so
the importer establishes reproducibility and disagreements—not card-text or
rules authority. Printed text never generates executable engine behavior.

## Checks

```sh
pnpm run ci-check
pnpm run ci-check-full
```
