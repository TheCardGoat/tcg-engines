# Specification 6: Keywords

## Source Rules
- Section 10 (Keywords) - Rules 10.1-10.13

## Overview

This specification covers all 12 Lorcana keywords:
- Simple keywords: Bodyguard, Evasive, Reckless, Rush, Support, Vanish, Ward
- Parameterized keywords: Challenger +X, Resist +X
- Complex keywords: Shift, Singer X, Sing Together X

## Implementation Files

- `src/keywords/keyword-types.ts` - Keyword type definitions
- `src/keywords/keyword-effects.ts` - Keyword effect implementations
- `src/keywords/bodyguard.ts` - Bodyguard logic
- `src/keywords/challenger.ts` - Challenger logic
- `src/keywords/evasive.ts` - Evasive logic
- `src/keywords/reckless.ts` - Reckless logic
- `src/keywords/resist.ts` - Resist logic
- `src/keywords/rush.ts` - Rush logic
- `src/keywords/shift.ts` - Shift logic
- `src/keywords/singer.ts` - Singer and Sing Together logic
- `src/keywords/support.ts` - Support logic
- `src/keywords/vanish.ts` - Vanish logic
- `src/keywords/ward.ts` - Ward logic

## Types

### Keyword Definitions

```typescript
type SimpleKeyword = "Bodyguard" | "Evasive" | "Reckless" | "Rush" | "Support" | "Vanish" | "Ward";

type ParameterizedKeyword =
  | { type: "Challenger"; value: number }
  | { type: "Resist"; value: number };

type ComplexKeyword =
  | { type: "Shift"; cost: number; targetName: string }
  | { type: "Singer"; value: number }
  | { type: "SingTogether"; value: number };

type Keyword = SimpleKeyword | ParameterizedKeyword | ComplexKeyword;
```

### Keyword Effects

```typescript
interface KeywordEffect {
  keyword: Keyword;
  isActive: (state: GameState, cardId: CardId) => boolean;
  apply: (state: GameState, cardId: CardId, context: KeywordContext) => GameState;
}

interface KeywordContext {
  event: KeywordEvent;
  sourceCardId: CardId;
  targetCardId?: CardId;
}

type KeywordEvent =
  | "onChallenge"
  | "onBeingChallenged"
  | "onQuest"
  | "onEnterPlay"
  | "onLeavePlay"
  | "onDamageDealt"
  | "onDamageReceived"
  | "onTargeted"
  | "onExerted";
```

### Stacking Keywords

```typescript
interface StackingKeywordTotal {
  keyword: "Challenger" | "Resist";
  baseValue: number;
  modifiers: { source: CardId | "ability"; amount: number }[];
  totalValue: number;
}
```

## External API

```typescript
// Keyword queries
function hasKeyword(card: LorcanaCardDefinition, keyword: string): boolean;
function getKeywordValue(card: LorcanaCardDefinition, keyword: string): number | null;
function getAllKeywords(card: LorcanaCardDefinition): Keyword[];
function hasSimpleKeyword(card: LorcanaCardDefinition, keyword: SimpleKeyword): boolean;

// Stacking keyword totals
function getTotalChallenger(state: GameState, cardId: CardId): number;
function getTotalResist(state: GameState, cardId: CardId): number;

// Keyword state checks
function canQuest(state: GameState, cardId: CardId): boolean; // Checks Reckless
function needsDryRequirement(state: GameState, cardId: CardId): boolean; // Checks Rush
function canBeChosen(state: GameState, cardId: CardId, byPlayerId: PlayerId): boolean; // Checks Ward
function mustChallengeFirst(state: GameState, targetId: CardId, attackerHasEvasive: boolean): boolean; // Checks Bodyguard
function canChallengeReady(state: GameState, challengerId: CardId): boolean; // Checks Evasive

// Shift helpers
function getShiftTargetName(card: LorcanaCardDefinition): string | null;
function getShiftCost(card: LorcanaCardDefinition): number | null;
function canShift(state: GameState, shiftingCardId: CardId): boolean;

// Singer helpers
function getSingerValue(card: LorcanaCardDefinition): number | null;
function getSingTogetherValue(card: LorcanaCardDefinition): number | null;
function canSing(state: GameState, singerId: CardId, songCost: number): boolean;

// Support helpers
function applySupportBonus(state: GameState, supporterId: CardId, targetId: CardId): GameState;
function getSupportTargets(state: GameState, supporterId: CardId): CardId[];

// Vanish helpers
function shouldVanish(state: GameState, cardId: CardId, destinationZone: ZoneId): boolean;
```

## Test Cases

### Bodyguard (Rule 10.2)

1. `blocks challenges to other characters while ready` - Blocking effect
2. `doesn't block when exerted` - Exerted state
3. `opponent can choose which Bodyguard to challenge` - Multiple bodyguards
4. `is bypassed by Evasive` - Evasive interaction

### Challenger (Rule 10.3)

1. `adds bonus strength while challenging` - Bonus damage
2. `doesn't add bonus when being challenged` - Attacking only
3. `stacks multiple Challenger instances` - Stacking
4. `Challenger +2 and +1 equals +3 total` - Value addition

### Evasive (Rule 10.4)

1. `can challenge ready characters` - Ready targets
2. `ignores Bodyguard restriction` - Bypass bodyguard
3. `can still challenge exerted characters` - Normal behavior

### Reckless (Rule 10.5)

1. `prevents character from questing` - Quest prevention
2. `doesn't prevent challenging` - Challenge allowed
3. `doesn't prevent using abilities` - Abilities allowed

### Resist (Rule 10.6)

1. `reduces dealt damage by X` - Damage reduction
2. `stacks multiple Resist instances` - Stacking
3. `cannot reduce below 0` - Minimum damage
4. `does NOT affect 'put damage counters' effects (Rule 10.6.x)` - Put vs deal

### Rush (Rule 10.7)

1. `can quest the turn played` - Immediate quest
2. `can challenge the turn played` - Immediate challenge
3. `can use exert abilities the turn played` - Immediate abilities
4. `bypasses normal drying requirement` - No summoning sickness

### Shift (Rule 10.8)

1. `allows alternate cost on matching name` - Name match
2. `creates stack with shifted card on top` - Stack creation
3. `shifted character is ready (Rule 10.8.x)` - Ready state
4. `damage carries over from underneath (Rule 10.8.x)` - Damage transfer
5. `all cards in stack leave together (Rule 10.8.x)` - Stack departure

### Singer (Rule 10.9)

1. `can sing songs with cost <= singer value` - Cost comparison
2. `must be dry to sing` - Dry requirement
3. `exerts when singing` - Exert cost
4. `is alternate cost, not triggered ability` - Cost type

### Sing Together (Rule 10.10)

1. `combines values to meet song cost` - Combined value
2. `all singers must be dry` - All dry requirement
3. `exerts all participating singers` - Multiple exerts
4. `triggers 'when exerted' for each singer` - Individual triggers

### Support (Rule 10.11)

1. `gives +1 Strength to another character when played` - Bonus grant
2. `effect lasts until end of turn` - Duration
3. `is optional ('may')` - Optional effect
4. `can only target other characters (not self)` - Target restriction

### Vanish (Rule 10.12)

1. `banishes card instead of returning to hand` - Hand redirect
2. `banishes card instead of going to deck` - Deck redirect
3. `only applies when leaving play to non-discard zone` - Zone check
4. `does not prevent normal banishment` - Banish allowed

### Ward (Rule 10.13)

1. `cannot be chosen by opponent's abilities` - Targeting protection
2. `can still be affected by 'all characters' effects` - Non-targeted effects
3. `can still be challenged` - Challenge allowed
4. `can be chosen by own abilities` - Own abilities allowed

## Dependencies

- Depends on Spec 1: Foundation & Types
- Depends on Spec 2: Zones & Card States

## Acceptance Criteria

- [ ] All 12 keywords are implemented
- [ ] Simple keywords work correctly
- [ ] Parameterized keywords stack properly
- [ ] Complex keywords (Shift, Singer, Sing Together) work correctly
- [ ] Keyword interactions are handled (Evasive vs Bodyguard)
- [ ] All test cases pass
