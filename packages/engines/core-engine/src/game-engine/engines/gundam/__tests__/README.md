# Gundam E2E Test Suite

Comprehensive end-to-end test suite for the Gundamito Trading Card Game engine. This test suite validates all game rules, mechanics, and card interactions according to the official LLM-RULES specification.

## Overview

This test suite follows **Test-Driven Development (TDD)** principles and uses **behavior-driven testing** to validate the Gundam TCG engine. The tests serve as both specifications and validation for game mechanics.

### Test Statistics

- **Total Test Files**: 230+ tests across the engine
- **Rules Tests**: 13 test files covering all 11 rule sections
- **Card Tests**: 213 test files covering ST01, ST02, ST03, ST04, and GD01 sets
- **Integration Tests**: 2 test files for complex scenarios and complete game flows
- **Helper Tests**: 4 test files for utilities and infrastructure

### Test Coverage Philosophy

We follow the principle of **testing behavior through the public API** (black-box testing). Tests validate game rules and mechanics without relying on implementation details. This approach:

- Documents expected behavior from player perspective
- Allows refactoring without breaking tests
- Ensures 100% coverage through business behavior validation
- Makes tests resilient to internal changes

## Test Organization

### Directory Structure

```
__tests__/
├── README.md                    # This file - test suite documentation
├── helpers/                     # Test utilities and shared infrastructure
│   ├── index.ts                # Main exports for helper utilities
│   ├── assertion-helpers.ts    # Game state assertion utilities
│   ├── scenario-builders.ts    # Common game scenario builders
│   ├── card-catalog-index.ts   # Card search and filtering utilities
│   └── *.test.ts               # Tests for helper utilities
├── rules/                       # Rule-based test organization
│   ├── 01-game-overview.test.ts           # LLM-RULES Section 1
│   ├── 02-card-information.test.ts        # LLM-RULES Section 2
│   ├── 03-game-locations.test.ts          # LLM-RULES Section 3
│   ├── 04-terminology.test.ts             # LLM-RULES Section 4
│   ├── 05-preparing-to-play.test.ts       # LLM-RULES Section 5
│   ├── 06-game-progression.test.ts        # LLM-RULES Section 6
│   ├── 06-game-progression-behavioral.test.ts # Behavioral tests for phase progression
│   ├── 07-combat.test.ts                  # LLM-RULES Section 7
│   ├── 08-action-steps.test.ts            # LLM-RULES Section 8
│   ├── 09-effects.test.ts                 # LLM-RULES Section 9
│   ├── 10-rules-management.test.ts        # LLM-RULES Section 10
│   └── 11-keywords.test.ts                # LLM-RULES Section 11
└── integration/                 # Complex scenario tests
    ├── combat-scenarios.test.ts          # Multi-unit battles, keyword interactions
    └── complete-game.test.ts             # Full game flows from start to finish
```

### Card Definition Tests

Card-specific tests are co-located with their definitions:

```
src/cards/definitions/
├── ST01/                        # Starter Deck 01: Gundam
│   ├── units/*.test.ts         # 9 unit card tests
│   ├── pilots/*.test.ts        # 2 pilot card tests
│   ├── commands/*.test.ts      # 4 command card tests
│   └── bases/*.test.ts         # 2 base card tests
├── ST02/                        # Starter Deck 02: Wing Gundam
│   └── [same structure]        # 16 card tests
├── ST03/                        # Starter Deck 03: Zaku
│   └── [same structure]        # 16 card tests
├── ST04/                        # Starter Deck 04: Strike
│   └── [same structure]        # 16 card tests
└── GD01/                        # Booster Set 01
    └── [same structure]        # 146 card tests (100 units, 14 pilots, 27 commands, 9 bases)
```

## Test Patterns and Conventions

### 1. Test Independence

Each test is completely independent and creates its own `GundamTestEngine` instance:

```typescript
describe("Combat rules", () => {
  it("declares attack target during attack step", () => {
    const engine = new GundamTestEngine(
      { battleArea: 1, deck: 30 },
      { battleArea: 1, deck: 30 }
    );

    // Test logic here
  });

  it("applies blocker during block step", () => {
    // Fresh engine instance for this test
    const engine = new GundamTestEngine(
      { battleArea: 2, deck: 30 },
      { battleArea: 1, deck: 30 }
    );

    // Test logic here
  });
});
```

### 2. Real Cards First

**Always prefer using real cards from the card catalog.** Only create mock cards when no real card exists with the required characteristics:

```typescript
// GOOD: Use real cards
import { ST01_001_gundam } from "../../src/cards/definitions/ST01/units/001-gundam";
const unit = ST01_001_gundam;

// ALSO GOOD: Use catalog helpers to find cards by characteristics
const highAPUnits = getUnitsByAP(7, 10); // Find units with AP 7-10
const blockerUnits = getCardsByKeyword("blocker");

// AVOID: Creating mock cards unless necessary
const mockUnit = { id: "mock-001", name: "Mock Unit", ... };
```

### 3. Scenario Builders

Use helper functions to create common test scenarios consistently:

```typescript
import { buildGameStartScenario, buildCombatScenario } from "../helpers";

// Game start with standard setup
const engine = buildGameStartScenario({
  playerOneHandSize: 5,
  playerOneShields: 6
});

// Combat scenario with units ready
const { engine, attackerUnits, defenderUnits } = buildCombatScenario({
  attackerCount: 2,
  defenderCount: 1
});
```

### 4. Assertion Helpers

Use type-safe assertion helpers instead of raw assertions:

```typescript
import { assertZoneCount, assertGamePhase, assertCardInZone } from "../helpers";

// Clear, descriptive assertions
assertZoneCount(engine, "hand", 5, "player_one");
assertGamePhase(engine, "main");
assertCardInZone(engine, unitInstanceId, "battleArea", "player_one");

// These throw descriptive errors if assertions fail:
// "Expected hand to have 5 cards, but found 4"
```

### 5. Test Structure for Card Tests

Card tests follow a consistent 5-section structure:

```typescript
describe("ST01-001: Gundam RX-78-2", () => {
  describe("Card Definition", () => {
    // Test card properties match specification
  });

  describe("Abilities Definition", () => {
    // Test ability structure and properties
  });

  describe("Game Scenarios", () => {
    // Test card in realistic game situations
  });

  describe("Implementation Status", () => {
    // Verify card can be instantiated and used
  });

  describe("Stats and Combat", () => {
    // Test card statistics and combat interactions
  });
});
```

### 6. Test Structure for Rules Tests

Rules tests validate specific sections of the LLM-RULES document:

```typescript
describe("LLM-RULES Section 7: Combat", () => {
  describe("7.1 Attack Step", () => {
    it("declares attack target", () => {
      // Test declaring attacks
    });

    it("cannot attack with rested units", () => {
      // Test attack restrictions
    });
  });

  describe("7.2 Block Step", () => {
    it("activates <Blocker> keyword", () => {
      // Test blocker mechanics
    });
  });

  // More subsections...
});
```

### 7. Deterministic Testing

Use the same seed for RNG to ensure reproducible results:

```typescript
const engine = new GundamTestEngine(
  { deck: 50, resourceDeck: 10 },
  { deck: 50, resourceDeck: 10 },
  {
    seed: "test-seed-123", // Reproducible randomness
    skipPreGame: false
  }
);
```

### 8. No Skipped Tests

**Never use `.skip()` on tests in the main branch.** All tests must pass. Use `.todo()` for tests that document future behavioral tests:

```typescript
// AVOID in main branch
it.skip("should handle complex interaction", () => { ... });

// ACCEPTABLE for documenting future work
it.todo("should execute combat damage after move API is implemented");
```

## Helper Utilities Reference

### Assertion Helpers

Located in `helpers/assertion-helpers.ts`:

- `assertZoneCount(engine, zone, expectedCount, playerId?)` - Verify zone has expected number of cards
- `assertZoneAtCapacity(engine, zone, playerId?)` - Verify zone is at maximum capacity (encodes zone limits)
- `assertGamePhase(engine, expectedPhase)` - Verify current game phase
- `assertGameSegment(engine, expectedSegment)` - Verify current game segment
- `assertTurnPlayer(engine, expectedPlayer)` - Verify current turn player
- `assertPriorityPlayer(engine, expectedPlayer)` - Verify player with priority (first in queue)
- `assertPriorityOrder(engine, expectedOrder)` - Verify complete priority sequence (all players in order)
- `assertCardInZone(engine, cardInstanceId, expectedZone, playerId?)` - Verify card location
- `assertUnitHasStats(engine, unitInstanceId, expectedStats)` - Verify unit statistics

### Scenario Builders

Located in `helpers/scenario-builders.ts`:

- `buildGameStartScenario(options)` - Create game with initial setup (hand, shields, decks)
- `buildCombatScenario(options)` - Create combat scenario with units in battle area
- `buildResourceScenario(options)` - Create scenario with specified resource counts
- `buildDeckConstructionScenario(options)` - Create scenario for testing deck construction rules

### Card Catalog Helpers

Located in `helpers/card-catalog-index.ts`:

- `getCardById(id)` - Find card by ID
- `getCardsBySet(setCode)` - Filter cards by set (ST01, ST02, etc.)
- `getCardsByType(type)` - Filter by type (unit, pilot, command, base, resource)
- `getCardsByColor(color)` - Filter by color (blue, white, red, green, black, yellow)
- `getCardsByCost(minCost, maxCost?)` - Filter by cost range
- `getUnitsByAP(minAP, maxAP?)` - Filter units by AP range
- `getCardsByHP(minHP, maxHP?)` - Filter units by HP range
- `getCardsByKeyword(keyword)` - Find cards with specific keywords (blocker, repair, etc.)
- `getCardsByTrait(trait)` - Find cards with specific traits
- `getRandomCard(criteria?)` - Get random card, optionally filtered
- `getCatalogStats()` - Get statistics about the card catalog

## Running Tests

### Run All Tests

```bash
bun test packages/engines/core-engine/src/game-engine/engines/gundam
```

### Run Specific Test Files

```bash
# Run rules tests
bun test packages/engines/core-engine/src/game-engine/engines/gundam/__tests__/rules/

# Run integration tests
bun test packages/engines/core-engine/src/game-engine/engines/gundam/__tests__/integration/

# Run specific rule section
bun test packages/engines/core-engine/src/game-engine/engines/gundam/__tests__/rules/07-combat.test.ts

# Run card tests for specific set
bun test packages/engines/core-engine/src/game-engine/engines/gundam/src/cards/definitions/ST01/
```

### Run with Coverage

```bash
bun test --coverage packages/engines/core-engine/src/game-engine/engines/gundam
```

### Run Quality Checks

```bash
# Run all checks (tests, linter, type checking)
bun run check

# Individual checks
bun test                  # Run tests
bun run check-types       # TypeScript type checking
bun run format            # Format and lint code
```

## Test Development Workflow

### TDD Cycle (Red-Green-Refactor)

1. **Red**: Write a failing test that specifies the desired behavior
2. **Green**: Write minimal code to make the test pass
3. **Refactor**: Improve code quality while keeping tests green

Example workflow:

```typescript
// 1. RED: Write failing test
describe("Combat damage", () => {
  it("deals AP damage to defending unit", () => {
    const { engine, attackerUnits, defenderUnits } = buildCombatScenario({
      attackerCount: 1,
      defenderCount: 1
    });

    // This should fail initially
    const attackerAP = engine.getCard(attackerUnits[0]).card.ap;
    const defenderHP = engine.getCard(defenderUnits[0]).card.hp;

    // Execute attack (not yet implemented)
    engine.executeMove({ type: "attack", ... });

    // Verify damage applied
    const newDefenderHP = engine.getCard(defenderUnits[0]).card.hp;
    expect(newDefenderHP).toBe(defenderHP - attackerAP);
  });
});

// 2. GREEN: Implement combat damage logic
// (Implement in game engine)

// 3. REFACTOR: Clean up, extract helpers, improve naming
// (Refactor while tests stay green)
```

### Writing New Tests

1. **Choose the right location**:
   - Rules tests → `__tests__/rules/XX-section-name.test.ts`
   - Card tests → Co-locate with card definition
   - Integration tests → `__tests__/integration/scenario-name.test.ts`

2. **Use real cards** from the catalog whenever possible

3. **Follow established patterns** from existing tests in the same category

4. **Make tests independent** - create fresh engine instance per test

5. **Use helper utilities** for common setup and assertions

6. **Document test intent** with clear descriptions and comments

7. **Reference LLM-RULES sections** in test descriptions

### Test Maintenance

- **Keep tests synchronized with rules** - when LLM-RULES changes, update corresponding tests
- **Update helpers when patterns emerge** - extract common code to helpers
- **Maintain card catalog** - ensure new cards are added to catalog for testing
- **Review test failures** - failing tests indicate either bugs or outdated expectations

## Testing Best Practices

### DO

- ✅ Test behavior through public API
- ✅ Use real cards from catalog
- ✅ Make tests independent
- ✅ Use descriptive test names
- ✅ Follow established patterns
- ✅ Reference rule sections in tests
- ✅ Use helper utilities
- ✅ Test edge cases and error conditions
- ✅ Keep tests deterministic
- ✅ Write tests first (TDD)

### DON'T

- ❌ Test implementation details
- ❌ Create mock cards unnecessarily
- ❌ Share state between tests
- ❌ Use `.skip()` in main branch
- ❌ Rely on test execution order
- ❌ Mix multiple concerns in one test
- ❌ Write tests without clear behavior specification
- ❌ Use `any` types or type assertions
- ❌ Mutate shared data
- ❌ Write production code before tests

## Rule Coverage Map

See `COVERAGE.md` for detailed mapping of LLM-RULES sections to test files.

## Common Test Scenarios

### Testing Win/Defeat Conditions

```typescript
import { buildGameStartScenario } from "../helpers";

it("defeats player when shields depleted and damage dealt", () => {
  const engine = buildGameStartScenario({
    playerOneShields: 0 // No shields
  });

  // Deal damage to player
  // Verify defeat condition triggered
});
```

### Testing Keyword Effects

```typescript
import { getCardsByKeyword } from "../helpers";

it("activates <Blocker> to redirect attack", () => {
  const blockers = getCardsByKeyword("blocker");
  const blocker = blockers[0]; // Use real card with Blocker

  const { engine, attackerUnits, defenderUnits } = buildCombatScenario({
    attackerCount: 1,
    defenderCount: 2 // One blocker, one target
  });

  // Test blocker mechanics
});
```

### Testing Phase Progression

```typescript
import { assertGamePhase, buildGameStartScenario } from "../helpers";

it("progresses from Start phase to Draw phase", () => {
  const engine = buildGameStartScenario();

  assertGamePhase(engine, "start");

  // Progress to next phase
  engine.executeMove({ type: "pass-priority" });

  assertGamePhase(engine, "draw");
});
```

### Testing Zone Limits

```typescript
import { assertZoneCount } from "../helpers";

it("enforces 6 unit limit in battle area", () => {
  const engine = new GundamTestEngine(
    { battleArea: 6, deck: 30 }, // At limit
    { deck: 50 }
  );

  assertZoneCount(engine, "battleArea", 6, "player_one");

  // Attempt to deploy 7th unit
  // Verify enforcement of limit
});
```

## Troubleshooting

### Tests Failing After Changes

1. **Review the failure message** - assertion helpers provide descriptive errors
2. **Check if behavior changed** - update test expectations if intentional
3. **Verify test independence** - ensure tests don't depend on execution order
4. **Check for state mutations** - ensure immutability is preserved

### Tests Passing But Game Broken

This usually indicates tests are validating implementation details rather than behavior:

1. **Review test assertions** - are you testing what the code does or what it should do?
2. **Test through public API** - avoid reaching into internals
3. **Add integration tests** - test complete workflows end-to-end

### Helper Utilities Not Found

Ensure you're importing from the correct location:

```typescript
// Correct
import { assertZoneCount, buildGameStartScenario } from "../helpers";

// Also correct
import { assertZoneCount } from "../helpers/assertion-helpers";
```

## Contributing

When adding new tests:

1. Follow the TDD cycle: Red → Green → Refactor
2. Use established patterns from existing tests
3. Update this README if introducing new patterns
4. Ensure all quality checks pass: `bun run check`
5. Add JSDoc comments to new helper utilities

## References

- **LLM-RULES.md**: Concise rule structure for the game engine
- **RULES.md**: Complete rule reference with examples
- **GLOSSARY.md**: Term definitions and game concepts
- **COVERAGE.md**: Test coverage mapping (see Task 23.3)

---

**Last Updated**: Task 23 - Comprehensive E2E Testing Documentation
**Test Suite Version**: 1.0
**Total Tests**: 230+ across rules, cards, integration, and helpers
