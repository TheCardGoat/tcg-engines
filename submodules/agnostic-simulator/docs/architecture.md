# Simulator Architecture and Mental Model

This guide is for engineers new to TCG Online's game-agnostic simulator. It
explains what is shared, what remains game-owned, and how a player action moves
through the browser and production services.

Read this before changing a shared contract, adding a game, or moving code
between workspaces.

## The Thirty-Second Model

The simulator is a federation of game engines behind shared contracts. It is
not one universal engine and it is not one universal board component.

```text
game workspace
  rules, cards, engine, native state
        |
        | game-owned mapping
        v
agnostic-simulator
  protocol, adapters, browser contracts, runtime helpers, UI primitives
        |
        | shared platform contract
        v
platform
  HTTP APIs, game servers, gateway, persistence, routing, deployment
```

The practical rule is:

> Games decide what is legal and what game concepts mean. Shared code decides
> how those concepts travel, render, animate, and integrate with the platform.

## Workspace Ownership

| Owner                | Owns                                                                                                 | Does not own                             |
| -------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Game workspace       | Rules, cards, engine state, moves, native terminology, game-specific projections                     | Cross-game protocols, production routing |
| `agnostic-simulator` | Protocols, page contracts, adapter interfaces, normalized browser types, reusable UI, multi-game app | Native rules or card behavior            |
| `platform`           | General API, game servers, gateway, persistence, auth, routing, deployment                           | Rendering details or game rules          |

Examples of game workspaces are `../gundam`, `../cyberpunk`,
`../one-piece`, and `../lorcana`.

Every submodule is an independent pnpm workspace. Cross-workspace dependencies
use `link:`; dependencies inside one workspace use `workspace:*`.

## Shared Package Map

Start at the contract closest to the behavior you are changing.

| Package                                 | Question it answers                                                                   |
| --------------------------------------- | ------------------------------------------------------------------------------------- |
| `packages/protocol`                     | What messages can the gateway, client, and server exchange?                           |
| `packages/game-page-contract`           | What data bootstraps live match, replay, and practice pages?                          |
| `packages/shared/src/game-adapter`      | How does a platform service ask any game to create, restore, or inspect a match?      |
| `packages/simulator-contract`           | What normalized entities, zones, actions, and metadata can shared UI render?          |
| `packages/simulator-runtime`            | How do replay, chat, gateway, diagnostics, and animation state behave in the browser? |
| `packages/simulator-ui`                 | Which visual and interaction primitives can every game reuse?                         |
| `packages/gateway-client`               | How does browser code manage the shared realtime connection?                          |
| `packages/<game>/<game>-server-adapter` | How does a native game engine implement the platform adapter contract?                |
| `apps/multi-game-simulator`             | How are routes and game-specific browser surfaces assembled?                          |

Shared packages must not import a game's engine or cards. If a shared type needs
the word `Pilot`, `DON!!`, `Ink`, or another native noun, the concept probably
belongs in a game projection instead.

## The Important Boundaries

### Native state versus browser projection

The engine owns authoritative native state. The browser receives a
viewer-filtered projection and maps it into React-facing structures.

Do not make a component infer legality from card text or board state. The
engine or server-published interaction view must say which actions are legal.

### Platform adapter versus browser adapter

There are two similarly named adapter layers:

1. The server adapter implements `GameAdapter`. Platform services use it to
   validate decks, create engines, serialize matches, restore matches, publish
   interactions, and expose runtime fingerprints.
2. The browser engine adapter connects one native runtime to React. It exposes
   the current projection, legal interactions, logs, animations, and a submit
   boundary.

They solve different problems. The server adapter is a platform boundary; the
browser adapter is a rendering boundary.

### Shared UI versus game composition

`packages/simulator-ui` provides reusable pieces such as:

- card and zone primitives;
- targeting and drag-and-drop surfaces;
- connection diagnostics;
- clocks, chat, logs, prompts, and match actions;
- animation registration, transitions, and overlays;
- mobile and viewport shells.

Each game still composes its own table. Zone placement, native labels, game
status, card metadata, and interaction wording remain game-owned.

## The Three Runtime Paths

### Local or versus-AI play

Local play executes commands directly against an in-browser native runtime.

```text
route
  -> fixture or deck factory
  -> native MatchRuntime
  -> browser EngineAdapter
  -> external store and hooks
  -> game containers
  -> shared UI primitives
```

This path is useful for fixtures, development, rules demonstrations, and AI
play. It is not evidence that the production networking path works.

### Server-authoritative live play

In live play, the browser is a renderer and command client. It does not decide
the result of a move.

```text
player interaction
  -> browser remote adapter
  -> InteractionSubmission
  -> gateway
  -> platform game-server
  -> game server adapter
  -> authoritative native runtime
  -> viewer-safe state and interaction view
  -> gateway
  -> browser renderer runtime
  -> React
```

The interaction view is versioned with engine state. When state advances
without a matching interaction view, the UI must wait or resynchronize instead
of offering stale actions.

### Replay

Replay applies persisted snapshots and steps without re-authoring game
semantics in the UI.

```text
replay HTTP contract
  -> shared replay playback controller
  -> game reconstruction/projection
  -> the same board and animation surfaces used by live play
```

Deterministic engine behavior, stable instance identity, and viewer-safe logs
are therefore production requirements, not only test conveniences.

## Route Architecture

React Router owns the shared URL shapes in
`apps/multi-game-simulator/src/routes.ts`. Route modules load shared page data,
then `src/simulator/routeRegistry.tsx` selects the game provider and page.

The main production shapes are:

```text
/:gameSlug/simulator
/:gameSlug/simulator/play/practice
/:gameSlug/simulator/matches/:matchId
/:gameSlug/simulator/matches/:matchId/games/:gameId
/:gameSlug/simulator/replay/:gameId
```

Not every game implements every route. An absent registration is a capability
boundary, not a reason for the shared route module to import game internals.

## Where Should a Change Go?

| Symptom or requirement                               | Start here                                                        |
| ---------------------------------------------------- | ----------------------------------------------------------------- |
| A move is legal when it should not be                | Owning game engine                                                |
| A card resolves incorrectly                          | Owning game card definition, then its engine interpreter          |
| Correct state but wrong native label or zone mapping | Game browser projection                                           |
| One game has a broken prompt                         | Game interaction projection or game UI                            |
| Every game needs the same prompt behavior            | `simulator-contract` and `simulator-ui`                           |
| Live works locally but not through production        | Game server adapter, game-server, gateway, then route             |
| Reconnect shows stale actions                        | State-versioned interaction and live-message path                 |
| Opponent sees private information                    | Engine view filtering and server projection                       |
| Animation changes move semantics                     | Fix ownership: animation may gate commands, never decide legality |
| URL or bootstrap payload is wrong                    | `game-page-contract`, route loader, or General API                |

When unsure, trace one exact request or player action across the boundary
instead of moving code toward the first visible symptom.

## Adding or Changing a Shared Concept

Before widening a shared type:

1. Describe the smallest game-neutral behavior.
2. Map it against Lorcana, Cyberpunk, Gundam, and One Piece.
3. Keep native nouns and ids inside game adapters.
4. Update every affected adapter.
5. Test the shared contract and at least one real game mapping.
6. Add focused component or route proof for visible behavior.
7. Run `pnpm run ci:agnostic:check` from the repository root.

Do not add an optional field merely because one game has not been migrated.
Decide whether it is truly optional across games or whether the abstraction is
wrong.

## Production-Readiness Lens

Review each layer independently:

- Engine: deterministic commands, injected clock/randomness, complete move
  enumeration, authoritative logs, viewer-safe projections.
- Adapter: stable instance ids, deck validation, serialization/restoration,
  interaction mapping, runtime fingerprint.
- Protocol: runtime validation, state versions, viewer scope, backwards-aware
  rolling deployment behavior.
- Browser: reconnect and resync, stale-interaction handling, accessible action
  paths, error states, command gating during animation.
- UI: desktop/mobile layout, hidden-information rendering, reduced motion,
  touch and pointer behavior.
- Platform: exact HTTP route, gateway namespace, adapter registration,
  persistence, reverse proxy, service health.
- Evidence: focused engine tests, adapter tests, jsdom interaction tests, then
  browser proof for behavior that requires the real runtime.

A passing local fixture proves only the local path. A successful browser smoke
test proves only the exercised route and interactions.

## Newcomer Reading Path

1. `AGENTS.md`
2. This document
3. `apps/multi-game-simulator/src/routes.ts`
4. `apps/multi-game-simulator/src/simulator/routeRegistry.tsx`
5. `packages/shared/src/game-adapter/types.ts`
6. `packages/protocol/src/interactions.ts`
7. `packages/simulator-contract/src/index.ts`
8. One game's integration guide and runtime path
9. `TESTING.md`

For the most complete concrete walkthrough, continue with
[Gundam integration](gundam-integration.md).

## Common Mistakes

- Treating `agnostic-simulator` as the owner of game rules.
- Adding a game-native noun to a shared contract.
- Assuming the local runtime and live runtime submit moves the same way.
- Recomputing live action legality in the browser.
- Mutating engine state from a fixture, bot, or UI instead of submitting a
  command.
- Testing only final state when the player-visible prompt or log is part of the
  behavior.
- Running install or checks from the repository root instead of the owning
  workspace.
- Starting a second local platform stack without checking existing Docker
  services.
