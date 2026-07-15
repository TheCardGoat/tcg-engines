# Daily Feedback Replay Triage - 2026-05-24

Report-only triage for 11 simulator bug reports submitted in the previous 24
hours. No fixes, tests, dev servers, or database commands were run as part of
this triage.

Replay traces were pulled with:

```bash
bun packages/tools/replay-cli/src/cli.ts --replay-id <gameId> --turn <turn>
```

The full sweep replayed every available digest replay turn-by-turn, producing
199 turn trace files under `/tmp/lorcana-full-replay-sweep-2026-05-24`.

## Executive Summary

| Classification                 | Count | Items     |
| ------------------------------ | ----: | --------- |
| Actionable engine/card bug     |     3 | 1, 10, 11 |
| Simulator/UI bug               |     1 | 2         |
| Backend/platform bug           |     0 | -         |
| Rules/player-expectation issue |     1 | 8         |
| Needs clarification            |     2 | 6, 9      |
| No reproduction                |     2 | 4, 7      |
| Informational feedback         |     2 | 3, 5      |
| Out of scope                   |     0 | -         |

## Replay Coverage

Pulled and swept beginning-to-end:

- `mgjmfAo6zaxg-Cd0Sq7vDXR`: 12 turns
- `mg5PQDRP8Kxm2loOeBJYjw3`: 12 turns
- `mgxxJQi2-xGXwqqwJyvbf3n`: 17 turns
- `mgLVtmaDVDGdSN-cEGhK67f`: 18 turns
- `mgKaHy8UzNqdh-Lt9p9Fn19`: 18 turns
- `mgDATEj5uTpuWEfuHARRPpC`: 23 turns
- `mgMKBgE7bnjFSkB1EsJC6tw`: 30 turns
- `mgXXum0eAEQKiiPS49-d6dy`: 32 turns
- `mgFB6uv7kteEoZHeLyujuMV`: 37 turns

Missing:

- `mgxflN295d7ZUvm8pZ2dvmI`: `replay not found` for items 3 and 5.

Failed after retry: none.

Skipped: none of the bug-report rows with available replay IDs were skipped.

## Actionable Findings

### Engine/Card

#### Item 1 - Hamm survives after losing Woody's Willpower modifier

- Digest item: 1
- DB ID: `bugrepT4G7GU5__7agFY5TPEp9s`
- Replay: `mgjmfAo6zaxg-Cd0Sq7vDXR`, reported turn 9
- Strongest trace: turn 8 into turn 9
- Cards:
  - `Hamm - Piggy Bank`, `packages/lorcana/lorcana-cards/src/cards/012/characters/011-hamm-piggy-bank.ts`
  - `Woody - Jungle Guide`, `packages/lorcana/lorcana-cards/src/cards/012/characters/015-woody-jungle-guide.ts`

Replay evidence:

- Hamm instance `f2` took 3 damage in a challenge on turn 7.
- Woody instance `l9` was later banished on turn 8.
- After Woody left play, Hamm instance `f2` remained in play with 3 damage.
- Turn 9 initial state still showed Hamm `f2` in play with 3 damage.

Rules constraints:

- CR `1.8.1.4`: a character with damage equal to or greater than Willpower is
  banished during game-state checks.
- CR `1.8.3`: game-state checks repeat after a game-state-check result.
- CR example under `1.8.1` shows a character becoming lethal after a Willpower
  source leaves play and then being banished by the next check.

Candidate files:

- `packages/lorcana/lorcana-engine/src/runtime-moves/state/lethal-damage-sweep.ts`
- `packages/lorcana/lorcana-engine/src/runtime-moves/state/game-state-check.ts`
- `packages/lorcana/lorcana-cards/src/cards/012/characters/015-woody-jungle-guide.ts`

Next action:

- Add a focused repro where a damaged character survives only because of a
  static Willpower modifier, then the modifier source leaves play. The character
  should be banished by the follow-up game-state check.

#### Item 10 - Ichabod's WELL-READ resolves with no inkwell result

- Digest item: 10
- DB ID: `bugrepg3DYUxEEpSiFY_1-z2R-2`
- Replay: `mgXXum0eAEQKiiPS49-d6dy`, turn 8
- Cards:
  - `Ichabod Crane - Bookish Schoolmaster`, `packages/lorcana/lorcana-cards/src/cards/010/characters/148-ichabod-crane-bookish-schoolmaster.ts`
  - `The Headless Horseman - Terror of Sleepy Hollow`, `packages/lorcana/lorcana-cards/src/cards/010/characters/125-the-headless-horseman-terror-of-sleepy-hollow.ts`

Replay evidence:

- Step 32 played Headless Horseman instance `yx`.
- The trace added `yx` to `G.turnMetadata.cardsPlayedThisTurn`.
- Step 34 resolved Ichabod instance `wr` ability `WELL-READ`.
- The ability completed with `resolution.kind: noInput` and no `cardsInked`
  outcome.

Candidate files:

- `packages/lorcana/lorcana-cards/src/cards/010/characters/148-ichabod-crane-bookish-schoolmaster.ts`
- `packages/lorcana/lorcana-engine/src/rules/condition-evaluator.ts`

Next action:

- Add a repro for Ichabod questing after a cost 5 or greater character was
  played in the same turn, then confirm whether the card's free-form condition
  is unsupported or mapped to the wrong turn metric.

#### Item 11 - Escape Plan auto-rejects own partial selection

- Digest item: 11
- DB ID: `bugrepBXcaEYuXN1jdTT_UDE09_`
- Replay: `mgFB6uv7kteEoZHeLyujuMV`, turn 11
- Card:
  - `Escape Plan`, `packages/lorcana/lorcana-cards/src/cards/012/actions/164-escape-plan.ts`

Replay evidence:

- Step 59 played Escape Plan instance `mq`.
- The caster had one own eligible character candidate, `s2`.
- The own-side pending effect was generated with:
  - `cardCandidateIds: ["s2"]`
  - `minSelections: 0`
  - `maxSelections: 1`
  - `declaredMaxSelections: 2`
  - `autoRejected: true`
- Step 60 resolved that own-side effect with `targets: []`.
- The opponent-side continuation then required and inked two opposing
  characters, `b8` and `ac`.

Rules constraints:

- CR `6.1.2`: effect instructions resolve in written order.
- CR `6.7.2.4`: if an effect tells a player to do something, that player does as
  much as possible even if part of the effect cannot be done.

Candidate files:

- `packages/lorcana/lorcana-cards/src/cards/012/actions/164-escape-plan.ts`
- `packages/lorcana/lorcana-engine/src/targeting/runtime/target-analysis.ts`
- `packages/lorcana/lorcana-engine/src/runtime-moves/resolution/resolve-effect.ts`

Next action:

- Add a repro for Escape Plan with one own character and two opposing
  characters. The expected result is that the one own character is put into the
  inkwell before the opponent chooses up to the required amount from their side.

### Simulator/UI

#### Item 2 - Buzz no-target trigger retries after Hamm play

- Digest item: 2
- DB ID: `bugrep8LzlXliDYbFVZ0gjrBUP2`
- Replay: `mg5PQDRP8Kxm2loOeBJYjw3`, reported turn 8; strongest trace turn 7
- Cards:
  - `Buzz Lightyear - On the Way`, `packages/lorcana/lorcana-cards/src/cards/012/characters/085-buzz-lightyear-on-the-way.ts`
  - `Hamm - Piggy Bank`, `packages/lorcana/lorcana-cards/src/cards/012/characters/011-hamm-piggy-bank.ts`

Replay evidence:

- Buzz ability `WORLD'S GREATEST TOY` was added to the bag after a low-cost
  character was played.
- It targeted `CHOSEN_DAMAGED_OPPOSING_CHARACTER`.
- There were no legal damaged opposing targets.
- The bag entry cancelled with `cancelReason: "no-valid-targets"` multiple
  times around undo/retry attempts.

Next action:

- Treat this as a simulator affordance issue unless a repro shows the bag item
  is retained incorrectly after cancellation. The UI should either auto-fizzle
  no-target mandatory bag entries or explain that there are no legal targets.

Candidate area:

- `packages/lorcana/lorcana-simulator/src/testing/ui-state/prompt-snapshot.ts`
- `packages/lorcana/lorcana-simulator/src/testing/ui-state/prompt-snapshot.test.ts`
- Bag/pending-selection presentation code under `packages/lorcana/lorcana-simulator/src/lib`

## Item-by-Item Triage

|   # | DB ID                         | Source    | Submitted UTC       | gameId                    | Turn | Cards/area                 | Replay result                                                                         | Classification                 | Next action                                             |
| --: | ----------------------------- | --------- | ------------------- | ------------------------- | ---: | -------------------------- | ------------------------------------------------------------------------------------- | ------------------------------ | ------------------------------------------------------- |
|   1 | `bugrepT4G7GU5__7agFY5TPEp9s` | simulator | 2026-05-23 16:43:30 | `mgjmfAo6zaxg-Cd0Sq7vDXR` |    9 | Hamm, Woody                | Pulled; issue appears from turn 8 into turn 9                                         | Actionable engine/card bug     | Repro static Willpower loss causing lethal cascade      |
|   2 | `bugrep8LzlXliDYbFVZ0gjrBUP2` | simulator | 2026-05-23 16:56:49 | `mg5PQDRP8Kxm2loOeBJYjw3` |    8 | Buzz, Hamm                 | Pulled; no damaged opposing target, repeated no-target cancel around undo/retry       | Simulator/UI bug               | Improve no-target trigger presentation                  |
|   3 | `bugrep71ONUqcrXHRIB7TqgJgN1` | simulator | 2026-05-23 18:35:58 | `mgxflN295d7ZUvm8pZ2dvmI` |    4 | General                    | `replay not found`                                                                    | Informational feedback         | No engineering action without specific bug              |
|   4 | `bugrepQJ_mMnAFD8hiIArBtA6oA` | simulator | 2026-05-23 18:36:34 | `mgxxJQi2-xGXwqqwJyvbf3n` |   17 | Darkwing's Chair Set       | Pulled; only Chair Set activation found on turn 12 targeted non-Darkwing and healed 2 | No reproduction                | Ask for correct turn/target                             |
|   5 | `bugrepBouLVZg2vziH8MdPe3hRX` | simulator | 2026-05-23 18:40:23 | `mgxflN295d7ZUvm8pZ2dvmI` |    8 | General                    | `replay not found`                                                                    | Informational feedback         | No engineering action without specific bug              |
|   6 | `bugrepcx_zLO-9aiLDcorMu_UyF` | simulator | 2026-05-23 19:56:16 | `mgLVtmaDVDGdSN-cEGhK67f` |    6 | Lore/questing              | Pulled; lore gains appear normal, game later reaches 20 lore                          | Needs clarification            | Ask which card or lore total was wrong                  |
|   7 | `bugrepYjoQri6Fzuu2EXJfGbiaA` | simulator | 2026-05-23 20:24:18 | `mgKaHy8UzNqdh-Lt9p9Fn19` |   18 | Tiana                      | Pulled; reported two exerted Tianas not present at reported moment                    | No reproduction                | Ask for exact turn or alternate replay                  |
|   8 | `bugrepgMPIe1m8v--NyjQRDjgBp` | simulator | 2026-05-23 23:03:53 | `mgDATEj5uTpuWEfuHARRPpC` |   12 | Woody, Bullseye            | Pulled; Bullseye cost remains 3, payment modifier affects amount paid only            | Rules/player-expectation issue | No engine fix; consider UX copy if recurring            |
|   9 | `bugrep3OCcrG6N5oFEZQZg6EWQL` | simulator | 2026-05-23 23:13:59 | `mgMKBgE7bnjFSkB1EsJC6tw` |   13 | Madam Mim Elephant         | Pulled; `SNEAKY MOVE` resolved with `resolveOptional: false`                          | Needs clarification            | Ask whether prompt was missing or declined accidentally |
|  10 | `bugrepg3DYUxEEpSiFY_1-z2R-2` | simulator | 2026-05-24 02:18:35 | `mgXXum0eAEQKiiPS49-d6dy` |    8 | Ichabod, Headless Horseman | Pulled; `WELL-READ` completed with no ink patch after Headless Horseman was played    | Actionable engine/card bug     | Repro cost 5 or greater character condition             |
|  11 | `bugrepBXcaEYuXN1jdTT_UDE09_` | simulator | 2026-05-24 02:37:39 | `mgFB6uv7kteEoZHeLyujuMV` |   11 | Escape Plan                | Pulled; own side auto-rejected despite one candidate, opponent side inked two         | Actionable engine/card bug     | Repro partial required target selection                 |

## Clarification Questions

### Item 4

Which exact turn did Darkwing's Chair Set target a card named `Darkwing Duck`?
The full replay sweep found Chair Set resolving for 2 against a non-Darkwing
target, which matches its effect.

### Item 6

Which card or lore total failed? The replay shows normal quest lore patches on
turn 6 and later turns.

### Item 7

Was there a different turn where two exerted Tianas were in play? The reported
turn did not reproduce that board state.

### Item 9

Did the Madam Mim Elephant prompt fail to appear, or was the optional trigger
declined? The trace records `resolveOptional: false`.

## Evidence Limits and Assumptions

- The report is grounded in persisted replay logs and JSON patches, not live UI
  reproduction.
- The replay CLI prints individual turns, so the beginning-to-end sweep was run
  as one trace per available turn.
- `mgxflN295d7ZUvm8pZ2dvmI` was not available from production replay storage.
- The Buzz finding is classified as UI until a targeted repro proves the engine
  retains a cancelled no-target bag item incorrectly.
- No repro tests were written in this report-only pass. If this triage is used
  as an engineering assignment, add failing tests first for items 1, 10, and 11.
