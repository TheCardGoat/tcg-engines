# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/packages/lorcana-engine/specs/2025-10-08-card-system/spec.md

## Technical Requirements

### 1. Core Type Definitions

#### 1.1 Ink Types

Based on RULES.md 6.2.3, cards have one or two ink types:

```typescript
// src/types/card-types.ts
export type InkType = 
  | "amber"
  | "amethyst"
  | "emerald"
  | "ruby"
  | "sapphire"
  | "steel";

export type InkTypes = InkType | [InkType, InkType];
```

#### 1.2 Rarity

```typescript
export type Rarity = 
  | "common"
  | "uncommon"
  | "rare"
  | "super-rare"
  | "legendary"
  | "enchanted";
```

#### 1.3 Character Classifications

Based on RULES.md 6.1.2.2:

```typescript
export type CharacterClassification =
  | "Alien"
  | "Ally"
  | "Broom"
  | "Captain"
  | "Deity"
  | "Detective"
  | "Dragon"
  | "Dreamborn"
  | "Entangled"
  | "Fairy"
  | "Floodborn"
  | "Hero"
  | "Hyena"
  | "Illusion"
  | "Inventor"
  | "King"
  | "Knight"
  | "Madrigal"
  | "Mentor"
  | "Musketeer"
  | "Pirate"
  | "Prince"
  | "Princess"
  | "Puppy"
  | "Queen"
  | "Racer"
  | "Robot"
  | "Seven Dwarfs"
  | "Sorcerer"
  | "Storyborn"
  | "Tigger"
  | "Titan"
  | "Villain";
```

### 2. Card Type Definitions

#### 2.1 Base Card Properties

Properties common to all card types:

```typescript
import type { CardId, PlayerId } from "@tcg/core";

export type BaseCardProperties = {
  /** Unique card definition identifier (e.g., "TFC-001") */
  id: CardId;
  
  /** Card name (without version) */
  name: string;
  
  /** Card version (e.g., "True Friend") - optional for actions */
  version?: string;
  
  /** Full name = name + version (e.g., "Mickey Mouse - True Friend") */
  fullName: string;
  
  /** Ink type(s) - one or two */
  inkTypes: InkTypes;
  
  /** Ink cost to play the card */
  inkCost: number;
  
  /** Whether card can be put into inkwell (has inkwell symbol) */
  inkable: boolean;
  
  /** Card rarity */
  rarity: Rarity;
  
  /** Set identifier (e.g., "TFC" for The First Chapter) */
  set: string;
  
  /** Collector number */
  collectorNumber: string;
  
  /** Card text (rules text) */
  text?: string;
  
  /** Flavor text (non-gameplay) */
  flavorText?: string;
  
  /** Artist name */
  artist?: string;
};
```

#### 2.2 Character Card Definition

Based on RULES.md 6.1 and 6.2:

```typescript
import type { LorcanaAbility } from "./ability-types";

export type CharacterCardDefinition = BaseCardProperties & {
  type: "character";
  
  /** Strength {S} - damage dealt in challenges (RULES.md 6.2.9) */
  strength: number;
  
  /** Willpower {W} - damage threshold before banishment (RULES.md 6.2.10) */
  willpower: number;
  
  /** Lore Value {L} - lore gained when questing (RULES.md 6.2.11) */
  loreValue: number;
  
  /** Character classifications (at least one required per RULES.md 6.1.2.2) */
  classifications: CharacterClassification[];
  
  /** Card abilities (keywords, triggered, activated, static) */
  abilities: LorcanaAbility[];
};
```

#### 2.3 Action Card Definition

Based on RULES.md 6.3:

```typescript
export type ActionCardDefinition = BaseCardProperties & {
  type: "action";
  
  /** Whether this action is a song (RULES.md 6.3.3) */
  isSong: boolean;
  
  /** Effects (actions have effects, not abilities per RULES.md 6.3.2) */
  effects: LorcanaEffect[];
};
```

#### 2.4 Item Card Definition

Based on RULES.md 6.4:

```typescript
export type ItemCardDefinition = BaseCardProperties & {
  type: "item";
  
  /** Item abilities (can be used turn played per RULES.md 6.4.3) */
  abilities: LorcanaAbility[];
};
```

#### 2.5 Location Card Definition

Based on RULES.md 6.5:

```typescript
export type LocationCardDefinition = BaseCardProperties & {
  type: "location";
  
  /** Willpower {W} - damage threshold (RULES.md 6.5.5) */
  willpower: number;
  
  /** Lore Value {L} - gained during Set step (RULES.md 6.5.6, optional) */
  loreValue?: number;
  
  /** Move cost {M} - ink to move character to location (RULES.md 6.5.4) */
  moveCost: number;
  
  /** Location abilities (can be used turn played per RULES.md 6.5.7) */
  abilities: LorcanaAbility[];
};
```

#### 2.6 Discriminated Union

```typescript
export type LorcanaCardDefinition =
  | CharacterCardDefinition
  | ActionCardDefinition
  | ItemCardDefinition
  | LocationCardDefinition;
```

### 3. Keyword Abilities

All 11 keywords with technical definitions from RULES.md Section 10:

#### 3.1 Keyword Type Definitions

```typescript
// src/types/keyword-types.ts

/**
 * Bodyguard - RULES.md 10.2
 * Two abilities:
 * 1. May enter play exerted (replacement effect)
 * 2. Must be challenged before other characters (restriction)
 */
export type BodyguardKeyword = {
  type: "bodyguard";
};

/**
 * Challenger +N - RULES.md 10.3
 * Gets +N Strength while challenging (stacks)
 */
export type ChallengerKeyword = {
  type: "challenger";
  value: number; // +N
};

/**
 * Evasive - RULES.md 10.4
 * Can only be challenged by characters with Evasive
 */
export type EvasiveKeyword = {
  type: "evasive";
};

/**
 * Reckless - RULES.md 10.5
 * Two abilities:
 * 1. Can't quest
 * 2. Must challenge each turn if able
 */
export type RecklessKeyword = {
  type: "reckless";
};

/**
 * Resist +N - RULES.md 10.6
 * Reduces damage by N (stacks)
 */
export type ResistKeyword = {
  type: "resist";
  value: number; // +N
};

/**
 * Rush - RULES.md 10.7
 * Can challenge the turn played
 */
export type RushKeyword = {
  type: "rush";
};

/**
 * Shift - RULES.md 10.8
 * Pay alternate cost to play on top of character with same name
 */
export type ShiftKeyword = {
  type: "shift";
  cost: number;
  
  /** Variant: specific classification or "universal" */
  variant?: CharacterClassification | "universal";
};

/**
 * Singer N - RULES.md 10.9
 * Can exert to sing songs as if cost N
 */
export type SingerKeyword = {
  type: "singer";
  value: number; // effective cost
};

/**
 * Sing Together N - RULES.md 10.10
 * Multiple characters can exert to sing (total cost >= N)
 * Only appears on Song actions
 */
export type SingTogetherKeyword = {
  type: "sing-together";
  cost: number; // minimum total cost
};

/**
 * Support - RULES.md 10.11
 * When quests, may add Strength to another character
 */
export type SupportKeyword = {
  type: "support";
};

/**
 * Vanish - RULES.md 10.12
 * Banished when chosen by opponent for action effect
 */
export type VanishKeyword = {
  type: "vanish";
};

/**
 * Ward - RULES.md 10.13
 * Opponents can't choose except to challenge
 */
export type WardKeyword = {
  type: "ward";
};

export type KeywordAbility =
  | BodyguardKeyword
  | ChallengerKeyword
  | EvasiveKeyword
  | RecklessKeyword
  | ResistKeyword
  | RushKeyword
  | ShiftKeyword
  | SingerKeyword
  | SingTogetherKeyword
  | SupportKeyword
  | VanishKeyword
  | WardKeyword;
```

#### 3.2 Keyword Helper Functions

```typescript
/**
 * Check if keyword stacks (has +N value)
 */
export function isStackingKeyword(
  keyword: KeywordAbility
): keyword is ChallengerKeyword | ResistKeyword {
  return keyword.type === "challenger" || keyword.type === "resist";
}

/**
 * Get total value for stacking keywords
 */
export function getKeywordValue(
  keywords: KeywordAbility[],
  type: "challenger" | "resist"
): number {
  return keywords
    .filter((k): k is ChallengerKeyword | ResistKeyword => k.type === type)
    .reduce((sum, k) => sum + k.value, 0);
}

/**
 * Check if character has specific keyword
 */
export function hasKeyword(
  abilities: LorcanaAbility[],
  type: KeywordAbility["type"]
): boolean {
  return abilities.some(
    (a) => a.type === "keyword" && a.keyword.type === type
  );
}
```

### 4. Ability System

Based on RULES.md Section 7:

#### 4.1 Ability Types

```typescript
// src/types/ability-types.ts
import type { CardId, PlayerId } from "@tcg/core";
import type { KeywordAbility } from "./keyword-types";

/**
 * Trigger timings for triggered abilities
 * RULES.md 7.4.2 - start with When/Whenever/At the start/At the end
 */
export type TriggerTiming =
  | "when-played"
  | "when-banished"
  | "when-damaged"
  | "when-quests"
  | "when-challenges"
  | "when-challenged"
  | "when-banished-in-challenge"
  | "at-start-of-turn"
  | "at-end-of-turn"
  | "whenever-quests"
  | "whenever-challenges"
  | "whenever-sings";

/**
 * Triggered Ability - RULES.md 7.4
 * Occurs when trigger condition is met
 */
export type TriggeredAbility = {
  type: "triggered";
  
  /** Trigger condition */
  trigger: TriggerTiming;
  
  /** Optional secondary condition (intervening "if") - RULES.md 7.4.4 */
  condition?: AbilityCondition;
  
  /** Effect to execute */
  effect: LorcanaEffect;
  
  /** Optional ability name (e.g., "Ohana") */
  name?: string;
};

/**
 * Activated Ability - RULES.md 7.5
 * [Cost] — [Effect] format
 */
export type ActivatedAbility = {
  type: "activated";
  
  /** Cost to activate (may include exert {E}) */
  cost: AbilityCost;
  
  /** Effect when activated */
  effect: LorcanaEffect;
  
  /** Optional ability name */
  name?: string;
};

/**
 * Static Ability - RULES.md 7.6
 * Continuously active while card in play
 */
export type StaticAbility = {
  type: "static";
  
  /** Effect that applies continuously */
  effect: LorcanaEffect;
  
  /** Optional duration (default: while in play) */
  duration?: "until-end-of-turn" | "while-condition" | "permanent";
  
  /** Optional condition for "while" duration */
  condition?: AbilityCondition;
  
  /** Optional ability name */
  name?: string;
};

/**
 * Keyword Ability wrapper
 */
export type KeywordAbilityWrapper = {
  type: "keyword";
  keyword: KeywordAbility;
};

/**
 * All ability types
 */
export type LorcanaAbility =
  | KeywordAbilityWrapper
  | TriggeredAbility
  | ActivatedAbility
  | StaticAbility;
```

#### 4.2 Ability Costs

```typescript
/**
 * Costs for activated abilities
 */
export type AbilityCost =
  | { type: "exert" } // {E}
  | { type: "ink"; amount: number }
  | { type: "banish-card"; cardType?: string }
  | { type: "discard"; amount: number }
  | { type: "composite"; costs: AbilityCost[] };
```

#### 4.3 Ability Conditions

```typescript
/**
 * Conditions for conditional abilities
 */
export type AbilityCondition =
  | { type: "has-characters"; count: number }
  | { type: "has-items"; count: number }
  | { type: "has-locations"; count: number }
  | { type: "character-classification"; classification: CharacterClassification }
  | { type: "custom"; predicate: string }; // function reference
```

#### 4.4 Effects

```typescript
/**
 * Effects for abilities and actions
 */
export type LorcanaEffect =
  | { type: "draw-cards"; amount: number }
  | { type: "deal-damage"; amount: number; target: "chosen-character" | "chosen-location" }
  | { type: "gain-lore"; amount: number }
  | { type: "modify-strength"; amount: number; duration: "this-turn" | "permanent" }
  | { type: "modify-willpower"; amount: number; duration: "this-turn" | "permanent" }
  | { type: "modify-lore-value"; amount: number; duration: "this-turn" }
  | { type: "ready-character"; target: "self" | "another" | "all" }
  | { type: "exert-character"; target: "self" | "chosen" }
  | { type: "banish-card"; target: "self" | "chosen" }
  | { type: "return-to-hand"; target: "self" | "chosen" }
  | { type: "grant-keyword"; keyword: KeywordAbility; duration: "this-turn" | "permanent" }
  | { type: "composite"; effects: LorcanaEffect[] };
```

### 5. Card Instance Extensions

Based on RULES.md Section 5 (Card Conditions) and integration with @tcg/core:

#### 5.1 Lorcana Custom State

```typescript
// src/types/card-instance-types.ts
import type { CardInstance } from "@tcg/core";
import type { CharacterClassification } from "./card-types";

/**
 * Lorcana-specific card instance state
 * Extends @tcg/core CardInstance<TCustomState>
 */
export type LorcanaCardState = {
  /** Damage counters on card (RULES.md 9.1) */
  damage: number;
  
  /** Whether card is exerted (RULES.md 5.1.2) */
  exerted: boolean;
  
  /** Whether card was played this turn (for "drying" check) */
  playedThisTurn: boolean;
  
  /** Cards under this card (for Shift stacks - RULES.md 5.1.5) */
  cardsUnder: CardId[];
  
  /** Card this is on top of (if shifted - RULES.md 5.1.6) */
  onTopOf?: CardId;
  
  /** Location this character is at (for character-location mechanic) */
  atLocation?: CardId;
  
  /** Characters at this location (if this is a location) */
  charactersHere: CardId[];
  
  /** Active modifiers from effects */
  activeModifiers: LorcanaModifier[];
};

/**
 * Complete Lorcana card instance
 */
export type LorcanaCardInstance = CardInstance<LorcanaCardState>;
```

#### 5.2 Modifiers

```typescript
/**
 * Lorcana-specific modifiers for stat changes
 * RULES.md 7.8 - Ability Modifiers
 */
export type LorcanaModifier = {
  /** Unique modifier ID */
  id: string;
  
  /** Source card that created modifier */
  source: CardId;
  
  /** Property being modified */
  property: "strength" | "willpower" | "lore-value" | "cost";
  
  /** Modification value (can be negative) */
  value: number;
  
  /** Duration */
  duration: "this-turn" | "until-end-of-turn" | "permanent";
  
  /** Turn number when created (for cleanup) */
  createdOnTurn: number;
};
```

### 6. Type Guards

```typescript
// src/cards/type-guards.ts
import type { 
  LorcanaCardDefinition,
  CharacterCardDefinition,
  ActionCardDefinition,
  ItemCardDefinition,
  LocationCardDefinition
} from "../types/card-types";

export function isCharacter(
  card: LorcanaCardDefinition
): card is CharacterCardDefinition {
  return card.type === "character";
}

export function isAction(
  card: LorcanaCardDefinition
): card is ActionCardDefinition {
  return card.type === "action";
}

export function isSong(
  card: LorcanaCardDefinition
): card is ActionCardDefinition {
  return card.type === "action" && card.isSong;
}

export function isItem(
  card: LorcanaCardDefinition
): card is ItemCardDefinition {
  return card.type === "item";
}

export function isLocation(
  card: LorcanaCardDefinition
): card is LocationCardDefinition {
  return card.type === "location";
}

/**
 * Check if card can be challenged
 * RULES.md 4.3.6 - Only characters and locations can be challenged
 */
export function canBeChallenged(
  card: LorcanaCardDefinition
): card is CharacterCardDefinition | LocationCardDefinition {
  return card.type === "character" || card.type === "location";
}

/**
 * Check if card has Willpower (characters and locations)
 */
export function hasWillpower(
  card: LorcanaCardDefinition
): card is CharacterCardDefinition | LocationCardDefinition {
  return card.type === "character" || card.type === "location";
}
```

### 7. Integration with @tcg/core

#### 7.1 Extending CardDefinition

```typescript
// src/cards/lorcana-card-definition.ts
import type { CardDefinition as CoreCardDefinition } from "@tcg/core";
import type { LorcanaCardDefinition } from "../types/card-types";

/**
 * Lorcana card definition extends @tcg/core CardDefinition
 * Maps Lorcana properties to core framework properties
 */
export function toLorcanaCardDefinition(
  coreDefinition: CoreCardDefinition,
  lorcanaData: LorcanaCardDefinition
): CoreCardDefinition & { lorcana: LorcanaCardDefinition } {
  return {
    ...coreDefinition,
    id: lorcanaData.id,
    name: lorcanaData.fullName,
    type: lorcanaData.type,
    baseCost: lorcanaData.inkCost,
    // Map Strength to basePower for characters
    basePower: isCharacter(lorcanaData) ? lorcanaData.strength : undefined,
    // Map Willpower to baseToughness
    baseToughness: hasWillpower(lorcanaData) ? lorcanaData.willpower : undefined,
    // Store complete Lorcana data
    lorcana: lorcanaData,
  };
}
```

#### 7.2 State Shape Integration

```typescript
// src/types/game-state.ts
import type { GameState } from "@tcg/core";
import type { LorcanaCardInstance } from "./card-instance-types";

/**
 * Lorcana game state extends core GameState
 * with Lorcana-specific state and card instances
 */
export type LorcanaGameState = GameState & {
  /** Override cards with Lorcana card instances */
  cards: Record<CardId, LorcanaCardInstance>;
  
  /** Lorcana-specific game state */
  lorcana: {
    /** Lore per player */
    lore: Record<PlayerId, number>;
    
    /** Active challenge state (if in challenge) */
    challengeState?: {
      challenger: CardId;
      challenged?: CardId;
    };
  };
};
```

### 8. Factory Functions

```typescript
// src/cards/card-factory.ts

/**
 * Create a character card definition
 */
export function createCharacter(
  data: Omit<CharacterCardDefinition, "fullName" | "type">
): CharacterCardDefinition {
  return {
    ...data,
    type: "character",
    fullName: data.version 
      ? `${data.name} - ${data.version}` 
      : data.name,
  };
}

/**
 * Create keyword ability
 */
export function createKeyword(
  keyword: KeywordAbility
): KeywordAbilityWrapper {
  return {
    type: "keyword",
    keyword,
  };
}

/**
 * Create Challenger keyword with stacking
 */
export function createChallenger(value: number): KeywordAbilityWrapper {
  return createKeyword({
    type: "challenger",
    value,
  });
}

/**
 * Create Resist keyword with stacking
 */
export function createResist(value: number): KeywordAbilityWrapper {
  return createKeyword({
    type: "resist",
    value,
  });
}
```

## External Dependencies

No new external dependencies required. All types build on existing @tcg/core framework:

- `@tcg/core` - CardDefinition, CardInstance, GameState, branded types (CardId, PlayerId, ZoneId)
- Built-in TypeScript utilities for type manipulation

## Implementation Notes

1. **Type Safety**: All card types use discriminated unions with `type` field for exhaustive checking
2. **Keyword Stacking**: Challenger and Resist support +N values; helper functions aggregate multiple instances
3. **Shift Mechanics**: Card stacks tracked via `cardsUnder` and `onTopOf` properties per RULES.md 5.1.7
4. **Immutability**: All state updates through Immer (inherited from @tcg/core)
5. **Damage Tracking**: Damage counters persist until card leaves play (RULES.md 9.4)
6. **Modifier System**: Temporary stat changes via activeModifiers array, cleaned up by turn number

## Testing Strategy

1. **Type Tests**: Verify type narrowing with type guards
2. **Factory Tests**: Ensure factory functions create valid card definitions
3. **Integration Tests**: Verify CardInstance works with Immer and produces delta patches
4. **Keyword Tests**: Validate stacking behavior for Challenger and Resist
5. **Modifier Tests**: Verify modifiers apply correctly and clean up appropriately

