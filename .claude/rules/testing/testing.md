---
paths: "**/*.{test,spec}.ts"
---

# Testing Guidelines

## Test Runner

This project uses **Bun's test runner** (Jest-compatible):

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run specific test file
bun test path/to/file.test.ts

# Run tests matching pattern
bun test --filter "pattern"
```

## Test Structure

Use `describe`/`it` blocks:

```typescript
import { describe, it, expect, beforeEach } from "bun:test";

describe("CardInstance", () => {
  describe("createCard", () => {
    it("creates a card with correct owner", () => {
      const card = createCard(definition, playerId);
      expect(card.owner).toBe(playerId);
    });

    it("initializes card as not tapped", () => {
      const card = createCard(definition, playerId);
      expect(card.tapped).toBe(false);
    });
  });
});
```

## Test-Driven Development

Follow the TDD cycle:

1. **Red** - Write a failing test
2. **Green** - Write minimum code to pass
3. **Refactor** - Improve code while tests pass

```typescript
// 1. Write the test first
describe("drawCard", () => {
  it("moves top card from deck to hand", () => {
    const state = createTestState();
    drawCard(state, "player1");
    expect(state.hand.length).toBe(1);
    expect(state.deck.length).toBe(initialDeckSize - 1);
  });
});

// 2. Implement the function
// 3. Refactor as needed
```

## Best Practices

### Test Behavior, Not Implementation
```typescript
// Good - tests observable behavior
it("gains 1 lore when questing", () => {
  const beforeLore = state.players[0].lore;
  quest(state, characterId);
  expect(state.players[0].lore).toBe(beforeLore + character.lore);
});

// Bad - tests internal implementation
it("calls incrementLore function", () => {
  // Testing internal function calls is brittle
});
```

### One Concept Per Test
```typescript
// Good - single assertion focus
it("draws exactly 7 cards during setup", () => {
  expect(state.hand.length).toBe(7);
});

it("leaves deck with correct remaining cards", () => {
  expect(state.deck.length).toBe(60 - 7);
});

// Bad - multiple unrelated assertions
it("setup works correctly", () => {
  expect(state.hand.length).toBe(7);
  expect(state.deck.length).toBe(53);
  expect(state.inkwell.length).toBe(0);
  expect(state.lore).toBe(0);
});
```

### Descriptive Test Names
```typescript
// Good - describes scenario and expectation
it("returns false when card is not in hand", () => {});
it("throws error when deck is empty", () => {});

// Bad - vague names
it("works", () => {});
it("test1", () => {});
```

## Testing Utilities

### createTestEngine

Factory function for creating test engines:

```typescript
import { createTestEngine, createTestPlayers } from "@tcg/core/testing";

describe("Quest move", () => {
  let engine: RuleEngine;

  beforeEach(() => {
    // Create with default 2 players
    engine = createTestEngine(gameDefinition);

    // Or with custom players
    const players = createTestPlayers(4, ["Alice", "Bob", "Charlie", "Dave"]);
    engine = createTestEngine(gameDefinition, players);

    // Or with seed for deterministic tests
    engine = createTestEngine(gameDefinition, undefined, {
      seed: "test-seed-123",
    });
  });

  it("adds lore when character quests", () => {
    // Use the pre-configured engine
  });
});
```

### Move Assertions

```typescript
import {
  expectMoveSuccess,
  expectMoveFailure,
  expectStateProperty,
} from "@tcg/core/testing";

// Assert move succeeds
const result = expectMoveSuccess(engine, "playCard", {
  playerId: "p1",
  data: { cardId: "card-123" },
});
expect(result.patches.length).toBeGreaterThan(0);

// Assert move fails
expectMoveFailure(engine, "invalidMove", { playerId: "p1" }, "CONDITION_FAILED");

// Assert state property
expectStateProperty(engine, "turnNumber", 1);
expectStateProperty(engine, "players[0].score", 10);
```

### Test Card Factory

```typescript
import { createTestCard, createTestCards } from "@tcg/core/testing";

// Create single test card
const card = createTestCard();

// Create card with overrides
const creature = createTestCard({
  name: "Dragon",
  type: "creature",
  basePower: 5,
  baseToughness: 5,
  baseCost: 7,
});

// Create multiple cards
const deck = createTestCards(60, { type: "creature" });
```

## Integration Tests

For testing game mechanics end-to-end:

```typescript
describe("Full game scenario", () => {
  it("player wins by reaching 20 lore", () => {
    const engine = createTestEngine(gameDefinition);

    // Play through turns
    expectMoveSuccess(engine, "drawCard", { playerId: "p1" });
    expectMoveSuccess(engine, "playCard", {
      playerId: "p1",
      data: { cardId: "c1" },
    });

    // ... continue game

    expect(engine.getState().winner).toBe("p1");
  });
});
```

## Coverage Target

**95%+ code coverage** is required.

```bash
# Run tests with coverage
bun test --coverage
```

## Reference

Full testing standards: `agent-os/standards/testing/`
