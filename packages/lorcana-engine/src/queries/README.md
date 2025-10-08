# Queries

This directory contains helper functions for querying Lorcana game state.

## Purpose

Provides type-safe, reusable functions for reading game state without modifying it. These queries are used by move validators, ability effects, and UI integrations.

## Structure

- **`card-queries.ts`** - Query cards and their properties
- **`game-queries.ts`** - Query game-level state
- **`player-queries.ts`** - Query player-specific state
- **`zone-queries.ts`** - Query zone contents
- **`ability-queries.ts`** - Query available abilities
- **`index.ts`** - Public exports

## Example Queries

```typescript
// Get all ready characters a player controls
export const getReadyCharacters = (
  state: LorcanaState,
  playerId: PlayerId
): CardId[] => {
  return getCardsInZone(state, "play", playerId).filter(
    cardId => !isExerted(state, cardId)
  );
};

// Check if player can afford to play a card
export const canAffordCard = (
  state: LorcanaState,
  playerId: PlayerId,
  cardId: CardId
): boolean => {
  const cost = getCardCost(state, cardId);
  const available = getAvailableInk(state, playerId);
  return available >= cost;
};

// Get characters that can quest
export const getQuestableCharacters = (
  state: LorcanaState,
  playerId: PlayerId
): CardId[] => {
  return getReadyCharacters(state, playerId).filter(
    cardId => canQuest(state, cardId)
  );
};
```

## References

- See `@packages/core` for base query utilities

