# Card Text Parser Tests - Refactored Structure

## Overview

This directory contains test files for the Lorcana card text parser. The files have been refactored to be LLM-friendly by breaking down large test files into smaller, more manageable pieces.

## File Organization

### Structure

Each set (001-010) is split into 2-3 files based on card type and alphabetical order:

```
set-XXX-characters-a-m.test.ts    # Characters with names A-M
set-XXX-characters-n-z.test.ts    # Characters with names N-Z
set-XXX-actions-items.test.ts     # Action and Item cards (if present)
set-XXX-locations.test.ts         # Location cards (if present)
```

### Example: Set 010

```
set-010-characters-a-m.test.ts    (3,554 lines, 118 tests)
  - Baloo through Merlin
  
set-010-characters-n-z.test.ts    (1,930 lines, 65 tests)
  - Naveen through Zurg
```

## File Sizes

All files are now LLM-processable:

| File | Lines | Tests |
|------|-------|-------|
| Smallest | 31 | 1 |
| Largest | 3,554 | 118 |
| Average | 1,940 | 78 |

## Running Tests

### Run all card text parser tests
```bash
bun test packages/lorcana-cards/src/parser/v2/__tests__/card-texts/
```

### Run tests for a specific set
```bash
bun test packages/lorcana-cards/src/parser/v2/__tests__/card-texts/set-010-*.test.ts
```

### Run tests for a specific section
```bash
bun test packages/lorcana-cards/src/parser/v2/__tests__/card-texts/set-010-characters-a-m.test.ts
```

## Test Status

All tests are currently **skipped** (`it.skip`). This is intentional - the tests document the expected parser output but are not yet enabled.

- Total tests: 1,633
- Status: All skipped
- Failures: 0
- Execution time: ~109ms

## Adding New Tests

When adding new tests to a set:

1. **Determine the card type**:
   - Character → use `set-XXX-characters-a-m.test.ts` or `set-XXX-characters-n-z.test.ts`
   - Action/Item → use `set-XXX-actions-items.test.ts`
   - Location → use `set-XXX-locations.test.ts`

2. **For characters**, determine alphabetical group:
   - Names A-M → `set-XXX-characters-a-m.test.ts`
   - Names N-Z → `set-XXX-characters-n-z.test.ts`

3. **Add the test** to the appropriate file in alphabetical order

## Test Structure

Each test file follows this structure:

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
  it.skip("Card Name: should parse card text", () => {
    const text = "...card ability text...";
    const result = parseAbilityTextMulti(text);
    
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(N);
    
    // Ability assertions...
  });
});
```

## Documentation

- **REFACTORING-STRATEGY.md** - Detailed strategy and implementation approach
- **REFACTORING-COMPLETE.md** - Completion report with full statistics
- **plan.md** - Original planning document for test generation

## Benefits of This Structure

### For LLMs
- Files are 1,000-3,500 lines (easily processable)
- Focused context per file
- Better token efficiency

### For Development
- Easier to locate specific card tests
- Better organization by card type
- Reduced cognitive load when reviewing
- Easier to add new tests

### For CI/CD
- Can run tests in parallel more efficiently
- Faster feedback on failures
- Better test isolation

## Maintenance

### If files grow too large again
Consider splitting further:
- Characters: A-F, G-M, N-S, T-Z
- Or by ink color: Amber, Amethyst, Emerald, Ruby, Sapphire, Steel

### Updating imports
All files import from the same location:
```typescript
import { parseAbilityTextMulti } from "../../parser";
```

## Statistics

### Before Refactoring
- 10 files
- 40,662 lines
- Max file: 5,470 lines
- Average: 4,066 lines

### After Refactoring
- 21 files
- 40,735 lines
- Max file: 3,554 lines
- Average: 1,940 lines

## Related Files

- Parser implementation: `packages/lorcana-cards/src/parser/v2/parser.ts`
- Parser types: `packages/lorcana-types/src/abilities.ts`
- Card data: `packages/lorcana-cards/src/cards/`

## Questions?

Refer to the documentation files in this directory:
- Implementation details → `REFACTORING-STRATEGY.md`
- Statistics and results → `REFACTORING-COMPLETE.md`
- Test generation guide → `plan.md`
