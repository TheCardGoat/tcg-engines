# Specification 7: Abilities System

## Source Rules
- Section 7 (Abilities) - Rules 7.1-7.8

## Overview

This specification covers:
- Triggered abilities (automatic when condition met)
- Activated abilities (cost → effect)
- Static abilities (continuous effects)
- Replacement effects (instead effects)
- Ability modifiers (gain/lose/can't/must)

## Implementation Files

- `src/abilities/ability-types.ts` - Ability type definitions
- `src/abilities/triggered.ts` - Triggered ability logic
- `src/abilities/activated.ts` - Activated ability logic
- `src/abilities/static.ts` - Static ability logic
- `src/abilities/replacement.ts` - Replacement effect logic
- `src/abilities/ability-modifiers.ts` - Gain/lose/can't/must modifiers
- `src/abilities/effect-resolver.ts` - Effect resolution

## Types

### Ability Definition

```typescript
type AbilityDefinition =
  | TriggeredAbilityDefinition
  | ActivatedAbilityDefinition
  | StaticAbilityDefinition;

interface TriggeredAbilityDefinition {
  type: "triggered";
  id: string;
  name?: string;
  trigger: TriggerCondition;
  effect: EffectDefinition;
  isFloating?: boolean;  // Triggers even after leaving play
  isOptional?: boolean;  // "may" keyword
}

interface ActivatedAbilityDefinition {
  type: "activated";
  id: string;
  name?: string;
  cost: AbilityCost;
  effect: EffectDefinition;
}

interface StaticAbilityDefinition {
  type: "static";
  id: string;
  name?: string;
  condition?: StateCondition;
  effect: StaticEffectDefinition;
  duration?: Duration;
  worksOutsidePlay?: boolean;
}
```

### Trigger Conditions

```typescript
type TriggerCondition =
  | { type: "whenPlayed" }
  | { type: "whenBanished" }
  | { type: "whenQuests" }
  | { type: "whenChallenges" }
  | { type: "whenChallenged" }
  | { type: "whenExerted" }
  | { type: "whenDamaged" }
  | { type: "atStartOfTurn" }
  | { type: "atEndOfTurn" }
  | { type: "wheneverYouPlay"; cardFilter?: CardFilter }
  | { type: "wheneverOpponentPlays"; cardFilter?: CardFilter }
  | { type: "wheneverCharacterBanished"; cardFilter?: CardFilter }
  | { type: "custom"; check: (event: GameEvent) => boolean };
```

### Ability Costs

```typescript
interface AbilityCost {
  exert?: boolean;           // ⬇ symbol
  ink?: number;
  discardCards?: number;
  banishThis?: boolean;
  putDamageOnThis?: number;
  custom?: AbilityCostCheck;
}

type AbilityCostCheck = (state: GameState, cardId: CardId) => boolean;
```

### Effects

```typescript
interface EffectDefinition {
  type: EffectType;
  params: Record<string, unknown>;
  isOptional?: boolean;      // "may"
  targets?: TargetDefinition;
}

type EffectType =
  | "dealDamage"
  | "putDamage"
  | "removeDamage"
  | "drawCards"
  | "discardCards"
  | "gainLore"
  | "loseLore"
  | "returnToHand"
  | "banish"
  | "exert"
  | "ready"
  | "modifyStats"
  | "grantKeyword"
  | "removeKeyword"
  | "moveToZone"
  | "lookAtCards"
  | "revealCards"
  | "shuffle"
  | "custom";

interface TargetDefinition {
  type: "character" | "item" | "location" | "card" | "player";
  filter?: CardFilter;
  count?: number | "any" | "all";
  controller?: "you" | "opponent" | "any";
}
```

### Duration

```typescript
type Duration =
  | { type: "untilEndOfTurn" }
  | { type: "untilStartOfNextTurn" }
  | { type: "untilCondition"; condition: StateCondition }
  | { type: "whileInPlay" }
  | { type: "permanent" };
```

### Static Effects

```typescript
interface StaticEffectDefinition {
  type: StaticEffectType;
  params: Record<string, unknown>;
  affectedCards?: CardFilter;
}

type StaticEffectType =
  | "modifyStrength"
  | "modifyWillpower"
  | "modifyLore"
  | "grantKeyword"
  | "preventAction"
  | "requireAction"
  | "modifyCost"
  | "custom";
```

### Replacement Effects (Rule 7.7)

```typescript
interface ReplacementEffect {
  type: "replacement";
  id: string;
  replaceEvent: GameEventType;
  withEffect: EffectDefinition | "nothing";
  condition?: StateCondition;
}

type GameEventType =
  | "draw"
  | "damage"
  | "banish"
  | "returnToHand"
  | "returnToDeck"
  | "gainLore"
  | "exert";
```

### Ability Modifiers (Rule 7.8)

```typescript
interface AbilityModifier {
  type: "gain" | "lose" | "cant" | "must";
  ability?: AbilityDefinition | Keyword;
  action?: string;  // For can't/must
  duration?: Duration;
}
```

## External API

```typescript
// Ability queries
function getAbilities(card: LorcanaCardDefinition): AbilityDefinition[];
function getTriggeredAbilities(card: LorcanaCardDefinition): TriggeredAbilityDefinition[];
function getActivatedAbilities(card: LorcanaCardDefinition): ActivatedAbilityDefinition[];
function getStaticAbilities(card: LorcanaCardDefinition): StaticAbilityDefinition[];

// Activated ability usage
function canUseAbility(game: LorcanaGame, cardId: CardId, abilityId: string): MoveValidationResult;
function useAbility(game: LorcanaGame, cardId: CardId, abilityId: string, params?: AbilityParams): void;
function getUsableAbilities(game: LorcanaGame, playerId: PlayerId): { cardId: CardId; abilityId: string }[];

// Ability cost checking
function canPayAbilityCost(game: LorcanaGame, cardId: CardId, cost: AbilityCost): boolean;
function payAbilityCost(game: LorcanaGame, cardId: CardId, cost: AbilityCost): GameState;

// Triggered ability checking
function checkTriggers(game: LorcanaGame, event: GameEvent): TriggeredAbilityInstance[];
function getFloatingTriggers(game: LorcanaGame, event: GameEvent): TriggeredAbilityInstance[];

// Static ability application
function applyStaticAbilities(game: LorcanaGame): GameState;
function getActiveStaticEffects(game: LorcanaGame, cardId: CardId): StaticEffectDefinition[];
function recalculateStaticEffects(game: LorcanaGame): GameState;

// Replacement effects
function checkReplacements(game: LorcanaGame, event: GameEvent): ReplacementEffect | null;
function applyReplacement(game: LorcanaGame, original: GameEvent, replacement: ReplacementEffect): GameState;

// Effect resolution
function resolveEffect(game: LorcanaGame, effect: EffectDefinition, source: CardId): GameState;
function resolveEffectWithTargets(game: LorcanaGame, effect: EffectDefinition, source: CardId, targets: CardId[]): GameState;
```

## Test Cases

### Triggered Abilities (Rule 7.4)

1. `triggers when condition is met` - Basic trigger
2. `adds triggered ability to bag` - Bag usage
3. `supports multiple triggers from same event` - Multiple triggers
4. `floating triggers work after card leaves play` - Floating triggers
5. `delayed triggers execute at specified time` - Delayed triggers
6. `'when' triggers once per event` - When semantics
7. `'whenever' triggers for each occurrence` - Whenever semantics

### Activated Abilities (Rule 7.5)

1. `requires paying full cost` - Cost requirement
2. `exert abilities require ready and dry card` - Exert prereqs
3. `items can use abilities turn they're played (Rule 4.3.8.3)` - Item exception
4. `characters must be dry for exert abilities` - Character restriction
5. `'for free' ignores ink cost only` - For free semantics
6. `rejects ability use if cost can't be paid` - Cost validation

### Static Abilities (Rule 7.6)

1. `applies effect while card is in play` - Active while in play
2. `removes effect when card leaves play` - Deactivation
3. `tracks 'this turn' duration` - Turn duration
4. `tracks 'until condition' duration` - Conditional duration
5. `some abilities work outside of play` - Out-of-play abilities
6. `updates immediately when conditions change` - Immediate update

### Replacement Effects (Rule 7.7)

1. `replaces original event with replacement` - Basic replacement
2. `'instead' keyword identifies replacement` - Instead keyword
3. `'skip' effects prevent event entirely` - Skip effect
4. `only one replacement applies per event` - Single replacement

### Ability Modifiers (Rule 7.8)

1. `'gain' adds ability to card` - Gain modifier
2. `'lose' removes ability from card` - Lose modifier
3. `'can't' prevents action (prohibition beats permission)` - Can't restriction
4. `'must' forces action` - Must requirement

### General Rules (Rule 7.1)

1. `'may' effects are optional` - Optional effects
2. `'up to X' allows choosing 0 to X` - Up to semantics
3. `'other/another' excludes source card` - Other/another
4. `'that' refers to most recent noun` - That reference
5. `resolves as much as possible` - Partial resolution

### Action Card Effects (Rule 7.2)

1. `action effects resolve immediately` - Immediate resolution
2. `action effects don't use the bag` - No bag for actions
3. `action goes to discard after resolving` - Post-resolution destination

## Dependencies

- Depends on Spec 1: Foundation & Types
- Depends on Spec 2: Zones & Card States
- Depends on Spec 3: Turn Structure & Flow
- Depends on Spec 6: Keywords

## Acceptance Criteria

- [ ] All ability types are implemented
- [ ] Triggered abilities add to bag correctly
- [ ] Activated abilities validate costs
- [ ] Static abilities update dynamically
- [ ] Replacement effects work correctly
- [ ] Ability modifiers are tracked
- [ ] All test cases pass
