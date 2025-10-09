# Gundam Card Game Engine - Test Specification

**Status**: Specification Complete  
**Created**: 2025-10-09  
**Purpose**: Define comprehensive end-to-end test cases for Gundam Card Game engine implementation

## Quick Start

1. **Read the main spec**: [spec.md](./spec.md) - High-level requirements and objectives
2. **Review test coverage**: [test-case-summary.md](./test-case-summary.md) - Complete test matrix
3. **Follow implementation guide**: [implementation-guide.md](./implementation-guide.md) - Step-by-step instructions
4. **Study detailed tests**: [sub-specs/](./sub-specs/) - All test cases by category

## Document Structure

```
2025-10-09-gundam-game-engine-test-spec/
├── README.md                           # This file
├── spec.md                             # Main specification document
├── spec-lite.md                        # Condensed summary
├── test-case-summary.md                # Test coverage matrix
├── implementation-guide.md             # Implementation instructions
└── sub-specs/
    ├── technical-spec.md               # Technical overview & architecture
    ├── 01-game-setup-tests.md          # Game initialization & win conditions (19 tests)
    ├── 02-zone-management-tests.md     # All game locations & transitions (28 tests)
    ├── 03-turn-flow-tests.md           # Turn structure & phases (23 tests)
    ├── 04-battle-system-tests.md       # Complete battle flow (25 tests)
    └── 05-effects-keywords-tests.md    # Effects & keyword mechanics (17 tests)
```

## Test Coverage

This specification defines **112 comprehensive test cases** covering all aspects of the Gundam Card Game Comprehensive Rules Ver. 1.0:

| Category | Tests | Rules |
|----------|-------|-------|
| Setup & Win Conditions | 19 | 1-2, 5-1, 5-2 |
| Zone Management | 28 | 3-1 to 3-9 |
| Turn Flow & Phases | 23 | 6-1 to 6-6, 8-1 to 8-5 |
| Battle System | 25 | 7-1 to 7-7 |
| Effects & Keywords | 17 | 9-1 to 9-3, 11-1, 11-2 |

## Test Philosophy

All tests follow the **Precondition → Action → Assertion** pattern:

```typescript
it("validates specific rule (Rule X-Y-Z)", () => {
  // PRECONDITION: Setup game state
  const game = createTestGame({ /* ... */ });
  
  // ACTION: Execute player moves
  const result = game.executeMove(/* ... */);
  
  // ASSERTION: Verify state changes
  expect(result.success).toBe(true);
  expect(game.getState().property).toBe(expectedValue);
});
```

### Core Principles

- ✅ **Immutability**: State never mutates, always returns new state
- ✅ **Type Safety**: Full TypeScript, no `any` types
- ✅ **Rule References**: Every test cites its rule number
- ✅ **Determinism**: Same inputs always produce same outputs
- ✅ **Black Box**: Tests use public API only
- ✅ **Comprehensive**: Both success and failure cases covered

## Implementation Phases

1. **Week 1**: Test infrastructure and helpers
2. **Week 2**: Game setup tests
3. **Week 3**: Zone management tests
4. **Week 4**: Turn flow tests
5. **Week 5**: Battle system tests
6. **Week 6**: Effects & keywords tests
7. **Week 7**: Integration tests
8. **Week 8**: Final validation

See [implementation-guide.md](./implementation-guide.md) for detailed phase breakdowns.

## Key Features

### Test Helper Utilities

Reusable helpers for common operations:
- `createTestGame(config)` - Setup game with specific state
- `createDeck()`, `createUnit()`, etc. - Card factories
- `getActivePlayer()`, `getCurrentPhase()` - State queries
- `deployUnit()`, `declareAttack()` - Action helpers

### Rule Coverage Matrix

Every test maps to specific rules:
- Test 1.1.1 → Rule 5-1-1 (Deck size)
- Test 4.1.1 → Rule 7-3-1 (Attack declaration)
- Test 5.1.1 → Rule 11-1-1 (<Repair> keyword)

### Integration with Core Engine

All tests leverage existing infrastructure:
- Type system from `@tcg-engine/core`
- Move definition patterns
- State management
- Result types for error handling

## Success Criteria

The specification is complete when:
- ✅ All 112 test cases defined with clear preconditions, actions, and assertions
- ✅ Every comprehensive rule has corresponding test coverage
- ✅ Implementation guide provides clear step-by-step instructions
- ✅ Test helpers specified for reusable functionality
- ✅ Both success and failure scenarios documented

## Next Actions

1. **For Developers**: Read [implementation-guide.md](./implementation-guide.md) and start with Phase 1
2. **For Reviewers**: Verify test coverage against [test-case-summary.md](./test-case-summary.md)
3. **For Designers**: Use tests as specification for card effects and mechanics

## Related Documents

- **Comprehensive Rules**: `packages/engines/core-engine/src/game-engine/engines/gundam/RULES.md`
- **Core Engine Docs**: `packages/core/docs/`
- **Existing Tests**: `packages/engines/core-engine/src/game-engine/engines/gundam/src/**/*.spec.ts`

## Questions?

For questions or clarifications:
1. Check the [implementation-guide.md](./implementation-guide.md) for common patterns
2. Review detailed test cases in [sub-specs/](./sub-specs/)
3. Refer to the comprehensive rules document
4. Look at existing test patterns in the codebase

---

**Ready to implement?** Start with [implementation-guide.md](./implementation-guide.md) Phase 1: Test Infrastructure.

