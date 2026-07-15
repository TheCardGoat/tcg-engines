# Task 2.3: Expand Trigger Patterns

## Overview
**Task Reference:** Task Group 2.3 from `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/agent-os/specs/2025-11-29-lorcana-ability-text-parser/tasks.md`
**Implemented By:** api-engineer
**Date:** 2025-11-29
**Status:** Complete

### Task Description
Expand the trigger pattern recognition system to handle missing trigger patterns that prevented parsing of many triggered abilities. The parser was failing to recognize common patterns like "Whenever you play a card", "Whenever an opponent plays X", and classification-based triggers like "Whenever you play a Hero character".

## Implementation Summary

This implementation significantly expanded the trigger pattern recognition system by adding support for 8 new categories of trigger patterns. The approach focused on:

1. **Pattern specificity ordering**: Classification-based triggers (e.g., "Hero character") are checked before generic patterns (e.g., "a character") to ensure correct matching
2. **Comprehensive coverage**: Added patterns for all major card types (card, character, item, action, song, location) and common classifications (Hero, Villain, Princess, King, Queen, Pirate)
3. **Opponent triggers**: Added support for opponent-initiated triggers like "an opponent plays a song"
4. **Self-referential disambiguation**: Ensured "you play this character" continues to map to SELF rather than being caught by the generic "you play a character" pattern

The changes increased parser coverage from 20.49% to 49.55% (an improvement of ~450 additional ability texts parsed successfully).

## Files Changed/Created

### Modified Files
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/parser/patterns/triggers.ts` - Added new trigger event patterns for all missing categories
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/parser/parsers/triggered-parser.ts` - Updated parser logic to recognize and handle new trigger patterns with proper ordering

### New Files
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/parser/__tests__/trigger-patterns.test.ts` - Comprehensive test suite with 27 tests covering all new patterns

## Key Implementation Details

### Pattern Addition in triggers.ts
**Location:** `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/parser/patterns/triggers.ts`

Added comprehensive trigger event patterns organized into logical categories:

```typescript
export const TRIGGER_EVENT_PATTERNS = {
  // Self triggers (unchanged)
  playSelf: /\byou play this character\b/i,
  playItemSelf: /\byou play this item\b/i,
  // ...

  // NEW: Generic "you play" triggers
  playCard: /\byou play a card\b/i,
  playCharacter: /\byou play a character\b/i,
  playSong: /\byou play a song\b/i,
  playAction: /\byou play an action\b/i,
  playItem: /\byou play an? item\b/i,
  playLocation: /\byou play an? location\b/i,
  playFloodborn: /\byou play a Floodborn character\b/i,

  // NEW: Classification-based triggers
  playHeroCharacter: /\byou play a Hero character\b/i,
  playVillainCharacter: /\byou play a Villain character\b/i,
  playPrincessCharacter: /\byou play a Princess character\b/i,
  playKingCharacter: /\byou play a King character\b/i,
  playQueenCharacter: /\byou play a Queen character\b/i,
  playPirateCharacter: /\byou play a Pirate character\b/i,

  // NEW: Opponent triggers
  opponentPlaysSong: /\ban opponent plays a song\b/i,
  opponentPlaysCharacter: /\ban opponent plays a character\b/i,
  opponentPlaysCard: /\ban opponent plays a card\b/i,
};
```

**Rationale:** Organized patterns into semantic groups for maintainability. Used word boundaries (`\b`) to prevent partial matches and ensure accurate pattern recognition.

### Parser Logic Update in triggered-parser.ts
**Location:** `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/parser/parsers/triggered-parser.ts`

Updated the `parseTrigger()` function with proper pattern matching order:

**Order of Evaluation:**
1. Phase-based triggers ("At the start of your turn")
2. Self-referential triggers ("you play this character") - must come first
3. Generic card trigger ("you play a card")
4. Classification-based triggers (Hero, Villain, etc.) - more specific
5. Generic card type triggers (character, item, action, song, location) - less specific
6. Opponent triggers
7. Other event triggers (banish, challenge, etc.)

**Example of proper ordering:**
```typescript
// Parse "you play a card" (generic - any card type)
if (text.match(/\byou play a card\b/i)) {
  return {
    event: "play",
    timing,
    on: { controller: "you", cardType: "card" },
  };
}

// Check for classification-based triggers FIRST (more specific)
if (text.match(/\byou play a Hero character\b/i)) {
  return {
    event: "play",
    timing,
    on: { controller: "you", cardType: "character", classification: "Hero" },
  };
}
// ... other classifications

// Generic card type triggers AFTER (less specific)
if (text.match(/\byou play a character\b/i)) {
  return {
    event: "play",
    timing,
    on: { controller: "you", cardType: "character" },
  };
}
```

**Rationale:** Ordering from most specific to least specific prevents generic patterns from catching more specific cases. For example, "you play a Hero character" would match both the Hero pattern and the generic character pattern, so we check Hero first.

### Test Coverage
**Location:** `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/parser/__tests__/trigger-patterns.test.ts`

Created 27 comprehensive tests organized into 9 test suites:

1. **Play a card trigger** (2 tests) - Generic card playing
2. **Opponent triggers** (3 tests) - Opponent plays song/character/card
3. **Classification triggers** (8 tests) - Hero, Villain, Princess, King, Queen, Pirate character types
4. **Challenged trigger** (2 tests) - This character is challenged
5. **Action trigger** (2 tests) - You play an action
6. **Item trigger** (2 tests) - You play an item
7. **Song trigger** (3 tests) - You play a song
8. **Banish trigger** (3 tests) - This character is banished
9. **Integration tests** (3 tests) - Pattern disambiguation and proper ordering

**Rationale:** Comprehensive test coverage ensures all new patterns work correctly and that pattern ordering prevents ambiguous matches.

## Database Changes
N/A - This is a parser library implementation with no database interactions.

## Dependencies
No new dependencies added. Implementation uses existing trigger type definitions from:
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/cards/abilities/types/trigger-types.ts`

## Testing

### Test Files Created/Updated
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-engine/src/parser/__tests__/trigger-patterns.test.ts` - 27 new tests for trigger pattern expansion

### Test Coverage
- Unit tests: Complete - All new patterns have dedicated tests
- Integration tests: Complete - Pattern ordering and disambiguation tested
- Edge cases covered:
  - Classification-based vs generic character triggers
  - Self-referential vs generic play triggers
  - Opponent vs player triggers
  - Named abilities with new trigger patterns
  - Optional effects with new trigger patterns

### Manual Testing Performed
Ran full parser test suite to verify:
1. All 27 new tests pass
2. No regressions in existing 379 tests
3. Total test count: 406 passing tests
4. Coverage validation shows improvement from 20.49% to 49.55%

**Test Execution Results:**
```
bun test v1.3.3 (274e01c7)
27 pass
0 fail
102 expect() calls
Ran 27 tests across 1 file. [16.00ms]

Full test suite:
406 pass
0 fail
908 expect() calls
Ran 406 tests across 17 files. [194.00ms]

Coverage: 49.55% (769/1552 texts successfully parsed)
Triggered abilities parsed: 362 (up from ~200)
```

## User Standards & Preferences Compliance

### API Standards Compliance
**File Reference:** `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/agent-os/standards/backend/api.md`

**How Implementation Complies:**
While this is a parser library (not an API endpoint), the code follows API design principles by providing a clear, deterministic interface. The `parseTrigger()` function returns structured `Trigger` objects that conform to the established type definitions, ensuring consistency across the codebase.

**Deviations:** None

### Coding Style Compliance
**File Reference:** `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/agent-os/standards/global/coding-style.md`

**How Implementation Complies:**
- **Consistent Naming Conventions**: Used descriptive pattern names like `playHeroCharacter`, `opponentPlaysSong` that clearly indicate their purpose
- **Small, Focused Functions**: The `parseTrigger()` function processes one pattern at a time with clear logic flow
- **Meaningful Names**: Pattern constants use UPPER_CASE with descriptive names; function parameters and variables use camelCase
- **DRY Principle**: Reused the same pattern matching structure across all new triggers rather than duplicating logic

**Deviations:** None

### Conventions Compliance
**File Reference:** `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/agent-os/standards/global/conventions.md`

**How Implementation Complies:**
- **Consistent Project Structure**: Maintained existing file organization in `parser/patterns/` and `parser/parsers/`
- **Clear Documentation**: Added comprehensive JSDoc comments explaining pattern usage and ordering logic
- **Testing Requirements**: Created complete test coverage for all new patterns before marking task complete

**Deviations:** None

### Error Handling Compliance
**File Reference:** `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/agent-os/standards/global/error-handling.md`

**How Implementation Complies:**
Parser follows lenient error handling strategy - if a trigger pattern isn't matched, it returns `undefined` and allows the calling code to decide whether to fail gracefully or report an error. This aligns with the spec's requirement for deterministic, non-breaking behavior.

**Deviations:** None

### Tech Stack Compliance
**File Reference:** `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/agent-os/standards/global/tech-stack.md`

**How Implementation Complies:**
Implementation uses TypeScript with strict type checking, leveraging the existing trigger type system. All patterns return properly-typed `Trigger` objects that satisfy TypeScript's compile-time type safety.

**Deviations:** None

## Integration Points

### Internal Dependencies
The trigger patterns integrate with:
- **Trigger Type System** (`trigger-types.ts`): All patterns return `Trigger` objects conforming to the unified type system
- **Classification System** (`classifier.ts`): Trigger patterns are used to identify triggered abilities during classification
- **Effect Parser** (`effect-parser.ts`): Triggered abilities pair triggers with effects parsed by the effect parser
- **Named Ability Extraction** (`preprocessor.ts`): New patterns work seamlessly with named ability prefixes

### Parser Pipeline
The expanded trigger patterns fit into the parser pipeline:
```
Input Text → Preprocessor (extract name) → Classifier (identify as triggered)
  → TriggeredParser (use expanded patterns) → Effect Parser → Output
```

## Known Issues & Limitations

### Limitations
1. **Classification Completeness**: Only added common classifications (Hero, Villain, Princess, King, Queen, Pirate). Other classifications like "Alien", "Deity", "Captain" would need additional patterns.
2. **Complex Trigger Conditions**: Patterns like "Whenever you play a second action in a turn" or "When this character is at a location" still require additional work (tracked in remaining task groups).
3. **Trigger Restrictions**: The patterns recognize trigger events but don't yet parse restrictions like "once per turn" or "the first time each turn" (being handled separately).

### Known Issues
None - All tests pass and implementation meets acceptance criteria.

## Performance Considerations

Performance impact is negligible:
- Pattern matching order optimized to check most common patterns first
- Regex patterns use word boundaries for efficient matching
- No performance degradation observed in batch processing (24.99ms for 1552 texts vs ~15ms before, increase due to more successful parses requiring full effect parsing)

## Security Considerations

No security implications - this is a deterministic, rule-based parser with no external inputs or security boundaries.

## Dependencies for Other Tasks

This implementation unblocks:
- **Task Group 2.4**: Fix Optional Effects in Triggered Abilities - can now test with the expanded trigger patterns
- **Future trigger pattern work**: Establishes the pattern for adding new trigger types

## Notes

### Coverage Improvement
The implementation successfully improved coverage from 20.49% to 49.55%, exceeding the intermediate target of 45% for Phase 2. The jump of ~29 percentage points (450 additional texts) validates the approach of expanding trigger patterns as a high-impact improvement area.

### Pattern Ordering Strategy
The most critical insight was the importance of pattern matching order. Initially, generic patterns like "you play a character" would catch classification-specific patterns like "you play a Hero character". Reordering to check more specific patterns first solved this elegantly without requiring complex regex lookahead patterns.

### Test-Driven Development
All 27 tests were written to cover the acceptance criteria before validating against the full 1552-text corpus. This approach caught several edge cases early, such as ensuring "you play this character" (self-referential) didn't get matched by "you play a character" (generic).

### Future Extensibility
The pattern structure makes it straightforward to add new classifications or card types. Future developers can add a single regex pattern to `TRIGGER_EVENT_PATTERNS` and a corresponding match case in `parseTrigger()` to support new trigger types.
