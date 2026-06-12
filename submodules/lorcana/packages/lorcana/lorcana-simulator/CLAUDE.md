# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package Overview

`@tcg/lorcana-simulator` is a Svelte 5 component library that provides the tabletop simulator UI for Disney Lorcana. It renders the game board, card zones, drag-and-drop interactions, and player controls on top of the `@tcg/lorcana-engine`.

## Common Commands

```bash
# Development
bun run dev                    # Start Vite dev server
bun run dev:calm               # Dev server with 1200ms HMR delay

# Testing
bun run test                   # All tests (compiles i18n, runs rules + unit)
bun run test:unit              # Unit tests only (src/lib)
bun run test:rules             # Rules specification tests (src/testing/rules)
bun run test:strategy          # Strategy tests (src/testing/strategy)
bun run test:e2e               # Playwright E2E tests
bun run test:e2e:ui            # Playwright with interactive UI

# Type checking
bun run check-types            # svelte-check (requires svelte-kit sync)
bun run check:watch            # Watch mode type checking

# Build
bun run build                  # Full build (vite build + svelte-package + publint)
bun run build:node             # Node.js platform build

# i18n
bun run i18n:compile           # Compile Paraglide translations
bun run i18n:verify            # Compile + check translations

# Formatting (from root)
bun run format                 # Check formatting (oxfmt)
```

Run a single test file: `bun test src/path/to/file.test.ts`
Run a specific test by name: `bun test "test name pattern"`

## Architecture

### Tech Stack

- **UI Framework**: Svelte 5 (runes, `$state`, `$derived`, `$effect`)
- **Build**: Vite + SvelteKit (adapter-node) + svelte-package for library output
- **Styling**: TailwindCSS 4 + DaisyUI 5 + shadcn-svelte + tailwind-variants
- **Drag & Drop**: @dnd-kit/svelte
- **i18n**: Paraglide.js (compiled to `src/lib/paraglide/`)
- **Testing**: Bun test (unit), Playwright (E2E)

### Key Directories

- `src/lib/` — Library source (exported as `@tcg/lorcana-simulator`)
- `src/routes/` — SvelteKit routes (dev harness, not shipped)
- `src/testing/rules/` — Game rules spec tests using the multiplayer test engine
- `src/testing/strategy/` — AI/strategy tests

### Dependency Chain

```
@tcg/lorcana-types → @tcg/lorcana-engine → @tcg/lorcana-cards
                                          → @tcg/lorcana-simulator (this package)
```

The simulator consumes the engine's `LorcanaClient` for game state and `LorcanaServer` for authoritative moves. Card definitions come from `@tcg/lorcana-cards`.

### Testing Patterns

Rules tests use `LorcanaMultiplayerTestEngine` from `@tcg/lorcana-engine/testing`:

```typescript
import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { someCard } from "@tcg/lorcana-cards/cards/001";

describe("Card Name - Ability", () => {
  it("does the expected thing", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [someCard], inkwell: someCard.cost }, // player one
      { play: [otherCard], deck: 1 }, // player two
    );
    expect(engine.asPlayerOne().playCard(someCard)).toBeSuccessfulCommand();
  });
});
```

Custom matchers: `toBeSuccessfulCommand()` — available globally via bunfig.toml preload.

### Workspace Context

This is part of an Nx monorepo (`the-card-goat-online`). Root-level commands:

- `bun run ci-check` — Types + tests across all packages (via `nx run-many`)
- `bun run quality` — Lint + format check (oxlint + oxfmt)
- `bun run quality:fix` — Auto-fix lint and format issues
- `pnpm exec nx graph` — Inspect the project graph

Project tags express the layered boundary `types → foundation → game-engine → card-data`. The simulator sits at the card-data/app layer. Tags are declared in each project's `package.json` (`nx.tags`); enforcement via `@nx/eslint-plugin` is a follow-up.

## Key Conventions

- The engine is under active development. Cards and moves serve as specifications for engine behavior. When a gap is found, validate against Lorcana rules and fix it immediately.
- Test-Driven Development: write tests first.
- No `any` types. Use branded types for IDs (`CardInstanceId`, `PlayerId`).
- Commit messages follow conventional commits format.
- E2E tests use `.e2e.ts` extension (excluded from Bun's test runner, run via Playwright separately).
