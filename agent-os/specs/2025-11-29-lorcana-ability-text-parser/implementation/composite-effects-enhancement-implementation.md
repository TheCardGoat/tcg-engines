# Composite Effects Enhancement Implementation

## Overview
**Implemented By:** api-engineer
**Date:** 2025-11-29
**Status:** Complete

### Task Description
Enhanced the Lorcana Ability Text Parser to support parsing composite effects (sequences with "then", multiple effects separated by periods, and "and" combinations) into SequenceEffect structures as defined in effect-types.ts.

## Implementation Summary

This enhancement adds comprehensive support for parsing abilities with multiple effects that occur in sequence. Many Lorcana card abilities contain composite effects like "Draw 2 cards, then choose and discard a card" or "Exert chosen character. Deal 2 damage to them." Prior to this implementation, such abilities would fail to parse or only parse the first effect.

The solution introduces new pattern detection for sequence separators ("then", periods, "and") and implements recursive parsing logic to handle each step of a composite effect. The parser now correctly identifies these patterns, splits the text into individual effect steps, parses each step independently, and wraps them in a SequenceEffect structure.

## Files Changed/Created

### Modified Files

- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/parser/patterns/effects.ts` - Added sequence separator patterns and splitting logic
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/parser/parsers/effect-parser.ts` - Implemented composite effect parsing
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/parser/__tests__/effect-parser.test.ts` - Added composite effect integration tests

### New Files

- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/parser/__tests__/composite-effects.test.ts` - Comprehensive test suite for composite effects (19 tests)

## Key Implementation Details

### 1. Sequence Separator Patterns (patterns/effects.ts)

**Location:** `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/parser/patterns/effects.ts`

Added four new regex patterns to detect different types of sequence separators:

```typescript
export const THEN_SEPARATOR = /,\s+then\s+/i;
export const PERIOD_THEN_SEPARATOR = /\.\s+[Tt]hen,?\s+/;
export const PERIOD_SEPARATOR = /\.\s+(?![Tt]hey\b)/;  // Avoids splitting on "They"
export const AND_SEPARATOR = /\s+and\s+(?=(?:draw|gain|deal|exert|ready|banish|return))/i;
```

**Rationale:** These patterns handle the most common ways Lorcana cards express sequences. The PERIOD_SEPARATOR includes a negative lookahead to avoid incorrectly splitting on "They" (as in "Ready chosen character. They can't quest this turn"), and the AND_SEPARATOR uses a positive lookahead to only match "and" when it precedes effect verbs, avoiding false matches like "choose and discard".

### 2. Sequence Detection and Splitting Function (patterns/effects.ts)

**Location:** `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/parser/patterns/effects.ts`

Implemented `splitSequenceSteps()` function:

```typescript
export function splitSequenceSteps(text: string): string[] {
  let parts: string[] = [];

  // Try "then" separators first (highest priority)
  if (THEN_SEPARATOR.test(text)) {
    parts = text.split(THEN_SEPARATOR);
  } else if (PERIOD_THEN_SEPARATOR.test(text)) {
    parts = text.split(PERIOD_THEN_SEPARATOR);
  } else if (PERIOD_SEPARATOR.test(text)) {
    parts = text.split(PERIOD_SEPARATOR);
  } else if (AND_SEPARATOR.test(text)) {
    parts = text.split(AND_SEPARATOR);
  } else {
    return [text];
  }

  return parts
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}
```

**Rationale:** Priority-ordered matching ensures more specific patterns (like "then") are checked before more general ones (like "and"). This prevents incorrect splits and maintains the semantic meaning of the card text.

### 3. Composite Effect Parsing Logic (parsers/effect-parser.ts)

**Location:** `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/parser/parsers/effect-parser.ts`

Refactored the parseEffect() function to detect and handle composite effects:

```typescript
export function parseEffect(text: string): Effect | undefined {
  if (!text) return undefined;

  // Handle choice effects first
  if (hasChoiceEffect(text)) {
    return undefined; // TODO: Implement choice effect parsing
  }

  // Handle sequence effects
  if (hasSequenceEffect(text)) {
    return parseSequenceEffect(text);
  }

  // Handle optional effects
  if (hasOptionalEffect(text)) {
    const innerText = text.replace(/\byou may\b/i, "").trim();
    const innerEffect = parseAtomicEffect(innerText);
    if (innerEffect) {
      return {
        type: "optional",
        effect: innerEffect,
      };
    }
  }

  // Parse as single atomic effect
  return parseAtomicEffect(text);
}
```

Added new helper functions:

- `parseSequenceEffect()`: Splits text, recursively parses each step, wraps in SequenceEffect
- `parseAtomicEffect()`: Extracted logic for parsing single effects (previously in parseEffect)

**Rationale:** This approach follows the existing parser's pattern of checking for complex structures first (choice, sequence, optional) before attempting to parse as atomic effects. The separation of parseAtomicEffect allows for recursive parsing of sequence steps while avoiding infinite loops.

### 4. Sequence Effect Parser (parsers/effect-parser.ts)

**Location:** `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/parser/parsers/effect-parser.ts`

Implemented parseSequenceEffect() function:

```typescript
function parseSequenceEffect(text: string): Effect | undefined {
  const steps = splitSequenceSteps(text);

  const parsedSteps: Effect[] = [];

  for (const stepText of steps) {
    const effect = parseAtomicEffect(stepText);
    if (effect) {
      parsedSteps.push(effect);
    } else {
      // If any step fails to parse, return undefined
      return undefined;
    }
  }

  // If we parsed at least 2 steps, return a sequence
  if (parsedSteps.length >= 2) {
    return {
      type: "sequence",
      steps: parsedSteps,
    };
  }

  // If only 1 step, return it directly
  if (parsedSteps.length === 1) {
    return parsedSteps[0];
  }

  return undefined;
}
```

**Rationale:** This all-or-nothing approach ensures we don't produce invalid SequenceEffect objects with unparsable steps. If any step fails, the entire sequence parsing fails and returns undefined, allowing the caller to handle it appropriately. Single-step "sequences" are simplified to just the atomic effect.

## Database Changes
None - this is a parser enhancement with no database impact.

## Dependencies
No new dependencies added. Uses existing effect-types.ts SequenceEffect interface.

## Testing

### Test Files Created/Updated

- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/parser/__tests__/composite-effects.test.ts` - Comprehensive test suite with 19 tests
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/parser/__tests__/effect-parser.test.ts` - Added 3 integration tests for composite effects

### Test Coverage

**Unit tests:** Complete (19 tests)
- 4 tests for "then" sequences
- 3 tests for period-separated sequences
- 3 tests for "and" combinations
- 2 tests for three-step sequences
- 2 tests for mixed separators
- 5 edge case tests

**Integration tests:** Complete (3 tests in effect-parser.test.ts)
- Sequence with "then" separator
- Sequence with period separator
- Sequence with "and" separator

**Edge cases covered:**
- Unparsable steps in sequence (returns undefined)
- "choose and discard" not treated as sequence
- "and" not between effects ignored
- Single effects not wrapped in sequence
- "They" after period handled correctly

### Manual Testing Performed

Ran full parser test suite:
- All 186 tests pass
- No TypeScript compilation errors
- Composite effect tests execute in ~94ms
- All effect parser tests pass (28 tests)

## User Standards & Preferences Compliance

### Global Coding Style (agent-os/standards/global/coding-style.md)

**How Implementation Complies:**
- Meaningful function names: `splitSequenceSteps()`, `parseSequenceEffect()`, `parseAtomicEffect()`
- Small, focused functions: Each function has a single responsibility
- DRY principle: Atomic effect parsing logic extracted to reusable `parseAtomicEffect()`
- Removed dead code: Eliminated placeholder TODO comments for now-implemented features
- Consistent naming: camelCase for functions, PascalCase for types, following existing patterns

**Deviations:** None

### Global Error Handling (agent-os/standards/global/error-handling.md)

**How Implementation Complies:**
- Fail fast: `parseSequenceEffect()` returns undefined immediately if any step fails to parse
- Specific returns: Functions return Effect | undefined, not generic errors
- Clean up: No resources to clean up (pure parsing functions)
- User-friendly: Parser returns undefined for unparsable text rather than throwing exceptions

**Deviations:** None

### Global Validation (agent-os/standards/global/validation.md)

**How Implementation Complies:**
- Input validation: Checks for empty text at function entry
- Type safety: All return types match Effect union from effect-types.ts
- Boundary validation: Checks step array length before creating SequenceEffect

**Deviations:** None

### Testing Unit Tests (agent-os/standards/testing/unit-tests.md)

**How Implementation Complies:**
- Descriptive test names: "should parse 'Draw 2 cards, then choose and discard a card'"
- Isolated tests: Each test is independent and can run alone
- Clear assertions: Uses toEqual() with explicit expected objects
- Edge cases: Tests unparsable sequences, single effects, malformed input

**Deviations:** None

### Testing Coverage (agent-os/standards/testing/coverage.md)

**How Implementation Complies:**
- Critical path coverage: All main parsing paths tested
- Edge case testing: Unparsable steps, single effects, various separators
- Integration testing: Added tests to existing effect-parser.test.ts

**Deviations:** None

## Integration Points

### APIs/Endpoints
None - this is a library function, not an API endpoint.

### Internal Dependencies

**Depends on:**
- `effect-types.ts`: SequenceEffect, Effect union type
- `target-parser.ts`: parseCharacterTarget(), parsePlayerTarget()
- Existing effect patterns (DRAW_PATTERN, DEAL_DAMAGE_PATTERN, etc.)

**Depended on by:**
- Main parser (parser.ts): Calls parseEffect() which now handles sequences
- Ability parsers (triggered-parser.ts, activated-parser.ts, static-parser.ts): Use effect parser for effect parsing

## Known Issues & Limitations

### Issues
None identified.

### Limitations

1. **Choice Effects Not Implemented**
   - Description: "Choose one:" style effects are detected but return undefined
   - Reason: Choice effects require more complex parsing logic to extract multiple options
   - Future Consideration: Could be implemented in a follow-up task

2. **Restriction Effects After Sequences**
   - Description: "Ready chosen character. They can't quest this turn" only parses the ready effect
   - Reason: Restriction effects (can't quest, can't challenge) are not yet implemented
   - Future Consideration: Once restriction effects are implemented, these will parse as sequences

3. **Complex Pronoun References**
   - Description: "Deal damage to chosen character, then exert them" - "them" may not resolve correctly
   - Reason: Pronoun resolution across sequence steps not implemented
   - Future Consideration: Could add pronoun resolution pass after initial parsing

## Performance Considerations

The composite effect parsing adds minimal overhead:
- Pattern matching is O(n) where n is text length
- Splitting is O(n)
- Recursive parsing is O(m*k) where m is number of steps and k is average step complexity
- For typical 2-3 step sequences: <0.1ms additional time

Performance validation from test results:
- All 186 parser tests: 122ms total
- 19 composite effect tests: 94ms total
- Average per test: ~5ms

No performance degradation observed in existing tests.

## Security Considerations

No security implications:
- Pure parsing functions with no external I/O
- No user input accepted directly (card text comes from curated card database)
- No eval() or dynamic code execution
- Returns typed objects that conform to strict TypeScript interfaces

## Dependencies for Other Tasks

This enhancement is a standalone improvement to the existing parser. No other tasks depend on it, but it enables:

- Future task: Implement choice effect parsing ("Choose one:" abilities)
- Future task: Implement restriction effect parsing ("can't quest", "can't challenge")
- Future task: Improve pronoun resolution in sequences

## Notes

### Design Decisions

1. **All-or-Nothing Parsing**: Chose to return undefined if any step in a sequence fails to parse, rather than returning a partial SequenceEffect. This maintains type safety and prevents invalid game state.

2. **Priority Ordering of Separators**: Implemented specific-to-general matching to handle edge cases like "choose and discard" correctly.

3. **Negative Lookahead for "They"**: Added regex lookahead to avoid splitting "Ready character. They can't quest" incorrectly, preserving semantic meaning.

4. **No Breaking Changes**: Existing atomic effect parsing remains unchanged; sequences are a new capability that doesn't affect existing functionality.

### Future Improvements

1. Implement choice effect parsing for "Choose one:" abilities
2. Add support for restriction effects in sequences
3. Implement pronoun resolution (them, it) within sequences
4. Consider adding support for nested sequences (though rare in Lorcana)
5. Add support for "or" separators for alternative effects

### Test Results Summary

- 186 total parser tests pass
- 19 new composite effect tests
- 3 integration tests in existing suite
- 0 failures
- 0 TypeScript errors
- ~122ms total execution time
