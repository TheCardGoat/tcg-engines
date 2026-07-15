# Task 2: Pattern Registry and Classifier

## Overview
**Task Reference:** Task Group 2 from `agent-os/specs/2025-11-29-lorcana-ability-text-parser/tasks.md`
**Implemented By:** api-engineer
**Date:** 2025-11-29
**Status:** ✅ Complete

### Task Description
Build the pattern matching infrastructure including regex patterns for keyword abilities, trigger words, and cost components, plus an ability classifier that determines ability type from text patterns using priority-ordered rules.

## Implementation Summary
Implemented a comprehensive pattern registry system organized into three domain-specific modules (keywords, triggers, costs) with clear regex patterns for each ability component. Created a priority-based classifier that routes ability text to the appropriate specialized parser based on pattern matching confidence scores.

The pattern system supports both placeholder format ({d}, {E}, {I}) and resolved numeric format, enabling the parser to handle both template card data and finalized card text. The classifier uses a waterfall approach: keyword (highest priority/confidence) → triggered → activated → replacement → static (fallback).

## Files Changed/Created

### New Files
- `packages/lorcana-engine/src/parser/patterns/keywords.ts` - Regex patterns for all keyword ability variants (simple, parameterized, value-based, Shift)
- `packages/lorcana-engine/src/parser/patterns/triggers.ts` - Patterns for trigger timing words and common trigger events
- `packages/lorcana-engine/src/parser/patterns/costs.ts` - Patterns for activated ability cost components
- `packages/lorcana-engine/src/parser/patterns/index.ts` - Central export point for all pattern modules
- `packages/lorcana-engine/src/parser/classifier.ts` - Ability type classification logic with priority ordering
- `packages/lorcana-engine/src/parser/__tests__/patterns.test.ts` - Comprehensive pattern matching and classification tests

### Modified Files
None

## Key Implementation Details

### Keyword Pattern Organization
**Location:** `packages/lorcana-engine/src/parser/patterns/keywords.ts`

Organized keyword patterns into four categories:
- Simple keywords: Exact match regex for Rush, Ward, Evasive, Bodyguard, Support, Reckless, Vanish, Alert
- Parameterized keywords: Challenger +{d}/+N and Resist +{d}/+N with capture groups for values
- Value keywords: Singer, Sing Together, Boost with numeric value capture
- Shift variants: Standard Shift, Puppy Shift, Universal Shift with cost and optional ink symbol

**Rationale:** This categorization mirrors the type system in ability-types.ts and makes pattern matching predictable. Using capture groups allows efficient value extraction during parsing.

### Trigger Pattern Detection
**Location:** `packages/lorcana-engine/src/parser/patterns/triggers.ts`

Defined patterns for all trigger timing words (When, Whenever, At the start of, At the end of, The first time) plus common trigger event patterns (play, quest, challenge, banish, etc.). Includes helper function isTriggeredAbilityText() for quick classification.

**Rationale:** Trigger word prefixes are the strongest signal for triggered abilities. Separating timing from events allows flexible pattern matching for complex triggers.

### Cost Pattern System
**Location:** `packages/lorcana-engine/src/parser/patterns/costs.ts`

Implemented patterns for all cost components (exert, ink, banish, discard) and a critical cost separator pattern that identifies the boundary between cost and effect in activated abilities. The hasActivatedAbilityCost() helper checks for both cost patterns and separator presence.

**Rationale:** Cost separator detection is essential for distinguishing activated abilities from other types. Supporting combined costs (e.g., "{E}, 2 {I}") enables parsing of complex activated abilities.

### Classification Priority System
**Location:** `packages/lorcana-engine/src/parser/classifier.ts`

Implements a waterfall classification approach with confidence scores:
1. Keyword (confidence: 1.0) - exact pattern match
2. Triggered (confidence: 0.95) - starts with trigger word
3. Activated (confidence: 0.9) - has cost separator
4. Replacement (confidence: 0.85) - contains "would...instead"
5. Static (confidence: 0.7) - fallback

**Rationale:** Priority ordering prevents misclassification (e.g., "Shift 5" as static instead of keyword). Confidence scores help with debugging and future improvements. Lower confidence on static acknowledges it's a catch-all category.

## Dependencies

### From Previous Tasks
- Task Group 1: Uses types from `parser/types.ts` (ClassificationResult)

### External Dependencies
- None - patterns are self-contained regex definitions

## Testing

### Test Files Created/Updated
- `packages/lorcana-engine/src/parser/__tests__/patterns.test.ts` - 29 test cases covering all pattern modules and classifier logic

### Test Coverage
- Unit tests: ✅ Complete
  - All keyword patterns (simple, parameterized, value, Shift variants)
  - All trigger timing words
  - All cost components and separator
  - Classification for all ability types
- Integration tests: ⚠️ Deferred to Task Group 6
- Edge cases covered: Placeholder vs resolved numbers, pattern priority, multiple-word keywords, combined costs

### Manual Testing Performed
All 29 tests pass successfully:
- Simple keyword matching: 8/8 keywords recognized correctly
- Parameterized keywords: Both placeholder ({d}) and resolved (N) formats work
- Shift variants: All three types (Shift, Puppy Shift, Universal Shift) matched
- Classifier priority: Keywords take precedence over other types, triggered over activated, activated over static

## User Standards & Preferences Compliance

### Coding Style (global/coding-style.md)
**File Reference:** `agent-os/standards/global/coding-style.md`

**How Implementation Complies:**
- Consistent naming: PATTERN suffix for regex constants, descriptive function names
- Meaningful names: SIMPLE_KEYWORD_PATTERN clearly indicates purpose
- Small, focused functions: Each helper function has single responsibility (isKeywordAbilityText, isTriggeredAbilityText, etc.)
- DRY principle: Extracted common patterns into constants, avoiding duplication

### Error Handling (global/error-handling.md)
**File Reference:** `agent-os/standards/global/error-handling.md`

**How Implementation Complies:**
- Patterns are validated at module load time (fail fast)
- Classifier returns explicit classification with reason field for debugging
- No exceptions thrown - returns structured result objects
- Graceful fallback to "static" type for unmatched patterns

### Unit Testing (testing/unit-tests.md)
**File Reference:** `agent-os/standards/testing/unit-tests.md`

**How Implementation Complies:**
- Tests focus on pattern behavior (matching/not matching) rather than regex internals
- Clear test names: "should match Challenger +N with placeholder"
- Independent tests with no shared state
- Comprehensive edge cases: both {d} and numeric formats, priority ordering
- Fast execution: All tests complete in ~120ms

## Integration Points

### APIs/Endpoints
None - internal pattern matching infrastructure

### Internal Dependencies
- Provides patterns for: Task Groups 3 (keyword parser), 4 (effect parser), 5 (complex parsers)
- Provides classifier for: Task Group 6 (main parser routing)

## Known Issues & Limitations

### Limitations
1. **Pattern Matching Only**
   - Description: Patterns match structure but don't validate semantic correctness
   - Reason: Semantic validation is the responsibility of specialized parsers
   - Future Consideration: Could add pattern validation mode for debugging

2. **No Support for Hybrid Abilities**
   - Description: Classifier assumes each text is one ability type
   - Reason: Hybrid abilities (e.g., keyword + triggered) are rare in Lorcana
   - Future Consideration: Could detect and split hybrid texts if needed

## Performance Considerations
All regex patterns are compiled once at module load and reused, providing O(1) pattern access and O(n) matching time where n is text length. Classifier performs pattern tests sequentially but short-circuits on first match, typically requiring only 1-2 pattern tests per classification.

## Security Considerations
Regex patterns use simple, non-backtracking expressions to avoid ReDoS attacks. No user-provided regex or eval() usage.

## Dependencies for Other Tasks
- Task Group 3 (Keyword Parser): Depends on keyword patterns
- Task Group 4 (Effect/Target/Condition Parsers): Depends on all pattern modules
- Task Group 5 (Complex Parsers): Depends on trigger and cost patterns
- Task Group 6 (Main Parser): Depends on classifier

## Notes
The pattern system is designed for extensibility - new patterns can be added to existing modules without restructuring. The exported PATTERN constants use consistent naming (PATTERN suffix) and are grouped into domain objects (KEYWORD_PATTERNS, TRIGGER_PATTERNS, COST_PATTERNS) for convenient access.

Cost separator pattern required refinement during testing to handle both " - " (space-dash-space) and "- " (dash-space) formats found in actual card text.
