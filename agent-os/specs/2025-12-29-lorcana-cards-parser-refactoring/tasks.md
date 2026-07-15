# Task Breakdown: Lorcana Cards Parser Refactoring

## Overview
Total Tasks: 7 task groups across 7 phases
Estimated Duration: 15-21 days
Delivery: Single PR with complete v1 removal
Target Coverage: 95%+ for v2 parser code
Target Parsing: 80% automated, 20% manual overrides acceptable

## Assigned Roles
Based on available implementers from `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/agent-os/roles/implementers.yml`:
- **testing-engineer**: Test writing, test coverage, test fixtures
- **api-engineer**: Parser logic, business logic, effect parsers (closest match for parser implementation)

**Note**: This is primarily a parsing/backend logic task. The api-engineer role is assigned as the closest match since parser logic is similar to backend business logic (data transformation, validation, structured outputs). No database or UI work is required.

## Task List

### Phase 1: Foundation & Core Grammar

#### Task Group 1: Setup Infrastructure
**Assigned implementer:** api-engineer
**Dependencies:** None

- [ ] 1.0 Complete foundation and core grammar setup
  - [ ] 1.1 Add Chevrotain dependency
    - Run: `cd /Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards && bun add chevrotain`
    - Verify installation in package.json
  - [ ] 1.2 Create v2 directory structure
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/`
    - Subdirectories: `lexer/`, `grammar/`, `visitors/`, `effects/`, `logging/`
  - [ ] 1.3 Implement logging infrastructure
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/logging/logger.ts`
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/logging/context.ts`
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/logging/index.ts`
    - Support log levels: debug, info, warn, error
    - Environment variable: PARSER_DEBUG=true for debug mode
  - [ ] 1.4 Implement token definitions
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/lexer/tokens.ts`
    - Define tokens: keywords (When, Whenever, Draw, Discard, Deal, Damage, etc.)
    - Define tokens: symbols (Comma, Period, Dash, Colon)
    - Define tokens: literals (Number, Identifier)
    - Define WhiteSpace token with SKIPPED group
    - Export allTokens array in correct order
  - [ ] 1.5 Create lexer instance
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/lexer/lexer.ts`
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/lexer/index.ts`
    - Instantiate Chevrotain Lexer with allTokens
  - [ ] 1.6 Define basic grammar rules
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/grammar/ability-grammar.ts`
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/grammar/index.ts`
    - Define rules: ability, triggeredAbility, activatedAbility, staticAbility, keywordAbility
    - Define rules: triggerPhrase, effectPhrase
    - Define placeholder rules for atomicEffect, compositeEffect
  - [ ] 1.7 Implement visitor pattern
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/visitors/base-visitor.ts`
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/visitors/ability-visitor.ts`
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/visitors/index.ts`
    - Implement CST to AST transformation
    - Add logging to visitor methods
  - [ ] 1.8 Create type definitions
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/types.ts`
    - Define internal v2 types as needed
  - [ ] 1.9 Create main parser entry point
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/index.ts`
    - Implement LorcanaParserV2 class
    - Wire lexer, parser, and visitor
    - Export parseAbility method

**Acceptance Criteria:**
- Chevrotain dependency added successfully
- Directory structure created
- Lexer tokenizes common Lorcana keywords correctly
- Basic grammar recognizes ability structure
- Visitor pattern infrastructure works
- Logging system operational with debug mode
- Main parser class instantiates without errors

**Files Created:**
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/lexer/tokens.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/lexer/lexer.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/lexer/index.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/grammar/ability-grammar.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/grammar/index.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/visitors/base-visitor.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/visitors/ability-visitor.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/visitors/index.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/logging/logger.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/logging/context.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/logging/index.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/types.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/index.ts`

---

#### Task Group 2: Foundation Tests
**Assigned implementer:** testing-engineer
**Dependencies:** Task Group 1

- [ ] 2.0 Write comprehensive tests for foundation layer
  - [ ] 2.1 Write tests for lexer
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/lexer/__tests__/lexer.test.ts`
    - Test tokenization of common keywords
    - Test case-insensitive keyword matching
    - Test symbol tokenization
    - Test number and identifier tokenization
    - Test whitespace handling
    - Achieve 95%+ coverage for lexer code
  - [ ] 2.2 Write tests for grammar
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/grammar/__tests__/ability-grammar.test.ts`
    - Test ability rule parsing
    - Test triggered ability structure
    - Test activated ability structure
    - Test static ability structure
    - Test keyword ability structure
    - Test parser error handling
    - Achieve 95%+ coverage for grammar code
  - [ ] 2.3 Write tests for visitor
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/visitors/__tests__/ability-visitor.test.ts`
    - Test CST to AST transformation
    - Test visitor methods for each ability type
    - Test error handling in visitor
    - Achieve 95%+ coverage for visitor code
  - [ ] 2.4 Write tests for logging
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/logging/__tests__/logger.test.ts`
    - Test log level filtering
    - Test enable/disable functionality
    - Test structured log output
    - Test context inclusion
    - Achieve 95%+ coverage for logger code
  - [ ] 2.5 Write integration tests for parser entry point
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/__tests__/parser-integration.test.ts`
    - Test end-to-end parsing of simple abilities
    - Test parser error handling
    - Test debug logging integration
    - Achieve 95%+ coverage for main parser class
  - [ ] 2.6 Verify all foundation tests pass
    - Run: `bun test /Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/`
    - Verify 95%+ coverage achieved
    - Ensure no test failures

**Acceptance Criteria:**
- All lexer tests pass with 95%+ coverage
- All grammar tests pass with 95%+ coverage
- All visitor tests pass with 95%+ coverage
- All logging tests pass with 95%+ coverage
- Integration tests demonstrate end-to-end parsing
- Overall v2 foundation coverage is 95%+

**Files Created:**
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/lexer/__tests__/lexer.test.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/grammar/__tests__/ability-grammar.test.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/visitors/__tests__/ability-visitor.test.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/logging/__tests__/logger.test.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/__tests__/parser-integration.test.ts`

---

### Phase 2: Effect Registry Pattern

#### Task Group 3: Effect Registry & Atomic Effects
**Assigned implementer:** api-engineer
**Dependencies:** Task Group 1, 2

- [ ] 3.0 Complete effect registry pattern and atomic effect parsers
  - [ ] 3.1 Define EffectParser interface
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/index.ts`
    - Define EffectParser interface with pattern, parse, description fields
    - Export parseAtomicEffect function with registry iteration
  - [ ] 3.2 Create atomic effect parsers
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/draw-effect.ts`
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/discard-effect.ts`
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/damage-effect.ts`
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/lore-effect.ts`
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/exert-effect.ts`
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/banish-effect.ts`
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/stat-mod-effect.ts`
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/keyword-effect.ts`
    - Each parser should be 50-100 lines
    - Each parser should implement EffectParser interface
    - Each parser should include logging
    - Reuse existing utilities (numeric-extractor.ts) where applicable
  - [ ] 3.3 Register atomic effect parsers
    - Update `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/index.ts`
    - Create atomicEffectParsers array with explicit registration
    - Order parsers from most specific to most generic
    - Export atomicEffectParsers array
  - [ ] 3.4 Wire registry to grammar
    - Update `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/grammar/ability-grammar.ts`
    - Add effect grammar rules for registered parsers
    - Wire grammar rules to call parseAtomicEffect
  - [ ] 3.5 Update visitor to handle effects
    - Update `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/visitors/ability-visitor.ts`
    - Add visitor methods for each effect type
    - Delegate to effect parsers via registry

**Acceptance Criteria:**
- EffectParser interface defined
- 8 atomic effect parsers implemented (50-100 lines each)
- All parsers registered in explicit registry
- Registry correctly iterates and returns first match
- Grammar rules wire to effect parsers
- Visitor delegates to effect parsers
- All effect parsers include logging

**Files Created:**
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/draw-effect.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/discard-effect.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/damage-effect.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/lore-effect.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/exert-effect.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/banish-effect.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/stat-mod-effect.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/keyword-effect.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/index.ts`

**Files Modified:**
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/grammar/ability-grammar.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/visitors/ability-visitor.ts`

---

#### Task Group 4: Atomic Effect Tests
**Assigned implementer:** testing-engineer
**Dependencies:** Task Group 3

- [ ] 4.0 Write comprehensive tests for atomic effect parsers
  - [ ] 4.1 Write tests for each atomic effect parser
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/__tests__/draw-effect.test.ts`
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/__tests__/discard-effect.test.ts`
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/__tests__/damage-effect.test.ts`
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/__tests__/lore-effect.test.ts`
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/__tests__/exert-effect.test.ts`
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/__tests__/banish-effect.test.ts`
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/__tests__/stat-mod-effect.test.ts`
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/__tests__/keyword-effect.test.ts`
    - Test happy path parsing
    - Test singular vs plural variations
    - Test case insensitivity
    - Test pattern non-matches (returns null)
    - Test edge cases (zero amounts, max values)
    - Achieve 95%+ coverage for each parser
  - [ ] 4.2 Write tests for effect registry
    - Update `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/__tests__/registry.test.ts`
    - Test parseAtomicEffect function
    - Test registration order (most specific first)
    - Test that first matching parser wins
    - Test null return when no parser matches
    - Achieve 95%+ coverage for registry logic
  - [ ] 4.3 Verify all atomic effect tests pass
    - Run: `bun test /Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/`
    - Verify 95%+ coverage for all atomic effect code
    - Ensure no test failures

**Acceptance Criteria:**
- All atomic effect parsers have comprehensive unit tests
- Each parser achieves 95%+ code coverage
- Registry logic has 95%+ coverage
- All tests pass
- Test edge cases and error scenarios

**Files Created:**
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/__tests__/draw-effect.test.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/__tests__/discard-effect.test.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/__tests__/damage-effect.test.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/__tests__/lore-effect.test.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/__tests__/exert-effect.test.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/__tests__/banish-effect.test.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/__tests__/stat-mod-effect.test.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/__tests__/keyword-effect.test.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/__tests__/registry.test.ts`

---

### Phase 3: Composite Effects

#### Task Group 5: Composite Effect Parsers
**Assigned implementer:** api-engineer
**Dependencies:** Task Group 3, 4

- [ ] 5.0 Complete composite effect parsing
  - [ ] 5.1 Create composite effects directory
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/`
  - [ ] 5.2 Implement composite effect parsers
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/sequence-effect.ts`
      - Parse "X, then Y" patterns
      - Recursively parse nested atomic effects
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/choice-effect.ts`
      - Parse "Choose one: X; or Y" patterns
      - Handle multiple choice options
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/optional-effect.ts`
      - Parse "You may X" patterns
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/for-each-effect.ts`
      - Parse "for each X" patterns
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/conditional-effect.ts`
      - Parse "if X, then Y" patterns
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/repeat-effect.ts`
      - Parse "X times" patterns
    - Each parser should be 50-150 lines
    - Each parser should include logging
    - Parsers should recursively call parseAtomicEffect
  - [ ] 5.3 Create composite effects registry
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/index.ts`
    - Export compositeEffectParsers array
    - Export parseCompositeEffect function
    - Register parsers in order of specificity
  - [ ] 5.4 Wire composite effects to grammar
    - Update `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/grammar/ability-grammar.ts`
    - Add composite effect grammar rules
    - Wire rules to composite effect parsers
  - [ ] 5.5 Update main effects index
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/index.ts`
    - Export both atomic and composite parsers
    - Create unified parseEffect function that tries composite first, then atomic

**Acceptance Criteria:**
- 6 composite effect parsers implemented
- Composite registry created with explicit registration
- Recursive parsing works for nested effects
- Grammar rules wire to composite parsers
- All parsers include comprehensive logging
- Integration with atomic parsers successful

**Files Created:**
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/sequence-effect.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/choice-effect.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/optional-effect.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/for-each-effect.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/conditional-effect.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/repeat-effect.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/index.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/index.ts`

**Files Modified:**
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/grammar/ability-grammar.ts`

---

#### Task Group 6: Composite Effect Tests
**Assigned implementer:** testing-engineer
**Dependencies:** Task Group 5

- [ ] 6.0 Write comprehensive tests for composite effects
  - [ ] 6.1 Write tests for each composite effect parser
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/__tests__/sequence-effect.test.ts`
      - Test two-step sequences
      - Test three-step sequences
      - Test non-sequence patterns (returns null)
      - Test different separators (", then ", ". Then ")
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/__tests__/choice-effect.test.ts`
      - Test two-option choices
      - Test three+ option choices
      - Test non-choice patterns
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/__tests__/optional-effect.test.ts`
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/__tests__/for-each-effect.test.ts`
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/__tests__/conditional-effect.test.ts`
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/__tests__/repeat-effect.test.ts`
    - Achieve 95%+ coverage for each parser
  - [ ] 6.2 Write integration tests for nested effects
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/__tests__/nested-effects.test.ts`
    - Test sequence containing choices
    - Test choice containing sequences
    - Test deeply nested structures
    - Test recursive parsing correctness
  - [ ] 6.3 Verify all composite effect tests pass
    - Run: `bun test /Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/`
    - Verify 95%+ coverage for all composite code
    - Ensure no test failures

**Acceptance Criteria:**
- All composite parsers have comprehensive unit tests
- Each parser achieves 95%+ coverage
- Integration tests verify recursive parsing
- All tests pass
- Nested effect structures tested

**Files Created:**
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/__tests__/sequence-effect.test.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/__tests__/choice-effect.test.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/__tests__/optional-effect.test.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/__tests__/for-each-effect.test.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/__tests__/conditional-effect.test.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/__tests__/repeat-effect.test.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/composite/__tests__/nested-effects.test.ts`

---

### Phase 4: Targets & Conditions

#### Task Group 7: Target & Condition Parsing
**Assigned implementer:** api-engineer
**Dependencies:** Task Group 5, 6

- [ ] 7.0 Complete target and condition parsing
  - [ ] 7.1 Define target grammar rules
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/grammar/target-grammar.ts`
    - Define rules for target phrases: "chosen character", "another character", "all characters", etc.
    - Define rules for target modifiers: "your", "opponent's", "each", "all", "another"
    - Define rules for target types: character, item, location, player, card
    - Add to grammar index
  - [ ] 7.2 Implement target visitor
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/visitors/target-visitor.ts`
    - Implement CST to target AST transformation
    - Add logging
    - Export target visitor
  - [ ] 7.3 Define condition grammar rules
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/grammar/condition-grammar.ts`
    - Define rules for condition phrases: "if you have X", "when X", "during X"
    - Define rules for condition operators: "with", "without", "at least", "at most"
    - Add to grammar index
  - [ ] 7.4 Implement condition visitor
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/visitors/condition-visitor.ts`
    - Implement CST to condition AST transformation
    - Add logging
    - Export condition visitor
  - [ ] 7.5 Integrate targets into effect parsers
    - Update atomic effect parsers to parse target clauses
    - Ensure targets are included in effect objects
    - Add logging for target parsing
  - [ ] 7.6 Integrate conditions into effect parsers
    - Update atomic effect parsers to parse condition clauses
    - Ensure conditions are included in effect objects
    - Add logging for condition parsing

**Acceptance Criteria:**
- Target grammar rules defined
- Condition grammar rules defined
- Target visitor implemented
- Condition visitor implemented
- Integration with effect parsers successful
- Logging traces target/condition parsing

**Files Created:**
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/grammar/target-grammar.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/grammar/condition-grammar.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/visitors/target-visitor.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/visitors/condition-visitor.ts`

**Files Modified:**
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/grammar/index.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/visitors/index.ts`
- Multiple atomic effect parser files

---

#### Task Group 8: Target & Condition Tests
**Assigned implementer:** testing-engineer
**Dependencies:** Task Group 7

- [ ] 8.0 Write comprehensive tests for targets and conditions
  - [ ] 8.1 Write tests for target grammar
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/grammar/__tests__/target-grammar.test.ts`
    - Test chosen target parsing
    - Test quantified targets (all, each, another)
    - Test ownership modifiers (your, opponent's)
    - Test target types (character, item, location, player, card)
    - Achieve 95%+ coverage
  - [ ] 8.2 Write tests for condition grammar
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/grammar/__tests__/condition-grammar.test.ts`
    - Test conditional phrases
    - Test condition operators
    - Test timing conditions
    - Achieve 95%+ coverage
  - [ ] 8.3 Write tests for target visitor
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/visitors/__tests__/target-visitor.test.ts`
    - Test CST to target AST transformation
    - Test all target variations
    - Achieve 95%+ coverage
  - [ ] 8.4 Write tests for condition visitor
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/visitors/__tests__/condition-visitor.test.ts`
    - Test CST to condition AST transformation
    - Test all condition variations
    - Achieve 95%+ coverage
  - [ ] 8.5 Write integration tests for effects with targets/conditions
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/__tests__/targets-conditions-integration.test.ts`
    - Test effects with target clauses
    - Test effects with condition clauses
    - Test effects with both targets and conditions
    - Test real card examples
  - [ ] 8.6 Verify all target/condition tests pass
    - Run: `bun test /Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/`
    - Verify 95%+ coverage maintained
    - Ensure no test failures

**Acceptance Criteria:**
- Target grammar tests pass with 95%+ coverage
- Condition grammar tests pass with 95%+ coverage
- Target visitor tests pass with 95%+ coverage
- Condition visitor tests pass with 95%+ coverage
- Integration tests demonstrate correct parsing
- All tests pass

**Files Created:**
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/grammar/__tests__/target-grammar.test.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/grammar/__tests__/condition-grammar.test.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/visitors/__tests__/target-visitor.test.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/visitors/__tests__/condition-visitor.test.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/__tests__/targets-conditions-integration.test.ts`

---

### Phase 5: Remaining Effect Types

#### Task Group 9: Complete Effect Coverage
**Assigned implementer:** api-engineer
**Dependencies:** Task Group 7, 8

- [ ] 9.0 Complete remaining effect types
  - [ ] 9.1 Audit v1 parser for missing effect types
    - Review `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/parsers/effect-parser.ts`
    - Identify effect types not yet implemented in v2
    - Create list of remaining effect types to implement
  - [ ] 9.2 Implement remaining atomic effect parsers
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/play-effect.ts`
      - Parse "play a card" effects
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/reveal-effect.ts`
      - Parse "reveal X" effects
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/search-effect.ts`
      - Parse "search your deck" effects
      - Parse "look at top X cards" effects
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/inkwell-effect.ts`
      - Parse "add to inkwell" effects
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/location-effect.ts`
      - Parse location movement effects
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/return-effect.ts`
      - Parse "return to hand" effects
      - Parse "return to deck" effects
    - Each parser 50-100 lines
    - Each with comprehensive logging
  - [ ] 9.3 Register remaining effect parsers
    - Update `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/index.ts`
    - Add all new parsers to atomicEffectParsers array
    - Ensure registration order is correct (specific before generic)
  - [ ] 9.4 Validate against real card data
    - Run parser on sample of real cards from each set
    - Identify parsing failures
    - Fix issues discovered
    - Log parsing failures for manual override consideration

**Acceptance Criteria:**
- All parseable effect types implemented
- All parsers registered in correct order
- Each parser 50-100 lines
- Comprehensive logging in all parsers
- Real card validation identifies 80%+ success rate

**Files Created:**
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/play-effect.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/reveal-effect.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/search-effect.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/inkwell-effect.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/location-effect.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/return-effect.ts`

**Files Modified:**
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/index.ts`

---

#### Task Group 10: Remaining Effect Tests
**Assigned implementer:** testing-engineer
**Dependencies:** Task Group 9

- [ ] 10.0 Write tests for remaining effect parsers
  - [ ] 10.1 Write unit tests for each remaining parser
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/__tests__/play-effect.test.ts`
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/__tests__/reveal-effect.test.ts`
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/__tests__/search-effect.test.ts`
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/__tests__/inkwell-effect.test.ts`
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/__tests__/location-effect.test.ts`
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/__tests__/return-effect.test.ts`
    - Test happy paths
    - Test edge cases
    - Test null returns for non-matches
    - Achieve 95%+ coverage for each
  - [ ] 10.2 Write real card regression tests
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/__tests__/real-cards.test.ts`
    - Test 20-30 real card examples covering common patterns
    - Include cards from different sets
    - Test keyword abilities
    - Test triggered abilities
    - Test activated abilities
    - Test static abilities
    - Test complex composite effects
  - [ ] 10.3 Verify all remaining effect tests pass
    - Run: `bun test /Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/`
    - Verify 95%+ coverage maintained for all v2 code
    - Ensure no test failures
  - [ ] 10.4 Generate coverage report
    - Run: `bun test --coverage /Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/`
    - Verify 95%+ coverage target achieved
    - Document any areas below 95% and justify

**Acceptance Criteria:**
- All remaining effect parsers have unit tests
- Each parser achieves 95%+ coverage
- Real card regression tests cover 20-30 examples
- All tests pass
- Overall v2 parser coverage is 95%+

**Files Created:**
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/__tests__/play-effect.test.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/__tests__/reveal-effect.test.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/__tests__/search-effect.test.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/__tests__/inkwell-effect.test.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/__tests__/location-effect.test.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/__tests__/return-effect.test.ts`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/__tests__/real-cards.test.ts`

---

### Phase 6: Integration & Migration

#### Task Group 11: Wire v2 Parser
**Assigned implementer:** api-engineer
**Dependencies:** Task Group 9, 10

- [ ] 11.0 Complete integration and migration
  - [ ] 11.1 Update parser entry point
    - Update `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/index.ts`
    - Export v2 parser as default
    - Remove v1 parser exports
    - Update any re-exports
  - [ ] 11.2 Update card generation script
    - Update `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/scripts/generate-cards.ts` (or similar)
    - Replace v1 parser usage with v2
    - Update imports
    - Ensure script runs successfully
  - [ ] 11.3 Migrate manual overrides (if needed)
    - Review `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/manual-overrides.ts`
    - Verify format compatibility with v2
    - Update format if necessary
    - Test that overrides still work
  - [ ] 11.4 Run card generation for all sets
    - Execute card generation script
    - Parse all cards from all sets
    - Log parsing failures
    - Verify 80%+ automated parsing achieved
    - Document cards requiring manual overrides
  - [ ] 11.5 Fix parsing errors discovered
    - Review parsing failure logs
    - Identify patterns in failures
    - Fix parser bugs discovered
    - Re-run card generation
    - Iterate until 80%+ success rate
  - [ ] 11.6 Validate output structures
    - Verify generated ability objects match expected types
    - Test integration with lorcana-engine
    - Ensure no breaking changes to downstream code
    - Fix any issues discovered
  - [ ] 11.7 Update documentation
    - Update README with v2 parser information
    - Document grammar rules
    - Document how to add new effect parsers
    - Update any API documentation

**Acceptance Criteria:**
- v2 parser fully integrated as default
- Card generation produces valid output
- 80%+ of cards parsed automatically
- Manual overrides working correctly
- No breaking changes to downstream code
- Documentation updated

**Files Modified:**
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/index.ts`
- Card generation script (exact path TBD)
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/manual-overrides.ts` (potentially)
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/README.md`

---

#### Task Group 12: Integration Tests
**Assigned implementer:** testing-engineer
**Dependencies:** Task Group 11

- [ ] 12.0 Write integration and validation tests
  - [ ] 12.1 Write end-to-end integration tests
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/__tests__/integration.test.ts`
    - Test full parsing pipeline from ability text to typed objects
    - Test parser entry point exports
    - Test manual override integration
    - Test error handling and recovery
  - [ ] 12.2 Write card generation tests
    - Create or update tests for card generation script
    - Test that script runs successfully
    - Test that output format is correct
    - Test that all sets are processed
  - [ ] 12.3 Verify all existing tests still pass
    - Run: `bun test /Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/`
    - Ensure no regressions in other code
    - Fix any broken tests
  - [ ] 12.4 Run full test suite
    - Run: `bun test`
    - Verify all tests pass across entire project
    - No regressions in other packages

**Acceptance Criteria:**
- End-to-end integration tests pass
- Card generation tests pass
- All existing tests still pass
- No regressions in other packages
- Full test suite green

**Files Created:**
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/__tests__/integration.test.ts`
- Additional card generation test files (as needed)

---

### Phase 7: Cleanup

#### Task Group 13: Remove v1 Parser
**Assigned implementer:** api-engineer
**Dependencies:** Task Group 11, 12

- [ ] 13.0 Complete cleanup and finalization
  - [ ] 13.1 Delete v1 parser files
    - Delete `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/parsers/` (entire directory)
    - Delete `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/patterns/` (entire directory)
    - Verify no broken imports remain
  - [ ] 13.2 Delete v1 test files
    - Delete all test files for v1 parser
    - Remove any v1-specific test utilities
  - [ ] 13.3 Clean up imports and references
    - Search codebase for references to deleted files
    - Update or remove any remaining v1 imports
    - Verify no dead code remains
  - [ ] 13.4 Optimize effect parser registration order
    - Review `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/index.ts`
    - Ensure most specific parsers are first
    - Test that order is correct
    - Document registration order rationale
  - [ ] 13.5 Create grammar documentation
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/GRAMMAR.md`
    - Document token vocabulary
    - Document grammar rules
    - Provide examples of parsed patterns
    - Document design decisions
  - [ ] 13.6 Create developer guide
    - Create `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/DEVELOPER_GUIDE.md`
    - Document how to add new effect parsers
    - Provide step-by-step instructions
    - Include code examples
    - Document testing requirements
  - [ ] 13.7 Run final test suite
    - Run: `bun test`
    - Verify all tests pass
    - Generate final coverage report
    - Confirm 95%+ v2 coverage achieved
  - [ ] 13.8 Final code review and polish
    - Review all v2 code for quality
    - Fix any code style issues
    - Remove any console.log statements
    - Ensure all code follows project standards
    - Run: `bun run lint`
    - Run: `bun run format`

**Acceptance Criteria:**
- All v1 parser code deleted
- No broken imports or dead code
- Effect parser registration optimized
- Grammar documentation complete
- Developer guide complete
- All tests pass
- 95%+ coverage for v2 code
- Code review complete
- Code style compliant

**Files Deleted:**
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/parsers/` (entire directory)
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/patterns/` (entire directory)
- All v1 test files

**Files Created:**
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/GRAMMAR.md`
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/DEVELOPER_GUIDE.md`

**Files Modified:**
- `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/packages/lorcana-cards/src/parser/v2/effects/atomic/index.ts`

---

#### Task Group 14: Final Validation
**Assigned implementer:** testing-engineer
**Dependencies:** Task Group 13

- [ ] 14.0 Perform final validation and verification
  - [ ] 14.1 Run complete test suite
    - Run: `bun test`
    - Verify 100% test pass rate
    - Verify no test warnings or errors
  - [ ] 14.2 Generate final coverage report
    - Run: `bun test --coverage`
    - Verify 95%+ coverage for v2 parser code
    - Document coverage statistics
    - Create coverage report artifact
  - [ ] 14.3 Validate parsing metrics
    - Parse all cards from all sets
    - Count automated parsing success rate
    - Verify 80%+ automated parsing achieved
    - Document manual override percentage
  - [ ] 14.4 Run CI pipeline locally
    - Run: `bun run ci-check`
    - Ensure all checks pass (format, lint, type-check, test)
    - Fix any issues discovered
  - [ ] 14.5 Create validation checklist report
    - Document all success criteria met
    - Verify all acceptance criteria achieved
    - Create summary report for PR
    - List any known limitations or edge cases

**Acceptance Criteria:**
- All tests pass (100% pass rate)
- 95%+ coverage for v2 parser code
- 80%+ automated parsing achieved
- CI pipeline passes locally
- Validation checklist complete
- Ready for PR submission

**Files Created:**
- Coverage report artifact
- Validation checklist report
- Parsing metrics summary

---

## Execution Order

The tasks must be executed sequentially in the following order:

1. **Phase 1: Foundation & Core Grammar**
   - Task Group 1: Setup Infrastructure (api-engineer)
   - Task Group 2: Foundation Tests (testing-engineer)

2. **Phase 2: Effect Registry Pattern**
   - Task Group 3: Effect Registry & Atomic Effects (api-engineer)
   - Task Group 4: Atomic Effect Tests (testing-engineer)

3. **Phase 3: Composite Effects**
   - Task Group 5: Composite Effect Parsers (api-engineer)
   - Task Group 6: Composite Effect Tests (testing-engineer)

4. **Phase 4: Targets & Conditions**
   - Task Group 7: Target & Condition Parsing (api-engineer)
   - Task Group 8: Target & Condition Tests (testing-engineer)

5. **Phase 5: Remaining Effect Types**
   - Task Group 9: Complete Effect Coverage (api-engineer)
   - Task Group 10: Remaining Effect Tests (testing-engineer)

6. **Phase 6: Integration & Migration**
   - Task Group 11: Wire v2 Parser (api-engineer)
   - Task Group 12: Integration Tests (testing-engineer)

7. **Phase 7: Cleanup**
   - Task Group 13: Remove v1 Parser (api-engineer)
   - Task Group 14: Final Validation (testing-engineer)

## Notes

- This refactoring follows a strict TDD approach: implementation tasks are immediately followed by testing tasks
- Each phase builds on the previous phase
- All work will be delivered in a single PR with complete v1 removal
- The api-engineer role is assigned to parser implementation as the closest match for backend business logic
- The testing-engineer role writes all tests after implementation completes
- Target metrics: 95%+ test coverage for v2 code, 80%+ automated parsing rate
- Estimated total duration: 15-21 days

## Success Validation Checklist

- [ ] 95%+ test coverage on v2 parser code
- [ ] 80%+ of cards parsed automatically (max 20% manual overrides)
- [ ] All effect parsers 50-100 lines each
- [ ] Card generation produces valid output for all sets
- [ ] No regression in parsing accuracy
- [ ] Performance equal or better than v1
- [ ] Grammar documentation complete
- [ ] Developer guide published
- [ ] All v1 parser code deleted
- [ ] Code review approved
- [ ] CI pipeline passes
