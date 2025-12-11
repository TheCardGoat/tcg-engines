# Specification 5: Quest, Challenge & Locations

## Source Rules
- Section 4.3.5 (Quest) - Rules 4.3.5-4.3.5.10
- Section 4.3.6 (Challenge) - Rules 4.3.6-4.3.6.23
- Section 4.3.7 (Move to Location) - Rules 4.3.7-4.3.7.6
- Section 6.5 (Locations) - Rules 6.5.1-6.5.8

## Overview

This specification covers:
- Quest action (gain lore)
- Challenge action (combat)
- Challenge damage resolution
- Location mechanics
- Moving characters to locations

## Implementation Files

- `src/combat/quest.ts` - Quest action logic
- `src/combat/challenge.ts` - Challenge action logic and damage calculations
- `src/combat/move-to-location.ts` - Location movement

## Types

### Quest Move

```typescript
interface QuestMove {
  type: "quest";
  characterId: CardId;
}

type QuestValidationError =
  | { type: "NOT_A_CHARACTER" }
  | { type: "NOT_READY" }
  | { type: "NOT_DRY" }
  | { type: "HAS_RECKLESS" }
  | { type: "NOT_IN_PLAY" }
  | { type: "NOT_YOUR_CHARACTER" };
```

### Challenge Move

```typescript
interface ChallengeMove {
  type: "challenge";
  challengerId: CardId;
  targetId: CardId;  // Character or Location
}

type ChallengeValidationError =
  | { type: "NOT_A_CHARACTER" }
  | { type: "NOT_READY" }
  | { type: "NOT_DRY" }
  | { type: "TARGET_NOT_EXERTED" }
  | { type: "TARGET_HAS_EVASIVE" }
  | { type: "BODYGUARD_BLOCKING"; bodyguardId: CardId }
  | { type: "CANNOT_CHALLENGE_OWN" }
  | { type: "INVALID_TARGET" };
```

### Move to Location

```typescript
interface MoveToLocationMove {
  type: "moveToLocation";
  characterId: CardId;
  locationId: CardId;
}

type MoveToLocationError =
  | { type: "NOT_A_CHARACTER" }
  | { type: "NOT_A_LOCATION" }
  | { type: "NOT_YOUR_CHARACTER" }
  | { type: "NOT_YOUR_LOCATION" }
  | { type: "INSUFFICIENT_INK" }
  | { type: "ALREADY_AT_LOCATION" };
```

### Challenge State

```typescript
interface ChallengeState {
  challengerId: CardId;
  targetId: CardId;
  phase: "declared" | "damage" | "resolved";
  challengerDamageDealt: number;
  targetDamageDealt: number;
}
```

### Damage Calculation

```typescript
interface DamageCalculation {
  baseStrength: number;
  modifiers: DamageModifier[];
  totalDamage: number;
}

interface DamageModifier {
  source: CardId | "keyword";
  type: "challenger" | "support" | "static" | "temporary";
  amount: number;
}
```

## External API

```typescript
// Quest
function canQuest(game: LorcanaGame, characterId: CardId): MoveValidationResult;
function quest(game: LorcanaGame, characterId: CardId): void;
function getQuestableCharacters(game: LorcanaGame, playerId: PlayerId): CardId[];

// Challenge
function canChallenge(game: LorcanaGame, challengerId: CardId, targetId: CardId): MoveValidationResult;
function challenge(game: LorcanaGame, move: ChallengeMove): void;
function getChallengeableTargets(game: LorcanaGame, challengerId: CardId): CardId[];
function getChallengingCharacters(game: LorcanaGame, playerId: PlayerId): CardId[];

// Challenge damage
function calculateChallengeDamage(game: LorcanaGame, attackerId: CardId, isChallenger: boolean): DamageCalculation;
function applyChallengeDamage(game: LorcanaGame, challenge: ChallengeState): void;

// Bodyguard
function getBlockingBodyguards(game: LorcanaGame, attackingPlayerId: PlayerId): CardId[];
function mustChallengeBodyguard(game: LorcanaGame, challengerId: CardId, targetId: CardId): boolean;
function canBypassBodyguard(game: LorcanaGame, challengerId: CardId): boolean;

// Locations
function canMoveToLocation(game: LorcanaGame, characterId: CardId, locationId: CardId): MoveValidationResult;
function moveToLocation(game: LorcanaGame, move: MoveToLocationMove): void;
function getCharactersAtLocation(game: LorcanaGame, locationId: CardId): CardId[];
function getLocationOfCharacter(game: LorcanaGame, characterId: CardId): CardId | null;
function removeFromLocation(game: LorcanaGame, characterId: CardId): void;
function getMoveCost(location: LorcanaCardDefinition): number;
```

## Test Cases

### Quest (Rule 4.3.5)

1. `allows ready, dry character to quest` - Basic quest
2. `rejects exerted character (Rule 4.3.5.4)` - Exert restriction
3. `rejects drying character (Rule 4.3.5.5)` - Drying restriction
4. `rejects character with Reckless (Rule 4.3.5.6)` - Reckless restriction
5. `exerts character when questing (Rule 4.3.5.7)` - Exert on quest
6. `gains lore equal to character's lore value (Rule 4.3.5.8)` - Lore gain
7. `triggers 'when questing' abilities` - Quest triggers
8. `character with 0 lore can still quest` - Zero lore quest

### Challenge Character (Rule 4.3.6)

1. `allows challenging exerted opponent character` - Basic challenge
2. `requires challenger to be ready (Rule 4.3.6.4)` - Ready requirement
3. `requires challenger to be dry (Rule 4.3.6.5)` - Dry requirement
4. `rejects challenging ready character (Rule 4.3.6.7)` - Ready target rejection
5. `rejects challenging own characters` - Own character rejection
6. `exerts challenger when challenging (Rule 4.3.6.10)` - Exert on challenge
7. `triggers 'while challenging' effects (Rule 4.3.6.11)` - Challenge triggers

### Challenge Damage Step (Rule 4.3.6.13-16)

1. `both characters deal damage simultaneously` - Simultaneous damage
2. `damage equals character's strength` - Base damage
3. `applies Challenger bonus only for attacker` - Challenger keyword
4. `applies Resist to reduce damage taken` - Resist keyword
5. `game state check happens after damage` - State check timing
6. `both characters can be banished simultaneously` - Mutual destruction

### Bodyguard (Rule 10.2)

1. `opponent must challenge Bodyguard first if ready` - Bodyguard blocking
2. `Bodyguard doesn't block if exerted` - Exerted Bodyguard
3. `multiple Bodyguards - can choose which to challenge` - Multiple bodyguards
4. `Evasive ignores Bodyguard (Rule 10.4)` - Evasive bypass

### Evasive (Rule 10.4)

1. `can challenge ready characters` - Ready target
2. `ignores Bodyguard restriction` - Bypass bodyguard
3. `can still challenge exerted characters` - Normal challenge

### Challenge Location (Rule 4.3.6.19-22)

1. `locations can be challenged anytime` - No exert requirement
2. `locations don't need to be exerted` - Always targetable
3. `locations don't deal damage back` - No counter damage
4. `location is banished when damage >= willpower` - Location destruction
5. `characters at banished location remain in play (Rule 6.5.8)` - Character persistence

### Move to Location (Rule 4.3.7)

1. `can move own character to own location` - Basic move
2. `cannot move to opponent's location (Rule 4.3.7.5)` - Own location only
3. `cannot move opponent's character (Rule 4.3.7.6)` - Own character only
4. `pays location's move cost (Rule 4.3.7.3)` - Move cost payment
5. `character is now 'at' the location` - Location tracking
6. `triggers 'when moved' abilities` - Move triggers
7. `character can benefit from location abilities` - Location bonuses

## Dependencies

- Depends on Spec 1: Foundation & Types
- Depends on Spec 2: Zones & Card States
- Depends on Spec 3: Turn Structure & Flow
- Depends on Spec 4: Core Moves (for ink payment)

## Acceptance Criteria

- [ ] Quest action works with proper validation
- [ ] Challenge action works against characters and locations
- [ ] Damage calculation includes all modifiers
- [ ] Bodyguard blocking is enforced correctly
- [ ] Evasive bypasses Bodyguard
- [ ] Location movement works correctly
- [ ] All test cases pass
