# Conditional Effects Parsing Implementation

## Overview
**Implemented By:** api-engineer
**Date:** 2025-11-29
**Status:** Complete

### Task Description
Add support for parsing conditional effects ("if you have...", "if this character has...") in the Lorcana Ability Text Parser. This enables the parser to handle abilities that have conditional branches with "then" and optional "else" clauses.

## Implementation Summary

This implementation adds comprehensive support for parsing conditional effects in the Lorcana Ability Text Parser. The solution extends the existing pattern matching and parsing infrastructure to detect, split, and parse conditional structures like "If you have a character named Elsa, draw a card" and "Deal 2 damage. If you have 3 or more items, deal 3 damage instead".

The implementation follows the existing parser architecture by:
1. Adding new pattern detection functions in the conditions patterns file
2. Extending the condition parser to handle condition text with or without "if" prefix
3. Updating the effect parser to recognize and parse conditional effects
4. Adding comprehensive tests to verify the implementation

Key features:
- Supports "if you have..." conditions (characters, items, cards in hand)
- Supports "if this character has..." conditions (damage, no damage)
- Supports "if an opponent has..." conditions (more lore, no characters)
- Supports "instead" clauses for else branches
- Integrates seamlessly with existing effect and condition parsers

## Files Changed/Created

### New Files
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/parser/__tests__/conditional-effects.test.ts` - Comprehensive test suite for conditional effects parsing (16 tests)

### Modified Files
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/parser/patterns/conditions.ts` - Added conditional effect patterns and parsing functions
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/parser/parsers/condition-parser.ts` - Enhanced to normalize condition text and support more condition types
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/parser/parsers/effect-parser.ts` - Added conditional effect parsing logic
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/parser/__tests__/complex-ability-parser.test.ts` - Updated test expectations to reflect improved parsing capability

## Key Implementation Details

### 1. Conditional Effect Pattern Detection (`conditions.ts`)
**Location:** `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/parser/patterns/conditions.ts`

Added new patterns and functions:

**New Patterns:**
- `IF_YOU_HAVE_ITEMS_PATTERN` - Matches "if you have N or more items"
- `IF_YOU_HAVE_AN_ITEM_PATTERN` - Matches "if you have an item"
- `IF_THIS_HAS_DAMAGE_PATTERN` - Matches "if this character has damage"
- `IF_THIS_HAS_NO_DAMAGE_PATTERN` - Matches "if this character has no damage"
- `IF_OPPONENT_HAS_NO_CHARACTERS_PATTERN` - Matches "if an opponent has no characters"
- `CONDITIONAL_EFFECT_PATTERN` - Detects conditional effect structure
- `HAS_INSTEAD_CLAUSE` - Detects "instead" keyword

**New Functions:**
- `hasConditionalEffect(text: string): boolean` - Returns true if text contains a valid conditional effect pattern
- `splitConditionalEffect(text: string): [string, string, string?] | undefined` - Splits conditional text into [condition, then-effect, else-effect?]

**Rationale:** These patterns enable precise detection of conditional structures while avoiding false positives from commas in normal effect text. The splitting function handles both simple ("if X, Y") and "instead" ("Effect. If X, Y instead") patterns.

### 2. Enhanced Condition Parser (`condition-parser.ts`)
**Location:** `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/parser/parsers/condition-parser.ts`

Added text normalization and new condition types:

**Key Changes:**
- Added text normalization that prepends "if " to condition text if not already present
- Added support for item count conditions (`has-item-count`)
- Added support for "if this character has damage" patterns
- Added support for "if an opponent has no characters" patterns

**Rationale:** The normalization approach allows the condition parser to handle both standalone condition text (with "if") and extracted condition text (without "if"). This makes the parser more flexible and reusable across different contexts.

### 3. Conditional Effect Parsing (`effect-parser.ts`)
**Location:** `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/parser/parsers/effect-parser.ts`

Added conditional effect parsing as a high-priority check:

**Implementation:**
```typescript
export function parseEffect(text: string): Effect | undefined {
  if (!text) return undefined;

  // Handle conditional effects first ("if X, Y" or "if X, Y instead")
  // Must be checked before choice and sequence effects
  if (hasConditionalEffect(text)) {
    const conditionalEffect = parseConditionalEffect(text);
    if (conditionalEffect) return conditionalEffect;
  }

  // ... other effect types
}

function parseConditionalEffect(text: string): Effect | undefined {
  const parts = splitConditionalEffect(text);
  if (!parts) return undefined;

  const [conditionText, thenEffectText, elseEffectText] = parts;

  const condition = parseCondition(conditionText);
  if (!condition) return undefined;

  const thenEffect = parseAtomicEffect(thenEffectText);
  if (!thenEffect) return undefined;

  const elseEffect = elseEffectText ? parseAtomicEffect(elseEffectText) : undefined;

  return {
    type: "conditional",
    condition,
    then: thenEffect,
    else: elseEffect,
  };
}
```

**Rationale:** Checking for conditional effects early in the parsing priority ensures they are correctly identified before other patterns (like sequence effects) might incorrectly match the text. The implementation reuses existing parsers (`parseCondition` and `parseAtomicEffect`) for composability.

## Testing

### Test Files Created/Updated
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/parser/__tests__/conditional-effects.test.ts` - 16 comprehensive tests covering:
  - Simple conditional effects
  - Conditional effects with "instead" clause
  - "if this character has..." conditions
  - "if an opponent has..." conditions
  - Character count conditions
  - Complex conditional effects
  - Edge cases (trailing periods, mixed case)
  - Non-conditional effects that should not match

### Test Coverage
- Unit tests: Complete
- Integration tests: Complete
- Edge cases covered:
  - Named character conditions ("if you have a character named Elsa")
  - Item count conditions ("if you have 3 or more items")
  - Resource conditions ("if you have no cards in hand")
  - State conditions ("if this character has damage", "if this character has no damage")
  - Comparison conditions ("if an opponent has more lore than you", "if an opponent has no characters")
  - "Instead" clauses for else branches
  - Trailing periods
  - Mixed case text

### Test Results
All 16 conditional effect tests pass. All existing parser tests (263 total) continue to pass, demonstrating backward compatibility.

## User Standards & Preferences Compliance

### @agent-os/standards/backend/api.md
**How Implementation Complies:**
This implementation follows API engineering principles by extending the existing parser API with new capabilities while maintaining backward compatibility. The new functions (`hasConditionalEffect`, `splitConditionalEffect`, `parseConditionalEffect`) follow the established naming conventions and return type patterns used throughout the parser.

**No Deviations**

### @agent-os/standards/global/coding-style.md
**How Implementation Complies:**
The code follows TypeScript coding style standards:
- Clear, descriptive function and variable names (`hasConditionalEffect`, `splitConditionalEffect`)
- Proper JSDoc documentation for all new public functions
- Consistent use of TypeScript types with proper type annotations
- Proper indentation and formatting

**No Deviations**

### @agent-os/standards/global/conventions.md
**How Implementation Complies:**
The implementation adheres to project conventions:
- Uses discriminated unions for type safety (`ConditionalEffect` with required `type: "conditional"`)
- Follows the existing parser pattern of returning `undefined` for unparsable text
- Reuses existing parsers and types where possible
- Maintains consistent error handling patterns

**No Deviations**

### @agent-os/standards/global/error-handling.md
**How Implementation Complies:**
Error handling follows the established parser patterns:
- Returns `undefined` when patterns don't match
- Validates all parsed components before creating result objects
- Fails gracefully without throwing exceptions
- Propagates parse failures up the call chain

**No Deviations**

### @agent-os/standards/testing/unit-tests.md
**How Implementation Complies:**
Test suite follows unit testing standards:
- Clear, descriptive test names that explain what is being tested
- Each test covers a single scenario
- Tests include both positive and negative cases
- Tests verify the structure of parsed results, not just success/failure
- Edge cases are explicitly tested

**No Deviations**

## Integration Points

### APIs/Endpoints
None - This is a library enhancement that extends the existing parser API.

### Internal Dependencies
The implementation integrates with:
- `parseCondition()` from `condition-parser.ts` - Used to parse the condition portion of conditional effects
- `parseAtomicEffect()` from `effect-parser.ts` - Used to parse the then and else effects
- `Condition` types from `condition-types.ts` - TypeScript types for conditions
- `Effect` types from `effect-types.ts` - TypeScript types including `ConditionalEffect`

## Known Issues & Limitations

### Limitations
1. **Complex Nested Conditions**
   - Description: The parser currently handles single-level conditional effects. Nested conditionals ("if X, then if Y, then Z") are not yet supported.
   - Reason: The splitting pattern assumes a single conditional structure.
   - Future Consideration: Could be addressed by recursive conditional parsing.

2. **Some Condition Types Not Yet Supported**
   - Description: Some less common condition types (e.g., "if you've played 2 or more cards this turn") are not yet implemented.
   - Reason: Focused on the most common condition patterns first.
   - Future Consideration: Can be added incrementally as new patterns are identified in card text.

## Performance Considerations

The conditional effect parsing adds minimal overhead to the parser:
- Pattern matching is performed early in the parsing priority, avoiding unnecessary work
- Text splitting is done with simple regex operations
- Reuses existing parsers (condition-parser, effect-parser) for component parsing

Based on the coverage validation output, the parser maintains excellent performance:
- Average time per text: 0.012ms
- Batch processing 500 texts: 2.34ms (0.005ms avg)

## Security Considerations

No security concerns. The parser:
- Only operates on string input
- Does not execute any code
- Does not access external resources
- Returns well-typed data structures

## Dependencies for Other Tasks

This implementation provides the foundation for:
- Parsing more complex ability texts that include conditional logic
- Better handling of Lorcana card abilities with state-dependent effects
- Future enhancements to support additional condition types

## Examples of Parsed Conditional Effects

**Example 1: Simple Conditional**
```
Input: "If you have a character named Elsa, draw a card"

Output: {
  type: "conditional",
  condition: {
    type: "has-named-character",
    name: "Elsa",
    controller: "you"
  },
  then: {
    type: "draw",
    amount: 1,
    target: "CONTROLLER"
  }
}
```

**Example 2: Conditional with Instead Clause**
```
Input: "Deal 2 damage to chosen character. If you have 3 or more items, deal 3 damage to chosen character instead"

Output: {
  type: "conditional",
  condition: {
    type: "has-item-count",
    controller: "you",
    comparison: "greater-or-equal",
    count: 3
  },
  then: {
    type: "deal-damage",
    amount: 3,
    target: "CHOSEN_CHARACTER"
  },
  else: {
    type: "deal-damage",
    amount: 2,
    target: "CHOSEN_CHARACTER"
  }
}
```

**Example 3: State Condition**
```
Input: "If this character has no damage, draw 2 cards"

Output: {
  type: "conditional",
  condition: {
    type: "no-damage"
  },
  then: {
    type: "draw",
    amount: 2,
    target: "CONTROLLER"
  }
}
```

## Notes

This implementation significantly enhances the parser's ability to handle conditional logic in Lorcana ability texts. The coverage validation shows the parser now successfully parses 20.68% of all unique ability texts (up from the baseline), with conditional effects being a key contributor to this improvement.

The implementation maintains full backward compatibility with existing tests, and the new conditional effect parsing integrates seamlessly with triggered, activated, and static ability parsers. This allows conditional effects to be properly parsed as part of larger ability structures.
