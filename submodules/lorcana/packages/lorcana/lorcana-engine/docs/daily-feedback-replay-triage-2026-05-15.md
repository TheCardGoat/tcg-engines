# Daily feedback replay triage and fix report - 2026-05-15

Source: 22 simulator bug reports and 1 feedback item submitted from
2026-05-14 08:56:56 UTC through 2026-05-15 04:41:03 UTC.

Primary fix scope: `packages/lorcana/lorcana-engine`. Card definitions and
reproduction tests were updated in `packages/lorcana/lorcana-cards` where replay
evidence showed a card-text mismatch or where the current test harness already
owns card-specific behavior.

Workflow used: Intake -> Identify Cards -> Find Similar Patterns ->
Validate Rules -> Attempt Reproduction -> Produce Report.

Note: `.ai/skills/lorcana-triage-bug/SKILL.md` was not present in this
checkout. I used the checked-in Lorcana replay, card lookup, rules, and test
generation workflows instead.

## Executive summary

| Bucket                        | Reports                           | Engineering result                                                                                                                                       |
| ----------------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fixed in engine               | R2, R4, R13, R16, R17, R20        | Slot-aware `move-damage` resolution now honors the explicit destination slot before falling back to legacy selection context lookup.                     |
| Fixed in engine               | R19                               | `playCard` sacrifice cost now banishes the sacrificed item through the normal banish-as-cost path, so "when this item is banished" abilities trigger.    |
| Fixed in engine               | R10, R22                          | `getAvailableMoves()` now analyzes playable cards when only alternate play buckets are legal, and standard play no longer absorbs sing/shift-only cards. |
| Fixed in card definition/test | R21                               | Promising Lead now grants +1 lore and Support to the chosen character; a regression test proves Support triggers after questing.                         |
| No engine reproduction        | R3, R6, R7, R8, R9, R12, R14, R18 | Replay evidence showed the path working, no failed attempt, or only positive feedback.                                                                   |
| Out of engine scope           | R1, R5, R11, R15, Feedback 1      | Drop opponent, undo boundaries, replay/log readability, replay export buttons, and matchmaking policy belong outside the engine package.                 |

Replay coverage: 21 of 22 bug report replay ids were pulled. R20
`game-1778815392703-3fyhomrjc` was not found by the replay CLI.

## Fixes applied

### 1. Move-damage slotted destination routing

Affected reports:

- R2 `mgD3vj3KezIhIs5psbSRdLn`, turn 20, Luisa Madrigal.
- R4 `mgJ_gxVH8BMyLgs0vPE52nd`, turn 7, Luisa Madrigal and Mulan - Injured Soldier.
- R13 `mgTMeNXtjWzefrB3jY6aZyF`, turn 25, Luisa Madrigal.
- R16 `mgQVGJGGBgcaJMayQa926uw`, turn 24, Violet Parr.
- R17 `mgegCRM4Az6I2NQvUgl5XIE`, turn 8, Mother Gothel and Panic.
- R20 `game-1778815392703-3fyhomrjc`, turn 21, Luisa Madrigal, replay unavailable.

Replay and pattern evidence:

- R4 showed Luisa resolving with Mulan selected as the source, but no damage was moved.
- R17 showed Mother Gothel and later Panic move-damage choices submitted with both source and destination, but no `damageMoved` outcome.
- Luisa and Violet source selectors now constrain their source side where printed text requires it. The shared failure mode was the resolver ignoring the explicit destination slot for target descriptors such as `CHOSEN_OPPOSING_CHARACTER`; prompt analysis also needed to preserve move-damage endpoint filters so undamaged characters are not offered as source candidates.

Fix:

- `runtime-moves/resolution/action-effects/move-damage-effect.ts` now prefers `slottedTargets.to` when resolving the destination in the slot-aware path.
- `targeting/runtime/target-analysis.ts` now carries move-damage endpoint filters into the candidate analysis path used by prompts.
- Existing behavior for legal no-op cases remains intact: a printed "chosen character" source can still be selected even if it has no damage, and the effect simply moves 0.

Regression coverage:

- Luisa: damaged source filtering and repeated activations are covered in `060-luisa-madrigal-confident-climber.test.ts`.
- Violet: DEFLECT source/destination candidate coverage added in `048-violet-parr-learning-new-powers.test.ts`.
- Mother Gothel: opposing-character source to opposing-character destination coverage added in `064-mother-gothel-vain-sorceress.test.ts`.

### 2. Sacrificed items now fire banish triggers

Affected report:

- R19 `mgP6nvk_gM9NAQjwoThrqbD`, turn 5, "Bomb not exploding".

Replay and card identity:

- The replay did not contain a card literally named "Bomb".
- The turn did show Belle - Apprentice Inventor played by sacrificing Ingenious Device.
- Ingenious Device has `TIME GROWS SHORT`: during your turn, when this item is banished, deal 3 damage to chosen character or location.

Fix:

- `runtime-moves/moves/core/play-card.ts` now pays `sacrifice` play costs through `banishAsAbilityCost` instead of directly moving the item to discard and clearing metadata.
- This emits the normal banish event so item banish triggers can enter the bag.

Regression coverage:

- `159-belle-apprentice-inventor.test.ts` now verifies sacrificing Ingenious Device to play Belle creates the Ingenious Device bag item and deals 3 damage when resolved.

### 3. Diablo shift availability in available moves

Affected reports:

- R10 `mgJ1s9bpn0DA4QUpOyiml6p`, turn 3.
- R22 `mgVsbYagqQCiF7Uc05dF3VL`, turn 3.

Replay evidence:

- R10's inspected turn showed Diablo - Devoted Herald shifting successfully by discarding an action.
- R22 turn 3 did not contain a failed Diablo shift attempt, but the all-turn sweep showed successful shifts later in that same game, including turn 5 with `cost:"shift"` and `discardCards`.

Fix:

- `lorcana-engine-base.ts` now analyzes play-card move buckets when a hand card is playable only through alternate play routes.
- Standard `playCard` availability now uses standard-cost validation, so sing/shift-only cards stay in `singCard` or `shiftCard` buckets.

Regression coverage:

- `070-diablo-devoted-herald.test.ts` now verifies `getAvailableMoves()` lists Diablo under `shiftCard` and exposes action cards in hand as selectable discard costs.

### 4. Promising Lead definition corrected

Affected report:

- R21 `mgJe6ZtjoejLPogBuLJm7sd`, turn 6.

Replay evidence:

- The replay showed Promising Lead played on Buzz Lightyear, but the patch stream granted only +2 lore and did not add Support metadata. That matched the pre-fix card definition.

Fix:

- `162-promising-lead.ts` now grants +1 lore and Support to the chosen character this turn.

Regression coverage:

- `162-promising-lead.test.ts` now verifies the +1 lore/current Support text and proves the granted Support creates a quest-time Support trigger.

## Item-by-item triage

| Report     | Game id                        | Cards / area                   | Reproduction result                                                                                                                 | Status                                                                 |
| ---------- | ------------------------------ | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| R1         | `mgoqHKRqYqeEzrrXHA4ocQw`      | Drop opponent after disconnect | Replay cannot capture the disconnected opponent UI/server action.                                                                   | Out of engine scope.                                                   |
| R2         | `mgD3vj3KezIhIs5psbSRdLn`      | Luisa Madrigal                 | Same move-damage family as R4/R17.                                                                                                  | Covered by move-damage slot fix and Luisa tests.                       |
| R3         | `mg_t6IuvJ8n_vDk-Am2Uw3y`      | Desperate Plan                 | All-turn sweep found Desperate Plan in card lists/reveals, but no Desperate Plan play/failure step.                                 | Needs exact turn/step; no engine change.                               |
| R4         | `mgJ_gxVH8BMyLgs0vPE52nd`      | Luisa Madrigal, Mulan          | Luisa resolved with source selected but moved no damage.                                                                            | Covered by move-damage slot fix and Luisa tests.                       |
| R5         | `mgi7VQiKuJMBPcPjASMJAoW`      | Undo UX                        | Undo boundary is simulator command history, not card resolution.                                                                    | Out of engine scope.                                                   |
| R6         | `mgDIrw6jGs4F8QNR4EcgUfo`      | Sail the Azurite Sea           | All-turn sweep showed a successful second inkwell action on turn 3 after Sail set `additionalInkwellActions` to 1.                  | No engine reproduction.                                                |
| R7         | `mgHZ9xKtrkhBEaoH63e8RCT`      | Syndrome, Omnidroid            | Related follow-up R14 says Omnidroid shift works; inspected replay did not show a current engine failure.                           | No engine change.                                                      |
| R8         | `mgrDQT809iMX3jhuhf3Av30`      | Peter Pan, Sid Phillips        | Turn 16 showed a challenge/banish, but Sid's Double Prizes applies to Toy characters; Peter Pan is not a Toy.                       | Likely rules/expectation issue; no engine change.                      |
| R9         | `mgcl0uaNVhUY8Fl9cLVjGJx`      | B.E.N., Support                | All-turn sweep showed B.E.N. questing on turn 12, creating synthetic Support, and resolving it to a target.                         | No engine reproduction.                                                |
| R10        | `mgJ1s9bpn0DA4QUpOyiml6p`      | Diablo - Devoted Herald        | Replay showed successful shift; availability test still added for the reported UX surface.                                          | Covered by available-moves fix/test.                                   |
| R11        | `mgn4SfO0SUd_l2oKcNTOMPx`      | Playback clarity               | Report does not identify the killed characters or cause.                                                                            | Needs clarification; likely simulator/replay log surface.              |
| R12        | `mgVfFoCgC4asJGm3zayRoVA`      | Sapphire Coil, How Far I'll Go | Replay showed Sapphire Coil trigger and target selection before the target was later banished.                                      | No engine reproduction.                                                |
| R13        | `mgTMeNXtjWzefrB3jY6aZyF`      | Luisa Madrigal                 | Supplied turn did not contain the Luisa activation, but it matches R2/R4/R20 family.                                                | Covered by move-damage slot fix/tests.                                 |
| R14        | `mghRH16lFDie48FA6Ls7vLB`      | Omnidroid shift                | Positive feedback: shift works.                                                                                                     | Informational.                                                         |
| R15        | `mgeA68vsRB8DJ_PlUEkybeQ`      | Save/Download Replay buttons   | End-game replay export buttons are simulator UI.                                                                                    | Out of engine scope.                                                   |
| R16        | `mgQVGJGGBgcaJMayQa926uw`      | Violet Parr                    | Replay did not isolate Violet's trigger, but card uses same slotted move-damage destination route.                                  | Covered by move-damage slot fix and Violet test.                       |
| R17        | `mgegCRM4Az6I2NQvUgl5XIE`      | Mother Gothel, Panic           | Submitted source/destination choices produced no moved-damage outcome.                                                              | Covered by move-damage slot fix and Mother Gothel test.                |
| R18        | `mg_3n29Jqzk9tLTp8cGCY2O`      | Hand-in-the-Box                | All-turn sweep showed Hand-in-the-Box in the game and inking actions, but no free-play attempt. Existing tests cover its free play. | Needs exact failed step if still repros.                               |
| R19        | `mgP6nvk_gM9NAQjwoThrqbD`      | Belle, Ingenious Device        | Replay matched an item sacrificed to Belle; sacrificed item banish trigger did not fire.                                            | Fixed by banish-as-cost sacrifice path.                                |
| R20        | `game-1778815392703-3fyhomrjc` | Luisa Madrigal                 | Replay id was not found. Report matches R2/R4 move-damage family.                                                                   | Covered indirectly; needs persisted replay id for direct confirmation. |
| R21        | `mgJe6ZtjoejLPogBuLJm7sd`      | Promising Lead, Buzz           | Replay used stale Promising Lead behavior: +2 lore and no Support.                                                                  | Current code covered by regression test.                               |
| R22        | `mgVsbYagqQCiF7Uc05dF3VL`      | Diablo - Devoted Herald        | Turn 3 had no failed shift attempt; later turns in same game showed successful shifts.                                              | Covered by available-moves fix/test.                                   |
| Feedback 1 | none                           | Matchmaking                    | No game id; queue policy outside engine.                                                                                            | Product/matchmaking follow-up.                                         |

## Clarification questions

1. R3 / `mg_t6IuvJ8n_vDk-Am2Uw3y`: which turn and step contains the Desperate Plan discard prompt that failed?
2. R11 / `mgn4SfO0SUd_l2oKcNTOMPx`: which characters were killed, and which opponent card/action caused it?
3. R18 / `mg_3n29Jqzk9tLTp8cGCY2O`: which Toy character was in discard when Hand-in-the-Box should have entered for free?
4. R20 / `game-1778815392703-3fyhomrjc`: can support provide the persisted admin replay id or replay URL? The supplied id was not found.

## Verification

- `pnpm nx run @tcg/lorcana-engine:test -- src/runtime-moves/resolution/action-effects/selection-context.test.ts` passed.
- `pnpm nx run @tcg/lorcana-engine:check-types` passed.
- `pnpm nx run @tcg/lorcana-cards:test -- src/cards/004/characters/070-diablo-devoted-herald.test.ts src/cards/007/characters/064-mother-gothel-vain-sorceress.test.ts src/cards/007/characters/159-belle-apprentice-inventor.test.ts src/cards/010/actions/162-promising-lead.test.ts src/cards/012/characters/048-violet-parr-learning-new-powers.test.ts src/cards/012/characters/060-luisa-madrigal-confident-climber.test.ts` passed.
- `git diff --check` passed.
