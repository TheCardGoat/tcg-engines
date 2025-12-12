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
bun test --grep "pattern"
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

### TestEngineBuilder

```typescript
import { TestEngineBuilder } from "@tcg/core/testing";

describe("Quest move", () => {
  let engine: RuleEngine;

  beforeEach(() => {
    engine = new TestEngineBuilder(gameDefinition)
      .withPlayer("player1", { deck: testDeck })
      .withPlayer("player2", { deck: testDeck })
      .setupGame()
      .build();
  });

  it("adds lore when character quests", () => {
    // Use the pre-configured engine
  });
});
```

### Assertions

```typescript
import {
  assertZoneContains,
  assertCardInZone,
  assertPlayerHasLore,
} from "@tcg/core/testing";

// Zone assertions
assertZoneContains(state, "player1", "hand", 7);
assertCardInZone(state, cardId, "play");

// Player assertions
assertPlayerHasLore(state, "player1", 5);
```

### Test Card Factory

```typescript
import { TestCardFactory } from "@tcg/core/testing";

const factory = new TestCardFactory();
const testCard = factory.createCharacter({
  name: "Test Character",
  cost: 3,
  strength: 2,
  willpower: 3,
});
```

## Integration Tests

For testing game mechanics end-to-end:

```typescript
describe("Full game scenario", () => {
  it("player wins by reaching 20 lore", () => {
    const engine = createTestEngine();

    // Play through turns
    engine.executeMove({ type: "drawCard", playerId: "p1" });
    engine.executeMove({ type: "playCard", playerId: "p1", cardId: "c1" });

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
