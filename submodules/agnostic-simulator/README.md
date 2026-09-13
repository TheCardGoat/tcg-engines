# Game-Agnostic Simulator

This workspace owns TCG Online's shared simulator contracts, runtime helpers,
UI primitives, game adapters, agents, and multi-game browser application.

Game rules do not live here. Each game owns its native engine and cards; this
workspace connects those engines to shared platform and browser contracts.

## Start Here

- [Architecture and mental model](docs/architecture.md) explains ownership,
  package boundaries, data flow, and where changes belong.
- [Gundam integration](docs/gundam-integration.md) traces one game through
  local play, server-authoritative live play, replay, projection, and UI.
- [Testing](TESTING.md) explains the package, jsdom, and Playwright layers.
- [Contributor constraints](AGENTS.md) is the source of truth for ownership
  and validation requirements.

## Common Commands

From the repository root:

```sh
pnpm run dev:multi-game-sim
pnpm run ci:agnostic:check
```

For the consolidated local stack:

```sh
vp run docker
```

Then open `http://localhost:8080/gundam/simulator`.

Run commands from this workspace when working on shared packages:

```sh
vp install
pnpm run check
pnpm run test
```

Each submodule has its own workspace and lockfile. Install the owning game
workspace before this one when cross-workspace `link:` dependencies are
missing.
