# Spec Requirements Document

> Spec: Lorcana Set 008 Actions Migration to Core Framework
> Created: 2025-10-05

## Overview

Migrate all 27 action card definitions and tests from the Lorcana Set 008 actions folder to work with the new Core Engine framework, ensuring 100% test coverage is maintained while updating APIs, card definitions, and framework capabilities as needed. This migration validates the framework's ability to handle real-world card effects and establishes the pattern for migrating the remaining Lorcana cards.

## User Stories

### Framework Developer Story

As a framework developer, I want to migrate existing Lorcana action cards to the new Core Engine framework one test at a time, so that I can validate the framework handles all card effects, identify missing APIs, and ensure no functionality is lost during the migration.

**Detailed Workflow:**
1. Select a card definition and its test file from the 008/actions folder
2. Run the existing test to see if it passes with the current framework
3. If test fails, identify the root cause (API change, missing effect handler, or card definition format)
4. Update the test to use new APIs if needed
5. Update card definition to match new specification format if needed
6. Extend the framework with new effect handlers if the effect type is not yet supported
7. Verify test passes with all edge cases covered
8. Request human confirmation before moving to next card
9. Repeat for all 27 action cards

### Quality Assurance Story

As a QA engineer, I want each migrated card to maintain its original test coverage and behavior, so that we can be confident the new framework produces identical game logic to the old implementation.

**Detailed Workflow:**
1. Compare old test assertions with new test assertions
2. Verify all game state changes are tested (zone changes, stat modifications, triggered effects)
3. Ensure edge cases are covered (optional targets, missing targets, timing effects)
4. Validate test names clearly describe the card's behavior
5. Confirm no tests are skipped or marked as incomplete after migration

## Spec Scope

1. **Test API Migration** - Update all 27 test files to use the new TestEngine APIs and assertion patterns while maintaining identical test coverage.

2. **Card Definition Migration** - Convert all 27 card definitions from old specification format to new framework format, ensuring all abilities, effects, and metadata are correctly represented.

3. **Effect Handler Implementation** - Identify and implement any missing effect handlers in the Core Engine framework needed to support the action cards' abilities (stat buffs, zone changes, triggers, conditional effects).

4. **One-by-One Migration Process** - Migrate cards sequentially with human confirmation after each card to ensure quality and allow for course correction.

5. **Migration Pattern Documentation** - Establish reusable patterns and helper functions that can be applied to migrating the remaining Lorcana card sets.

## Out of Scope

- Migration of cards outside the `packages/engines/core-engine/src/game-engine/engines/lorcana/src/cards/definitions/008/actions` folder
- Changes to the Core Engine architecture itself (unless absolutely required for missing functionality)
- Performance optimization of tests or framework (focus is on functionality parity)
- UI/frontend changes or test visualization
- Migration of character, item, or location cards from set 008
- Automated migration tooling (manual review ensures quality)

## Expected Deliverable

1. **All 27 Action Cards Passing Tests** - Every card in the 008/actions folder has a passing test that validates its complete behavior using the new Core Engine framework.

2. **Zero Skipped or Incomplete Tests** - No tests are marked with `.skip()`, `notImplemented: true`, or `missingTestCase: true` flags after migration.

3. **Framework Enhancement Documentation** - Clear documentation of any new effect handlers, API methods, or framework capabilities added during the migration process.

4. **Migration Pattern Guide** - A documented set of common patterns encountered during migration with solutions, serving as a reference for migrating remaining card sets.
