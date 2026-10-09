# Lorcana

Owns cards, engine, the dedicated simulator, runtime adapter, and replay tools.
For rules-facing work, use `.agents/skills/lorcana-rules/SKILL.md`. Single-card
work uses `lorcana-cards`; lookup and test guidance are in `lorcana-find-card`
and `lorcana-test-generation`.

## Main paths

Under `packages/lorcana/`:

- `lorcana-engine`: moves, effects, targeting, prompts, and automation.
- `lorcana-cards` and `lorcana-types`: definitions and native types.
- `lorcana-simulator`: Svelte UI, devtools, fixtures, and player flows.
- `lorcana-server-adapter`: platform runtime adapter.

`packages/tools/replay-cli` owns replay inspection. Use `replay-debugging` for
replay-backed reports; do not infer events missing from the evidence.

Reuse simulator regression fixtures in
`packages/lorcana/lorcana-simulator/src/lib/features/simulator-devtools/fixtures/regressions/`
and the `/tests/regressions` route when they cover the reported state.

## Validation scope

- Card and engine work uses focused package tests and relevant type checks.
  Tests that need real cards plus the engine can run in the simulator's
  `src/testing/` harness without starting a browser or dev server.
- For UI work, run only `lorcana-simulator` and use its local devtools or
  regression fixtures. See that package's guide for commands.
- Add platform services only when the change requires a hosted flow or service
  integration. Card and engine changes do not require a hosted-match smoke test.
