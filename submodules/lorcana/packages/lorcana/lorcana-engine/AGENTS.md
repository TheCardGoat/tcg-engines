# Lorcana Engine

Owns deterministic state transitions, targeting, effects, projection, and
automation.

- Register new condition, target, and effect variants in the exhaustive registry
  and cover their behavior. See [variant extension](docs/variant-extension.md).
- Keep multiplayer semantics intact.
- Do not import `@tcg/lorcana-cards`, including in tests: it creates a cycle.
  Tests using both real cards and the engine belong in the simulator's
  `src/testing/` directory.

Use the Lorcana rules and test-generation skills for rules and harness guidance.

Run focused engine tests and relevant type checks locally. Tests under the
simulator's `src/testing/` directory also run without a dev server. Start a
simulator only for changed browser behavior; use platform integration only
when the changed behavior crosses that service boundary.
