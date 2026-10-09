# Simulator presentation

Shared card components, motion, selection, zones and sound for simulator clients.
Game adapters own rules, legal actions, viewer-safe card data, and layout coordinates.
Never import a game engine or application route into this package.

## Public building blocks

| Import                                                           | Reuse                                                                            |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `@tcg/simulator-presentation`                                    | `PresentationZone`, `cardRowSlot`, motion math, selection tokens                 |
| `/dom`                                                           | `CardSurface`, `DomCardMotion`: persistent card faces with R3F-driven transforms |
| `/three`                                                         | `SceneCard`, `CardShadow`, `CardSelectionRim`, `useCardPose`: world-space cards  |
| `/canvas`                                                        | Shared effect canvas and render lifecycle                                        |
| `/audio/sound-service`, `/audio/scheduler`, `/audio/sound-packs` | Playback, cue scheduling and sound packs                                         |
| `/opening`                                                       | Configurable opening sequence, scene and layout contract                         |
| `/gallery`, `/fixture-styles.css`                                | Configurable card-type motion gallery and shared fixture styles                  |

Import DOM, Three and audio entry points only where needed. DOM card styles are
included by `/dom`. Existing HTML hand, deck and zone components remain in
`@tcg/simulator-ui`; use those rather than building another HTML zone system.

`PresentationZone` takes `cards`, `getKey`, `getPose`, and a render function.
Return `undefined` from `getPose` to omit a card. Supply stable viewer-safe keys;
change the incarnation when card identity must reset. This primitive does not
sanitize engine data: the game adapter must exclude private information first.

`DomCardMotion` takes a target pose and an external sequence clock. A new
`motionKey` starts a new beat. The caller supplies deal staggering and deck/card
roles. `useCardPose` performs world-space reconciliation; its `resetKey` snaps
across privacy and match boundaries. Both avoid per-frame React state updates.

`usePresentationCardDrag` exposes pointer bindings and a pose ref. Pass that ref
to `DomCardMotion`, then supply a unique `handoff.key` and the release pose on
drop. The game adapter decides whether the drop is legal and owns the destination.
`onLaunch` and `onLand` fire once per actual movement; stationary renders do not
emit cues. Use these callbacks for travel and arrival sounds.

`CardResolutionEffect` (`/resolution`) takes game-owned source/target poses, an
event key, and an external clock. `onImpact` fires once when the effect reaches
the target. The adapter maps this event to sound and presentation state; the
component does not apply game rules. Pass its reaction ref to `DomCardMotion` to
compose a recoil or fade. Reduced motion preserves the impact notification while
removing travel and recoil. `ResolutionValue` (`/dom`) displays a brief result
amount. Pending connections appear only when the adapter requests inspection.

An opening configuration supplies its beats, callbacks, cards and optional
`layout(width, height, handSize)` and `renderTable(size)` functions. Different
layouts share the same motion and card components. Opening configurations are
presentation fixtures, not live engine commands.

## Current consumers

Targeted effects can use `/targeted-resolution` for the shared sequence:
raised source hold, target disclosure, impact, target transitions, then source
arrival at its final zone. `resolutionFocusPose` supplies a default inspection
position; adapters can supply their own layout. `restingElevation` on
`DomCardMotion` keeps a composited shadow under a stationary raised card.
`useTargetArrivals` waits for every target's `onLand` callback. It ignores
duplicate, unrelated and stale arrivals. Do not replace target completion with
a timer. The adapter supplies legal, viewer-safe targets and final destinations.

Alpha Clash and Grand Archive play fixtures use this sequence. Cyberpunk and
live engine adapters do not yet consume the new sequence. Removal feedback
settles before zone movement to avoid an opacity discontinuity. Reduced motion
keeps the same completion order with shorter holds.

Validation for targeted staging: 44 focused tests passed, including multiple
targets and stale completions. Browser checks covered both targets, removal,
damage, reduced motion and off-center release. Local recordings averaged about
60 FPS (p95 18.5 ms); this does not guarantee 60 FPS on every device. Review
videos with actual browser audio are in root `artifacts/targeted-resolution/`.

- Alpha Clash and Grand Archive card-type galleries: one `MotionGallery` with
  game-owned cards, zone positions and sequence definitions. Both play/resolve
  fixtures also reuse the drag, motion, resolution and audio primitives.
- Alpha Clash and Grand Archive opening fixtures: shared opening, DOM cards,
  motion, selection, canvas and sound.
- Cyberpunk: shared canvas, transfer motion, audio service and selection tokens;
  game-specific card content and board layout remain in its adapter.
- Grand Archive main Three board: shared scene card, shadow, selection rim,
  pose motion and zone renderer; its composition and projection stay game-owned.
- Alpha Clash main HTML board: shared selection tokens. Live opening commands
  still need engine integration; the fixture does not change mulligan rules.

Check with `pnpm check-types` and `pnpm test` in this package. Opening and audio
integration tests currently live in the multi-game simulator app. A local 60 FPS
preview is evidence for that machine, not a guarantee for all devices.

## Motion and audio polish (2026-10-06)

Choreographed transfers use a squared elevation arc for smooth takeoff and
landing. DOM cards preserve their shadow elevation when a drag is released or
retargeted. Short selection moves use a shallow shadow; CSS does not apply a
second easing curve to the frame-driven shadow.

The original sound pack uses filtered paper friction for draw and travel, and
paper contact plus a low sine body for landing. Buffers include 80 ms of tail
space to avoid truncating existing envelopes. Square clicks and sawtooth drops
are replaced with softer waveforms. `playSimulatorSound(cue, shouldPlay)` can
cancel a queued cue if a scene is muted or hidden before audio becomes ready.
The opening scene uses this guard and gives card selection a short interface cue.

The turn-order coin uses a smooth acceleration curve and inexpensive directional
lighting. Card shadows remain composited layers; no shadow maps are required.

Validation: both opening procedures, Alpha Clash selective replacement, all 14
card-motion fixtures, left/right off-center releases, damage/removal outcomes,
reduced motion, and muted interaction. Local opening samples averaged 60.0 FPS
with p95 18.6 ms and no sampled frames above 20 ms; this is not a hardware-wide
guarantee. Focused app suite: 35 tests passed. Package types, lint and standalone
fixture build passed. The existing large shared build chunk warning remains.
Recordings in root `artifacts/motion-polish/` contain actual browser audio,
boosted 8 dB for review, and 30 FPS video. Playback capture rate is separate from
the measured render rate. Live engine integration and a new Cyberpunk browser
run are outside this presentation validation.

## Spatial inspection and reusable board foundation

Alpha Clash is the reference consumer for spatial card inspection. Keep reusable
changes here and have each game supply its own layout and authorized projection.

| Building block                                       | Owner / contract                                                                                                                  |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Card shape, front/back artwork and thin rounded edge | `SceneCard rounded` in `/three`; pass only authorized textures                                                                    |
| Lift, tilt, settle and return                        | `useCardPose` opt-in `transition`; `liftAxis` is `z` for XY boards or `y` for XZ tables                                           |
| Inspection framing                                   | `inspectionPose` in `/inspection-pose`; perspective or orthographic camera, world-space distance, card aspect and viewport ratio  |
| Shared motion timing                                 | `inspectionMotion` in `/inspection-pose`; arc amplitude scales with the game's world units                                        |
| Inspection state and dismissal                       | `useCardInspection`, `CardInspectionControls` in `/inspection`; focus capture/return, Escape, Tab containment and click-to-return |
| Accessible zone hit targets                          | `SpatialZoneTargets` in `/inspection`; game supplies projected rectangles, accessible names and callbacks                         |
| Hand distribution, selection and zones               | Existing `hand-fan`, `card-selection`, `PresentationZone` and row-slot helpers                                                    |
| Sound and effect sequencing                          | Existing audio scheduler, opening and targeted-resolution entry points                                                            |

Integration:

1. Keep board, hand and resolution positions in the game layout. Do not share
   hard-coded coordinates or assume all games use the same camera orientation.
2. Compute the inspection target with `inspectionPose(camera, layout)`.
3. Give `useCardPose` that target and a transition key that changes on entry/exit.
   Pass the game's resting rotation and lift axis. Use reduced motion for the
   same final pose without travel.
4. Keep the same card instance mounted; do not clone its image into a dialog.
5. Render `CardInspectionControls` only while inspecting. Supply game-owned
   action buttons as children and suppress conflicting HUD elements.
6. Decide whether inspection is legal before passing a card or texture. Shared
   presentation must never look up a hidden card or submit an engine action.

Adoption status:

- Alpha Clash consumes the shared inspection, motion, card surface and spatial
  zone targets.
- Grand Archive consumes the shared card surface (including rounded edges),
  pose motion and texture cache. Its existing lineage/detail inspection remains
  game-owned; it has not yet been replaced by spatial inspection.
- Camera-fit tests cover Alpha Clash-style perspective XY and Grand Archive-style
  orthographic XZ layouts. They do not establish hosted-match or FPS acceptance.
- Cyberpunk and other sims can opt into these entry points; this change does not
  migrate their board layouts or inspection behavior.

The remaining game-owned features are rule prompts, action legality, private
information, zone arrangement, camera scale, card/board art, and game-specific
details such as Grand Archive lineage. Extend existing fixture/catalog pages
for visual proof; do not create a separate component gallery.

## Target modal

Import `TargetModal` from `@tcg/simulator-presentation/target-modal`.
Supply viewer-safe `cards` with stable ids, labels, optional art, aspect ratios,
and searchable details. A game-owned `filter` restricts the results before
search runs; the component never queries a catalog or determines legality.
`mode="select"`, controlled `selectedIds`, and `onCard` support multi-target
choices without submitting or closing automatically. Use the optional footer
for an authoritative confirm action; the built-in Done button only closes.
Inspect mode invokes the caller's inspection behavior. Empty/hidden-zone text
is supplied by the game. Selection uses the shared scale, lift, rim and glow.
Alpha Clash's cards/piles and zone controls use this component.

## Shared game prompts

The reusable prompt path has three layers:

1. `InteractionWorkspace` / `InteractionDraftProvider` (`@tcg/simulator-ui`)
   own the protocol draft, validation, request invalidation and submission.
2. `useInteractionSurface` (`@tcg/simulator-ui`) connects that draft to board
   targets and sheet visibility. `createPromptVisibilityStore` also backs
   Cyberpunk's existing minimize/restore/expand API. Each instance is isolated.
3. `TargetModal` / `PromptBanner` (`/target-modal`) render viewer-safe artwork,
   grouping, disabled reasons, selected rims, ordering positions, context and
   controls. `SharedInteractionPrompt` in the multi-game app composes these
   packages with the existing input widgets. It has no game-engine imports.

Alpha Clash uses this composition on its R3F board. Other games can use it
without changing their board coordinates or camera. Give it an interaction
view, the current viewer ID, a map of **viewer-safe** card labels/artwork, and
optional source/inspection callbacks. Pass visible instance IDs to the hook;
never pass hidden deck faces. Call `surface.select(instanceId)` from an R3F
click or keyboard button. Both write to the same draft.

Minimize and Escape only change visibility. They never skip or cancel a
required choice. Confirm/skip/cancel remain distinct protocol operations.
Opening a later request must not restore an earlier request's answers. Game
rules, payments, dice and attack semantics stay in their owning adapter.

### Visual QA

Open `/simulator-ui-fixtures/interactions/shared-prompts` in the existing
interaction inventory. The scenario selector includes target sheets, spatial
selection, unavailable candidates, modes, optional effects, ordering,
partitions, allocation, conditional choices, empty results and player targets.
Each scenario has its own `?case=` URL. The R3F board uses shared card motion,
selection rims, textures and inspection components.

- Choose targets, minimize, select on the board, restore, and compare selection.
- Confirm and check the submission evidence. Acknowledge the result to finish.
- Pause input or reject a submission to test recovery without losing choices.
- Start a new request to check reset. Test keyboard use and reduced motion.
- Compare wide and narrow windows. Confirm/close controls must remain reachable.

These are synthetic post-adapter fixtures, with illustrative Grand Archive art.
They prove shared presentation and protocol behavior, not native card rules or
hosted multiplayer. Cyberpunk currently reuses the visibility lifecycle; its
specialized choice widgets are not all migrated to this visual shell.

### Available card interactions

Use `availableInteractionCardIds(view)` from `@tcg/simulator-presentation/selection`
to read enabled action sources and enabled source-selection candidates. Effect
targets, disabled actions/candidates, waiting views and failed projections are
excluded. The adapter supplies legality; this helper contains no game rules.

Render `CardInteractionRim` from `@tcg/simulator-presentation/three` inside the
card pose group. Its thin rounded rim and soft halo follow the card, including
tilt, scale and motion. Supply `color` and `aspect` for the game theme and card size.
Do not draw availability on rectangular screen hit areas. Reserve the selection
checkmark for actual selection. Hide availability
when board input is blocked by an inspection, dialog or active choice. This cue
has no repeating animation and remains readable with reduced motion.
