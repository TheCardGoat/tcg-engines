# Simulator Animation Architecture

## Ownership

- Protocol plan and refs:
  `submodules/agnostic-simulator/packages/protocol/src/animations`
- Transition store and timeline compiler:
  `submodules/agnostic-simulator/packages/simulator-runtime/src/animation`
- React provider, slots, visual boundary, and drivers:
  `submodules/agnostic-simulator/packages/simulator-ui/src/animation`
- Deterministic lab:
  `submodules/agnostic-simulator/apps/multi-game-simulator/src/components/AnimationFixturesPage.tsx`
- Browser coverage:
  `submodules/agnostic-simulator/apps/multi-game-simulator/e2e/specs/animation-fixtures.spec.ts`

## State Lifecycle

The generic store owns:

- latest authoritative state and version;
- last fully settled state and version;
- state and version currently presented by React;
- one active transition;
- a FIFO queue of later transitions.

Activate a planned update as follows:

1. Keep the old presentation for one preparation frame.
2. Present the target state and run the compiled timeline.
3. Let `AnimatePresence` retain outgoing entity components.
4. Keep commands blocked while affected collections reflow.
5. Settle the target state and activate the next queued update.

An update without a plan snaps when it reaches the queue head. A server sync,
session change, or viewer change cancels motion and snaps immediately.

## Public Plan

Use one strict `AnimationPlanV2` per state update. Steps use `startAtMs`
relative to plan start. Supported steps are:

- `entityTransfer`
- `emphasize`
- `entityStateChange`
- `effect`
- `combat`
- `valueDelta`
- `phaseChange`
- `randomization`
- `gameResult`
- `hold`

An `entityTransfer` requires at least one endpoint. Both source and destination
faces are explicit and viewer-safe. State versions, actors, correlation ids,
and anchors do not belong in the plan.

Use `emphasize` for a pulse or spotlight around any registered ref. Use
`entityStateChange` for an explicit orientation, face, or appearance change
without zone movement. Use `valueDelta` for resources, life, counters, score,
damage, or any other numeric subject. `randomization` owns shuffle, die, coin,
and selection feedback without exposing hidden entity identities. `gameResult`
owns viewer-relative terminal results.

## Visual and Layout Contract

Each game registers one passive `SimulatorEntityVisual` renderer. Put
selection, targeting, legality, menus, focus, and drag behavior outside it.
Never branch the renderer by board versus animation surface.

Wrap entity lists in `AnimatedEntityCollection` and each entity in
`AnimatedEntitySlot`. Register zones and non-entity targets with
`AnimatedZoneSlot`, `AnimationAnchor`, or `useAnimationNode`.

Use direct shared layout when an entity has one segment and both entity slots
exist. Use `EntityTransferLayer` for multi-hop paths, true entry/exit, count-only
stacks, temporary anchors, or missing slots. Portal visuals still render the
same registered visual component.

Official references:

- https://motion.dev/docs/react-layout-animations
- https://motion.dev/docs/react-animate-presence
- https://motion.dev/docs/react-accessibility

## Integration Checklist

1. Ingest the update where both previous and next state are known.
2. Convert native engine records with the owning game's pure adapter.
3. Enqueue the state, version, correlation id, source, and one plan.
4. Render the board from presentation state.
5. Register one viewer-safe projection and one passive entity renderer.
6. Wrap every rendered entity and target zone in stable animation slots.
7. Guard DOM interaction and the real command/bot dispatch boundaries.
8. Replace resync, reset, audio, and idle handling with provider actions/status.
9. Delete local plan queues, gates, history caches, and fallback visuals.
10. Add protocol, store, component, fixture, and real-route proof.

Do not infer semantic animation plans from arbitrary state diffs.

## Timing Defaults

- entity transfer, emphasis, and entity state change: 560 ms
- effect, combat, and value feedback: 520 ms
- phase or turn: 780 ms
- randomization: 720 ms
- game result: 1,200 ms
- final layout reflow: 240 ms
- watchdog margin: compiled end plus reflow plus 2,000 ms

Scale starts and durations by `fast = 0.5`, `normal = 1`, and `slow = 1.5`.
Treat `off` and reduced motion as immediate settlement.

## Focused Validation

```bash
cd submodules/agnostic-simulator/packages/protocol
vp test run --configLoader runner

cd ../simulator-runtime
vp test run --configLoader runner

cd ../simulator-ui
vp test run src
vp run check-types

cd ../../apps/multi-game-simulator
vp test run --configLoader runner
pnpm exec playwright test e2e/specs/animation-fixtures.spec.ts --project=chromium
pnpm exec playwright test e2e/specs/animation-fixtures.spec.ts --project=firefox
pnpm exec playwright test e2e/specs/animation-fixtures.spec.ts --project=webkit
```

After focused proof, run `pnpm run ci:agnostic:check` from the repository root.
