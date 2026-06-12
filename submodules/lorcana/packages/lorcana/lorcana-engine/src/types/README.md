# Types

This directory contains TypeScript type definitions specific to Lorcana.

## Structure

- **`lorcana-state.ts`** - Game state type definitions
- **`lorcana-moves.ts`** - Move parameter types
- **`lorcana-cards.ts`** - Card type definitions
- **`lorcana-abilities.ts`** - Ability type definitions
- **`branded-types.ts`** - Branded type definitions for type safety
- **`index.ts`** - Type exports

## Purpose

This directory provides strong TypeScript types that:

1. Extend base types from `@tcg/core` with Lorcana specifics
2. Ensure type safety throughout the engine
3. Enable IDE autocomplete and type checking
4. Document the data structures through types

## State Types

### Game State

The root state type for Lorcana games:

```typescript
import type { GameState, PlayerId, CardId } from "@tcg/core";

export type LorcanaState = GameState & {
  lorcana: {
    // Lore tracking (win condition at 20)
    lore: Record<PlayerId, number>;

    // Ink tracking
    ink: {
      available: Record<PlayerId, number>;
      total: Record<PlayerId, number>;
    };

    // Challenge state during challenge resolution
    challengeState?: {
      attacker: CardId;
      defender?: CardId;
      attackerDamage: number;
      defenderDamage: number;
    };

    // Location state
    locations: Record<
      CardId,
      {
        characters: CardId[];
      }
    >;

    // Turn metadata
    turnMetadata: {
      cardsPlayedThisTurn: CardId[];
      charactersQuestingThisTurn: CardId[];
      damageDealtThisTurn: Record<CardId, number>;
    };
  };
};
```

### Zone Types

Lorcana-specific zone types:

```typescript
export type LorcanaZone = "deck" | "hand" | "play" | "discard" | "inkwell";

export type ZoneVisibility =
  | "all" // All players can see
  | "owner" // Only owner can see
  | "none"; // No one can see (face-down)
```

## Move Types

Type-safe move parameters:

```typescript
export type PlayCardMoveParams = {
  cardId: CardId;
  shift?: {
    targetCardId: CardId; // Card to shift onto
  };
  targets?: TargetSelection[];
};

export type QuestMoveParams = {
  cardId: CardId;
};

export type ChallengeMoveParams = {
  attackerId: CardId;
  defenderId: CardId;
};

export type InkCardMoveParams = {
  cardId: CardId;
};

export type ActivateAbilityMoveParams = {
  cardId: CardId;
  abilityIndex: number;
  targets?: TargetSelection[];
};
```

## Card Types

Lorcana card type definitions:

```typescript
export type LorcanaColor = "amber" | "amethyst" | "emerald" | "ruby" | "sapphire" | "steel";

export type LorcanaCardType = "character" | "action" | "item" | "location" | "song";

export type LorcanaRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "super_rare"
  | "legendary"
  | "enchanted";

export type LorcanaCard = {
  id: CardId;
  name: string;
  type: LorcanaCardType;
  color: LorcanaColor;
  cost: number;
  inkCost: number;
  inkable: boolean;
  rarity: LorcanaRarity;
  set: string;
  number: number;

  // Character properties
  strength?: number;
  willpower?: number;
  loreValue?: number;
  classifications?: string[]; // "Hero", "Villain", "Princess", etc.

  // Abilities
  abilities: LorcanaAbility[];

  // Text
  text?: string;
  flavorText?: string;
};
```

## Ability Types

Type-safe ability definitions:

```typescript
export type LorcanaAbility = KeywordAbility | TriggeredAbility | ActivatedAbility | StaticAbility;

export type KeywordAbility = {
  type: "keyword";
  keyword: LorcanaKeyword;
  value?: number; // For Challenger +N, Resist +N, etc.
};

export type LorcanaKeyword =
  | "bodyguard"
  | "challenger"
  | "evasive"
  | "reckless"
  | "resist"
  | "rush"
  | "shift"
  | "singer"
  | "support"
  | "ward";

export type TriggeredAbility = {
  type: "triggered";
  trigger: TriggerTiming;
  condition?: AbilityCondition;
  effect: AbilityEffect;
  target?: TargetDefinition;
};

export type TriggerTiming =
  | "whenPlayed"
  | "wheneverQuests"
  | "wheneverChallenges"
  | "wheneverDamaged"
  | "atStartOfTurn"
  | "atEndOfTurn"
  | "whenLeaves";

export type ActivatedAbility = {
  type: "activated";
  cost?: AbilityCost;
  effect: AbilityEffect;
  target?: TargetDefinition;
  usesPerTurn?: number;
};
```

## Branded Types

Type-safe IDs to prevent mixing different ID types:

```typescript
// Branded type pattern
export type Brand<K, T> = K & { __brand: T };

// Specific ID types
export type CardId = Brand<string, "CardId">;
export type PlayerId = Brand<string, "PlayerId">;
export type GameId = Brand<string, "GameId">;
export type AbilityId = Brand<string, "AbilityId">;

// Type guards
export const isCardId = (value: string): value is CardId => {
  return typeof value === "string" && value.length > 0;
};

// Constructor functions
export const createCardId = (value: string): CardId => {
  return value as CardId;
};
```

## Effect Types

Type-safe effect definitions:

```typescript
export type AbilityEffect =
  | DrawCardsEffect
  | DealDamageEffect
  | GainLoreEffect
  | ExertEffect
  | ReadyEffect
  | ReturnToHandEffect
  | DiscardEffect;

export type DrawCardsEffect = {
  type: "drawCards";
  amount: number;
  player?: "controller" | "opponent" | "target";
};

export type DealDamageEffect = {
  type: "dealDamage";
  amount: number;
  target: TargetDefinition;
};

export type GainLoreEffect = {
  type: "gainLore";
  amount: number;
};
```

## Type Utilities

Helper types for common patterns:

```typescript
// Make specific properties optional
export type PartialCard = Partial<LorcanaCard> & Pick<LorcanaCard, "id" | "name">;

// Extract character cards only
export type CharacterCard = LorcanaCard & { type: "character" };

// Player-specific data
export type PlayerState<T> = Record<PlayerId, T>;
```

## References

- See `@packages/core/src/types/` for base framework types
- See TypeScript handbook for branded types pattern
