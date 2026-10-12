# Alpha Clash card destinations

These local fixtures use real catalog cards and native `AcTestEngine` actions. They render the production R3F board and submit through the shared interaction protocol. Open `/alpha-clash/simulator/tests` and select a destination fixture.

| Route suffix          | Card                    | Check                                                                                                                                 |
| --------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `destination-discard` | Denver                  | Select a hand card, cancel the selection, then confirm discard to Oblivion.                                                           |
| `destination-banish`  | Trugg, Unruly Scavenger | Banish a card from Oblivion; resolve the native recovery effect.                                                                      |
| `destination-return`  | Rebound                 | Play Rebound, select the engaged opposing Clash, confirm, then pass both response windows. Ready Clashes are not eligible.            |
| `destination-send`    | Death, Overseer         | Send a friendly Clash to Oblivion; resolve the native banish effect.                                                                  |
| `destination-select`  | Check out my Ramp       | Select a hand card for the Resource Zone.                                                                                             |
| `destination-reveal`  | Archaic Shield          | The top card has been revealed by the native effect. Done leaves it in the deck; selecting it sends it to Oblivion. Player 2 chooses. |

All routes start with `/alpha-clash/simulator/tests/`. Reset rebuilds the native setup. Match log includes public setup effects, including the reveal. Rule references: Alpha Clash Comprehensive Rules v8.0, 703.6 (send), 703.7 (discard), 703.8 (reveal), 703.12 (return), and 703.15 (banish).

The destination prompt follows the shared compact prompt convention: select a highlighted card on the board, then confirm with the named effect button. Cancel selection only clears the draft. Mandatory choices do not offer cancellation of the effect. Rejected commands retain the selection for retry. The adapter supplies destination wording; shared protocol and UI code contain no Alpha Clash rules.

Private candidates are projected only to the chooser. The other player receives the identity of the player who must choose, without the choice contents, and waits. Native select-card options expose only the exact inspected cards. Other hidden cards remain hidden.

## Validation

Focused tests cover legal destinations, illegal commands without mutation, cancellation and retry, reveal without movement, explicit reveal-to-Oblivion, and viewer privacy. Browser checks cover all six routes, pointer drag, keyboard pick/place, sound cues, and reduced motion at 844 × 390 as well as desktop layout. The in-app browser blocked the local URL, so these checks used the repository Playwright CLI fallback.

The practice board stays mounted when control changes seats. Rebound was repeated across both response windows with no browser console errors after this fix.

This is local engine and production-board proof. It does not verify hosted matches or deployment. Apply the complete commit after `9fafe2b855`; protocol, shared UI, Alpha Clash adapter, and engine projection changes belong together.

## Human QA handoff

Open `http://127.0.0.1:5214/alpha-clash/simulator/tests`. No sign-in is needed. Both players are controlled locally; the page switches to the player who must respond. Use Reset before repeating a case. These fixtures use a local engine and do not connect to a hosted match.

For each case, select a highlighted card on the board. Selection alone must not move the card. Confirm with the named effect button.

| Case         | Steps                                                                                                                                                                   | Expected result                                                                                                                            |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Discard      | Pick Rebound, place it in Oblivion, then Cancel selection. Select Rebound again and click Discard card.                                                                 | Cancel leaves hand 5 and Oblivion 2. Confirm changes hand to 4 and Oblivion to 3.                                                          |
| Banish       | Pick Magnate, Cunning Planner from the panel, place it in Banished Zone, then click Banish card.                                                                        | Your Banished Zone changes 0 to 1. Trugg's recovery changes hand 4 to 5 and Oblivion 2 to 0.                                               |
| Return       | Click Match, Play Rebound (2), then Close match actions. Select the opposing engaged Magnate and click Return to hand. Click Pass for each of the two response windows. | Only the engaged Magnate is eligible. Opponent Clash Zone changes 2 to 1 and hand 1 to 2. Rebound goes to your Oblivion.                   |
| Send         | Select your Sonoro and click Send to Oblivion.                                                                                                                          | Your Clash Zone changes 3 to 2 and Oblivion 2 to 3. Death also banishes the declared opposing card: opponent Banished Zone changes 0 to 1. |
| Resource     | Pick Rebound, place it in Resource Zone, then click Put into resource zone.                                                                                             | Your hand changes 3 to 2. Resources change 8 total to 9 total, with 7 ready. The resolved action also enters Oblivion.                     |
| Reveal, keep | Click Match and check the reveal log, then close it. Click Done, then Confirm choice.                                                                                   | The log names Magnate, Cunning Planner. Your deck stays at 3. Shield resolves into Oblivion; the revealed card stays in the deck.          |
| Reveal, send | Reset. Pick the revealed Magnate, place it in Oblivion, then click Send to Oblivion.                                                                                    | Your deck changes 3 to 2. Oblivion changes 1 to 3 because both Magnate and Shield enter it.                                                |

Repeat one case with keyboard input: Tab to a Select button on the board, press Enter, then confirm. Confirm that an ineligible card cannot be selected or submitted.

At 844 × 390, confirm that the card list scrolls and the confirmation buttons remain visible. At 390 × 844, only the rotation message should appear. Rotate back to landscape: the pending choice must still be available. Enable Reduced motion in Match settings, and repeat a choice. Disable Sound there and repeat: no sound should play. Re-enable Sound to check the movement cue. Hidden opposing hand cards must remain hidden.

Report a failure with the fixture URL, browser/device, steps, expected result, actual result, and a screenshot. Record whether Reset reproduces it.

### Agent QA, 2026-10-08

Re-ran all six fixtures in the Codex in-app browser, including both reveal branches, cancellation before discard, keyboard banish/resource selection, and both Rebound response windows. All resulting zone counts matched the table. No browser console errors occurred in these flows. Re-ran 42 focused native/shared interaction tests; all passed. These tests include illegal commands without state mutation, retry after rejection, and viewer privacy.

Found and fixed a portrait layout defect: the destination panel covered the rotation message. The panel now follows the board's existing portrait guard. Verified a clear rotation message at 390 × 844, restored the pending reveal choice at 844 × 390, then successfully sent the revealed card to Oblivion. Reduced motion was enabled during the resource/reveal checks.

Also fixed missing settings: Sound and Reduced motion were visible only in the opening fixture. They now appear in the Match drawer for destination fixtures. Muted discard produced no audio debug events; re-enabled sound produced a played event. Discard also completed with the visible Reduced motion setting enabled.

### Agent QA, 2026-10-09

Prompt fixtures now start before the player action, so the browser performs the play, activation, or clash itself. The interaction view exposes non-counter activated abilities (`activateAbility:*` actions) alongside the existing counter-ability actions. Verified on the production board via the Playwright CLI fallback (the in-app browser froze its portrait media query across tab reuse): prompt-optional end to end — Haven/Denver hand, Play Denver (1) from the inspection panel, both response passes, native accept prompt, two draws, discard destination control (board select, cancel, confirm to Oblivion); prompt-number — Mean-Streak activated from the Match drawer's Available actions, source/destination choices, amount 2 of 3, counters moved 3→1 and 0→2; destination-reveal — Done kept the revealed Magnate in the deck while the responding Shield resolved into Oblivion, matching the table above. 42 focused tests pass against the production protocol after rewiring the prompt-fixture tests to drive the same pre-action path.

The human pass can now focus on actual touch handling, audible sound, readability, and browser/device differences. Hosted-match verification remains a separate integration check.
