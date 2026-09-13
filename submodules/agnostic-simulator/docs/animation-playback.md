# Animation playback

## Ownership

`simulator-runtime/src/animation/compile-plan.ts` compiles semantic steps and the
selected speed into one timeline. `createSimulatorAnimationScope.tsx` owns its
prepare, playback, and layout phases. The compiled deadline releases the input
gate; a missing DOM node or a missing Motion callback cannot block a match.
Completion, skip, sync, resize, speed changes, and unmount share cleanup that
cancels audio and settles presentation. Discarded queues notify every correlation,
including when motion is disabled. Sync and reset each publish one replacement;
skip preserves its diagnostic reason. Projection-only refreshes keep the active
deadline, audio schedule, and transfer animation unchanged. Resize recovery waits
150ms and ignores unchanged or transient viewport sizes. Visual boundary timers
only reveal or
hide individual cards; they do not decide when gameplay can continue.

`EntityTransferLayer.tsx` owns cross-zone movement through one portal. It captures
source geometry before rendering the destination, uses translation and uniform
scale, and suppresses the original card while its overlay is visible. Exiting
source nodes stay suppressed until cleanup. Destination cards appear as their
transfer finishes. Local slot layout is separate and uses the layout duration.
Public/private projection runs before an overlay receives an image.

The store retains authoritative and presentation snapshots. Its public settled
snapshot is derived from the active transition, rather than independently written.
Animation plans and gameplay rules remain unchanged protocol concepts.

## Gundam authoring

`packages/gundam/gundam-server-adapter/src/gundam-animation.ts` owns packet mapping,
viewer projection, setup lifecycle deltas, timing, and sequence helpers. Local and
server adapters use this mapper. The React bridge supplies snapshots, geometry,
viewer identity, and interaction gates; it does not own a second packet mapper.

At normal speed, transfers take 800ms, readiness changes 450ms, effects/combat
1400ms, and layout 200ms. A 350ms reading pause follows a sequence. Deals stagger
by 120ms, capped at 600ms. Commands move to the focus area, show their effect,
pause, then move to trash when resolved. Combat results precede removal. Keep
simultaneous results within one group and use `sequenceGundamAnimationGroups`
for ordered groups. Do not add new completion registries or component-owned locks.

Only Gundam live sessions enable catch-up: queued playback exceeding six seconds,
a restored visible tab, or a replacement sync settles to the newest snapshot.
Local and replay queues remain ordered. Reduced motion and animation-off settle
immediately. Existing speed multipliers still apply; other games retain their
existing timing defaults.

## Debugging and validation

Use the existing simulator animation debug setting to inspect transition IDs,
plan steps, phases, missing nodes, and live-backlog diagnostics. A missing endpoint
should produce a diagnostic and still settle on schedule. For a visual defect,
inspect endpoint registration and privacy projection before adding delays.

Focused tests cover timeline cleanup, missing endpoints, seek, speed changes,
live catch-up, resize, local ordering, shared/server mapping, and capped dealing.
Browser fixtures cover actual controls, source suppression, destination landing,
mobile artwork, and reduced motion. `e2e/specs/animation-simplification.spec.ts`
captures start, active, and settled desktop/mobile images.
