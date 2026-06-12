# Simulator Animation Convergence Plan

## Goal

Create one game-agnostic animation implementation for cards and zones that the real game simulators can use directly. Games should build complex moments by composing shared primitives such as zone transfer, draw, flip reveal, attach, exit, and layout shift instead of each game owning separate motion code for the same concepts.

The immediate target is Cyberpunk because it already has a real simulator board and an animation fixture route. The fixture must converge on the same components, anchors, visibility rules, and transition layer used by the production Cyberpunk simulator.

## Current State

- The animation fixture at `/cyberpunk/simulator/animation-fixtures` exercises shared simulator UI concepts, but it is not the same runtime path as the real Cyberpunk board.
- The fixture uses shared `@tcg/simulator-ui` pieces such as `Board`, `CardZone`, and `ZoneTransferAnimator`.
- The real Cyberpunk simulator uses game-specific board components and its own animation script player and WAAPI recipes.
- This split is useful for prototyping, but it is not acceptable as the final validation surface because the fixture can pass while the real simulator still has divergent transitions, anchors, or layout behavior.

## Non-Goals

- Do not rewrite the full Cyberpunk board before proving the shared primitives.
- Do not force all games to share the same visual card chrome.
- Do not put Cyberpunk nouns, rule concepts, or card rendering assumptions into the shared simulator UI package.
- Do not remove the existing Cyberpunk animation path until the shared path is mounted on the real board and validated.

## Acceptance Criteria

- A single shared animation layer can run a card transfer between any two registered zones.
- The same layer supports draw as a transfer from a hidden source zone into a private destination zone.
- Animation visibility is resolved per viewer before rendering card faces.
- Secret, private, and public zones are all represented in fixture tests.
- Empty zones keep stable dimensions while cards are in flight and after all cards leave.
- Neighboring cards do not jump or compress during a transfer.
- The fixture has no page scroll at desktop test size.
- The real Cyberpunk simulator can mount the shared layer with the real Cyberpunk card and zone components.
- Playwright validates both the primitive fixture and at least one real Cyberpunk board path.
- Reduced-motion mode has a deterministic non-motion fallback.

## Shared Concepts

### Zone Anchors

Every board zone that participates in animation should expose standard metadata through DOM attributes or an equivalent registration API:

- `data-sim-zone-id`
- `data-sim-zone-owner`
- `data-sim-zone-visibility`
- `data-sim-zone-role`

Examples of zone roles are `deck`, `hand`, `battlefield`, `discard`, `resource`, and `attachment-area`. Roles are descriptive. Animation routing should depend on IDs and visibility, not on game-specific role names.

### Card Anchors

Every rendered card entity that can move should expose:

- `data-sim-entity-id`
- `data-sim-zone-id`
- `data-sim-card-face`
- `data-sim-card-owner`

The rendered component can still be game-specific. The shared layer only needs an anchor rectangle and the viewer-safe face state.

### Visibility

Visibility must be resolved for the active viewer before animation rendering:

- `public`: all viewers can see the face.
- `private`: only the owning player can see the face.
- `secret`: no viewer can see the face unless an explicit reveal step grants access.

For draw animations, the owner should see the card flip or resolve into a visible hand card. The opponent should see the same physical movement but must only see the redacted card face.

## Shared Primitives

### `zoneTransfer`

Moves an entity from one registered zone anchor to another. This is the base primitive for moving cards between zones.

Required inputs:

- `entityId`
- `fromZoneId`
- `toZoneId`
- `viewerId`
- `fromVisibility`
- `toVisibility`
- `ownerId`
- `durationMs`

Expected behavior:

- Read the source rectangle before layout changes when possible.
- Read the destination rectangle after destination layout is stable.
- Render an overlay card during the transfer.
- Hide the source and destination real cards while the overlay owns the visual motion.
- Commit final layout only when the destination can absorb the card without causing visible jumps.

### `draw`

A semantic wrapper around `zoneTransfer` from a secret or private source into a private destination.

Expected behavior:

- Owner view can flip from back to face if the destination is visible to the owner.
- Opponent view keeps the card back or redacted private face.
- Draw sequences can chain multiple transfers without compounding layout jitter.

### `flipReveal`

Changes the face visibility of a card already anchored on the board.

Expected behavior:

- Uses the same viewer visibility resolver as `draw`.
- Does not expose hidden card identity in DOM text, alt text, or accessible names for unauthorized viewers.

### `zoneEnter` and `zoneExit`

Animate cards entering or leaving the board when there is no visible source or destination anchor.

Expected behavior:

- Use stable spawn or sink anchors when no real card rectangle exists.
- Keep zone dimensions stable before, during, and after the transition.

### `attach`

Moves a card into an attachment relationship with another entity.

Expected behavior:

- Uses `zoneTransfer` until an attachment anchor is available.
- The final layout is owned by the game component, not by the animation layer.

### `layoutShift`

Animates non-card position changes caused by card movement.

Expected behavior:

- Prevents cards adjacent to the moving entity from snapping abruptly.
- Runs only when the game board cannot reserve space ahead of time.

## Architecture Target

### Shared Package

Implement the shared runtime in `packages/simulator-ui`.

Recommended pieces:

- `SimulatorAnimationLayer`
- `SimulatorAnimationProvider`
- `useSimulatorAnimation`
- `SimulatorAnimationEvent`
- `SimulatorAnimationAnchorRegistry`
- `resolveAnimationCardFaceForViewer`

The provider should accept game-rendered card content through callbacks so the shared layer can render the right visual without knowing the game.

### Game Adapter

Each game should provide an adapter that maps engine or protocol animation steps to shared events.

For Cyberpunk, map the existing animation script steps to shared primitives first:

- `cardMove` to `zoneTransfer`
- draw-like moves to `draw`
- `cardEnter` to `zoneEnter`
- `cardExit` to `zoneExit`
- `cardAttach` to `attach`
- reveal-like steps to `flipReveal`

### Fixture

Keep the animation fixture, but change its job:

- Primitive lab: exercises shared animation events with controlled fake state.
- Real-board lab: mounts the real Cyberpunk board components with test controls and shared animation events.

Both modes should use the same shared animation layer.

## Implementation Phases

### Phase 1: Inventory and Baseline

1. Identify the real Cyberpunk board components that render zones and cards.
2. Identify the current Cyberpunk animation script player and WAAPI recipes.
3. List every current animation step shape and which shared primitive it maps to.
4. Capture current fixture behavior with Playwright screenshots and tests.
5. Capture at least one real Cyberpunk board scenario with current animations.

Exit criteria:

- Written mapping from Cyberpunk animation steps to shared primitives.
- Known baseline tests for fixture and real board.

### Phase 2: Add Real Board Anchors

1. Add standard zone attributes to real Cyberpunk zone components.
2. Add standard card attributes to real Cyberpunk card wrappers.
3. Add tests or browser assertions that all expected zones and card anchors exist.
4. Do not change animation behavior in this phase.

Exit criteria:

- Real Cyberpunk board exposes shared animation anchors.
- Existing Cyberpunk board behavior is visually unchanged.

### Phase 3: Define Shared Event Contracts

1. Add typed `SimulatorAnimationEvent` contracts in `packages/simulator-ui`.
2. Add viewer visibility input types for public, private, and secret zones.
3. Add a pure visibility resolver with unit tests.
4. Add reduced-motion behavior to the contract.

Exit criteria:

- Contracts are game-agnostic and type-safe.
- Visibility tests cover owner, opponent, and spectator-style viewers.

### Phase 4: Extract Shared Animation Layer

1. Convert the existing fixture `ZoneTransferAnimator` behavior into the shared layer.
2. Preserve FLIP-style source and destination measurement.
3. Preserve stable empty-zone dimensions.
4. Support chained draw sequences.
5. Add a registration API or standard query API for anchors.

Exit criteria:

- Fixture uses the shared layer for `zoneTransfer` and `draw`.
- Tests prove no source-zone contraction or neighbor jump during transfer.

### Phase 5: Mount on Cyberpunk Behind a Flag

1. Mount the shared animation layer around the real Cyberpunk board.
2. Keep the current Cyberpunk script player available as a fallback.
3. Translate Cyberpunk script steps into shared events.
4. Start with one primitive, preferably `zoneTransfer`.
5. Expand to `draw` and `flipReveal` only after transfer is stable.

Exit criteria:

- The real Cyberpunk board can run one shared `zoneTransfer`.
- The old path can still be used while parity work continues.

### Phase 6: Expand Fixture Coverage

1. Add fixture controls for viewer perspective.
2. Include secret, private, and public source and destination zones.
3. Add opening-hand draw sequences.
4. Add move-to-public-zone and public-zone-to-private-zone cases.
5. Add reduced-motion mode.

Exit criteria:

- Fixture covers the shared building blocks needed by games.
- Test cases assert viewer-safe card faces.

### Phase 7: Replace Duplicate Cyberpunk Recipes

1. Convert Cyberpunk recipe by recipe to shared primitives.
2. Keep each patch scoped to one primitive family.
3. Run real-board and fixture tests after each patch.
4. Remove old recipe code only after shared behavior passes parity checks.

Exit criteria:

- Cyberpunk uses the shared animation layer for card movement and draw.
- Duplicate game-specific movement recipes are removed or limited to game-only effects.

## Validation Plan

Run focused checks after each patch:

- `vp check` in `submodules/agnostic-simulator/packages/simulator-ui`
- `vp check` in `submodules/agnostic-simulator/apps/multi-game-simulator`
- Playwright fixture test for `animation-fixtures.spec.ts`
- Browser validation at `http://127.0.0.1:5173/cyberpunk/simulator/animation-fixtures`

For browser validation:

- Use desktop viewport first.
- Confirm the fixture has no page scroll.
- Trigger single draw, opening hand draw, private transfer, and public transfer.
- Change viewer perspective and confirm card faces are redacted correctly.
- Watch for source-zone contraction, destination jump, and neighboring card compression.
- Validate reduced-motion mode if available.

Run broad checks only after focused checks pass and the patch is not purely visual or docs-only.

## Motion Quality Requirements

- Keep durations short enough for frequent game actions.
- Use easing that reads as direct manipulation, not theatrical movement.
- Avoid large arcs, excessive scale, and camera-like motion.
- Avoid simultaneous layout shifts and overlay motion where possible.
- Reserve zone dimensions before animation starts.
- For chained draws, use short staggered transfers rather than one long sequence.
- Respect `prefers-reduced-motion`.

## Long-Running Agent Patch Checklist

For each patch:

1. State the owner package or app.
2. State the specific primitive or behavior being changed.
3. State the first rejecting check before editing.
4. Implement only that patch.
5. Run focused validation.
6. Use the browser for visible behavior.
7. Record failures exactly if a check cannot be fixed in the patch.
8. Stage only intended paths.
9. Commit with the primitive or behavior name in the message.

## Recommended First Patches

1. Add standard animation anchors to the real Cyberpunk board and tests. This should not change visual behavior.
2. Add typed shared animation event contracts and visibility resolver tests.
3. Extract the fixture transfer behavior into `SimulatorAnimationLayer`.
4. Mount `SimulatorAnimationLayer` on the real Cyberpunk board behind a feature flag.
5. Translate Cyberpunk `cardMove` into shared `zoneTransfer`.
6. Translate Cyberpunk draw sequences into shared `draw`.

## Stop Conditions

Stop and report before continuing if:

- Real Cyberpunk card or zone components cannot expose stable anchors without a structural board rewrite.
- Viewer visibility cannot be resolved before rendering hidden card content.
- A primitive requires game rules knowledge inside `packages/simulator-ui`.
- Fixture tests pass but real-board browser validation shows divergent behavior.
- A patch requires touching unrelated game engine rules or platform services.
