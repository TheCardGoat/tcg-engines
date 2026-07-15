# Zone Operations Guide

> Complete guide to zone management utilities in @tcg/core

## Overview

The zone operations module provides a comprehensive API for managing card zones (decks, hands, graveyards, play areas, etc.) in your card game. All operations are immutable and built on Immer for efficient structural sharing.

## Table of Contents

- [Core Concepts](#core-concepts)
- [Basic Operations](#basic-operations)
- [Advanced Operations](#advanced-operations)
- [State Helpers](#state-helpers)
- [Best Practices](#best-practices)
- [Examples](#examples)

## Core Concepts

### What is a Zone?

A zone is a container for cards with specific properties:

```typescript
import { createZone, createZoneId } from '@tcg/core';

const deck = createZone({
  id: createZoneId('deck'),
  visibility: 'secret',      // Hidden from all players
  ordered: true,              // Order matters (top/bottom)
  maxSize: 60,               // Optional size limit
});
```

### Zone Visibility Levels

- **`secret`** - Hidden from all players (face-down deck)
- **`owner`** - Visible to owner only (hand)
- **`public`** - Visible to all players (play area, graveyard)

### Immutability

All zone operations return **new zone objects** without modifying the original:

```typescript
const deck = createZone(config, [card1, card2, card3]);

// This creates a NEW deck, original is unchanged
const newDeck = removeCard(deck, card1);

console.log(deck.cards.length);     // 3 (unchanged)
console.log(newDeck.cards.length);  // 2 (new zone)
```

## Basic Operations

### Adding Cards

```typescript
import { addCard, addCardToTop, addCardToBottom } from '@tcg/core';

// Add to default position (end for unordered, top for ordered)
const newZone = addCard(zone, cardId);

// Add to specific position
const newZone = addCard(zone, cardId, 0); // Add at index 0

// Add to top of ordered zone (like deck)
const newDeck = addCardToTop(deck, cardId);

// Add to bottom of ordered zone
const newDeck = addCardToBottom(deck, cardId);
```

**Error Handling:**
- Throws error if zone is at `maxSize`

### Removing Cards

```typescript
import { removeCard } from '@tcg/core';

const newZone = removeCard(zone, cardId);
```

**Error Handling:**
- Throws error if card is not in the zone

### Moving Cards Between Zones

```typescript
import { moveCard } from '@tcg/core';

const { fromZone, toZone } = moveCard(
  deck,
  hand,
  cardId,
  undefined // Optional position in destination zone
);

// Move to specific position
const { fromZone, toZone } = moveCard(deck, hand, cardId, 0);
```

**Returns:**
An object with both updated zones to maintain immutability.

### Checking Zone Contents

```typescript
import {
  isCardInZone,
  getZoneSize,
  getCardsInZone,
  getTopCard,
  getBottomCard,
} from '@tcg/core';

// Check if card is in zone
if (isCardInZone(hand, cardId)) {
  console.log('Card is in hand');
}

// Get zone size
const deckSize = getZoneSize(deck);

// Get all cards (returns copy of array)
const allCards = getCardsInZone(zone);

// Get top/bottom card
const topCard = getTopCard(deck);      // CardId | undefined
const bottomCard = getBottomCard(deck); // CardId | undefined
```

### Clearing a Zone

```typescript
import { clearZone } from '@tcg/core';

// Remove all cards from zone
const emptyZone = clearZone(zone);
```

## Advanced Operations

### Drawing Cards

```typescript
import { draw } from '@tcg/core';

const { fromZone, toZone, drawnCards } = draw(
  deck,
  hand,
  3 // Number of cards to draw
);

console.log(drawnCards); // Array of 3 CardIds
```

**Error Handling:**
- Throws error if deck doesn't have enough cards

**Use Case:**
Standard draw operation that moves cards from deck to hand and returns what was drawn.

### Milling Cards

```typescript
import { mill } from '@tcg/core';

const { fromZone, toZone, milledCards } = mill(
  deck,
  graveyard,
  5 // Number of cards to mill
);

console.log(milledCards); // Array of 5 CardIds
```

**Use Case:**
Moving cards from deck to graveyard (common in many card games).

### Shuffling

```typescript
import { shuffle } from '@tcg/core';

// Deterministic shuffle using seeded RNG
const shuffledDeck = shuffle(deck, 'game-123-shuffle-1');

// Same seed = same shuffle order (important for replay!)
const deck1 = shuffle(originalDeck, 'seed-1');
const deck2 = shuffle(originalDeck, 'seed-1');
// deck1 and deck2 have identical card order
```

**Important:**
Always use seeded RNG for deterministic replay and network sync.

### Searching Zones

```typescript
import { search } from '@tcg/core';

// Find all creatures
const creatures = search(zone, (cardId) => {
  const card = getCard(cardId);
  return card.type === 'creature';
});

// Find cards with cost <= 3
const cheapCards = search(hand, (cardId) => {
  const card = getCard(cardId);
  return card.cost <= 3;
});
```

**Returns:**
Array of matching CardIds (does not modify zone).

### Peeking at Cards

```typescript
import { peek } from '@tcg/core';

// Look at top 3 cards without removing them
const topCards = peek(deck, 3);

console.log('Top 3 cards:', topCards);
// Deck is unchanged
```

**Use Case:**
Scrying, surveillance, or preview effects that don't modify the deck.

### Revealing Cards

```typescript
import { reveal } from '@tcg/core';

// Make cards temporarily visible to all players
const revealedCards = reveal([card1, card2, card3]);

// Use in game logic to track what should be shown
state.revealedCards = revealedCards;
```

**Use Case:**
Effects that reveal cards to all players (mill effects, tutors, etc.).

### Finding Cards Across Multiple Zones

```typescript
import { findCardInZones } from '@tcg/core';

const zones = [hand, deck, graveyard, exile];
const zone = findCardInZones(cardId, zones);

if (zone) {
  console.log(`Card found in zone: ${zone.config.id}`);
} else {
  console.log('Card not found in any zone');
}
```

**Returns:**
First zone containing the card, or `undefined` if not found.

## State Helpers

For games using flat state objects with zones as properties, use these helpers:

### Creating Player Zones

```typescript
import { createPlayerZones } from '@tcg/core';

// Create empty zones for each player
const hands = createPlayerZones(playerIds);
// Result: { p1: undefined, p2: undefined }

// Create with initial values
const decks = createPlayerZones(playerIds, () => []);
// Result: { p1: [], p2: [] }

// Create complex zone structures
const zones = createPlayerZones(playerIds, () => ({
  hand: createZone(handConfig),
  deck: createZone(deckConfig),
  graveyard: createZone(graveyardConfig),
}));
// Result: { p1: { hand, deck, graveyard }, p2: { ... } }
```

### Moving Cards in Flat State

```typescript
import { moveCardInState } from '@tcg/core';

type GameState = {
  hand: Zone;
  deck: Zone;
  graveyard: Zone;
};

const state: GameState = {
  hand: createZone(handConfig, [card1, card2]),
  deck: createZone(deckConfig, [card3, card4]),
  graveyard: createZone(graveyardConfig),
};

// Move card from hand to graveyard
const newState = moveCardInState(
  state,
  'hand',
  'graveyard',
  card1
);

// newState is a new object with updated hand and graveyard
```

**Benefits:**
- Type-safe zone keys
- Immutable state updates
- Clean one-liner for common operation

### Finding Card Location in State

```typescript
import { getCardZone } from '@tcg/core';

const zoneName = getCardZone(state, cardId);

if (zoneName === 'hand') {
  console.log('Card is in hand');
} else if (zoneName === 'deck') {
  console.log('Card is in deck');
} else {
  console.log('Card not found in any zone');
}
```

**Returns:**
Zone property name or `undefined` if not found.

## Best Practices

### 1. Always Use Seeded RNG

```typescript
// BAD - Non-deterministic
const shuffledDeck = shuffle(deck, `${Math.random()}`);

// GOOD - Deterministic
const shuffledDeck = shuffle(deck, `${gameId}-shuffle-${turnNumber}`);
```

### 2. Handle Errors Gracefully

```typescript
try {
  const { fromZone, toZone, drawnCards } = draw(deck, hand, 5);
  // Update state with new zones
} catch (error) {
  // Handle insufficient cards
  console.error('Cannot draw 5 cards:', error);
  // Trigger "deck empty" game logic
}
```

### 3. Use Immutable Patterns

```typescript
// BAD - Mutating zone
zone.cards.push(cardId); // Don't do this!

// GOOD - Creating new zone
const newZone = addCard(zone, cardId);
```

### 4. Leverage Type Safety

```typescript
// Use branded types for safety
import { createCardId, createZoneId } from '@tcg/core';

const cardId = createCardId('card-123');
const zoneId = createZoneId('hand');

// TypeScript prevents mixing up IDs
moveCard(deck, hand, zoneId); // ❌ Type error - can't pass ZoneId as CardId
```

### 5. Use State Helpers for Clean Code

```typescript
// Instead of this:
const hand = state.hand;
const deck = state.deck;
const { fromZone, toZone } = moveCard(deck, hand, cardId);
const newState = {
  ...state,
  hand: toZone,
  deck: fromZone,
};

// Do this:
const newState = moveCardInState(state, 'deck', 'hand', cardId);
```

## Examples

### Complete Draw Phase

```typescript
import { draw, shuffle, getZoneSize } from '@tcg/core';

function executeDrawPhase(state: GameState, playerId: PlayerId, seed: string) {
  const playerState = state.players[playerId];
  let deck = playerState.deck;
  const hand = playerState.hand;

  // Shuffle deck if needed
  if (state.turnNumber === 1) {
    deck = shuffle(deck, `${seed}-initial-shuffle`);
  }

  // Draw cards
  try {
    const { fromZone, toZone, drawnCards } = draw(deck, hand, 1);

    return {
      ...state,
      players: {
        ...state.players,
        [playerId]: {
          ...playerState,
          deck: fromZone,
          hand: toZone,
        },
      },
    };
  } catch (error) {
    // Handle deck out
    return triggerDeckOutCondition(state, playerId);
  }
}
```

### Tutor Effect (Search and Move)

```typescript
import { search, moveCard } from '@tcg/core';

function tutorForCreature(
  deck: Zone,
  hand: Zone,
  cardDatabase: CardDatabase
): { deck: Zone; hand: Zone; tutored: CardId | undefined } {
  // Search for first creature
  const creatures = search(deck, (cardId) => {
    const card = cardDatabase.get(cardId);
    return card?.type === 'creature';
  });

  if (creatures.length === 0) {
    return { deck, hand, tutored: undefined };
  }

  const cardId = creatures[0];
  const { fromZone, toZone } = moveCard(deck, hand, cardId);

  return {
    deck: fromZone,
    hand: toZone,
    tutored: cardId,
  };
}
```

### Mill and Reveal

```typescript
import { mill, reveal } from '@tcg/core';

function millAndReveal(
  deck: Zone,
  graveyard: Zone,
  count: number
): { deck: Zone; graveyard: Zone; revealed: CardId[] } {
  const { fromZone, toZone, milledCards } = mill(deck, graveyard, count);

  // Reveal milled cards to all players
  const revealed = reveal(milledCards);

  return {
    deck: fromZone,
    graveyard: toZone,
    revealed,
  };
}
```

### Multi-Zone Search

```typescript
import { findCardInZones, moveCard } from '@tcg/core';

function returnCardFromAnywhere(
  cardId: CardId,
  zones: { hand: Zone; graveyard: Zone; exile: Zone; field: Zone },
  targetZone: Zone
) {
  // Find card in any zone
  const zoneArray = [zones.hand, zones.graveyard, zones.exile, zones.field];
  const sourceZone = findCardInZones(cardId, zoneArray);

  if (!sourceZone) {
    throw new Error(`Card ${cardId} not found in any zone`);
  }

  // Move to target zone
  const { fromZone, toZone } = moveCard(sourceZone, targetZone, cardId);

  // Return updated zones
  return {
    fromZone,
    toZone,
    sourceZoneId: sourceZone.config.id,
  };
}
```

## Related Documentation

- [Testing Utilities Guide](./testing-utilities.md) - Test helpers for zone operations
- [Examples: Zone Management](../examples/zone-management.ts) - Runnable examples
- [API Reference](../../README.md#zone-management) - Complete API reference

## Common Patterns

### Implementing Discard

```typescript
const { fromZone, toZone } = moveCard(hand, graveyard, cardId);
```

### Implementing Exile

```typescript
const { fromZone, toZone } = moveCard(sourceZone, exile, cardId);
```

### Implementing Bounce

```typescript
// From field to hand
const { fromZone, toZone } = moveCard(field, hand, cardId);
```

### Implementing Sacrifice

```typescript
// From field to graveyard
const { fromZone, toZone } = moveCard(field, graveyard, cardId);
```

### Implementing Bottom of Deck

```typescript
const newDeck = addCardToBottom(deck, cardId);
```

### Implementing Top of Deck

```typescript
const newDeck = addCardToTop(deck, cardId);
```

## Migration from Game-Specific Zone Code

If you're migrating from custom zone operations:

```typescript
// OLD (custom implementation)
function moveCardBetweenZones(from, to, cardId) {
  const fromCards = from.cards.filter(id => id !== cardId);
  const toCards = [...to.cards, cardId];
  return {
    from: { ...from, cards: fromCards },
    to: { ...to, cards: toCards },
  };
}

// NEW (@tcg/core)
import { moveCard } from '@tcg/core';
const { fromZone, toZone } = moveCard(from, to, cardId);
```

**Benefits of @tcg/core:**
- Immutability enforced with Immer
- Error handling built-in
- Type safety with branded types
- Tested and optimized
- Consistent API across all games
