# Effects Stack: FAB reference and Grand Archive implementation

The selected FAB `STACK 1 layer You` element is an inspection surface for pending
layers. The bottom “Use effect / Decline” prompt is a separate decision surface.
The engine resolves the layer; neither clicking the stack card nor moving its
panel resolves an effect.

## FAB structure

Paths below are relative to `apps/multi-game-simulator/src/games/flesh-and-blood/`
unless noted.

| Layer               | Owner                                                                                            | Responsibility                                                                                                                                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Authoritative stack | `submodules/flesh-and-blood/packages/engine/src/rules/reducers/rules-stack.ts` (repository root) | Adds, removes, and updates native `rulesStack` layers through engine events.                                                                                                                                                    |
| Browser projection  | `projection.ts`                                                                                  | Projects actual stack cards and synthetic `rules-stack:<layerId>` entities for abilities; retains controller, source, card art identity, and authoritative ordering.                                                            |
| View model          | `combatChainView.ts`                                                                             | Produces `FabCombatStackEntryView` entries with presentation order and source references.                                                                                                                                       |
| Composition         | `FleshAndBloodTabletop.tsx`                                                                      | Places stack beside combat; suppresses duplicate display of a lone pending attack already represented in combat. Uses compact presentation for 1–3 entries and detailed presentation for 4+.                                    |
| Compact inspection  | `CompactResolutionStack.tsx`                                                                     | Count, controller badge, fan expansion, desktop hover/focus previews, mobile tap expansion/preview, Escape/outside dismissal, and center/top/bottom placement. Clears removed previews and collapses on stack identity changes. |
| Large stacks        | `CombatChain.tsx`                                                                                | Detailed `ResolutionStack` and sidebar stack representations.                                                                                                                                                                   |
| Movement            | `AnimatedEntityCollection` / `AnimatedEntityListItem`                                            | Shared entity animation integration.                                                                                                                                                                                            |
| Decisions           | `FleshAndBloodTabletop.tsx` → shared `InteractionResolutionPrompt`                               | Optional choices, targets, and submissions. FAB also supplies its own trigger automation/yield controls.                                                                                                                        |

FAB calls the response permission “priority.” CR 1.11.4–5 describes successive
passes and the absence of priority during resolution. CR 3.15 defines its stack.
FAB’s compact UI labels the _next_ displayed item “layer 1”; that display convention
must not overwrite GA’s projected layer numbers.

## Existing GA structure

Grand Archive already had an end-to-end stack before this change:

1. Native `state.stack` is stored bottom-to-top. Engine
   `procedures/effects/stack-resolution.ts::resolveTopGrandArchiveStackItem` reads
   `.at(-1)`, checks legality, and advances resolution. Suspended resolutions must
   resume through their decision.
2. `grand-archive-server-adapter/src/projection.ts::appendEffectsStack` creates
   public presentation entities and the shared `effects-stack` zone. Stack IDs are
   distinct from source-card IDs. It projects controller, layer, kind, art,
   details, copy traits, and source references.
3. `GrandArchiveHands.tsx` mounts `GrandArchiveEffectsStack` in the board.
4. `GrandArchiveInteractionLayer.tsx` shares the interaction draft with the board,
   exposes legal stack candidates and selected order, and renders the canonical
   resolution prompt. Its Opportunity prompt submits the existing pass action.
5. Adapter `interaction.ts` maps native optional-effect, resolution-choice,
   payment, trigger-ordering, retargeting, and mode decisions to normalized inputs.

The original GA panel was a horizontal mini-card strip with count, numeric layers,
FILO text, top highlighting, pointer previews, and legal target selection. It
lacked compact fanning, placement controls, controller labels, and keyboard/tap
inspection for non-target effects.

## Delivered behavior

- Small stacks fan behind the next effect, with an explicit expand/collapse
  control. Keyboard focus and card activation expand for inspection.
- Four or more effects remain expanded in a scrollable strip; no entries are
  dropped at the compact threshold.
- Render order is next-to-resolve first, while native GA layer numbers and IDs
  remain unchanged. The top item is marked “Next.”
- Each entry identifies its controller as You/Opponent relative to the board seat.
- Center → top → bottom placement moves only the panel.
- Legal stack targets force expansion and retain selection/order feedback.
  Inspection of other entries never submits a game action.
- Escape or an outside pointer collapses inspection; changing stack identity
  resets expansion. A removed preview is cleared. Empty stacks render no panel.
- Shared `CardFace` and Mantine controls retain native image proportions and
  keyboard/touch affordances. The existing resolution prompt remains the sole
  surface for required choices and Opportunity passing.

This is game-specific simulator interaction work, not a new shared contract or
engine feature. No FAB priority, combat-chain rules, yield policy, or automatic
trigger decisions were introduced into GA. FAB's animated stack transitions and
sidebar duplicate were not ported; GA retains its existing stack rendering path.

## Rules constraints

GA [Game Zones — Effects Stack, rules 1–4](https://rules.gatcg.com/game-mechanics/game-mechanics-game-zones/game-zones-effects-stack)
provides the governing constraints: public shared zone, separate ordered items,
top-first resolution, and no player rearrangement of existing layers. The live
Markdown source was checked on 2026-09-08 and agrees with the local mirror.

FAB reference: [CR 1.11](https://rules.fabtcg.com/en/cr/01-game-concepts/#cr1.11)
and [CR 3.15](https://rules.fabtcg.com/en/cr/03-zones/#cr3.15), read from the
repository's official rules mirror. GA's native Opportunity implementation remains
authoritative for GA; similarities in UI do not imply identical timing rules.

## Validation

Focused component tests cover display order, expand/collapse, placement,
keyboard/tap previews, preview removal, empty state, and legal stack selection.
Existing GA hands integration tests cover the shared resolution prompt and other
board interaction wiring. Browser verification uses
`/grand-archive/simulator/tests/effects-stack` at 1237×964 and 390×844, including
placement, focus/Escape inspection, and the Pass Opportunity control.
