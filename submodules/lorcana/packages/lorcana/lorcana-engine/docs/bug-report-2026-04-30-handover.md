# Bug-report digest 2026-04-30 (THE-1031) — investigation & handover

Source: 35 player bug reports + 1 feedback collected 2026-04-30 / 2026-05-01.

This document records what was investigated, what was fixed, and what is
handed off to other teams (frontend, design, support).

## Summary

| Status                                         | Count | Findings                                       |
| ---------------------------------------------- | ----- | ---------------------------------------------- |
| Engine fix shipped (prior PR)                  | 4     | R13, R18, R23, R28                             |
| Engine fix shipped (this PR)                   | 1     | R7/R19                                         |
| Engine verified correct, regression test added | 6     | R10, R15, R24, R25, R30, R1/R6/R8              |
| Frontend handover (Playwright fixme + notes)   | 7     | R3/R12, R5/R26, R16, R17, R21, R33, Feedback 1 |
| Inaccurate (rules working as intended)         | 2     | R14b, R32                                      |
| Needs more reporter info                       | 8     | R2, R9, R14a, R20, R22, R29, R31, R34, R35     |

## Engine fix shipped this PR

### R7/R19 — Syndrome Out for Revenge: typed `has-classification` filter ignored on `return-from-discard`

Card uses

```ts
filter: [{ type: "has-classification", classification: "Robot" }];
```

but `return-from-discard-effect.ts:matchesReturnFilter` only handled the
untyped `CardSelectionFilter` shape (`{ classification: "Robot" }`). For an
array filter the typed branch was discarded as `undefined`, so any card in
discard satisfied the filter and a player could route a non-Robot back to
hand.

Fix: delegate array filters to the existing `matchesCardFilterArray`
helper before falling through to the untyped branch (mirrors the existing
play-card path at `play-card-effect.ts:476`).

Files:

- `packages/lorcana/lorcana-engine/src/runtime-moves/resolution/action-effects/return-from-discard-effect.ts`
- `packages/lorcana/lorcana-cards/src/cards/012/characters/172-syndrome-out-for-revenge.test.ts` (new test: rejects non-Robot return target)

R7 second sub-bug — the play-card filter for Robots — was already correct;
the play-card resolver already calls `matchesCardFilterArray` for typed
array filters.

## Engine verified correct, regression test added

For each of the following findings, the engine path was traced from the
card definition through the relevant resolver/state machinery and a
regression test was added under the card's existing test file. The user-
facing report could not be reproduced at the engine level — the most
plausible explanation in each case is a UI-side issue (the player did not
see a prompt the engine had created, or the client emitted a request that
already foreclosed the choice).

| Finding      | Card / engine path                                                                                                                                                                                                                           | Test added                                 |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| R30          | Diablo Devoted Herald shift onto Diablo Stone Servant (set 12, 2-cost) — name match works across sets.                                                                                                                                       | `070-diablo-devoted-herald.test.ts`        |
| R10          | Jessie YODEL-AY-HEE-HOO! with no opposing characters auto-drains via the bag's `shouldAutoRejectForNoValidTargets` path.                                                                                                                     | `020-jessie-lively-cowgirl.test.ts`        |
| R25          | Rex Bodyguard restriction enforced when exerted; opponent cannot challenge a non-Bodyguard sibling.                                                                                                                                          | `010-rex-protective-dinosaur.test.ts`      |
| R1 / R6 / R8 | When `enterPlayExerted: true` is supplied, a Bodyguard character free-played via Lady's SOMEONE TO CARE FOR enters play exerted. The engine's `play-card-effect.ts:1011` consumes this flag for Bodyguard or `may-enter-play-exerted` cards. | `011-lady-family-dog.test.ts`              |
| R24          | Two Donald Fred Honeywells in play each fire WELL WISHES on a sibling banish; both read the same `cardsUnderCountBeforeBanish` snapshot from `banish-effect.ts:159`.                                                                         | `093-donald-duck-fred-honeywell.test.ts`   |
| R15          | Cards-under that move to discard when a Boost host is banished increment `cardsPutIntoDiscardThisTurnByOwner` via the central `onCardEnteredZone` hook in `match-runtime.utils.ts:150`; Kida's READ THE RUNES then triggers.                 | `157-kida-discovering-the-unknown.test.ts` |

R1/R6/R8 in particular implies the simulator does not emit
`enterPlayExerted: true` when resolving the optional triggered free-play —
the engine correctly threads it from `resolveBag` (line 425) through
`buildResolutionSelectionContext` to the play-card resolver. Frontend
should add the entry-mode chooser UI to optional play-card prompts whose
target candidate has Bodyguard or `may-enter-play-exerted`.

## Frontend handover

Pending Playwright tests have been added under
`apps/web/e2e/bug-report-2026-04-30-tier4.e2e.ts` for each finding below.
They use `test.fixme` and document repro recipe, engine evidence, and the
specific frontend code paths to inspect. A reviewer needs to wire each
test against an end-to-end harness (deterministic deck, mocked auth,
simulator fixture) before they can run.

### R3 / R12 — opponent does not see scry reveals

Card data is correct (`reveal: true` on the destination); engine
visibility is correct (`isCardVisibleViaReveal()` in
`runtime-game/project-board.ts:320–344` grants opponents access). The
frontend reveal renderer/log entry is the suspected gap.

### R5 / R26 — Shift sometimes leaves the turn in a stuck state

Reporter game ids: `mgeIccTD7eREexdbVONBZyA`, `mgYLNQaXpFF2Hp8jLVACwCU`.
The engine's shift drying inheritance (`shift-stack.ts:29–76`,
`execute-shift-play.ts:44–46`) is correct in unit tests. Suspect a UI
projection desync where pending-effect indicators aren't cleared after
the shift completes. A replay of the reporter games is the fastest way
to diagnose.

### R16 — Woody Jungle Guide auto-played the drawn card without confirmation

Engine optionals always create a pending prompt when ≥1 candidate
exists (verified via R10's regression test). Most likely the simulator
auto-submits `{ resolveOptional: true, targets: [onlyCandidate] }` when
the drawn card is the sole valid target. Optional plays must surface a
confirm step regardless of candidate count.

R16(b) — EVERYONE GATHER 'ROUND +1 willpower static buff: should be
verified separately with a dedicated engine test that activates a Toy
character mid-resolution. File a follow-up if reproduction shows the
buff is missing.

### R17 — wrong card art rendered in a play-zone slot

Reporter saw Kuzco rendered as Dolores Madrigal. No engine card data
maps these. Suspect the card-image component / projection diff in
`apps/web` — slot memoization key collision is the most likely cause.

### R21 — Desperate Plan discard chooser unresponsive

The action effect (`packages/lorcana/lorcana-cards/src/cards/008/actions/201-desperate-plan.ts:43–52`)
defines `chosen: true` with `amount: DISCARDED_COUNT`. The simulator
likely renders a single-card picker instead of a multi-select for this
chosen+variable-amount discard step.

### R33 — Boost card-under picker not reachable on portrait mobile

Mobile-specific layout / z-index issue with the Boost selection UI.
Test scenario in the Playwright file uses `390×844` viewport.

### Feedback 1 — items in play too small on portrait mobile

Design feedback. Needs a min-size spec from design before a fix can land.

## Inaccurate — close with reply to reporter

### R14b — Bibbidi Bobbidi Boo cannot replay the card it just returned

Card text reads "play **another** character with the same cost or less".
Implementation correctly excludes the returned card via
`excludeChosenCard: true`
(`packages/lorcana/lorcana-cards/src/cards/002/actions/096-bibbidi-bobbidi-boo.ts:48–53`).
Working as intended.

### R32 — Fire the Cannons! only dealt 1 damage

Card deals 2 damage. The most likely explanation is the target had
Resist +1 (e.g. Heihei Expanded Consciousness has resist(1)). No engine
bug. Reply to reporter asking which character was targeted.

## Needs more reporter info — close pending response

| Id   | What we need                                                                    | Notes                                                                                        |
| ---- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| R2   | Which Cheshire Cat version, expected vs actual behaviour                        | Report had no actionable detail.                                                             |
| R9   | Song name + failure mode (wrong threshold? singers rejected? UI didn't prompt?) | Sing Together engine path is implemented (`play-card-rules.ts:382–413`).                     |
| R14a | Replay of `game-1777568069146-8b6jdf5nj`                                        | "Sometimes" failures need state context.                                                     |
| R20  | Which Hei Hei card was used                                                     | `discard-cards-left` metric increments on return-to-hand; need to know the version's effect. |
| R22  | Active buffs / attacker strength on Mirage at challenge time                    | Mirage base STR is 3; "4 damage" implies a +1 buff.                                          |
| R29  | Anything beyond "locked up" on turn 0                                           | No description.                                                                              |
| R31  | Did the targeting prompt appear and get ignored, or never appear?               | TRIPLE SHOT engine path looks correct.                                                       |
| R34  | Character name, willpower, attacker strength                                    | Resist reduces but doesn't prevent banish at high incoming damage.                           |
| R35  | Which Belle, which ability, expected behaviour                                  | No description.                                                                              |

## Files changed in this PR

Engine:

- `packages/lorcana/lorcana-engine/src/runtime-moves/resolution/action-effects/return-from-discard-effect.ts`

Cards (regression tests only):

- `packages/lorcana/lorcana-cards/src/cards/004/characters/070-diablo-devoted-herald.test.ts`
- `packages/lorcana/lorcana-cards/src/cards/008/characters/011-lady-family-dog.test.ts`
- `packages/lorcana/lorcana-cards/src/cards/011/characters/093-donald-duck-fred-honeywell.test.ts`
- `packages/lorcana/lorcana-cards/src/cards/012/characters/010-rex-protective-dinosaur.test.ts`
- `packages/lorcana/lorcana-cards/src/cards/012/characters/020-jessie-lively-cowgirl.test.ts`
- `packages/lorcana/lorcana-cards/src/cards/012/characters/157-kida-discovering-the-unknown.test.ts`
- `packages/lorcana/lorcana-cards/src/cards/012/characters/172-syndrome-out-for-revenge.test.ts`

Frontend handover:

- `apps/web/e2e/bug-report-2026-04-30-tier4.e2e.ts` (new — Playwright fixme tests)

Documentation:

- `packages/lorcana/lorcana-engine/docs/bug-report-2026-04-30-handover.md` (this file)

## Test results

- `bun test packages/lorcana/lorcana-engine` — 966 pass, 0 fail
- `bun test packages/lorcana/lorcana-cards` — 7034 pass, 7 fail (all
  pre-existing in `scripts/__tests__/generate-legacy-card-map.test.ts`,
  unrelated to this work — verified by re-running on stashed working tree).
