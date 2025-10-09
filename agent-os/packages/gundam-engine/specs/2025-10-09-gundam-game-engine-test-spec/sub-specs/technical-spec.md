# Technical Specification - Gundam Card Game Engine Test Cases

This is the technical specification for the spec detailed in @.agent-os/packages/gundam-engine/specs/2025-10-09-gundam-game-engine-test-spec/spec.md

## Overview

This technical specification defines the complete test suite for the Gundam Card Game engine. All test cases are organized into detailed sub-specifications that validate every aspect of the comprehensive rules.

## Document Organization

### Main Specification Files

1. **[spec.md](../spec.md)** - High-level requirements and user stories
2. **[spec-lite.md](../spec-lite.md)** - Condensed specification summary
3. **[test-case-summary.md](../test-case-summary.md)** - Complete test coverage matrix
4. **[implementation-guide.md](../implementation-guide.md)** - Step-by-step implementation guide

### Detailed Test Specifications

All test cases are organized into separate files by game system:

1. **[01-game-setup-tests.md](./01-game-setup-tests.md)**
   - Deck construction validation (7 tests)
   - Resource deck construction (3 tests)
   - Game initialization (4 tests)
   - Win/loss conditions (5 tests)
   - **Total**: 19 tests covering Rules 1-2, 5-1, 5-2

2. **[02-zone-management-tests.md](./02-zone-management-tests.md)**
   - Zone visibility and access (3 tests)
   - Deck area operations (3 tests)
   - Resource area management (4 tests)
   - Battle area capacity (3 tests)
   - Shield area mechanics (4 tests)
   - Hand management (3 tests)
   - Trash and removal areas (5 tests)
   - Zone transitions (3 tests)
   - **Total**: 28 tests covering Rules 3-1 through 3-9, 4-12

3. **[03-turn-flow-tests.md](./03-turn-flow-tests.md)**
   - Turn structure (3 tests)
   - Start phase (3 tests)
   - Draw phase (2 tests)
   - Resource phase (2 tests)
   - Main phase (5 tests)
   - End phase (6 tests)
   - Phase transitions (2 tests)
   - **Total**: 23 tests covering Rules 6-1 through 6-6, 8-1 through 8-5

4. **[04-battle-system-tests.md](./04-battle-system-tests.md)**
   - Attack declaration (10 tests)
   - Block step (4 tests)
   - Action step during battle (2 tests)
   - Damage step (7 tests)
   - Battle end step (2 tests)
   - **Total**: 25 tests covering Rules 7-1 through 7-7

5. **[05-effects-keywords-tests.md](./05-effects-keywords-tests.md)**
   - Keyword effects: Repair, Breach, Support, Blocker, First Strike, High-Maneuver (6 tests)
   - Effect types: Constant, Triggered, Activated, Command, Substitution (5 tests)
   - Effect resolution order (3 tests)
   - Timing keywords (3 tests)
   - **Total**: 17 tests covering Rules 9-1 through 9-3, 11-1, 11-2

## Test Architecture

All tests follow the same pattern:

```typescript
describe("Feature Name", () => {
  it("validates specific rule behavior (Rule X-Y-Z)", () => {
    // PRECONDITION: Setup game state
    const game = createTestGame({
      // Initial state configuration
    });
    
    // ACTION: Execute player moves
    const result = game.executeMove(moveDefinition);
    
    // ASSERTION: Verify state changes
    expect(result.success).toBe(true);
    expect(game.getState().someProperty).toBe(expectedValue);
  });
});
```

### Key Principles

1. **Immutability**: Every action returns new state; original state never mutates
2. **Type Safety**: Full TypeScript type checking, no `any` types
3. **Rule References**: Each test references the specific rule number from comprehensive rules
4. **Determinism**: Same inputs always produce same outputs
5. **Isolation**: Tests don't depend on other tests
6. **Black Box**: Tests validate behavior through public API only

## Test Helper Utilities

### Core Test Utilities

```typescript
type TestGameConfig = {
  players?: {
    player1?: PlayerConfig;
    player2?: PlayerConfig;
  };
  seed?: string; // For deterministic RNG
  skipSetup?: boolean; // Skip automatic game setup
};

type PlayerConfig = {
  deck?: CardDefinition[];
  resourceDeck?: CardDefinition[];
  hand?: CardDefinition[];
  shields?: CardDefinition[];
  battleArea?: UnitSetup[];
  resourceArea?: number; // Number of resources
  base?: CardDefinition;
};

type UnitSetup = {
  card: CardDefinition;
  pilot?: CardDefinition;
  position?: "active" | "rested";
  damage?: number;
};

// Core helper functions
createTestGame(config: TestGameConfig): TestGame
createTestCard(definition: CardDefinition): CardInstance
createTestUnit(setup: UnitSetup): UnitInstance
createTestPlayer(config: PlayerConfig): PlayerState

// State query helpers
getActivePlayer(game: TestGame): PlayerId
getCurrentPhase(game: TestGame): Phase
getCurrentStep(game: TestGame): Step
getPlayerHand(game: TestGame, player: PlayerId): CardInstance[]
getBattleArea(game: TestGame, player: PlayerId): UnitInstance[]
getResourceCount(game: TestGame, player: PlayerId): number
getShieldCount(game: TestGame, player: PlayerId): number

// Action helpers
playCard(game: TestGame, cardId: CardId, payment: ResourcePayment): Result<GameState>
deployUnit(game: TestGame, cardId: CardId, cost: number): Result<GameState>
deployBase(game: TestGame, cardId: CardId, cost: number): Result<GameState>
pairPilot(game: TestGame, pilotId: CardId, unitId: CardId, cost: number): Result<GameState>
declareAttack(game: TestGame, attackerId: CardId, target: PlayerId | CardId): Result<GameState>
activateBlocker(game: TestGame, blockerId: CardId): Result<GameState>
passAction(game: TestGame, player: PlayerId): Result<GameState>
advancePhase(game: TestGame): Result<GameState>
```

## Implementation Approach

### Phase 1: Test Infrastructure
Set up test helpers and utilities (see [implementation-guide.md](../implementation-guide.md) for details)

### Phase 2-6: Test Implementation
Implement tests in order: Setup → Zones → Turn Flow → Battle → Effects

### Phase 7: Integration Tests
Create complex multi-system interaction tests

### Phase 8: Validation
Verify 100% rule coverage and documentation

## Test Coverage Summary

| Category | Test Count | Rules Covered | Status |
|----------|------------|---------------|---------|
| Game Setup & Win Conditions | 19 | 1-2, 5-1, 5-2 | Specified |
| Zone Management | 28 | 3-1 to 3-9, 4-12 | Specified |
| Turn Flow & Phases | 23 | 6-1 to 6-6, 8-1 to 8-5 | Specified |
| Battle System | 25 | 7-1 to 7-7 | Specified |
| Effects & Keywords | 17 | 9-1 to 9-3, 11-1, 11-2 | Specified |
| **Total** | **112** | **All Rules** | **Specified** |

## Additional Resources

- **Comprehensive Rules**: See attached `RULES.md`
- **Core Engine Documentation**: `packages/core/docs/`
- **Existing Test Patterns**: `packages/engines/core-engine/src/game-engine/engines/gundam/src/`

## Next Steps

1. Review all sub-specification files (01-*.md through 05-*.md)
2. Review implementation guide
3. Set up test infrastructure
4. Begin implementation following the phase plan
5. Track progress against test-case-summary.md

For detailed test cases, refer to the individual sub-specification files listed above.

