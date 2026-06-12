# Public Submodules Map

These directories are normal tracked source directories. They are not git
submodule gitlinks, even though the directory is named `submodules`.

## Choose The Owner

- Use `agnostic-simulator` for game-agnostic contracts and adapters: protocol
  shapes, playable game slugs, runtime adapter interfaces, shared simulator/page
  contracts, reusable simulator UI primitives, shared agent-core behavior, and
  per-game server adapters.
- Use a game submodule (`lorcana`, `cyberpunk`, `gundam`,
  `one-piece-simulator`) for that game's rules, cards, engine state, local
  simulator implementation, parser/scraper tooling, and game-native wording.

If a change crosses these boundaries, keep the shared concept in
`agnostic-simulator` and map each game into it through an adapter. Do not add
one game's nouns or state shape directly to shared code.

## Workspace Boundaries

Each submodule is its own pnpm workspace. No workspace may include packages from
another submodule. Cross-submodule dependencies use `link:` and
intra-submodule dependencies use `workspace:*`.

Install order matters for cross-game simulator work: game submodules first, then
`agnostic-simulator`.

## Submodule Map

| Submodule             | Purpose                                                                                                                | First files for bugs                                                                                                                                                                              |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `agnostic-simulator`  | Cross-game protocol, contracts, adapter interfaces, simulator UI primitives, agent core, and per-game server adapters. | `packages/protocol/src`, `packages/shared/src/game-adapter`, `packages/game-page-contract/src`, `packages/simulator-contract/src`, `packages/simulator-ui/src`, `packages/*/*-server-adapter/src` |
| `lorcana`             | Lorcana engine, cards, simulator, replay tools, and rules skills.                                                      | `packages/lorcana/lorcana-engine/src`, `packages/lorcana/lorcana-cards/src`, `packages/lorcana/lorcana-simulator/src`, `packages/tools/replay-cli/src`                                            |
| `cyberpunk`           | Cyberpunk cards, engine, parser/scraper tools, and game-native rules source.                                           | `packages/engine/src`, `packages/cards/src`, `packages/server-adapter/src`, `.agents/skills/cyberpunk-tcg-rules`                                                                                 |
| `gundam`              | Gundam cards, engine, simulator, server adapter, bot bench, and rule docs.                                             | `packages/engine/src`, `packages/cards/src`, `apps/simulator/app`, `apps/simulator/src`, `packages/server-adapter/src`, `docs/architecture.md`                                                    |
| `one-piece-simulator` | One Piece simulator snapshot with engine, cards, types, utils, and browser app.                                        | `packages/engine/src`, `packages/cards/src`, `apps/simulator/src`, `.agents/skills/op-rules/comprehensive-rules.md`                                                                               |

## Validation

Use focused validation from the owning submodule first:

- `pnpm run ci:cyberpunk:check`
- `pnpm run ci:gundam:check`
- `pnpm run ci:lorcana:check`
- `pnpm run ci:one-piece:check`
- `pnpm run ci:agnostic:check`

For docs-only edits, `git diff --check` is usually sufficient.
