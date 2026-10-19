# Alpha Clash inspection and hand arrangement QA

## Handoff status

Ready for human QA of the local fixture. Automated and in-app browser QA ran
on 8 October 2026. One confirmed defect was fixed: portrait rotation left
inspection and play controls active after the 3D card disappeared. Portrait
now hides the controls; landscape restores inspection and the hand position.
A regression test covers this case.

The board interaction pass also fixed two defects: normal hand clicks did
not inspect, and the Clash drop target blocked clicks on cards underneath it.
Hand clicks and Enter now inspect directly. Clicking Oblivion opens ordered
inspection directly. Drop targets allow clicks through to board cards.

Local URL: http://localhost:5206/alpha-clash/simulator/tests/inspection-arrangement

The local server belongs to the isolated `codex/alpha-inspection` worktree.
The fixture uses real cards, the native Alpha Clash test engine, and the same
React Three Fiber board as practice and live matches. This pass does not
establish hosted-match or deployment behavior.

## Run the human pass

Use Reset before starting. Allow the board and artwork to load. Record your
browser, device, viewport, commit, and any failure screenshot.

| Step | Action | Expected result |
| --- | --- | --- |
| 1. Baseline | Open the fixture and press Reset. | Your health is 26; opponent health is 23. Your hand has 12 cards. Deck counts are 30 and 29. Turn 5 is in Primary. |
| 2. Board inspection | Click a face-up board card. Close with Escape. Reopen it and use Return to board. | The real card lifts into the inspection plane. Both close methods return to the board. Counts and turn stay the same. |
| 3. Pile order | Click Your Oblivion on the board. Use Next card through all seven cards, then Previous card back to the first. Close and reopen the pile. | The first card is Magnate, Cunning Planner; the last is Magnate, Unwavering might. End buttons disable at the first/last card. The pile order and count stay the same. |
| 4. Local hand order | Click the first Sonoro in your hand. Use Move right from position 1 to position 12, then Move left back to position 1. | Position changes once per activation. The board follows across both hand pages. End buttons disable. All 12 cards remain. |
| 5. Cancel and retry | Move a hand card once, press Escape, click the card on the board again. | Inspection closes. The local order stays as arranged until Reset/reload. Reopening works. No game action is submitted by inspection or arrangement. |
| 6. Hidden information | Open Opponent's hand, Opponent's accessories, and each deck. | Opponent hidden cards show backs and disabled inspection controls. Decks show no card identities or order. Your own set card can be inspected. |
| 7. Keyboard | Use Tab/Shift+Tab to reach controls; use Enter/Space to inspect, move, or browse; use Escape to close. | Focus is visible. Inspection controls can be operated without a mouse. Actions execute once. |
| 8. Sound and motion | In Match, turn Sound off and Reduced motion on. Inspect and arrange again. Repeat with Sound on. | Mute suppresses cues. Reduced motion keeps the final card/hand state without the normal movement. With sound on, cues are short and have no repeated or overlapping noise. |
| 9. Rotation | At landscape phone size, inspect a hand card and change its position. Rotate to portrait, then back to landscape. | Portrait shows only the rotation message, with no inspection/play controls. Landscape restores the same inspected card and position. |
| 10. Normal play | Reset. Drag the first hand Sonoro outside the play zone, then into your Clash Zone. Use Pass for both response steps. | The rejected drop returns without inspection or a command. The legal drop changes hand 12 → 11, resources 4 → 3 ready, then Clash count 8 → 9 after resolution. |
| 11. Board targets | Reset. Press Clash, click Sonoro in your Clash Zone, then click the opponent contender Torque. | Board clicks select the attacker and target, then open the native Counter response. No More or choice list is needed. Cancel before the second choice to test retry. |
| 12. Real touch | On a physical device that can access this build, tap a hand card directly on the board, move it, browse a pile, close inspection, and rotate. | Taps execute once. No accidental drag or play occurs. Controls remain reachable and readable. |

`Play`, `Clash`, `End turn`, and native action controls run the engine and can
change state immediately. They are outside the inspection-only baseline.
Reset restores the fixture and clears local arrangement. A phone's `localhost`
refers to the phone; physical-device QA needs a reachable URL for this build.

## Agent validation completed

- All seven Oblivion cards were browsed; reopening preserved their order.
- The first hand card moved through all 12 positions and both pages using
  keyboard activation. First/last movement boundaries were checked.
- Direct left-click hand and Clash-card inspection, Enter, direct Oblivion
  inspection, close, Escape, reopening, hidden hand
  card backs, hidden decks, mute/reduced-motion controls, and landscape layout
  were checked in the in-app browser.
- Portrait rotation was reproduced before the fix and checked after the fix,
  including restored inspection and working movement/close controls.
- Rejected drops kept the baseline intact. Legal Sonoro drops spent one
  resource and resolved into the Clash Zone after both Pass actions. Dragging
  did not open inspection. This was repeated after the click-through fix.
- Clash attacker and contender target were selected directly on the board
  and started the native Counter response without opening More.
- 27 focused fixture/component tests and 5 shared inspection tests passed.
  Native-state and legal-action invariance is covered by focused tests.
- The browser error log was empty on the completed pass.

Physical touch and audible sound quality require human validation. The in-app
browser does not support synthetic touch events. The full app type check is
not clean: errors remain outside the changed files, including engine and other
game files. No type error was reported in the changed inspection files.

Human result: record PASS/FAIL for each row. For a failure, include the exact
step, expected and actual behavior, device/browser, and a screenshot. Treat
hidden-card exposure, changed pile order, or an unintended game action as a
blocking failure.
