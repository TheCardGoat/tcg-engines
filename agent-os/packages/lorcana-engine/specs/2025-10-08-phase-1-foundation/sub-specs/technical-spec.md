# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/packages/lorcana-engine/specs/2025-10-08-phase-1-foundation/spec.md

## Technical Requirements

### Build Infrastructure Fixes

**Import/Export Resolution:**
- Fix `challengerAbility` export/import issue causing test failures
- Audit all ability keyword exports from `/abilities/keyword/` directory
- Ensure consistent export patterns (named exports vs default exports)
- Verify all card definition imports resolve correctly

**Type Safety:**
- Resolve all TypeScript strict mode violations
- Remove any `any` types
- Fix circular dependency issues if present
- Ensure all game state types are properly defined

**Test Infrastructure:**
- Configure test runner to handle async operations correctly
- Set up proper test fixtures and mocks following patterns from CLAUDE.md
- Ensure tests can import card definitions without side effects
- Fix any test configuration issues preventing runs

### Test Pattern Establishment

**Behavior-Driven Testing Framework:**
- Create test factories for common game scenarios:
  - `createTestGame(options)` - Initialize game with specific setup
  - `createTestCard(overrides)` - Generate card instances for testing
  - `simulateTurn(actions)` - Execute a sequence of game actions

**Test Pattern Documentation:**
- Document testing philosophy: test behavior through public API
- Provide examples for each major game concept:
  - Testing moves (quest, challenge, play card)
  - Testing abilities (triggered, activated, static)
  - Testing phase transitions
  - Testing game state validation

**Test Coverage Strategy:**
- Test business behavior, not implementation details
- Use real objects, no mocking (per CLAUDE.md)
- 100% coverage through business behavior tests
- Tests serve as living documentation of rules

### Code Organization Patterns

**Directory Structure:**
```
lorcana/src/
├── game-definition/      # Game segments and flow
├── moves/                # Player actions
├── operations/           # Internal game operations
├── queries/              # State queries
├── abilities/            # Ability definitions
│   ├── keyword/          # Keyword abilities
│   ├── triggered/        # Triggered abilities
│   ├── activated/        # Activated abilities
│   └── static/           # Static abilities
├── cards/
│   ├── definitions/      # Card data by set
│   └── builders/         # Card creation utilities
└── rules/                # Rule implementations by section
```

**Naming Conventions:**
- Moves: `<action>.ts` (e.g., `quest.ts`, `challenge.ts`)
- Operations: `<action>-<noun>.ts` (e.g., `ready-all-characters.ts`)
- Tests: `<filename>.test.ts` or `<filename>.spec.ts` for segment tests

### Implementation Audit Structure

**Rule Mapping Document:**
```markdown
# Lorcana Implementation Status

## 1. CONCEPTS
- [x] 1.1 General - Complete
- [x] 1.2 Golden Rules - Complete
- [x] 1.3 Active Player - Complete
...

## 2. BEFORE THE GAME
- [x] 2.1 Deck Rules - Partial (validation incomplete)
...

## 4. TURN STRUCTURE
- [x] 4.1 Phases - Complete
- [x] 4.2 Beginning Phase - Complete
- [x] 4.3 Main Phase - Partial (some moves missing)
...
```

**Gap Analysis Format:**
- **Rule Section:** e.g., "4.3.6 Challenge"
- **Implementation Status:** Complete / Partial / Missing
- **Code Location:** File path if implemented
- **Gaps:** Specific missing functionality
- **Priority:** High / Medium / Low for future implementation

### Core Engine Integration Points

**Current Framework Usage:**
- Segment-based game flow (`SegmentConfig`)
- Phase and step structure
- Move registration system
- Game state types (`ExtendGameState`, `ExtendPlayerState`)
- Card filtering system (`ExtendCardFilter`)

**Framework Gaps to Document:**
- Effect resolution system (The Bag implementation)
- Timing window management
- Priority passing mechanism
- Delta computation for state changes
- Validation framework for move legality

**Integration Documentation:**
- How moves interact with core engine
- How game state extends base types
- How segments control flow
- How card instances are managed
- How zones are represented

### Working Example Requirements

**Example 1: Complete Quest Scenario**
```typescript
// Test a full quest action from setup to lore gain
// Demonstrates: game setup, turn flow, move execution, state validation
```

**Example 2: Complete Challenge Scenario**
```typescript
// Test a character challenging another character
// Demonstrates: move validation, damage resolution, banishing, game state check
```

**Example 3: Complete Game from Start to Victory**
```typescript
// Test a full game where one player reaches 20 lore
// Demonstrates: entire game flow, multiple turns, win condition
```

### Performance Considerations

- No specific performance requirements for Phase 1
- Focus on correctness over optimization
- Deterministic behavior is critical (per CLAUDE.md)
- State immutability must be maintained

### Documentation Deliverables

1. **Testing Guide:** Comprehensive guide to writing tests for Lorcana
2. **Implementation Audit:** Complete rule-by-rule status document
3. **Pattern Examples:** Code examples for common patterns
4. **Framework Integration:** Documentation of core engine usage
5. **Known Issues:** List of current limitations and workarounds
