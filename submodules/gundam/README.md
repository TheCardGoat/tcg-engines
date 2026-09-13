# Gundam Card Game

This workspace owns Gundam-native rules, card definitions, the deterministic
match engine, automation, and bot tooling. The browser simulator lives in the
sibling `../agnostic-simulator` workspace.

## Start Here

- [Architecture](docs/architecture.md) explains package boundaries and engine
  layers.
- [Core beliefs](docs/design-docs/core-beliefs.md) documents invariants such
  as determinism, privacy, command-only mutation, and authoritative logs.
- [Shared simulator mental model](../agnostic-simulator/docs/architecture.md)
  explains cross-game contracts and platform ownership.
- [Gundam simulator integration](../agnostic-simulator/docs/gundam-integration.md)
  traces local play, live play, replay, React projection, and production
  services.
- [Testing](TESTING.md) explains engine, card, adapter, jsdom, and browser
  evidence.
- [Contributor constraints](AGENTS.md) is the source of truth for rules skills,
  ownership, and validation.

## Workspace Map

```text
packages/types        public card and effect types
packages/token-data   static token/reference data
packages/cards        declarative cards and card behavior tests
packages/engine       rules, runtime, projection, replay, and automation
packages/utils        leaf utilities
tools                 parser, scraper, bot bench, and harness tooling
```

The browser integration is located at:

```text
../agnostic-simulator/apps/multi-game-simulator/src/games/gundam
```

The platform server adapter is located at:

```text
../agnostic-simulator/packages/gundam/gundam-server-adapter
```

## Common Commands

From the repository root:

```sh
pnpm run dev:gundam
pnpm run ci:gundam:check
```

From this workspace:

```sh
vp install
pnpm run test
pnpm run check:harness
pnpm run ci-check
```

Load the Gundam rules glossary and rules skill before rules-facing changes.
