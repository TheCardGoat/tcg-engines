# Gundam Text Parser Test Guide

This guide explains how to run and interpret tests for the Gundam card text parser.

## Available Tests

The Gundam text parser includes several types of tests:

1. **Unit Tests**: Tests for specific parser functionality
2. **Card-Specific Tests**: Tests using real card text from the ST01 set
3. **Interactive Test Runner**: A CLI tool to visualize parser output

## Running Tests

### Standard Test Suite

To run all tests:

```bash
# From the gundam-engine directory
bun test
```

To run only text parser tests:

```bash
bun test:st01
```

### Interactive Test Runner

For a more visual experience with detailed output:

```bash
bun test:parser
```

This runs the interactive test runner which:
- Shows formatted output in the terminal
- Tests specific example cards
- Runs tests on all ST01 cards
- Shows statistics on card types and effect coverage

## Test Structure

The tests are organized as follows:

- `__tests__/st01-cards.test.ts` - Tests for specific card examples
- `__tests__/st01-json.test.ts` - Tests parsing all cards from the ST01 set
- `run-tests.ts` - Interactive test runner script

## Creating New Tests

### Adding Individual Card Tests

To add a new card test, modify `__tests__/st01-cards.test.ts` and add a new test case:

```typescript
test("ST01-XXX - Card Name - Feature", () => {
  const cardText = "Card text goes here";
  const result = parseGundamText(cardText);
  
  // Add assertions
  expect(result.abilities).toHaveLength(2);
  expect(result.abilities[0].type).toBe("expected-type");
});
```

### Testing New Effect Types

To test new effect types, add them to the "Effect Type Coverage" section in `__tests__/st01-json.test.ts`:

```typescript
test("New effect type", () => {
  const cardsWithNewEffect = getCardsWithEffectType("new-effect-type");
  console.log(`Found ${cardsWithNewEffect.length} cards with new effect type`);
  expect(cardsWithNewEffect.length).toBeGreaterThan(0);
});
```

## Troubleshooting

### Common Issues

1. **HTML Entity Problems**: Card text from JSON may contain HTML entities (`&lt;`, `&gt;`, etc.). The `cleanCardText()` function handles these.

2. **Complex Card Text**: Some cards have very complex text with multiple interrelated effects. These may require special handling in the parser.

3. **Unexpected Symbols**: Japanese card texts sometimes contain unique symbols. Make sure the parser handles these correctly.

### Fixing Failures

When a test fails:

1. Check the parser output for errors and warnings
2. Examine the specific card text that failed
3. Consider if the parser needs enhancements to handle this case
4. Add specific test cases for edge cases

## Understanding Test Output

The test output includes:

- **Parsed abilities**: The structured representation of card effects
- **Effect counts**: Statistics on different effect types found
- **Success/failure rates**: How many cards were successfully parsed
- **Warnings**: Minor issues that didn't prevent parsing

## Next Steps

After ensuring the text parser correctly handles all ST01 cards, consider:

1. Expanding to other card sets
2. Adding more edge case tests
3. Integrating with the game engine
4. Performance optimization for large sets 