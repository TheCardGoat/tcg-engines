# Gundam Atelier Deck Art

**Status**: completed
**Owner**: Codex
**Started**: 2026-07-11
**Completed**: 2026-07-11

## Goal

Connect the Gundam deck builder to the shared Atelier so players can choose and
persist artwork for cards in both the Main Deck and Resource Deck. Parallel
printings must respect viewer ownership and link directly to acquisition.

## Scope

- In scope: Gundam deck art save/edit contracts, canonical printing identity,
  Atelier holdings in the builder loader, owned and locked artwork states,
  Resource artwork selection, local draft compatibility, and the Gundam
  matchmaking Atelier slot.
- Out of scope: changing Atelier pricing, granting holdings, changing card
  rules, or introducing a new persistence table.

## Approach

- Persist `artSelectionsJson` as canonical Gundam card id to printing id. Keep
  gameplay identity canonical while retaining the selected printing on the
  immutable deck version.
- Reuse the existing Gundam `AltArtGameAdapter`, where parallel-finish
  printings are ownable art and standard printings remain freely selectable.
- Fetch viewer holdings once in the server loader. The builder derives lock
  state from printing finish plus the owned art ids and degrades gracefully
  when ownership is unavailable.
- Use one compact thumbnail selector for Main Deck and Resource entries. Locked
  thumbnails link to the exact canonical card and printing in the Atelier.

## Verification

- General API Gundam save and catalog suites: 20 passing tests.
- Web API, ownership, and artwork gallery suites: 17 passing tests; game
  registry and capability guards: 12 passing tests.
- General API and web changed-file checks completed without warnings or lint
  errors. `git diff --check` passed.
- Production web build passed with an 8 GB Node heap.
- In-app browser proof covered Main and Resource parallel selection, local
  draft restoration, desktop and 390 px layouts without horizontal overflow,
  exact Atelier deep links, the standalone Gundam Atelier route, and empty
  browser error logs.

## Open questions

- None. Gundam artwork remains cosmetic; the engine card number does not
  change when a printing is selected.

## Decision log

- 2026-07-11 - Reused `deck_versions.art_selections_json` and the registered
  Gundam Atelier adapter. A separate artwork persistence path would duplicate
  the shared canonical-to-printing contract.
- 2026-07-11 - Kept acquisition outside the builder. Locked artwork previews
  link to the shared Atelier with canonical and printing ids.
