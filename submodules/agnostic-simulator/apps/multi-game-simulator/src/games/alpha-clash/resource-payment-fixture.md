# Resource payment

Open `/alpha-clash/simulator/tests/resource-payment` on the normal simulator.
The fixture uses `AcTestEngine.fromFixture`, official card definitions, the
production R3F board, the server adapter, and native commands.

## Checks

- Playing a card stages it over the standby area: one pip chip per cost slot
  (gem icon + required color; hollow gem for generic slots), with progress.
- Tap ready resources on the board to engage them into slots. Colored pips
  take their color first; tapping an engaged resource again unassigns it.
- A complete draft plays the card automatically — no second confirmation.
- "Pay automatically" fills only the remaining slots (manual picks stay) and
  plays. Monicolor sources are spent before flexible multicolor sources.
- Every resource card shows gem miniatures of its colors, both players.
- A selected resource cannot fill a second slot. Engaged resources and the
  other player's resources are not candidates. Cancel leaves the native state
  unchanged; retry is available after a rejected submission.
- Only successful native payment engages the selected resources. Pass both
  response windows to resolve the played Clash card.
- The AUTO-PAY chip in the actions cluster (next to More) toggles automatic
  resource payment: on, playing a card engages available gems and resolves
  without the staged panel; off, the staged tap-to-pay flow returns. The
  preference persists across reloads and seat changes.
- The compact/short-viewport board and the Match drawer still use the
  dropdown cost-slot control.
- Conquest, the Destroyer [6] sits in hand with only 3 ready resources: its
  Match play action is disabled, its tile lacks the interaction cue, a Clash
  Zone drop is a silent no-op, and it never appears in cost slots.
- Sound and reduced-motion controls are in Match. The spend cue follows the
  accepted state, including a local seat switch. Drafting and cancel are silent.

## Human QA procedure

Reload the page before each case. Start with 3 ready resources out of 4 and
gem chips above every resource card. Open Match, select the named Play action,
then close the drawer: the card must appear staged over the standby area.

1. Play Apex. The stage must show two pip chips (blue, green) at 0 / 2 and
   both ready resources must glow as candidates. Tap Apex (1): the blue chip
   must fill at 1 / 2. Tap it again: back to 0 / 2. Tap it once more.
2. Tap Magnate (2): the green chip fills and the card plays automatically —
   resources drop from 3 ready to 1 ready without a second click. Select Pass
   twice: Apex must enter the original player's Clash Zone.
3. Reload. Play Apex again and select Cancel on the stage: the card returns to
   hand, resources stay ready, no spend sound plays. Restart: chips empty.
4. Reload. Play Avenging Guy (green + two generic). Select "Pay
   automatically": all three slots fill, keeping no wasted colors, and the
   card plays at 3 -> 0 ready. The engaged fourth resource and the enemy
   resource must never glow as candidates.
5. Reload. Play Magnate. Tap one green resource: it must stay ready (1 / 1
   staged) until the auto-play fires; selection alone engages nothing.
6. Repeat a payment with Sound off and Reduced motion on in Match.
   Payment must be silent. Both settings must survive local seat changes.
   With Sound on, the spend sound must occur when the staged card plays,
   never while tapping resources.
7. Shrink the viewport to a short landscape phone: the stage is replaced by
   the dropdown cost-slot control with Pay cost / Cancel payment, and all
   controls stay reachable by scrolling.
8. Conquest, the Destroyer [6] is in hand with 3 ready resources: Match must
   list its play action disabled while the three payable plays stay enabled.
   Its hand tile must lack the "Interaction available." cue, dropping it on
   the Clash Zone must change nothing (115.2), and it must never appear as a
   cost-slot option. Dragging it to the Resource Zone stays available.

Malformed, stale, duplicate, and rejected native submissions are covered by
focused automated tests. They do not need a debug tool in the human flow.
Record the case, viewport, expected result, actual result, and screenshot for
any failure. This handoff covers local fixed-cost resource payment only.

## Rules and ownership

Rules 106.4, 115.2, 202.1c, and 408.6–408.7b govern generation, complete payment,
colored costs within the total, and one declared color per multicolor resource.
Source: Alpha Clash Comprehensive Rulebook v8.0, linked from
<https://alphaclashtcg.com/how-to-play>.

The engine quotes the final cost on a clone and remains authoritative for
payment. The adapter projects viewer-safe options. The shared `cost-slots`
option presentation validates distinct entities and slot eligibility. Draft
state does not change card orientation or resource readiness.

## Integration boundary

This control covers fixed-cost `playCard` and `respond` proposals that the
current adapter can quote. X declarations and alternative non-resource costs
retain their existing payment path; extending those needs a native quote for
the completed cost declaration. Portal activation and activated-ability costs
are not `AcResourcePayment` commands and are outside this change.

The protocol, shared UI, Alpha Clash adapter, and engine quote export must ship
together. Local fixture checks do not prove hosted transport or deployment.

## Validation record

- Native authored resource-payment suite: 28 passed.
- Payment fixtures and existing Clash play fixture: focused native tests.
- Shared slot draft: duplicate prevention, explicit confirmation, cancel, retry.
- Adapter: native Trap response payment and malformed raw payload rejection.
- Protocol and shared UI type checks pass.
- Adapter suite: the same 5 failures at the starting commit and after the change.
- Adapter type check is blocked by an unchanged `effects.ts` union `prompt` error.
- In-app browser: normal route, native payment and resolution, resource counts,
  draft/cancel, distinct colors, desktop and 844 × 390 landscape, reduced motion.
- Browser audio debug: no spend cue during draft; `resource.spend` after payment.

QA follow-up: fixed Reduced motion resetting at local seat changes. Rechecked
colored and generic payment, full-draft cancel/retry, mute, motion persistence,
and native resolution in the in-app browser; 7 fixture tests passed again.
