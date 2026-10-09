# Tabletop UI framework

This is the component and renderer design for `@tcg/simulator-ui`. It is based on
the current Cyberpunk V2 implementation in this checkout, inspected on 2026-10-03.
It extends the existing library. It does not introduce another engine or UI toolkit.

## Delivery and scope

- Existing shared components form the initial library listed below.
- `TabletopDie` and `TabletopDieButton` are implemented and exported. Cyberpunk's
  `DieDisplay` uses the shared face for its shape, image, and font modes.
- Storybook's **Simulator UI / Tabletop Library** shows dice states and a shared
  card/counter/dice composition under Cyberpunk and Gundam themes. This demonstrates
  presentation reuse, not a second game's rules integration.
- The 3D scene extraction below is a migration design, not a completed migration.
  Current Cyberpunk meshes, layout, camera, and texture loading remain game-local.
- 60 FPS is an acceptance target. This document is not a frame-rate certification.

### Live catalog and source inventory

`/component-catalog` renders actual components for Cyberpunk, Flesh and Blood,
Gundam, Naruto, One Piece, Grand Archive, Riftbound, and Alpha Clash. Lorcana's
dedicated simulator is outside this workspace's catalog.

The Inventory family lists exported runtime components and compositions from
the shared library and game UI sources. It follows export barrels to implementation
files and excludes types, tests, and Storybook examples. Providers and whole pages
are included; the total is not a count of independent visual primitives. Generate
and verify the inventory from `apps/multi-game-simulator`:

```sh
node scripts/catalog-inventory.mjs
node scripts/catalog-inventory.mjs --check
```

Registered fixtures are separate from production adoption and verified states.
Missing fixtures remain visible rather than being counted as covered by a source
file or by a link to an unrelated whole-board example.

The catalog is production-first. Isolated card and zone examples import the
components used by each game board and supply existing fixture data. The card
workbench requires an explicit game renderer. It does not substitute generic
zones, counter badges, turn indicators, or new shared mobile compositions.

The Production board family mounts the existing visual-fixture route in a live
embedded browsing context. That route supplies the same board, providers, skin,
and interaction wiring used by the fixture page. Loading is explicit so compare
mode does not start eight simulators at once. Alpha Clash renders its production
LiveBoard directly with local fixture data. Board previews are actual rendering,
not captured images. Missing isolated previews remain visible as gaps.

The earlier shared-library demonstrations are not production game coverage and
are no longer exposed by this catalog. New reusable components need adoption by
a production board before this catalog can claim that game's usage. Inventory
registration no longer treats these demonstrations as game previews.

Browser checks of this correction confirm that Cyberpunk V2 loads its existing
combat board and One Piece loads its resource-board fixture. Focused routing and
card-control tests verify the production-only family list and explicit renderers.
Full native component/state coverage and frame-performance qualification remain
unproven.

Remaining completion work includes the rest of the shared/native component
fixtures and state permutations, consistent game skin slots, scene extraction,
production adoption, and the performance acceptance matrix below.

## Current UI analysis

Source roots, relative to `agnostic-simulator`:

- `UI`: `packages/simulator-ui/src`
- `CP`: `apps/multi-game-simulator/src/games/cyberpunk`
- `V2`: `CP/components/BoardV2`
- `Board`: `CP/components/GameBoard`

The populated `retailCombatGigBench?ui=v2&ai=off` board was inspected in the in-app
browser. The central field, hand fan, edge piles, dice lanes, resource totals,
clock console, and primary action create a clear game surface. Reuse those
relationships. Keep card art, metal housings, dice faces, and type treatment in
the Cyberpunk skin.

The current implementation uses a landscape world, with a perspective WebGL
scene and DOM interaction plane. `V2/Scene.tsx` uses `frameloop="demand"` and
`dpr={[1, 2]}`. It updates card motion in `useFrame` and subscribes to drag motion.
`V2/viewport.ts` and `layout.ts` align the scene and DOM. These are useful starting
points, but they are not yet generic APIs. The current source takes precedence
over older portrait-layout notes and earlier DPR limits in the V2 README.

Main extraction risks:

1. `CyberpunkBoardV2.tsx` combines game providers, eligibility, layout, and visuals.
   Moving the complete component into the shared package would move game rules
   and state assumptions with it.
2. `Scene.tsx` imports `CardDragSource` and `CardInteractionAppearance` from the
   game. Shared meshes must accept presentation data and generic drag motion.
3. A scaled board can make controls smaller than their intended touch size.
   Camera fit alone is not a mobile interaction strategy.
4. Cards have both scene and DOM representations. Transfers, hover, selection,
   and hidden identities need one visual owner and one input owner per object.
5. Existing shared components are numerous but not a uniform skin API. For
   example, `TabletopActionButton` still has fixed surface colors. Do not claim
   every existing control is fully themeable.

## Component inventory

“Shared” means implemented in `UI`, not that Cyberpunk V2 uses it everywhere.
“Extract” means a proposed boundary; it is not an exported component yet.

| Family | Current sources | Shared API or extraction boundary | Status |
| --- | --- | --- | --- |
| Viewport and tools | `V2/MatchViewportV2.tsx`; `UI/components/SimulatorViewportShell.tsx` | Shell, rails, drawer, sidebar portals | Shared; game composition stays local |
| Table and camera | `V2/Scene.tsx`, `viewport.ts`, `useFlatBoardLayout.ts` | Proposed `TabletopScene` and one projection service | Extract |
| Surface skin | `V2/boardSurface.ts`, `BoardSurfacePicker.tsx` | Surface image/material descriptor; preference storage stays outside renderer | Extract |
| Texture lifecycle | `V2/BoardTextureLoader.ts` | Shared scene asset cache, bounded retry, disposal and failure fallback | Extract with scene |
| Card face and privacy | `UI/components/CardFace.tsx`, `ViewerSafeCardImage.tsx`, `entity-visibility.ts` | `CardFace`, `ViewerSafeCardImage`, face projection | Shared |
| Physical cards | `V2/Scene.tsx` (`CardMesh`); `Board/Card.tsx` | Proposed `TabletopCardMesh`; existing `CardInteractionFrame` owns DOM input | Mesh extraction needed |
| Card placement | `UI/components/CardSlot.tsx`, `FixedSlotCardZone.tsx`, `CardGrid.tsx`, `CardRow.tsx` | Slots, fixed lanes, grid, row | Shared DOM blocks |
| Hands | `V2/layout.ts`; `UI/components/CardFan.tsx`, `HandZone.tsx`, `CompactHandZone.tsx` | Shared fan and hand controls; world-space layout remains separate | Shared DOM; extract world placement |
| Empty and single zones | `UI/components/ZoneFrame.tsx`, `EmptyZone.tsx`, `SingleCardZone.tsx` | Labeled, bounded zones and empty states | Shared |
| Piles and reveals | `Board/DeckZone.tsx`, `TrashZone.tsx`; `UI/components/CardStack.tsx`, `DeckStackZone.tsx`, `DiscardPileZone.tsx`, `DeckRevealShelf.tsx` | Stack and reveal shelf; game supplies viewer-safe contents | Shared DOM; mesh stack extraction needed |
| Attachments | `UI/components/TabletopAttachmentStack.tsx`; `V2/layout.ts`, `V2/Scene.tsx`, `Board/Card.tsx` | Shared DOM attachment layout and inspection; world offsets remain game-local | DOM shared; scene extraction and production adoption remain |
| Dice | `Board/DieDisplay.tsx`, `CP/components/DieAssets/dieAssets.ts` | `TabletopDie`, `TabletopDieButton` | Shared face/control added; Cyberpunk skins retained |
| Dice lanes | `Board/GigsRow.tsx`, `GigZone.tsx`, `FixerZone.tsx`, `CenterRow.tsx` | Reuse flex/zone composition; extract layout only after a second consumer | Game semantics remain local |
| Counters | `UI/components/TabletopCounterBadge.tsx`, `SeatSummary.tsx` | Label, value, compact/circle/pill display | Shared; values supplied by adapter |
| Tokens and resources | `UI/components/TokenRow.tsx`, `ResourceCardZone.tsx`; `Board/EddiesZone.tsx` | Token row and resource zone | Shared; spending/payment remains local |
| Player identity | `V2/PlayerNameplate.tsx`; `UI/components/SeatSummary.tsx`, `SimulatorMatchSidebar.tsx` | Participant view and status data; world-space plate proposed | Shared HUD; plate extraction needed |
| Turn and priority | `Board` pass/clock controls; `UI/components/TurnIndicator.tsx`, `PriorityRing.tsx`, `ClockReadout.tsx`, `ChessClock.tsx` | Readout and emphasis; game supplies active seat and action | Shared primitives |
| Primary action | `UI/components/TabletopActionButton.tsx`; V2 action artwork | Button input plus skin slots for normal, pending, disabled, confirm | Shared input; skin API still incomplete |
| Inspection and menus | `CP/components/CardContext`; `UI/components/CardInspector.tsx`, `CardDetailSheet.tsx`, `CardContextMenu.tsx` | Inspection, accessible menus and game-owned visual identity | Shared |
| Drag/drop | `Board/DragDropContext.tsx`; `UI/components/PointerDragDropSurface.tsx`, `PointerDraggable.tsx`, `PointerDroppable.tsx`, `drag-motion.ts` | Input mechanics, drag motion and disposition | Shared; legal destinations stay local |
| Targets and combat intent | `UI/components/TargetingOverlay.tsx`, `TargetingArrow.tsx`, `CombatIntentOverlay.tsx` | Candidate emphasis and intent arrows | Shared; candidate calculation stays local |
| Choices and payment | `CP/components/CyberpunkInteractionPanel.tsx`; `UI/components/InteractionResolutionPrompt.tsx`, `ChoiceModal.tsx`, `ChoiceChips.tsx` | Prompt, selection and confirmation | Shared controls; costs and labels stay local |
| Transfers and feedback | `CP/animation`; `UI/animation` | Animation scope, anchors, entity slots, spatial renderer hooks, value deltas | Shared runtime with game renderers |
| Logs, chat and history | `UI/components/EventLogPanel.tsx`, `ChatPanel.tsx`, `MatchHistoryPanel.tsx` | Collapsible operational surfaces | Shared |
| Connection and completion | `UI/components/ConnectionPanel.tsx`, `DropClaimControl.tsx`, `PostGameModal.tsx`, `SimulatorRouteStatus.tsx` | Status, recovery and completion presentation | Shared; authority remains outside UI |
| Accessibility | `UI/components/AccessibilityAnnouncer.tsx`, `KeyboardNavigator.tsx` | Announcements, focus and keyboard navigation | Shared; each composition must verify use |

## Framework boundaries

```text
Game engine: authoritative state, legality, random outcomes, clocks
    ↓
Game adapter: viewer-safe entities, zones, counters, interaction candidates
    ↓
Game composition: zone arrangement, labels, skin, callbacks
    ↓
Shared UI: cards, dice, counters, zones, prompts, input, accessibility
    ↔ shared animation scope: accepted transitions and semantic anchors
    ↓
DOM renderer                         Optional scene renderer
controls, text, dialogs, focus        table, card meshes, physical motion
```

Use the existing `SimulatorEntity`, `SimulatorZone`, `SimulatorCounter`, and
interaction contracts in `simulator-contract`. `EntityKind` already includes
`die` and `token`; do not create a parallel “universal game state”. Presentation
props can be smaller than the contract, as with `TabletopDie`.

Separate three state lifetimes:

- Authoritative state: accepted game versions, public values and permitted actions.
- Interaction draft: hovered object, selected candidates, an uncommitted drag.
- Presentation state: interpolation, texture readiness, transfer snapshots.

Only the first changes rules state. A roll animation cannot produce a result.
A drop cannot create a legal action. No hidden identity may reach a texture URL,
DOM label, tooltip, log, or transition snapshot.

Current animation entry point: `createSimulatorAnimationScope`. Use its spatial
transfer/state-change renderers and `useAnimationNode` registrations. Do not
add another scheduler or assume an older animation surface is still the owner.
Keep command gates tied to the existing transition policy, not a local timeout.

### Proposed scene interface

Extract a separate optional scene entry point only when the first mesh migration
lands. Keep Three.js out of the DOM-only dependency path. The interface needs:

| Input | Responsibility |
| --- | --- |
| Object ID and viewer-safe face | Stable identity and permitted artwork only |
| Rect, rotation, depth and attachment offsets | Game layout output in documented world units |
| Selected, hovered, targetable and muted appearance | Presentation flags mapped by the game |
| Shared drag motion and semantic animation reference | One motion owner across scene and DOM |
| Camera/surface/quality configuration | Presentation only; no fixed Cyberpunk seats or zones |
| Projection output | Same matrix and rectangles for DOM hits and rendered objects |
| Failure and disposal callbacks | Recoverable UI and bounded GPU resource lifetime |

The renderer must not import a game engine, native action ID, card definition,
`humanSide`, Gig concept, or payment selection. Keep the Cyberpunk 1600 × 900
arrangement as one composition, not the universal table layout.

## Design system

Use Mantine for dialogs, menus and standard controls. Use existing simulator
components for game objects. Follow root `DESIGN.md` for density and hierarchy.
Extend `styles/theme.css` rather than adding a second global palette.

| Token or rule | Use |
| --- | --- |
| `--board-surface`, `--board-surface-soft` | Readable panels and passive zones |
| `--board-text`, `--board-muted` | Primary and secondary text |
| `--board-border`, `--board-border-strong` | Quiet boundaries and emphasis |
| `--game-accent` | Selection and primary action; never the only state signal |
| `--tabletop-die-size` | Optional die-face size; interactive wrapper retains a 44px minimum |
| Card aspect ratio | Preserve source artwork; layout owns size, not image distortion |
| Spacing | 4/8/12/16px rhythm; compact operational surfaces |
| Focus | Visible 3px outline outside the control; never clipped by a face mask |
| Layers | Table → objects → interaction cues → transient effects → dialogs |

A skin supplies artwork, font, accent and surface variables. It does not supply
rules, event listeners, or another state store. Each object needs idle, focused,
selected, targetable, disabled, pending and failure cases where applicable.
Differentiate states with text, shape, border or icon as well as color.

Keep the normal playfield clear. Show tools in the existing drawer/sidebar.
Use one obvious primary action, with its current verb supplied by the game.
At narrow widths, reflow HUD controls or use rail portals; do not just shrink
their hit areas with the world. Cards can stay small if inspection is easy.
Every drag action needs a click/tap or keyboard path to the same decision.

## Motion and 60 FPS contract

The target is a 16.67ms frame budget on a 60Hz display during active motion.
Idle demand rendering should not draw continuously. A target is not a guarantee:
measure the shipping composition on named devices and record failures.

Proposed engineering budgets (acceptance criteria, not current measurements):

- Reserve roughly 8ms for main-thread work and 8ms for rendering/compositing per
  active frame. These are diagnostic allocations; CPU and GPU work can overlap.
- Give immediate local press/selection feedback within 100ms. Network completion
  is separate; keep a pending indicator until the accepted result arrives.
- Use 100–160ms for control feedback, 160–240ms for menu transitions, and
  220–400ms for ordinary card transfers. Major effects must remain skippable.
- Animate DOM `transform` and `opacity`. Avoid per-frame width, position, layout
  reads, blur, large shadow changes, and React state updates.
- Measure anchors once at transition start. Refresh on resize/layout change.
  Batch reads before writes. Use the shared drag-motion store for pointer motion.
- In R3F, mutate mesh refs in `useFrame`, reuse geometry/materials, and invalidate
  only while motion is active. Stop invalidation after convergence.
- Cap DPR by quality tier. Reduce shadows and effects before reducing card
  readability. Avoid decoding a large texture in the middle of a drag.
- Reduced motion removes travel, shake and spin; preserve destination state,
  readable result and focus. Use the existing animation speed controls too.
- Finish or cancel transitions safely on reconnect, replay seek, route change,
  object removal and unmount. Decorative effects must not intercept input.

### Performance acceptance run

Record browser version, device, power mode, viewport, DPR, build SHA and cold/warm
asset state. Use a production build for frame-rate acceptance; a development
fixture is useful for diagnosis only.

1. Use `retailCombatGigBench`, `retailGearLegendBench`, and `handFanOverflow` with
   `ui=v2&ai=off`. Include a draw/transfer, sustained card drag, hover across the
   crowded field, dice selection, prompt opening, and viewport resize.
2. Warm assets, then capture three 10-second active-motion browser performance
   traces per case. Record frame intervals, dropped frames, main-thread long tasks,
   React commits, texture uploads, draw calls and memory. Inspect cold load separately.
3. At 60Hz, require at least 95% of frame intervals within 18ms, no sustained
   missed-frame run over 100ms, and no input-path long task over 50ms. Inspect
   p95 and p99, not just average FPS. A high-refresh display needs its own budget.
4. Run at 1440 × 900, 844 × 390 and 390 × 844. Test on a real touch device as
   well as viewport emulation. Check hit areas, focus and scroll behavior.
5. Repeat with reduced motion and an interrupted/rejected action. Confirm final
   state and accessible result match the normal path. Leave the table idle and
   confirm rendering settles. Compare memory after repeated load/unload cycles.

Do not use a screenshot, jsdom test, average requestAnimationFrame rate, or an
idle FPS counter as proof of WebGL animation performance.

## Adoption order and completion gates

1. **Library baseline (this change):** inventory, shared dice, Cyberpunk face
   adoption and Storybook examples. Existing cards/counters/zones remain the base.
2. **Scene primitives:** extract projection, texture lifecycle, card mesh and
   stack mesh behind the proposed interface. Move one Cyberpunk zone first.
   Require identical browser placement, keyboard action and privacy behavior.
3. **Reusable compositions:** extract attachment layout and HUD skin slots.
   Prove a second game with different zones, orientation and resource semantics.
   Only then stabilize the scene API; do not promote speculative game models.
4. **Performance qualification:** run the trace matrix above, repair measured
   bottlenecks and retain traces with the exact build. Keep each migration small.

For each new primitive, add a Storybook case for empty, dense, hidden, disabled,
selected, reduced-motion and asset-failure states where relevant. Test behavior
through public input; verify visual changes in the browser. A component is ready
for wider use only after both its semantic behavior and rendered states are checked.

## Evidence limits

Validation for this delivery:

- `pnpm run typecheck` in `packages/simulator-ui`: passed.
- `TabletopDie.test.tsx`: 3 tests passed (zero/symbol/unresolved values, skin
  semantics, enabled/disabled input and controlled selection).
- Cyberpunk `CenterRow.gig-die-popover.test.tsx` and
  `CenterRow.gig-die-order.test.tsx`: 3 tests passed.
- Focused formatting and component lint: passed.
- In-app browser: shared library at 1280 × 720 and 390 × 844; click and
  Tab/Space selection; dark/light theme composition; Cyberpunk shape dice retained.

The local simulator was already running on port 5193. Docker was unavailable.
The V2 populated board was rendered in the in-app browser. This is local fixture
evidence, not hosted multiplayer, mobile-device or 60 FPS performance proof.
The workspace contains concurrent animation edits; those remain outside this
change. No engine, game rules, network protocol or deployment changes are needed
for this initial library work.
