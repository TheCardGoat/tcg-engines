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
- `submodules/flesh-and-blood` - Flesh and Blood catalog types, cards, rules
  engine runtime, and ingestion tooling.
- `submodules/grand-archive` - Grand Archive catalog types, cards, rules
  engine runtime, and ingestion tooling.
- `submodules/gundam` - Gundam engine, cards, simulator, tooling, and server
  adapter.
- `submodules/naruto` - Naruto cards, provisional rules engine, and tests.
- `submodules/one-piece` - One Piece simulator, engine, cards, types,
  and utilities.
- `submodules/riftbound` - Riftbound catalog types, cards, and ingestion
  tooling.
- `submodules/star-wars-unlimited` - Star Wars Unlimited catalog types,
  cards, early engine work, and ingestion tooling.

## Game Maturity

Not every TCG in this repository is at the same level of maturity. Each game
falls into one of three stages:

### Feature complete

Cards, rules engine, and simulator are fully implemented, and the game is
playable on [tcg.online](https://tcg.online):

- **Lorcana** - cards, engine, simulator, replay tooling, and server adapter.
- **Cyberpunk** - cards, engine, simulator, and server adapter.
- **Gundam** - cards, engine, simulator, website, and server adapter.
- **Flesh and Blood** - cards, engine, and simulator; our most recent full
  launch.

### In progress

Card data is in place and engine or simulator work has started, but the game
is not fully playable yet:

- **One Piece** - a deep rules engine and full card database are
  implemented; the public simulator is still being built out.
- **Grand Archive** - card catalog and rules engine in active development;
  early simulator.
- **Naruto** - provisional Preview engine and card snapshot awaiting the
  official rulebook; early simulator.
- **Star Wars Unlimited** - card catalog plus an early engine scaffold; the
  simulator has not been started.

### Cards only

Only the official card data ships today; the rules engine and simulator are
not implemented yet:

- **Riftbound** - official card catalog, translations, and deck data with
  ingestion tooling. No rules engine yet.

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
