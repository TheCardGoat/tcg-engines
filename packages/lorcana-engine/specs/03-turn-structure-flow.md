# Specification 3: Turn Structure & Flow

## Source Rules
- Section 4 (Turn Structure) - Rules 4.1-4.4
- Section 3 (Gameplay) - Rules 3.1-3.2

## Overview

This specification covers:
- Game setup procedure
- Mulligan system
- Turn phases (Beginning, Main, End)
- Phase steps and timing
- Win/loss conditions

## Implementation Files

- `src/flow/game-setup.ts` - Game initialization and setup
- `src/flow/mulligan.ts` - Mulligan logic
- `src/flow/turn-flow.ts` - Turn phase definitions
- `src/flow/phase-handlers.ts` - Phase step implementations
- `src/flow/win-conditions.ts` - Win/loss checking

## Types

### Flow Definition

```typescript
interface LorcanaFlowDefinition extends FlowDefinition<LorcanaGameState> {
  setup: SetupFlow;
  turn: TurnFlow;
}

interface SetupFlow {
  phases: {
    determineFirstPlayer: PhaseDefinition;
    shuffleDecks: PhaseDefinition;
    drawStartingHands: PhaseDefinition;
    mulligan: PhaseDefinition;
  };
}

interface TurnFlow {
  initialPhase: "beginning";
  phases: {
    beginning: BeginningPhaseDefinition;
    main: MainPhaseDefinition;
    end: EndPhaseDefinition;
  };
}

interface BeginningPhaseDefinition {
  steps: {
    ready: StepDefinition;    // Rule 4.2.1
    set: StepDefinition;      // Rule 4.2.2
    draw: StepDefinition;     // Rule 4.2.3
  };
}

type Phase = "beginning" | "main" | "end";
type BeginningStep = "ready" | "set" | "draw";
```

### Mulligan (Rule 3.1.6)

```typescript
interface MulliganDecision {
  playerId: PlayerId;
  cardsToBottom: CardId[];  // Cards to put on bottom (not revealed)
}

interface MulliganState {
  phase: "waiting_first_player" | "waiting_second_player" | "complete";
  firstPlayerDecision?: MulliganDecision;
  secondPlayerDecision?: MulliganDecision;
}
```

### Turn Trackers

```typescript
interface TurnTrackers {
  turnNumber: number;
  activePlayerId: PlayerId;
  hasInked: boolean;           // Once per turn (Rule 4.3.3)
  isFirstTurn: boolean;        // Skip draw for starting player
  startingPlayerId: PlayerId;
  currentPhase: Phase;
  currentStep?: BeginningStep;
}
```

### Win/Loss Conditions (Rule 3.2)

```typescript
type GameEndReason =
  | { type: "LORE_VICTORY"; playerId: PlayerId; lore: number }      // Rule 3.2.1.1
  | { type: "DECK_OUT"; playerId: PlayerId }                        // Rule 3.2.1.2
  | { type: "CONCEDE"; playerId: PlayerId };

interface GameEndState {
  isOver: boolean;
  winner?: PlayerId;
  loser?: PlayerId;
  reason?: GameEndReason;
}
```

## External API

```typescript
// Setup
function createGame(config: GameConfig): LorcanaGame;
function startGame(game: LorcanaGame): void;
function submitMulligan(game: LorcanaGame, decision: MulliganDecision): void;

// Phase queries
function getCurrentPhase(game: LorcanaGame): Phase;
function getCurrentStep(game: LorcanaGame): BeginningStep | null;
function getActivePlayer(game: LorcanaGame): PlayerId;
function isInMainPhase(game: LorcanaGame): boolean;

// Phase transitions
function advanceStep(game: LorcanaGame): void;
function endPhase(game: LorcanaGame): void;
function endTurn(game: LorcanaGame): void;

// Turn tracking
function hasInkedThisTurn(game: LorcanaGame, playerId: PlayerId): boolean;
function isFirstTurn(game: LorcanaGame): boolean;
function getTurnNumber(game: LorcanaGame): number;
function isActivePlayer(game: LorcanaGame, playerId: PlayerId): boolean;

// Win condition queries
function getLore(game: LorcanaGame, playerId: PlayerId): number;
function addLore(game: LorcanaGame, playerId: PlayerId, amount: number): void;
function checkWinConditions(game: LorcanaGame): GameEndReason | null;
function isGameOver(game: LorcanaGame): boolean;
function getWinner(game: LorcanaGame): PlayerId | null;
```

## Test Cases

### Game Setup (Rule 3.1)

1. `determines starting player randomly (Rule 3.1.2)` - Random first player
2. `shuffles both players' decks (Rule 3.1.3)` - Decks shuffled
3. `initializes lore at 0 for both players (Rule 3.1.4)` - Starting lore
4. `draws 7 cards for each player (Rule 3.1.5)` - Starting hand size

### Mulligan (Rule 3.1.6)

1. `starting player mulligans first` - Order of mulligan
2. `can put any number of cards on bottom (Rule 3.1.6.1)` - Flexible mulligan
3. `draws back up to 7 cards (Rule 3.1.6.2)` - Redraw after mulligan
4. `shuffles deck after mulligan if cards were moved (Rule 3.1.6.4)` - Shuffle after
5. `mulligan is optional for each player` - Can keep hand
6. `cards put on bottom are not revealed` - Hidden information

### Beginning Phase (Rule 4.2)

#### Ready Step (Rule 4.2.1)

1. `readies all of active player's cards` - All cards ready
2. `readies cards in play and inkwell` - Both zones
3. `triggers 'at the start of your turn' abilities` - Trigger timing

#### Set Step (Rule 4.2.2)

1. `makes drying characters dry (can now act)` - End summoning sickness
2. `gains lore from locations with lore value` - Location lore
3. `location lore is not a triggered ability` - Game rule, not ability
4. `resolves 'at start of turn' abilities from bag` - Bag resolution

#### Draw Step (Rule 4.2.3)

1. `active player draws 1 card` - Normal draw
2. `starting player skips draw on turn 1 (Rule 4.2.3.2)` - First turn exception
3. `triggers effects after draw` - Post-draw triggers

### Main Phase (Rule 4.3)

1. `allows turn actions in any order` - Flexible action order
2. `allows multiple actions (except inkwell once)` - Action limits
3. `tracks hasInked for once-per-turn limit` - Ink tracking

### End Phase (Rule 4.4)

1. `can only end turn when no abilities waiting` - Empty bag required
2. `triggers 'at end of turn' abilities (Rule 4.4.1.2)` - End triggers
3. `resolves all triggers in bag (Rule 4.4.1.3)` - Bag resolution
4. `ends 'this turn' effects (Rule 4.4.1.4)` - Duration cleanup
5. `passes turn to next player` - Turn transition

### Win Conditions (Rule 3.2)

1. `player wins at 20+ lore (Rule 3.2.1.1)` - Lore victory
2. `player loses when drawing from empty deck (Rule 3.2.1.2)` - Deck out
3. `win takes priority if win and loss simultaneous` - Win precedence

## Dependencies

- Depends on Spec 1: Foundation & Types
- Depends on Spec 2: Zones & Card States

## Acceptance Criteria

- [ ] Game setup follows all rules
- [ ] Mulligan system works correctly
- [ ] All three phases execute in order
- [ ] Beginning phase steps execute correctly
- [ ] Turn transitions work properly
- [ ] Win/loss conditions are checked correctly
- [ ] All test cases pass
