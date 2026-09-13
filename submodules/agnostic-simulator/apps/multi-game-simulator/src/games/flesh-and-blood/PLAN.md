# Flesh and Blood Simulator UI — Implementation Plan

> **Current desktop implementation (2026-07):** The phase plan below is
> historical. The simulator now has a shared-shell, FAB-owned desktop/tablet
> board across fixtures, local practice, AI practice, and live-match
> presentation. Desktop keeps the existing game-agnostic
> `SimulatorViewportShell`, sidebar, card/zone primitives, animation boundary,
> and inspector modal; only FAB's native arena grammar is game-owned.
>
> - `<768px>` retains the portrait mobile board. `768–1023px` uses the desktop
>   board with the shared sidebar drawer; `>=1024px` keeps the shared sidebar
>   persistently open on the left.
> - Each upright player seat uses three equal card rows: Head / Chest + Arms /
>   Legs; Permanents / Weapon + Hero + second weapon position / Arsenal; and
>   Graveyard / Pitch + Deck / Banished. Both hands stay visible at the outer
>   edges. Cards retain their full `5:7` portrait ratio.
> - Combat is a transient, non-modal center overlay. A closed chain is compact;
>   active chain links expand over a gently dimmed but still visible board.
> - Desktop is click-first. Hand-card selection exposes existing legal actions
>   in the shared sidebar. Public and owner-visible piles use the existing
>   inspector dialog. The former inert drag affordance was intentionally
>   removed.
> - The board/page does not scroll. Only a dense hand/history lane may scroll
>   horizontally after card overlap and compression are exhausted; an inspector
>   may scroll vertically.
> - This certifies the desktop presentation layer only. Live server-authority,
>   reconnect reconciliation, and anti-cheat ownership remain separate work.

Build a working FAB tabletop that renders the engine's `projectFabViewerState`
through the shared `@tcg/simulator-ui` components, for both desktop and mobile,
using the **server-authoritative** model (FAB's adapter implements
`ServerGameEngine`).

> **Hero special UI:** per-hero resource / token / zone requirements, shared
> modules, and ASCII visual text fixtures for UX acceptance live in
> [`hero-special-ui/`](./hero-special-ui/README.md) (`UX_HANDOFF.md`,
> `text-fixtures.md`). Implement shared modules first; compose per hero.

> **Engine-readiness constraint:** the boilerplate engine models **6 zones +
> hero/life only** (`submodules/flesh-and-blood/packages/engine/src/state.ts:8`,
> `FabZoneKind = deck|hand|graveyard|banished|arsenal|pitch`, plus
> `heroCardId`/`life`). It does **not** yet model the arena (head/chest/arms/
> legs/weapon), permanent (allies/auras), combat chain, or stack. The plan is
> phased: **Phase 1 renders what exists**; the full hero-equipment-combat-chain
> playmat is **Phase 2/3, gated on engine growth**. The UI projection must be
> written so arena zones drop in without restructuring.

---

## 1. Authoritative zone model (FAB Comprehensive Rules)

Source: `submodules/flesh-and-blood/.agents/skills/fab-rules/references/flesh-and-blood-comprehensive-rules/03-zones.md`.
Glossary: `references/glossary.md`.

Zone ownership and sharing (CR 3.0.2):

- **Per-player:** arms, arsenal, banished, chest, deck, graveyard, hand, head,
  hero, legs, pitch; plus **two** weapon zones.
- **Shared (ownerless):** stack, permanent, combat chain.

Arena (CR 3.1.1) = arms, chest, combat chain, head, hero, legs, permanent,
weapon. **Not** in the arena (3.1.1a): arsenal, banished, deck, graveyard, hand,
pitch, stack.

Physical layout is a tournament-rules convention (3.0.6), not the CR — the
playmat arrangement in §3/§4 is the standard LSS playmat convention.

### Zone → component mapping

| Zone         | CR ref | Visibility                                               | Owner  | `layoutHint` | Shared component                                       |
| ------------ | ------ | -------------------------------------------------------- | ------ | ------------ | ------------------------------------------------------ |
| Hero         | 3.11.1 | public                                                   | player | —            | `SingleCardZone` (+ soul as stacked sub-cards, 3.11.5) |
| Hand         | 3.9.1  | private (owner)                                          | player | `fan`        | `HandZone` / `CardFan`                                 |
| Arsenal      | 3.3.1  | private (owner)                                          | player | `stack`      | `SingleCardZone` (≤1 card, 3.3.2)                      |
| Deck         | 3.7.1  | private (secret to all, 3.7.4)                           | player | `stack`      | `DeckStackZone`                                        |
| Pitch        | 3.14.1 | public                                                   | player | `stack`      | **`DiscardPileZone`** (face-up pile, like graveyard)   |
| Graveyard    | 3.8.1  | public                                                   | player | `stack`      | **`DiscardPileZone`**                                  |
| Banished     | 3.4.1  | public                                                   | player | `grid`       | `DiscardPileZone` or compact `CardGrid` (can grow)     |
| Head         | 3.10   | public, 1 card                                           | player | —            | `SingleCardZone`                                       |
| Chest        | 3.5    | public, 1 card                                           | player | —            | `SingleCardZone`                                       |
| Arms         | 3.2    | public, 1 card                                           | player | —            | `SingleCardZone`                                       |
| Legs         | 3.12   | public, 1 card                                           | player | —            | `SingleCardZone`                                       |
| Weapon       | 3.16   | public, **two** zones (3.0.2; 2H occupies both, 3.16.2a) | player | —            | `SingleCardZone` ×2                                    |
| Permanent    | 3.13.1 | public                                                   | shared | `row`        | `CardRow`                                              |
| Combat chain | 3.6.1  | public                                                   | shared | —            | **custom `CombatChain`**                               |

> Note: pitch and graveyard are both public zones _outside_ the arena, each a
> face-up pile owned by a player (3.14.1 / 3.8.1) — they share the same
> `DiscardPileZone` treatment. Do **not** use `ResourceCardZone` for pitch.

This table is the single source of truth for the projection's
`role`/`visibility`/`layoutHint` mapping (mirrors
`games/riftbound/RiftboundTabletop.tsx:484` `zoneModel`).

---

## 2. Desktop layout — mirrored vertical playmat

Adapts the physical FAB playmat to the vertical-mirror pattern Gundam/Riftbound
use (`games/gundam/src/components/ui/playerSeat/PlayerSeat.tsx:68`,
`side: "top"|"bottom"`). The `SimulatorViewportShell` owns the sidebar + rails;
the tabletop is a 3-row flex column.

```
┌──────────────────────────────────────────────────────┐ SimViewportShell
│ ┌────────────────────────────────┐ ┌────────────────┐│
│ │ OPPONENT (top, rotated 180°)   │ │ SIDEBAR        ││
│ │  hand fan (face-down)          │ │ EventLogPanel  ││
│ │  hero cluster (mirrored)       │ │ Statements     ││
│ │  permanents  [pitch][deck][gy] │ │ Actions        ││
│ │  [banished]                    │ │ (concede/end)  ││
│ ├──── COMBAT CHAIN (center) ─────┤ │                ││
│ │  attack → defense + reactions  │ │                ││
│ ├────────────────────────────────┤ │                ││
│ │ PLAYER (bottom)                │ │                ││
│ │  permanents  [pitch][deck][gy] │ │                ││
│ │  hero cluster                  │ │                ││
│ │  hand fan (face-up)            │ │                ││
│ └────────────────────────────────┘ └────────────────┘│
└──────────────────────────────────────────────────────┘
```

### Hero cluster (official LSS playmat arrangement)

Equipment sits around the hero in a fixed "clock" arrangement; the opponent's
cluster is rotated 180° at the top.

```
                 [Head]
  [Weapon₁][Weapon₂]  [Hero]  [Chest]
                          [Arms]
                          [Legs]
```

- **Hero** center; life badge via `TabletopCounterBadge`.
- **Weapon** directly left (up to two slots for 2H, 3.0.2 / 3.16.2a).
- **Head** top-right; **Chest** right; **Arms** below-right; **Legs** directly
  below hero.
- Hero **soul** (3.11.5) renders as stacked sub-cards under the hero.

---

## 3. Mobile layout — vertical stack + drawers

Use `SimulatorViewportShell`'s `mobilePanel`/`mobileTopRail`/`mobileBottomRail`
(breakpoint 767; see `games/riftbound/RiftboundTabletop.tsx:249-269`). Opponent
compressed at top, combat middle, player bottom; sidebar collapses to a drawer.

```
┌──────────────┐  topRail: opp name · status · [☰ panel]
├──────────────┤  OPPONENT (compact)
│ [hero]+life  │   hand as facedown strip
│ [deck][gy]   │
├──────────────┤  COMBAT CHAIN (compact, tap to expand)
├──────────────┤  PLAYER
│ [hero]+life  │
│ [pitch][gy]  │   hand = bottom-anchored CardFan (sticky)
├──────────────┤  bottomRail: [End Turn] [Concede] [Log]
└──────────────┘  drawer: EventLogPanel + Statements
```

Mobile specifics:

- Hand uses `useStickToBottom` (`hooks/useStickToBottom.ts`).
- Opponent hand renders as a compact facedown `CardRow`.
- Hero/equipment cluster compresses to a single row
  `[weapon] [hero+life] [chest/head small]`; legs/arms fold into a tap-to-open
  `MobileZoneInventoryPopover` (shared `MobilePortraitBoard` export).

---

## 4. Custom Combat Chain component (Phase 3, the complex one)

A bespoke component, not a `CardRow`. It models a chain link (CR ch.7) and must
render:

```
        ┌─ active chain link ─────────────────────────┐
  attacker →  [Attack card · power]                    │
              defending: [block cards stacked · Σ def] │
              reactions: [atk reaction][def reaction]  │
              → projected damage (power − Σ defense)   │
        └─────────────────────────────────────────────┘
```

- **Attacker** card with its **Power** (2.9) and source object (action / weapon
  / hero ability).
- **Defending** cards stacked, total **Defense** (2.3) — hand blocks, equipment
  (battleworn/blade break/temper counters), defense reactions.
- **Reaction** cards (attack reaction 7.4 / defense reaction 7.4) layered
  around the link.
- **Hit/damage** readout: Power − total Defense, plus keyword modifiers
  (Dominate / Overpower / Piercing).
- **Multiple chain links** history (prior resolved links).
- Reuse `CombatIntentOverlay` + `TargetingArrow` (`@tcg/simulator-ui`) for the
  attacker→defender spatial arrow, but the **chain-link stack itself is
  bespoke** — no shared zone component captures power-vs-defense arithmetic or
  the layered reaction structure.

`CombatChain` projects from a `combatChain` array on the viewer state (an engine
zone the boilerplate doesn't model yet — Phase 3).

---

## 5. Projection layer (the core deliverable)

New module `apps/multi-game-simulator/src/games/flesh-and-blood/projection.ts`.
Two pure functions mirroring `RiftboundTabletop.tsx:464-509`:

```ts
entityFor(card: FabCardRef, viewer: FabViewerState, reveal: boolean): SimulatorEntity
zoneFor(ownerId: string, kind: FabZoneKind, cardIds: string[], viewer): SimulatorZone
```

- **`entityFor`** — maps a FAB card to `SimulatorEntity`
  (`packages/simulator-contract/src/index.ts:143`). `kind`: hero → `leader`,
  else `card`. `face`: `"public"` unless the instance id is `FAB_FACE_DOWN`
  (`submodules/flesh-and-blood/packages/engine/src/view.ts:22`) → `"hidden"`.
  `stats`: life for hero; pitch value/cost/power/defense otherwise. Use
  `projectSimulatorEntityForFace` for the hidden-face contract. `imageUrl` via
  `buildCardImageUrl` (`lib/urlBuilder.ts`).
- **`zoneFor`** — builds `SimulatorZone`
  (`packages/simulator-contract/src/index.ts:163`) using the §1 table.
  `id = ${ownerId}:${kind}`, `visibility`/`role`/`layoutHint` per table. Reuse
  Riftbound's `zoneModel` shape exactly (`RiftboundTabletop.tsx:484`).
- **Face-down sentinel** — the viewer state already returns `"face-down"` for
  deck/hand(opponent)/arsenal(opponent) (`view.ts:80-82`). The projection
  renders these as `face:"hidden"` entities with count preserved — never
  fabricate ids. This is the CR 3.0.3a / 3.0.4a enforcement already validated
  in engine tests.

Card metadata source: the engine is card-id-opaque, so the projection needs a
`cardDefinitions` map (cardId → name/type/imageUrl/stats) built from the
adapter's `cardsMaps`. Mirror how Riftbound threads `state.cardDefinitions` into
`entityFor` (`RiftboundTabletop.tsx:469`). For FAB this map comes from
`@tcg/flesh-and-blood-cards` (the generated catalog) or the adapter's
`extractCardsMapsFromSnapshot`.

---

## 6. Component composition — file by file

Base dir: `apps/multi-game-simulator/src/games/flesh-and-blood/`

### `FleshAndBloodTabletop.tsx` (new — the centerpiece)

Mirror `RiftboundTabletop.tsx` structure but **server-authoritative** (state
arrives via props from the live provider, no client reducer). Composition order:

1. `createSimulatorAnimationScope<FabPresentationState>()`
   (`RiftboundTabletop.tsx:76`)
2. `FabAnimation.Root` with `projection.getEntity/getZone` → the §5 functions
   (`RiftboundTabletop.tsx:53-69`)
3. `entityRenderer={DefaultSimulatorEntityVisual}` (or a FAB card-face later)
4. `AnimationInteractionBoundary` > `PointerDragDropSurface` > board
5. Board = `PlayerBoard(opp)` + `CombatChain(center)` + `PlayerBoard(self)` —
   three-row flex (`RiftboundTabletop.tsx:212-238`)
6. Wrap in `SimulatorViewportShell` with `tabletop`/`sidebar`/`mobilePanel`/
   `mobileTopRail`/`mobileBottomRail` (`RiftboundTabletop.tsx:244-270`)
7. `InteractionResolutionPrompt` mounted when `getInteractionView()` returns a
   prompt (Phase 2 prompts; Phase 1 stubs it)

### `PlayerBoard.tsx` (new — one seat)

Mirror Gundam's `PlayerSeat.tsx` (side=`"top"|"bottom"`, mirrored rows) but
compose shared zones:

- `SeatSummary` (life as `SimulatorCounter`) — `SeatSummary.tsx:11`
- Hero cluster: `SingleCardZone` for hero (Phase 1); equipment/weapon slots
  per §2 clock arrangement (Phase 2)
- Pile row: `DiscardPileZone` (pitch) + `DeckStackZone` (deck) +
  `DiscardPileZone` (graveyard) + banished + `SingleCardZone` (arsenal)
- Hand: `HandZone`/`CardFan` (`HandZone.tsx:15`), face-up for self, face-down
  for opponent
- Turn/priority: Gundam's `SeatTurnIndicator` pattern (`PlayerSeat.tsx:164`) or
  the shared `PriorityRing`

### `CombatChain.tsx` (new — Phase 3; Phase 1 stubs an `EmptyZone` slot)

Bespoke chain-link renderer per §4. Phase 1 reserves the center slot with a
labeled `EmptyZone`.

### `projection.ts` (new — §5)

### `animation.ts` (new — Phase 1 trivial)

`fabActionToAnimationPlan(...)` returning a minimal `AnimationPlanV2` (mirror
`games/riftbound/animation.ts`). Start empty; overlays activate later.

### `flesh-and-blood.css` (new)

Board grid + sidebar widths + hero cluster. Import in the tabletop (as riftbound
imports `riftbound.css:28`).

---

## 7. Live-match wiring (server-authoritative)

Follow **Gundam's** server-authoritative path, **not** Riftbound's client
reducer.

- New `engine/live/FleshAndBloodGameProvider.tsx` mirroring
  `games/gundam/src/engine/live/LiveGundamGameProvider.tsx`: holds the latest
  `FabViewerState` from gateway `state_update`/`state_sync` events and feeds
  `<FleshAndBloodTabletop state=… />`.
- New `engine/live/remoteAdapter.ts` mirroring
  `games/gundam/src/engine/live/remoteAdapter.ts`: gateway handle via
  `acquireRootGatewayHandle("flesh-and-blood")`, move submission,
  `move_rejected` rollback. Reference the event-listener wiring in
  `games/riftbound/LiveMatch.page.tsx:75`.
- `LiveMatch.page.tsx` (new): gateway bootstrap + `SimulatorRouteStatus`
  loading/error (`games/riftbound/LiveMatch.page.tsx:206`), sidebar =
  `EventLogPanel` + `ChatPanel` + statements.

> A local **Practice/fixture harness** (`SimulatorHarness`) renders the
> tabletop without a server and is the faster loop to get a visible board
> first. The `tests` route + `SimulatorHarness` (`SimulatorHarness.tsx:19`)
> already wire StatusBar/FixtureNavigation/InteractionPanel. Build the fixture
> path first.

---

## 8. Scaffolding fixes (do first, small)

1. **Theme tokens** — add `[data-game="flesh-and-blood"]` block to
   `packages/simulator-ui/src/styles/theme.css` (currently missing; block ends
   at line 247 with lorcana). Accent `#8a1c1c` from
   `apps/multi-game-simulator/src/simulator/games.ts:70`. Copy the gundam block
   (`theme.css:126-173`) as the template — full `--board-*`, `--card-*`,
   `--pill-*`, `--log-*` sets.
2. **Route registration** — extend
   `apps/multi-game-simulator/src/simulator/routeRegistry.tsx:81-86` FAB entry's
   `pages` map: add `"play-practice"`, `tests` (fixture harness), and later
   `"live-match"`. Mirror riftbound's block (`routeRegistry.tsx:87-96`).
3. **`App.tsx`** — keep `data-game="flesh-and-blood"`, optionally add
   `SimulatorEntityVisualProvider` if a FAB card-face renderer is added later
   (`App.tsx:3`).
4. **`Home.page.tsx`** — replace stub with a landing that links to
   practice/fixtures.

No new routes in `routes.ts` — all standard paths exist globally.

---

## 9. Phasing

| Phase                    | Goal                     | Delivers                                                                                                                                                                                                                   |
| ------------------------ | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **0 — Scaffolding**      | Fix gaps                 | theme.css FAB block, route registration, Home page                                                                                                                                                                         |
| **1 — Fixture tabletop** | Visible board, no server | `projection.ts`, `PlayerBoard`, `FleshAndBloodTabletop`, `animation.ts` (trivial), CSS, a `HarnessFixture`/`tests` page rendering the 6 zones + hero/life with corrected pile components. Validate via `SimulatorHarness`. |
| **1.5 — Practice/local** | Interactive local moves  | wire engine moves (draw/pitch/play-stub) through projection; reuse `InteractionPanel`.                                                                                                                                     |
| **2 — Live match**       | Server-authoritative     | `FleshAndBloodGameProvider` + `remoteAdapter` + `LiveMatch.page.tsx` (gateway). Equipment/weapon/permanent zones land as the engine grows.                                                                                 |
| **3 — Arena & combat**   | Full playmat             | hero cluster (official clock arrangement), permanent row, bespoke `CombatChain`, `CombatIntentOverlay`, `fabActionToAnimationPlan`.                                                                                        |

Phase 1 is independently shippable and is the "reject the change fast"
milestone — a static board proving the projection + shared components render
FAB state correctly on desktop + mobile.

---

## 10. Reference file map

| What                                             | File                                                                                                             |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Cleanest tabletop composition (mirror this)      | `apps/multi-game-simulator/src/games/riftbound/RiftboundTabletop.tsx`                                            |
| Server-authoritative seat layout                 | `apps/multi-game-simulator/src/games/gundam/src/components/ui/playerSeat/PlayerSeat.tsx`                         |
| Server-authoritative live wiring                 | `apps/multi-game-simulator/src/games/gundam/src/engine/live/LiveGundamGameProvider.tsx`, `remoteAdapter.ts`      |
| Animation scope API                              | `games/riftbound/RiftboundTabletop.tsx:53-72,76`                                                                 |
| `SimulatorViewportShell` (desktop+mobile chrome) | `packages/simulator-ui/src/components/SimulatorViewportShell.tsx:78`                                             |
| Zone→component dispatch                          | `packages/simulator-ui/src/components/CardZone.tsx:21`                                                           |
| Contract shapes to project into                  | `packages/simulator-contract/src/index.ts:143,163`                                                               |
| Engine viewer projection (input)                 | `submodules/flesh-and-blood/packages/engine/src/view.ts:47`                                                      |
| Engine zones (input)                             | `submodules/flesh-and-blood/packages/engine/src/state.ts:8`                                                      |
| CR zones (authoritative)                         | `submodules/flesh-and-blood/.agents/skills/fab-rules/references/flesh-and-blood-comprehensive-rules/03-zones.md` |
| Theme template                                   | `packages/simulator-ui/src/styles/theme.css:126` (gundam block)                                                  |
| Route registration                               | `apps/multi-game-simulator/src/simulator/routeRegistry.tsx:81`                                                   |
| FAB stubs to replace                             | `games/flesh-and-blood/App.tsx`, `Home.page.tsx`                                                                 |

---

## 11. Validation

- Per phase: focused `vp test` / `vp check-types` in `agnostic-simulator`.
- Phase 1: add a `.test.tsx` asserting the projection maps each `FabZoneKind`
  to the expected `role`/`visibility`/`layoutHint` (§1 table) and that face-down
  sentinels stay `face:"hidden"`.
- Browser proof via `pnpm run dev` (per AGENTS.md simulator task guidance).
- After focused checks pass, run `pnpm run ci:agnostic:check` from the root.
