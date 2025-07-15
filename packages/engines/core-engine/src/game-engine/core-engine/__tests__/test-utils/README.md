# Core Engine Test Utilities

This directory contains consolidated test utilities for the core-engine package. These utilities are designed to make writing tests easier, more consistent, and more maintainable.

## Available Utilities

### Context Utilities

Utilities for creating and manipulating test contexts:

- `createMinimalTestContext()`: Creates a minimal test context with two players and empty card collections
- `createTestContextWithCards()`: Creates a test context with cards in specific zones
- `createTestContextWithPhase()`: Creates a test context with a specific game phase
- `createTestContextWithTurnState()`: Creates a test context with specific turn and priority players
// Removed unused context utilities

### Card Utilities

Utilities for working with cards in tests:

- `createMockCardInstance()`: Creates a mock card instance for testing
- `createMockGameCard()`: Creates a mock game card for testing
- `addCardToPlayer()`: Adds a card to a player's collection in the context
- `addCardToZone()`: Adds a card to a zone in the context
- `moveCardBetweenZones()`: Moves a card from one zone to another in the context
- `createZone()`: Creates a zone in the context

### Assertion Utilities

Utilities for common assertions in tests:

- `assertCardInZone()`: Asserts that a card is in a specific zone
- `assertCardNotInZone()`: Asserts that a card is not in a specific zone
- `assertPlayerHasCard()`: Asserts that a player has a specific card
// Removed unused assertion utility
- `assertPlayerIsTurnPlayer()`: Asserts that a player is the turn player
- `assertPlayerIsPriorityPlayer()`: Asserts that a player is the priority player
- `assertGamePhase()`: Asserts that the game is in a specific phase
// Removed unused assertion utility

### Error Testing Utilities

Utilities for testing error conditions:

- `expectToThrowErrorOfType()`: Asserts that a function throws an error of a specific type
- `expectToThrowValidationError()`: Asserts that a function throws a ValidationFailedError
- `expectToThrowNotFoundError()`: Asserts that a function throws an EntityNotFoundError
- `expectToThrowMoveValidationError()`: Asserts that a function throws a MoveValidationFailedError
- `expectToThrowPermissionError()`: Asserts that a function throws a PermissionDeniedError
// Removed unused error testing utility

### Mock Utilities

Utilities for creating mock objects and functions:

- `mockFn()`: Creates a mock function that returns the provided value
// Removed unused mock utilities

## Usage

Import the utilities you need from the test-utils directory:

```typescript
import {
  describe,
  it,
  expect,
  createMinimalTestContext,
  assertCardInZone,
  expectToThrowValidationError,
} from "../../__tests__/test-utils";
```

See the `example-usage.test.ts` file for more examples of how to use these utilities.

## Benefits

Using these consolidated test utilities provides several benefits:

1. **Consistency**: All tests use the same patterns and utilities
2. **Readability**: Tests are more concise and easier to understand
3. **Maintainability**: Changes to test patterns can be made in one place
4. **Efficiency**: Less duplicate code across test files
5. **Documentation**: Clear examples of how to test different scenarios

## Adding New Utilities

When adding new test utilities:

1. Add the utility to the appropriate file in the test-utils directory
2. Export the utility from the index.ts file
3. Add documentation for the utility in this README.md file
4. Consider adding an example to the example-usage.test.ts file