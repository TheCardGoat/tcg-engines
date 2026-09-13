# @tcg/play-cli

Game-agnostic terminal CLI for headless match play. Agents and humans can drive
observation + automated bot seats without the browser or gateway.

```sh
# from repo root
pnpm play-cli help
pnpm play-cli doctor --game one-piece
pnpm play-cli auto --game one-piece --matches 3 --seed-base smoke --p1 first-legal --p2 first-legal
```

## Commands

| Command              | Purpose                                                |
| -------------------- | ------------------------------------------------------ |
| `help`               | Print usage and registered games                       |
| `doctor --game <id>` | Create a session, observe, take one auto step          |
| `auto --game <id>`   | Run N full bot-vs-bot matches; print terminal outcomes |

## Adding a game

1. Implement `PlayAdapter` under `src/adapters/<game>.ts`.
2. Register a lazy loader in `src/registry.ts`.
3. Add a focused test that drives create → observe/auto → terminal outcome.

The CLI never hard-codes a single game binary: unknown `--game` values fail with
a non-zero exit.
