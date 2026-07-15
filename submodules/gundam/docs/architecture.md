# Architecture

Top-level map of the Gundam game workspace. If you're about to change a
boundary defined here, write a plan in `docs/exec-plans/active/` first.

## Workspace topology

```
gundam/
├── packages/
│   ├── types/         ← Pure type definitions. Leaf package.
│   ├── token-data/    ← Static reference data (card sets, tokens). Leaf.
│   ├── cards/         ← Declarative card definitions. Depends on types + token-data.
│   ├── engine/        ← Rules engine, runtime, automation. Depends on types + token-data.
│   └── utils/         ← Cross-cutting helpers. Leaf.
├── apps/
│   └── website/       ← Marketing site. Independent.
├── tools/             ← Repo tooling (workspace pkgs).
└── ../agnostic-simulator/apps/multi-game-simulator/src/games/gundam
    └── migrated simulator UI, fixtures, practice, and live-match routes.
```

## Allowed dependency directions

```
                ┌──────────────────────┐
                │ multi-game Gundam UI │
                └───┬────┬───┬────────┘
                    │    │   │
        ┌───────────┘    │   └───────────┐
        ▼                ▼               ▼
    ┌────────┐      ┌────────┐      ┌────────┐
    │ cards  │      │ engine │      │ utils  │
    └───┬────┘      └───┬────┘      └────────┘
        │               │
        └───────┬───────┘
                ▼
         ┌──────────────┐
         │ types        │
         │ token-data   │  (leaf)
         └──────────────┘
```

**Rules**:

- `types` and `token-data` import nothing from the workspace.
- `cards` depends only on `types` and `token-data`. It must **not** import from
  `@tcg/gundam-engine` runtime code. The engine is allowed as a `devDependency`
  for tests only.
- `engine` depends on `types` and `token-data`. It must not import from `cards`.
- The migrated simulator module in `../agnostic-simulator` wires `cards` and
  `engine` together for browser play.
- `apps/website` does not depend on the engine or cards.
- `tools/*` packages are scripts/codemods, never imported by app code.

These rules are enforced two ways:

- **Package-level imports** are blocked by `package.json` `dependencies` lists. `cards` declares `engine` only as a `devDependency`, so a production import would fail to resolve.
- **Deep imports** (e.g. `@tcg/gundam-engine/automation/...`) and the cards-from-engine ban are caught by `tools/harness/check-invariants.mjs`, run as `pnpm check:invariants` in CI.

We deliberately did **not** add `dependency-cruiser`: the existing constraints already cover the violatable cases at zero dependency cost. Revisit if more nuanced intra-package layering rules are needed.

## Engine internal layout

`packages/engine/src/` is organized into a small set of layers. Each subdirectory has a single responsibility:

| Layer         | Role                                                                                         | Examples                                                       |
| ------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `types/`      | Engine-internal types (commands, state shapes).                                              | `command.ts`, `move-types.ts`                                  |
| `gundam/`     | Gundam-specific game module: rules, flow, lifecycle, moves, effects, projection.             | `flow.ts`, `moves/`, `rules/`, `lifecycle/`                    |
| `runtime/`    | `MatchRuntime` — the orchestrator. Owns state, applies commands, emits logs, manages clocks. | `match-runtime.ts`, `match-runtime.flow.ts`, `card-runtime.ts` |
| `automation/` | Bot strategies, candidate enumeration, replay-able play loops.                               | `play-match.ts`, `value-ranked-strategy.ts`                    |
| `engine/`     | Transport abstraction. Wraps the runtime for local/server/client topologies.                 | `local-engine.ts`, `server-engine.ts`, `client-engine.ts`      |
| `deck/`       | Deck list parsing and validation.                                                            | `deck/index.ts`                                                |
| `utils/`      | Engine-internal helpers (`assertNever`, etc.).                                               | `utils/assert-never.ts`                                        |

**Layering**: outer layers may depend on inner layers; reverse is forbidden.

```
engine ← automation ← runtime ← gundam ← types
```

The public API surface is the curated re-exports in `packages/engine/src/index.ts`. Treat that file as a contract — changing it requires an exec-plan.

## Migrated simulator app layout

`../agnostic-simulator/apps/multi-game-simulator/src/games/gundam/src/` mirrors
the old simulator layout, with one engine-specific concern: a thin **adapter
layer** translates engine state into UI-friendly shapes.

| Directory                  | Role                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------------- |
| `game/`                    | Adapter between engine state and React. `match-factory.ts`, `store.ts`, `selectors/`, `hooks.ts`. |
| `game/bot/`                | Bot wiring for the in-app AI opponent.                                                            |
| `components/`              | Presentational React. `GundamGame.tsx` is the top-level.                                          |
| `lib/`                     | Utility helpers (formatters, css class merging).                                                  |
| `messages/` + `paraglide/` | i18n via inlang/paraglide.                                                                        |
| `e2e/`                     | Playwright tests (separate from `__tests__`).                                                     |

UI components must not import from `@tcg/gundam-engine/automation/...` or any
other deep path — only from the curated surface re-exported in
`packages/engine/src/index.ts`.

## Build & test pipeline

CI gates (`.github/workflows/ci.yml`) run, in order:

1. `pnpm install --frozen-lockfile`
2. Build workspace deps (`types`, `token-data`, `engine`, `cards`)
3. Compile i18n (`paraglide-js compile`)
4. `vp fmt` + `git diff --exit-code` (format drift = failure)
5. `vp lint`
6. `vp check` (type check)
7. `vp test`
8. `pnpm -r run build`
9. Playwright e2e

A change that fails any of these locally **will** fail in CI. Run `vp check && vp test` before opening a PR.
