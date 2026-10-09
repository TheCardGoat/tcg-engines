# Grand Archive combat UX

Implemented in the live simulator, 5 October 2026. See **Live implementation**
below for the production components and verification. The design proposal and
adoption audit are retained as design history. The HTML companion at
`/design/grand-archive-combat.html` still uses illustrative cards, values and
simulated passes; the live board consumes authoritative engine projections.

## Layout

A flat rectangle with one thin horizontal divider. Opponent above, local player
below. Local champion first on the left; opponent champion first on the right.
Cards extend inward from each champion. No combat panel, decorative frame,
permanent battle tracker, or duplicate player/stat headers.

One contextual instruction sits on the divider, with one primary action at its
right. The cancel-draft control sits to its left. On a phone, the instruction uses
two short lines and actions keep 44px touch targets. Both seats remain visible;
only the field and hand zones scroll. At 390 × 844 the prototype keeps the full
flow inside one viewport. Desktop uses the same hierarchy, with more breathing
room rather than more controls.

Hands are centered on the outer edges. Desktop cards tuck individually and lift
on hover/focus. Phones use a single flat horizontal carousel. Eligible actions
have a restrained mint glow plus an accessible “selectable” label; committed
participants have gold selection and a role cue. Color alone never conveys
legality. A thin connection links attacker to defender while combat is active.
For multiple defenders it branches to all participants.

## Beginning to end

| Moment | What the player sees | Direct interaction and submission |
| --- | --- | --- |
| Main phase | “Choose an attacker”; only eligible objects glow | Tap the unit, or drag an attack card from Hand onto the field. Tap is the touch and keyboard alternative. The attacker must be awake and the server must permit a slow action. |
| Attack-card activation, if used | Required cost prompt on divider; selected payment cards marked in Hand | Tap cost cards. The final required selection submits activation automatically. Costs/resting are part of activation, before target declaration. |
| Attack card on Effects Stack | Public attack card and a compact response prompt | Fast responses are selected from eligible cards; otherwise use **Pass opportunity**. Negation/fizzle clears the pending attack, keeping already paid activation costs and the champion's rest. |
| Weapon choice, if available | “Choose a weapon”; only eligible objects glow | Tap weapon to add it, or **No weapon**. Choose before declaration; it cannot be added later. Omit this step when there is no legal choice. |
| Target choice | “Choose a target”; legal opponent objects glow | Tap a target to declare if all required inputs are complete. Cleave selects an opposing player, not individual targets. Multistrike uses the server's legal target limit. |
| Additional declaration costs | “Pay [cost]”; eligible payment objects highlighted | Select directly in the original zones. Final required selection completes the draft and submits one atomic declaration. Cancel discards an unsubmitted draft. A refused/invalid declaration rolls back declaration steps, not earlier attack-card activation. |
| On Attack effects / before retaliation | Current decision owner, compact occupied stack, **Pass opportunity** | Resolve On Attack effects with Opportunity. Then turn player has Opportunity before retaliation. Each response uses the existing direct-card cost/target selection grammar. |
| Defender's retaliation choice | “Retaliate?” next to the actual defending unit | **Retaliate** rests that unit; **Take hit** declines retaliation. Only an awake defending unit with positive power qualifies. Weapons cannot be wielded for retaliation. A single decision commits immediately. |
| Multiple defenders | The next defending unit is marked; “1 of 2” instruction | Each unit has its own explicit retaliate/decline decision. Do not treat the whole defending field as potential blockers. Auto-advance after each decision. |
| Before damage | “Before damage”; **Pass opportunity**; small tentative damage preview near participants | This is the last response window. Preview comes from authoritative game state and is explicitly “may change.” Update after responses. Never calculate legality/damage by summing printed card text in the UI. |
| Multiple retaliators | “Order retaliation”; numbered participant badges | Attacking player taps each retaliator in order. The final tap submits. Ordering affects processing/replacements/triggers, not simultaneous damage timing. |
| Replacement effects | Short effect names adjacent to the affected object | The affected object's controller chooses applicable replacement ordering. Tap the next effect, then recompute choices. Only display when the engine requests it. No generic confirmation modal. |
| Damage | “Dealing damage”; momentary damage deltas attached to affected cards | No response or “Deal damage” button. Server resolves simultaneous damage, weapon durability and state-based consequences. Brief animation must never delay an authoritative prompt. |
| End of combat | “Finishing combat” only while unresolved effects remain | Process damage triggers/state-based checks; remove roles; move Intent to graveyard. Occupied Effects Stack remains inspectable and has ordinary Opportunity as required. |
| Return to Main | Clear connection, participant roles and combat prompt | Return automatically after remaining effects and passes. No extra “Finish combat” or “Return to Main” confirmation. |

## Selection grammar

- Fixed cardinality: last required tap commits. Before that, tapping a selected
  card deselects it. The inline instruction states the count and automatic submit.
- Ordered cardinality: each tap adds a number; last required tap commits. Before
  completion, tapping an assigned item removes it and renumbers the remainder.
- Optional or “up to” inputs cannot infer completion from a tap. Use a short
  contextual **Choose none**, **Use selected**, or **No weapon** action as the
  actual choice, never a subsequent confirmation. Clicking empty board space is
  too ambiguous for a required mobile control.
- Cancel is available only while an attack is an unsubmitted local draft. After
  declaration, do not offer cancellation. Server-authorized Undo, where the
  simulator permits it, is a separate action; it must not pretend to rewind a
  private-information reveal or an opponent response.
- A card tap means the current prompted choice. Outside a choice, inspection is
  available through a small explicit affordance/keyboard action. Long press is
  an optional shortcut, never the only way to inspect.
- Invalidated targets show “Target no longer available” inline and reconcile
  with the engine. Do not silently pick another object or restart combat.

## Visibility and state

Hand and Memory are private. Render only viewer-authorized faces; opposing Hand
uses anonymous backs except an explicitly authorized reveal. Do not leak hidden
identities via DOM labels, preview totals, target highlights, logs or drag data.
The same Hand component renders both seats at the same card size. Payment cards
move to the correct native zone after server acceptance; temporary selection
marks do not reveal their identities to the opponent.

Intent and Effects Stack are distinct public zones. Intent contains resolved
attack cards; Effects Stack contains unresolved effects, in engine order. Show
occupied zones as compact inline card/effect entries. Tapping expands an inline
inspection surface; inspection never gates a response. Never reorder the stack
by dragging. Keep intent visible through damage, then remove at cleanup.

If the viewer has no decision, show one line such as “Opponent is choosing a
target” and keep legal viewing interactions available. Do not show their private
choices before commitment. The prototype labels the opponent decision during retaliation so both roles
can be reviewed on one example board; it does not change the authenticated
viewer or model a second private projection.

When a participant leaves play or changes controller, reflect native combat
roles immediately. No valid defender means no attack damage to it; a departing
attacker deals none. Still run the remaining combat steps and cleanup. Retarget
only when an effect permits it. A weapon leaving play stops contributing power.
Weapon durability is handled by the engine, including zero-damage cases and
exceptions for negated/fizzled attacks or departed/illegal defenders.

## Accessibility and motion

Keyboard: Tab visits legal card choices and the contextual action; Enter/Space
select. Prompts use a polite live region. Announce submitted costs, retaliation,
ordering, invalidation and actual damage without revealing private state.
Keep focus near the selected object or new primary action when a prompt changes;
automatic resolution must not strand focus on a removed control. Touch targets
remain at least 44px, with selected-state labels and sufficient text contrast.

Use individual 150–180ms lift/selection transitions. Damage can briefly show
attached deltas; reduced motion uses static deltas. Use bounded, card-local feedback from the shared cinematic catalog. No camera
shake, screen flash, staged full-screen scene or full-board dimming. Match history records the durable result.

## Rules traceability

Rules mirror and official pages were read for the entire combat sequence:

- [Attacking and the Combat Phase](https://rules.gatcg.com/game-mechanics/game-mechanics-turn-order/turn-order-combat-phase/combat-phase-attacking-and-the-combat-phase), General Rules 1–11: eligibility, slow timing, rest/costs, weapon and Intent contribution, and invalidated participants.
- [Attack Declaration](https://rules.gatcg.com/game-mechanics/game-mechanics-turn-order/turn-order-combat-phase/combat-phase-attack-declaration), General Rules 1–5 and Declaring an Attack 1–2: atomic declaration, ordered choices/costs, Cleave/Multistrike, and On Attack triggers. Declaration itself has no Opportunity window.
- [Retaliation Step](https://rules.gatcg.com/game-mechanics/game-mechanics-turn-order/turn-order-combat-phase/combat-phase-retaliation-step), General Rules 1–4: On Attack effects, Opportunity, eligible defending units and no retaliation weapons.
- [Damage Step](https://rules.gatcg.com/game-mechanics/game-mechanics-turn-order/turn-order-combat-phase/combat-phase-damage-step), General Rules 1–4: final Opportunity, retaliation order, simultaneous damage, replacement choices and weapon durability.
- Local mirror `combat-phase-end-of-combat-step.md`, General Rules 1–2: damage triggers, state-based checks, role removal, Intent cleanup and return to Main. Its source is the [Combat Phase](https://rules.gatcg.com/game-mechanics/game-mechanics-turn-order/turn-order-combat-phase) hierarchy; the mirror has no standalone canonical URL metadata.
- Local mirrors `card-types-attack.md` and `game-zones-intent.md`: attack-card activation/resting, resolution into public Intent and cleanup.

## Implementation boundary and review coverage

The prototype exercises ally attack, optional weapon selection, attack-card cost
and pre-resolution response, individual retaliation/decline, final Opportunity,
multiple retaliation ordering, replacement-order choice, automatic damage and
cleanup. It exposes remote passes through a labelled review-only control and uses illustrative values;
it does not implement card abilities, nested fast responses, legal target
restrictions, server errors, durability or hidden-information projections.

Production integration should extend the existing game-specific board and
interaction layer, reuse Mantine/shared simulator controls, and consume legal
prompts/actions from the Grand Archive adapter. Do not create a second client
combat state machine. Explicit response ownership, participant links, authorized
previews, replacement options and draft/committed state need to be projected by
the owning adapter if absent. The engine remains responsible for all rules.


## Shared catalog adoption audit — 5 October 2026

The current standalone HTML prototype demonstrates the UX with local HTML/CSS
and illustrative state. It does **not** import the cinematic driver or render
`InteractionResolutionPrompt`. The mappings below are the integration contract,
not a claim that catalog playback has already been enabled.

### Interaction Prompts catalog

Review the shared catalog at
[/simulator-ui-fixtures/interaction-prompt](/simulator-ui-fixtures/interaction-prompt).
Its inventory lives in `src/components/simulator-ui-fixture-manifest.ts` and its
examples in `src/components/InteractionPromptFixturesPage.tsx`.

| Combat requirement | Existing catalog family | Grand Archive presentation |
| --- | --- | --- |
| Pass opportunity | `ready-action` | One authoritative, inputless action on the divider; no second submission button. |
| Inspect an attack card, Intent or effect | `source-inspection`, `expanded-details` | Reuse disclosure and source-inspection affordances; details stay optional and do not interrupt a choice. |
| Attacker, weapon, defender or hand payment | `spatial-target`, `selected-target` | Highlight native cards in their existing zones. Keep count, eligibility and selected values in the shared draft. |
| Retaliate / decline or optional weapon | `binary`, `options` | Render the named choices in the canonical action rail; submit the actual choice immediately. |
| Several retaliators or replacement ordering | `ordering`, `direct-order` | Direct ordered selection, numbered participants and automatic commit when the required order is complete. Use the input kind actually supplied by the adapter, rather than converting every order to a partition. |
| Optional payment or a numeric effect | `optional-amount`, `amount` | Show only when a native interaction requests it. Keep zero/decline explicit and preserve authoritative bounds. |
| Assign damage or distribute an effect | Shared `entity-allocation` / `entity-partition` inputs; `partition` fixture where applicable | Consume only engine-requested assignments. Do not invent a damage-allocation step for ordinary combat. |
| Candidates outside the visible board | `drawer-target` | Use an inline, authorized candidate strip only when necessary. Hand payment/targets remain in Hand. A modal is not the default combat selection surface. |
| Opponent decision | `opponent` | Keep a concise waiting prompt; hide private choices and disable submission for the non-actor. |

The existing `GrandArchiveInteractionLayer.tsx` already renders the shared
`InteractionResolutionPrompt`, with `reserveBottomTargetArea`, `instructionOnly`
and game-owned `decisionControls`. Extend this composition instead of adding a
parallel combat prompt stack. Use the shared actor/state version, candidates,
validation and submission contracts. Keep the required prompt visible; adapting
its placement to the divider must not duplicate it in a second overlay.

**Important submission gap:** shared `interactionCommitMode` defaults to
immediate only for required single entity selections, and optionally optional
singletons. Multi-selection and ordering default to confirmation. The proposal's
last-required-tap submission therefore needs an explicit Grand Archive-owned
policy using shared draft validation, with one submission per complete input
sequence. The prototype's local behavior does not establish that the shared
component already supports that policy. Preserve existing behavior for other
games. Optional cardinality still needs a named completion choice.

### Cinematics catalog

Review the shared bench at [/animation-fixtures](/animation-fixtures).
The vocabulary lives in
`packages/simulator-ui/src/animation/cinematic-inventory.ts`; runnable semantic
recipes live in `src/components/animation-fixtures/cinematic-recipes.ts`.
Prefer existing semantic steps for ordinary combat. Optional cinematic styles
are effect treatments, not rules or persistent status.

| Resolved event | Catalog mechanism | Minimal treatment |
| --- | --- | --- |
| Attack/retaliation rests a unit | `entityStateChange` — Rotate in place | Brief state transition on that card; the rested state remains in the board projection. |
| Hand payment, attack card to Stack/Intent, Intent to graveyard | `entityTransfer` — Card transfer / Conceal and move as appropriate | Captured endpoints and one moving clone. Respect actual source/destination facing and authorization. |
| Combat damage resolves | `combat` — Combat exchange | Short local exchange between resolved participants. Simultaneous damage must not look like sequential independent attacks. |
| Damage or durability changes | `valueDelta` — Value loss | Small attached delta derived from authoritative changes, not printed-card arithmetic. |
| Damage prevention resolves | Optional `shield` | Brief local protection feedback only when the game reports prevention; persistent protection uses native counters/decorations. |
| Healing or recovery resolves | `valueDelta`; optional `heal` | Show actual gain, optionally with restrained local recovery particles. |
| An effect resolves against a target | Default effect connection; optional `projectile` or `beam` where appropriate | Opt in per resolved behavior. Ordinary targeting does not require an elaborate cinematic. |
| A defeated permanent leaves | `entityTransfer`; optional `dissolve` | Movement owns the disappearance; dissolve is optional feedback, never the operation that removes the object. |

The targeting glow, selected payment marks, combat connection and role labels
are persistent interaction/state UI. They are **not** `tether`, `aura` or other
temporary catalog effects. Keep them outside the event playback queue.

The current `projectGrandArchiveNativeAnimation` handles draws/transfers,
reveals and resolved stack effects. It does not currently emit the proposed
combat exchange, rest rotation, damage deltas or cinematic styles. Add those
mappings in the owning adapter only after a resolved engine event is available;
never infer events from prose or a tap. Deduplicate combat/value feedback so the
same damage is not presented twice.

All event playback must use the existing shared driver and viewer-safe refs.
It owns speed, skip, synchronization, reduced motion, missing endpoints, resize
and unmount cleanup. Do not transplant the HTML example's demonstration timer
into production or introduce a second completion/input gate. Prompt ownership
stays authoritative even when playback is skipped or an endpoint disappears.
Reduced/off motion retains the settled state and readable result.

### Integration acceptance

1. Exercise the existing prompt families with Grand Archive interactions at
   mobile and desktop sizes, including non-actor waiting and optional zero.
2. Verify last-tap submission for fixed costs/order, stale-state rejection and
   absence of duplicate submits; preserve other games' confirmation policies.
3. Verify viewer-safe movement and combat plans with normal, reduced and off
   motion, skipped playback, missing targets and interrupted cleanup.
4. Check that no required prompt is hidden behind animation, neither seat
   scrolls, and the final settled state is correct without any cinematic.

This audit changes the design specification. Live catalog integration remains
work to be implemented and verified through the actual game surface.


## Combat step and Opportunity visibility — 5 October 2026

The prototype now shows a compact, non-interactive four-step line at the divider:
**Declare → Retaliation → Damage → End**. The current step is labelled and
underlined, with `aria-current="step"`; completed steps remain readable. The
line is hidden during attack-card activation in Main and after combat finishes.
Declaration drafting is labelled as preparation; the server determines the
actual transition into combat, not the prototype's progress indicator.

Under that line, the canonical prompt identifies the exact current window and
its actor: **Opportunity · You may act** or **Opportunity · Opponent may act**.
Opponent ownership disables the local Pass action. The standalone review has a
separate **Simulate opponent pass** control in its footer; this is not a live
match control, nor an automatic opponent action. Both players' successive passes
can therefore be reviewed without disguising the handoff.

| Step | Exact window or decision | Response status |
| --- | --- | --- |
| Main, before declaration | Attack card on the Effects Stack | Opportunity before attack-card resolution; not a combat-declaration response window. |
| Declaration | Choose attacker, weapon, target and required costs | No response window during the atomic declaration. |
| Retaliation | Resolve On Attack effects, when present | Opportunity to respond to pending triggers/effects; shown separately from before-retaliation Opportunity. The attack-card scenario includes an illustrative On Attack trigger. |
| Retaliation | Before retaliation | Turn player first receives Opportunity; show subsequent ownership explicitly. |
| Retaliation | Defender decides whether each eligible unit retaliates | A prompted choice, not permission to play a response during that choice. |
| Retaliation | After retaliation | Resolve remaining effects and successive passes before entering Damage. |
| Damage | Before damage | Final Opportunity before damage resolution, with both players' passes visible. |
| Damage | Order retaliation / apply replacement effects | Required engine-owned choices; do not label these as Opportunity. |
| Damage | Dealing damage | Explicit **No opportunity · resolving damage**; no playable response controls. |
| End | Remaining damage triggers/effects | Opportunity while the remaining Effects Stack resolves, then automatic return to Main. |

Any fast response places its effect on the stack and refreshes the current
Opportunity owner. Passing once must never imply immediate damage or skip the
opponent. In live integration, the window advances only when the engine reports
the necessary empty stack and successive passes. If stack objects remain, show
the next resolution and renewed Opportunity rather than treating a pair of
passes as permission to skip the entire stack. The prototype still illustrates
one pending effect at a time and does not execute nested responses.

The current step, exact window and actor belong to the shared Interaction Prompt
composition, sourced from the authoritative Grand Archive projection. Cinematic
playback never changes them, masks an open window, or delays a required choice.
This extends the `ready-action`, `opponent` and ordered-selection catalog mapping
without creating an independent production combat state machine.

Rules references: Retaliation Step, General Rules 1–4; Damage Step, General Rules
1–3 (especially 3.8 for the absence of Opportunity during damage); Attack
Declaration, General Rules 2; End of Combat Step, General Rules 1–2.

## Live implementation — 5 October 2026

The active DOM board now implements this flow. The earlier HTML prototype and
adoption audit above record the design phase; they are not the runtime.

- `GrandArchiveCombatFlow` renders engine-owned steps, exact windows and viewer
  ownership at the divider. Attack-card activation stays outside the four-step
  combat line. Declaration is preparation, not a fabricated response window.
- The engine transitions a completed retaliation decision directly into the
  **Before damage** Opportunity window. The live UI does not invent a separate
  “after retaliation” window from the illustrative prototype.
- `GrandArchiveInteractionLayer` uses `InteractionResolutionPrompt` for spatial
  choices and explicit Retaliate / Take hit decisions per eligible defender.
  Fixed selections and ordered inputs finish on the last required tap. Optional
  cardinality has a named completion choice; no empty choice auto-submits before
  the player can decide. Required decisions cannot be cancelled.
- Attacking field cards begin the native declaration draft directly. Selected
  participants have a restrained persistent connection; forecasts come only
  from the engine's projected damage amounts and are labelled “projected”.
- The R3F `board-renderer` uses shared `SceneCard`, `CardSelectionRim`, and
  `useCardPose` components. It consumes viewer-safe snapshots and confirmed
  feedback. Reduced motion snaps poses; reconnect and undo reset movement.
  DOM prompts always consume the latest authoritative projection.
- Hosted projections preserve public remote combat-decision ownership while
  leaving the opponent's private answer candidates undisclosed.

The attack-targeting developer fixture has a **Switch viewer** control so a
reviewer can exercise both actual actors through native submissions. This
control is not present in practice or hosted matches.

Verification: board/hand/combat interaction tests, hosted adapter tests, a full
native attack through both Opportunity handoffs and retaliation on a 390 × 844
viewport, and desktop inspection. Neither player seat nor the mat scrolls.
Particle effects such as shield/heal are not inferred from damage forecasts;
they remain opt-in mappings for explicit game events.
