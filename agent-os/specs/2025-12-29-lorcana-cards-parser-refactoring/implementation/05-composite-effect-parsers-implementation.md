# Task 5: Composite Effect Parsers

## Overview
**Task Reference:** Task #5 from `agent-os/specs/2025-12-29-lorcana-cards-parser-refactoring/tasks.md`
**Implemented By:** api-engineer
**Date:** 2025-12-29
**Status:** Complete

### Task Description
Implement composite effect parsers to handle complex effect patterns including sequences, choices, conditionals, optional effects, for-each loops, and repeat effects. Each parser should recursively parse nested atomic effects and include comprehensive logging.

## Implementation Summary

This implementation introduces 6 composite effect parsers that extend the parser's ability to handle complex Lorcana card effect patterns. The parsers follow the existing modular architecture established for atomic effects, with explicit registration and ordered precedence.

The key innovation is recursive parsing: composite effects delegate to `parseAtomicEffect()` to parse their constituent parts, enabling nested and complex effect structures. Each parser is text-based (rather than CST-based) for this phase, with grammar support added via updated compositeEffect rules that handle sequence, choice, and conjunction patterns.

All parsers include comprehensive structured logging at debug, info, and warn levels to facilitate troubleshooting during development and production use.

## Files Changed/Created

### New Files
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/sequence-effect.ts` - Parses sequential effects with "then" separators
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/choice-effect.ts` - Parses choice effects with "Choose one" pattern
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/optional-effect.ts` - Parses optional effects with "You may" pattern
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/for-each-effect.ts` - Parses for-each loop effects
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/conditional-effect.ts` - Parses conditional effects with "if X, then Y" pattern
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/repeat-effect.ts` - Parses repeat effects with "X times" pattern
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/index.ts` - Registry and exports for all composite parsers
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/index.ts` - Unified effect parsing interface

### Modified Files
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/grammar/ability-grammar.ts` - Enhanced compositeEffect grammar rule to handle sequences, choices, and conjunctions

### Deleted Files
None

## Key Implementation Details

### Sequence Effect Parser
**Location:** `packages/lorcana-cards/src/parser/v2/effects/composite/sequence-effect.ts`

Handles sequential effects like "draw 2 cards, then discard 1 card". The parser:
1. Searches for separator patterns (", then ", ". Then ", ", and then ")
2. Splits the text on the identified separator
3. Recursively parses each step using `parseAtomicEffect()`
4. Returns a composite effect with type "sequence" containing an array of effects

**Rationale:** Sequential effects are common in Lorcana (e.g., Aladdin's "draw 2, then discard 1"). Text-based parsing with regex is simpler and more flexible than CST parsing for this pattern.

### Choice Effect Parser
**Location:** `packages/lorcana-cards/src/parser/v2/effects/composite/choice-effect.ts`

Handles choice effects like "Choose one: Deal 3 damage; or gain 2 lore". The parser:
1. Matches "Choose one" pattern with flexible separators (: or -)
2. Splits options on "; or " or semicolon separators
3. Recursively parses each option using `parseAtomicEffect()`
4. Requires at least 2 valid options
5. Returns a composite effect with type "choice" containing an array of options

**Rationale:** Choice effects provide tactical decision points in gameplay. The parser handles various formatting variations seen in actual card text.

### Optional Effect Parser
**Location:** `packages/lorcana-cards/src/parser/v2/effects/composite/optional-effect.ts`

Handles optional effects like "You may draw 2 cards". The parser:
1. Matches "You may" pattern
2. Extracts the effect text after the pattern
3. Recursively parses the optional effect using `parseAtomicEffect()`
4. Returns a composite effect with type "optional" containing a single effect

**Rationale:** Optional effects are prevalent in Lorcana, giving players strategic choices. Simple pattern matching is sufficient for this straightforward structure.

### For-Each Effect Parser
**Location:** `packages/lorcana-cards/src/parser/v2/effects/composite/for-each-effect.ts`

Handles scaling effects like "for each character you control, gain 1 lore". The parser:
1. Matches "for each X, Y" pattern
2. Extracts the iterator (what's being counted) and effect text
3. Recursively parses the effect using `parseAtomicEffect()`
4. Returns a composite effect with type "forEach" containing the iterator and effect

**Rationale:** For-each effects create interesting scaling dynamics. The parser preserves the iterator as a string for later interpretation during game execution.

### Conditional Effect Parser
**Location:** `packages/lorcana-cards/src/parser/v2/effects/composite/conditional-effect.ts`

Handles conditional effects like "if you have another character, gain 2 lore". The parser:
1. Matches "if X, then Y" or "if X, Y" patterns
2. Extracts the condition and effect text
3. Recursively parses the effect using `parseAtomicEffect()`
4. Returns a composite effect with type "conditional" containing condition and effect

**Rationale:** Conditional effects add strategic depth by rewarding specific board states. The condition is preserved as text for later parsing in future phases.

### Repeat Effect Parser
**Location:** `packages/lorcana-cards/src/parser/v2/effects/composite/repeat-effect.ts`

Handles repeat effects like "draw 1 card, 3 times". The parser:
1. Matches "X, Y times" or "do X Y times" patterns
2. Extracts the effect text and repeat count
3. Parses the count as an integer
4. Recursively parses the effect using `parseAtomicEffect()`
5. Returns a composite effect with type "repeat" containing times and effect

**Rationale:** Repeat effects provide multiplicative impact. Two pattern variations are supported to handle different card text phrasings.

### Composite Registry
**Location:** `packages/lorcana-cards/src/parser/v2/effects/composite/index.ts`

Explicit registration of all composite parsers with precedence ordering:
1. Choice effects (very specific pattern)
2. For-each effects (specific pattern)
3. Conditional effects (specific pattern)
4. Optional effects (specific pattern)
5. Repeat effects (specific pattern)
6. Sequence effects (more generic pattern, last)

Exports `parseCompositeEffect()` function that iterates through registered parsers and returns first match.

**Rationale:** More specific patterns must be tried first to avoid false positives. Sequence parsing is intentionally last because "then" can appear in various contexts.

### Main Effects Index
**Location:** `packages/lorcana-cards/src/parser/v2/effects/index.ts`

Unified interface that:
1. Tries composite parsers first (more complex patterns)
2. Falls back to atomic parsers if no composite match
3. Logs parse attempts and results
4. Re-exports all individual parsers for testing

**Rationale:** Composite effects are more specific and should be matched before falling back to atomic effects. This prevents "draw 2 cards, then discard 1" from being parsed as just "draw 2 cards".

### Grammar Enhancements
**Location:** `packages/lorcana-cards/src/parser/v2/grammar/ability-grammar.ts`

Enhanced the `compositeEffect` grammar rule to recognize:
- Sequence patterns with ", then" separator
- Choice patterns with "or" separator
- Conjunction patterns with "and" separator

Each pattern recursively references `atomicEffect` rules, enabling proper CST structure for future visitor implementation.

**Rationale:** While current composite parsers use text-based parsing, the grammar provides structure for CST-based parsing in future iterations and supports proper tokenization.

## Database Changes
Not applicable - no database changes required.

## Dependencies

### New Dependencies Added
None - uses existing dependencies (chevrotain, logging infrastructure).

### Configuration Changes
None

## Testing

### Test Files Created/Updated
None - testing will be handled by testing-engineer in Task Group 6.

### Test Coverage
- Unit tests: Pending (Task Group 6)
- Integration tests: Pending (Task Group 6)
- Edge cases covered: Will be covered in Task Group 6

### Manual Testing Performed
Type checking performed to verify:
- All composite parsers compile without errors
- No type issues in recursive calls to parseAtomicEffect
- Grammar modifications compile successfully
- Registry and index files have proper type exports

Command run: `bun run check-types`
Result: All composite effect parser files pass type checking with zero errors.

## User Standards & Preferences Compliance

### Agent-OS Global Coding Style
**File Reference:** `agent-os/standards/global/coding-style.md`

**How Implementation Complies:**
- All functions are small and focused (50-150 lines per parser)
- Descriptive naming (parseFromText, parseFromCst, sequenceEffectParser)
- No dead code or commented-out code blocks
- DRY principle applied via recursive calls to parseAtomicEffect
- Consistent formatting maintained throughout

**Deviations:** None

### API Standards
**File Reference:** `agent-os/standards/backend/api.md`

**How Implementation Complies:**
- Parsers follow consistent interface pattern (EffectParser)
- Clear separation of concerns (one parser per effect type)
- Proper error handling (returns null for non-matches)
- Structured logging for debugging

**Deviations:** None - parsers are not REST APIs but follow similar structural principles of consistency and clarity.

### Error Handling Standards
**File Reference:** `agent-os/standards/global/error-handling.md`

**How Implementation Complies:**
- Uses null return values for non-matching patterns (no throwing)
- Comprehensive logging at appropriate levels (debug, info, warn)
- Graceful degradation (continues parsing other steps if one fails)
- Context-rich log messages for troubleshooting

**Deviations:** None

### Global Conventions
**File Reference:** `agent-os/standards/global/conventions.md`

**How Implementation Complies:**
- kebab-case for file names (sequence-effect.ts, choice-effect.ts)
- camelCase for functions (parseFromText, parseCompositeEffect)
- PascalCase for exported constants (EffectParser interface)
- Consistent import ordering (types, logging, atomic parsers)

**Deviations:** None

### TypeScript Code Style (from CLAUDE.md)
**File Reference:** `.claude/rules/code-style.md`

**How Implementation Complies:**
- No `any` types used - all types are explicit or inferred
- Type-only imports used where appropriate
- Strict null checks handled (checks for null before using parseAtomicEffect results)
- All functions have clear parameter types
- Used `unknown` for flexible context parameters

**Deviations:** None

## Integration Points

### APIs/Endpoints
Not applicable - these are internal parser functions.

### External Services
None

### Internal Dependencies
- Depends on `parseAtomicEffect` from atomic effects registry
- Integrates with logging infrastructure
- Used by main parser via `parseEffect` unified interface
- Called by grammar visitor in future phases

## Known Issues & Limitations

### Issues
None identified

### Limitations

1. **Text-Based Parsing Only**
   - Description: Current implementation uses text/regex parsing rather than CST parsing
   - Reason: Simpler to implement for initial phase; grammar rules are in place for future CST implementation
   - Future Consideration: Migrate to full CST parsing in Phase 4 when visitor implementation is enhanced

2. **Condition Text Not Parsed**
   - Description: Conditional effects store condition as unparsed text string
   - Reason: Condition parsing logic belongs in Phase 4 (Targets & Conditions)
   - Future Consideration: Implement condition parsers in Task Group 7

3. **Iterator Text Not Parsed**
   - Description: For-each effects store iterator as unparsed text string
   - Reason: Target/filter parsing logic belongs in Phase 4
   - Future Consideration: Parse iterator into structured target filter in Task Group 7

4. **Limited CST Support**
   - Description: parseFromCst functions return null (not yet implemented)
   - Reason: CST-based parsing is deferred to later phases; grammar rules are in place but visitor logic pending
   - Future Consideration: Implement CST parsing when visitor is enhanced in Phase 4

## Performance Considerations

- Text-based regex parsing is fast for the small text strings involved (typical ability text is 20-100 characters)
- Recursive calls to parseAtomicEffect are bounded by the depth of nesting (typically 2-3 levels max in Lorcana)
- Registry iteration is linear but with small N (6 composite parsers + 8 atomic parsers = 14 total)
- No caching implemented yet - each parse is stateless and independent

## Security Considerations

- Input validation: parsers return null for malformed input rather than throwing
- No code execution: all parsing is declarative pattern matching
- No external input: parsers operate on card text from trusted sources (card database)
- Logging does not expose sensitive information (only card text and parse results)

## Dependencies for Other Tasks

This implementation is a dependency for:
- Task Group 6: Composite Effect Tests (testing-engineer)
- Phase 4: Targets & Conditions (will need to parse condition/iterator text)
- Phase 5: Remaining Effect Types (may need additional composite patterns)

## Notes

### Design Decisions

1. **Order of Precedence**: Composite parsers are ordered from most specific to most generic. Sequence effects are last because "then" can appear in many contexts. This prevents false positives.

2. **Recursive Architecture**: All composite parsers delegate to `parseAtomicEffect()` rather than duplicating parsing logic. This creates a clean separation of concerns and makes the system extensible.

3. **Text vs CST Parsing**: Text-based parsing was chosen for initial implementation because:
   - Faster to implement for Phase 3 delivery
   - Grammar rules are in place for future CST migration
   - Text parsing is sufficient for 80% of cases (per 80/20 rule in spec)
   - CST parsing can be added incrementally in future phases

4. **Logging Strategy**: Each parser logs at multiple levels:
   - debug: Entry point, pattern matching attempts
   - info: Successful parse with result summary
   - warn: Parse failures, missing data

   This provides a complete audit trail for troubleshooting without overwhelming production logs (debug disabled by default).

5. **File Size**: All composite parsers are 75-115 lines each, well within the 50-150 line target. This keeps each parser focused and maintainable.

### Verification Steps Performed

1. Created all 6 composite effect parser files
2. Created composite registry with explicit registration and precedence
3. Created main effects index with unified parseEffect interface
4. Enhanced grammar compositeEffect rule with sequence/choice/conjunction patterns
5. Ran `bun run check-types` - all files pass with zero type errors
6. Verified recursive calls to parseAtomicEffect have correct type signatures
7. Confirmed comprehensive logging in all parsers
8. Verified file structure matches spec exactly

### Future Work

- Implement comprehensive unit tests (Task Group 6)
- Add CST-based parsing for composite effects (Phase 4+)
- Implement condition and iterator parsing (Phase 4)
- Add integration tests with real card text (Phase 6)
- Measure and optimize performance if needed (Phase 6+)
