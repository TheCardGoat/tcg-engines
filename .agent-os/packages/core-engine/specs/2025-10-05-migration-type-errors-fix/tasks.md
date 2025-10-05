# Spec Tasks

## Tasks

- [ ] 1. Fix Core Type Definition Errors (Phase 1)
  - [ ] 1.1 Run `bun run check-types` to identify all type errors in `src/game-engine/core-engine/types/**/*.ts` files
  - [ ] 1.2 Fix type definition errors in `src/game-engine/core-engine/types/__tests__/game-specific-extension.test.ts` and `game-specific-types.test.ts`
  - [ ] 1.3 Update type exports and imports that reference removed or renamed types
  - [ ] 1.4 Verify all tests for packages/engines/core-engine pass (`bun test src/game-engine/core-engine/types`)
  - [ ] 1.5 Verify linter rules pass for modified files (`biome check`)
  - [ ] 1.6 Verify type safety for Phase 1 files (`bun run check-types`)
  - [ ] 1.7 Use the code-reviewer subagent to review the code changes

- [ ] 2. Fix Core Framework Type Errors (Phase 2)
  - [ ] 2.1 Run `bun run check-types` to identify errors in core framework files (card-filtering, test-core-engine, targeting)
  - [ ] 2.2 Fix import and type reference errors in `src/game-engine/core-engine/card/card-filtering.ts`
  - [ ] 2.3 Fix type errors in `src/game-engine/core-engine/engine/test-core-engine.ts`
  - [ ] 2.4 Fix type errors in `src/game-engine/core-engine/targeting/` files (card-filter-builder, target-resolver, integration tests)
  - [ ] 2.5 Verify all tests for core framework files pass (`bun test src/game-engine/core-engine`)
  - [ ] 2.6 Verify linter rules pass for modified files (`biome check`)
  - [ ] 2.7 Verify type safety for Phase 2 files (`bun run check-types`)
  - [ ] 2.8 Use the code-reviewer subagent to review the code changes

- [ ] 3. Fix Lorcana Engine Core Errors (Phase 3)
  - [ ] 3.1 Run `bun run check-types` to identify errors in Lorcana engine core files
  - [ ] 3.2 Fix type errors in `src/game-engine/engines/lorcana/src/lorcana-engine.ts`
  - [ ] 3.3 Fix type errors in `src/game-engine/engines/lorcana/src/cards/lorcana-game-card.ts`
  - [ ] 3.4 Fix type errors in `src/game-engine/engines/lorcana/src/operations/lorcana-core-operations.ts`
  - [ ] 3.5 Fix type errors in `src/game-engine/engines/lorcana/src/operations/modules/resolve-layer-item.ts` (51 errors)
  - [ ] 3.6 Fix type errors in `src/game-engine/engines/lorcana/src/testing/lorcana-test-engine.ts`
  - [ ] 3.7 Verify all tests for Lorcana engine core pass (`bun test src/game-engine/engines/lorcana/src --exclude="**/cards/definitions/**"`)
  - [ ] 3.8 Verify linter rules pass for modified files (`biome check`)
  - [ ] 3.9 Verify type safety for Phase 3 files (`bun run check-types`)
  - [ ] 3.10 Use the code-reviewer subagent to review the code changes

- [ ] 4. Fix Card Definition Errors - Set 001 (Phase 4a)
  - [ ] 4.1 Run `bun run check-types` to identify errors in Set 001 card definitions
  - [ ] 4.2 Process Set 001 action cards: Comment out old pattern abilities with `// MIGRATION_REF:` markers, fix test setup errors
  - [ ] 4.3 Fix normal type errors (imports, test setup, type annotations) in Set 001 files
  - [ ] 4.4 Verify linter rules pass for Set 001 files (`biome check src/game-engine/engines/lorcana/src/cards/definitions/001`)
  - [ ] 4.5 Verify type safety for Set 001 (`bun run check-types`)
  - [ ] 4.6 Use the code-reviewer subagent to review the Set 001 changes

- [ ] 5. Fix Card Definition Errors - Sets 002-008 (Phase 4b)
  - [ ] 5.1 Run `bun run check-types` to identify remaining card definition errors in Sets 002-008
  - [ ] 5.2 Process Sets 002-004: Comment out old pattern abilities with `// MIGRATION_REF:` markers, fix test setup errors
  - [ ] 5.3 Process Sets 005-006: Comment out old pattern abilities with `// MIGRATION_REF:` markers, fix test setup errors
  - [ ] 5.4 Process Sets 007-008: Comment out old pattern abilities with `// MIGRATION_REF:` markers, fix test setup errors
  - [ ] 5.5 Fix the special case in `src/game-engine/engines/lorcana/src/cards/definitions/006/index.ts`
  - [ ] 5.6 Verify linter rules pass for Sets 002-008 (`biome check src/game-engine/engines/lorcana/src/cards/definitions`)
  - [ ] 5.7 Verify type safety for all card definitions (`bun run check-types`)
  - [ ] 5.8 Use the code-reviewer subagent to review the Sets 002-008 changes

- [ ] 6. Fix Remaining Engine Errors and Final Validation (Phase 5)
  - [ ] 6.1 Run `bun run check-types` to identify any remaining errors
  - [ ] 6.2 Fix type errors in `src/game-engine/engines/one-piece/src/one-piece-engine.ts` if any remain
  - [ ] 6.3 Fix any remaining type errors not covered in previous phases
  - [ ] 6.4 Run full test suite for packages/engines/core-engine (`bun test packages/engines/core-engine`)
  - [ ] 6.5 Run full linter check (`biome check packages/engines/core-engine`)
  - [ ] 6.6 Run final type check and verify zero errors (`bun run check-types`)
  - [ ] 6.7 Verify CI pipeline would pass by running all checks sequentially
  - [ ] 6.8 Use the code-reviewer subagent to review all changes made across phases

