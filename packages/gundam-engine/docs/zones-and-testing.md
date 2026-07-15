# Gundam Card Game - Zone Structure and Testing Patterns

This document describes the zone structure for the Gundam Card Game and demonstrates best practices for testing using `@tcg/core` utilities.

## Table of Contents

1. [Zone Structure](#zone-structure)
2. [Zone Operations](#zone-operations)
3. [Testing Patterns](#testing-patterns)
4. [Integration with @tcg/core](#integration-with-tcgcore)

## Zone Structure

The Gundam Card Game uses the following zones per player:

### 1. Deck Area
- **Purpose**: Main deck of 50 cards
- **Visibility**: Secret (face-down, private)
- **Ordered**: Yes (top card matters)
- **Max Size**: 50 cards (initial)
- **Configuration**: `createDeckZone(playerId, cards)`

### 2. Resource Deck Area
- **Purpose**: Resource cards (10 cards)
- **Visibility**: Secret (face-down, private)
- **Ordered**: Yes
- **Max Size**: 10 cards (initial)
- **Configuration**: `createResourceDeckZone(playerId, cards)`

### 3. Hand
- **Purpose**: Cards drawn from deck
- **Visibility**: Private (owner sees cards, opponent sees count)
- **Ordered**: No
- **Max Size**: 10 cards (enforced at end of turn)
- **Configuration**: `createHandZone(playerId, cards)`

### 4. Battle Area
- **Purpose**: Deployed units and paired pilots
- **Visibility**: Public (all players see cards)
- **Ordered**: Yes (position matters for some effects)
- **Max Size**: 6 units
- **Configuration**: `createBattleAreaZone(playerId, cards)`

### 5. Shield Section
- **Purpose**: Face-down shield cards
- **Visibility**: Secret (count is public, cards are private)
- **Ordered**: Yes (damage removes from top)
- **Max Size**: 6 shields (initial)
- **Configuration**: `createShieldSectionZone(playerId, cards)`

### 6. Base Section
- **Purpose**: Player's base card
- **Visibility**: Public
- **Ordered**: No
- **Max Size**: 1 card
- **Configuration**: `createBaseSectionZone(playerId, baseCard)`

### 7. Resource Area
- **Purpose**: Played resource cards
- **Visibility**: Public
- **Ordered**: No
- **Max Size**: 15 cards
- **Configuration**: `createResourceAreaZone(playerId, cards)`

### 8. Trash
- **Purpose**: Discard pile
- **Visibility**: Public
- **Ordered**: Yes (recent cards on top)
- **Max Size**: Unlimited
- **Configuration**: `createTrashZone(playerId, cards)`

### 9. Removal Area
- **Purpose**: Cards removed from game
- **Visibility**: Public
- **Ordered**: No
- **Max Size**: Unlimited
- **Configuration**: `createRemovalZone(playerId, cards)`

## Zone Operations

All zone operations are built on top of `@tcg/core` utilities for consistency and immutability.

### Creating Player Zones

```typescript
import { createPlayerZones } from "@tcg/gundam/zones";
import { createPlayerId } from "@tcg/core";

const playerId = createPlayerId("player1");
const zones = createPlayerZones(playerId);

// Access individual zones
console.log(zones.deck);
console.log(zones.hand);
console.log(zones.battleArea);
// etc.
```

### Common Operations

#### Drawing Cards

```typescript
import { drawCards } from "@tcg/gundam/zones";

const result = drawCards(deck, hand, 2);

console.log(result.deck); // Updated deck (2 cards removed)
console.log(result.hand); // Updated hand (2 cards added)
console.log(result.cards); // Array of drawn card IDs
```

#### Deploying Units

```typescript
import { deployUnit } from "@tcg/gundam/zones";

const result = deployUnit(hand, battleArea, unitCardId);

console.log(result.hand); // Card removed from hand
console.log(result.battleArea); // Card added to battle area
```

#### Placing Resources

```typescript
import { placeResource } from "@tcg/gundam/zones";

const result = placeResource(hand, resourceArea, cardId);

console.log(result.hand); // Card removed
console.log(result.resourceArea); // Card added as resource
```

#### Taking Damage

```typescript
import { takeDamage } from "@tcg/gundam/zones";

const result = takeDamage(shieldSection, trash, 3);

console.log(result.shieldSection); // 3 shields removed
console.log(result.trash); // 3 shields added to trash
console.log(result.removedShields); // Array of removed shield card IDs
```

#### Destroying Units

```typescript
import { destroyUnit } from "@tcg/gundam/zones";

const result = destroyUnit(battleArea, trash, unitCardId);

console.log(result.battleArea); // Unit removed
console.log(result.trash); // Unit added to trash
```

## Testing Patterns

All tests use `@tcg/core/testing` utilities for consistency and reduced boilerplate.

### Basic Test Setup

```typescript
import { describe, expect, it, beforeEach } from "bun:test";
import {
  createTestCard,
  createTestCards,
  resetCardCounter
} from "@tcg/core/testing";
import { createPlayerId } from "@tcg/core";
import { createPlayerZones } from "@tcg/gundam/zones";

describe("Zone Operations", () => {
  beforeEach(() => {
    // Reset card counter for deterministic test IDs
    resetCardCounter();
  });

  it("should draw cards from deck", () => {
    const playerId = createPlayerId("player1");
    const zones = createPlayerZones(playerId);

    // Create test cards using core utilities
    const cards = createTestCards(5);
    const deckWithCards = { ...zones.deck, cards: cards.map(c => c.id) };

    const result = drawCards(deckWithCards, zones.hand, 2);

    expect(result.cards).toHaveLength(2);
    expect(result.deck.cards).toHaveLength(3);
    expect(result.hand.cards).toHaveLength(2);
  });
});
```

### Using Test Factories

```typescript
import { createTestCard, createTestCards } from "@tcg/core/testing";

// Create a single card with custom properties
const gundamUnit = createTestCard({
  name: "RX-78-2 Gundam",
  cardType: "UNIT",
});

// Create multiple cards at once
const deckCards = createTestCards(50); // Creates cards with auto-incrementing IDs

// Create cards with specific names
const card1 = createTestCard({ name: "Amuro Ray" });
const card2 = createTestCard({ name: "Sayla Mass" });
```

### Testing Deterministic Behavior

```typescript
it("should shuffle deck deterministically", () => {
  const zones = createPlayerZones(playerId);
  const cards = createTestCards(10);
  const deck = { ...zones.deck, cards: cards.map(c => c.id) };

  // Same seed produces same shuffle
  const shuffled1 = shuffleDeck(deck, "test-seed-123");
  const shuffled2 = shuffleDeck(deck, "test-seed-123");

  expect(shuffled1.cards).toEqual(shuffled2.cards);
});
```

### Testing Zone Constraints

```typescript
it("should enforce battle area maximum size", () => {
  const zones = createPlayerZones(playerId);
  const units = createTestCards(6);
  const battleAreaFull = {
    ...zones.battleArea,
    cards: units.map(u => u.id),
  };

  const newUnit = createTestCard({ name: "Extra Unit" });
  const hand = { ...zones.hand, cards: [newUnit.id] };

  // Should throw because battle area is at max capacity
  expect(() => {
    deployUnit(hand, battleAreaFull, newUnit.id);
  }).toThrow();
});
```

### Testing Game Flow Scenarios

```typescript
it("should handle typical turn flow", () => {
  const zones = createPlayerZones(playerId);

  // Setup: Create test cards
  const deckCards = createTestCards(50);
  const resourceCard = createTestCard({ name: "Resource" });
  const unitCard = createTestCard({ name: "Mobile Suit" });

  let deck = { ...zones.deck, cards: deckCards.map(c => c.id) };
  let hand = { ...zones.hand, cards: [resourceCard.id, unitCard.id] };
  let resourceArea = zones.resourceArea;
  let battleArea = zones.battleArea;

  // Step 1: Draw
  const drawResult = drawCards(deck, hand, 1);
  deck = drawResult.deck;
  hand = drawResult.hand;

  expect(hand.cards).toHaveLength(3);

  // Step 2: Place resource
  const placeResult = placeResource(hand, resourceArea, resourceCard.id);
  hand = placeResult.hand;
  resourceArea = placeResult.resourceArea;

  expect(resourceArea.cards).toContain(resourceCard.id);

  // Step 3: Deploy unit
  const deployResult = deployUnit(hand, battleArea, unitCard.id);
  hand = deployResult.hand;
  battleArea = deployResult.battleArea;

  expect(battleArea.cards).toContain(unitCard.id);
  expect(hand.cards).toHaveLength(1);
});
```

### Testing Immutability

```typescript
it("should not mutate original zones", () => {
  const originalDeck = createDeckZone(playerId, [card1.id]);
  const originalHand = createHandZone(playerId, []);

  // Copy original state
  const originalDeckCards = [...originalDeck.cards];
  const originalHandCards = [...originalHand.cards];

  // Perform operation
  drawCards(originalDeck, originalHand, 1);

  // Verify originals unchanged
  expect(originalDeck.cards).toEqual(originalDeckCards);
  expect(originalHand.cards).toEqual(originalHandCards);
});
```

## Integration with @tcg/core

The Gundam engine fully integrates with `@tcg/core` for:

### Zone Operations
- All zone operations use `@tcg/core` primitives (`addCard`, `removeCard`, `moveCard`, etc.)
- Immutability guaranteed through Immer
- Type-safe with branded types (`PlayerId`, `CardId`, `ZoneId`)

### Testing Utilities
- `createTestCard()` - Create test card definitions
- `createTestCards(count)` - Bulk card creation
- `resetCardCounter()` - Deterministic test IDs
- Test factories follow established patterns from lorcana-engine

### Type Guards
- All type guards use `createTypeGuard` from `@tcg/core/validation`
- Consistent pattern across all card types
- Type-safe narrowing for union types

### Example: Full Integration

```typescript
import { describe, expect, it, beforeEach } from "bun:test";
import {
  createTestCards,
  resetCardCounter
} from "@tcg/core/testing";
import { createPlayerId } from "@tcg/core";
import {
  createPlayerZones,
  drawCards,
  deployUnit,
  takeDamage,
} from "@tcg/gundam/zones";
import { isUnitCard, isPilotCard } from "@tcg/gundam/cards";

describe("Full Game Integration", () => {
  beforeEach(() => {
    resetCardCounter();
  });

  it("should handle complete combat scenario", () => {
    // Setup players
    const player1 = createPlayerId("player1");
    const player2 = createPlayerId("player2");

    // Create zones
    const p1Zones = createPlayerZones(player1);
    const p2Zones = createPlayerZones(player2);

    // Setup decks
    const p1DeckCards = createTestCards(50);
    const p2DeckCards = createTestCards(50);

    // Test scenario: player 1 attacks, player 2 takes damage
    // ... implementation
  });
});
```

## Best Practices

1. **Always use `resetCardCounter()` in `beforeEach()`**
   - Ensures deterministic card IDs across test runs
   - Prevents test interdependence

2. **Use test factories instead of manual card creation**
   - `createTestCard()` and `createTestCards()` provide consistent interface
   - Auto-incrementing IDs prevent collisions

3. **Test immutability explicitly**
   - Verify original zones aren't modified
   - Use spread operators to copy state between operations

4. **Test zone constraints**
   - Verify maximum size limits
   - Test error conditions (empty deck, full zones, etc.)

5. **Use descriptive test names**
   - Name tests by behavior, not implementation
   - Follow pattern: "should [expected behavior] when [condition]"

6. **Test game flow scenarios**
   - Create realistic multi-step tests
   - Verify state after each operation
   - Test edge cases (lethal damage, deck out, etc.)

## Additional Resources

- [@tcg/core Documentation](../../core/README.md)
- [@tcg/core/testing Guide](../../core/docs/guides/testing-utilities.md)
- [Zone Operations API](../../core/docs/guides/zone-operations.md)
- [Lorcana Engine Tests](../../lorcana-engine/src/game-definition/__tests__/) (reference implementation)
