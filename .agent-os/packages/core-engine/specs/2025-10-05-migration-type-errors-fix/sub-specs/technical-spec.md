# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/packages/core-engine/specs/2025-10-05-migration-type-errors-fix/spec.md

## Technical Requirements

### Error Classification System

Implement a two-category classification system for the 238 type errors:

1. **Card Definition Errors** - Errors originating from card definition files that reference old framework patterns (abilities, effects, triggers)
   - Located in: `src/game-engine/engines/lorcana/src/cards/definitions/*/`
   - Pattern: References to old ability patterns, old effect types, legacy trigger systems
   - Action: Comment out the problematic ability/effect code with preservation markers
   
2. **Normal Type Errors** - Standard TypeScript errors requiring proper fixes
   - Import errors (wrong paths, non-existent exports)
   - Type annotation errors (missing types, incorrect types)
   - Reference errors (undefined variables, removed exports)
   - Property errors (missing required properties, incorrect property types)
   - Action: Fix properly with correct TypeScript code

### Code Commenting Pattern

For card definition abilities that must be commented out:

```typescript
// MIGRATION_REF: [Brief description of what this ability did]
// [Original ability code - commented line by line]
```

**Example:**
```typescript
// MIGRATION_REF: Evasive ability - This character can't be challenged
// abilities: [
//   {
//     type: 'static',
//     name: 'Evasive',
//     text: "This character can't be challenged.",
//     keyword: true
//   }
// ]
```

### File Processing Strategy

Process files in order of dependency to minimize cascading errors:

1. **Phase 1: Core Type Definitions** (6 files, 17 errors)
   - `src/game-engine/core-engine/types/**/*.ts`
   - Fix type definition errors first as they affect other files

2. **Phase 2: Core Framework Files** (10 files, 30 errors)
   - `src/game-engine/core-engine/card/card-filtering.ts`
   - `src/game-engine/core-engine/engine/test-core-engine.ts`
   - `src/game-engine/core-engine/targeting/**/*.ts`
   - Fix core framework type errors

3. **Phase 3: Lorcana Engine Core** (4 files, 58 errors)
   - `src/game-engine/engines/lorcana/src/lorcana-engine.ts`
   - `src/game-engine/engines/lorcana/src/operations/**/*.ts`
   - `src/game-engine/engines/lorcana/src/testing/lorcana-test-engine.ts`
   - Fix engine implementation errors

4. **Phase 4: Card Definitions** (78 files, 130 errors)
   - `src/game-engine/engines/lorcana/src/cards/definitions/**/*.ts`
   - Comment out old pattern abilities, fix test setup errors

5. **Phase 5: Other Engines** (3 files, 3 errors)
   - `src/game-engine/engines/one-piece/**/*.ts`
   - Fix any remaining errors

### Type Check Validation

**Command:** `bun run check-types` (runs `tsc --noEmit`)

**Success Criteria:**
- Exit code: 0
- Output: No error messages
- All 238 errors resolved

### Linting Validation

**Command:** `biome check packages/engines/core-engine`

**Success Criteria:**
- Exit code: 0
- No linting errors
- All auto-fixable issues resolved

### Testing Strategy

**Preserve Existing Tests:**
- Do not modify test assertions or expected behavior
- If test setup/initialization has type errors, fix those
- If test assertions reference old patterns, comment those specific assertions only
- Tests may be skipped temporarily if they test commented-out functionality

**Validation:**
- Run `bun test` to ensure no new test failures introduced
- Tests that previously passed should still pass
- Tests for commented-out abilities may fail (acceptable)

## External Dependencies

No new external dependencies required. This work uses existing TypeScript compiler and Biome tooling.

