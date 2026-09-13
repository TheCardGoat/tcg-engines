# CR Chapter 4 — Game Structure coverage ledger

This ledger tracks every numbered rule in CR 4.0–4.5. A row is `PROVEN` only
when a behavioral test exercises the public engine surface and asserts a
player-visible result. `COVERED ELSEWHERE` points to specialized behavioral
evidence. `DEFERRED` is a genuine engine or acceptance-proof gap. `OUT OF
SCOPE` is outside the two-seat, single-game simulator product boundary.

The canonical rule text is the repository FAB rules skill's Chapter 4
reference. Test names below are stable evidence identifiers; paths are relative
to `packages/engine/src`.

## 4.0 General structure

| CR     | Status            | Evidence or gap                                                                                                                                                                                      |
| ------ | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.0.1  | PROVEN            | `engine.test.ts` — “seats both players, draws opening hands, and gives the first player priority”; `04-game-structure.test.ts` — the life-zero and concede cases expose a completed game and winner. |
| 4.0.2  | OUT OF SCOPE      | A match series and between-game deck continuity are tournament/platform policy; this engine instance models one game.                                                                                |
| 4.0.3  | PROVEN            | `04-game-structure.test.ts` — “4.3.2: action phase grants the turn player 1 action point” and the end-turn cases expose ordered turn phases.                                                         |
| 4.0.3a | PROVEN            | The same Chapter 4 action/end-turn cases traverse Start, Action, then End before the next Start Phase.                                                                                               |
| 4.0.3b | PROVEN            | `04-game-structure.test.ts` — “4.3: non-turn player cannot end the turn” rejects the non-turn seat through legal commands.                                                                           |
| 4.0.3c | COVERED ELSEWHERE | `rules/docs/comprehensive-rules/06-effects.test.ts` — “6 take-extra-turn: queued extra turn keeps the same active seat.”                                                                             |

## 4.1 Start-of-game procedure

| CR     | Status            | Evidence or gap                                                                                                                                                               |
| ------ | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.1.1  | DEFERRED          | Initialization is atomic, but there is no acceptance proof that priority is unavailable throughout every start-of-game substep.                                               |
| 4.1.2  | PROVEN            | `engine.test.ts` — “seats both players, draws opening hands, and gives the first player priority” asserts both heroes are seated.                                             |
| 4.1.2a | COVERED ELSEWHERE | Start-of-game zone/ownership modifiers are exercised by shared-library Yorick behavior and start-game meta-static fixtures.                                                   |
| 4.1.3  | OUT OF SCOPE      | The engine accepts `firstPlayerId`; random selection and previous-game loser choice belong to match setup/UI and are explicitly outside this change.                          |
| 4.1.4  | COVERED ELSEWHERE | `pregame.test.ts` — “classifies single-list arena cards and defaults to saved main deck cards.”                                                                               |
| 4.1.4a | COVERED ELSEWHERE | `pregame.test.ts` — legal equipment loadout cases and “rejects duplicate body use, 2H combinations, and arena cards in the deck.”                                             |
| 4.1.4b | DEFERRED          | Opponent-hidden, face-down arena selection during an interactive pregame procedure lacks an end-to-end engine proof.                                                          |
| 4.1.5  | COVERED ELSEWHERE | `pregame.test.ts` — saved-main reconciliation and official deck/pool validation cases.                                                                                        |
| 4.1.5a | COVERED ELSEWHERE | `pregame.test.ts` — “rejects duplicate body use, 2H combinations, and arena cards in the deck.”                                                                               |
| 4.1.5b | COVERED ELSEWHERE | Meta-static starting-zone selections are represented by fixture `startOfGameCards`; specialized hero acceptance tests exercise the resulting zones.                           |
| 4.1.6  | COVERED ELSEWHERE | `pregame.test.ts` — “reconciles from current choices and fills from saved main before inventory.”                                                                             |
| 4.1.6a | COVERED ELSEWHERE | `game/zones.ts` models inventory as a private collection and not a public play zone; inventory acceptance tests use it as such.                                               |
| 4.1.6b | COVERED ELSEWHERE | `engine.test.ts` — “hides an opponent's private zones but exposes public ones”; inventory uses the same private projection contract.                                          |
| 4.1.6c | DEFERRED          | Removing illegal residual card-pool cards from the game has validation coverage but no player-visible start-procedure acceptance proof.                                       |
| 4.1.7  | OUT OF SCOPE      | Physical presentation to an opponent for shuffle/cut is not a simulator action. Engine shuffle behavior remains in scope below.                                               |
| 4.1.7a | COVERED ELSEWHERE | `engine.test.ts` — “shuffles deterministically from the seed”; seated deck selection is immutable after initialization.                                                       |
| 4.1.7b | COVERED ELSEWHERE | `engine.test.ts` — “hides the deck order from its owner and keeps own hand visible.”                                                                                          |
| 4.1.8  | COVERED ELSEWHERE | `pregame.test.ts` equipment seating cases plus equip-trigger bootstrap acceptance exercise authoritative equipment zones and start-game equip observations.                   |
| 4.1.8a | DEFERRED          | Multiple simultaneous start-of-game trigger ordering by the first-turn player lacks a dedicated public-choice acceptance test.                                                |
| 4.1.8b | DEFERRED          | Turn-only triggers being suppressed during start-of-game lacks a dedicated behavioral boundary test.                                                                          |
| 4.1.9  | PROVEN            | `engine.test.ts` — “seats both players, draws opening hands, and gives the first player priority” asserts both hands equal their heroes' intellect and the first seat begins. |

## 4.2 Start Phase

| CR    | Status            | Evidence or gap                                                                                                                                                                                                                                                      |
| ----- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.2.1 | DEFERRED          | Start Phase is automatic, but no dedicated public test proves that neither player receives priority inside it.                                                                                                                                                       |
| 4.2.2 | COVERED ELSEWHERE | `rules/end-turn-procedure.test.ts` — “holds the turn transition at an end-phase triggered layer before granting next-turn priority” proves trigger settlement precedes next-turn priority. Start-of-turn duration/event details need their specialized effect tests. |
| 4.2.3 | PROVEN            | `04-game-structure.test.ts` — “4.3.2: action phase grants the turn player 1 action point” observes the automatic transition into Action Phase.                                                                                                                       |

## 4.3 Action Phase

| CR     | Status            | Evidence or gap                                                                                                                         |
| ------ | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 4.3.1  | COVERED ELSEWHERE | Beginning-of-action-phase event and trigger settlement are exercised by specialized trigger/card acceptance tests.                      |
| 4.3.2  | PROVEN            | `04-game-structure.test.ts` — “4.3.2: action phase grants the turn player 1 action point” asserts exactly 1 AP.                         |
| 4.3.2a | DEFERRED          | A boundary test proving the rule-granted AP does not create gain-AP triggers is missing.                                                |
| 4.3.2b | DEFERRED          | A boundary test proving replacement effects cannot replace the rule-granted AP is missing.                                              |
| 4.3.3  | PROVEN            | `engine.test.ts` — “seats both players, draws opening hands, and gives the first player priority” exposes priority on the active seat.  |
| 4.3.4  | PROVEN            | Chapter 4 end-turn cases use the public `end-turn` legal command only after an empty stack/closed chain; the non-turn case is rejected. |

## 4.4 End Phase

| CR     | Status            | Evidence or gap                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.4.1  | DEFERRED          | The phase is procedural, but a dedicated boundary test that no player receives priority between its automatic steps is missing.                                                                                                                                                                                                                                                                                           |
| 4.4.2  | COVERED ELSEWHERE | `rules/end-turn-procedure.test.ts` — “holds the turn transition at an end-phase triggered layer before granting next-turn priority.”                                                                                                                                                                                                                                                                                      |
| 4.4.3  | PROVEN            | `04-game-structure.test.ts` — “4.4.3 / 4.4.3f: both players' draw events update history and trigger before turn advance” proves a procedure step settles triggers before 4.4.4.                                                                                                                                                                                                                                           |
| 4.4.3a | COVERED ELSEWHERE | `acceptance/rules/ally-contract.test.ts` — “8.2.8b: end phase resets combat damage on an ally to its base life.”                                                                                                                                                                                                                                                                                                          |
| 4.4.3b | COVERED ELSEWHERE | `acceptance/rules/end-turn-arsenal-choice.test.ts` proves choose, decline, occupied-zone skip, face-down placement, and both turn-1 refills.                                                                                                                                                                                                                                                                              |
| 4.4.3c | PROVEN            | `04-game-structure.test.ts` proves one-card bottoming and a persisted private multi-card ordering decision.                                                                                                                                                                                                                                                                                                               |
| 4.4.3d | DEFERRED          | End-phase untap exists in the procedure but lacks a focused player-visible Chapter 4 acceptance test.                                                                                                                                                                                                                                                                                                                     |
| 4.4.3e | PROVEN            | `04-game-structure.test.ts` — “4.4.3e: resource points are lost at end of turn” and “4.4.3e/f” assert AP/RP cleanup.                                                                                                                                                                                                                                                                                                      |
| 4.4.3f | PROVEN            | `04-game-structure.test.ts` proves real attack/defend turn 1 refill, later-turn exclusion, at/above intellect, per-seat intellect, short/empty decks without deck-out, shared-library uniqueness/order, and correctly attributed draw history/triggers. Persisted Arsenal/pitch-order tests prove resume equivalence; adapter and practice integration tests prove privacy-safe projections and the rendered hand refill. |
| 4.4.4  | PROVEN            | Chapter 4 turn-1/turn-2 cases assert the next seat and turn number; `rules/end-turn-procedure.test.ts` proves this-turn intellect expires only after its final draw. Extra-turn ordering is covered by the CR 6 test above.                                                                                                                                                                                               |

## 4.5 Winning, losing, and draws

| CR     | Status       | Evidence or gap                                                                                                                                                      |
| ------ | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.5.1  | PROVEN       | `04-game-structure.test.ts` life-zero and concede cases expose an immediate game-over result and winner.                                                             |
| 4.5.1a | OUT OF SCOPE | Product scope is exactly two seated players, so one player's loss always ends the game; removing a defeated seat from a continuing multiplayer game is not required. |
| 4.5.2  | PROVEN       | The same life-zero and concede cases assert the remaining opponent as winner.                                                                                        |
| 4.5.2a | PROVEN       | `04-game-structure.test.ts` — both loss cases assert the only remaining opponent wins.                                                                               |
| 4.5.2b | DEFERRED     | The effect vocabulary has no dedicated public acceptance test for “you win the game.”                                                                                |
| 4.5.3  | PROVEN       | The numbered life-zero and concede loss modes are both exercised through the public engine surface.                                                                  |
| 4.5.3a | PROVEN       | `04-game-structure.test.ts` — “4.5.3a: reducing hero life to 0 loses the game.” The no-hero branch remains a separate gap.                                           |
| 4.5.3b | DEFERRED     | The effect vocabulary has no dedicated public acceptance test for “you lose the game.”                                                                               |
| 4.5.3c | PROVEN       | `04-game-structure.test.ts` — “4.5.3c: concede loses the game for that player.”                                                                                      |
| 4.5.4  | DEFERRED     | No generic public game-draw result is proven.                                                                                                                        |
| 4.5.4a | DEFERRED     | Simultaneous zero-life draw is not covered by a public behavioral test.                                                                                              |
| 4.5.4b | DEFERRED     | “The game is a draw” effect support is not proven.                                                                                                                   |
| 4.5.4c | OUT OF SCOPE | Intentional-draw agreement is tournament/platform policy, not an in-game simulator command.                                                                          |
| 4.5.4d | DEFERRED     | Stalemate detection is not implemented or proven.                                                                                                                    |
| 4.5.4e | OUT OF SCOPE | Detecting all players' refusal to advance is tournament policy, not deterministic engine state.                                                                      |

## Gaps discovered by this audit

- Start-of-game remains mostly an atomic initializer; it needs public procedure
  tests for priority suppression, private selection, and simultaneous trigger
  ordering before those clauses can become `PROVEN`.
- The rule-granted Action Phase AP needs explicit non-trigger and
  non-replacement boundary tests (4.3.2a–b).
- End-phase priority suppression and permanent untap need focused public tests
  (4.4.1 and 4.4.3d).
- Effect-driven win/loss and all deterministic draw modes lack a unified public
  result contract (4.5.2b, 4.5.3b, and 4.5.4).
