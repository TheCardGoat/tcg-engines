# State Machine Tests

This directory contains tests for the state machines that power the Lorcana game engine, particularly focusing on the challenge mechanism and the bag system for resolving effects.

## Challenge Machine Tests

The `challengeMachine.test.ts` file tests the challenge state machine, which implements the rules for challenges in Lorcana:

- **Character vs Character challenges**: Tests the flow where one character challenges another, including damage calculation and application
- **Character vs Location challenges**: Tests the flow where a character challenges a location, which uses different rules
- **Validation failures**: Tests scenarios where a challenge is invalid (challenger not dry, not ready, or other restrictions)
- **Effect handling**: Tests the application of effects during challenges (e.g., "while challenging" effects)
- **Banishment**: Tests scenarios where a character is banished as a result of taking damage
- **Entity removal**: Tests the proper handling of an entity being removed during a challenge

## Challenge-Bag Integration Tests

The `challenge-bag-integration.test.ts` file tests the interaction between the challenge machine and the bag machine, which is responsible for resolving triggered effects:

- **Effect collection and resolution**: Tests that effects triggered during a challenge are properly added to the bag and resolved
- **Banishment effects**: Tests that effects that trigger on banishment are properly processed

## Running the Tests

To run these tests, use:

```bash
npm test -- --testPathPattern="state-machines"
```

Or to run a specific test file:

```bash
npm test -- --testPathPattern="challengeMachine.test.ts"
```

## Mock Implementation

The tests use mock implementations of game components:

- **Game State Reader**: Mocks the interface for reading game state (cards, properties, etc.)
- **State Mutator**: Mocks the interface for modifying game state (applying damage, exerting cards, etc.)
- **Card Models**: Mock card objects for characters and locations
- **Effect Models**: Mock effect objects that can be triggered during challenges

## Test Coverage

The tests cover the main challenge flow states:

1. Initialization and validation
2. Challenge preparation
3. Exerting the challenger
4. Applying challenge effects
5. Collecting and resolving triggered effects
6. Calculating and applying damage
7. Checking for banishment
8. Collecting and resolving banishment effects
9. Cleanup

## Future Test Improvements

Potential areas for expanding test coverage:

- Test more complex effect interactions
- Test edge cases with multiple effects in the bag
- Test floating triggered abilities
- Test more complex conditional effects
