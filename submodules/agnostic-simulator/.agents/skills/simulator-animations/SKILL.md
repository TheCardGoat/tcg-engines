---
name: simulator-animations
description: Build, debug, review, and validate game-agnostic TCG simulator animation state, card movement, layout reflow, viewer-safe visuals, command gating, fixtures, and browser tests in submodules/agnostic-simulator. Use for draws, transfers between zones, enter/exit presence, temporary anchors, Motion layoutId behavior, animation protocol changes, or multi-game animation integration.
---

# Simulator Animations

Keep animation lifecycle and rendering infrastructure game-agnostic. Let each
game adapter map native state and events into shared entity, zone, reference,
and animation-plan contracts.

## Required Context

1. Read the root, `submodules/`, and `submodules/agnostic-simulator/` guides.
2. Inspect the current protocol, transition store, provider, and the affected
   game adapter before changing behavior.
3. Read [references/architecture.md](references/architecture.md) for public
   contracts, ownership, integration steps, and validation commands.
4. Load a game rules skill only if the change alters event meaning, timing,
   legality, prompts, or other gameplay semantics.

## Architecture Rules

- Use stable Motion React APIs: `MotionConfig`, `LayoutGroup`, `layout`,
  `layoutId`, `AnimatePresence`, and `useReducedMotion`.
- Do not use React Canary, native document View Transitions, Motion+ alpha
  components, or hand-written WAAPI/FLIP as the simulator board runtime.
- Keep authoritative, settled, and presentation state in one transition store.
  Queue incoming updates there; do not add page-local plan queues or playback
  gates.
- Render the next presentation state during motion so destination geometry
  exists. Retain outgoing components with presence until movement and reflow
  finish.
- Reuse one required, viewer-safe entity visual for board and motion. Never add
  an optional generic animation fallback.
- Prefer shared `layoutId` movement when both entity slots render. Use the
  registered-node portal only for missing endpoints, true enter/exit, stacks,
  or multi-hop anchor paths.
- Register entity, zone, player, and anchor nodes through provider-scoped refs.
  Never scan global selectors or generate CSS containing entity ids.
- Preserve a suppressed portal source with `visibility: hidden`, `inert`,
  `aria-hidden`, and disabled pointer events. Do not use opacity alone.
- Treat layout as derived UI behavior. Do not emit `layoutShift` plan steps.
- Resolve hidden faces before calling a renderer. CSS is not a privacy boundary.
- Block command dispatch, pointer, keyboard, drag, targeting, and bots while a
  transition is active. Continue queueing authoritative updates.
- Scale one compiled timeline for visuals, audio, tests, and watchdog recovery.
- Snap safely for reduced motion, animation-off, resync, viewer changes, and
  expired hidden-tab animations.

## Game Boundary

Shared code may use only opaque ids and shared refs, entities, zones, faces,
timings, audio cues, and effect categories. Keep native event interpretation,
zone mapping, labels, icon tokens, temporary anchor ids, and visual components
inside the owning game adapter or UI.

A draw is an entity transfer. Its visible faces depend on the viewer-projected
source and destination, not on a special draw renderer.

## Validation

Start with protocol, runtime, and shared UI tests. Then run the deterministic
animation fixture in Chromium, Firefox, and WebKit. Validate the affected real
game route with source, mid-motion, reflow, and final-state evidence.

Report focused proof separately from broad workspace or unrelated failures.
