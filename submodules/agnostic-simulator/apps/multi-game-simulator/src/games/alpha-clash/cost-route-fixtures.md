# Native cost route fixtures

Start the multi-game simulator and open:

- `/alpha-clash/simulator/tests/prompt-cost-routes`: Shadowlight, Darkness Rising
  (`ac-ac2-014`), normal two-resource cost or return a white Shadowlight.
- `/alpha-clash/simulator/tests/prompt-additional-cost`: Chaotic Unmaking
  (`ac-ac7-186`), mandatory discard plus three resources.
- `/alpha-clash/simulator/tests/prompt-discount-cost`: Enter from Beyond
  (`ac-ac2-022`), Counter - Attack with two resources or optional discard plus one.

All cards, including deck filler, use the authored real-card registry. These are
rule-edge arrangements, not tournament decks. The native test harness arranges
the state. The production interaction adapter, shared draft, and R3F board own
all later play. The fixture does not mutate the board to simulate payment.

## Contract

`costRoute` is first, followed by independent `alternatePayment:N` requirements,
mandatory `discardCostIds`/`sendCostCardIds`, optional `discountDiscardIds`, and
`costResources`. Route changes clear later values through the shared draft.
The route remains editable from the normal action panel. Cancelling is local
and pays nothing. Required additional costs remain required on every route.

The adapter combines card slots into the native `alternateCostCardIds`,
`discardCostIds`, and `sendCostCardIds`. Resource options identify a physical
card and color and become native `resourcePayment: [{cardId, color}]` entries.
Native commands validate amounts, colors, distinctness, ownership, and state
before payment. Invalid input never falls back to automatic resource payment.
Candidate labels use only the acting viewer's projection.

Rules: CR v8.0 115.2, 115.7, 115.8, and 601.1f; see the
[official rulebook](https://alphaclashtcg.com/s/Alpha_Clash_TCG_Comprehensive-Rulebook-80.pdf).

## Resource-payment integration

This branch starts at `9fafe2b855`; no other task's changes were merged.
`cost-routes.ts` contains the route-specific resource chooser and translation.
The resource-payment task can replace that chooser with its common payment
control. Preserve `costRoute` before dependent inputs and feed the resulting
native `resourcePayment` through both `playCard` and `respond` command builders.
These are the main shared edit points when integrating the two commits.

The current chooser lists ready cards/colors and lets the native command reject
an incorrect final count. Its progress shows selected options versus available
options, not an engine-computed amount remaining. A dynamic final-cost quote
belongs with the common resource-payment work. Native colorless payment and
resource-conversion rules are not extended by this branch.

## Validation (2026-10-08)

- 20 focused tests passed: real-card native payments, invalid submissions,
  cancel/reset, hidden candidates, and successful-payment audio with mute.
- 30 adapter tests: 27 passed. The same three failures in `trap-responses` and
  `oblivion-play` reproduce with adapter sources from base `9fafe2b855` against
  the unchanged engine: old response-window pacing assumptions.
- Adapter type check stops on unchanged `engine/src/effects.ts:1934` (missing
  `prompt` on one union member). App type check has other pre-existing game
  errors; no diagnostics name changed cost-route or board files.
- In-app browser on port 5208: alternative return, incomplete-payment rejection
  with no spending, normal-payment retry, route change clearing old selections,
  required discard cancellation/retry and resolution, optional discard via
  keyboard, and private opponent hand presentation.
- Landscape phone (844 x 390) with reduced motion: discard plus three resources
  resolved into the accessory zone. Portrait (390 x 844) shows the existing
  rotate-device message. A WebGL failure after resize recovered on reload.
- Payment cues use the shared sound service only after native commit; selection,
  rejection, and cancellation do not play payment sounds. Automated cue/mute
  checks passed; no claim of acoustic output measurement.

This is local native-engine and browser proof. No hosted match, PR, merge,
deployment, or production service was changed.

## Human QA handoff: board interaction

Use the local simulator at `http://127.0.0.1:5173`. Reload before **each case**.
Start play by dragging the hand card to its legal zone, or by clicking that
card. Route cards stage the declared card at the **center cast panel** over a
dimmed board: choose the route there, and the shared **PaymentStage** (gem
pips) then owns the resource payment — click ready resources on the board to
engage gems into the cost slots; a full set plays the card without a second
confirmation. **Esc** or **Cancel** aborts and pays nothing.

**Auto-pay is opt-in**: the zap chip in the actions cluster (bottom right)
toggles it (persisted per browser). With it on, cost slots auto-assign from
available gems and the card flies straight to Standby; with it off, payments
are manual. Plain cards (no route) always use the same PaymentStage and
toggle. Right-click still inspects a card outside a cast; during a cast only
payment candidates respond.

On a compact landscape board the payment controls render inside the shared
prompt strip instead of the desktop stage. Clicking a selected resource again
disengages that gem. Selecting another resource must retain earlier
engagements.

The fixtures control both players. After payment, the view changes to the next
player. For primary-phase cards, press **Pass** twice on the board to resolve
the standby card and return to the original player.

| Case | Board steps | Expected result |
| --- | --- | --- |
| Normal | Cost-routes fixture: click Shadowlight, Darkness Rising in hand. Cast panel: choose Normal; the PaymentStage appears with two cost slots; click two distinct resources; Pass twice. | Four resources ready; two hand cards; three Clash cards. |
| Manual and illegal retry | Choose Normal; engage one gem. Try to inspect another resource while paying (must not open inspection). Disengage the gem, re-engage two, and the card plays on its own. | Inspection is suppressed during payment; a wrong or incomplete set spends nothing; the full set commits without a confirm button. |
| Alternative | Click Darkness Rising in hand; choose Alternative; click the highlighted white Shadowlight in your Clash Zone; then submit with no resources. Pass twice. | Six resources ready; Shadowlight returns to hand; Darkness Rising enters Clash Zone. Hand and Clash Zone have three and two cards respectively. |
| Route reset and cancel | Choose Normal and engage one gem, then Cancel (or Esc). Click the hand card to retry. | Cancel spends and moves nothing. Retry starts without earlier engagements. |
| Required additional | Additional-cost fixture: click Chaotic Unmaking in hand; choose Additional (required). Click Sonoro; engage three gems; Pass twice. | Three resources ready; one hand card; one Oblivion card; Chaotic Unmaking in Accessories. |
| Optional discount | Discount-cost fixture: click Enter from Beyond in hand; choose Additional; click Sonoro to discard; engage one gem (reduced slots). Reload and replay choosing Normal with two gems. | Discount: five resources ready and one discarded card. Normal: four resources ready and no discarded card. After payment these counts appear under Opponent because the fixture changes views. |
| Auto-pay toggle | Toggle the zap chip on; replay the Normal case. Toggle it off and pay manually again. | With auto-pay on, the staged panel never mounts; the card flies straight to Standby. The toggle persists across reloads. |

Repeat payment selection with Tab and Space. Check landscape, reduced motion,
and sound off. Opponent hand identities must stay hidden. Payment sound occurs
only after success. Report the fixture URL, route, selected cards, expected
result, actual result, and a screenshot for each failure.

Dynamic final-cost quotes, colorless/conversion payment, and hosted multiplayer
need separate integration QA.

### Board validation (2026-10-08)

The earlier action-drawer validation missed board defects. The board rerun
found and fixed:

- Resource selection replaced the previous choice. The shared board handler
  now toggles multi-option choices, retains distinct cards, and enforces max.
- The prompt covered resource cards and did not expose route reset/cancel on
  the board. Board payment now has a separate position and persistent controls.
- Hand cards could not start the payment flow by click. A single legal payment
  action starts directly; dragging Clash cards still uses the native draft.
- Counter actions lacked a source card reference. The adapter now supplies it,
  so Enter from Beyond can start from its hand card.

In-app browser proof used physical drag and coordinate clicks at desktop size:
normal payment rejection/correction and resolution, alternative payment,
route reset/cancel/retry, mandatory discard plus three resources, and optional
discard plus one resource. Normal counter payment and keyboard input were also
checked. The 844 x 390 landscape board with reduced motion passed resource-pile
selection and normal payment. No More action was used in these flows.

22 focused app tests and 13 shared draft/board tests passed. New regression
tests verify native payments through the shared board handler, zero payment,
selection toggling and bounds, disabled access, and single-choice behavior.
Local fixture proof does not establish hosted multiplayer or deployment.
