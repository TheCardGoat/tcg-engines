# Flesh and Blood preconstructed decks

`src/data/preconstructed-decks.json` is a normalized snapshot of the public
Fabrary preconstructed-deck index and its structured deck responses. The
snapshot was retrieved on 2026-09-02 and contains 90 decks across Armory,
Blitz, Silver Age, First Strike, Round the Table, hero/demo, and other official
preconstructed releases.

## Provenance and verification

- Fabrary index: <https://content.fabrary.net/info/recent-decks-precons.json>
- Fabrary deck pages: <https://fabrary.net/decks/{deckId}>
- Official LSS decklists: <https://fabtcg.com/decklists/>

Every deck was tied to official Legend Story Studios decklist, product,
collector, format, or downloadable material. Verification is stored beside the
deck as one of:

- `official-list-match`: 46 Fabrary lists match an unambiguous same-format LSS
  list by card name, pitch, and quantity.
- `official-list-discrepancy`: 10 same-format published lists differ. The exact
  differences are recorded in `officialVerification.notes` and must not be
  silently resolved in favor of either source.
- `official-product-verified`: 34 decks are confirmed by official product or
  format material, but LSS does not expose an unambiguous comparable list.

Hero identity and derived token cards were excluded from list comparisons.
Fabrary inventory quantities were included. A discrepancy shows that the two
published lists differ; it does not prove which source represents every
physical product revision or optional inventory choice.

## Runtime contract

Import `@tcg/flesh-and-blood-cards/preconstructed-decks` for validated typed
records, read-only snapshot metadata, the deck-ID index, or deterministic
lookup. The module rejects malformed formats, pitches, quantities, URLs,
timestamps, verification states, and duplicate deck IDs while loading.

The committed JSON is the reviewable snapshot. Browser responses and search
result caches are intentionally excluded from the repository.
