# Native Foretell ordering

- `/alpha-clash/simulator/tests/prompt-foretell-draw-step`: Clarity, Ageless
  Defender's accepted draw-step trigger. Put the two permitted cards in Top and
  Bottom, order each group, then confirm. The native Expansion draw follows
  resolution.
- `/alpha-clash/simulator/tests/prompt-foretell`: the same real card's activated
  ability at ten health. Only Top is permitted; three cards are ordered before
  the native draw.

Rule 703.19a.1a permits Foretell cards on top and/or bottom in any order.
Clarity's activated text instead restricts the three cards to Top (101.1).
Source: [official v8.0 rulebook](https://alphaclashtcg.com/s/Alpha_Clash_TCG_Comprehensive-Rulebook-80.pdf).
The publisher's current How to Play link still targets v8.0 on 2026-10-08.

## Implementation

The fixture uses `AcTestEngine` with real catalog cards. The production R3F arena
uses a reusable ordered-group input and shared pointer/keyboard drag controls.
The adapter advertises the existing entity-partition protocol. One native
`resolveChoice` command carries `deckOrder`; the engine checks exact membership,
uniqueness, and permitted destinations, then resolves its existing sequential
choices on a copy. Failure leaves the original state unchanged. The native
continuation owns the next draw. Arrays are first-to-last in draw order:
Top, untouched deck, Bottom.

Only the choosing player's projection exposes looked-at card faces. Opponent and
spectator projections contain neither these faces nor the private pending choice.
Cancelling changes resets the local draft; it does not cancel the mandatory
resolution or repeat the accepted trigger. Escape cancels pickup or minimizes the
tray. Confirm remains disabled for incomplete groups.

## Validation — 2026-10-08

- 33 app tests: native fixtures, exact native draw order, private projections,
  wrong actor, duplicate/unknown/missing cards, stale repeat, top-only rejection,
  keyboard grouping, reorder, cancel/retry, disabled controls, shared prompts.
- 67 shared UI tests: partition completeness, draft lifecycle, existing resolution
  controls. 19 adapter regression tests. 57 existing Clarity, Envision, and
  Archaic Shield engine tests. Total: 176 passing focused tests.
- Shared UI and presentation TypeScript checks pass. App and adapter checks remain
  blocked by pre-existing errors, including the `effect.prompt` union in native
  `effects.ts:1934`; the app also has unrelated Cyberpunk and linked-package errors.
  No type errors remain in the new or changed code. Scoped lint has no errors;
  warnings are on unchanged imports/constants and the existing arena number label.
- In-app browser, isolated port 5198: pointer drops into groups and insertion
  markers; invalid outside drop keeps the draft; incomplete Confirm disabled;
  cancel/retry; both Top and split groups; top-only has no Bottom destination.
  Magnate first in Top produced Magnate in hand, hand 2 → 3 and deck 8 → 7.
- Audio debug recorded one placement cue with sound on and no additional cue for
  muted placement. Reduced-motion setting disables pickup lift and tray fade.
- Inspected 1280×720, 390×844, and 844×390. The tray scrolls and keeps Confirm
  accessible. The board's portrait guard remains. QA follow-up keeps the canvas
  mounted across rotation; two portrait/landscape cycles produced no new context
  loss or fallback. Physical-device touch remains for human QA.
- Browser evidence: `/tmp/alpha-foretell-proof/split-order.jpg` and
  `/tmp/alpha-foretell-proof/native-draw.jpg`.

Integration requires the native engine, adapter, shared UI/presentation, and app
changes together. No protocol version change, platform service, developer overlay,
PR, merge, or deployment. Browser proof is local fixture proof, not a hosted match.

## Presentation direction

The ordered-card prompt now follows the useful MTG Arena scry pattern: temporarily
focus the decision over a dimmed battlefield, show the revealed cards at a large
readable scale, and make the destinations spatial rather than form-like. Bottom
is on the left and Top is on the right, matching the player's reading direction
from the deck toward the next draw. A single gold confirmation action appears
below the decision only after every card is assigned. The interaction model remains
the same controlled drag and keyboard flow, including insertion markers and
Earlier/Later controls.

Reference: [MTG Arena scry layout](https://draftsim.com/mtg-scry/), which shows
large revealed cards over the dimmed battlefield with Top and Bottom destinations
and one Done action.

## Human QA handoff

Status: ready for local human QA after the 2026-10-08 agent rerun. Use the dev
server at `http://127.0.0.1:5198`. Refresh between cases to reset the fixture.
The initial hand is Haven and Denver; hand count is 2 and deck count is 8.

1. Open `/alpha-clash/simulator/tests/prompt-foretell-draw-step`. Confirm order
   must be disabled while either card is unplaced. Drag outside the tray: no card
   moves, no draw occurs, and the order stays unchanged.
2. Put Sonoro in Top. The status must say one card still needs a group. Select
   Cancel changes. Both cards must return to Unplaced, with counts still 2/8.
3. Put Magnate in Top and Sonoro in Bottom, then confirm. The tray must close.
   Magnate must join the hand, hand count must be 3, and deck count must be 7.
4. Refresh. Put both cards in Top. Use an insertion marker or Earlier/Later to
   make Magnate position 1. Confirm: Magnate must be the new hand card.
5. Refresh. Put both cards in Bottom and reorder them. Confirm: the untouched
   next card, Haven, must be drawn. There must be two Havens in the hand.
6. Refresh. Use Tab and Enter to pick up cards and choose destinations. Escape
   must cancel pickup without changing the order. Minimize and Show choices
   must keep the draft. Confirm must require every card exactly once.
7. Open `/alpha-clash/simulator/tests/prompt-foretell`. Only Top must
   be available. Put all three cards in Top and move Haven to position 1.
   Confirm: a second Haven joins the hand, hand 3, deck 7.
8. Minimize the tray, open Match, and test Sound and Reduced motion. With Sound
   off, placement must be silent. Reduced motion must remove pickup lift and
   tray fade. Reopen choices; the order must still be present.
9. Test desktop, narrow portrait, and short landscape. Scroll to every card and
   control. Rotate twice with a partial draft: no WebGL fallback, no lost draft,
   no draw until confirmation. Repeat on a real touch device when available.

Record browser/device, fixture URL, steps, expected/actual results, and a
screenshot for each failure. Do not approve hosted-match privacy from these
single-view fixtures: opponent/spectator privacy is covered by native projection
tests; a hosted two-player check is a separate validation scope.

Agent rerun: 33 focused app tests pass; scoped lint has no errors (two existing
number-label warnings). Browser passed invalid drop, cancel/retry, keyboard,
split draw, all-Top and all-Bottom draw, Top-only reorder/draw, mute, reduced
motion, draft retention, and two rotation cycles.
Fixed misleading incomplete status and rotation canvas disposal. Evidence:
`/tmp/alpha-foretell-proof/qa-split.jpg`, `/tmp/alpha-foretell-proof/qa-draw.jpg`.
