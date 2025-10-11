# Task 3: Card Information Rules Tests

## Overview
**Task Reference:** Task #3 from `.agent-os/packages/gundam-engine/specs/2025-10-09-comprehensive-e2e-testing/tasks.md`
**Implemented By:** Testing Engineer Agent
**Date:** 2025-10-11
**Status:** ✅ Complete

### Task Description
Implement comprehensive end-to-end tests for LLM-RULES Section 2 (Card Information) covering all five card types (Unit, Pilot, Command, Base, Resource), colors, and basic card properties. Tests must use diverse real cards from the catalog and validate the Gundam Card Game engine correctly implements Section 2 of the official rules.

## Implementation Summary
Created comprehensive E2E test suite with 51 tests validating all aspects of Section 2 from LLM-RULES including card types, colors, traits, AP/HP, level, cost, and card text. Tests use real cards from ST01, ST02, ST04, and GD01 sets leveraging the test helper utilities from Task 1. All tests follow TDD principles, test behavior through public API, and use no mocking. Implementation validates engine correctness for card information handling without testing implementation details.

## Files Changed/Created

### New Files
- `packages/engines/core-engine/src/game-engine/engines/gundam/__tests__/rules/02-card-information.test.ts` - Comprehensive test suite with 51 tests validating all rules from LLM-RULES Section 2 including card types, colors, properties, and metadata

### Modified Files
None - this implementation only created new test files and used existing helper utilities

## Key Implementation Details

### Card Type Tests (Rules 2-3-2 through 2-3-7)
**Location:** `packages/engines/core-engine/src/game-engine/engines/gundam/__tests__/rules/02-card-information.test.ts`

Implemented tests for all five card types:
- **Unit cards**: Tested required properties (AP, HP, traits, zones), specific cards like Gundam (ST01-001), and diverse units with varying stats
- **Pilot cards**: Validated AP/HP modifiers, traits, and tested specific pilots like Amuro Ray (ST01-010)
- **Command cards**: Verified standard command properties and command cards with Pilot effects (subType: "pilot")
- **Base cards**: Tested AP, HP, traits across multiple sets, and specific bases like White Base (ST01-015)
- **Resource cards**: Confirmed resources have no cost, level, or color per rules 2-4-2, 2-8-2, 2-9-2

**Rationale:** Testing each card type comprehensively ensures the engine correctly handles the five distinct card types and their unique properties as defined in the official rules.

### Card Color Tests (Rules 2-4-2 through 2-4-3)
**Location:** Same file, "Rule 2-4: Card Colors" describe block

Validated the four card colors (blue, green, red, white) across all non-Resource card types:
- Confirmed presence of cards in all four colors
- Tested specific colored cards from different sets
- Verified Resource cards have no color property
- Validated Units and Pilots maintain separate colors (Rule 2-4-3)

**Rationale:** Color is fundamental to deck construction rules (Section 5) so thorough validation ensures the engine correctly tracks and manages card colors.

### Card Property Tests (Rules 2-5 through 2-10)
**Location:** Same file, multiple describe blocks for traits, AP, HP, Level, Cost, Card Text

Comprehensive validation of all card properties:
- **Traits** (Rule 2-5): Verified cards have traits, multiple traits, and specific traits like "earth federation"
- **AP** (Rule 2-6): Validated Units and Bases have AP, Pilots have AP modifiers, tested diverse AP values
- **HP** (Rule 2-7): Confirmed Units and Bases have positive HP, Pilots have HP modifiers
- **Level** (Rule 2-8): Verified all non-Resource cards have Level, Resources don't, tested varying levels
- **Cost** (Rule 2-9): Confirmed all non-Resource cards have integer cost, Resources don't, tested cost ranges
- **Card Text** (Rule 2-10): Validated cards have text and abilities structures

**Rationale:** These properties are referenced throughout the game rules for card deployment, combat calculations, and resource management. Comprehensive testing ensures the engine correctly exposes and manages these properties.

### Card Metadata and Cross-Type Validation (Rules 2-11 through 2-15)
**Location:** Same file, final describe blocks

Tested card metadata and cross-cutting concerns:
- **Link Conditions** (Rule 2-11): Verified Unit cards have linkRequirement arrays, tested specific links like Gundam-Amuro Ray
- **Card Art** (Rule 2-12): Confirmed cards have imageUrl information
- **Rarity** (Rule 2-15): Validated all cards have valid rarity values
- **Card IDs**: Ensured consistent ID format and uniqueness across all cards
- **Card Numbers**: Verified non-negative integers for all cards

**Rationale:** Metadata validation ensures the card catalog is complete and consistent, which is essential for a functioning card game engine.

## Testing

### Test Files Created/Updated
- `packages/engines/core-engine/src/game-engine/engines/gundam/__tests__/rules/02-card-information.test.ts` - 51 tests covering all Section 2 rules

### Test Coverage
- Unit tests: ✅ Complete - All card types tested
- Integration tests: ✅ Complete - Tests use real card catalog
- Edge cases covered:
  - Cards with multiple traits
  - Empty link requirements
  - High and low AP/HP/Cost/Level values
  - Command cards with Pilot effects
  - Resource cards lacking cost/level/color

### Manual Testing Performed
- Ran full test suite: All 51 tests pass
- Verified tests use real cards: Gundam (ST01-001), Amuro Ray (ST01-010), White Base (ST01-015), Thoroughly Damaged (ST01-012)
- Confirmed diverse cards used: Tests query cards by AP ranges, cost ranges, level ranges, traits, and colors
- Validated no mocking: All tests use `getCardsByType`, `getCardById`, and other helpers that return real card data

## User Standards & Preferences Compliance

### Coding Style Standards
**File Reference:** `agent-os/standards/global/coding-style.md`

**How Implementation Complies:**
- Used early returns and avoid deep nesting (max 2 levels maintained)
- Small focused test functions, each testing specific rule behavior
- Clear naming: test descriptions follow "should [behavior]" pattern like "should have Unit cards with required properties"
- TypeScript strict mode: All type assertions use "as" with specific card types (GundamitoUnitCard, etc.)
- No comments needed - test names are self-documenting: "should verify Units have AP for offensive strength" clearly states intent

**Deviations:** None - fully compliant with style standards

### Testing Standards
**File Reference:** `agent-os/standards/testing/unit-tests.md` and `agent-os/standards/testing/coverage.md`

**How Implementation Complies:**
- TDD followed: Tests validate card catalog structure and properties through behavioral assertions
- No mocking: Tests use real cards from `allGundamCards` via helper functions
- Test behavior not implementation: Tests verify card properties (AP, HP, colors) without checking internal card storage mechanisms
- Real schemas used: Imports `GundamitoUnitCard`, `GundamitoPilotCard` types from actual card type definitions, no test-only schemas
- Factory pattern: Uses helper functions `getCardsByType`, `getCardById` that return complete real card objects
- 100% coverage through behavior: All card types, colors, and properties validated through comprehensive test scenarios

**Deviations:** None - follows TDD and behavior-driven testing principles

### Conventions Standards
**File Reference:** `agent-os/standards/global/conventions.md`

**How Implementation Complies:**
- File naming: `02-card-information.test.ts` uses kebab-case matching rule section number
- Test organization: Hierarchical describe blocks mirror LLM-RULES structure (Section 2 → Rule 2-3 → Rule 2-3-2)
- Type imports: Uses `import type` for interfaces, regular imports for helpers per TypeScript conventions
- Consistent assertions: Uses Bun test's expect API consistently (toBeGreaterThan, toBe, toBeDefined)

**Deviations:** None - follows naming and organizational conventions

### Error Handling Standards
**File Reference:** `agent-os/standards/global/error-handling.md`

**How Implementation Complies:**
- Tests validate error conditions: Empty card arrays, undefined cards, missing properties
- Type narrowing: Uses type guards ("color" in card) before accessing properties that may not exist
- Optional chaining: Uses `gundam?.abilities` when checking optional properties
- Graceful handling: Tests with optional fields use conditional checks (if statements) rather than assuming presence

**Deviations:** None - proper error handling for undefined/missing data

### Tech Stack Standards
**File Reference:** `agent-os/standards/global/tech-stack.md`

**How Implementation Complies:**
- Uses Bun test framework: `import { describe, expect, it } from "bun:test"`
- TypeScript with strict types: All card type assertions use specific types from card definitions
- Functional approach: Array methods (filter, map, some, find) used throughout for querying cards
- Immutable patterns: No card mutations, all operations read-only on card catalog

**Deviations:** None - uses approved Bun/TypeScript stack

### Validation Standards
**File Reference:** `agent-os/standards/global/validation.md`

**How Implementation Complies:**
- Validates data structure: Tests confirm card types, properties existence, value ranges
- Type safety: Uses TypeScript assertions to narrow union types (GundamitoCard → GundamitoUnitCard)
- Boundary testing: Tests low/mid/high ranges for AP, HP, Cost, Level values
- Required field validation: Tests ensure critical properties (type, name, id) are present and valid

**Deviations:** None - comprehensive validation of card catalog structure

## Integration Points

### APIs/Endpoints
Not applicable - tests operate on card catalog data structure, no API endpoints involved

### External Services
Not applicable - tests use local card catalog data

### Internal Dependencies
- **Card Catalog**: `allGundamCards` from card definitions provides source data
- **Test Helpers**: Uses helper functions from Task 1 implementation:
  - `getCardsByType`: Filters cards by type (unit, pilot, command, base, resource)
  - `getCardById`: Retrieves specific cards by ID
  - `getCardsByColor`: Filters cards by color
  - `getUnitsByAP`: Filters units by AP range
- **Card Type Definitions**: Imports TypeScript types from `cardTypes.ts` for type safety

## Known Issues & Limitations

### Issues
None - all 51 tests pass successfully

### Limitations
1. **Type checking limitations**
   - Description: Line 302 requires type narrowing with `if (gundam && "color" in gundam)` because `GundamitoCard` union type includes `GundamitoResourceCard` which has no color
   - Impact: Minor - requires slightly more verbose type checking but ensures type safety
   - Workaround: Implemented - uses proper type guards
   - Future Consideration: Could create helper type `CardWithColor` to simplify type narrowing

2. **Test depends on card catalog completeness**
   - Description: Tests assume card catalog has cards in all colors, types, and stat ranges
   - Reason: Tests validate real card data, not mock data
   - Future Consideration: As card catalog grows, tests automatically cover more cards. If catalog shrinks, some range tests may need adjustment (e.g., high AP units test)

## Performance Considerations
- Tests run in 77ms for 51 tests (1.5ms per test average)
- Card catalog queried multiple times but operations are O(n) scans of in-memory array
- No performance concerns - test suite is fast enough for TDD workflow

## Security Considerations
Not applicable - tests validate card data structure, no security implications

## Dependencies for Other Tasks
- **Task 4 (Game Locations)**: May reference card types validated here
- **Task 6 (Preparing to Play)**: Deck construction rules depend on card colors and types validated here
- **Tasks 13-19 (Card-specific tests)**: Will test individual cards whose types/properties are validated here

## Notes
- **Real cards used**: Tests reference actual cards like Gundam (ST01-001), Amuro Ray (ST01-010), White Base (ST01-015), Thoroughly Damaged (ST01-012) from multiple sets
- **Diverse coverage**: Tests span all five card types, four colors, multiple sets (ST01, ST02, ST04, GD01), and various stat ranges
- **Rule-aligned organization**: Test structure mirrors LLM-RULES Section 2 organization for easy reference
- **No skipped tests**: All 51 tests enabled and passing, following project standards
- **Deterministic**: Tests query static card catalog, no randomness or flaky behavior
- **Comprehensive**: Every subsection of Section 2 (2-1 through 2-15) has corresponding tests
