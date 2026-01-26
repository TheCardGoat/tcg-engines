# Test File Refactoring Strategy

## Problem Statement

The test files in `card-texts/` are too large for LLMs to process efficiently:

- **set-010.test.ts**: 5,470 lines (183 test cases)
- **set-005.test.ts**: 5,431 lines (180+ test cases)
- **set-009.test.ts**: 5,201 lines (170+ test cases)
- **set-007.test.ts**: 4,588 lines (150+ test cases)
- **set-002.test.ts**: 4,438 lines (145+ test cases)
- **set-006.test.ts**: 4,091 lines (135+ test cases)
- **set-004.test.ts**: 3,393 lines (110+ test cases)
- **set-003.test.ts**: 3,589 lines (120+ test cases)
- **set-001.test.ts**: 2,962 lines (100+ test cases)
- **set-008.test.ts**: 1,499 lines (50+ test cases)

**Total**: 40,662 lines across 10 files

## Solution: Logical Breakdown

### Strategy

Break each set file into **4 smaller files** by grouping test cases into logical chunks:

1. **Characters A-M** (first half of alphabetically sorted characters)
2. **Characters N-Z** (second half of alphabetically sorted characters)
3. **Actions & Items** (all action and item cards)
4. **Locations** (all location cards)

This approach:
- ✅ Keeps related tests together
- ✅ Reduces file size to ~1,200-1,500 lines each
- ✅ Makes files LLM-processable
- ✅ Maintains test organization by card type
- ✅ Preserves all test functionality

### File Naming Convention

```
set-XXX.test.ts                    → set-XXX-characters-a-m.test.ts
                                   → set-XXX-characters-n-z.test.ts
                                   → set-XXX-actions-items.test.ts
                                   → set-XXX-locations.test.ts
```

### Example Breakdown for Set 010

**Current**: `set-010.test.ts` (5,470 lines, 183 tests)

**After refactoring**:
- `set-010-characters-a-m.test.ts` (~1,400 lines, ~50 tests)
- `set-010-characters-n-z.test.ts` (~1,400 lines, ~50 tests)
- `set-010-actions-items.test.ts` (~1,300 lines, ~45 tests)
- `set-010-locations.test.ts` (~1,370 lines, ~38 tests)

## Implementation Steps

### Phase 1: Preparation
1. Create a shared test utilities file (optional, for common imports)
2. Document the breakdown for each set

### Phase 2: Refactoring (Per Set)
For each set file (set-001 through set-010):

1. **Extract test cases** by card type and name
2. **Create 4 new files** with appropriate naming
3. **Distribute tests** across files
4. **Verify imports** are correct in each file
5. **Run tests** to ensure no breakage
6. **Delete original** set file

### Phase 3: Verification
1. Run full test suite: `bun test packages/lorcana-cards/src/parser/v2/__tests__/card-texts/`
2. Verify all tests still skip correctly
3. Verify no tests are accidentally enabled
4. Check test count matches original

## File Structure Template

Each new file will follow this structure:

```typescript
// @ts-nocheck - Skipped tests contain expected values that don't match current types
import { describe, expect, it } from "bun:test";
import type {
  ActionAbilityDefinition,
  ActivatedAbilityDefinition,
  KeywordAbilityDefinition,
  StaticAbilityDefinition,
  TriggeredAbilityDefinition,
} from "@tcg/lorcana-types";
import { parseAbilityTextMulti } from "../../parser";

describe("Set XXX Card Text Parser Tests - [Section]", () => {
  // Test cases here
});
```

## Benefits

### For LLMs
- ✅ Files are now ~1,200-1,500 lines (processable)
- ✅ Focused context per file
- ✅ Easier to understand and modify

### For Development
- ✅ Faster test execution (parallel runs)
- ✅ Easier to locate specific card tests
- ✅ Better organization by card type
- ✅ Reduced cognitive load when reviewing

### For CI/CD
- ✅ Can run tests in parallel more efficiently
- ✅ Faster feedback on failures
- ✅ Better test isolation

## Execution Order

Recommended order (largest to smallest):
1. set-010 (5,470 lines)
2. set-005 (5,431 lines)
3. set-009 (5,201 lines)
4. set-007 (4,588 lines)
5. set-002 (4,438 lines)
6. set-006 (4,091 lines)
7. set-004 (3,393 lines)
8. set-003 (3,589 lines)
9. set-001 (2,962 lines)
10. set-008 (1,499 lines) - Already manageable

## Verification Checklist

After refactoring each set:

- [ ] All 4 new files created
- [ ] All test cases distributed
- [ ] No test cases lost or duplicated
- [ ] All imports correct
- [ ] All tests still skipped
- [ ] Test count matches original
- [ ] No TypeScript errors
- [ ] Tests run successfully: `bun test set-XXX*.test.ts`
- [ ] Original file deleted

## Notes

- **Keep `it.skip`**: All tests remain skipped - no changes to test status
- **Preserve order**: Maintain alphabetical order within each section
- **No logic changes**: Only reorganizing, not modifying test content
- **Shared imports**: Each file has its own imports (no shared utilities needed)

## Future Improvements

Once files are split:
1. Consider creating a test index/registry
2. Add test filtering by card type
3. Implement parallel test execution
4. Create test generation scripts for new sets
