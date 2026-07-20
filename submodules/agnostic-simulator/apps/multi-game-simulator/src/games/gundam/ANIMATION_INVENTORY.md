# Gundam Simulator Animation Inventory

The canonical machine-readable inventory is
[`src/animation/inventory.ts`](src/animation/inventory.ts). It is derived from
`GundamMoveLog`, `GundamMoveOutcomes`, setup lifecycle transitions, and the
interaction motion owned by Gundam UI components.

## Validation rule

An inventory row is `browser-validated` only after its deterministic fixture is
exercised in the in-app browser and screenshots confirm the start, active
motion, and settled destination. Mapper/unit tests count as `automated-only`;
they do not prove sizing, overlap, timing, image loading, or reduced-motion
behavior.

Each visual pass checks:

1. the source and destination are spatially correct;
2. public/private card faces match the current viewer;
3. card art is loaded and keeps the Gundam card aspect ratio;
4. the action label is readable without hiding prompts or the event log;
5. default and slow bot speeds wait for completion, while fast mode may overlap;
6. reduced motion settles immediately without losing state or information;
7. desktop and mobile placement does not obstruct primary controls.

## Current audit

- Opening-hand deal, mulligan redraw, and shield deal are derived from projected
  zone deltas because setup lifecycle changes do not emit `GundamMoveLog` rows.
  All three have now been exercised in the in-app browser.
- Core card movement uses the shared `moveEntity` overlay. Draw privacy is
  resolved before render; hidden identities are never added to visual markup.
- Commands use the dedicated focus anchor and remain there across multi-stage
  target selection.
- Lifecycle-only resource placement, readying, and turn changes are derived
  from projected state deltas and were exercised together in `multi-turn-demo`.
- Return-to-hand, return-to-deck, urgent-clock, discard cleanup, targeted and
  targetless effects, hand hover/focus, and match end each have a deterministic
  fixture and in-app-browser screenshot proof.
- Every current row is `browser-validated`. Adding a new animation requires a
  new row and keeps the inventory incomplete until its own deterministic visual
  pass is captured.

Do not mark this inventory complete while any entry remains
`implementation-gap` or `automated-only`.
