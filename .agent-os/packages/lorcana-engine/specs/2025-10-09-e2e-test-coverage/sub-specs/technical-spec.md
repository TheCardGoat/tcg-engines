# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/packages/lorcana-engine/specs/2025-10-09-e2e-test-coverage/spec.md

## Technical Requirements

### Test Infrastructure

- **Use existing LorcanaTestEngine framework** - All tests must use the `LorcanaTestEngine` class from `~/game-engine/engines/lorcana/src/testing/lorcana-test-engine.ts` which provides three-engine simulation (authoritative + two players) with state synchronization validation
- **Test file organization** - Tests must be colocated with card definitions following pattern: `src/cards/definitions/[set]/[type]/[color]/[number]-[card-name].test.ts`
- **Test naming conventions** - Use descriptive `describe()` blocks for card names and `it()` blocks for specific abilities or rules being tested
- **Bun test framework** - All tests use `bun test` with `@jest/globals` imports for compatibility

### Test Structure Pattern

Every e2e test must follow this structure:

1. **Test Setup** - Initialize `LorcanaTestEngine` with appropriate initial state:
   ```typescript
   const testEngine = new LorcanaTestEngine({
     play: [cardUnderTest],
     hand: [otherCard],
     inkwell: cardUnderTest.cost,
   }, {
     play: [opponentCard],
   });
   ```

2. **Action Execution** - Perform game actions through the engine:
   ```typescript
   await testEngine.playCard(cardUnderTest);
   await testEngine.questCard(cardUnderTest);
   await testEngine.passTurn();
   ```

3. **State Assertions** - Verify expected outcomes:
   ```typescript
   expect(testEngine.getCardModel(card).zone).toBe("play");
   expect(testEngine.getPlayerLore("player_one")).toBe(expectedLore);
   expect(card.hasKeyword("evasive")).toBe(true);
   ```

4. **Effect Resolution** - Handle ability triggers and stack resolution:
   ```typescript
   await testEngine.resolveTopOfStack({ targets: [targetCard] });
   ```

### Rule Testing Requirements

#### Turn Structure Tests (Section 4 - LLM-RULES.md)

- **Beginning Phase** - Test Ready step (readying all cards), Set step (removing "dry" status, location lore), Draw step (skipped on first turn)
- **Main Phase** - Test all turn actions: inkwell placement (once per turn), card playing (with cost payment), questing (exert to gain lore), challenging (damage resolution), location movement, activated abilities
- **End Phase** - Test end-of-turn triggers and "this turn" effect cleanup

#### Card Type Tests (Section 6 - LLM-RULES.md)

- **Characters** - Test strength/willpower, damage tracking, exert/ready states, quest ability, challenge ability
- **Actions** - Test immediate resolution, song mechanic (exerting characters with singer value), discard after resolution
- **Items** - Test persistence in play, activated abilities, immediate availability
- **Locations** - Test move cost, character containment, lore generation at turn start

#### Keyword Tests (Section 10 - LLM-RULES.md)

- **Bodyguard** - Test must-challenge-first restriction, can enter play exerted
- **Challenger +N** - Test strength bonus while challenging
- **Evasive** - Test can only be challenged by other Evasive characters
- **Reckless** - Test cannot quest, must challenge if able
- **Resist +N** - Test damage reduction
- **Rush** - Test can challenge immediately when played
- **Shift** - Test playing on character with same name, cost reduction
- **Singer N** - Test exerting to pay for songs
- **Sing Together N** - Test multiple characters exerting to pay song cost
- **Support** - Test adding strength to another character when questing
- **Vanish** - Test banishment when chosen by opponent
- **Ward** - Test cannot be chosen by opponent's effects

#### Ability Tests (Section 7 - LLM-RULES.md)

- **Triggered Abilities** - Test "When/Whenever/At start/At end" triggers, bag resolution order (active player first, then turn order)
- **Activated Abilities** - Test [Cost] — [Effect] format, only active player can activate
- **Static Abilities** - Test continuous effects, application to cards entering play
- **Replacement Effects** - Test "instead" and "skip" mechanics

#### Game State and Zones (Sections 1.9, 8 - LLM-RULES.md)

- **Zone Transitions** - Test moving between deck/hand/play/inkwell/discard/bag zones
- **Game State Checks** - Test win condition (20 lore), loss condition (empty deck draw), damage >= willpower banishment
- **Bag Resolution** - Test triggered ability ordering (active player first, then turn order)

### Card Testing Requirements

#### Set 009 Complete Coverage

- **Character Cards** - Test all abilities, keywords, triggered effects, activated abilities
- **Action Cards** - Test immediate effects, targeting, modal choices, cost reductions
- **Item Cards** - Test activated abilities, static effects, persistence
- **Song Cards** - Test singer requirements, Sing Together mechanics, exerting characters to pay cost

#### Test Coverage Patterns

1. **Basic Functionality** - Card enters play correctly, basic stats are correct
2. **Ability Triggers** - Triggered abilities fire at correct timing
3. **Ability Effects** - Effects produce expected game state changes
4. **Edge Cases** - Invalid targets, insufficient resources, restrictions
5. **Interactions** - Multi-card combos, stacking effects, replacement effects

### Test Data Management

- **Mock Cards** - Use `testCharacterCard` and `cardWithoutInkwell` from test-engine for generic cards
- **Real Cards** - Import actual card definitions from `~/game-engine/engines/lorcana/src/cards/definitions/[set]/index`
- **Initial State Setup** - Use `TestInitialState` type to specify zone contents:
  - `deck: number | CardDefinition[]` - Cards in deck (number creates generic test cards)
  - `hand: CardDefinition[]` - Cards in hand
  - `play: CardDefinition[]` - Cards in play
  - `inkwell: number` - Number of ink available (or card array)
  - `discard: CardDefinition[]` - Cards in discard
  - `lore: number` - Starting lore value

### Assertions and Validation

- **Zone Assertions** - Use `testEngine.getCardModel(card).zone` to verify card location
- **Lore Tracking** - Use `testEngine.getPlayerLore(playerId)` to verify lore accumulation
- **State Validation** - Use `testEngine.assertThatZonesContain({ play: 1, hand: 5 })` for zone counts
- **Card State** - Verify exerted, damaged, meta properties through card model
- **Engine Synchronization** - TestEngine automatically validates state sync across all three engines after each move

### Test Execution

- **Run all tests** - `bun test` (runs all .test.ts files)
- **Run specific set** - `bun test packages/engines/core-engine/src/game-engine/engines/lorcana/src/cards/definitions/009/`
- **Run specific file** - `bun test [path-to-test-file].test.ts`
- **Watch mode** - `bun test --watch` for development
- **Coverage** - Test coverage is tracked through TDD practices (behavior-focused tests, not line coverage)

### Testing Best Practices

1. **Test Behavior, Not Implementation** - Focus on observable game outcomes through the public API
2. **Use Real Game Scenarios** - Set up realistic board states with multiple cards
3. **Test One Concept Per Test** - Each `it()` block tests a single rule or ability
4. **Clear Test Names** - Describe what is being tested: "Support keyword adds strength when questing"
5. **Avoid Mocking** - Use real card instances and game state; only mock external dependencies
6. **Handle Async Properly** - All test functions are `async` and properly `await` engine operations
7. **Skip Incomplete Tests** - Use `it.skip()` for tests that need implementation (many set 009 tests currently skipped)
8. **Follow TDD** - Write failing test first, implement minimum code to pass, refactor

## Test Organization Structure

```
src/game-engine/engines/lorcana/
├── src/
│   ├── cards/
│   │   └── definitions/
│   │       ├── 008/           # Set 8 cards (some complete)
│   │       ├── 009/           # Set 9 cards (template for this spec)
│   │       │   ├── characters/
│   │       │   │   ├── amber/
│   │       │   │   │   ├── 001-the-queen-conceited-ruler.test.ts
│   │       │   │   │   └── ... (24 character tests)
│   │       │   │   ├── amethyst/
│   │       │   │   ├── emerald/
│   │       │   │   ├── ruby/
│   │       │   │   ├── sapphire/
│   │       │   │   └── steel/
│   │       │   └── actions/
│   │       │       ├── amber/
│   │       │       │   ├── 025-look-at-this-family.test.ts
│   │       │       │   └── ... (7 action tests)
│   │       │       ├── amethyst/
│   │       │       ├── emerald/
│   │       │       ├── ruby/
│   │       │       ├── sapphire/
│   │       │       └── steel/
│   │       └── ... (other sets)
│   ├── game-definition/
│   │   └── segments/
│   │       ├── starting-a-game/
│   │       │   └── starting-a-game-segment.spec.ts  # Game initialization tests
│   │       └── during-game/
│   │           └── during-game-segment.spec.ts      # Turn/phase tests
│   └── testing/
│       ├── lorcana-test-engine.ts   # Main test framework
│       └── mockCards.ts              # Test card templates
```

## Current State Analysis

### Existing Tests

Based on examination of set 009:
- **~150+ test files** in set 009 (characters + actions across 6 colors)
- **Most tests are `.skip()`** - indicating test structure exists but implementations incomplete
- **Pattern established** - Test files follow consistent structure with describe/it blocks
- **Some complete tests** - Examples like "001-the-queen-conceited-ruler.test.ts" show proper implementation

### Test Coverage Gaps

1. **Many skipped tests in set 009** - Need to implement card ability tests
2. **Limited keyword combination tests** - Need tests for cards with multiple keywords interacting
3. **Missing complex interaction tests** - Few tests covering multi-card ability stacks
4. **Incomplete rule coverage** - Not all LLM-RULES.md sections have dedicated tests
5. **Limited edge case testing** - Need more tests for invalid operations, restrictions, timing

### Testing Infrastructure Status

- ✅ **LorcanaTestEngine is complete** - Robust three-engine simulation with state sync validation
- ✅ **Test file structure established** - Consistent patterns across all set 009 files
- ✅ **Helper methods available** - TestEngine provides comprehensive API for game actions
- ✅ **Real card imports** - Tests use actual card definitions, not mocks
- ⚠️ **Many tests skipped** - Implementation work needed to complete coverage

## Success Criteria

1. **All set 009 card tests passing** - Remove `.skip()` from all tests and implement proper assertions
2. **Core rules fully tested** - Every section of LLM-RULES.md has corresponding test coverage
3. **Keyword mechanics validated** - Each keyword has multiple tests demonstrating correct behavior
4. **Test documentation created** - Clear guide for writing new card and rule tests
5. **CI passing** - All tests run successfully in continuous integration with `bun run check`
