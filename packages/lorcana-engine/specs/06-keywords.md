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
- `src/keywords/index.ts` - Keyword exports

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

Keyword effects are implemented as individual functional helpers rather than a unified interface.

```typescript
interface KeywordContext {
  event: KeywordEvent;
  sourceCardId: CardId;
  targetCardId?: CardId;
  playerId: PlayerId;
  opponentId: PlayerId;
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
  modifiers: { source: CardId | "ability" | "effect"; amount: number }[];
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
function calculateTotalChallenger(card: LorcanaCardDefinition, additionalModifiers?: any[]): StackingKeywordTotal;
function calculateTotalResist(card: LorcanaCardDefinition, additionalModifiers?: any[]): StackingKeywordTotal;

// Keyword state checks
function canQuest(state: GameState, cardId: CardId): boolean; // Checks Reckless (via card-utils)
function needsDryRequirement(card: LorcanaCardDefinition): boolean; // Checks Rush
function canBypassDrying(card: LorcanaCardDefinition): boolean; // Checks Rush
function canBeChosenBy(targetCard: LorcanaCardDefinition, targetOwner: PlayerId, byPlayerId: PlayerId): boolean; // Checks Ward
function checkWardProtection(targetCard: LorcanaCardDefinition, targetOwner: PlayerId, sourcePlayerId: PlayerId): WardCheckResult;

// Shift helpers
function getShiftTargetName(card: LorcanaCardDefinition): string | null;
function getShiftCost(card: LorcanaCardDefinition): number | null;

// Singer helpers
function getSingerValue(keywords: Keyword[]): number | null;
function getSingTogetherValue(keywords: Keyword[]): number | null;
function canSingSong(singerCard: LorcanaCardDefinition, singerState: CardInstanceState, songCost: number): boolean;
function canSingTogether(singers: { card: LorcanaCardDefinition; state: CardInstanceState }[], songCost: number): boolean;

// Support helpers
function createSupportBonus(supporterId: CardId, supporterCard: LorcanaCardDefinition, targetId: CardId): SupportContext;
function getValidSupportTargets(supporterId: CardId, allCharacters: { cardId: CardId; owner: PlayerId }[], supporterOwner: PlayerId): CardId[];

// Vanish helpers
function shouldVanishRedirect(card: LorcanaCardDefinition, destinationZone: string): boolean;
function getVanishRedirect(cardId: CardId, card: LorcanaCardDefinition, originalDestination: string): VanishRedirect | null;
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

1. `gives Strength equal to this character's Strength to another character when questing` - Bonus grant
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
