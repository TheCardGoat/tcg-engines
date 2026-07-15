# Cyberpunk Gameplay Guide Coverage

Source: https://cyberpunktcg.com/gameplay-guide

This matrix maps the public gameplay guide to the engine and utility tests that
own each rule area. Browser simulator tests are intentionally out of scope for
this matrix unless they validate an engine prompt contract.

| Guide area | Coverage owner |
| --- | --- |
| Win by starting a turn with 7+ Gigs | `win-condition-gigs.test.ts`, `src/moves/win-conditions.test.ts`, `win-condition-deck-out.test.ts` |
| Overtime majority after the last player's 7th turn | `win-condition-overtime.test.ts`, `src/moves/win-conditions.test.ts` |
| Deck-out when required to draw from an empty deck | `win-condition-deck-out.test.ts`, `gameplay-guide-spec.test.ts` |
| Playmat areas and hidden zones | `setup.test.ts`, `engine.test.ts`, `play-phase.test.ts`, `test-harness.test.ts` |
| Gig count versus Street Cred face values | `gameplay-guide-spec.test.ts`, card behavior tests using Street Cred conditions |
| Setup, randomized face-down Legends, first-player spent Legends, opening hand, mulligan | `setup.test.ts`, `src/moves/mulligan.test.ts`, `flow/two-turns.test.ts` |
| Start phase order: ready, draw, gain a Gig; d20 last | `flow/ready-phase.test.ts`, `src/moves/gain-gig.test.ts`, `gameplay-guide-prompts.test.ts`, `gameplay-guide-spec.test.ts` |
| Main phase actions in any order: sell, play, call Legend, attack | `gameplay-guide-spec.test.ts`, `play-phase.test.ts`, `flow/two-turns-with-moves.test.ts`, `gameplay-guide-prompts.test.ts` |
| Legends can pay costs face-up or face-down | `gameplay-guide-spec.test.ts`, `src/moves/play-card.test.ts`, `play-phase.test.ts` |
| Units enter with Lag; Lag blocks attacks and self-spend abilities | `lag-and-adrenaline.test.ts`, `gameplay-guide-spec.test.ts` |
| Attack sequence and complete one attack before another | `gameplay-guide-spec.test.ts`, `attack.test.ts`, `src/moves/attack-unit.test.ts` |
| ATTACK triggers before defender reactions | `trigger-resolution.test.ts`, `gameplay-guide-spec.test.ts` |
| Fights, tie defeats, defeated Gear movement, DEFEATED triggers | `attack.test.ts`, card-local defeated-trigger tests, `trigger-resolution.test.ts`, `gameplay-guide-spec.test.ts` |
| Direct attacks and Gig steal counts by power | `gameplay-guide-spec.test.ts`, `attack.test.ts`, `moves/resolve-steal-gigs.test.ts`, `gameplay-guide-prompts.test.ts` |
| Defensive reactions: Call Legend, QUICK, BLOCKER | `attack.test.ts`, `quick-keyword.test.ts`, `gameplay-guide-spec.test.ts` |
| Card types: Legend, Unit, Program, Gear | `play-phase.test.ts`, `src/moves/play-card.test.ts`, `cards/tests/invariants.test.ts` |
| Gear attaches to friendly Units or Legends and follows moved hosts | `play-phase.test.ts`, `attack.test.ts`, `gameplay-guide-spec.test.ts` |
| PLAY, CALL, ATTACK, DEFEATED trigger timing | `gameplay-guide-spec.test.ts`, `trigger-resolution.test.ts`, `play-phase.test.ts`, `attack.test.ts`, card-local tests |
| Keywords: ADRENALINE, GO SOLO, QUICK, BLOCKER | `lag-and-adrenaline.test.ts`, `quick-keyword.test.ts`, `attack.test.ts`, `gameplay-guide-spec.test.ts`, `src/cards/alpha/legends/v-corporate-exile.test.ts` |
| Deckbuilding: exactly 3 unique Legends, 40-50 card main deck, max 3 copies, RAM by color | `../packages/utils/tests/deck-validation.test.ts` |

When a gameplay-guide section changes, update the relevant test owner first and
then update this matrix in the same patch.
