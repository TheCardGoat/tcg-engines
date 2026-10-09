# Lorcana Simulator

Svelte 5 board, dev harness, fixtures, and player UI. This package can use both
the engine and cards; tests that need both belong under `src/testing/`.

- Reuse local and ShadCN Svelte components and existing styling patterns.
- Localize player-facing strings with Paraglide.
- The development console is at `http://localhost:5174/`; production root
  and `/matchmaking` redirect to the platform lobby.
- Reuse `/tests/regressions` fixtures when they match the case. Engine
  regressions use `src/testing/regressions/` and `createRegressionTestEngine`;
  browser regressions use `e2e/regressions/` and shared route helpers.

Run from this package: `vp dev`, `vp run check-types`, `vp run test:unit`,
`vp run test:rules`, or `vp run test:e2e`, as needed for the change.

Choose the smallest check first. Card/engine regressions under `src/testing/`
run locally without `vp dev` or platform services. Select the affected test
file with the configured runner instead of running every suite.

For visuals or UI interactions, reuse an existing server or run only `vp dev`
here and open the local devtools or `/tests/regressions` fixture. Inspect the
changed view and exercise the interaction. Auth, matchmaking, hosted transport,
or persistence changes can need platform integration; local simulator work
does not require it.
