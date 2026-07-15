# Choice Effects Implementation

## Overview
**Implementation Date:** 2025-11-29
**Implemented By:** API Engineer
**Status:** Complete

### Task Description
Add support for parsing "Choose one:" effects (choice effects) in the Lorcana Ability Text Parser. Many Lorcana cards have choice effects where the player selects one option from multiple possibilities. The parser needed to handle three distinct formats:

1. **Standard "Choose one:" format with periods:** "Choose one: Draw a card. Deal 2 damage to chosen character."
2. **Bullet/dash format:** "Choose one: • Draw a card • Deal 2 damage to chosen character"
3. **"or" format:** "Draw a card or deal 2 damage to chosen character"

## Implementation Summary

The implementation added comprehensive support for parsing choice effects by:

1. **Extended pattern infrastructure** in `effects.ts` to detect and split choice effects using three different separator patterns (bullets, periods, and "or")
2. **Implemented choice effect parsing** in `effect-parser.ts` by adding a new `parseChoiceEffect()` function that recursively parses each option
3. **Prioritized choice effects** over sequence effects in the parsing order to prevent misclassification
4. **Added comprehensive tests** covering all three choice formats plus edge cases

The implementation maintains backward compatibility with existing parser functionality and follows the established patterns for composite effect parsing (similar to sequence effects).

## Files Changed/Created

### Modified Files
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/parser/patterns/effects.ts` - Added choice patterns and splitting logic
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/parser/parsers/effect-parser.ts` - Implemented choice effect parsing

### New Files
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/parser/__tests__/choice-effects.test.ts` - Comprehensive test suite for choice effects

## Key Implementation Details

### 1. Pattern Infrastructure (effects.ts)

**Location:** `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/parser/patterns/effects.ts`

Added new patterns for detecting and splitting choice effects:

```typescript
export const CHOICE_BULLET_SEPARATOR = /\s*•\s*/;
export const CHOICE_PERIOD_SEPARATOR = /\.\s+/;
export const CHOICE_OR_SEPARATOR = /\s+or\s+(?!(?:more|less|equal))/i;
```

**Key Changes:**
- Renamed `CHOICE_SEPARATOR` to `CHOICE_BULLET_SEPARATOR` for clarity
- Added `CHOICE_PERIOD_SEPARATOR` to handle period-delimited options
- Added `CHOICE_OR_SEPARATOR` with negative lookahead to avoid matching "or more"/"or less"

**Rationale:** The three distinct separator patterns allow the parser to handle all known choice effect formats in Lorcana cards while avoiding false positives.

### 2. hasChoiceEffect() Enhancement

Enhanced the `hasChoiceEffect()` function to detect "or" format choices:

```typescript
export function hasChoiceEffect(text: string): boolean {
  if (CHOOSE_ONE_PATTERN.test(text)) {
    return true;
  }

  // Check for "or" format, but avoid "choose and discard or" pattern
  if (CHOICE_OR_SEPARATOR.test(text) && !CHOOSE_AND_DISCARD_PATTERN.test(text)) {
    // Additional validation: ensure it's between effect verbs
    const orSeparatorPattern = /\b(draw|gain|deal|exert|ready|banish|return)[^.]*\s+or\s+[^.]*\b(draw|gain|deal|exert|ready|banish|return)\b/i;
    return orSeparatorPattern.test(text);
  }

  return false;
}
```

**Rationale:** The additional validation ensures that "or" is only matched when it appears between effect verbs, preventing false positives like "3 or more characters" or "choose and discard or".

### 3. splitChoiceOptions() Function

Added a new function to intelligently split choice effect text based on the format:

```typescript
export function splitChoiceOptions(text: string): string[] {
  let optionsText = text;

  // Remove "Choose one:" prefix if present
  if (CHOOSE_ONE_PATTERN.test(text)) {
    optionsText = text.replace(CHOOSE_ONE_PATTERN, "").trim();
  }

  let parts: string[] = [];

  // Try bullet separator first (highest priority for explicit "Choose one:")
  if (CHOICE_BULLET_SEPARATOR.test(optionsText)) {
    parts = optionsText.split(CHOICE_BULLET_SEPARATOR);
  }
  // Try period separator (for "Choose one: X. Y. Z.")
  else if (CHOOSE_ONE_PATTERN.test(text) && CHOICE_PERIOD_SEPARATOR.test(optionsText)) {
    parts = optionsText.split(CHOICE_PERIOD_SEPARATOR);
  }
  // Try "or" separator (for "X or Y" format)
  else if (CHOICE_OR_SEPARATOR.test(optionsText)) {
    parts = optionsText.split(CHOICE_OR_SEPARATOR);
  }
  // No separator found, return as single option
  else {
    return [optionsText];
  }

  // Clean up parts: trim whitespace, remove empty strings, and remove trailing periods
  return parts
    .map((part) => part.trim().replace(/\.$/, ""))
    .filter((part) => part.length > 0);
}
```

**Rationale:** The function uses a priority-based approach (bullets > periods > "or") to handle the various formats correctly. It also cleans up the resulting option strings by removing trailing periods and empty strings.

### 4. Choice Effect Parser (effect-parser.ts)

**Location:** `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/parser/parsers/effect-parser.ts`

Implemented the `parseChoiceEffect()` function that recursively parses each option:

```typescript
function parseChoiceEffect(text: string): Effect | undefined {
  const optionTexts = splitChoiceOptions(text);

  // Parse each option as an atomic effect
  const parsedOptions: Effect[] = [];
  const optionLabels: string[] = [];

  for (const optionText of optionTexts) {
    const effect = parseAtomicEffect(optionText);
    if (effect) {
      parsedOptions.push(effect);
      optionLabels.push(optionText);
    } else {
      // If any option fails to parse, return undefined
      return undefined;
    }
  }

  // If we parsed at least 2 options, return a choice effect
  if (parsedOptions.length >= 2) {
    return {
      type: "choice",
      options: parsedOptions,
      optionLabels,
    };
  }

  // Not enough options parsed successfully
  return undefined;
}
```

**Rationale:** The function follows the same pattern as `parseSequenceEffect()`, recursively parsing each option as an atomic effect. It preserves the original option text in `optionLabels` for display purposes and fails gracefully if any option is unparsable.

### 5. Parsing Priority

Updated `parseEffect()` to check for choice effects before sequence effects:

```typescript
export function parseEffect(text: string): Effect | undefined {
  if (!text) return undefined;

  // Handle choice effects first ("Choose one:" or "X or Y")
  if (hasChoiceEffect(text)) {
    return parseChoiceEffect(text);
  }

  // Handle sequence effects ("X, then Y" or "X. Y" or "X and Y")
  if (hasSequenceEffect(text)) {
    return parseSequenceEffect(text);
  }

  // ... rest of parsing logic
}
```

**Rationale:** Choice effects must be detected before sequence effects because both can use period separators. The explicit "Choose one:" prefix or "or" separator provides a clear signal that takes priority over sequence detection.

## Testing

### Test Files Created/Updated
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/parser/__tests__/choice-effects.test.ts` - Complete test suite for choice effects

### Test Coverage

The test suite includes 20 tests organized into 5 categories:

1. **"Choose one:" with period separators** (4 tests)
   - Tests 2-option and 3-option choices
   - Tests various effect types (draw, damage, lore, exert, ready, banish, return)

2. **"Choose one:" with bullet separators** (2 tests)
   - Tests bullet-delimited options
   - Tests 2-option and 3-option choices

3. **"or" format** (4 tests)
   - Tests simple "X or Y" format
   - Tests various effect combinations

4. **Edge cases** (7 tests)
   - Ensures "choose and discard" is NOT parsed as choice
   - Tests handling of unparsable options
   - Tests filtering of "or more"/"or less" patterns
   - Tests single-option fallback
   - Tests parsing priority over sequences
   - Tests case-insensitive matching

5. **Complex choice options** (3 tests)
   - Tests choices with stat effects
   - Tests choices with conditional effects
   - Tests choices with "up to" modifiers

### Manual Testing Performed

All 20 tests pass successfully:

```
bun test packages/lorcana-engine/src/parser/__tests__/choice-effects.test.ts

 20 pass
 0 fail
 84 expect() calls
```

Full parser test suite (222 tests) also passes with no regressions:

```
bun test packages/lorcana-engine/src/parser/

 222 pass
 0 fail
 652 expect() calls
```

## User Standards & Preferences Compliance

### API Standards (agent-os/standards/backend/api.md)

**How Implementation Complies:**
This implementation follows API best practices by providing clear, consistent function signatures (`hasChoiceEffect()`, `splitChoiceOptions()`, `parseChoiceEffect()`) that mirror existing parser patterns. The functions accept string inputs and return well-typed outputs (`boolean`, `string[]`, `Effect | undefined`), maintaining consistency with the existing parser API design.

**Deviations:** None

### Coding Style (agent-os/standards/global/coding-style.md)

**How Implementation Complies:**
- Used descriptive function names (`hasChoiceEffect`, `splitChoiceOptions`, `parseChoiceEffect`)
- Kept functions small and focused on single responsibilities
- Followed DRY principle by reusing existing `parseAtomicEffect()` function
- Removed the TODO comment that was previously in the code
- Used consistent indentation and formatting matching the existing codebase

**Deviations:** None

### Conventions (agent-os/standards/global/conventions.md)

**How Implementation Complies:**
The implementation maintains the existing project structure by adding code to established files (`patterns/effects.ts`, `parsers/effect-parser.ts`) and creating a new test file in the appropriate test directory (`__tests__/choice-effects.test.ts`). All changes follow the existing naming and organizational conventions.

**Deviations:** None

### Error Handling (agent-os/standards/global/error-handling.md)

**How Implementation Complies:**
The implementation fails fast and explicitly by returning `undefined` when:
- A choice option cannot be parsed
- Fewer than 2 valid options are found
- No valid separator is detected

This provides clear failure points and prevents invalid ChoiceEffect objects from being created. The error handling is consistent with the existing parser's approach.

**Deviations:** None

### Commenting (agent-os/standards/global/commenting.md)

**How Implementation Complies:**
Comments are minimal and focused on explaining the "why" rather than the "what". For example:
- `// "or" but not "or more"/"or less"` explains the regex negative lookahead
- `// If any option fails to parse, return undefined` explains the all-or-nothing parsing strategy

No temporary or change-tracking comments were added.

**Deviations:** None

## Integration Points

### APIs/Endpoints

This is a library-level implementation with no HTTP endpoints. The public API surface is:

- `hasChoiceEffect(text: string): boolean` - Detects if text contains a choice effect
- `splitChoiceOptions(text: string): string[]` - Splits choice text into option strings
- Internal `parseChoiceEffect(text: string): Effect | undefined` - Parses choice effects (called from `parseEffect()`)

### Internal Dependencies

This implementation depends on and integrates with:

- `parseAtomicEffect()` - Recursively parses each choice option
- Existing effect patterns and parsers - For parsing individual options
- `ChoiceEffect` type from `effect-types.ts` - For the output structure
- `Effect` union type - For option typing

## Known Issues & Limitations

### Issues

None identified during implementation or testing.

### Limitations

1. **Item/Location Target Parsing**
   - Description: The parser currently defaults to "CHOSEN_CHARACTER" for banish effects even when the text says "chosen item" or "chosen location"
   - Reason: The target parser only implements character target parsing; item and location target parsing would require additional parser infrastructure
   - Future Consideration: Could be addressed by implementing `parseItemTarget()` and `parseLocationTarget()` functions and updating the banish effect parser to use appropriate target parsers based on the text

2. **Single Option Choices**
   - Description: Choice effects with only one parsable option are rejected (return `undefined`)
   - Reason: By definition, a choice requires at least 2 options
   - Future Consideration: None - this is intentional behavior

## Performance Considerations

The choice effect parsing adds minimal overhead to the existing parser:
- `hasChoiceEffect()` uses regex patterns that execute in O(n) time relative to text length
- `splitChoiceOptions()` performs at most 3 regex tests and one split operation
- `parseChoiceEffect()` recursively calls `parseAtomicEffect()` for each option, which is comparable to sequence effect parsing

No performance degradation was observed in the full parser test suite (222 tests complete in ~140ms).

## Security Considerations

No security concerns. The parser operates on string input with no external dependencies or file system access. The implementation uses standard regex patterns with no ReDoS vulnerabilities.

## Notes

This implementation successfully completes the requested feature to parse choice effects in all three known formats. The approach mirrors the existing sequence effect parsing strategy, maintaining consistency with the codebase architecture. All tests pass and no regressions were introduced.

The implementation prioritizes maintainability and type safety by:
- Following existing parser patterns and conventions
- Using descriptive names and clear structure
- Preserving original option text for UI display
- Failing gracefully with undefined returns rather than throwing exceptions
