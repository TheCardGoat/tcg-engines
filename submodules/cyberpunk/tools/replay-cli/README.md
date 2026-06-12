# Cyberpunk Replay CLI

Download a persisted Cyberpunk replay and print a per-turn trace for debugging.

```bash
bun tools/replay-cli/src/cli.ts --replay-id <gameId> --turn <n>
```

`--turn` is 1-based and uses the persisted `acceptedMove.turnNumber` values.
The default API origin is `https://cyberpunk-api.tcg.online`; override it with
`--api-origin <url>` when inspecting local or staging APIs.

If `--turn` is omitted, the CLI prints replay metadata and the available turns.
