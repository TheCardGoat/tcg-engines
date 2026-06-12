# TCG Engines

This repository contains the open-source engine and simulator workspaces used by
TCG Online. It includes game rules, card definitions, adapters, shared simulator
contracts, and test tooling for the public parts of the project.

The production web app, API, gateway, reverse proxy, workers, auth, matchmaking
services, infrastructure, and deployment configuration are private and are not
included here.

## Workspaces

- `submodules/agnostic-simulator` - shared protocol, simulator contracts,
  runtime adapters, simulator UI primitives, and agent tooling.
- `submodules/lorcana` - Lorcana engine, cards, simulator, replay tooling, and
  tests.
- `submodules/cyberpunk` - Cyberpunk cards, engine, parser/scraper tooling, and
  server adapter.
- `submodules/gundam` - Gundam engine, cards, simulator, tooling, and server
  adapter.
- `submodules/one-piece-simulator` - One Piece simulator, engine, cards, types,
  and utilities.

## Requirements

- Node.js 24.x
- pnpm 10.33.x
- Bun, for packages that use Bun-powered scripts
- Vite+ (`vp`), installed by the package manager in each workspace

## Setup

Each exported subdirectory is its own pnpm workspace. Install dependencies from
the workspace you are changing:

```bash
pnpm --dir submodules/cyberpunk install --frozen-lockfile
pnpm --dir submodules/agnostic-simulator install --frozen-lockfile
```

For cross-game simulator work, install and build game workspaces before running
the agnostic simulator checks.

## Validation

The root package provides convenience wrappers:

```bash
pnpm run ci:cyberpunk:check
pnpm run ci:gundam:check
pnpm run ci:lorcana:check
pnpm run ci:one-piece:check
pnpm run ci:agnostic:check
pnpm run ci:public
```

Run the focused workspace check first. Broader checks are useful before opening
or merging a public PR.

## Contributions

Public contributions should target engines, cards, rules, adapters, shared
simulator contracts, tests, and developer tooling in the exported workspaces.
Production service, account, deployment, and infrastructure changes are out of
scope for this repository.
