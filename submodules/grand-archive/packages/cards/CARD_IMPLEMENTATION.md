# Grand Archive Card Implementation Flow

This package treats each generated card definition as an executable specification. Structural
compiler coverage and behavior coverage are separate: a parsed ability is not proven until a
sibling acceptance test drives it through the production runtime, or an eligible standalone
keyword is backed by an explicit engine-owned behavior contract.

## Deterministic workflow

1. Select a card or behavior cluster from `pnpm run coverage:cards`.
2. Read the card definition and the minimum relevant official rules pages through the
   Grand Archive rules skill. Record the heading and numbered rules in the handoff.
3. Create `<card>.test.ts` beside the definition and arrange the smallest legal fixture with
   `GrandArchiveTestEngine.startFixture`. Use a fixed seed (the default is `1`) and public player
   actions (`activate`, `materialize`, `activateAbility`, `declareAttack`, `pass`).
   For starting-champion abilities, set `pregame: "resolve"`; this executes the production
   pre-game action sequence and resolves both champions' `On Enter` triggers before Opportunity.
   Cards listed in `main-deck` provide deterministic starting draws.
   Use `lineage` to arrange the active champion face in ascending level order. For combat outcomes
   that do not depend on retaliation choices, `resolveCombatWithoutRetaliation()` passes each
   production Opportunity window, declines retaliation, deals damage, and completes cleanup.
4. Prove the printed happy path, one legality or outcome boundary, and material timing when the
   text depends on Opportunity, the Effects Stack, combat, or a duration.
5. Add `@covers <abilityId>` only after the test proves that complete ability. Ability-less cards
   use `@covers-card <canonicalId>`. A sibling test file alone never changes coverage.
   When a selected cluster has an identical executable contract, extract that contract under
   `src/testing` and keep one small sibling suite per card. The sibling must still pass its exact
   definition and expected restriction characteristic into the shared contract; never infer
   coverage from membership in the cluster alone.
   Before writing duplicate keyword tests, check `scripts/card-coverage/central-keywords.ts`.
   Unconditional, parameter-free intrinsic keyword paragraphs with registered engine evidence
   are `centrally-covered` and need no sibling test. These rows retain the exact engine test
   path and title; the coverage check rejects missing or disabled evidence. Existing direct
   acceptance proof keeps precedence. Do not exempt restrictions, custom functional zones,
   parameterized keywords, grouped keywords, or effects that merely grant/use a keyword.
   Extend the explicit central contract and its guard tests when additional shapes are audited;
   never infer coverage from a keyword name or the engine ownership table alone.
6. If the public path is blocked, add or update a family in
   `scripts/card-coverage/gaps.json`. Fix shared rules in the owning engine path; do not add a
   card-local runtime workaround.
7. Run the focused sibling test, `pnpm run coverage:cards:write`, package typecheck, and the
   Grand Archive workspace gate.

## AAA acceptance contract

Coverage report version 2 distinguishes `provenAbilities` (card acceptance evidence) from
`centrallyCoveredAbilities` (shared engine evidence). `coveredAbilities` is their sum;
`untestedAbilities` excludes both. `cardSpecificAbilities` excludes centrally covered rows.
All printed paragraphs remain in the inventory, so this is evidence reuse, not deleting scope.
A card is complete only when every paragraph is `proven` or `centrally-covered` (or its
ability-less representation has passing `@covers-card` evidence). `out-of-scope` and `blocked`
are not completion. Keyword-accounting changes must not be reported as newly implemented cards.

- Arrange: legal players, zones, phase, enabled elements, costs, targets, and deterministic deck.
- Act: production-enumerated commands or typed player intents; no direct private procedure calls.
- Assert: the printed rules-visible result plus a meaningful boundary. State inspection is for
  outcomes, not for bypassing the public action path.

The pilot suites cite these official rules in their handoff:

- Playing Cards, rules 1–9; Card Activation, rules 1.1–1.9.
- Resolution, rules 1–11.
- Champion rules 1–4; Action rules 1–5; Ally rules 1–6; Item rules 1–4;
  Weapon rules 1–7; Attack rules 1–8.
- Attack Declaration, rules 1–5 and Declaring an Attack rules 1–2.

## Gap family schema

Each family has a stable `family`, one of `engine-primitive`, `definition`, `harness`, or
`out-of-scope`, a concrete `primitive` owner when known, status, reproducible public failure, and
members containing exact canonical and ability IDs. `coverage:cards:next` chooses the densest
open family and groups rows that share a member or a concrete engine owner.

Resolve a family only after its affected abilities have passing public acceptance tests. Keep the
historical family row and record the resolving evidence instead of deleting it.
