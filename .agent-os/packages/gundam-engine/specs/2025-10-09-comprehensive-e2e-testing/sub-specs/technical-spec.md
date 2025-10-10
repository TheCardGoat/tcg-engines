# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/packages/gundam-engine/specs/2025-10-09-comprehensive-e2e-testing/spec.md

## Technical Requirements

### Test Framework & Structure

- **Test Runner**: Use `bun test` as specified in tech-stack.md
- **Test Organization**: Mirror Lorcana's proven structure with tests co-located near card definitions
- **Test Engine**: Leverage existing `GundamTestEngine` from `~/game-engine/engines/gundam/src/testing/gundam-test-engine.ts`
- **No Mocking**: Follow CLAUDE.md principle - use real engine instances with actual board states
- **Behavior-Driven**: Test through public API only, validating observable behavior

### Test File Organization

```
packages/engines/core-engine/src/game-engine/engines/gundam/
├── __tests__/
│   ├── rules/                          # Rule-based E2E tests
│   │   ├── 01-game-overview.test.ts    # Section 1 rules
│   │   ├── 02-card-information.test.ts # Section 2 rules
│   │   ├── 03-game-locations.test.ts   # Section 3 rules
│   │   ├── 04-terminology.test.ts      # Section 4 rules
│   │   ├── 05-preparing-to-play.test.ts# Section 5 rules
│   │   ├── 06-game-progression.test.ts # Section 6 rules
│   │   ├── 07-combat.test.ts           # Section 7 rules
│   │   ├── 08-action-steps.test.ts     # Section 8 rules
│   │   ├── 09-effects.test.ts          # Section 9 rules
│   │   ├── 10-rules-management.test.ts # Section 10 rules
│   │   └── 11-keywords.test.ts         # Section 11 rules
│   ├── integration/                    # Complex scenarios
│   │   ├── complete-game.test.ts       # Full game flow
│   │   ├── combat-scenarios.test.ts    # Complex combat
│   │   ├── multi-player.test.ts        # Priority handling
│   │   └── edge-cases.test.ts          # Unusual interactions
│   └── scenarios/                      # Real-world game scenarios
│       ├── beginner-game.test.ts       # Starter deck gameplay
│       ├── advanced-combos.test.ts     # Complex card interactions
│       └── tournament-cases.test.ts    # Competitive scenarios
└── src/cards/definitions/
    ├── ST01/
    │   ├── units/
    │   │   ├── 001-gundam.test.ts      # Individual card tests
    │   │   └── ...
    │   ├── pilots/
    │   │   ├── 010-amuro-ray.test.ts
    │   │   └── ...
    │   ├── commands/
    │   │   └── ...
    │   └── bases/
    │       └── ...
    ├── ST02/, ST03/, ST04/, GD01/      # Same structure per set
    └── tokens/
        └── tokens.test.ts               # Token mechanics
```

### Test Pattern Requirements

#### Basic Test Structure
```typescript
import { describe, expect, it } from "bun:test";
import { GundamTestEngine } from "~/game-engine/engines/gundam/src/testing/gundam-test-engine";
import { cardDefinition } from "~/game-engine/engines/gundam/src/cards/definitions/...";

describe("Rule/Card Name", () => {
  it("should [expected behavior]", () => {
    // Setup: Create test engine with initial board state
    const testEngine = new GundamTestEngine({
      // Player 1 zones
      battleArea: [unitCard],
      hand: [commandCard],
      resourceArea: 5,
      shieldSection: 6,
    }, {
      // Player 2 zones (opponent)
      battleArea: [opponentUnit],
      shieldSection: 6,
    });

    // Execute: Perform game actions through engine API
    testEngine.moves.playCard(commandCard.id);
    testEngine.moves.declareAttack(unitCard.id, opponentUnit.id);

    // Assert: Verify expected outcomes
    expect(testEngine.getCardModel(opponentUnit).destroyed).toBe(true);
    expect(testEngine.getFlowState().gamePhase).toBe("mainPhase");
  });
});
```

#### Testing Keyword Effects
```typescript
describe("<Repair> Keyword", () => {
  it("should recover HP at turn end", () => {
    const unitWithRepair = {...mockUnitCard, keywords: ["<Repair>"]};
    const testEngine = new GundamTestEngine({
      battleArea: [unitWithRepair],
    });

    // Damage the unit
    testEngine.moves.dealDamage(unitWithRepair.id, 3);
    expect(testEngine.getCardModel(unitWithRepair).damage).toBe(3);

    // End turn - repair should trigger
    testEngine.moves.passTurn();
    expect(testEngine.getCardModel(unitWithRepair).damage).toBe(0);
  });
});
```

#### Testing Combat Flow
```typescript
describe("Combat System", () => {
  it("should resolve complete attack with blocker", () => {
    const attacker = mockUnitCard;
    const defender = {...mockUnitCard, id: "defender"};
    const blocker = {...mockUnitCard, id: "blocker", keywords: ["<Blocker>"]};

    const testEngine = new GundamTestEngine({
      battleArea: [attacker],
      resourceArea: 5,
    }, {
      battleArea: [defender, blocker],
    });

    // Declare attack on defender
    testEngine.moves.declareAttack(attacker.id, defender.id);
    expect(testEngine.getFlowState().gameStep).toBe("blockStep");

    // Opponent blocks with blocker
    testEngine.changeActivePlayer("player_two");
    testEngine.moves.declareBlock(blocker.id, attacker.id);
    expect(testEngine.getFlowState().gameStep).toBe("actionStep");

    // Resolve combat
    testEngine.moves.passPriority();
    testEngine.changeActivePlayer("player_one");
    testEngine.moves.passPriority();

    // Verify damage dealt to blocker, not original target
    expect(testEngine.getCardModel(blocker).damage).toBeGreaterThan(0);
    expect(testEngine.getCardModel(defender).damage).toBe(0);
  });
});
```

#### Testing Rule Combinations
```typescript
describe("Resource System Rules", () => {
  it("should enforce 15 resource limit and 5 EX resource limit", () => {
    const testEngine = new GundamTestEngine({
      resourceArea: 15, // At limit
    });

    // Attempt to place 16th resource
    const result = testEngine.moves.placeResource();
    expect(result.success).toBe(false);
    expect(result.error).toContain("resource area limit");

    // Verify EX Resource limit
    const exResources = testEngine.getCardsByZone("resourceArea")
      .filter(c => c.card.id === exResourceToken.id);
    expect(exResources.length).toBeLessThanOrEqual(5);
  });
});
```

### Test Coverage Strategy

#### 1. Rule-Based Coverage
- Map each rule from LLM-RULES.md to test cases
- Validate positive cases (rule followed)
- Validate negative cases (rule violations prevented)
- Test rule interactions

#### 2. Card-Based Coverage
For each card, test:
- **Basic Mechanics**: Deploy cost, HP, AP, DP values
- **Keywords**: All keyword effects on the card
- **Unique Abilities**: Card-specific triggered/activated effects
- **Edge Cases**: Interactions with other cards
- **State Transitions**: How card affects game state

#### 3. Flow-Based Coverage
- Test each phase/step transition
- Validate priority passing
- Test segment progression
- Verify win/loss detection

#### 4. Integration Coverage
- Complete game scenarios
- Multi-card combos
- Complex combat situations
- Multiple simultaneous effects

### Test Utilities

#### Helper Functions Needed
```typescript
// Test data factories
export const createMockUnit = (overrides?: Partial<GundamitoUnitCard>) => {...};
export const createMockPilot = (overrides?: Partial<GundamitoPilotCard>) => {...};
export const createMockCommand = (overrides?: Partial<GundamitoCommandCard>) => {...};

// Assertion helpers
export const assertZoneContains = (testEngine, zone, cards) => {...};
export const assertPhaseIs = (testEngine, expectedPhase) => {...};
export const assertPriorityPlayer = (testEngine, expectedPlayer) => {...};

// Scenario builders
export const setupBasicCombat = (attackers, defenders) => {...};
export const setupPairedUnits = (units, pilots) => {...};
```

### Performance Requirements

- **Test Execution**: All tests must complete in under 5 minutes
- **Individual Test**: No single test should take more than 5 seconds
- **Deterministic**: Use seeded RNG for reproducibility
- **Parallel Execution**: Tests must be independent and parallelizable

### Continuous Integration

- Run `bun test` on every commit
- Enforce 100% pass rate (no skipped tests in main branch)
- Generate coverage reports (but don't chase metrics)
- Fail CI on any test failure

### Documentation Requirements

- Each test file has JSDoc explaining what it covers
- Complex test scenarios have inline comments
- Test naming follows "should [expected behavior]" pattern
- README in `__tests__/` explaining organization

## External Dependencies

No new external dependencies required. All testing will use:
- `bun:test` (built-in test runner)
- Existing `GundamTestEngine`
- Existing card definitions
- Existing game rules documentation
