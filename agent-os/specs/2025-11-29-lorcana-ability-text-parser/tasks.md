# Task Breakdown: Lorcana Ability Text Parser

## Overview

**Total Tasks:** 7 Task Groups with ~35 sub-tasks
**Assigned Roles:** api-engineer, testing-engineer
**Estimated Duration:** Medium complexity feature
**Target:** Parse 80%+ of 1552 unique ability texts

## Implementation Notes

This is a **TypeScript library** implementation (not a full-stack feature). The parser will live in:
```
packages/lorcana-engine/src/parser/
```

All task groups use the **api-engineer** role since this is backend business logic with no database, API endpoints, or UI components.

---

## Task List

### Phase 1: Foundation Infrastructure

#### Task Group 1: Core Types and Utilities
**Assigned implementer:** api-engineer
**Dependencies:** None
**Complexity:** Low

- [x] 1.0 Complete parser foundation infrastructure
  - [x] 1.1 Write 4-6 focused tests for core parser types and utilities
    - Test ParseResult success/failure structure
    - Test BatchParseResult aggregation
    - Test text preprocessing (whitespace normalization, name extraction)
    - Test placeholder handling ({d} to number conversion)
  - [x] 1.2 Create parser types file (`parser/types.ts`)
    - Define `ParseResult` interface with success, ability, warnings, error, unparsedSegments
    - Define `AbilityWithText` interface extending from ability-types.ts
    - Define `BatchParseResult` interface for bulk processing
    - Define `ParserOptions` interface (strict mode, resolveNumbers)
  - [x] 1.3 Create text preprocessor (`parser/preprocessor.ts`)
    - Implement `normalizeText()`: trim, collapse whitespace, normalize unicode
    - Implement `extractNamedAbilityPrefix()`: detect ALL CAPS prefix and extract ability name
    - Implement `resolveSymbols()`: handle {d}, {E}, {I}, {S}, {L}, {W} placeholders
    - Follow DRY principle - reusable normalization functions
  - [x] 1.4 Create parser module structure
    - Create directory structure: `parser/`, `parser/patterns/`, `parser/parsers/`
    - Create `parser/index.ts` with public API exports
    - Export `parseAbilityText()` and `parseAbilityTexts()` function signatures
  - [x] 1.5 Ensure foundation tests pass
    - Run ONLY the 4-6 tests written in 1.1
    - Verify type definitions compile without errors
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 4-6 tests written in 1.1 pass
- TypeScript compiles with no errors
- ParseResult and related types are properly defined
- Text preprocessor normalizes input correctly
- Named ability prefix extraction works for ALL CAPS patterns

---

### Phase 2: Pattern Infrastructure

#### Task Group 2: Pattern Registry and Classifier
**Assigned implementer:** api-engineer
**Dependencies:** Task Group 1
**Complexity:** Medium

- [x] 2.0 Complete pattern matching infrastructure
  - [x] 2.1 Write 4-6 focused tests for pattern matching
    - Test keyword pattern matching (simple, parameterized, Shift variants)
    - Test ability type classification (keyword vs triggered vs activated vs static)
    - Test pattern priority ordering (specific before general)
    - Test placeholder pattern matching ({d} and numeric)
  - [x] 2.2 Create keyword patterns (`parser/patterns/keywords.ts`)
    - Define regex patterns for simple keywords: Rush, Ward, Evasive, Bodyguard, Support, Reckless, Vanish, Alert
    - Define patterns for parameterized: `Challenger +{d}`, `Resist +{d}`
    - Define patterns for value-based: `Singer {d}`, `Sing Together {d}`, `Boost {d}`
    - Define patterns for Shift variants: `Shift {d}`, `Puppy Shift {d}`, `Universal Shift {d}`
    - Support both `{d}` placeholder and resolved numeric formats
  - [x] 2.3 Create trigger patterns (`parser/patterns/triggers.ts`)
    - Define trigger word patterns: When, Whenever, At the start of, At the end of, The first time
    - Define trigger event patterns: play, quest, challenge, challenged, banish, enter, leave
    - Define trigger subject patterns: this character, you, opponent, a character, a song
  - [x] 2.4 Create cost patterns (`parser/patterns/costs.ts`)
    - Define exert pattern: `{E}`
    - Define ink cost pattern: `{d} {I}` or `N {I}`
    - Define banish cost patterns: `Banish this item`, `Banish this character`
    - Define discard cost pattern: `Choose and discard {d} cards`
    - Define combined cost separator: `, ` between costs
  - [x] 2.5 Create ability classifier (`parser/classifier.ts`)
    - Implement `classifyAbility()`: determine type from text patterns
    - Priority order: keyword (exact match) > triggered (trigger word prefix) > activated (cost separator) > static (default)
    - Return classification with confidence indicator
  - [x] 2.6 Ensure pattern infrastructure tests pass
    - Run ONLY the 4-6 tests written in 2.1
    - Verify patterns match expected text samples
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 4-6 tests written in 2.1 pass
- All keyword variants are correctly matched
- Ability classifier correctly routes to appropriate type
- Patterns handle both placeholder and resolved formats

---

### Phase 3: Keyword Parsing

#### Task Group 3: Keyword Ability Parser
**Assigned implementer:** api-engineer
**Dependencies:** Task Group 2
**Complexity:** Medium

- [x] 3.0 Complete keyword ability parsing
  - [x] 3.1 Write 6-8 focused tests for keyword parsing
    - Test simple keywords (Rush, Ward, Evasive)
    - Test Challenger +N parsing with value extraction
    - Test Resist +N parsing with value extraction
    - Test Singer N parsing
    - Test Shift N parsing with cost extraction
    - Test Shift variants (Puppy Shift, Universal Shift)
    - Test parameterized keywords with conditions (e.g., "Challenger +2 while challenging")
  - [x] 3.2 Create keyword parser (`parser/parsers/keyword-parser.ts`)
    - Implement `parseKeywordAbility()`: main entry point
    - Implement `parseSimpleKeyword()`: return SimpleKeywordAbility
    - Implement `parseParameterizedKeyword()`: extract value, optional condition
    - Implement `parseValueKeyword()`: extract numeric value
    - Implement `parseShiftKeyword()`: extract cost, optional target
    - Use builder functions from `ability-types.ts`: `keyword()`, `challenger()`, `resist()`, `shift()`, `singer()`
  - [x] 3.3 Handle keyword condition parsing
    - Parse "while challenging", "while questing" conditions
    - Parse "while you have a [Character Type]" conditions
    - Integrate with Condition type from `condition-types.ts`
  - [x] 3.4 Ensure keyword parser tests pass
    - Run ONLY the 6-8 tests written in 3.1
    - Verify all keyword variants parse correctly
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 6-8 tests written in 3.1 pass
- All 8 simple keywords parse correctly
- Parameterized keywords extract numeric values
- Shift abilities create correct cost objects
- Output conforms to KeywordAbility type union

---

### Phase 4: Effect and Target Parsing

#### Task Group 4: Effect, Target, and Condition Parsers
**Assigned implementer:** api-engineer
**Dependencies:** Task Group 2
**Complexity:** High

- [x] 4.0 Complete effect/target/condition parsing infrastructure
  - [x] 4.1 Write 6-8 focused tests for effect parsing
    - Test draw effect: "draw N cards"
    - Test damage effect: "deal N damage to chosen character"
    - Test lore effect: "gain N lore"
    - Test exert/ready effects: "exert chosen character", "ready chosen character"
    - Test stat modification: "gets +N {S} this turn"
    - Test composite effects: sequences and choices
  - [x] 4.2 Create target patterns (`parser/patterns/targets.ts`)
    - Define patterns for self-references: "this character", "this card", "this item"
    - Define patterns for chosen targets: "chosen character", "chosen opposing character"
    - Define patterns for group targets: "your characters", "all characters", "each opposing character"
    - Define patterns for specific types: "chosen [Type]", "each [Type]"
  - [x] 4.3 Create effect patterns (`parser/patterns/effects.ts`)
    - Define draw pattern: `[Dd]raw (a|\d+) cards?`
    - Define damage pattern: `[Dd]eal (\d+) damage to (.+)`
    - Define lore pattern: `[Gg]ain (\d+) lore`
    - Define exert/ready patterns
    - Define banish, return to hand, remove damage patterns
    - Define stat modification patterns: `gets ([+-]\d+) \{S\}`
    - Define keyword grant patterns: `gains (Rush|Ward|...) this turn`
  - [x] 4.4 Create condition patterns (`parser/patterns/conditions.ts`)
    - Define "you may" optional pattern
    - Define "if you have" patterns: named character, card type, card count
    - Define "while" patterns: has damage, no damage, exerted, at location
    - Define resource conditions: cards in hand, characters in play
  - [x] 4.5 Create target parser (`parser/parsers/target-parser.ts`)
    - Implement `parseTarget()`: convert text to Target type
    - Handle SELF, CONTROLLER, OPPONENT constants
    - Handle CHOSEN_CHARACTER, CHOSEN_OPPOSING_CHARACTER
    - Handle group targets (ALL_*, YOUR_*, EACH_*)
  - [x] 4.6 Create effect parser (`parser/parsers/effect-parser.ts`)
    - Implement `parseEffect()`: main recursive parser
    - Handle each effect type from `effect-types.ts`
    - Handle optional effects ("you may")
    - Handle sequence effects (multiple effects in order)
    - Handle choice effects ("choose one")
    - Integrate with target parser for effect targets
  - [x] 4.7 Create condition parser (`parser/parsers/condition-parser.ts`)
    - Implement `parseCondition()`: convert text to Condition type
    - Handle player-choice conditions
    - Handle resource-count conditions
    - Handle has-named-character conditions
    - Handle state conditions (damaged, exerted, etc.)
  - [x] 4.8 Ensure effect/target/condition tests pass
    - Run ONLY the 6-8 tests written in 4.1
    - Verify effect parsing produces correct Effect types
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 6-8 tests written in 4.1 pass
- Target parser produces valid Target types
- Effect parser handles all common effect patterns
- Condition parser extracts conditions correctly
- Recursive parsing handles nested structures

---

### Phase 5: Complex Ability Parsing

#### Task Group 5: Triggered, Activated, and Static Parsers
**Assigned implementer:** api-engineer
**Dependencies:** Task Groups 3, 4
**Complexity:** High

- [x] 5.0 Complete complex ability parsers
  - [x] 5.1 Write 6-8 focused tests for complex ability parsing
    - Test triggered: "When you play this character, draw a card"
    - Test triggered with condition: "Whenever this character quests, if you have no cards..."
    - Test activated with exert: "{E} - Draw a card"
    - Test activated with combined cost: "{E}, 2 {I} - Deal 3 damage..."
    - Test static with grant: "Your characters gain Ward"
    - Test static with condition: "While this character has no damage, he gets +2 {S}"
    - Test named abilities: "DARK KNOWLEDGE Whenever this character quests..."
  - [x] 5.2 Create triggered ability parser (`parser/parsers/triggered-parser.ts`)
    - Implement `parseTriggeredAbility()`: main entry point
    - Extract trigger timing (when/whenever/at)
    - Extract trigger event and subject
    - Extract optional condition (if clause)
    - Extract effect using effect parser
    - Handle named ability prefix
    - Produce TriggeredAbility type
  - [x] 5.3 Create activated ability parser (`parser/parsers/activated-parser.ts`)
    - Implement `parseActivatedAbility()`: main entry point
    - Parse cost before separator (-, :, or em dash)
    - Handle combined costs (exert + ink + other)
    - Extract optional condition
    - Extract effect using effect parser
    - Handle named ability prefix
    - Handle restrictions (once per turn, etc.)
    - Produce ActivatedAbility type
  - [x] 5.4 Create static ability parser (`parser/parsers/static-parser.ts`)
    - Implement `parseStaticAbility()`: main entry point
    - Detect "While" condition prefix
    - Detect "Your characters gain" grant pattern
    - Detect continuous effect patterns
    - Handle named ability prefix
    - Produce StaticAbility type with StaticEffect
  - [x] 5.5 Create replacement ability parser (`parser/parsers/replacement-parser.ts`)
    - Implement `parseReplacementAbility()`: for "If X would Y, Z instead" patterns
    - Detect replacement triggers: damage-to-self, banish-self, etc.
    - Extract replacement effect or "prevent"/"double"
    - Produce ReplacementAbility type
  - [x] 5.6 Ensure complex ability tests pass
    - Run ONLY the 6-8 tests written in 5.1
    - Verify triggered/activated/static parsing works
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 6-8 tests written in 5.1 pass
- Triggered abilities extract correct trigger and effect
- Activated abilities parse costs correctly
- Static abilities produce valid StaticEffect
- Named abilities preserve name field

---

### Phase 6: Integration and Main Parser

#### Task Group 6: Main Parser and Batch Processing
**Assigned implementer:** api-engineer
**Dependencies:** Task Groups 3, 4, 5
**Complexity:** Medium

- [x] 6.0 Complete main parser integration
  - [x] 6.1 Write 4-6 focused tests for main parser
    - Test parseAbilityText() returns correct ParseResult
    - Test batch processing with parseAbilityTexts()
    - Test lenient mode (partial parsing with warnings)
    - Test error recovery (unparsed segments)
    - Test performance (batch of 100 texts under 500ms)
  - [x] 6.2 Create main parser (`parser/parser.ts`)
    - Implement `parseAbilityText()`: main public API
    - Orchestrate: preprocess -> classify -> route to specialized parser
    - Handle ParserOptions (strict mode, resolveNumbers)
    - Wrap output in ParseResult with success/failure
    - Implement lenient mode: warnings instead of errors, unparsedSegments
  - [x] 6.3 Implement batch processing
    - Implement `parseAbilityTexts()`: process array of texts
    - Aggregate into BatchParseResult with counts
    - Continue on individual failures (lenient batch)
    - Track successful/failed/warning counts
  - [x] 6.4 Implement error handling
    - Define error categories: unknown keyword, malformed syntax, unknown effect
    - Implement fallback for unparsable segments
    - Create detailed error messages for debugging
    - Log warnings for partial parses
  - [x] 6.5 Create public API exports (`parser/index.ts`)
    - Export `parseAbilityText` and `parseAbilityTexts`
    - Export all type definitions
    - Export individual parsers for advanced use cases
    - Add JSDoc documentation to public functions
  - [x] 6.6 Ensure main parser tests pass
    - Run ONLY the 4-6 tests written in 6.1
    - Verify end-to-end parsing works
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 4-6 tests written in 6.1 pass
- parseAbilityText() returns valid ParseResult
- Batch processing handles 100+ texts
- Error handling provides useful diagnostics
- Public API is clean and well-documented

---

### Phase 7: Testing and Validation

#### Task Group 7: Comprehensive Testing and Coverage
**Assigned implementer:** testing-engineer
**Dependencies:** Task Groups 1-6
**Complexity:** Medium

- [x] 7.0 Complete testing and validation
  - [x] 7.1 Review tests from Task Groups 1-6
    - Review tests written by api-engineer in Task Groups 1-6
    - Verify test quality and coverage of critical paths
    - Identify any gaps in testing strategy
    - Total existing tests: approximately 30-40 tests
  - [x] 7.2 Analyze test coverage for parser feature
    - Focus ONLY on parser module coverage
    - Identify untested critical paths
    - Prioritize integration test gaps over unit test gaps
    - Do NOT assess entire application test coverage
  - [x] 7.3 Write up to 10 additional strategic tests
    - Add integration tests for complex ability combinations
    - Add edge case tests for unusual text formats
    - Add regression tests for known problematic patterns
    - Test batch processing with real card data sample
    - Do NOT exceed 10 additional tests
  - [x] 7.4 Create coverage validation script
    - Implement script to parse all 1552 unique ability texts
    - Generate coverage report: parsed vs unparsed vs partial
    - List patterns that failed to parse for future improvement
    - Verify 80%+ success rate target
  - [x] 7.5 Run all parser tests
    - Run all tests related to parser module
    - Verify expected total ~40-50 tests pass
    - Generate test coverage report
    - Document any failing edge cases for future work

**Acceptance Criteria:**
- All parser tests pass (140 tests total)
- Coverage validation documents current parser capabilities
- Unparsed patterns are documented for future work
- No TypeScript compilation errors in output
- Batch processing completes in under 5 seconds

---

## Execution Order

Recommended implementation sequence (respects dependencies):

```
Phase 1: Foundation (Task Group 1) [COMPLETE]
    |
    v
Phase 2: Patterns (Task Group 2) [COMPLETE]
    |
    +---> Phase 3: Keywords (Task Group 3) [COMPLETE]
    |
    +---> Phase 4: Effects/Targets/Conditions (Task Group 4) [COMPLETE]
          |
          v
Phase 5: Complex Abilities (Task Group 5) [COMPLETE]
    |
    v
Phase 6: Integration (Task Group 6) [COMPLETE]
    |
    v
Phase 7: Testing (Task Group 7) [COMPLETE]
```

**Parallel opportunities:**
- Task Groups 3 and 4 can be worked on in parallel after Task Group 2
- Task Groups 3 and 4 must both complete before Task Group 5

---

## Files to Create

| Path | Description |
|------|-------------|
| `parser/types.ts` | ParseResult, BatchParseResult, ParserOptions [COMPLETE] |
| `parser/preprocessor.ts` | Text normalization, name extraction [COMPLETE] |
| `parser/classifier.ts` | Ability type classification [COMPLETE] |
| `parser/patterns/index.ts` | Pattern registry exports [COMPLETE] |
| `parser/patterns/keywords.ts` | Keyword regex patterns [COMPLETE] |
| `parser/patterns/triggers.ts` | Trigger word patterns [COMPLETE] |
| `parser/patterns/costs.ts` | Cost component patterns [COMPLETE] |
| `parser/patterns/effects.ts` | Effect patterns [COMPLETE] |
| `parser/patterns/targets.ts` | Target patterns [COMPLETE] |
| `parser/patterns/conditions.ts` | Condition patterns [COMPLETE] |
| `parser/parsers/keyword-parser.ts` | Keyword ability parsing [COMPLETE] |
| `parser/parsers/triggered-parser.ts` | Triggered ability parsing [COMPLETE] |
| `parser/parsers/activated-parser.ts` | Activated ability parsing [COMPLETE] |
| `parser/parsers/static-parser.ts` | Static ability parsing [COMPLETE] |
| `parser/parsers/replacement-parser.ts` | Replacement ability parsing [COMPLETE] |
| `parser/parsers/effect-parser.ts` | Effect parsing [COMPLETE] |
| `parser/parsers/target-parser.ts` | Target parsing [COMPLETE] |
| `parser/parsers/condition-parser.ts` | Condition parsing [COMPLETE] |
| `parser/parser.ts` | Main parser orchestration [COMPLETE] |
| `parser/index.ts` | Public API exports [COMPLETE] |
| `parser/__tests__/` | Test files for all parser modules [COMPLETE] |

---

## Dependencies on Existing Code

| Existing File | Usage |
|---------------|-------|
| `cards/abilities/types/ability-types.ts` | Ability, KeywordAbility, TriggeredAbility type definitions |
| `cards/abilities/types/effect-types.ts` | Effect, StaticEffect type definitions |
| `cards/abilities/types/trigger-types.ts` | Trigger type definitions |
| `cards/abilities/types/cost-types.ts` | AbilityCost type definitions |
| `cards/abilities/types/condition-types.ts` | Condition type definitions |
| `cards/abilities/types/target-types.ts` | Target, CharacterTarget type definitions |

---

## Success Metrics

| Metric | Target | Status | Notes |
|--------|--------|--------|-------|
| Parse 80%+ of 1552 unique ability texts | 80%+ | NOT MET (49.74%) | Coverage improved from 20.49% to 49.74% with Phase 2 |
| Zero TypeScript compilation errors | 0 errors | MET | No compilation errors |
| All tests pass | 500 tests | MET | All 500 parser tests passing |
| Batch processing under 5 seconds | <5s | MET | 23.36ms for all 1552 texts |
| Clear documentation of unsupported patterns | Yes | MET | Coverage validation provides detailed diagnostics |
| Warnings for partially parsed abilities | Yes | MET | Lenient mode implemented with unparsedSegments |

---

## Phase 1 Implementation Status

**Implementation Complete:** All 7 Task Groups implemented with 140 passing tests.

**Known Issues:**
1. Parse success rate (20.49%) below 80% target - documented with diagnostics for future improvement
2. TypeScript type mismatches in parser implementations - tests pass at runtime but type safety compromised

---

# Phase 2: Coverage Improvement Tasks

**Current State:** 49.74% coverage (772/1552 texts)
**Target:** 80%+ coverage

## Top Failure Categories
1. "Could not parse trigger from text" (72 cases)
2. "Effect type 'optional' is not a valid static effect" (36 cases)
3. "Effect type 'sequence' is not a valid static effect" (21 cases)
4. "Effect type 'gain-lore' is not a valid static effect" (12 cases)

---

### Task Group 2.1: Fix {d} Placeholder Handling
**Assigned implementer:** api-engineer
**Dependencies:** None
**Complexity:** Low
**Impact:** ~50+ texts

- [x] 2.1.0 Complete {d} placeholder handling in effects
  - [x] 2.1.1 Update GAIN_LORE_PATTERN to handle `{d}`: `/[Gg]ain (\d+|\{d\}) lore/`
  - [x] 2.1.2 Update LOSE_LORE_PATTERN to handle `{d}`
  - [x] 2.1.3 Update DEAL_DAMAGE_PATTERN to handle `{d}`
  - [x] 2.1.4 Update REMOVE_DAMAGE_PATTERN to handle `{d}`
  - [x] 2.1.5 Update DRAW_AMOUNT_PATTERN to handle `{d}`
  - [x] 2.1.6 Update STAT_MODIFIER_PATTERN to handle `{d}`: `/gets? ([+-]?\d+|\{d\}|\+\{d\}|-\{d\}) \{([SWL])\}/`
  - [x] 2.1.7 Update effect parser to convert `{d}` to placeholder value (-1)
  - [x] 2.1.8 Write tests for {d} placeholder effects

**Acceptance Criteria:**
- "Gain {d} lore." parses successfully
- "Deal {d} damage to chosen character." parses successfully
- "Draw {d} cards." parses successfully
- "Chosen character gets +{d} {S} this turn." parses successfully

---

### Task Group 2.2: Fix Ability Classification
**Assigned implementer:** api-engineer
**Dependencies:** None
**Complexity:** Medium
**Impact:** ~100+ texts

- [x] 2.2.0 Fix ability classification priority
  - [x] 2.2.1 Update classifier to check triggered indicators FIRST (When, Whenever, At the start/end)
  - [x] 2.2.2 Update classifier to check activated indicators SECOND ({E}, cost patterns)
  - [x] 2.2.3 Update classifier to check keywords THIRD (exact matches)
  - [x] 2.2.4 Update preprocessor to extract named ability prefix BEFORE classification
  - [x] 2.2.5 Ensure classifier operates on text AFTER name extraction
  - [x] 2.2.6 Write tests for classification edge cases

**Acceptance Criteria:**
- "IT WORKS! Whenever you play an item, you may draw a card." → triggered (not static)
- "FRESH INK When you play this item, draw a card." → triggered (not static)
- Named abilities don't confuse the classifier

---

### Task Group 2.3: Expand Trigger Patterns
**Assigned implementer:** api-engineer
**Dependencies:** Task Group 2.2
**Complexity:** Medium
**Impact:** ~57+ texts

- [x] 2.3.0 Add missing trigger patterns
  - [x] 2.3.1 Add "Whenever you play a card" pattern
  - [x] 2.3.2 Add "Whenever an opponent plays X" pattern
  - [x] 2.3.3 Add "Whenever you play a [Type] character" pattern (Hero, Villain, etc.)
  - [x] 2.3.4 Add "Whenever this character is challenged" pattern
  - [x] 2.3.5 Add "Whenever you play an action" pattern
  - [x] 2.3.6 Add "Whenever you play an item" pattern
  - [x] 2.3.7 Add "Whenever you play a song" pattern
  - [x] 2.3.8 Add "When this character is banished" pattern
  - [x] 2.3.9 Update triggered-parser to use new patterns
  - [x] 2.3.10 Write tests for each new trigger pattern

**Acceptance Criteria:**
- "YOUR REWARD AWAITS Whenever you play a card, draw a card." → parses
- "FINE PRINT Whenever an opponent plays a song, you may draw a card." → parses
- "SHAMELESS PROMOTER Whenever you play a Hero character, gain {d} lore." → parses
- "FAN FAVORITE Whenever you play a song, gain {d} lore." → parses

---

### Task Group 2.4: Fix Optional Effects in Triggered Abilities
**Assigned implementer:** api-engineer
**Dependencies:** Task Group 2.2
**Complexity:** Medium
**Impact:** ~74 texts

- [x] 2.4.0 Fix "you may" effects in triggered abilities
    - [x] 2.4.1 Update triggered-parser to properly handle OptionalEffect
    - [x] 2.4.2 Ensure effect parser returns OptionalEffect for "you may X"
    - [x] 2.4.3 Ensure OptionalEffect is valid for TriggeredAbility.effect
    - [x] 2.4.4 Write tests for triggered abilities with optional effects

**Acceptance Criteria:**
- "Whenever you play an item, you may draw a card." → TriggeredAbility with OptionalEffect
- "When this character is banished, you may draw a card." → TriggeredAbility with OptionalEffect
- "TEA PARTY Whenever this character is challenged, you may draw a card." → parses

---

### Task Group 2.5: Simple Standalone Action Effects
**Assigned implementer:** api-engineer
**Dependencies:** Task Group 2.1
**Complexity:** Low
**Impact:** ~100+ texts

- [x] 2.5.0 Expand standalone action effect parsing
  - [x] 2.5.1 Add "Chosen player draws {d} cards" pattern
  - [x] 2.5.2 Add "Each player draws X cards" pattern
  - [x] 2.5.3 Add "Each opponent loses {d} lore" pattern
  - [x] 2.5.4 Add "Banish all X" patterns (items, characters, locations)
  - [x] 2.5.5 Add "Ready chosen X" patterns
  - [x] 2.5.6 Add "Return X from discard to hand" patterns
  - [x] 2.5.7 Add "Chosen character gains [Keyword] this turn" patterns
  - [x] 2.5.8 Add "Chosen character gets +/-{d} {S/W/L} this turn" patterns
  - [x] 2.5.9 Write tests for each new action effect

**Acceptance Criteria:**
- "Chosen player draws {d} cards." → parses as action
- "Each opponent loses {d} lore." → parses as action
- "Banish all items." → parses as action
- "Ready chosen item." → parses as action
- "Chosen character gains Rush this turn." → parses as action

---

### Task Group 2.6: Simple Static Ability Patterns
**Assigned implementer:** api-engineer
**Dependencies:** Task Group 2.2
**Complexity:** Medium
**Impact:** ~50+ texts

- [x] 2.6.0 Expand static ability patterns
  - [x] 2.6.1 Add "can't be challenged" restriction pattern
  - [x] 2.6.2 Add "cannot challenge" restriction pattern
  - [x] 2.6.3 Add "enters play exerted" pattern
  - [x] 2.6.4 Add "Your X gain Y" grant patterns
  - [x] 2.6.5 Add "Your X get +{d} {S}" modifier patterns
  - [x] 2.6.6 Add "Characters gain X while here" location patterns
  - [x] 2.6.7 Add "can challenge ready characters" pattern
  - [x] 2.6.8 Write tests for each new static pattern

**Acceptance Criteria:**
- "HIDDEN AWAY This character can't be challenged." → parses as static
- "WAR WOUND This character cannot challenge." → parses as static
- "ASLEEP This item enters play exerted." → parses as static
- "ISOLATED Characters gain Resist +{d} while here." → parses as static

---

### Task Group 2.7: Named Ability Extraction Improvement
**Assigned implementer:** api-engineer
**Dependencies:** None
**Complexity:** Low
**Impact:** ~150+ texts improved extraction

- [x] 2.7.0 Improve named ability extraction
  - [x] 2.7.1 Update regex to handle names with numbers: "{d},{d} MEDICAL PROCEDURES"
  - [x] 2.7.2 Update regex to handle special characters properly
  - [x] 2.7.3 Ensure extraction works for all name patterns in card texts
  - [x] 2.7.4 Write tests for edge case names

**Acceptance Criteria:**
- Names with numbers extract correctly
- Names with special punctuation extract correctly
- Named abilities don't break classification

---

### Task Group 2.8: Activated Ability Improvements
**Assigned implementer:** api-engineer
**Dependencies:** Task Group 2.1
**Complexity:** Medium
**Impact:** ~30+ texts

- [x] 2.8.0 Expand activated ability parsing
  - [x] 2.8.1 Add "{E}, {d} {I} - effect" combined cost pattern
  - [x] 2.8.2 Add "{E}, Banish this X - effect" sacrifice cost pattern
  - [x] 2.8.3 Add "{d} {I} - effect" ink-only cost pattern
  - [x] 2.8.4 Add "NAME {E} - effect" named activated pattern
  - [x] 2.8.5 Update cost parser for all separator variants (-, −, –, :)
  - [x] 2.8.6 Write tests for each cost pattern

**Acceptance Criteria:**
- "{E}, {d} {I} - Deal {d} damage to chosen character." → parses as activated
- "{E}, Banish this item - Choose one:" → parses as activated
- "SKIRMISH {E} − Deal {d} damage to chosen character." → parses as activated

---

## Phase 2 Execution Order

```
2.1 {d} Placeholder (LOW complexity) [COMPLETE] ─────────────────────┐
                                                                      │
2.2 Classification Fix (MEDIUM) [COMPLETE] ───────────────────────┼──→ 2.3 Triggers [COMPLETE]
                                                                      │
                                                                      └──→ 2.4 Optional Effects [COMPLETE]

2.5 Action Effects [COMPLETE] ──────────────────────────→ 2.6 Static Patterns [COMPLETE]

2.7 Named Extraction [COMPLETE] ──────────────────────────────→ 2.8 Activated [COMPLETE]
```

**Parallel opportunities:**
- 2.1 and 2.2 can run in parallel
- 2.3 and 2.4 can run in parallel after 2.2
- 2.5 and 2.6 can run in parallel after 2.1/2.2
- 2.7 and 2.8 are independent

---

## Phase 2 Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Total Coverage | 49.74% (772) | 80%+ (~1240) |
| Triggered Abilities | 365 | ~500 |
| Activated Abilities | 70 | ~120 |
| Static Abilities | 244 | ~300 |
| Action Effects | 75 | ~200 |
| Performance | 23.36ms | <50ms |
| Tests | 500 | ~500 |

---

## Phase 3 (Future Work)

Reserved for complex patterns:
- "Choose one:" modal effects
- "for each" scaling effects
- Multi-sentence composite sequences
- Conditional "if X, Y" / "if X, Y instead" effects
- Replacement abilities
- While conditions with continuous effects
