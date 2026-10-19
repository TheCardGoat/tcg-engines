# Alpha Clash practice interaction audit

Browser check: 11 October 2026. Clarity Hyper Aggro versus Absence Makati,
`meta-v1`, seed `42`, human first. The native match ended on turn 9 with a
human win: 10 health versus 0. No state injection or forced result was used.

## Observed actions

Counts start with the board ready for the action. They exclude reading cards,
opening the match menu, bot actions, and subsequent card effects.

| Action | Original path | Shortcut at the audit | Proposed reduction |
| --- | --- | --- | --- |
| Deploy a resource | Inspect card, Deploy: 2 clicks | Drag to Resource: one gesture | Offer a visible Deploy action on the active hand card. Keep inspection available. |
| Play a one-cost Clash | Inspect, Play, pay: 3 clicks with manual payment | Auto-pay in the match menu removes payment: 2 clicks. Drag starts play. | Put Auto-pay beside payment controls. Consider a quick Play button on the active hand card. Keep manual payment when the resource choice matters. |
| Start an attack | Start Clash, attacker, target: 3 clicks | Drag attacker onto a legal target: one gesture, verified | Expose a clear Attack action on the active card. Selecting the attacker should go directly to target selection. |
| Choose one obstructor | Choose obstructors, select card, Confirm: 3 clicks | No obstruction takes one click | Highlight legal obstructors when this step starts. Selecting a card can open the draft: 2 clicks including Confirm. Retain confirmation for multiple obstructors. |
| Foretell two cards | Pick up first, destination, pick up second, destination, Confirm: 5 clicks | Drag destinations are available | Add Top and Bottom actions to each unplaced card: 3 clicks including Confirm. Keep ordering and final review. |
| Discard one card | Select the card: 1 click | Already submits on selection | Keep this path. |
| Recover one card from Oblivion | Select the card in the retrieval view: 1 click | The view opens for the native choice | Keep this path. |
| Optional effect | Use or Decline: 1 click | Already direct | Keep explicit choice. A prompt can still appear when the next effect has no targets. Check native eligibility before changing this. |

The existing Auto-pay setting was checked in a separate native practice
session. Playing LINN took two clicks and reached its Enter choice without
a payment click. The setting was restored after the check. Auto-pay does
not remove target selection or optional effects.

## Fixed during this audit

After Foretell, “Choose what happens to the revealed card” showed destination
buttons without the card name. The adapter now includes the visible revealed
card and its cost in the prompt. A native Clarity regression test checks the
prompt, choice owner, and transfer to Oblivion. The fix was also checked in
the completed browser match.

## Implemented payment, Play, Deploy, and Attack shortcuts

Automatic resource payment is now the default. The board shows the current
payment mode, and card inspection includes Automatic and Choose resources.
An explicit manual preference is saved.

A click or Enter on a playable hand card now starts its native Play action.
A simple card with automatic payment takes one click from the board. Required
targets, alternate costs, and effect choices still require the player's input.
Right-click or Shift+Enter opens inspection without playing. Cards & piles
provides inspection on touch screens. Cards without a legal Play action still
open inspection on a normal click.

During the Resource Step, a click or Enter on a legal hand card deploys it as
a ready resource and closes the step. Right-click and Shift+Enter still open
inspection, which retains the explicit Deploy as resource button. Native
candidate eligibility excludes Rivaled and duplicate Bound cards from the
direct Deploy action; clicking these cards opens inspection.

A click or Enter on a native-legal ready attacker starts target selection.
The board highlights only that attacker's legal targets. Clicking a target
submits the attack without another confirmation. Card labels distinguish
Attack with from Attack target, and the prompt states that the target click
submits. Right-click and Shift+Enter inspect either card without declaring
the attack. Closing inspection preserves the selected attacker; Cancel attack
leaves it ready. Native-action tests cover desktop, compact, Enter, target
eligibility, inspection, and cancel/retry.

To pay manually, choose Choose resources from the board payment control before
clicking a card, or choose it in inspection before Play. Desktop payment uses
board resource clicks; compact screens retain the resource picker and Pay cost.
Native-action tests and browser fixtures verify these paths separately from the
completed practice match above.

## Follow-up order

1. Complete: expose automatic payment beside card actions and on the board.
2. Complete: start obstruction selection when the obstruction step opens. Do not
   choose an obstructor for the player.
3. Complete: direct Foretell destination actions. Keep the full final order visible.
4. Direct hand Play, resource Deploy, and Attack are complete.
   Explicit inspection gestures must not spend resources or declare an attack.
5. Show the revealed card face and colored resource cost beside its decision.
   Clarity's bonus uses specific resource cost; total cost alone is not enough
   to assess that option.
6. Complete: replace raw result reasons with player-facing text.

Do not automatically select an attack target, spend an optional cost, change
card order, or submit a multi-card choice. These are player decisions.

## Evidence and limits

The simulator runs without platform services. Two live-reload updates from
other work reset early attempts. The completed attempt used a separate local
simulator on port 5194 with live reload disabled. It used the same checkout,
decks, heuristic, and native commands. The existing port 5193 service was
left running.

The public final log records LINN's attack reducing the opponent to 2 health,
then Colonel Edwards dealing the final 2 damage. The completed match covered
opening choices, resources, manual payment, an automatic payment check in a
separate session, card entry choices, counters, attacks, obstruction, Foretell,
combat buffs, recovery from Oblivion, and a terminal result.

This proves local practice. It does not prove hosted transport, authentication,
persistence, deployment, or all possible card interactions. The recommendations
above are an investigation result. The reveal prompt, payment control, direct
hand Play and Deploy, direct Attack, obstruction selection, Foretell destination
controls, and result labels are implemented. The revealed-card preview remains open.

After the fix, all 70 adapter tests passed, and its direct TypeScript check
passed. The two changed source files passed formatting and had no lint errors.
The adapter file has an existing unused `otherSeat` warning.

## Additional browser match and repairs, 11 October 2026

Clarity Hyper Aggro versus Absence Makati, `meta-v1`, seed `43`, human first.
The completed native match ended on turn 7: human 16 health, bot 0. No state
injection, bot takeover of the human seat, or forced result was used. The public
log records LINN dealing 4 damage to leave 2 health, then Colonel Edwards
dealing the final 2. The run covered opening, direct resources and automatic
payment, obstruction prompts, attacks, Foretell, reveal destinations, Denver's
draw/discard, and Colonel's weapon attachment.

The first attempt on the current port 5193 server reset at turn 5 after a live
reload. The completed run reused the existing port 5194 server from the same
checkout, with live reload disabled. Neither server was restarted.

### Input cost verified in this run

| Action | Current input cost | Remaining opportunity |
| --- | --- | --- |
| Deploy an eligible hand card | 1 click | Complete; inspection stays on right-click or Shift+Enter. |
| Play a simple card with automatic payment | 1 click | Targets and optional effects remain explicit. |
| Attack | 2 clicks: attacker, target | Already direct. Keep the explicit target; a drag is optional. |
| Choose obstructors | Selection opens automatically; each card plus Confirm | Retain review for multiple obstructors. No obstruction takes 1 click. |
| Foretell two cards | **3 clicks**, previously 5 | New per-card Top and Bottom buttons; each placement appends in visible order. Reorder and drag remain available. |
| Discard one card | 1 click | Already direct. |
| Optional effect | 1 click | LINN still offers its Bounty effect with no opposing Clash. Investigate native eligibility before removing that choice. |
| Colonel's free weapon attachment | 3 clicks: Use, weapon, friendly Clash | A combined weapon/recipient draft could make the sequence clearer. Both objects still need player selection. |
| Clarity reveal destination | 1 click | Add the revealed card face and colored cost so the bonus can be assessed without another inspection. |

### Repairs and checks

- Added direct destination buttons to the existing ordered-card control. They
  reuse the same legal candidate, capacity, lock, and placement path as drag
  and keyboard selection. They clear any prior pickup and do not submit the
  native choice until Confirm.
- Kept Confirm visible while the card area scrolls. Checked desktop 1280×720
  and phone landscape 844×390. Corrected the short-height source-image selector
  and spacing so the destination buttons do not overlap or sit behind Confirm.
  Phone portrait retains the existing request to turn to landscape.
- Replaced the raw completion codes with Contender defeated, Deck empty,
  Conceded, or Match complete.
- On port 5193, activated Clarity from a legal pre-action fixture, placed three
  cards with direct controls, changed the order, then confirmed the native draw.
  In the draw-step fixture, ended Player 2's turn, accepted Clarity's trigger,
  placed Sonoro on Top and Magnate on Bottom, then confirmed: 3 clicks after
  the prompt opened, deck 40→39, hand 2→3, Sonoro in hand.
- A native attack in `finish-lethal` verified the repaired result label.
- Focused simulator suites passed: 52 tests for ordered controls, native
  interactions, and obstruction selection; 27 tests for ordered controls and
  prompt/tray consumers (the 5 ordered-control tests overlap). Presentation
  placement tests passed (6), and the presentation package type check passed.
  Changed TypeScript files passed lint. No platform services or hosted flows
  were tested.

These findings come from one additional seeded match and focused fixtures.
They do not establish full catalog or rules coverage. No engine defect was
confirmed in this run; the optional-effect eligibility and reveal-preview
items above remain investigation or UI follow-up work.

## Full shortcut check and mulligan repair, 11 October 2026

Played another complete native practice match: Clarity Hyper Aggro versus
Absence Makati, `meta-v1`, seed `42`, human first. Selected four opening cards
for replacement. The match ended on turn 9 with a human win, 8 health versus
0. The visible event log records Haven leaving the opponent at 2 health,
then Colonel Edwards dealing the final 2 damage. No state injection, bot
takeover of the human seat, forced result, or platform services were used.

| Observed interaction | Inputs from the ready board | Finding |
| --- | --- | --- |
| Resource deployment | 1 card click | Works through the native action. |
| Simple Play with automatic payment | 1 card click | Payment adds no click; Enter effects remain separate. |
| Attack | 2 clicks: attacker, target | No extra confirmation; subsequent combat decisions remain explicit. |
| No obstruction | 1 click | Direct pass; no card is selected for the player. |
| Foretell two cards | 3 clicks: destination, destination, Confirm | Required order review remains. |
| Revealed-card destination | 1 click | Card face and colored cost still need clearer display. |
| Denver | Play, Use, discard card: 3 clicks | Each input changes a distinct native choice. |
| Restoration | Play, target, Use, recovery card: 4 clicks | Recovery is one click. Simultaneous ordering and the recovered card's Enter effect add separate choices. |
| Bombardment | Play, target, amount entry, Confirm | Small bounded amounts could use quicker direct options. |
| Opening replacement before repair | Select cards, Take mulligan, Replace selected cards | Two buttons commit the same selected set. |

Fixed the opening replacement path. After selecting cards, one Replace selected
cards button now declares the mulligan and queues that exact replacement set.
The controller waits for the authoritative native mulligan action, then sends
the selection once. It preserves the native declaration order, hand privacy,
retained cards, and replacement animation. Rejection permits retry; resync,
seat change, and cancellation clear the queued selection. The no-selection
Keep hand path remains available.

The complete match above ran before this opening-only repair. A fresh native
practice opening and focused controller/UI tests verify the repaired path
separately. This is local simulator evidence, not a hosted-match check.

Focused validation passed: 26 checks across the opening controller, live-page
opening boundary, and board interaction tests. Changed TypeScript files passed
format, lint, and type checks. The broad simulator suite was not run.

## Direct amount choices, 11 October 2026

The shared compact prompt now renders finite whole-number ranges with at most
six legal values as buttons. Each button submits its amount through the native
draft and validation flow. Zero is explicit; no amount is chosen on mount.
Larger, fractional, or unbounded ranges retain the number input and Confirm
amount button. Paused choices remain disabled; rejected choices permit retry
without automatic resubmission.

Added `/alpha-clash/simulator/tests/prompt-bombardment` to the existing native
fixture catalog. It starts with an unplayed Bombardment, a legal resource, and
an opposing Sonoro. Browser checks used card click, target click, then amount
click. Choosing 3 reduced the deck from 48 to 45 and sent Sonoro to Oblivion.
Choosing 0 kept the deck at 48 and Sonoro in the Clash zone. Both choices
dismissed the amount prompt without a separate confirmation. The four amount
buttons fit at 1280 × 720 and 844 × 390.

Focused checks cover direct submission, legal range and step, the six-value
limit, input fallback, locking, rejection, cancellation, and native Bombardment
resolution at zero and three. This is local native-fixture evidence; no new full
practice match or hosted match was run for this amount-only change.

## Full match with amount buttons and pile-choice repair, 11 October 2026

Played another complete native practice match with Clarity Hyper Aggro versus
Absence Makati, `meta-v1`, seed `42`, human first. The match ended on turn 9
with a human win, 6 health versus 0. LINN dealt the final damage. Resources
and playable hand cards used one click; attacks used attacker then target.
Bombardment used card, target, then amount 3, with no amount confirmation.
The deck went from 41 to 38 and Morac went to Oblivion.

Two Clarity Challenge choices exposed a blocking interaction. The board asked
for a highlighted card, but the legal cards were in Oblivion. Opening Cards &
piles and choosing a card only changed the draft. Closing that view remounted
the compact prompt, which correctly avoids submitting preserved drafts on
mount, but its confirmation was hidden. Both choices needed the Match panel's
native Confirm action to continue. The match used no state injection, forced
result, or bot takeover of the human seat.

Required single-card choices whose legal targets all live in piles now open
the existing search/retrieve picker directly. The picker shows native
candidates and the destination. One card click submits through the existing
draft handler. This removes the pile-opening and confirmation steps without
changing automatic submission on prompt mount.

Inspecting a legal attack target also needed an extra close-inspection step.
Its inspection now offers **Attack this target** while an attack is being
selected. Right-click and Shift+Enter still inspect without submitting.

Added `/alpha-clash/simulator/tests/prompt-oblivion-return`, which starts
before Clarity attacks. Browser checks drove the attack, Foretell, revealed
card choice, and Challenge through the native engine. Only Sonoro and Magnate
were offered; Bombardment in Oblivion was excluded. One Magnate click changed
the deck from 46 to 47, Oblivion from 3 to 2, and recorded that Magnate was
put on top of its owner's deck. Minimize and restore preserved the choice.
The picker fit at 1280 × 720 and 844 × 390; a compact-view Sonoro click also
completed the return. The attack-inspection action was exercised with both
right-click and Shift+Enter in `arena-drop-targets`, including keyboard
submission of the inspection button.

The full match ran before these repairs and needed the two workarounds above.
Focused native fixtures verify the repaired paths separately. All 72 board
interaction and fixture checks passed. Format, lint, and type checks passed
for the five changed source files. This is local simulator evidence;
hosted matches and the broad simulator suite were not checked.
