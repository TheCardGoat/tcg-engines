# Alpha Clash search and retrieve

Built from `9fafe2b855` on `codex/alpha-search-retrieve`.

Native choices supply the permitted cards. The shared interaction draft collects a
card and confirms the native destination on the production R3F board. The server
validates both inputs before it runs the native command. Cancel selection clears
the draft; it does not cancel an ability already resolving. A restricted search
also offers the native Find no card option.

## Visual direction

The card picker now follows the interaction pattern used by MTG Arena's in-match
choice screens: keep the battlefield visible under a dark focus layer, put the
eligible cards in the center at readable size, show the resolving card at the
side, and use one short instruction with a clear action rail. Alpha Clash uses
cyan eligibility rims and gold game-room controls. `View battlefield` closes the
picker without changing the native draft. The real board destination remains a
separate step after card selection.

Identical cards in fungible piles (deck, Oblivion, resources) collapse into one
tile with a ×N count in every TargetModal — the search picker, the retrieval
picker, and the pile inspectors. Section headers show the copy total when stacks
collapse. Choosing a tile submits the first copy; the copies are interchangeable.

A single-card pick with one forced destination completes the interaction in one
click: the picker exits, the engine resolves, and the chosen card flies to its
zone. Multi-card picks submit after the last required selection; genuinely
multi-destination placements still show the placement step.

Picking a card plays a staged exit: the unpicked stacks fly back to their pile,
flipping face-down mid-flight, the resolving card returns to its current board
spot (its live anchor, so it merges back into play or into the pile it sits in),
and the chosen card travels to its destination zone last, every clone landing at its destination's real footprint
(exact board-card size for the resolving card, pile-card size for returns, the
placement ghost's size for the chosen card). When the resolution
shuffles — the cue keys on the resolving card's native shuffleDeck effect, so
empty searches shuffle too while retrievals stay silent — the deck pile jitters
a stack of card backs. The flights are skipped under reduced motion.

Between the pick and the placement the chosen card waits as a dashed,
translucent ghost in the target zone (the engine has not moved anything yet —
deck and hand counts only change once the destination is confirmed). Return
flights shrink into their pile instead of fading early.

Only the acting player can see the offered deck cards while the choice is pending.
The deck inspector stays hidden. Opponent hand identities stay hidden. Public
Oblivion cards remain available for inspection. A confirmed transfer flies the
revealed card from its old pile to its new zone (TransferFlights on the arena),
with one card-move cue; Match controls provide mute and reduced motion, and the
flight is skipped entirely under reduced motion.

## Native fixtures

The existing `/alpha-clash/simulator/tests` index includes realistic pile sizes:

- `/alpha-clash/simulator/tests/search-deck`: Morac, the Devourer over a 30-card
  deck holding 18 legal Discarded Clash copies in 7 stacks (Lord Krung ×3, Gur ×3,
  Trugg ×3, Thragor ×3, Discarded Mob ×2, Cadavros ×2, Rizlac ×2) plus 12 other
  cards that must stay hidden; native reveal, hand transfer, and shuffle.
- `/alpha-clash/simulator/tests/search-empty`: the same ability over a 24-card
  deck with no legal card.
- `/alpha-clash/simulator/tests/retrieve-oblivion`: Weapon's Depot; Heavy Metal ×2
  in a five-card public Oblivion; native transfer to the Accessory Zone.
- `/alpha-clash/simulator/tests/retrieve-empty`: no Weapon in the player's Oblivion.

These use `AcTestEngine.fromFixture`, real card definitions, native play and choice
commands, and `AlphaClashServerEngine`. They do not simulate effect resolution.

## Validation — 2026-10-08

- Focused fixture, prompt, zone overlay, and visual-fixture tests: 38 passed.
- Adapter suite: 20 passed; two failures also reproduced on the starting commit
  (`discard-choices` has no expected choice; `oblivion-play` rejects Dread Titan).
- Full type checks remain blocked by existing errors, including the Alpha Clash
  effect prompt union and unrelated app consumers. No changed-file type errors
  appeared. Focused lint passed with two existing template-expression warnings.
- Browser: desktop 1280×720 and compact 844×390. Chose a legal card and its real
  board destination; cancel returned to choices without moving a card; then the
  same choice completed. Empty results resolved without a stuck prompt. Find no
  card preserved the hand and completed the native shuffle.
- Browser: opponent deck identities hidden; public opponent Oblivion cards visible.
  Retrieval placed Heavy Metal in the Accessory Zone. One WebAudio start occurred
  on the confirmed transfer. Muted reduced-motion retrieval completed with zero
  WebAudio starts. Automated tests reject illegal cards/destinations and accept a
  subsequent valid submission; browser retry after a server rejection was not forced.
- The in-app browser returned `ERR_BLOCKED_BY_CLIENT` for localhost. Browser checks
  used the Playwright CLI fallback. No hosted match or deployment was tested.

## Integration

The engine projection, Alpha Clash adapter, and Alpha Clash UI changes must land
together. They reuse the shared interaction, TargetModal, card-pose, and audio APIs
from the starting commit. No shared protocol change or new service is required.
Destination confirmation currently covers native single-card retrieval choices
from the acting player's deck or Oblivion. Other choices retain the shared prompt.

For this checkout, the fixture server was started from the simulator app with:

```sh
GAME_SLUG=alpha-clash VITE_OPTIMIZE_DEPS_DISCOVERY=false vp dev --host 127.0.0.1 --port 5225 --strictPort
```

## Human QA handoff — 2026-10-08

Status: ready for local human QA. The committed build was tested again in the
Codex in-app browser. All 38 focused tests passed again. No new browser warning
or error was found. No product fix was needed during this second pass.

Open `http://127.0.0.1:5225/alpha-clash/simulator/tests` on this computer. The server
uses the isolated `codex/alpha-search-retrieve` checkout. No sign-in is needed.
Use a desktop window or phone landscape. Portrait shows Turn to landscape.
Use Reset before each new case. Reset restores the fixture and its settings.
Wait for artwork to load before judging animation or card appearance.

| Case                    | Steps                                                                                                                                                                                     | Pass condition                                                                                                                                                                                |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Search                  | Open `search-deck`. Check the picker: seven stacked tiles with ×N counts over a dimmed board. Click the Lord Krung ×3 tile once.                                                          | The search completes in that click: stacks return face-down to the deck, the deck shuffles, and the chosen card flies to the hand. Deck 30 to 29; hand 0 to 1; prompt closes.                  |
| Cancel and try again    | Reset `search-deck`. Open the picker, press Escape to view the battlefield, then Show choices. Pick a stack.                                                                              | Minimizing keeps the pending choice. The pick completes normally afterwards.                                                                                                                  |
| Find no card            | Reset `search-deck`, then Find no card. Open Match.                                                                                                                                       | Prompt closes; deck stays 30 and hand stays 0. Log says Alice shuffles their deck.                                                                                                            |
| Hidden and public piles | Complete a search. Click opponent deck, then opponent hand; close each inspector before opening the next. Open opponent Oblivion.                                                         | Deck and hand show no card identities and a hidden-information message. Public Oblivion shows Heavy Metal ×2, Sonoro, Torque, and Maxine as stacked tiles with counts.                        |
| Retrieve                | Open `retrieve-oblivion`. Click the Heavy Metal ×2 tile once.                                                                                                                             | One Heavy Metal tile with ×2. The retrieval completes in that click: the card flies from Oblivion to the Accessory Zone; accessories 0 to 1; Oblivion 5 to 4; prompt closes.                   |
| Empty search            | Open `search-empty`, choose Yes, then open Match.                                                                                                                                         | No false target or stuck prompt. Hand stays 0, deck stays 24. Log shows the native shuffle.                                                                                                   |
| Empty retrieval         | Open `retrieve-empty`, choose Yes.                                                                                                                                                        | No false target or stuck prompt. Accessories stay 0; own Oblivion stays 3.                                                                                                                    |
| Keyboard                | Reset a populated fixture. Use Tab and Enter to select a card and its marked destination. Use Escape to minimize choices, then Show choices to restore.                                   | The same native result occurs. Minimize does not move a card or lose the pending ability.                                                                                                     |
| Sound and motion        | Reset retrieval. Complete once with Sound on. Reset again; minimize choices, open Match, turn Sound off and Reduced motion on, close Match, select Show choices, then complete retrieval. | With sound on: one short card-transfer cue after audio unlock. With sound off: silence. Reduced motion completes placement without a long flight. No extra card moves.                        |
| Compact layout          | Repeat search and retrieval at 844×390 or on a phone in landscape.                                                                                                                        | Card choices can be selected, footer controls can be reached, and the destination can be selected without another control blocking it. Scroll the card list if needed.                        |

The second pass checked selection and placement with the keyboard, both private
inspectors, the public pile, native empty-result logs, Find no card, compact search,
and muted reduced-motion retrieval. Browser audio instrumentation was temporary
and was removed by reloading the fixture. This is local native-fixture proof.
Hosted multiplayer and physical-device audio quality still need their own QA.

When reporting a failure, include the fixture URL, viewport, steps, expected and
actual counts, a screenshot, and any browser-console error. Do not include private
player data. Illegal-card and illegal-destination rejection plus a valid retry are
covered by the focused protocol tests; do not alter browser state to force them.

## Validation — 2026-10-09 (stacking, counts, reveal flight)

- Focused fixture, prompt, zone overlay, and visual-fixture tests: 38 passed
  (search test now asserts 18 candidate copies, 3 Krung, 1 Find no card option).
- simulator-presentation typecheck clean; lint clean on changed files.
- Browser walkthrough on a headed renderer (real WebGL): stacked picker over the
  live battlefield, board placement, cancel, Find no card with shuffle log,
  retrieval to the Accessory Zone with only that zone marked, both empty
  fixtures, keyboard-only selection and placement, Escape minimize/restore, and
  compact 844×390.
