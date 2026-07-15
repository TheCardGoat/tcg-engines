# Daily feedback fix session - 2026-05-17

## Scope

This session followed up on `daily-feedback-replay-triage-2026-05-17.md`, which triaged 32 simulator bug reports and 1 feedback item submitted between 2026-05-16 07:02:54 UTC and 2026-05-17 06:24:11 UTC.

User goal:

- Fix all valid issues from the daily feedback replay triage report.
- Explain issues that were not fixable with current evidence.
- Add visual/manual validation fixtures for the remaining report items.
- Publish the work as a PR with this persistent report on disk for team context.

Constraints followed:

- No dev server commands were run.
- No database commands were run.
- Fixes were scoped to replay-confirmed or rules-backed issues.
- Product/server issues and sparse reports were not converted into misleading card-engine fixes.

## Source evidence

Primary triage artifact:

- `packages/lorcana/lorcana-engine/docs/daily-feedback-replay-triage-2026-05-17.md`

Replay inspection output was captured during triage under:

- `/tmp/lorcana-replay-triage-2026-05-17/`

Important replay/evidence limits:

- R1, R2, and R8 replay ids were not found.
- R19 reported `turn: 0`, but replay inspection requires 1-based turns.
- R28 could not be reconstructed by the replay CLI because a saved patch failed to apply.
- Several reports lacked a source card, exact turn, or accepted failed action.

## Fixed issues

### R20 - Hiram Flaversham drew cards without banishing an item

Report:

- Game id: `mg_gfqu96DSSDzYKb17tgQn`
- Turn: 9
- Player report: Flaversham drew 2 cards while there were no items in play.

Finding:

- Replay confirmed `ARTIFICER` resolved with `resolveOptional: true`, no item target, and still drew 2.
- This violated the printed "If you do" structure.

Change:

- Updated both Hiram Flaversham - Toymaker `ARTIFICER` implementations so draw 2 is gated behind an `if-you-do` conditional after an item is actually banished.
- Added coverage for both cases:
  - Accepting with no item does not draw.
  - Banishing an item draws 2.

Touched:

- `packages/lorcana/lorcana-cards/src/cards/002/characters/149-hiram-flaversham-toymaker.ts`
- `packages/lorcana/lorcana-cards/src/cards/002/characters/149-hiram-flaversham-toymaker.test.ts`

### R1 - Black Cauldron did not feed Horned King's discard-exit lore boost

Report:

- Game id: `game-1778914676533-0qtc4xvro`
- Turn: 10
- Player report: Putting a card under The Black Cauldron did not trigger The Horned King's lore boost from a card leaving discard.

Finding:

- Replay was not available, but the interaction was rules-backed and uncovered by existing tests.
- The Black Cauldron moves a character from discard under itself. That should count as a card leaving discard for Horned King's static boost that turn.

Change:

- `put-under` now records a discard-exit turn metric when the source zone is discard and the move succeeds.
- Added an integration test where The Black Cauldron moves a character from discard under itself, then The Horned King quests with the +2 lore boost.

Touched:

- `packages/lorcana/lorcana-engine/src/runtime-moves/resolution/action-effects/put-under-effect.ts`
- `packages/lorcana/lorcana-cards/src/cards/010/characters/049-the-horned-king-triumphant-ghoul.test.ts`

### R23 - The Black Cauldron granted permission but no play-from-under action appeared

Report:

- Game id: `mg_65tnvUVK6_K2hayvY0_S`
- Turn: 15
- Player report: Could not play characters from under The Black Cauldron.

Finding:

- Replay showed `RISE AND JOIN ME!` adding `playFromUnderPermissions`.
- The player passed with the character still under Cauldron; permission expired at turn start.
- Available-move analysis only looked for ordinary hand plays before analyzing play-card actions, so play-from-under could be skipped.
- Under-card lookup also needed to read runtime card metadata for `cardsUnder`.

Change:

- Available moves now analyze `playCard` when active play-from-under permissions exist, even if no hand card is playable.
- Under-card lookup now reads `cardMeta[sourceItemId].cardsUnder`, matching where stacked/limbo cards are tracked.
- Added available-move coverage proving the under character appears in `playCard.selectableCardIds`.

Touched:

- `packages/lorcana/lorcana-engine/src/lorcana-engine-base.ts`
- `packages/lorcana/lorcana-cards/src/cards/010/items/032-the-black-cauldron.test.ts`

### R25 - Firefly Swarm option 2 could be chosen illegally and resolve as a no-op

Report:

- Game id: `mgihdxdTZ6LLUNYi_vwbXmq`
- Turn: 19
- Player report: Selecting Firefly Swarm's second option when fewer than two cards had entered discard discarded the card without allowing a fallback to option 1.

Finding:

- Replay confirmed option 2 was selected while its condition was false.
- The card resolved without effect and was discarded.
- Illegal choice handling should reject unavailable modes before the action leaves hand where possible.

Change:

- Added choice-option legality validation for action-card `playCard` calls with an explicit `choiceIndex`.
- Added `getLegalChoiceOptionIndices`, mirroring the existing OR-option legality analysis.
- Choice resolution now treats an illegal raw choice as no-effect defensively, while normal play-card validation rejects it up front with `ILLEGAL_CHOICE_OPTION`.
- Selection-context analysis now evaluates conditional choice branches so unavailable conditional options are not presented as legal.
- Updated Firefly Swarm coverage so illegal option 2 is rejected and the card remains in hand.

Touched:

- `packages/lorcana/lorcana-engine/src/runtime-moves/moves/core/play-card.ts`
- `packages/lorcana/lorcana-engine/src/runtime-moves/resolution/action-effects/composed-effect-resolver.ts`
- `packages/lorcana/lorcana-engine/src/runtime-moves/resolution/action-effects/selection-context.ts`
- `packages/lorcana/lorcana-cards/src/cards/012/actions/130-firefly-swarm.test.ts`

## Validated without engine fixes

### R22 - Minnie Mouse with Support-modified strength

Report:

- Game id: `mg3rYLKTeMuVKyHnD_rsIQF`
- Turn: 11

Finding:

- Current engine strength evaluation already handles Support-modified current strength.

Change:

- Added regression coverage to prove Minnie Mouse - Sweetheart Princess can banish an exerted opposing character whose strength reaches 5+ via Support.

Touched:

- `packages/lorcana/lorcana-cards/src/cards/009/characters/005-minnie-mouse-sweetheart-princess.test.ts`

### R32 - Under the Sea Sing Together

Report:

- Game id: `mgUHtYhWrVFQd5P3zeL2GmY`
- Turn: 12

Finding:

- Existing coverage already verifies `Under the Sea` can be played with Sing Together 8 by exerting characters whose total cost is at least 8.
- The supplied replay turn did not include the reported Under the Sea attempt.

Change:

- No engine change.
- Added a manual visual fixture so humans can validate the expected UI path.

### R11/R14/R17/R28 - Luisa Confident Climber cluster

Reports:

- `mg5r9zT5Klev8MmMVIsDCxD`
- `mgSfkDDPNq5wFBY2j00Ad8I`
- `mg60BUktDMpzo8RV3qDKbNC`
- `mgEr_VZlbwwu1xFD75KGIS0`

Finding:

- Current focused Luisa tests cover the move-damage flow, repeated activation, valid target selection, and lethal-damage transfer timing.
- One replay showed pending selections persisting, but no current failing repro remained in this checkout.
- R28 could not be reconstructed by the replay CLI.

Change:

- No engine fix in this PR.
- Existing Luisa focused suite was rerun and passed.

## Manual visual validation fixtures added

The remaining card/UI-actionable reports now have fixture-driven browser routes under `/tests/<fixture-id>`.

Fixtures:

| Fixture route                                           | Reports     | Purpose                                                                             |
| ------------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------- |
| `/tests/triage-2026-05-17-tiana-dale-bot-challenge`     | R2          | Validate Tiana challenge-cost prompt and bot/UI decision surface.                   |
| `/tests/triage-2026-05-17-kristoffs-lute-play-top`      | R5          | Validate Kristoff's Lute offers play-top-card instead of only discard.              |
| `/tests/triage-2026-05-17-leviathan-return-of-hercules` | R6/R7       | Validate Leviathan via Return of Hercules and target unselect behavior.             |
| `/tests/triage-2026-05-17-hamm-piggy-bank-exert`        | R12         | Validate Hamm's dry exert ability and next-character discount.                      |
| `/tests/triage-2026-05-17-mirabel-curious-child-reveal` | R13/R21/R30 | Validate Mirabel's song reveal selection and confirm flow.                          |
| `/tests/triage-2026-05-17-bibbidi-another-character`    | R15         | Validate Bibbidi excludes the returned character from free-play candidates.         |
| `/tests/triage-2026-05-17-hades-target-clarity`         | R18         | Validate target clarity for Hades' opponent choice.                                 |
| `/tests/triage-2026-05-17-cheshire-cat-boost-move-one`  | R8/R19      | Validate Cheshire Cat can move exactly 1 damage from an up-to-2 effect.             |
| `/tests/triage-2026-05-17-wind-up-frog-toy-banish`      | R24         | Validate Wind-Up Frog becomes free after one of your Toy characters is banished.    |
| `/tests/triage-2026-05-17-lyle-dirty-tricks`            | R26         | Validate Lyle triggers only when in play and 2+ cards enter your discard this turn. |
| `/tests/triage-2026-05-17-sid-double-prizes`            | R27         | Validate Sid gains lore for each Toy banished during the controller's turn.         |
| `/tests/triage-2026-05-17-under-the-sea-sing-together`  | R32         | Validate Under the Sea Sing Together with total cost at least 8.                    |

Touched:

- `packages/lorcana/lorcana-simulator/src/lib/features/simulator-devtools/fixtures/triage-2026-05-17-remaining.ts`
- `packages/lorcana/lorcana-simulator/src/lib/features/simulator-devtools/fixtures/index.ts`
- `packages/lorcana/lorcana-simulator/src/lib/features/simulator-devtools/routes/test-routes.test.ts`

## Not fixed in this PR

These reports were not fixable as card-engine changes from current evidence:

- R3/R9/R29: disconnect, result assignment, and timer-state reports need product/server logs.
- R4/R8/R16/R19/R24/R30/R31: original reports lacked a precise card, step, or valid turn; visual fixtures were added where a plausible board-state validation existed.
- R10: Scar/Violet report was a rules expectation mismatch. Resist reduces damage before final damage is dealt.
- R15: Bibbidi report was primarily a rules expectation mismatch because the card says "another character"; a visual fixture was added for manual confirmation.
- R26: Replay had Lyle in discard, not play; a visual fixture was added for the correct in-play trigger state.
- R28: Replay CLI reconstruction failed before the submitted turn could be analyzed.

## Verification run

Fix/test verification:

```sh
bun test packages/lorcana/lorcana-cards/src/cards/002/characters/149-hiram-flaversham-toymaker.test.ts packages/lorcana/lorcana-cards/src/cards/012/actions/130-firefly-swarm.test.ts packages/lorcana/lorcana-cards/src/cards/010/items/032-the-black-cauldron.test.ts packages/lorcana/lorcana-cards/src/cards/010/characters/049-the-horned-king-triumphant-ghoul.test.ts packages/lorcana/lorcana-cards/src/cards/009/characters/005-minnie-mouse-sweetheart-princess.test.ts packages/lorcana/lorcana-cards/src/cards/004/actions/095-under-the-sea.test.ts --bail=10
```

Result:

- 29 pass, 0 fail.

Additional focused validation:

```sh
bun test packages/lorcana/lorcana-cards/src/cards/012/characters/060-luisa-madrigal-confident-climber.test.ts --bail=10
```

Result:

- 6 pass, 0 fail.

Full package validation:

```sh
pnpm nx run @tcg/lorcana-cards:test
pnpm nx run @tcg/lorcana-engine:test
pnpm nx run @tcg/lorcana-engine:check-types
pnpm nx run @tcg/lorcana-cards:check-types
pnpm nx run @tcg/lorcana-simulator:test:unit
pnpm nx run @tcg/lorcana-simulator:check-types
```

Results:

- `@tcg/lorcana-cards:test`: 7070 pass, 29 skip, 17 todo, 0 fail.
- `@tcg/lorcana-engine:test`: 1007 pass, 1 skip, 55 todo, 0 fail.
- `@tcg/lorcana-engine:check-types`: passed.
- `@tcg/lorcana-cards:check-types`: passed.
- `@tcg/lorcana-simulator:test:unit`: 652 pass, 3 skip, 0 fail.
- `@tcg/lorcana-simulator:check-types`: 0 errors, 0 warnings.

Environment note:

- `pnpm install --ignore-scripts` initially failed because there was no TTY.
- `CI=true pnpm install --ignore-scripts` repaired a stale local workspace symlink before the final validation runs.

## Engineering handoff notes

- The Hiram, Black Cauldron/Horned King, Black Cauldron play-from-under, and Firefly Swarm changes are behavioral fixes and should be reviewed carefully.
- The Minnie test is validation coverage for behavior that already worked in the current checkout.
- The visual fixtures are intentionally manual. They preserve report context for humans to inspect UI and game-flow behavior without encoding speculative engine fixes.
- Product/server issues should be followed up with gateway/matchmaking/session logs, not card tests.
