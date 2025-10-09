# Implementation Guide for Gundam Card Game Engine Tests

## Overview

This guide provides step-by-step instructions for implementing the Gundam Card Game engine test suite based on the comprehensive test specifications.

## Directory Structure

```
packages/gundam-engine/
├── src/
│   ├── __tests__/
│   │   ├── setup/
│   │   │   ├── game-setup.spec.ts
│   │   │   └── win-conditions.spec.ts
│   │   ├── zones/
│   │   │   ├── zone-visibility.spec.ts
│   │   │   ├── deck-area.spec.ts
│   │   │   ├── resource-area.spec.ts
│   │   │   ├── battle-area.spec.ts
│   │   │   ├── shield-area.spec.ts
│   │   │   └── zone-transitions.spec.ts
│   │   ├── turn-flow/
│   │   │   ├── phase-progression.spec.ts
│   │   │   ├── start-phase.spec.ts
│   │   │   ├── draw-phase.spec.ts
│   │   │   ├── resource-phase.spec.ts
│   │   │   ├── main-phase.spec.ts
│   │   │   └── end-phase.spec.ts
│   │   ├── battle/
│   │   │   ├── attack-declaration.spec.ts
│   │   │   ├── block-step.spec.ts
│   │   │   ├── action-step.spec.ts
│   │   │   ├── damage-step.spec.ts
│   │   │   └── battle-end.spec.ts
│   │   ├── effects/
│   │   │   ├── constant-effects.spec.ts
│   │   │   ├── triggered-effects.spec.ts
│   │   │   ├── activated-effects.spec.ts
│   │   │   ├── command-effects.spec.ts
│   │   │   └── effect-resolution.spec.ts
│   │   ├── keywords/
│   │   │   ├── repair.spec.ts
│   │   │   ├── breach.spec.ts
│   │   │   ├── support.spec.ts
│   │   │   ├── blocker.spec.ts
│   │   │   ├── first-strike.spec.ts
│   │   │   └── high-maneuver.spec.ts
│   │   └── integration/
│   │       ├── complete-game.spec.ts
│   │       └── complex-interactions.spec.ts
│   ├── test-helpers/
│   │   ├── index.ts
│   │   ├── game-factory.ts
│   │   ├── card-factory.ts
│   │   ├── state-queries.ts
│   │   └── action-helpers.ts
│   └── game-definition.ts
```

## Implementation Phases

### Phase 1: Test Infrastructure (Week 1)

**Goal**: Set up test helpers and utilities

1. **Create `test-helpers/game-factory.ts`**
   ```typescript
   export type TestGameConfig = {
     players?: {
       player1?: PlayerConfig;
       player2?: PlayerConfig;
     };
     seed?: string;
     skipSetup?: boolean;
   };

   export function createTestGame(config?: TestGameConfig): TestGame {
     // Implementation
   }
   ```

2. **Create `test-helpers/card-factory.ts`**
   ```typescript
   export function createUnit(props: Partial<UnitDefinition>): UnitDefinition {
     // Implementation
   }

   export function createBase(props: Partial<BaseDefinition>): BaseDefinition {
     // Implementation
   }

   export function createCommand(props: Partial<CommandDefinition>): CommandDefinition {
     // Implementation
   }

   export function createPilot(props: Partial<PilotDefinition>): PilotDefinition {
     // Implementation
   }

   export function createDeck(options: DeckOptions): CardDefinition[] {
     // Implementation
   }

   export function createResourceDeck(options: ResourceDeckOptions): ResourceCard[] {
     // Implementation
   }
   ```

3. **Create `test-helpers/state-queries.ts`**
   ```typescript
   export function getActivePlayer(game: TestGame): PlayerId { /* ... */ }
   export function getCurrentPhase(game: TestGame): Phase { /* ... */ }
   export function getCurrentStep(game: TestGame): Step | null { /* ... */ }
   export function getPlayerHand(game: TestGame, player: PlayerId): CardInstance[] { /* ... */ }
   export function getBattleArea(game: TestGame, player: PlayerId): UnitInstance[] { /* ... */ }
   export function getResourceCount(game: TestGame, player: PlayerId): number { /* ... */ }
   export function getShieldCount(game: TestGame, player: PlayerId): number { /* ... */ }
   ```

4. **Create `test-helpers/action-helpers.ts`**
   ```typescript
   export function deployUnit(game: TestGame, cardId: CardId, cost: number): Result<GameState> { /* ... */ }
   export function deployBase(game: TestGame, cardId: CardId, cost: number): Result<GameState> { /* ... */ }
   export function pairPilot(game: TestGame, pilotId: CardId, unitId: CardId, cost: number): Result<GameState> { /* ... */ }
   export function declareAttack(game: TestGame, attackerId: CardId, target: PlayerId | CardId): Result<GameState> { /* ... */ }
   export function activateBlocker(game: TestGame, blockerId: CardId): Result<GameState> { /* ... */ }
   ```

**Validation**: All helper functions compile and return correct types

### Phase 2: Game Setup Tests (Week 2)

**Goal**: Implement and validate game initialization

1. Implement deck validation tests (01-game-setup-tests.md § 1.1)
2. Implement resource deck tests (01-game-setup-tests.md § 1.2)
3. Implement game initialization tests (01-game-setup-tests.md § 1.3)
4. Implement win/loss condition tests (01-game-setup-tests.md § 1.4)

**Validation**: `bun test src/__tests__/setup/` passes

### Phase 3: Zone Management Tests (Week 3)

**Goal**: Validate all zone operations and transitions

1. Implement zone visibility tests (02-zone-management-tests.md § 2.1)
2. Implement deck area tests (02-zone-management-tests.md § 2.2)
3. Implement resource area tests (02-zone-management-tests.md § 2.3)
4. Implement battle area tests (02-zone-management-tests.md § 2.4)
5. Implement shield area tests (02-zone-management-tests.md § 2.5)
6. Implement hand tests (02-zone-management-tests.md § 2.6)
7. Implement trash and removal tests (02-zone-management-tests.md § 2.7-2.8)
8. Implement zone transition tests (02-zone-management-tests.md § 2.9)

**Validation**: `bun test src/__tests__/zones/` passes

### Phase 4: Turn Flow Tests (Week 4)

**Goal**: Validate complete turn and phase system

1. Implement turn structure tests (03-turn-flow-tests.md § 3.1)
2. Implement start phase tests (03-turn-flow-tests.md § 3.2)
3. Implement draw phase tests (03-turn-flow-tests.md § 3.3)
4. Implement resource phase tests (03-turn-flow-tests.md § 3.4)
5. Implement main phase tests (03-turn-flow-tests.md § 3.5)
6. Implement end phase tests (03-turn-flow-tests.md § 3.6)
7. Implement phase transition tests (03-turn-flow-tests.md § 3.7)

**Validation**: `bun test src/__tests__/turn-flow/` passes

### Phase 5: Battle System Tests (Week 5)

**Goal**: Validate complete battle flow

1. Implement attack declaration tests (04-battle-system-tests.md § 4.1)
2. Implement block step tests (04-battle-system-tests.md § 4.2)
3. Implement action step tests (04-battle-system-tests.md § 4.3)
4. Implement damage step tests (04-battle-system-tests.md § 4.4)
5. Implement battle end tests (04-battle-system-tests.md § 4.5)

**Validation**: `bun test src/__tests__/battle/` passes

### Phase 6: Effects & Keywords Tests (Week 6)

**Goal**: Validate all effect types and keyword mechanics

1. Implement keyword effect tests (05-effects-keywords-tests.md § 5.1)
   - Repair, Breach, Support, Blocker, First Strike, High-Maneuver
2. Implement effect type tests (05-effects-keywords-tests.md § 5.2)
   - Constant, Triggered, Activated, Command, Substitution
3. Implement effect resolution tests (05-effects-keywords-tests.md § 5.3)
4. Implement timing keyword tests (05-effects-keywords-tests.md § 5.4)

**Validation**: `bun test src/__tests__/effects/` and `bun test src/__tests__/keywords/` pass

### Phase 7: Integration Tests (Week 7)

**Goal**: Validate complex multi-system interactions

1. Create complete game playthrough test
2. Create complex effect interaction tests
3. Create edge case tests
4. Create performance tests

**Validation**: `bun test src/__tests__/integration/` passes

### Phase 8: Final Validation (Week 8)

**Goal**: Ensure 100% coverage and documentation

1. Run full test suite: `bun test`
2. Generate coverage report
3. Verify all rules have corresponding tests
4. Update documentation with any findings
5. Create test maintenance guide

**Validation**: `bun run ci-check` passes

## Test Writing Guidelines

### 1. Test Structure

Every test must follow this pattern:

```typescript
it("describes what behavior is being tested (Rule X-Y-Z)", () => {
  // PRECONDITION: Setup game state
  const game = createTestGame({
    // ... configuration
  });
  
  // ACTION: Execute player moves
  const result = game.executeMove(/* ... */);
  
  // ASSERTION: Verify state changes
  expect(result.success).toBe(true);
  expect(game.getState().property).toBe(expectedValue);
});
```

### 2. Rule References

Every test description must include the rule number:

- ✅ `"allows attacking player with active unit (Rule 7-3-1)"`
- ❌ `"can attack player"`

### 3. Success AND Failure Cases

Test both paths:

```typescript
it("accepts valid deck (Rule 5-1-1)", () => {
  // Test success case
});

it("rejects invalid deck (Rule 5-1-1)", () => {
  // Test failure case
});
```

### 4. Immutability Verification

Always verify original state unchanged:

```typescript
const originalState = game.getState();
const result = game.executeMove(/* ... */);

// Verify new state
expect(result.success).toBe(true);

// Verify immutability
expect(originalState).not.toBe(result.data);
```

### 5. Type Safety

No `any` types, no type assertions:

```typescript
// ❌ Bad
const unit: any = game.getUnit("unit-1");
const result = game.execute(move as Move);

// ✅ Good
const unit: UnitInstance | undefined = game.getUnit("unit-1");
if (!unit) throw new Error("Unit not found");
const result: Result<GameState> = game.execute(move);
```

## Common Patterns

### Pattern 1: Testing Card Effects

```typescript
it("triggers effect when condition met", () => {
  const cardWithEffect = createUnit({
    effects: [{
      timing: "deploy",
      type: "drawCard",
      count: 1
    }]
  });
  
  const game = createTestGame({
    players: {
      player1: {
        hand: [cardWithEffect],
        resourceArea: 5
      }
    }
  });
  
  const handSizeBefore = getPlayerHand(game, "player1").length;
  
  game.advanceToPhase("main");
  game.deployUnit("player1", "unit-1", { cost: 2 });
  game.resolveTopOfStack();
  
  const handSizeAfter = getPlayerHand(game, "player1").length;
  expect(handSizeAfter).toBe(handSizeBefore); // -1 deployed +1 drawn
});
```

### Pattern 2: Testing Battle Scenarios

```typescript
it("resolves battle with expected outcome", () => {
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [
          { card: createUnit({ ap: 5, hp: 4 }), position: "active" }
        ]
      },
      player2: {
        battleArea: [
          { card: createUnit({ ap: 3, hp: 6 }), position: "rested" }
        ]
      }
    }
  });
  
  game.advanceToPhase("main");
  game.declareAttack("unit-1", "enemy-unit-1");
  game.passBlockerActivation("player2");
  game.passBothActions();
  
  // Verify damage
  expect(game.getUnit("unit-1").damage).toBe(3);
  expect(game.getUnit("enemy-unit-1").damage).toBe(5);
  
  // Both survive
  expect(game.getUnit("unit-1")).toBeDefined();
  expect(game.getUnit("enemy-unit-1")).toBeDefined();
});
```

### Pattern 3: Testing Phase Transitions

```typescript
it("advances through phases correctly", () => {
  const game = createTestGame();
  
  const phases: Phase[] = [];
  
  while (getActivePlayer(game) === "player1") {
    phases.push(getCurrentPhase(game));
    game.advancePhase();
  }
  
  expect(phases).toEqual(["start", "draw", "resource", "main", "end"]);
});
```

## Debugging Failed Tests

### Strategy 1: Isolate the Failure

```typescript
// Add .only to run single test
it.only("specific failing test", () => {
  // ...
});
```

### Strategy 2: Add State Logging

```typescript
console.log("State before action:", JSON.stringify(game.getState(), null, 2));
const result = game.executeMove(/* ... */);
console.log("Result:", result);
console.log("State after action:", JSON.stringify(game.getState(), null, 2));
```

### Strategy 3: Verify Preconditions

```typescript
// Before the action
expect(game.getUnit("unit-1")).toBeDefined();
expect(game.getUnit("unit-1").position).toBe("active");
expect(getCurrentPhase(game)).toBe("main");

// Then execute action
const result = game.declareAttack(/* ... */);
```

## Performance Considerations

- Each test should run in < 100ms
- Use `createTestGame()` with minimal setup
- Avoid creating full 50-card decks unless testing deck operations
- Use deterministic RNG (seeded) for reproducibility

## CI/CD Integration

Add to `package.json`:

```json
{
  "scripts": {
    "test": "bun test",
    "test:watch": "bun test --watch",
    "test:coverage": "bun test --coverage",
    "ci-check": "bun run check-types && bun run test"
  }
}
```

## Success Metrics

The test suite is successful when:

- ✅ All tests pass
- ✅ 100% coverage of comprehensive rules
- ✅ No type errors (`bun run check-types`)
- ✅ All tests follow consistent pattern
- ✅ Test suite runs in < 10 seconds
- ✅ Every test references its rule number
- ✅ Both success and failure cases covered

## Next Steps After Completion

1. **Card Implementation**: Use test patterns to implement actual cards from sets
2. **UI Integration**: Connect tests to game UI components
3. **Network Play**: Extend tests for multiplayer scenarios
4. **AI Development**: Use game state for AI training
5. **Balance Testing**: Analyze game statistics from test runs

## Questions or Issues?

Refer to:
- Main specification: `spec.md`
- Test case summaries: `test-case-summary.md`
- Individual test files: `sub-specs/01-*.md` through `sub-specs/05-*.md`
- Comprehensive rules: `RULES.md` in project root

