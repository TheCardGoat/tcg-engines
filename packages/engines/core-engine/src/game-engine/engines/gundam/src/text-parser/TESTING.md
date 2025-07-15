# Gundam Text Parser Test Suite

This document provides an overview of the test suite created for the Gundam card text parser.

## Test Suite Components

The test suite consists of several components:

1. **Individual Card Tests** (`st01-cards.test.ts`): Tests individual card texts with specific assertions to ensure proper parsing.

2. **Comprehensive JSON Tests** (`st01-json.test.ts`): Tests parsing all cards from the ST01 set at once, verifying that each card can be parsed without errors.

3. **Interactive Test Runner** (`run-tests.ts`): A command-line tool for testing the parser with detailed visual output.

4. **Supporting Files**:
   - `package.json` script definitions
   - `TEST_GUIDE.md` with instructions for running tests
   - This summary document

## Test Coverage

The tests cover the following aspects:

1. **Keyword Abilities**:
   - `<Repair>` keyword parsing
   - `<Blocker>` keyword parsing
   - Other keywords as they appear in card text

2. **Effect Types**:
   - Damage effects
   - Draw effects
   - Rest effects
   - Power modification effects
   - And more

3. **Timing Triggers**:
   - Deploy triggers
   - Attack triggers
   - Burst abilities
   - Other timing-based abilities

4. **Card Types**:
   - UNIT cards
   - PILOT cards
   - COMMAND cards
   - BASE cards

## Running Tests

To run tests:

```bash
# Run all parser tests
bun test src/text-parser/__tests__/

# Run interactive test runner
bun test:parser

# Run specific test files
bun test src/text-parser/__tests__/st01-cards.test.ts
bun test src/text-parser/__tests__/st01-json.test.ts
```

## Test Results

The test suite verifies that:

1. All card texts can be parsed without errors
2. Each card with effects generates at least one ability
3. Cards with specific features (keywords, timing triggers, etc.) are parsed correctly

## Future Improvements

Potential improvements to the test suite:

1. **More Detailed Assertions**: Once the parser is more mature, we can add more specific assertions about the structure of parsed abilities.

2. **Additional Card Sets**: Add tests for other Gundam card sets beyond ST01.

3. **Edge Case Testing**: Add specific tests for complex card interactions and unusual text patterns.

4. **Performance Testing**: Add benchmarks to ensure the parser performs efficiently with large datasets.

## Test Examples

Here's a simple example of how a card is tested:

```typescript
test("ST01-001 - Gundam - Repair Keyword", () => {
  const cardText = "<Repair 2> (At the end of your turn, this Unit recovers the specified number of HP.)\n【During Pair】During your turn, all your Units get AP+1.";
  const result = parseGundamText(cardText);
  
  // Verify we have abilities
  expect(result.abilities.length).toBeGreaterThan(0);
  
  // Verify no errors
  expect(result.errors).toHaveLength(0);
});
```

## Resources

For more detailed information on testing, see:

- [TEST_GUIDE.md](./TEST_GUIDE.md) - Detailed guide on running and extending tests
- [run-tests.ts](./run-tests.ts) - Interactive test runner with detailed output
- [st01-cards.test.ts](./\_\_tests\_\_/st01-cards.test.ts) - Individual card tests
- [st01-json.test.ts](./\_\_tests\_\_/st01-json.test.ts) - Complete JSON dataset tests 