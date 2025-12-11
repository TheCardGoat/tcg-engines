# Specification 8: Bag & Game State Check

## Source Rules
- Section 1.7 (The Bag) - Rules 1.7.1-1.7.2
- Section 1.9 (Game State Check) - Rules 1.9.1-1.9.5
- Section 8.7 (Bag) - Rules 8.7.1-8.7.x

## Overview

This specification covers:
- The Bag system for triggered abilities
- Bag resolution order
- Game state check procedure
- Win/loss condition checking
- Banishment from damage

## Implementation Files

- `src/systems/bag.ts` - Bag management
- `src/systems/bag-resolution.ts` - Bag resolution logic
- `src/systems/game-state-check.ts` - State check procedure
- `src/systems/win-conditions.ts` - Win/loss checking
- `src/systems/banishment.ts` - Banishment logic

## Types

### Bag Entry

```typescript
interface BagEntry {
  id: string;
  ability: TriggeredAbilityInstance;
  sourceCardId: CardId;
  controllerId: PlayerId;
  triggerEvent: GameEvent;
  timestamp: number;
}

interface TriggeredAbilityInstance {
  definition: TriggeredAbilityDefinition;
  sourceCardId: CardId;
  sourceCardSnapshot?: LorcanaCardDefinition;  // For floating triggers
  targets?: CardId[];
  params?: Record<string, unknown>;
}
```

### Bag Resolution

```typescript
interface BagResolutionChoice {
  bagEntryId: string;
}

interface BagState {
  entries: BagEntry[];
  currentlyResolving: BagEntry | null;
  resolutionOrder: string[];  // History of resolved entries
}
```

### Game State Check

```typescript
interface GameStateCheckResult {
  winConditions: WinCondition[];
  lossConditions: LossCondition[];
  requiredActions: RequiredAction[];
  newTriggers: BagEntry[];
}

interface WinCondition {
  playerId: PlayerId;
  reason: "lore_victory";
  lore: number;
}

interface LossCondition {
  playerId: PlayerId;
  reason: "deck_out" | "concede";
}

interface RequiredAction {
  type: "banish";
  cardId: CardId;
  reason: "damage_exceeds_willpower";
}
```

### Resolution State

```typescript
interface ResolutionState {
  bag: BagState;
  pendingGameStateCheck: boolean;
  gameStateCheckQueue: GameStateCheckResult[];
}
```

### Game End State

```typescript
interface GameEndState {
  isOver: boolean;
  winner?: PlayerId;
  loser?: PlayerId;
  reason?: GameEndReason;
}

type GameEndReason =
  | { type: "LORE_VICTORY"; playerId: PlayerId; lore: number }
  | { type: "DECK_OUT"; playerId: PlayerId }
  | { type: "CONCEDE"; playerId: PlayerId };
```

## External API

```typescript
// Bag queries
function getBag(game: LorcanaGame): BagEntry[];
function isBagEmpty(game: LorcanaGame): boolean;
function getBagSize(game: LorcanaGame): number;
function getBagEntriesForPlayer(game: LorcanaGame, playerId: PlayerId): BagEntry[];
function getResolvableEntries(game: LorcanaGame): BagEntry[];

// Bag manipulation
function addToBag(game: LorcanaGame, entry: BagEntry): void;
function addTriggeredAbilityToBag(game: LorcanaGame, ability: TriggeredAbilityInstance, event: GameEvent): void;
function resolveBagEntry(game: LorcanaGame, choice: BagResolutionChoice): void;
function removeFromBag(game: LorcanaGame, entryId: string): void;
function clearBag(game: LorcanaGame): void;

// Bag resolution flow
function mustResolveBag(game: LorcanaGame): boolean;
function getNextResolvableEntries(game: LorcanaGame): BagEntry[];
function chooseAndResolveBagEntry(game: LorcanaGame, entryId: string): void;
function resolveAllBagEntries(game: LorcanaGame, choices: string[]): void;

// Game State Check
function performGameStateCheck(game: LorcanaGame): GameStateCheckResult;
function processRequiredActions(game: LorcanaGame, result: GameStateCheckResult): void;
function needsGameStateCheck(game: LorcanaGame): boolean;

// Win/Loss
function checkWinConditions(game: LorcanaGame): WinCondition[];
function checkLossConditions(game: LorcanaGame): LossCondition[];
function getWinner(game: LorcanaGame): PlayerId | null;
function getLoser(game: LorcanaGame): PlayerId | null;
function isGameOver(game: LorcanaGame): boolean;
function getGameEndState(game: LorcanaGame): GameEndState;
function concede(game: LorcanaGame, playerId: PlayerId): void;

// Damage/Banishment checks
function getCardsExceedingWillpower(game: LorcanaGame): CardId[];
function shouldBanish(game: LorcanaGame, cardId: CardId): boolean;
function banishCard(game: LorcanaGame, cardId: CardId): void;
function banishCardsExceedingWillpower(game: LorcanaGame): CardId[];
```

## Test Cases

### The Bag (Rule 1.7, 8.7)

1. `triggered abilities go into the bag` - Bag population
2. `action effects don't use the bag` - Action exception
3. `active player chooses resolution order` - Order choice
4. `each ability resolves completely before next` - Sequential resolution
5. `can have multiple abilities from both players` - Multi-player bag

### Bag Resolution Order

1. `active player chooses from available entries` - Choice mechanism
2. `own and opponent's triggers can both be in bag` - Mixed ownership
3. `resolving one trigger can add more triggers` - Cascading triggers
4. `continues until bag is empty` - Full resolution
5. `player cannot pass with bag entries remaining` - Forced resolution

### Game State Check (Rule 1.9)

1. `happens after every action` - Post-action check
2. `happens after every ability resolves` - Post-ability check
3. `happens after each bag entry resolves` - Post-bag-entry check
4. `checks win conditions first (Rule 1.9.2)` - Win priority
5. `checks loss conditions (Rule 1.9.2)` - Loss checking
6. `checks damage vs willpower (Rule 1.9.3)` - Banishment check

### Win Condition: 20 Lore (Rule 3.2.1.1)

1. `player wins at exactly 20 lore` - Exact threshold
2. `player wins at more than 20 lore` - Above threshold
3. `checked during game state check` - Check timing
4. `lore from multiple sources triggers win` - Combined lore

### Loss Condition: Empty Deck (Rule 3.2.1.2)

1. `player loses when trying to draw from empty deck` - Draw trigger
2. `having empty deck alone doesn't cause loss` - Passive empty OK
3. `loss checked during game state check` - Check timing
4. `mandatory draw from empty deck ends game` - Draw step loss

### Banishment Check (Rule 1.9.3)

1. `banishes character when damage >= willpower` - Basic banish
2. `banishes location when damage >= willpower` - Location banish
3. `banishes character when damage equals willpower exactly` - Exact match
4. `does not banish when damage < willpower` - Below threshold
5. `banishment triggers 'when banished' abilities` - Banish triggers
6. `multiple cards can be banished simultaneously` - Multi-banish

### Simultaneous Events

1. `active player resolves first in turn order` - Turn order priority
2. `win takes priority over loss (Rule 1.9.x)` - Win beats loss
3. `both characters can be banished in challenge` - Mutual destruction
4. `required actions happen in turn order` - Action ordering

### Trigger from Leaving Play

1. `'when banished' triggers still resolve` - Banish triggers
2. `floating triggers added to bag` - Floating trigger bag
3. `card is gone but ability still resolves` - Post-departure resolution
4. `uses snapshot of card state when triggered` - State snapshot

## Dependencies

- Depends on Spec 1: Foundation & Types
- Depends on Spec 2: Zones & Card States
- Depends on Spec 3: Turn Structure & Flow
- Depends on Spec 7: Abilities System

## Acceptance Criteria

- [ ] Bag stores and manages triggered abilities
- [ ] Active player can choose resolution order
- [ ] Game state check happens at correct times
- [ ] Win/loss conditions are checked correctly
- [ ] Banishment happens when damage >= willpower
- [ ] Floating triggers work after card leaves play
- [ ] All test cases pass
