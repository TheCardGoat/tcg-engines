# Gundam Simulator Integration

This guide applies the shared architecture to Gundam. It is intended for an
engineer who needs to trace a player-visible behavior from the browser to the
authoritative rules engine and back.

Read [the shared architecture guide](architecture.md) first.

## Mental Model

Gundam is one native game engine with several ways to drive and render it.

```text
submodules/gundam
  types + token data + cards + engine + automation
                         |
                         v
agnostic-simulator/packages/gundam/gundam-server-adapter
  platform lifecycle + interaction projection
                         |
                         v
agnostic-simulator/apps/multi-game-simulator/src/games/gundam
  local play + live play + replay + Gundam table composition
                         |
                         v
shared simulator runtime, UI, protocol, and platform services
```

The browser simulator does not own Gundam rules. The engine does not own React
or production routing.

## Native Gundam Workspace

The authoritative workspace is `../../gundam`.

| Path                             | Responsibility                                                       |
| -------------------------------- | -------------------------------------------------------------------- |
| `packages/types/src`             | Public card and effect DSL types                                     |
| `packages/token-data/src`        | Static token and reference data                                      |
| `packages/cards/src`             | Declarative card definitions and card behavior tests                 |
| `packages/engine/src/gundam`     | Flow, lifecycle, moves, effects, rules, and board projection         |
| `packages/engine/src/runtime`    | `MatchRuntime`, validation, logs, clocks, serialization, and privacy |
| `packages/engine/src/automation` | Candidate enumeration and bot strategies                             |
| `packages/engine/src/engine`     | Local, server, and client transport topologies                       |
| `packages/engine/src/index.ts`   | Curated public API consumed outside the engine                       |

The allowed dependency direction is:

```text
Gundam browser -> cards + engine + types + token-data
cards          -> types + token-data
engine         -> types + token-data
```

Cards and engine do not import one another at runtime. The simulator is where a
card catalog and engine runtime are wired together.

## Rules-to-Code Map

Keep Gundam's native vocabulary when reading the code:

- Units deploy to the Battle Area and are the objects that attack.
- Pilots Pair beneath Units and add AP/HP or effects.
- A matching Pilot can satisfy a Unit's Link Condition.
- Commands resolve effects and normally move to Trash; some can be used as a
  Pilot instead.
- Bases occupy the Base section of the Shield Area.
- Resources come from the separate Resource Deck and are rested to pay Cost.
- Shields are hidden cards with one HP and may reveal a Burst.

The implementation map is:

| Concept                                   | Primary code                                             |
| ----------------------------------------- | -------------------------------------------------------- |
| Setup and turn phases                     | `packages/engine/src/gundam/flow.ts` and `lifecycle/`    |
| Player decisions                          | `packages/engine/src/gundam/moves/`                      |
| Attack, Block, Action, Damage, Battle End | `lifecycle/battle-phase/`                                |
| Effect queue and target resolution        | `packages/engine/src/gundam/effects/`                    |
| Pair, Link, and derived stats             | `packages/engine/src/gundam/rules/`                      |
| Viewer-facing engine state                | `packages/engine/src/gundam/projection/project-board.ts` |
| Card behavior data                        | `packages/cards/src/cards/<set>/<type>/`                 |
| Test-friendly public actions              | `packages/engine/src/gundam/testing/`                    |

Start with `flow.ts`. It gives a compact map of setup, the turn cycle, battle
steps, valid moves, and automatic transitions.

## Server Adapter

The active server adapter implementation is:

```text
packages/gundam/gundam-server-adapter/src
```

This path is relative to `agnostic-simulator`, not the Gundam workspace.

Its main responsibilities are:

- register Gundam under the `gundam` slug;
- validate main and Resource Deck construction;
- resolve card and canonical printing ids;
- create a server engine for a new match;
- serialize and restore an engine snapshot;
- publish a runtime fingerprint for rolling-deployment diagnostics;
- enumerate viewer-safe interactions and translate submissions into native
  commands.

Important entrypoints:

- `adapter.ts`: platform `GameAdapter` implementation.
- `gundam-engine-lifecycle.ts`: create, serialize, and restore.
- `gundam-server-engine.ts`: native engine wrapper used by game-server.
- `interaction-protocol.ts`: native moves to shared interaction views and
  submissions.
- `runtime-fingerprint.ts`: engine/card compatibility identity.

Platform applications dynamically register this adapter. If Gundam works in a
local fixture but not in matchmaking or live play, verify registration in
`../../platform/apps/general-api/src/server-adapters.ts` and
`../../platform/apps/game-server/src/server-adapters.ts`.

## Browser Integration

The browser integration is:

```text
apps/multi-game-simulator/src/games/gundam
```

### Routes

`pages/` contains route-level orchestration:

- `VsAi.page.tsx`: local match creation and bot attachment.
- `Practice.page.tsx`: requests a server-authoritative quick match.
- `LiveMatch.page.tsx`: authenticated live connection and state lifecycle.
- `Replay.page.tsx` and `ReplayFork.page.tsx`: persisted playback.
- `FixtureRoutes.page.tsx`: visual and behavior labs.
- `BotVsBot.page.tsx` and `BotBenchUi.page.tsx`: automation evaluation.

`src/simulator/routeRegistry.tsx` in the app root maps shared route kinds to
these pages.

### Local runtime path

```text
VsAiPage
  -> match factory or fixture
  -> MatchSnapshot
  -> reconstruct MatchRuntime
  -> attach browser bot
  -> SimulatorApp
```

Useful files:

- `src/game/match-factory.ts`: real deck to runtime construction.
- `src/game/dev-runtime.ts`: fixture-friendly runtime construction.
- `src/game/snapshot.ts`: wire-safe runtime/catalog snapshot and hydration.
- `src/game/bot/`: bot registry, controls, and client attachment.

Fixtures may build states that are convenient for UI proof. Do not treat a
fixture-only state mutation as a valid production gameplay path.

### React state boundary

`src/game/adapter.ts` is the main boundary between `MatchRuntime` and React. It
provides:

- viewer-filtered board state;
- server-adapter interaction views;
- protocol-backed action and effect-resolution inputs;
- command submission and undo for local play;
- viewer-safe logs and move logs;
- animation packet history;
- card instance to definition lookup.

`src/game/store.ts` snapshots this data and subscribes to runtime updates.
`src/game/hooks.ts` exposes focused React hooks. Components should consume
these hooks rather than reading mutable runtime state directly.

`src/game/interaction-draft.tsx` adapts the shared `InteractionDraftProvider`
to Gundam command submission. The shared provider owns multi-step input
collection and validation; Gundam containers consume its typed current input,
candidate, selection, and source-card state.

### Component composition

`src/SimulatorApp.tsx` is the best file for understanding the UI tree:

```text
GundamGameProvider
  -> command/error/hints/targeting providers
  -> shared animation layer
  -> Gundam card context controller
  -> Gundam board layout
     -> top player seat
     -> battle ribbon
     -> bottom player seat
     -> shared interaction prompt, targeting, result, errors
```

The directories deliberately separate responsibilities:

| Directory                  | Responsibility                                                   |
| -------------------------- | ---------------------------------------------------------------- |
| `components/containers`    | Read hooks, map native data, bind actions                        |
| `components/ui`            | Presentational Gundam table components                           |
| `components/ui/playerSeat` | Battle Area, Shield/Base, Resource, Hand, Deck, and Trash layout |
| `game/selectors`           | Derived interaction and legality presentation                    |
| `animation`                | Gundam animation mapping and shared surface integration          |
| `lib`                      | UI behavior and formatting helpers                               |

The integration reuses `@tcg/simulator-ui` primitives, but it does not force
Gundam into a generic board layout.

## Live Production Path

The canonical route is:

```text
/gundam/simulator/matches/:matchId/games/:gameId
```

The lifecycle in `pages/LiveMatch.page.tsx` is:

1. The shared route loader requests authenticated match context from General
   API.
2. The page acquires the shared root gateway connection and joins `gameId`.
3. The first `state_sync` constructs a viewer renderer runtime.
4. Later state messages load authoritative state into the same runtime.
5. React subscribers render the new projection.
6. `game_ended` updates the match result surface.

Player actions follow the reverse direction:

1. A component selects a server-published action.
2. `src/engine/live/actionToInteraction.ts` constructs an
   `InteractionSubmission`.
3. `remoteAdapter.ts` submits it with the expected state version.
4. Gateway forwards it to the Gundam game-server.
5. The server adapter translates it into a native command.
6. `MatchRuntime` validates and executes the command.
7. Viewer-safe state, interactions, logs, and animations return over gateway.

The browser-side runtime in live mode is a renderer. `remoteAdapter.ts`
overrides local submission, disables undo, and uses server-published
interactions. It must never execute a live player command locally.

## State, Privacy, and Identity

Three concepts are easy to confuse:

- Definition id identifies card behavior, such as a canonical card number.
- Printing id identifies an art or product printing.
- Instance id identifies one physical card in one match.

The engine's static resources map instance ids to definitions and owners.
Snapshots must preserve definitions created at runtime, including Tokens.

Hidden information is filtered in the engine before serialization. A
spectator, player, and judge can receive different projections. The UI may
hide information visually, but CSS is not a privacy boundary.

Live interactions are also viewer-specific. Do not reconstruct an opponent's
possible actions from public state.

## Animations

The engine emits semantic animation packets or shared animation plans. Gundam's
animation layer maps native entities and zones into `simulator-contract`
entities and shared UI nodes.

Animation may temporarily gate external commands so a click cannot overtake a
visible transition. It must not:

- change move legality;
- mutate authoritative state;
- invent game logs;
- expose a hidden entity;
- become required for a command to complete.

Inspect:

- `src/animation/GundamSharedAnimationLayer.tsx`;
- `src/animation/gundamAnimationVisual.tsx`;
- `@tcg/simulator-runtime/animation`;
- `@tcg/simulator-ui` animation providers and nodes.

## How Gundam Compares

All registered games share route loading, platform contracts, gateway
infrastructure, diagnostics, and reusable simulator UI. Their migration depth
is intentionally different.

| Game      | Current browser integration                                                                |
| --------- | ------------------------------------------------------------------------------------------ |
| Gundam    | Local/Vs-AI, fixtures, live server authority, replay/fork, bot-vs-bot, bot bench           |
| Cyberpunk | Full live and local integration plus game-owned matchmaking and deck surfaces              |
| One Piece | Practice and fixture-oriented integration; fewer registered production routes              |
| Riftbound | Live/replay tabletop integration with a smaller game-owned surface                         |
| Lorcana   | Game-owned simulator outside the multi-game app; shared platform adapters remain available |

Do not use migration completeness as architecture. A missing route or shared
component may be deliberate or unfinished; verify the route registry and the
owning game's constraints.

## Debugging by Symptom

| Symptom                           | Trace                                                              |
| --------------------------------- | ------------------------------------------------------------------ |
| Card text behaves incorrectly     | Card definition -> effect interpreter -> engine test               |
| Attack or phase is illegal        | `flow.ts` -> lifecycle -> move validation                          |
| Legal move is absent from UI      | engine enumeration -> interaction protocol -> browser selector     |
| UI offers a rejected move         | interaction state version -> `remoteAdapter` -> submission mapping |
| Correct move, wrong board         | engine projection -> browser adapter -> container mapper           |
| Local works, live fails           | server adapter -> game-server -> gateway -> live messages          |
| Reconnect loses actions           | `liveMessages.ts` -> interaction resync -> `liveState.ts`          |
| Card disappears after hydration   | snapshot definitions/instances -> static resources                 |
| Opponent information leaks        | engine view filtering -> server interaction projection             |
| Animation repeats or blocks input | packet history delta -> command gate -> animation layer            |
| Wrong production URL or service   | route loader -> General API -> reverse proxy                       |

## Recommended Reading Order

1. `../../gundam/docs/architecture.md`
2. `../../gundam/docs/design-docs/core-beliefs.md`
3. `../../gundam/packages/engine/src/gundam/flow.ts`
4. One move and its focused test
5. One card definition and its sibling test
6. `packages/gundam/gundam-server-adapter/src/interaction-protocol.ts`
7. `apps/multi-game-simulator/src/games/gundam/src/game/adapter.ts`
8. `apps/multi-game-simulator/src/games/gundam/src/SimulatorApp.tsx`
9. `apps/multi-game-simulator/src/games/gundam/pages/VsAi.page.tsx`
10. `apps/multi-game-simulator/src/games/gundam/pages/LiveMatch.page.tsx`
11. `apps/multi-game-simulator/src/games/gundam/src/engine/live/remoteAdapter.ts`
12. `../../platform/apps/game-server/src/server-adapters.ts`

## Running and Proving Changes

From the repository root:

```sh
# Browser-only local simulator
pnpm run dev:gundam

# Production-shaped platform, gateway, game-server, API, and simulator
vp run docker

# Owner checks
pnpm run ci:gundam:check
pnpm run ci:agnostic:check
```

Use the smallest proof that can reject the change:

1. Engine or card test for rules behavior.
2. Server-adapter test for interaction or lifecycle mapping.
3. jsdom test for prompts, actions, and DOM state.
4. Browser test for real routing, pointer/touch, viewport, or long multi-step
   flows.
5. Full platform stack for live auth, gateway, persistence, reconnect, or
   routing.

See `../TESTING.md` and `../../gundam/TESTING.md` for exact commands and test
placement.
