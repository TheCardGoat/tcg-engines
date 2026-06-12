# Agnostic Simulator

This submodule owns the cross-game layer for TCG Online: contracts, protocol,
adapter interfaces, shared simulator UI primitives, agent-core behavior, and
adapters used by platform services to talk to game engines.

Keep this module game-agnostic. If a behavior only applies to one game, put it
behind an adapter or in that game's submodule. If a concept is shared, model the
minimum cross-game shape here and require each game to map its native rules,
ids, labels, zones, prompts, and state into that shape through adapters.

## Where To Look

- `packages/protocol/src` (`@tcg/protocol`) - shared runtime protocol,
  playable game slugs, gateway envelopes, interaction views, and Redis stream
  key helpers.
- `packages/shared/src/game-adapter` (`@tcg/shared/game-adapter`) - slug-keyed
  game adapter registry and platform runtime adapter interfaces.
- `packages/game-page-contract/src` (`@tcg/game-page-contract`) - cross-deployable
  live match, replay, practice, gateway, and page-load contracts.
- `packages/simulator-contract/src` (`@tcg/simulator-contract`) - browser
  simulator snapshots, tables, entities, zones, layouts, and interactions.
- `packages/simulator-ui/src` (`@tcg/simulator-ui`) - reusable game-agnostic
  simulator UI primitives.
- `packages/agent-core/src` (`@tcg/agent-core`) - reusable agent/bot runner
  behavior that game agents plug into.
- `packages/{lorcana,cyberpunk,gundam,one-piece}/*-server-adapter/src` -
  adapters that bridge game engines into the platform runtime.
- `packages/{lorcana,cyberpunk,gundam,one-piece}/*-agent/src` - game-specific
  agent adapters built on the shared agent core.
- `apps/multi-game-simulator/src` - local multi-game shell for validating the
  shared UI/contracts.

## Implementation Rules

- Shared types must not encode a single game's nouns as universal truth. Use
  opaque ids, game-native labels, capability flags, or adapter-owned mappings
  when games differ.
- Game-specific mechanics stay in the game submodule or the per-game adapter.
  Do not import engines/cards into shared protocol, page-contract, simulator
  contract, simulator UI, or agent-core packages.
- Before adding a new shared concept, check how it maps to Lorcana, Cyberpunk,
  Gundam, and One Piece. If one game cannot map cleanly, narrow the shared
  contract or keep the behavior adapter-local.
- Platform code should depend on `@tcg/protocol`, `@tcg/game-page-contract`,
  and `@tcg/shared/game-adapter` instead of reaching into game engines.
- UI primitives should render normalized simulator data. Game layout, card
  naming, zone terminology, move labels, and prompt wording are adapter inputs.

## Cross-Game Change Checklist

- Define or update the protocol/contract in the shared package that owns the
  boundary.
- Add or update per-game adapter mappings for every supported game affected by
  the concept.
- Cover the shared contract plus at least one focused adapter mapping test.
- For runtime or simulator behavior, validate the owning package first, then run
  `bun run ci:agnostic:check` from the repo root when code changed.

## Agent Backpressure Gates

Use the root `/backpressured` command for long-running shared-contract work.
The first rejecting check must cover the smallest shared boundary you changed:

- protocol/contract change: focused package test plus affected type check.
- adapter mapping change: shared contract test plus each affected game adapter
  mapping test.
- simulator UI primitive change: focused UI/test route proof before cross-game
  CI.
- agent-core change: focused agent-core tests plus at least one game-agent
  integration path when behavior changes.

Do not declare a shared concept complete until every affected game can map it
without leaking game-native nouns into shared types. If one game cannot map the
shape cleanly, stop and narrow the contract.

## Bug Triage

- Protocol or gateway shape bugs usually start in `packages/protocol/src`.
- A game works locally but fails through platform runtime: inspect that game's
  `*-server-adapter` here and the matching engine package in the game
  submodule.
- Shared interaction/prompt rendering bugs should be fixed in contracts/UI only
  when the fix is genuinely cross-game. Otherwise fix the game's projection.
- If a bug report uses one game's wording, translate it to the shared contract
  only after confirming the same concept exists for the other games.

## Validation

- From this submodule: `vp check`, `vp test`, or `pnpm run ci-check`.
- From repo root: `bun run ci:agnostic:check`.

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.

<!--VITE PLUS END-->
