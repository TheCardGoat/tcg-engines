# Lorcana Simulator Package

`@tcg/lorcana-simulator` is the Svelte 5 board, dev harness, fixtures, and
player-facing simulator UI. Read the Lorcana submodule guide and rules skill
before changing rules-facing behavior.

## Package Boundary

- The simulator may consume `@tcg/lorcana-engine` and
  `@tcg/lorcana-cards`.
- `@tcg/lorcana-engine` must not import `@tcg/lorcana-cards`, including in
  tests, because that creates a cycle.
- Tests that require both the engine harness and real card definitions belong
  under `src/testing/**` in this package.

## UI Rules

- Reuse local or ShadCN Svelte components first.
- Use DaisyUI only when no local/ShadCN component fits, then Tailwind utilities.
- Write custom CSS only when those layers cannot express the requirement.
- Keep player-facing strings localized through the existing Paraglide setup.
- Preserve Svelte 5 patterns already used by adjacent components.

## Visual Regression Routes

- `http://localhost:5174/` is the dark-only development console. The production
  root continues to redirect to `/matchmaking`.
- `http://localhost:5174/tests/regressions` indexes saved player-report
  fixtures. Search it before adding a new case.
- Reuse one fixture when board state is materially the same. Put engine
  assertions in `src/testing/regressions/` with
  `createRegressionTestEngine`; put browser assertions in `e2e/regressions/`
  with the shared route helpers.

## Commands

Run from this package:

- Development: `vp dev`
- Type check: `vp run check-types`
- Unit/rules tests: `vp run test:unit` or `vp run test:rules`
- Focused Bun test: `bun test <path-to-test>`
- Browser tests: `vp run test:e2e`
- Build: `vp build`

Run the smallest relevant test first. User-visible changes also need browser
proof through the existing fixture or route.
