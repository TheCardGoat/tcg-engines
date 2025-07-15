# Gundam Text Parser Test Suite Updates

This document describes the comprehensive test suite created for the Gundam card text parser.

## Test Files Added

The following test files have been added to test the parser against all card sets:

1. `__tests__/st01-cards.test.ts` - Tests for ST01 (Heroic Beginnings) cards
2. `__tests__/st02-cards.test.ts` - Tests for ST02 (Dark Advent) cards
3. `__tests__/st03-cards.test.ts` - Tests for ST03 (Fierce Attack) cards
4. `__tests__/st04-cards.test.ts` - Tests for ST04 (Celestial Assault) cards
5. `__tests__/gd01-cards.test.ts` - Tests for GD01 (first major expansion) cards
6. `__tests__/beta-cards.test.ts` - Tests for Beta cards
7. `__tests__/promotion-cards.test.ts` - Tests for Promotional cards
8. `__tests__/all-cards.test.ts` - Comprehensive tests across all card sets

## Test Coverage

The test suite covers:

1. **Basic parsing validity** - Ensuring all cards can be parsed without errors
2. **Card types** - Testing cards of each type (UNIT, PILOT, COMMAND, BASE)
3. **Effect types** - Testing various ability patterns:
   - Keyword abilities (<Repair>, <Blocker>, <Breach>, etc.)
   - Timing triggers (Deploy, Burst, Attack, When Paired, etc.)
   - Special effects (drawing cards, dealing damage, etc.)
4. **Cross-set compatibility** - Testing the same effect types across different sets
5. **Complex cards** - Testing cards with multiple effects or complex text

## Running the Tests

Several npm scripts have been added to run different subsets of the tests:

```bash
# Run all tests
npm test

# Run the interactive test script
npm run test:parser

# Run only ST01 card tests
npm run test:st01

# Run tests for all card sets (individual files)
npm run test:cards

# Run the comprehensive cross-set tests
npm run test:all-cards

# Run tests for the four starter sets
npm run test:sets
```

## Test Structure

Each test file follows a similar pattern:

1. **Helper Functions** - For cleaning card text and standardizing test cases
2. **Sample Card Tests** - Tests a representative sample of cards from the set
3. **Effect Type Tests** - Tests cards with specific effect patterns
4. **Card Type Tests** - Tests cards of each type (UNIT, PILOT, COMMAND, BASE)
5. **Complex Card Tests** - Tests cards with multiple or complex abilities

## Card Selection Strategy

To keep test execution fast, the test suite uses several strategies:

1. **Sampling** - Tests a limited number of cards from each set
2. **Pattern Matching** - Selects cards with specific patterns to test
3. **Random Selection** - Uses random sampling for broader coverage
4. **Cross-Set Testing** - Tests the same effect types across different sets

## Adding More Tests

To add tests for new card sets:

1. Create a new test file following the pattern of existing files
2. Import the card data from the appropriate JSON file
3. Add pattern-specific tests for any new effect types
4. Include the new set in the all-cards.test.ts file

## Future Improvements

Potential improvements to the test suite:

1. **Property-Based Testing** - Generate random card text and verify parsing
2. **Performance Benchmarking** - Measure parsing speed for large sets
3. **Coverage Analysis** - Track which effect patterns are covered by tests
4. **Visual Reporting** - Generate visual reports of test results
5. **Automated Regression Testing** - Add CI integration for continuous testing 