# Riftbound Engine Test Suite

Comprehensive TDD test specifications for the Riftbound game engine, organized by rule sections from the official Riftbound Core Rules (effective June 2, 2025).

## Overview

This test suite serves dual purposes:

1. **Specification** - Tests define expected behavior before implementation
2. **Validation** - Tests verify implementation correctness

All tests follow a TDD (Test-Driven Development) approach where tests are written first as specifications using `it.skip()`, then unskipped one at a time during implementation.

### Relationship to Official Rules

Tests reference the official Riftbound Core Rules documented in `.claude/skills/riftbound-rules/`. Rule numbers in test names (e.g., "Rule 503") correspond directly to the official rules document, ensuring traceability and correctness.

## Test File Structure

### File Naming Convention

Test files follow the pattern `{category}.test.ts`:

- `turn-structure.test.ts` - Rules 500-526
- `game-actions.test.ts` - Rules 586-619

### File Header Format

Each test file begins with a documentation header:

```typescript
/**
 * {Category} Tests - Rules XXX-YYY
 *
 * Comprehensive test specifications for Riftbound {category} rules.
 * Tests are organized by rule sections following TDD approach.
 *
 * NOTE: All tests are skipped pending TestEngine implementation.
 * Each test creates its own game instance via constructor parameters.
 *
 * Rule Sections:
 * - XXX-YYY: Subcategory 1
 * - XXX-YYY: Subcategory 2
 */
```

### Organizational Structure

Tests use nested `describe` blocks for organization:

```
Section X: Category Name - Rules XXX-YYY
├── XXX-YYY: Subcategory
│   ├── Topic Name (Rules XXX-YYY)
│   │   ├── Rule XXX - should...
│   │   └── Rule YYY - should...
│   └── Topic Name - Edge Cases
│       └── Rule XXX - should handle...
├── Integration: Category + Related Category
│   └── should test cross-category behavior
└── Edge Cases
    └── should handle boundary conditions
```

### Example Structure

```typescript
describe("Section 5: Turn Structure - Rules 500-526", () => {
  describe("501-506: The Turn", () => {
    describe("Basic Flow (Rules 502-506)", () => {
      it.skip("Rule 502 - should continue play cyclically until victory", () => {
        // Test implementation
      });
    });

    describe("Basic Flow - Edge Cases", () => {
      it.skip("Rule 502 - should detect victory when both players reach victory score simultaneously", () => {
        // Edge case test
      });
    });
  });

  describe("Integration: Full Turn Cycle", () => {
    it.skip("should complete a full turn cycle through all phases", () => {
      // Integration test
    });
  });
});
```

## Test Naming Conventions

### Rule Number Prefix

Always include the rule number at the start of the test name:

```typescript
// Good
it.skip("Rule 503 - should advance through phases in order", () => {});
it.skip("Rule 512 - should grant priority during Neutral Open in Action Phase", () => {});

// Bad
it.skip("should advance through phases in order", () => {});
it.skip("phases should be in order", () => {});
```

### Descriptive Behavior

Use clear, specific descriptions of the expected behavior:

```typescript
// Good - specific about conditions and outcomes
it.skip("Rule 520 - should kill Units with damage >= Might", () => {});
it.skip("Rule 503 - should not allow advancing past cleanup phase", () => {});

// Bad - vague or unclear
it.skip("Rule 520 - should handle damage", () => {});
it.skip("Rule 503 - phase test", () => {});
```

### Edge Case Naming

Edge case tests should describe the specific scenario:

```typescript
// Good
it.skip("Rule 502 - should detect victory when both players reach victory score simultaneously", () => {});
it.skip("Rule 509 - should transition from Closed to Open when chain resolves completely", () => {});

// Bad
it.skip("Rule 502 - edge case", () => {});
it.skip("Rule 509 - special scenario", () => {});
```

## Arrange-Act-Assert Pattern

All tests follow the three-phase AAA structure with explicit comments.

### Arrange Phase

Set up the initial state with a descriptive comment:

```typescript
it.skip("Rule 502 - should continue play cyclically until victory", () => {
  // Arrange: Game with player1 at 7 victory points (victory at 8)
  const engine = new RiftboundTestEngine(
    { victoryPoints: 7 },
    { victoryPoints: 0 },
    { victoryScore: 8 },
  );

  // ...
});
```

Common arrange patterns:

```typescript
// Basic game setup
const engine = new RiftboundTestEngine({}, {});

// Player state configuration
const engine = new RiftboundTestEngine(
  { victoryPoints: 5, energy: 3 },  // Player 1
  { victoryPoints: 2 },              // Player 2
);

// Game options
const engine = new RiftboundTestEngine({}, {}, {
  phase: "action",
  turnNumber: 1,
  activePlayer: PLAYER_ONE,
});

// Battlefield with units
const engine = new RiftboundTestEngine({}, {}, {
  battlefields: [
    {
      id: "bf1",
      controller: PLAYER_ONE,
      units: {
        [PLAYER_ONE]: [{ id: "unit1", might: 3, damage: 1 }],
        [PLAYER_TWO]: [{ id: "unit2", might: 2 }],
      },
    },
  ],
});
```

### Act Phase

Execute the action being tested:

```typescript
// Explicit action
// Act: Add final point to trigger victory
engine.addVictoryPoints(PLAYER_ONE, 1);

// Multiple sequential actions
// Act: Advance through each phase
engine.advancePhase();
engine.advancePhase();
engine.advancePhase();

// Implicit action (testing initial state)
// No Act phase needed - testing initial state
```

### Assert Phase

Verify the expected outcomes using getter methods:

```typescript
// Assert: Game should detect victory condition
expect(engine.isGameOver()).toBe(true);
expect(engine.getVictoryPoints(PLAYER_ONE)).toBe(8);

// Multiple assertions for complex behaviors
// Assert: Player 2 becomes active player, phase resets
expect(engine.getActivePlayer()).toBe(PLAYER_TWO);
expect(engine.getCurrentPhase()).toBe("awaken");
```

## Using RiftboundTestEngine API

The `RiftboundTestEngine` class provides a test-friendly wrapper for game state manipulation and inspection.

### Constructor Patterns

```typescript
import { PLAYER_ONE, PLAYER_TWO, RiftboundTestEngine } from "../../testing";

// Basic setup (defaults)
const engine = new RiftboundTestEngine({}, {});

// Player state configuration
const engine = new RiftboundTestEngine(
  { victoryPoints: 5, energy: 3, power: { fury: 2 } },  // Player 1
  { victoryPoints: 2 },                                  // Player 2
);

// Game options
const engine = new RiftboundTestEngine({}, {}, {
  phase: "action",
  turnNumber: 1,
  activePlayer: PLAYER_ONE,
  victoryScore: 8,
});

// Full battlefield setup
const engine = new RiftboundTestEngine({}, {}, {
  battlefields: [
    {
      id: "bf1",
      controller: PLAYER_ONE,
      contested: false,
      units: {
        [PLAYER_ONE]: [
          { id: "unit1", might: 3, damage: 1, exhausted: false },
          { id: "unit2", might: 5, combatRole: "attacker" },
        ],
        [PLAYER_TWO]: [
          { id: "unit3", might: 4, damage: 2 },
        ],
      },
    },
  ],
});
```

### State Inspection (Getters)

Use getter methods exclusively for assertions - never access internal state directly.

**Player State:**
```typescript
engine.getVictoryPoints(PLAYER_ONE)  // number
engine.getEnergy(PLAYER_ONE)         // number
engine.getPower(PLAYER_ONE, "fury")  // number
engine.getRunePool(PLAYER_ONE)       // RunePool object
```

**Turn State:**
```typescript
engine.getCurrentPhase()    // GamePhase
engine.getActivePlayer()    // PlayerId
engine.getTurnNumber()      // number
engine.isGameOver()         // boolean
engine.getWinner()          // PlayerId | undefined
```

**Game State:**
```typescript
engine.getTurnState()       // "neutral" | "showdown"
engine.getChainState()      // "open" | "closed"
engine.getCombinedState()   // { turnState, chainState }
engine.isInShowdown()       // boolean
engine.hasChain()           // boolean
engine.getChain()           // readonly ChainItem[]
```

**Units:**
```typescript
engine.getUnit("unit1")                    // TestUnit | undefined
engine.getAllUnits()                       // TestUnit[]
engine.getUnitsAtBattlefield("bf1")        // TestUnit[]
engine.getUnitsOwnedBy(PLAYER_ONE)         // TestUnit[]
engine.getExhaustedUnits(PLAYER_ONE)       // TestUnit[]
engine.isUnitExhausted("unit1")            // boolean
engine.isUnitStunned("unit1")              // boolean
engine.isUnitBuffed("unit1")               // boolean
engine.getUnitMight("unit1")               // number
engine.getEffectiveMight("unit1")          // number (0 if stunned)
engine.getDamage("unit1")                  // number
engine.shouldUnitDie("unit1")              // boolean
```

**Battlefields:**
```typescript
engine.getBattlefield("bf1")               // BattlefieldState | undefined
engine.getAllBattlefields()                // BattlefieldState[]
engine.hasOpposingUnits("bf1")             // boolean
engine.getBattlefieldController("bf1")     // PlayerId | null
engine.isBattlefieldContested("bf1")       // boolean
engine.hasPendingCombat("bf1")             // boolean
```

**Priority/Focus:**
```typescript
engine.getPriorityHolder()     // PlayerId | null
engine.getFocusHolder()        // PlayerId | null
engine.hasPriority(PLAYER_ONE) // boolean
engine.hasFocus(PLAYER_ONE)    // boolean
```

**Zones:**
```typescript
engine.getZoneContents(PLAYER_ONE, "hand")  // CardObject[]
engine.getHandSize(PLAYER_ONE)              // number
engine.getDeckSize(PLAYER_ONE)              // number
engine.getTrashSize(PLAYER_ONE)             // number
```

### State Manipulation (Actions)

**Phase Management:**
```typescript
engine.advancePhase()  // GamePhase | null
engine.endTurn()       // void
```

**Turn State:**
```typescript
engine.startShowdown()  // void
engine.endShowdown()    // void
```

**Chain:**
```typescript
engine.addToChain({ id: "spell1", controllerId: PLAYER_ONE, type: "spell" })
engine.resolveChainItem()  // ChainItem | undefined
engine.clearChain()        // void
```

**Priority:**
```typescript
engine.setPriorityHolder(PLAYER_ONE)  // void
engine.passPriority()                 // void
```

**Resources:**
```typescript
engine.addEnergy(PLAYER_ONE, 3)           // void
engine.addPower(PLAYER_ONE, "fury", 2)    // void
engine.spendEnergy(PLAYER_ONE, 2)         // boolean
engine.spendPower(PLAYER_ONE, "fury", 1)  // boolean
engine.emptyRunePool(PLAYER_ONE)          // void
engine.canAfford(PLAYER_ONE, { energy: 3, power: { fury: 1 } })  // boolean
```

**Units:**
```typescript
engine.readyAllUnits(PLAYER_ONE)  // void
engine.clearAllDamage()           // void
engine.exhaustUnit("unit1")       // boolean
engine.readyUnit("unit1")         // boolean
engine.stunUnit("unit1")          // boolean
engine.unstunUnit("unit1")        // boolean
engine.buffUnit("unit1")          // boolean
engine.unbuffUnit("unit1")        // boolean
engine.killUnit("unit1")          // boolean
engine.addDamage("unit1", 2)      // number
engine.moveUnit("unit1", "bf2")   // boolean
engine.recallUnit("unit1")        // boolean
```

**Cleanup:**
```typescript
engine.performCleanup()              // void
engine.cleanupKillDamagedUnits()     // TestUnit[]
engine.cleanupRemoveCombatStatus()   // void
engine.cleanupMarkPendingCombats()   // void
```

**Scoring:**
```typescript
engine.addVictoryPoints(PLAYER_ONE, 1)       // void
engine.markAsScored(PLAYER_ONE, "bf1")       // void
engine.wasScoredThisTurn(PLAYER_ONE, "bf1")  // boolean
```

**Zones:**
```typescript
engine.addToZone(PLAYER_ONE, "hand", { id: "card1", name: "Test Card" })
engine.removeFromZone(PLAYER_ONE, "hand", "card1")  // CardObject | undefined
engine.moveCard(PLAYER_ONE, "hand", "trash", "card1")  // boolean
engine.clearZone(PLAYER_ONE, "hand")  // void
```

## Edge Case Identification

When writing tests, consider these categories of edge cases:

### Boundary Conditions
- Phase transitions (first/last phase)
- Empty/full states (empty deck, full hand)
- Zero values (0 damage, 0 energy)
- Maximum values (victory score reached)

```typescript
it.skip("Rule 503 - should not allow advancing past cleanup phase", () => {
  const engine = new RiftboundTestEngine({}, {}, { phase: "cleanup" });
  const result = engine.advancePhase();
  expect(result).toBeNull();
  expect(engine.getCurrentPhase()).toBe("cleanup");
});
```

### Invalid Operations
- Actions during wrong phase
- Actions without priority
- Actions on opponent's turn
- Actions in wrong game state

```typescript
it.skip("Rule 504 - should not allow game actions during game over state", () => {
  const engine = new RiftboundTestEngine(
    { victoryPoints: 8 },
    { victoryPoints: 0 },
    { victoryScore: 8 },
  );
  expect(engine.isGameOver()).toBe(true);
  // Game state should be frozen
});
```

### Simultaneous Effects
- Both players reaching victory score
- Multiple units dying at once
- Multiple triggers at same time

```typescript
it.skip("Rule 502 - should detect victory when both players reach victory score simultaneously", () => {
  const engine = new RiftboundTestEngine(
    { victoryPoints: 7 },
    { victoryPoints: 7 },
    { victoryScore: 8 },
  );
  engine.addVictoryPoints(PLAYER_ONE, 1);
  engine.addVictoryPoints(PLAYER_TWO, 1);
  expect(engine.isGameOver()).toBe(true);
});
```

### State Combinations
- Neutral Open, Neutral Closed, Showdown Open, Showdown Closed
- Exhausted + Stunned units
- Contested + Controlled battlefields

```typescript
it.skip("Rule 510 - should correctly identify all four combined states", () => {
  const engine = new RiftboundTestEngine({}, {});
  
  // Test all four state combinations
  let state = engine.getCombinedState();
  expect(state.turnState).toBe("neutral");
  expect(state.chainState).toBe("open");
  
  engine.addToChain({ id: "spell1", controllerId: PLAYER_ONE, type: "spell" });
  state = engine.getCombinedState();
  expect(state.turnState).toBe("neutral");
  expect(state.chainState).toBe("closed");
  
  // ... continue for all combinations
});
```

### Rule Interactions
- Priority during chain resolution
- Focus retention when passing priority
- Cleanup after chain item resolves

```typescript
it.skip("Rule 513 - should retain Focus when passing Priority", () => {
  const engine = new RiftboundTestEngine({}, {});
  engine.startShowdown();
  engine.setFocusHolder(PLAYER_ONE);
  engine.setPriorityHolder(PLAYER_ONE);
  
  engine.passPriority();
  
  expect(engine.hasFocus(PLAYER_ONE)).toBe(true);
  expect(engine.hasPriority(PLAYER_TWO)).toBe(true);
});
```

## Integration Test Patterns

Integration tests verify behavior across multiple rule categories.

### Placement

Place integration tests at the end of the relevant test file:

```typescript
describe("Section 5: Turn Structure - Rules 500-526", () => {
  // ... rule-specific tests ...

  describe("Integration: Full Turn Cycle", () => {
    it.skip("should complete a full turn cycle through all phases", () => {
      // Test complete workflow
    });
  });

  describe("Integration: Turn Structure + Combat", () => {
    it.skip("should transition to Showdown state when combat begins", () => {
      // Cross-ref: Rule 620 (Combat initiation)
    });
  });
});
```

### Cross-References

Include comments referencing related rule categories:

```typescript
it.skip("should transition to Showdown state when combat begins", () => {
  // Arrange: Battlefield with opposing units during Action Phase
  // Cross-ref: Rule 620 (Combat initiation)
  const engine = new RiftboundTestEngine({}, {}, {
    phase: "action",
    battlefields: [
      {
        id: "bf1",
        units: {
          [PLAYER_ONE]: [{ id: "p1unit" }],
          [PLAYER_TWO]: [{ id: "p2unit" }],
        },
      },
    ],
  });

  engine.startShowdown();

  expect(engine.getTurnState()).toBe("showdown");
  expect(engine.isInShowdown()).toBe(true);
});
```

### Realistic Scenarios

Test complete game workflows:

```typescript
it.skip("should handle multiple complete turns", () => {
  const engine = new RiftboundTestEngine({}, {}, {
    phase: "awaken",
    turnNumber: 1,
    activePlayer: PLAYER_ONE,
  });

  // Complete two full turns
  for (let turn = 0; turn < 2; turn++) {
    for (let i = 0; i < 7; i++) {
      engine.advancePhase();
    }
    engine.endTurn();
  }

  expect(engine.getTurnNumber()).toBe(3);
  expect(engine.getActivePlayer()).toBe(PLAYER_ONE);
  expect(engine.getCurrentPhase()).toBe("awaken");
});
```

## Using .skip() for TDD

### Purpose

All tests start with `it.skip()` to define requirements without running them:

```typescript
it.skip("Rule 503 - should advance through phases in order", () => {
  // Test defines expected behavior
  // Will be unskipped during implementation
});
```

### TDD Workflow

1. **Write Test** - Create test with `it.skip()` defining expected behavior
2. **Unskip** - Remove `.skip()` when ready to implement
3. **Red** - Run test, verify it fails (no implementation yet)
4. **Green** - Implement minimum code to pass
5. **Refactor** - Clean up while keeping tests green
6. **Repeat** - Move to next test

### Benefits

- Tests serve as executable specifications
- Full test suite provides implementation roadmap
- Prevents accidental test execution before implementation
- Clear visibility of remaining work

## Test Organization by Rule Category

| File | Rules | Description |
|------|-------|-------------|
| `turn-structure.test.ts` | 500-526 | Turn phases, states, priority, focus, cleanups |
| `game-actions.test.ts` | 586-619 | Actions, movement, recalls |
| `resources-and-deck-construction.test.ts` | 100-127, 156-161, 606 | Resources, runes, deck construction |

### Planned Test Files

Additional test files may be created for:

- `combat-and-scoring.test.ts` - Rules 620-633
- `abilities.test.ts` - Rules 564-585
- `keywords.test.ts` - Rules 712-729
- `chains-and-showdowns.test.ts` - Rules 527-563
- `zones-and-movement.test.ts` - Rules 105-183
- `resources.test.ts` - Rune and resource rules
- `deck-construction.test.ts` - Rules 100-127

## Contributor Guide

### Step-by-Step: Writing New Tests

1. **Choose Rule Category**
   - Identify the rule section you're testing
   - Create or open the appropriate test file

2. **Add File Header** (if new file)
   ```typescript
   /**
    * {Category} Tests - Rules XXX-YYY
    *
    * Comprehensive test specifications for Riftbound {category} rules.
    * Tests are organized by rule sections following TDD approach.
    *
    * NOTE: All tests are skipped pending TestEngine implementation.
    */
   ```

3. **Create Describe Blocks**
   ```typescript
   describe("Section X: Category - Rules XXX-YYY", () => {
     describe("XXX-YYY: Subcategory", () => {
       describe("Topic (Rules XXX-YYY)", () => {
         // Tests go here
       });
     });
   });
   ```

4. **Write Test with Rule Number**
   ```typescript
   it.skip("Rule XXX - should {expected behavior}", () => {
     // Arrange: {description}
     const engine = new RiftboundTestEngine({}, {});

     // Act: {action}
     engine.someAction();

     // Assert: {expected outcome}
     expect(engine.someGetter()).toBe(expectedValue);
   });
   ```

5. **Add Edge Cases**
   ```typescript
   describe("Topic - Edge Cases", () => {
     it.skip("Rule XXX - should handle {edge case}", () => {
       // Test edge case
     });
   });
   ```

6. **Add Integration Tests**
   ```typescript
   describe("Integration: Category + Related Category", () => {
     it.skip("should {cross-category behavior}", () => {
       // Cross-ref: Rule YYY (related rule)
       // Test integration
     });
   });
   ```

7. **Use `it.skip()` for All Tests**
   - All new tests must use `it.skip()`
   - Tests are unskipped during implementation

8. **Reference Official Rules**
   - Consult `.claude/skills/riftbound-rules/` for rule details
   - Include rule numbers in test names
   - Add cross-references for related rules

## Examples from Turn Structure Tests

### Basic Flow Test

```typescript
it.skip("Rule 503 - should advance through phases in order", () => {
  // Arrange: Game starting at awaken phase
  const engine = new RiftboundTestEngine({}, {}, { phase: "awaken" });

  // Act & Assert: Advance through each phase
  expect(engine.getCurrentPhase()).toBe("awaken");
  engine.advancePhase();
  expect(engine.getCurrentPhase()).toBe("beginning");
  engine.advancePhase();
  expect(engine.getCurrentPhase()).toBe("channel");
  engine.advancePhase();
  expect(engine.getCurrentPhase()).toBe("draw");
  engine.advancePhase();
  expect(engine.getCurrentPhase()).toBe("action");
  engine.advancePhase();
  expect(engine.getCurrentPhase()).toBe("ending");
  engine.advancePhase();
  expect(engine.getCurrentPhase()).toBe("cleanup");
});
```

### Edge Case Test

```typescript
it.skip("Rule 502 - should detect victory when both players reach victory score simultaneously", () => {
  // Arrange: Both players at 7 victory points
  const engine = new RiftboundTestEngine(
    { victoryPoints: 7 },
    { victoryPoints: 7 },
    { victoryScore: 8 },
  );

  // Act: Both players gain a point (simulating simultaneous scoring)
  engine.addVictoryPoints(PLAYER_ONE, 1);
  engine.addVictoryPoints(PLAYER_TWO, 1);

  // Assert: Game is over (first to reach wins per turn order)
  expect(engine.isGameOver()).toBe(true);
  expect(engine.getVictoryPoints(PLAYER_ONE)).toBe(8);
  expect(engine.getVictoryPoints(PLAYER_TWO)).toBe(8);
});
```

### Integration Test

```typescript
it.skip("should complete a full turn cycle through all phases", () => {
  // Arrange: Game starting at awaken
  const engine = new RiftboundTestEngine({}, {}, {
    phase: "awaken",
    turnNumber: 1,
    activePlayer: PLAYER_ONE,
  });

  // Act: Advance through all phases
  expect(engine.getCurrentPhase()).toBe("awaken");
  engine.advancePhase();
  expect(engine.getCurrentPhase()).toBe("beginning");
  engine.advancePhase();
  expect(engine.getCurrentPhase()).toBe("channel");
  engine.advancePhase();
  expect(engine.getCurrentPhase()).toBe("draw");
  engine.advancePhase();
  expect(engine.getCurrentPhase()).toBe("action");
  engine.advancePhase();
  expect(engine.getCurrentPhase()).toBe("ending");
  engine.advancePhase();
  expect(engine.getCurrentPhase()).toBe("cleanup");

  // End turn
  engine.endTurn();

  // Assert: Turn completes, next player becomes active
  expect(engine.getActivePlayer()).toBe(PLAYER_TWO);
  expect(engine.getCurrentPhase()).toBe("awaken");
  expect(engine.getTurnNumber()).toBe(2);
});
```

## References

- **Official Rules**: `.claude/skills/riftbound-rules/`
- **Test Engine API**: `packages/riftbound-engine/src/testing/riftbound-test-engine.ts`
- **Turn Structure Tests**: `packages/riftbound-engine/src/__tests__/rules/turn-structure.test.ts`
- **Game Actions Tests**: `packages/riftbound-engine/src/__tests__/rules/game-actions.test.ts`
- **Resources Tests**: `packages/riftbound-engine/src/__tests__/rules/resources-and-deck-construction.test.ts`

## Cross-Category Integration Tests

Integration tests verify behavior across multiple rule categories. They are essential for ensuring the game engine handles complex interactions correctly.

### Integration Test Categories

| Category | Rules | Description |
|----------|-------|-------------|
| Turn Structure + Combat | 500-526, 620-633 | State transitions during combat |
| Turn Structure + Scoring | 500-526, 629-633 | Victory point accumulation |
| Turn Structure + Chain | 500-526, 532-544 | Chain resolution timing |
| Turn Structure + Zones | 500-526, 105-183 | Card movement during phases |
| Turn Structure + Resources | 500-526, 156-161 | Rune pool management |
| Turn Structure + Game Actions | 500-526, 586-619 | Action timing and restrictions |
| Turn Structure + Abilities | 500-526, 564-585 | Triggered ability timing |
| Turn Structure + Keywords | 500-526, 712-729 | Keyword timing restrictions |
| Turn Structure + Movement | 500-526, 608-615 | Movement and cleanup triggers |
| Turn Structure + Recalls | 500-526, 616-619 | Recall vs move distinction |

### Integration Test Naming

Integration tests should clearly indicate the categories being tested:

```typescript
describe("Integration: Turn Structure + Combat", () => {
  it.skip("should transition to Showdown state when combat begins", () => {
    // Cross-ref: Rule 620 (Combat initiation)
    // ...
  });
});
```

### Cross-Reference Comments

Always include cross-reference comments in integration tests:

```typescript
it.skip("should clear damage at end of turn after combat", () => {
  // Arrange: Units with combat damage
  // Cross-ref: Rule 517.2 (Expiration Step) + Rule 626 (Damage assignment)
  // ...
});
```

## Test File Organization Summary

### Current Test Files

| File | Rules | Status |
|------|-------|--------|
| `turn-structure.test.ts` | 500-526 | Complete |
| `game-actions.test.ts` | 586-619 | Complete |
| `resources-and-deck-construction.test.ts` | 100-127, 156-161, 606 | Complete |

### Planned Test Files

| File | Rules | Description |
|------|-------|-------------|
| `combat-and-scoring.test.ts` | 620-633 | Combat resolution and victory |
| `abilities.test.ts` | 564-585 | Ability types and triggers |
| `keywords.test.ts` | 712-729 | Keyword mechanics |
| `chains-and-showdowns.test.ts` | 527-563 | Chain and showdown rules |
| `zones-and-movement.test.ts` | 105-183 | Zone management |

## Test Coverage Goals

### Coverage Targets

- **Unit Tests**: 95%+ line coverage
- **Edge Cases**: All boundary conditions tested
- **Integration Tests**: All cross-category interactions covered
- **Rule Coverage**: Every rule number has at least one test

### Coverage Verification

Run coverage reports to verify test completeness:

```bash
bun test --coverage
```

## Cleanup Step Order Reference

The cleanup procedure follows a specific order (Rules 518-526):

1. **Kill damaged Units** (Rule 520) - Units with damage ≥ Might go to trash
2. **Remove combat status** (Rule 521) - Clear Attacker/Defender roles
3. **Execute state-based effects** (Rule 522) - "While" and "As long as" effects
4. **Remove orphaned Hidden cards** (Rule 523) - Hidden cards without controller's Unit
5. **Mark Pending Combats** (Rule 524) - At Battlefields with opposing Units
6. **Trigger Showdowns** (Rule 525) - At uncontrolled Contested Battlefields (Neutral Open only)
7. **Trigger Combats** (Rule 526) - At Battlefields with Pending Combat (Neutral Open only)

## Turn Phase Reference

```
START OF TURN
├── Awaken Phase (515.1) - Ready all game objects
├── Beginning Phase (515.2)
│   ├── Beginning Step - "At the start of Beginning Phase" effects
│   └── Scoring Step - Hold scoring
├── Channel Phase (515.3) - Channel 2 runes
└── Draw Phase (515.4) - Draw 1, Rune Pool empties

ACTION PHASE (516)
├── Take Discretionary Actions
├── Combat (when triggered)
└── Showdowns (when triggered)

END OF TURN (517)
├── Ending Step (517.1) - "At the end of turn" effects
├── Expiration Step (517.2) - Clear damage, expire effects, Rune Pool empties
├── Cleanup Step (517.3) - Perform Cleanup
├── Loop Check (517.4) - Return to Expiration if new damage/effects
└── Turn Passes (517.5) - Next player becomes Turn Player
```

## Game State Reference

### Combined States (Rule 510)

| State | Showdown? | Chain? | What Can Be Played |
|-------|-----------|--------|-------------------|
| **Neutral Open** | No | No | Any card (on your turn) |
| **Neutral Closed** | No | Yes | Reaction only |
| **Showdown Open** | Yes | No | Action or Reaction |
| **Showdown Closed** | Yes | Yes | Reaction only |

### Priority and Focus (Rules 511-513)

- **Priority**: Permission to take Discretionary Actions
- **Focus**: Permission during Showdown Open State
- Gaining Focus also grants Priority
- Passing Priority retains Focus
- No Focus during Neutral State
