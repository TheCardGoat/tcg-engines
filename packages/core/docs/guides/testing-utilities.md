# Testing Utilities Guide

> Complete guide to TDD workflow and test utilities in @tcg/core

## Overview

The `@tcg/core/testing` module provides comprehensive utilities for testing game engines using Test-Driven Development (TDD). These utilities eliminate test boilerplate, ensure consistent testing patterns, and make it easy to write robust tests for your game logic.

## Table of Contents

- [Quick Start](#quick-start)
- [Test Builders](#test-builders)
- [Assertions](#assertions)
- [Factories](#factories)
- [RNG Testing](#rng-testing)
- [Replay Testing](#replay-testing)
- [TDD Workflow](#tdd-workflow)
- [Best Practices](#best-practices)
- [Examples](#examples)

## Quick Start

```typescript
import {
  expectMoveSuccess,
  expectStateProperty,
  createTestCard,
  createTestDeck,
  withSeed,
} from '@tcg/core/testing';
import { RuleEngine } from '@tcg/core';

// 1. Create test game setup
const gameDefinition = { /* your game */ };
const engine = new RuleEngine(gameDefinition, players, { seed: 'test' });

// 2. Execute and test moves
expectMoveSuccess(engine, 'playCard', {
  playerId: 'p1',
  data: { cardId: 'card-123' }
});

// 3. Verify state changes
expectStateProperty(engine, 'players[0].hand.length', 6);
expectStateProperty(engine, 'field.length', 1);

// 4. Test with deterministic RNG
const shuffled = withSeed('test-seed', (rng) => {
  return rng.shuffle([1, 2, 3, 4, 5]);
});
```

## Test Builders

### Creating Test Engines

The easiest way to create a test engine with sensible defaults:

```typescript
import { createTestEngine } from '@tcg/core/testing';

// Create with default 2 players
const engine = createTestEngine(gameDefinition);

// Create with custom players
const players = createTestPlayers(4, ['Alice', 'Bob', 'Charlie', 'Dave']);
const engine = createTestEngine(gameDefinition, players);

// Create with deterministic seed
const engine = createTestEngine(gameDefinition, undefined, {
  seed: 'test-seed-123'
});
```

**Benefits:**
- No boilerplate player setup
- Automatic seeding for deterministic tests
- Ready-to-use engine instance

### Creating Test Players

```typescript
import { createTestPlayers } from '@tcg/core/testing';

// Create 2 players with default names
const players = createTestPlayers();
// Result: [
//   { id: 'player-0', name: 'Player 1' },
//   { id: 'player-1', name: 'Player 2' }
// ]

// Create custom number of players
const players = createTestPlayers(4);

// Create with custom names
const players = createTestPlayers(3, ['Alice', 'Bob', 'Charlie']);

// Mix of custom and default names
const players = createTestPlayers(4, ['Alice', 'Bob']);
// Result: Alice, Bob, Player 3, Player 4
```

### Creating Test State

```typescript
import { createTestState } from '@tcg/core/testing';

// Define your state type
type GameState = {
  turnNumber: number;
  players: Player[];
  currentPlayer: number;
};

// Create with defaults
const state = createTestState<GameState>({
  turnNumber: 1,
  players: [],
  currentPlayer: 0,
});

// Create with overrides
const state = createTestState<GameState>({
  turnNumber: 1,
  players: [],
  currentPlayer: 0,
}, {
  turnNumber: 5,
  currentPlayer: 1,
});
```

## Assertions

### Move Assertions

#### expectMoveSuccess

Execute a move and verify it succeeds:

```typescript
import { expectMoveSuccess } from '@tcg/core/testing';

const result = expectMoveSuccess(engine, 'playCard', {
  playerId: 'p1',
  data: { cardId: 'card-123' }
});

// Result includes patches for further inspection
expect(result.patches.length).toBeGreaterThan(0);
```

**Throws if:**
- Move fails
- Move condition is not met
- Move reducer throws error

#### expectMoveFailure

Verify a move fails as expected:

```typescript
import { expectMoveFailure } from '@tcg/core/testing';

// Assert move fails (any error)
expectMoveFailure(engine, 'invalidMove', {
  playerId: 'p1'
});

// Assert move fails with specific error code
const result = expectMoveFailure(
  engine,
  'playCard',
  { playerId: 'p1', data: { cardId: 'invalid' } },
  'CONDITION_FAILED'
);

expect(result.error).toContain('card not found');
```

**Throws if:**
- Move succeeds
- Error code doesn't match expected

### State Assertions

#### expectStateProperty

Verify state properties with dot notation and array indexing:

```typescript
import { expectStateProperty } from '@tcg/core/testing';

// Simple properties
expectStateProperty(engine, 'turnNumber', 1);
expectStateProperty(engine, 'phase', 'draw');

// Array indexing
expectStateProperty(engine, 'players[0].name', 'Alice');
expectStateProperty(engine, 'players[1].score', 10);

// Nested properties
expectStateProperty(engine, 'players[0].zones.hand.length', 7);
expectStateProperty(engine, 'gameState.victory.winner', 'p1');

// Array lengths
expectStateProperty(engine, 'deck.cards.length', 40);
```

**Features:**
- Dot notation: `'nested.deep.value'`
- Array indexing: `'array[0].property'`
- Helpful error messages with available paths
- Type-safe property access

**Throws if:**
- Property path not found
- Value doesn't match expected

### Flow Assertions

#### expectPhaseTransition

Verify phase/turn transitions:

```typescript
import { expectPhaseTransition } from '@tcg/core/testing';

// Verify phase changed
expectPhaseTransition(engine, 'draw', 'main');

// Execute move and verify phase change
expectMoveSuccess(engine, 'endPhase', { playerId: 'p1' });
expectPhaseTransition(engine, 'main', 'combat');
```

**Use Cases:**
- Turn phase progression
- Segment transitions
- Flow validation

### Game End Assertions

#### expectGameEnd

Verify game has ended with specific winner:

```typescript
import { expectGameEnd } from '@tcg/core/testing';

// Execute winning move
expectMoveSuccess(engine, 'attack', {
  playerId: 'p1',
  data: { targetPlayer: 'p2' }
});

// Verify game ended with correct winner
expectGameEnd(engine, 'p1');
```

#### expectGameNotEnded

Verify game is still in progress:

```typescript
import { expectGameNotEnded } from '@tcg/core/testing';

expectMoveSuccess(engine, 'playCard', { playerId: 'p1' });
expectGameNotEnded(engine);
```

## Factories

### Card Factory

Create test cards with sensible defaults:

```typescript
import { createTestCard, createTestCards, resetCardCounter } from '@tcg/core/testing';

// Create single card
const card = createTestCard();
// { id: 'test-card-0', name: 'Test Card 1', type: 'creature', ... }

// Create with custom properties
const dragon = createTestCard({
  name: 'Dragon',
  type: 'creature',
  basePower: 5,
  baseToughness: 5,
  baseCost: 7
});

// Create multiple cards
const creatures = createTestCards(10, { type: 'creature' });
const spells = createTestCards(5, { type: 'spell', baseCost: 3 });

// Reset counter for deterministic IDs
resetCardCounter();
const card1 = createTestCard(); // test-card-0
const card2 = createTestCard(); // test-card-1
```

### Zone Factory

Create test zones with pre-configured cards:

```typescript
import {
  createTestZone,
  createTestDeck,
  createTestHand,
  createTestPlayArea,
  createTestGraveyard,
} from '@tcg/core/testing';

// Generic test zone
const zone = createTestZone(
  { visibility: 'public', ordered: false },
  ['card1', 'card2', 'card3']
);

// Specialized zones
const deck = createTestDeck(['card1', 'card2'], 'p1');
const hand = createTestHand(['card3', 'card4'], 'p1');
const playArea = createTestPlayArea(['card5'], 'p1');
const graveyard = createTestGraveyard(['card6'], 'p1');

// Empty zones
const emptyDeck = createTestDeck();
```

**Features:**
- Automatic zone ID generation
- Correct default configs (visibility, ordering)
- Player-specific zones
- Pre-populated with cards

## RNG Testing

### Deterministic Testing

```typescript
import { withSeed, createDeterministicRNG } from '@tcg/core/testing';

// Execute code with seeded RNG
const result = withSeed('test-seed', (rng) => {
  return rng.shuffle([1, 2, 3, 4, 5]);
});

// Same seed = same result
const result1 = withSeed('seed-1', (rng) => rng.rollDice(20));
const result2 = withSeed('seed-1', (rng) => rng.rollDice(20));
expect(result1).toBe(result2);

// Create reusable RNG
const rng = createDeterministicRNG('test-seed');
const roll1 = rng.rollDice(6);
const roll2 = rng.rollDice(6);
```

### Testing RNG Behavior

```typescript
import { expectDeterministicBehavior } from '@tcg/core/testing';

// Verify function produces same output with same seed
expectDeterministicBehavior(
  (rng) => rng.shuffle([1, 2, 3, 4]),
  'test-seed'
);

// Test game move with RNG
expectDeterministicBehavior(
  (rng) => {
    const engine = createTestEngine(gameDefinition, players, {
      seed: rng.getSeed()
    });
    expectMoveSuccess(engine, 'drawCard', { playerId: 'p1' });
    return engine.getState();
  },
  'game-seed'
);
```

### Multiple Seeds Testing

Test behavior across different random scenarios:

```typescript
import { testWithMultipleSeeds } from '@tcg/core/testing';

// Test with 10 different random scenarios
const results = testWithMultipleSeeds(10, (rng) => {
  const engine = createTestEngine(gameDefinition, players, {
    seed: rng.getSeed()
  });

  expectMoveSuccess(engine, 'shuffleDeck', { playerId: 'p1' });
  return engine.getState();
});

// Verify consistent behavior across all seeds
results.forEach(state => {
  expect(state.deck.length).toBe(60);
});
```

### Predictable Sequences

Create deterministic sequences for testing:

```typescript
import { createPredictableSequence } from '@tcg/core/testing';

// Create sequence that always returns same values
const sequence = createPredictableSequence([
  0.1, 0.5, 0.9, 0.3, 0.7
]);

expect(sequence()).toBe(0.1);
expect(sequence()).toBe(0.5);
expect(sequence()).toBe(0.9);
expect(sequence()).toBe(0.3);
expect(sequence()).toBe(0.7);
expect(sequence()).toBe(0.1); // Wraps around
```

## Replay Testing

### Deterministic Replay Verification

```typescript
import { expectDeterministicReplay } from '@tcg/core/testing';

// Create engine with seed
const engine = createTestEngine(gameDefinition, players, {
  seed: 'game-123'
});

// Execute moves
expectMoveSuccess(engine, 'shuffleDeck', { playerId: 'p1' });
expectMoveSuccess(engine, 'drawCard', { playerId: 'p1' });
expectMoveSuccess(engine, 'playCard', { playerId: 'p1', data: { cardId: 'card-1' } });

// Verify replay produces identical state
expectDeterministicReplay(engine);
```

**What it verifies:**
- Replay from history produces identical state
- All RNG calls are deterministic
- State is fully reproducible
- No hidden mutation or non-determinism

## TDD Workflow

### Red-Green-Refactor Cycle

#### 1. Red: Write Failing Test

```typescript
import { describe, test, expect } from 'bun:test';
import { createTestEngine, expectMoveSuccess, expectStateProperty } from '@tcg/core/testing';

describe('PlayCard Move', () => {
  test('should move card from hand to field', () => {
    const engine = createTestEngine(gameDefinition);

    // This will fail because move doesn't exist yet
    expectMoveSuccess(engine, 'playCard', {
      playerId: 'p1',
      data: { cardId: 'card-1' }
    });

    expectStateProperty(engine, 'hand.length', 6);
    expectStateProperty(engine, 'field.length', 1);
  });
});
```

#### 2. Green: Implement Minimum Code

```typescript
const gameDefinition: GameDefinition<GameState, GameMoves> = {
  name: 'My Game',
  setup: (players) => ({ /* ... */ }),
  moves: {
    playCard: {
      reducer: (draft, context) => {
        const cardId = context.data?.cardId as string;

        // Remove from hand
        const index = draft.hand.indexOf(cardId);
        draft.hand.splice(index, 1);

        // Add to field
        draft.field.push(cardId);
      }
    }
  }
};
```

#### 3. Refactor: Improve Code

```typescript
// Extract to helper
function playCardFromHand(draft: GameState, cardId: CardId) {
  const { fromZone, toZone } = moveCard(
    draft.hand,
    draft.field,
    cardId
  );
  draft.hand = fromZone;
  draft.field = toZone;
}

// Use in move
moves: {
  playCard: {
    reducer: (draft, context) => {
      playCardFromHand(draft, context.data?.cardId as CardId);
    }
  }
}
```

### Test Organization

```typescript
describe('Game Engine: Combat System', () => {
  let engine: RuleEngine<GameState, GameMoves>;

  beforeEach(() => {
    // Setup before each test
    engine = createTestEngine(gameDefinition, createTestPlayers(2), {
      seed: 'test-combat'
    });
  });

  describe('Attack Move', () => {
    test('successful attack reduces defender life', () => {
      // Arrange
      expectStateProperty(engine, 'players[1].life', 20);

      // Act
      expectMoveSuccess(engine, 'attack', {
        playerId: 'p1',
        data: { attackerId: 'creature-1', defenderId: 'p2' }
      });

      // Assert
      expectStateProperty(engine, 'players[1].life', 17);
    });

    test('attack with invalid creature fails', () => {
      expectMoveFailure(engine, 'attack', {
        playerId: 'p1',
        data: { attackerId: 'invalid', defenderId: 'p2' }
      }, 'INVALID_CREATURE');
    });
  });

  describe('Block Move', () => {
    // ... more tests
  });
});
```

## Best Practices

### 1. Use Deterministic Seeds

```typescript
// GOOD - Deterministic and reproducible
const engine = createTestEngine(gameDefinition, players, {
  seed: 'test-draw-phase'
});

// BAD - Non-deterministic
const engine = createTestEngine(gameDefinition, players, {
  seed: `${Math.random()}`
});
```

### 2. Test One Thing Per Test

```typescript
// GOOD - Single responsibility
test('playCard moves card from hand to field', () => {
  expectMoveSuccess(engine, 'playCard', context);
  expectStateProperty(engine, 'field.length', 1);
});

test('playCard reduces player mana', () => {
  expectMoveSuccess(engine, 'playCard', context);
  expectStateProperty(engine, 'players[0].mana', 7);
});

// BAD - Testing too much
test('playCard does everything correctly', () => {
  // 50 lines of assertions...
});
```

### 3. Use Descriptive Test Names

```typescript
// GOOD
test('should reject attack when creature has summoning sickness', () => {});
test('should deal damage to player when creature is unblocked', () => {});

// BAD
test('attack works', () => {});
test('test combat', () => {});
```

### 4. Setup Common Scenarios

```typescript
// Create reusable test scenarios
function createGameWithCreaturesInPlay() {
  const engine = createTestEngine(gameDefinition);
  const creatures = createTestCards(3, { type: 'creature' });

  // Setup game state
  for (const creature of creatures) {
    expectMoveSuccess(engine, 'playCard', {
      playerId: 'p1',
      data: { cardId: creature.id }
    });
  }

  return { engine, creatures };
}

// Use in tests
test('attack with creature', () => {
  const { engine, creatures } = createGameWithCreaturesInPlay();

  expectMoveSuccess(engine, 'attack', {
    playerId: 'p1',
    data: { attackerId: creatures[0].id }
  });
});
```

### 5. Test Both Success and Failure Paths

```typescript
describe('Draw Card Move', () => {
  test('successfully draws card when deck has cards', () => {
    expectMoveSuccess(engine, 'drawCard', { playerId: 'p1' });
    expectStateProperty(engine, 'hand.length', 8);
  });

  test('fails when deck is empty', () => {
    // Empty the deck first
    for (let i = 0; i < 60; i++) {
      expectMoveSuccess(engine, 'drawCard', { playerId: 'p1' });
    }

    // Now should fail
    expectMoveFailure(engine, 'drawCard', { playerId: 'p1' }, 'DECK_EMPTY');
  });
});
```

### 6. Verify Deterministic Replay

```typescript
test('game replay is deterministic', () => {
  const engine = createTestEngine(gameDefinition, players, {
    seed: 'replay-test'
  });

  // Execute random moves
  expectMoveSuccess(engine, 'shuffleDeck', { playerId: 'p1' });
  expectMoveSuccess(engine, 'drawCards', { playerId: 'p1', data: { count: 7 } });
  expectMoveSuccess(engine, 'playCard', { playerId: 'p1', data: { cardId: 'card-1' } });

  // Verify replay works
  expectDeterministicReplay(engine);
});
```

## Examples

### Complete Test Suite Example

```typescript
import { describe, test, beforeEach } from 'bun:test';
import {
  createTestEngine,
  createTestPlayers,
  expectMoveSuccess,
  expectMoveFailure,
  expectStateProperty,
  expectGameEnd,
  expectDeterministicReplay,
  createTestCards,
} from '@tcg/core/testing';

describe('Card Game: Full Integration', () => {
  let engine: RuleEngine<GameState, GameMoves>;
  let players: Player[];
  let cards: CardDefinition[];

  beforeEach(() => {
    players = createTestPlayers(2, ['Alice', 'Bob']);
    cards = createTestCards(10);
    engine = createTestEngine(gameDefinition, players, {
      seed: 'integration-test'
    });
  });

  describe('Game Setup', () => {
    test('initializes with correct starting state', () => {
      expectStateProperty(engine, 'turnNumber', 1);
      expectStateProperty(engine, 'players.length', 2);
      expectStateProperty(engine, 'players[0].name', 'Alice');
      expectStateProperty(engine, 'players[1].name', 'Bob');
    });
  });

  describe('Draw Phase', () => {
    test('draws card at start of turn', () => {
      expectStateProperty(engine, 'players[0].hand.length', 7);

      expectMoveSuccess(engine, 'drawCard', {
        playerId: players[0].id
      });

      expectStateProperty(engine, 'players[0].hand.length', 8);
    });
  });

  describe('Play Phase', () => {
    test('plays creature from hand', () => {
      const cardId = cards[0].id;

      expectMoveSuccess(engine, 'playCard', {
        playerId: players[0].id,
        data: { cardId }
      });

      expectStateProperty(engine, 'players[0].hand.length', 6);
      expectStateProperty(engine, 'field.length', 1);
    });
  });

  describe('Combat Phase', () => {
    test('attack reduces opponent life', () => {
      // Setup attacker
      expectMoveSuccess(engine, 'playCreature', {
        playerId: players[0].id,
        data: { cardId: cards[0].id }
      });

      // Attack
      expectMoveSuccess(engine, 'attack', {
        playerId: players[0].id,
        data: {
          attackerId: cards[0].id,
          defenderId: players[1].id
        }
      });

      expectStateProperty(engine, 'players[1].life', 19);
    });
  });

  describe('Win Condition', () => {
    test('game ends when player reaches 0 life', () => {
      // Reduce life to 0
      for (let i = 0; i < 20; i++) {
        expectMoveSuccess(engine, 'dealDamage', {
          playerId: players[0].id,
          data: { targetId: players[1].id, amount: 1 }
        });
      }

      expectGameEnd(engine, players[0].id);
    });
  });

  describe('Replay', () => {
    test('full game is deterministically replayable', () => {
      // Play a full game
      expectMoveSuccess(engine, 'drawCard', { playerId: players[0].id });
      expectMoveSuccess(engine, 'playCard', { playerId: players[0].id, data: { cardId: cards[0].id } });
      expectMoveSuccess(engine, 'endTurn', { playerId: players[0].id });
      expectMoveSuccess(engine, 'drawCard', { playerId: players[1].id });

      // Verify deterministic
      expectDeterministicReplay(engine);
    });
  });
});
```

## Related Documentation

- [Zone Operations Guide](./zone-operations.md) - Zone management utilities
- [Card Tooling Guide](./card-tooling.md) - Card parsing and generation
- [Validation Guide](./validation.md) - Type guards and validators
- [Examples: Test Patterns](../examples/test-patterns.ts) - Runnable test examples

## Migration from Custom Test Utils

```typescript
// OLD (custom test utilities)
function expectSuccess(result) {
  expect(result.success).toBe(true);
}

function expectStateValue(engine, path, value) {
  const state = engine.getState();
  const actual = eval(`state.${path}`);
  expect(actual).toBe(value);
}

// NEW (@tcg/core/testing)
import { expectMoveSuccess, expectStateProperty } from '@tcg/core/testing';

expectMoveSuccess(engine, 'move', context);
expectStateProperty(engine, 'players[0].score', 10);
```

**Benefits:**
- Type-safe property access
- Better error messages
- Consistent API
- No eval() anti-pattern
