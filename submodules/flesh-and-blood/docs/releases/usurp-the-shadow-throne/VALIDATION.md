# Preview validation

This branch is a development preview. Final reveal reconciliation, human QA of every card, and approved final artwork remain release gates.

## Card Vault completeness (2026-09-11)

Completeness against live Card Vault is **fail**.

The product page at `https://cardvault.fabtcg.com/products/usurp-the-shadow-throne/` is a JS app (the HTML route 404s). The inventory it loads is `https://api.cardvault.fabtcg.com/carddb/api/v1/product-cards/usurp-the-shadow-throne/`: **260** unique name+pitch identities and **260** IAR collector numbers. `advanced-search?set_code=IAR` returns **263** (the LSS set size). The extra three collectors are IAR158, IAR159, and IAR222 (Runechant token, Baalghor, Gate to i'Arathael), which are not on the product page.

The generated catalog (`flesh-and-blood-card-data.json` + `flesh-and-blood-printings.json`) has **258** unique IAR name+pitch identities and **258** collector numbers. Provenance: FAB Cube ref `usurp-the-shadow-throne`, commit `9fb8c73011311720bc7add61fb8eaab00b131bc3`, set display name still `??? Set 20 ???`, `productionEligible: false`. A live FAB Cube scrape of that same ref returns the same 258 IAR cards; ingest is not behind Cube.

Missing from the catalog versus the 260-card product inventory:

| Collector | Name                  | Pitch |
| --------- | --------------------- | ----- |
| IAR050    | Rise to the Challenge | 1     |
| IAR051    | Rise to the Challenge | 2     |
| IAR052    | Rise to the Challenge | 3     |
| IAR224    | Dark Arcanite Helm    | —     |
| IAR225    | Dark Arcanite Plating | —     |
| IAR226    | Dark Arcanite Gloves  | —     |

Those six cards are also absent from the current FAB Cube snapshot. Catalog-only IAR collectors (not on the product page): IAR158, IAR159, IAR222, IAR666.

Among the 254 overlapping identities, printed-field mismatches remain: reminder/markdown functional text on most cards (Card Vault prints keyword reminders; the catalog stores FAB Cube plain text), plus stat/type/rarity disagreements including Cleave the Heavens / Step through Realms defense 2 vs 3, Permanent Interment power 2 vs 1, Bone Barrier type text Defense vs Defence, Embrace Sin rarity rare vs super, Sonata Dystopia cost X vs blank, and ally health stored as catalog `health` while Card Vault prints it as defense.

The oracle snapshot is `cardvault-iar-official.json`. The shipped checker is `packages/cards/src/iar-cardvault-completeness.ts`.

## Source and scope

- FAB Cube set ref: `usurp-the-shadow-throne`, commit `1e693bf3b333bbc24835ba65d67e026fd50fd59a`.
- Inventory: 114 variants, 88 names. Added 34 variants across 22 authored families; removed none.
- All 114 authored English texts match the upstream plain text after whitespace normalization.
- Comparing the pinned snapshot against itself with `compare-source.mjs` reports zero changes.
- Existing gameplay-stat change: Hex Gauntlet now has printed power 6, verified against the official IAR004 image. Restless Cleric also has updated upstream legality metadata.
- Asset ingest 2026-09-11: official LSS `/media/cards/large/` files for Cube `9fb8c73011311720bc7add61fb8eaab00b131bc3` were staged into the assets manifest (IAR missing printings plus low-res 450px upgrades). Catalog and presentation records were regenerated from that manifest. CDN publication still requires the assets repository PR.

## Automated proof

- FAB `vp run ci-check`: passed. 9,829 card tests; 4,036 engine tests passed, with 4 existing expected failures and 1 existing skipped test. Types, canonical authoring, catalog synchronization, release-audit consistency and card-test quality gates passed.
- FAB `vp run build`: passed for types, cards, engine, catalog and scraper.
- Preview fixture suite: 115 passed (114 deterministic card fixtures plus the localized Forsaken Strike interaction regression).
- Focused card-art and icon tests: 37 passed.
- Root `pnpm run ci:agnostic:check`: passed, including formatting, lint, package type gates and the complete simulator/package test run.
- Multi-game simulator production build: passed after installing the linked workspace dependencies and building distribution-only dependencies.
- A separate `tsc --noEmit` for the whole simulator app reports type mismatches in 38 unchanged files (including old FAB partial-card fixtures, Gundam deck schema fixtures, and other game tests). There are no diagnostics in the preview files. This extra check is not included in the app package's current CI script; it remains a repository integration cleanup requirement before claiming every possible typecheck is green.

## Browser proof

Verified in the in-app browser at `http://127.0.0.1:5190`:

- Forsaken Strike: select one controlled zombie to destroy, select one zombie in hand to discard, choose the labeled Gate and +2 power rewards. The board shows both zombies in the graveyard, a Gate created, attack power 5, and opponent life 15 after the hit.
- Deadly Spinneret: its activated discard ability equips a Graphene Chelicera in each empty weapon zone. Both weapons render with preserved image proportions.
- Unapproved new artwork stays unavailable; localized names, stats and card text remain inspectable for QA.

Human QA is intentionally not marked complete by these automated checks. Use the per-variant checklist in README.md.
