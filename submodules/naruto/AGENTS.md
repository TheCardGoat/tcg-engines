# Naruto Preview

- `packages/cards`: provisional card snapshot and provenance.
- `packages/engine`: pure, deterministic Preview engine.
- `tools/scraper`: opt-in community-source ingestion.

## Evidence and scope

No Naruto rules skill is installed. Preserve the provisional identity in
`NARUTO_PREVIEW_RULES_PROFILE`; do not present this as an official rules engine.
Keep unconfirmed rules in `PROVISIONAL_RULES`, including the separate Leader
plus 50-card deck model. A published 51-card count does not confirm composition.

`packages/cards/card-source-manifest.json` records provenance. The community
snapshot is unofficial; preserve recorded conflicts, inferences, and overrides.
Scraping uses permitted public pages, respects `robots.txt`, and excludes
blocked `/api/` routes and card-image downloads.

Printed text is evidence, not generated executable behavior. Keep
`EFFECT_COVERAGE` entries for all cards with skills or Support text; mark
unconfirmed behavior `partial` or `unsupported`.

## Engine invariants

- No UI, I/O, or networking; the only runtime dependency is the cards package.
- `applyAction` is immutable; rejected actions return the same state reference.
- Randomness uses `state.seed` and `rng.ts`.
- Mandatory draws use `drawCards` in `state-ops.ts` to preserve deck-out loss.
- `queries.ts` is pure; changes to state belong in state operations, effects,
  or the reducer. Log and choice keys serve the UI message catalog.

For engine determinism, use `packages/engine/test/simulation.test.ts`.
For card-source changes, use the cards package's `verify-provenance` script.
Live scraping is a separate, opt-in data refresh.
