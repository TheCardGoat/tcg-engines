# Rules

This directory contains the implementation of Lorcana game rules.

## Structure

- **`validators/`** - Move validation rules
- **`costs/`** - Cost calculation and payment
- **`effects/`** - Effect resolution
- **`timing/`** - Timing and priority rules
- **`index.ts`** - Public exports

## Purpose

Implements the official Lorcana rules in a modular, testable way.

## Examples

```typescript
// Validate quest move
export const validateQuest = (
  state: LorcanaState,
  cardId: CardId
): ValidationResult => {
  if (!isCharacter(state, cardId)) {
    return invalid("Only characters can quest");
  }
  
  if (isExerted(state, cardId)) {
    return invalid("Character is exerted");
  }
  
  if (wasPlayedThisTurn(state, cardId) && !hasRush(state, cardId)) {
    return invalid("Character has summoning sickness");
  }
  
  return valid();
};
```

## References

- See official Lorcana rulebook for complete rules

