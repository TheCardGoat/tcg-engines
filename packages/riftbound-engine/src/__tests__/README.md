# Riftbound Engine Test Suite

This directory contains comprehensive test specifications for the Riftbound game engine, organized by rule categories from the official Riftbound Core Rules.

## Table of Contents

1. [Test File Structure](#test-file-structure)
2. [Arrange-Act-Assert Pattern](#arrange-act-assert-pattern)
3. [Using RiftboundTestEngine API](#using-riftboundtestengine-api)
4. [Test Naming Conventions](#test-naming-conventions)
5. [Edge Case Identification](#edge-case-identification)
6. [Integration Test Patterns](#integration-test-patterns)
7. [When to Use `.skip()`](#when-to-use-skip)
8. [TestCardBuilder Usage](#testcardbuilder-usage)
9. [Examples from Test Files](#examples-from-test-files)

---

## Test File Structure

Tests are organized by rule category, with each file covering a specific section of the Riftbound Core Rules:

```
__tests__/
└── rules/
    ├── turn-structure.test.ts      # Rules 500-526
    ├── zones-and-card-movement.test.ts  # Rules 105-183
    ├── combat-and-scoring.test.ts  # Rules 620-633
    ├── chains-and-showdowns.test.ts # Rules 527-563
    ├── abilities.test.ts           # Rules 564-585
    ├── game-actions.test.ts        # Rules 586-619
    ├── keywords.test.ts            # Rules 712-729
    └── resources-and-deck.test.ts  # Rules 200-250, 101-103
```

### File Organization Pattern

Each test file follows this structure:

```typescript
/**
 * [Category] Tests - Rules XXX-YYY
 *
 * Comprehensive test specifications for Riftbound [category] rules.
 * Tests are organized by rule sections following TDD approach.
 *
 * NOTE: All tests are skipped pending TestEngine implementation.
 * Each test creates its own game instance via constructor parameters.
 */

import { describe, it, expect } from "bun:test";
import { RiftboundTestEngine, PLAYER_ONE, PLAYER_TWO } from "../../testing";

describe("Section X: [Category] - Rules XXX-YYY", () => {
  // ===========================================================================
  // XXX-YYY: [Subsection Name]
  // ===========================================================================

  describe("XXX-YYY: [Subsection Name]", () => {
    describe("[Specific Topic] (Rule XXX)", () => {
      it.skip("Rule XXX - should [expected behavior]", () => {
        // Test implementation
      });
    });

    describe("[Specific Topic] - Edge Cases", () => {
      it.skip("should handle [edge case description]", () => {
        // Edge case test
      });
    });
  });

  // ===========================================================================
  // Integration Tests
  // ===========================================================================

  describe("Integration: [Category] + [Other Category]", () => {
    it.skip("should [integration behavior]", () => {
      // Cross-ref: Rule YYY ([related rule])
      // Integration test
    });
  });
});
```

---

## Arrange-Act-Assert Pattern

All tests follow the **Arrange-Act-Assert (AAA)** pattern for clarity and consistency:

```typescript
it.skip("Rule 520 - should kill Units with damage >= Might", () => {
  // Arrange: Set up initial game state
  const engine = new RiftboundTestEngine({}, {}, {
    battlefields: [{
      id: "bf1",
      units: {
        [PLAYER_ONE]: [{ id: "unit1", might: 3, damage: 3 }],
      },
    }],
  });

  // Act: Execute the action being tested
  const killed = engine.cleanupKillDamagedUnits();

  // Assert: Verify the expected outcome
  expect(killed.length).toBe(1);
  expect(killed[0]?.id).toBe("unit1");
  expect(engine.getUnit("unit1")).toBeUndefined();
});
```

### Guidelines

- **Arrange**: Set up all preconditions and inputs
- **Act**: Execute the single action being tested
- **Assert**: Verify the expected outcomes
- Use comments to clearly separate each section
- Keep each section focused and minimal

---

## Using RiftboundTestEngine API

The `RiftboundTestEngine` provides a test-friendly API for setting up game states and verifying outcomes.

### Constructor

```typescript
const engine = new RiftboundTestEngine(
  playerOneState: TestPlayerState,
  playerTwoState: TestPlayerState,
  options: TestEngineOptions
);
```

### Player State Configuration

```typescript
interface TestPlayerState {
  victoryPoints?: number;  // Victory points (default: 0)
  energy?: number;         // Rune pool energy (default: 0)
  power?: Partial<Record<Domain, number>>;  // Power by domain
}

// Example
const engine = new RiftboundTestEngine(
  { victoryPoints: 5, energy: 3, power: { fury: 2 } },
  { victoryPoints: 2 },
  {}
);
```

### Game Options Configuration

```typescript
interface TestEngineOptions {
  victoryScore?: number;   // Points needed to win (default: 8)
  phase?: GamePhase;       // Current phase (default: "action")
  turnNumber?: number;     // Current turn (default: 1)
  activePlayer?: PlayerId; // Active player (default: PLAYER_ONE)
  battlefields?: TestBattlefieldConfig[];  // Battlefield setup
}

// Example
const engine = new RiftboundTestEngine({}, {}, {
  phase: "action",
  turnNumber: 3,
  activePlayer: PLAYER_TWO,
  victoryScore: 8,
});
```

### Battlefield Configuration

```typescript
interface TestBattlefieldConfig {
  id: string;
  controller?: PlayerId | null;
  contested?: boolean;
  contestedBy?: PlayerId;
  units?: Record<PlayerId, TestUnitConfig[]>;
}

interface TestUnitConfig {
  id?: string;
  might?: number;
  damage?: number;
  exhausted?: boolean;
  combatRole?: CombatRole;
  hidden?: boolean;
}

// Example
const engine = new RiftboundTestEngine({}, {}, {
  battlefields: [{
    id: "bf1",
    controller: PLAYER_ONE,
    units: {
      [PLAYER_ONE]: [
        { id: "unit1", might: 4, damage: 2, exhausted: true },
        { id: "unit2", might: 3 },
      ],
      [PLAYER_TWO]: [
        { id: "unit3", might: 5, combatRole: "defender" },
      ],
    },
  }],
});
```

### Key Getter Methods

Always use getter methods for assertions - never access internal state directly:

```typescript
// Player state
engine.getVictoryPoints(playerId)
engine.getEnergy(playerId)
engine.getPower(playerId, domain)
engine.getRunePool(playerId)

// Turn state
engine.getCurrentPhase()
engine.getActivePlayer()
engine.getTurnNumber()
engine.isGameOver()
engine.getWinner()

// Game state
engine.getTurnState()      // "neutral" | "showdown"
engine.getChainState()     // "open" | "closed"
engine.getCombinedState()  // { turnState, chainState }
engine.isInShowdown()
engine.hasChain()
engine.getChain()

// Priority and Focus
engine.getPriorityHolder()
engine.hasPriority(playerId)
engine.getFocusHolder()
engine.hasFocus(playerId)

// Units
engine.getUnit(unitId)
engine.getAllUnits()
engine.getUnitsAtBattlefield(battlefieldId)
engine.getUnitsOwnedBy(playerId)
engine.getExhaustedUnits(playerId)

// Battlefields
engine.getBattlefield(battlefieldId)
engine.getAllBattlefields()
engine.hasOpposingUnits(battlefieldId)
engine.getBattlefieldController(battlefieldId)
engine.isBattlefieldContested(battlefieldId)
engine.hasPendingCombat(battlefieldId)

// Zones
engine.getZoneContents(playerId, zone)
engine.getHandSize(playerId)
engine.getDeckSize(playerId)
engine.getTrashSize(playerId)

// Scoring
engine.wasScoredThisTurn(playerId, battlefieldId)
```

### Key Action Methods

```typescript
// Turn management
engine.advancePhase()
engine.endTurn()

// State management
engine.startShowdown()
engine.endShowdown()

// Chain management
engine.addToChain(item)
engine.resolveChainItem()
engine.clearChain()

// Priority and Focus
engine.setPriorityHolder(playerId)
engine.passPriority()
engine.setFocusHolder(playerId)

// Resources
engine.addVictoryPoints(playerId, points)
engine.setEnergy(playerId, energy)
engine.setPower(playerId, domain, power)
engine.emptyRunePool(playerId)

// Units
engine.readyAllUnits(playerId)
engine.clearAllDamage()

// Cleanup
engine.cleanupKillDamagedUnits()
engine.cleanupRemoveCombatStatus()
engine.cleanupMarkPendingCombats()
engine.performCleanup()

// Zones
engine.addToZone(playerId, zone, card)
engine.removeFromZone(playerId, zone, cardId)
engine.moveCard(playerId, fromZone, toZone, cardId)

// Scoring
engine.markAsScored(playerId, battlefieldId)
engine.markPendingCombat(battlefieldId)
engine.clearPendingCombat(battlefieldId)
```

---

## Test Naming Conventions

### Rule Number Citations

Always include the rule number in test names for traceability:

```typescript
// Good - includes rule number
it.skip("Rule 520 - should kill Units with damage >= Might", () => {});
it.skip("Rule 515.1 - should ready all exhausted game objects at start of turn", () => {});

// Bad - missing rule number
it.skip("should kill damaged units", () => {});
```

### Descriptive Names

Test names should clearly describe the expected behavior:

```typescript
// Good - clear expected behavior
it.skip("Rule 508 - should be in Showdown state during combat", () => {});
it.skip("Rule 513 - should retain Focus when passing Priority", () => {});

// Bad - vague or unclear
it.skip("Rule 508 - showdown test", () => {});
it.skip("focus works", () => {});
```

### Edge Case Naming

Edge cases should describe the specific scenario:

```typescript
// Good - specific edge case
it.skip("Rule 520 - should handle simultaneous deaths", () => {});
it.skip("should not allow advancing past cleanup phase", () => {});

// Bad - generic
it.skip("edge case 1", () => {});
```

---

## Edge Case Identification

When writing tests, identify edge cases by considering:

### Boundary Conditions

- Zero values (0 damage, 0 energy, 0 units)
- Maximum values (victory score reached, full hand)
- Exactly at threshold (damage = might, not damage > might)

### State Transitions

- Entering/exiting states (Neutral ↔ Showdown, Open ↔ Closed)
- Phase boundaries (end of phase, start of phase)
- Turn boundaries (turn end, turn start)

### Multiple Entities

- Simultaneous effects (multiple units dying)
- Multiple players affected
- Multiple battlefields involved

### Error Conditions

- Invalid operations (advancing past cleanup)
- Missing prerequisites (no priority holder)
- Game over state

### Example Edge Cases by Category

```typescript
// Turn Structure
- Turn cycling back to first player
- Game ending mid-turn
- Phase advancement at cleanup

// States
- Nested state changes
- State during chain resolution
- Multiple chain items

// Priority/Focus
- Priority cycling
- Focus transfer
- No priority holder

// Cleanup
- Simultaneous deaths
- Overkill damage
- Empty battlefields after cleanup
```

---

## Integration Test Patterns

Integration tests verify that multiple rule systems work together correctly.

### Cross-Reference Pattern

Always include cross-references to related rules:

```typescript
describe("Integration: Turn Structure + Combat", () => {
  it.skip("should transition to Showdown state when combat begins", () => {
    // Cross-ref: Rule 620 (Combat initiation)
    const engine = new RiftboundTestEngine({}, {}, {
      phase: "action",
      battlefields: [{
        id: "bf1",
        units: {
          [PLAYER_ONE]: [{ id: "p1unit" }],
          [PLAYER_TWO]: [{ id: "p2unit" }],
        },
      }],
    });

    engine.startShowdown();

    expect(engine.getTurnState()).toBe("showdown");
  });
});
```

### Common Integration Scenarios

1. **Turn Structure + Combat**: State transitions during combat
2. **Turn Structure + Scoring**: Victory point accumulation
3. **Turn Structure + Chain**: Chain resolution timing
4. **Turn Structure + Zones**: Card movement during phases
5. **Turn Structure + Resources**: Rune pool management
6. **Combat + Cleanup**: Damage resolution and unit death
7. **Chain + Priority**: Priority passing during resolution

---

## When to Use `.skip()`

### TDD Workflow

This project follows Test-Driven Development (TDD):

1. **Write failing tests first** - All new tests start as `.skip()`
2. **Implement to pass** - Unskip tests one at a time during implementation
3. **Refactor** - Clean up code while keeping tests passing

### When to Skip

```typescript
// Skip: Test defines behavior not yet implemented
it.skip("Rule 520 - should kill Units with damage >= Might", () => {});

// Don't skip: Test verifies existing behavior
it("Rule 503 - should define phases in rigid order", () => {
  expect(PHASE_ORDER).toEqual([...]);
});
```

### Unskipping Tests

When implementing a feature:

1. Find the relevant skipped test
2. Remove `.skip` from the test
3. Run the test (it should fail - "red")
4. Implement the feature
5. Run the test (it should pass - "green")
6. Refactor if needed
7. Repeat for next test

---

## TestCardBuilder Usage

For tests requiring specific card configurations, use `TestCardBuilder`:

```typescript
import { TestCardBuilder, testCardBuilder } from "../../testing";

// Using the default instance
const unit = testCardBuilder.createTestUnit({
  might: 4,
  domain: "fury",
  keywords: ["Assault 2", "Tank"],
});

// Creating a new builder instance
const builder = new TestCardBuilder();

// Create a unit
const warrior = builder.createTestUnit({
  id: "custom-unit",
  name: "Test Warrior",
  might: 5,
  energyCost: 3,
  domain: "fury",
  powerCost: ["fury", "fury"],
  keywords: ["Assault 2", "Tank"],
  abilities: ["When I attack, draw 1"],
  tags: ["Warrior", "Human"],
});

// Create a spell
const bolt = builder.createTestSpell({
  id: "custom-spell",
  name: "Lightning Bolt",
  cost: { energy: 2, power: ["fury"] },
  timing: "action",
  effect: "Deal 3 damage to a unit",
});

// Create a battlefield
const ruins = builder.createTestBattlefield({
  id: "custom-bf",
  name: "Ancient Ruins",
  abilities: ["When you conquer, draw 1"],
});

// Reset counters for consistent IDs
builder.reset();
```

### When to Use TestCardBuilder

- **Use TestCardBuilder** when you need specific card properties for a test
- **Prefer real cards** from `@tcg/riftbound-cards` when available
- **Use minimal configuration** - only specify what the test needs

---

## Examples from Test Files

### Basic Test Example

```typescript
it.skip("Rule 502 - should continue play cyclically until victory", () => {
  // Arrange: Game with player1 at 7 victory points (victory at 8)
  const engine = new RiftboundTestEngine(
    { victoryPoints: 7 },
    { victoryPoints: 0 },
    { victoryScore: 8 },
  );

  // Act: Add final point to trigger victory
  engine.addVictoryPoints(PLAYER_ONE, 1);

  // Assert: Game should detect victory condition
  expect(engine.isGameOver()).toBe(true);
  expect(engine.getVictoryPoints(PLAYER_ONE)).toBe(8);
});
```

### Complex Setup Example

```typescript
it.skip("Rule 520 - should handle simultaneous deaths", () => {
  // Arrange: Multiple units with lethal damage
  const engine = new RiftboundTestEngine({}, {}, {
    battlefields: [{
      id: "bf1",
      units: {
        [PLAYER_ONE]: [{ id: "unit1", might: 3, damage: 3 }],
        [PLAYER_TWO]: [{ id: "unit2", might: 2, damage: 4 }],
      },
    }],
  });

  // Act: Perform cleanup
  const killed = engine.cleanupKillDamagedUnits();

  // Assert: All units die simultaneously
  expect(killed.length).toBe(2);
  expect(engine.getUnit("unit1")).toBeUndefined();
  expect(engine.getUnit("unit2")).toBeUndefined();
});
```

### Integration Test Example

```typescript
it.skip("should score Hold during Beginning Phase", () => {
  // Arrange: Player controls battlefield at start of turn
  // Cross-ref: Rule 630 (Hold scoring)
  const engine = new RiftboundTestEngine(
    { victoryPoints: 0 },
    { victoryPoints: 0 },
    {
      phase: "beginning",
      activePlayer: PLAYER_ONE,
      battlefields: [{
        id: "bf1",
        controller: PLAYER_ONE,
      }],
    },
  );

  // Act: Score for holding
  engine.addVictoryPoints(PLAYER_ONE, 1);
  engine.markAsScored(PLAYER_ONE, "bf1");

  // Assert: Victory point gained
  expect(engine.getVictoryPoints(PLAYER_ONE)).toBe(1);
  expect(engine.wasScoredThisTurn(PLAYER_ONE, "bf1")).toBe(true);
});
```

### State Transition Example

```typescript
it.skip("Rule 510 - should correctly identify all four combined states", () => {
  const engine = new RiftboundTestEngine({}, {});

  // Neutral Open (default)
  let state = engine.getCombinedState();
  expect(state.turnState).toBe("neutral");
  expect(state.chainState).toBe("open");

  // Neutral Closed
  engine.addToChain({ id: "spell1", controllerId: PLAYER_ONE, type: "spell" });
  state = engine.getCombinedState();
  expect(state.turnState).toBe("neutral");
  expect(state.chainState).toBe("closed");

  // Clear chain and start showdown
  engine.clearChain();
  engine.startShowdown();

  // Showdown Open
  state = engine.getCombinedState();
  expect(state.turnState).toBe("showdown");
  expect(state.chainState).toBe("open");

  // Showdown Closed
  engine.addToChain({ id: "ability1", controllerId: PLAYER_ONE, type: "ability" });
  state = engine.getCombinedState();
  expect(state.turnState).toBe("showdown");
  expect(state.chainState).toBe("closed");
});
```

---

## Contributing New Tests

When adding new tests:

1. **Identify the rule** - Find the specific rule number in the Core Rules
2. **Choose the right file** - Add to the appropriate category file
3. **Follow the pattern** - Use AAA pattern with rule citations
4. **Add edge cases** - Consider boundary conditions and error states
5. **Include integration tests** - Test interactions with other systems
6. **Use `.skip()`** - New tests should be skipped until implemented
7. **Document cross-references** - Note related rules in comments

### Checklist for New Tests

- [ ] Rule number in test name
- [ ] Clear Arrange-Act-Assert structure
- [ ] Uses RiftboundTestEngine API (no direct state access)
- [ ] Edge cases identified and tested
- [ ] Integration tests for cross-system behavior
- [ ] Test is marked with `.skip()`
- [ ] Cross-references documented in comments

---

## Resources

- **Riftbound Core Rules**: `.claude/skills/riftbound-rules/`
- **Test Engine Source**: `src/testing/riftbound-test-engine.ts`
- **Card Builder Source**: `src/testing/test-card-builder.ts`
- **Type Definitions**: `@tcg/riftbound-types`
- **Card Definitions**: `@tcg/riftbound-cards`
