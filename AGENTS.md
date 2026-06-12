# Public Project Map

This public repository contains the open-source TCG engine and simulator
workspaces. The private production platform is intentionally absent.

Start with `submodules/AGENTS.md` when a task touches a game, shared simulator
runtime, rules behavior, card text, parser tooling, or tests. Then read the
specific `submodules/{name}/AGENTS.md` before editing inside that subtree.

## Public Workspaces

- `submodules/agnostic-simulator` - game-agnostic contracts, shared protocol,
  simulator UI primitives, adapters, and agent tooling.
- `submodules/lorcana` - Lorcana cards, engine, simulator, replay tooling, and
  Lorcana-specific rules/test skills.
- `submodules/cyberpunk` - Cyberpunk cards, engine, parser/scraper tools,
  server adapter, and Cyberpunk rules skill.
- `submodules/gundam` - Gundam cards, engine, simulator, server adapter, bot
  tooling, rules references, and architecture docs.
- `submodules/one-piece-simulator` - One Piece simulator snapshot with engine,
  cards, types, utils, and browser simulator.

## Private Boundary

The production web app, API, auth, matchmaking services, gateway, reverse proxy,
content worker, deployment configuration, and infrastructure live in the private
repository. Do not add production secrets, deployment credentials, private
service topology, or platform-owned app code to this public repository.

## Engineering Rules

- Preserve game-agnostic boundaries. Shared simulator and protocol code should
  work across games; specialize through adapters when a game needs unique
  behavior.
- Keep game glossary and rules context loaded before changing gameplay logic,
  card text, simulator prompts, tests, AI, or player-facing rules copy.
- Type safety is non-negotiable. Do not add loose `any` or `unknown` escape
  hatches.
- Run focused checks for the touched workspace before broader public CI.

## Validation

Use the smallest relevant check first:

- `pnpm run ci:cyberpunk:check`
- `pnpm run ci:gundam:check`
- `pnpm run ci:lorcana:check`
- `pnpm run ci:one-piece:check`
- `pnpm run ci:agnostic:check`
- `pnpm run ci:public`

For docs-only edits, `git diff --check` is usually sufficient.
