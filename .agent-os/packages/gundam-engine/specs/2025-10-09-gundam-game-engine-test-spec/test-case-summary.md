# Gundam Card Game Engine - Test Case Summary

This document provides a high-level overview of all test cases organized by comprehensive rules coverage.

## Test Coverage Matrix

| Rule Section | Test File | Test Count | Status |
|--------------|-----------|------------|---------|
| 1. Game Overview (Win/Loss) | 01-game-setup-tests.md | 15 | Specified |
| 2. Card Information | Covered in integration tests | - | Specified |
| 3. Game Locations | 02-zone-management-tests.md | 25 | Specified |
| 4. Game Terminology | Distributed across files | - | Specified |
| 5. Preparing to Play | 01-game-setup-tests.md | 10 | Specified |
| 6. Game Progression | 03-turn-flow-tests.md | 22 | Specified |
| 7. Attacking and Battles | 04-battle-system-tests.md | 28 | Specified |
| 8. Action Steps | 03-turn-flow-tests.md | 5 | Specified |
| 9. Effect Activation | 05-effects-keywords-tests.md | 18 | Specified |
| 10. Rules Management | Distributed across files | - | Specified |
| 11. Keyword Effects | 05-effects-keywords-tests.md | 10 | Specified |

## Test Organization

### 01-game-setup-tests.md
**Focus**: Game initialization, deck validation, win/loss conditions

- Deck construction validation (7 tests)
- Resource deck construction (3 tests)
- Game initialization (4 tests)
- Mulligan system (3 tests)
- Win/loss conditions (5 tests)

**Key Rules Covered**: 1-2, 5-1, 5-2

### 02-zone-management-tests.md
**Focus**: All game locations and card movement between zones

- Zone visibility and access (3 tests)
- Deck area operations (3 tests)
- Resource area management (4 tests)
- Battle area capacity (3 tests)
- Shield area mechanics (4 tests)
- Hand management (3 tests)
- Trash and removal areas (5 tests)
- Zone transitions (3 tests)

**Key Rules Covered**: 3-1 through 3-9, 4-12

### 03-turn-flow-tests.md
**Focus**: Complete turn structure and phase progression

- Turn structure (3 tests)
- Start phase - Active & Start steps (3 tests)
- Draw phase (2 tests)
- Resource phase (2 tests)
- Main phase (5 tests)
- End phase - All 4 steps (6 tests)
- Phase transitions (2 tests)

**Key Rules Covered**: 6-1 through 6-6, 8-1 through 8-5

### 04-battle-system-tests.md
**Focus**: Complete battle flow from attack declaration to resolution

- Attack declaration (10 tests)
- Block step (4 tests)
- Action step during battle (2 tests)
- Damage step (7 tests)
- Battle end step (2 tests)

**Key Rules Covered**: 7-1 through 7-7

### 05-effects-keywords-tests.md
**Focus**: All effect types and keyword mechanics

- Keyword effects (6 tests for each keyword)
  - <Repair>
  - <Breach>
  - <Support>
  - <Blocker>
  - <First Strike>
  - <High-Maneuver>
- Effect types (5 tests)
  - Constant
  - Triggered
  - Activated
  - Command
  - Substitution
- Effect resolution order (3 tests)
- Timing keywords (3 tests)

**Key Rules Covered**: 9-1 through 9-3, 11-1, 11-2

## Test Implementation Pattern

All tests follow this consistent structure:

```typescript
describe("Feature Category", () => {
  it("validates specific rule behavior (Rule X-Y-Z)", () => {
    // PRECONDITION: Setup game state
    const game = createTestGame({
      players: {
        player1: { /* initial state */ },
        player2: { /* initial state */ }
      }
    });
    
    // ACTION: Execute player moves
    const result = game.executeMove(moveDefinition);
    
    // ASSERTION: Verify state changes
    expect(result.success).toBe(true);
    expect(game.getState().someProperty).toBe(expectedValue);
  });
});
```

## Test Helper Utilities Required

### Core Utilities
- `createTestGame(config)` - Initialize game with specific state
- `createTestCard(definition)` - Create card instances
- `createTestUnit(setup)` - Create unit with position/damage
- `createDeck(options)` - Generate valid deck
- `createResourceDeck(options)` - Generate resource deck

### State Query Helpers
- `getActivePlayer(game)` - Current active player
- `getCurrentPhase(game)` - Current phase
- `getCurrentStep(game)` - Current step within phase
- `getPlayerHand(game, player)` - Player's hand
- `getBattleArea(game, player)` - Units in battle
- `getResourceCount(game, player)` - Total resources
- `getShieldCount(game, player)` - Remaining shields

### Action Helpers
- `deployUnit(game, cardId, cost)` - Deploy unit to battle
- `deployBase(game, cardId, cost)` - Deploy base
- `pairPilot(game, pilotId, unitId, cost)` - Pair pilot
- `declareAttack(game, attackerId, target)` - Declare attack
- `activateBlocker(game, blockerId)` - Activate blocker
- `passAction(game, player)` - Pass priority
- `advancePhase(game)` - Move to next phase

## Rule Coverage Verification

Each test case must:
1. Reference the specific rule number it validates
2. Test both success and failure scenarios
3. Verify immutability (original state unchanged)
4. Check type safety (proper TypeScript types)
5. Validate determinism (same input → same output)

## Integration with Core Engine

All tests leverage the existing core engine:
- Use type system from `@tcg-engine/core`
- Follow move definition patterns
- Implement state management
- Respect immutability principles
- Use Result types for error handling

## Next Steps for Implementation

1. **Phase 1**: Implement test helper utilities
2. **Phase 2**: Implement game setup and win condition tests
3. **Phase 3**: Implement zone management tests
4. **Phase 4**: Implement turn flow tests
5. **Phase 5**: Implement battle system tests
6. **Phase 6**: Implement effects and keywords tests
7. **Phase 7**: Create integration tests for complex scenarios
8. **Phase 8**: Verify 100% rule coverage

## Additional Test Categories Needed

Beyond the specified tests, consider:
- **Card-specific tests**: Test actual card implementations
- **Link Unit mechanics**: Pairing and immediate attack rules
- **Token management**: EX Base, EX Resource, and other tokens
- **Damage tracking**: Counters and HP reduction
- **Cost payment**: Level requirements and resource usage
- **Simultaneous events**: Multiple cards entering/leaving zones
- **Effect stack**: Complex nested effect resolution
- **Edge cases**: Unusual but legal game states

## Estimated Test Count

Based on comprehensive rules analysis:
- **Setup & Win Conditions**: ~15 tests
- **Zone Management**: ~25 tests
- **Turn Flow**: ~22 tests
- **Battle System**: ~28 tests
- **Effects & Keywords**: ~18 tests
- **Card Deployment**: ~15 tests (to be added)
- **Integration Tests**: ~20 tests (to be added)

**Total Estimated**: 143+ individual test cases

## Success Criteria

The test suite is complete when:
1. ✅ Every rule in the comprehensive rules has corresponding test(s)
2. ✅ All tests follow the same pattern (precondition → action → assertion)
3. ✅ All tests use helper utilities (no code duplication)
4. ✅ All tests validate through public API only (black box)
5. ✅ All tests verify immutability
6. ✅ All tests include both success and failure scenarios
7. ✅ Running `bun test` executes all tests successfully

## Documentation Standards

Each test file must include:
- Header with rule section reference
- Clear test descriptions with rule numbers
- Inline comments for complex scenarios
- Examples of edge cases
- Links to relevant rule sections

