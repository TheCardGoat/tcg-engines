# Cards

This directory contains card definitions, abilities, and card-related functionality for Lorcana.

## Structure

### Card Definitions

- **`card-definitions/`** - Card data organized by set
  - `set-001/` - The First Chapter cards
  - `set-002/` - Rise of the Floodborn cards
  - `set-003/` - Into the Inklands cards
  - `index.ts` - Card registry aggregating all sets

### Abilities

- **`abilities/`** - Card ability definitions
  - `keywords/` - Keyword abilities (Bodyguard, Challenger, Evasive, etc.)
  - `triggered/` - Triggered abilities (When/Whenever)
  - `activated/` - Activated abilities (tap to activate)
  - `static/` - Static abilities (always active)
  - `index.ts` - Ability registry

### Card Types

- **`card-types.ts`** - Lorcana-specific card type definitions
- **`card-instance.ts`** - Runtime card instance management
- **`card-queries.ts`** - Helper functions for querying cards
- **`index.ts`** - Public exports

## Purpose

This directory defines all Lorcana cards and their abilities, structured to work with the `@tcg/core` card system.

## Card Definition Pattern

Cards are defined declaratively:

```typescript
import type { CardDefinition } from "@tcg/core";
import type { LorcanaCard } from "../card-types";

export const mickeyMouseTrueFriend: CardDefinition<LorcanaCard> = {
  // Core properties
  id: "001-001",
  name: "Mickey Mouse - True Friend",
  set: "001",
  rarity: "legendary",
  inkable: true,
  
  // Lorcana-specific properties
  cost: 8,
  inkCost: 8,
  type: "character",
  color: "amber",
  
  // Character properties
  strength: 4,
  willpower: 6,
  loreValue: 3,
  
  // Abilities
  abilities: [
    {
      type: "keyword",
      keyword: "challenger",
      value: 5,
    },
    {
      type: "triggered",
      trigger: "whenPlayed",
      effect: "drawCards",
      amount: 2,
    },
  ],
  
  // Flavor text
  flavorText: "A friend in need is a friend indeed.",
};
```

## Card Types

Lorcana has several card types:

```typescript
export type LorcanaCardType = 
  | "character"
  | "action"
  | "item"
  | "location"
  | "song";

export type LorcanaCard = {
  // Base card properties
  id: CardId;
  name: string;
  type: LorcanaCardType;
  cost: number;
  inkCost: number;
  color: LorcanaColor;
  inkable: boolean;
  rarity: LorcanaRarity;
  set: string;
  
  // Character-specific
  strength?: number;
  willpower?: number;
  loreValue?: number;
  
  // Abilities
  abilities: LorcanaAbility[];
  
  // Text
  text?: string;
  flavorText?: string;
};
```

## Keyword Abilities

Keyword abilities are standardized mechanics:

```typescript
// Bodyguard - Must be challenged before other characters
export const bodyguardAbility: KeywordAbility = {
  keyword: "bodyguard",
  
  // Modify challenge validation
  modifyValidation: (state, context) => {
    // Implementation: prevent challenging other characters
    // if a bodyguard is available
  },
};

// Challenger +N - Gets +N strength when challenging
export const challengerAbility: KeywordAbility = {
  keyword: "challenger",
  
  // Modify challenge damage
  modifyDamage: (state, cardId, baseValue) => {
    const card = getCard(state, cardId);
    const challengerBonus = getKeywordValue(card, "challenger");
    return baseValue + challengerBonus;
  },
};
```

## Triggered Abilities

Abilities that trigger on events:

```typescript
export type TriggeredAbility = {
  type: "triggered";
  trigger: TriggerTiming;
  condition?: AbilityCondition;
  effect: AbilityEffect;
  target?: TargetDefinition;
};

// Example: "When you play this character, draw 2 cards"
const drawOnPlayAbility: TriggeredAbility = {
  type: "triggered",
  trigger: "whenPlayed",
  effect: {
    type: "drawCards",
    amount: 2,
  },
};
```

## Activated Abilities

Abilities players can choose to activate:

```typescript
export type ActivatedAbility = {
  type: "activated";
  cost?: AbilityCost;
  effect: AbilityEffect;
  target?: TargetDefinition;
  restrictions?: AbilityRestriction[];
};

// Example: "Exert - Draw a card"
const exertToDrawAbility: ActivatedAbility = {
  type: "activated",
  cost: {
    type: "exert",
  },
  effect: {
    type: "drawCards",
    amount: 1,
  },
};
```

## Card Registry

All cards registered for lookup:

```typescript
// card-definitions/index.ts
import * as set001 from "./set-001";
import * as set002 from "./set-002";

export const allCards = {
  ...set001.cards,
  ...set002.cards,
};

export const getCardDefinition = (cardId: CardId): CardDefinition => {
  return allCards[cardId];
};
```

## Card Instances vs Definitions

- **CardDefinition**: The template (what the card does)
- **CardInstance**: The runtime instance (current state)

```typescript
// Definition (static)
const mickeyDefinition: CardDefinition = {
  id: "001-001",
  name: "Mickey Mouse",
  strength: 4,
  willpower: 6,
};

// Instance (dynamic)
const mickeyInstance: CardInstance = {
  definitionId: "001-001",
  instanceId: "game1-card-123",
  ownerId: "player1",
  zone: "play",
  
  // Current state
  damage: 2,
  exerted: true,
  playedThisTurn: true,
};
```

## Card Queries

Helper functions for common card operations:

```typescript
export const getCardsInZone = (
  state: LorcanaState,
  zone: ZoneId,
  playerId: PlayerId
): CardInstance[] => {
  return state.zones[zone][playerId].map(
    cardId => state.cards[cardId]
  );
};

export const getReadyCharacters = (
  state: LorcanaState,
  playerId: PlayerId
): CardInstance[] => {
  return getCardsInZone(state, "play", playerId).filter(
    card => card.type === "character" && !card.exerted
  );
};
```

## Testing Cards

Card abilities are tested through integration tests:

```typescript
describe("Mickey Mouse - True Friend", () => {
  it("draws 2 cards when played", () => {
    const engine = createTestEngine();
    const initialHandSize = getHandSize(engine.getState(), "player1");
    
    engine.executeMove("playCard", {
      playerId: "player1",
      params: { cardId: "mickey-true-friend" },
    });
    
    const finalHandSize = getHandSize(engine.getState(), "player1");
    expect(finalHandSize).toBe(initialHandSize + 2 - 1); // +2 draw, -1 played
  });
});
```

## References

- See `@packages/core/src/cards/` for base card system
- See `@packages/core/ENGINE_INTEGRATION.md` for card integration guide

