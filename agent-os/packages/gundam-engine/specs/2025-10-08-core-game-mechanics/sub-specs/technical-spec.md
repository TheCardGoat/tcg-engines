# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/packages/gundam-engine/specs/2025-10-08-core-game-mechanics/spec.md

## Technical Requirements

### 1. Type System Architecture

**State Extension**
- Extend `@tcg/core` GameState type with `gundam` property containing:
  - `shields: Record<PlayerId, CardId[]>` - Shield cards (max 6 per player)
  - `bases: Record<PlayerId, CardId | null>` - Base card in shield area (1 per player)
  - `battlePositions: Record<PlayerId, BattlePosition[]>` - Battle area positions (max 6)
  - `activeResources: Record<PlayerId, number>` - Count of untapped resources
  - `resourcePlayed: Record<PlayerId, boolean>` - Resource played this turn flag
  - `currentAttack: AttackSequence | null` - Active combat sequence data

**Move Type Union**
- Define discriminated union type `GundamMove` containing:
  - `PlayResourceMove` - Resource placement
  - `DeployUnitMove` - Unit deployment from hand
  - `PairPilotMove` - Pilot-unit pairing
  - `AttackMove` - Initiate attack sequence
  - `EndTurnMove` - End current player's turn

**Card Type Definitions**
- `UnitCard` - level, cost, ap, hp, keywords
- `PilotCard` - level, cost, apBonus, hpBonus
- `CommandCard` - type, cost, effect
- `BaseCard` - type, abilities
- `ResourceCard` - type, value

**Helper Types**
- `BattlePosition` - unitId, pilotId (optional), tapped, canAttack, canBlock
- `AttackSequence` - attackerId, defenderId, blockers, damage, resolved
- `PhaseId` - "start" | "draw" | "resource" | "main" | "end"

### 2. Zone Configuration

**Zone Definitions**
Each zone must implement `ZoneDefinition` from `@tcg/core`:

- **Deck Zone**
  - Visibility: hidden from all players
  - Ordered: true (shuffle support)
  - Capacity: unlimited
  - Entry rules: no direct adds during game
  - Exit rules: draw, mill, search effects

- **Hand Zone**
  - Visibility: owner sees all, opponent sees count
  - Ordered: false
  - Capacity: unlimited (soft limit enforced in End Phase)
  - Entry rules: draw, return from play, search
  - Exit rules: play, discard, shield placement

- **Battle Area Zone**
  - Visibility: public to all players
  - Ordered: true (position matters)
  - Capacity: 6 units maximum per player
  - Entry rules: deploy move, special summon
  - Exit rules: destruction, return, trash

- **Shield Area Zone**
  - Visibility: face-down (hidden)
  - Ordered: true (damage order)
  - Capacity: 6 cards maximum per player
  - Entry rules: setup only
  - Exit rules: damage triggers reveal

- **Resource Area Zone**
  - Visibility: public (tapped status visible)
  - Ordered: false
  - Capacity: unlimited
  - Entry rules: play resource move
  - Exit rules: none (resources stay in play)

- **Trash Zone**
  - Visibility: public to all players
  - Ordered: true (chronological)
  - Capacity: unlimited
  - Entry rules: discard, destruction, spent cards
  - Exit rules: recursion effects (future)

- **Removal Zone**
  - Visibility: public to all players
  - Ordered: false
  - Capacity: unlimited
  - Entry rules: exile/remove effects
  - Exit rules: none (permanent removal)

### 3. Phase System Implementation

**Phase Definitions**
Each phase implements `PhaseDefinition` from `@tcg/core`:

**Start Phase**
- `onEnter`: Untap all cards, reset `resourcePlayed` flag, trigger start-of-turn abilities
- `validMoves`: [] (automatic phase, no player actions)
- `onExit`: Clear temporary effects
- `nextPhase`: "draw"

**Draw Phase**
- `onEnter`: Draw 1 card (skip on first turn for player one)
- `validMoves`: [] (automatic phase)
- `onExit`: Check deck-out loss condition
- `nextPhase`: "resource"

**Resource Phase**
- `onEnter`: None
- `validMoves`: ["PLAY_RESOURCE", "SKIP_RESOURCE"]
- `onExit`: None
- `nextPhase`: "main"

**Main Phase**
- `onEnter`: None
- `validMoves`: ["DEPLOY_UNIT", "PAIR_PILOT", "ATTACK", "ACTIVATE_ABILITY", "END_MAIN_PHASE"]
- `onExit`: Clear attack sequence
- `nextPhase`: "end"

**End Phase**
- `onEnter`: None
- `validMoves`: ["ACTIVATE_ABILITY", "END_TURN"]
- `onExit`: Enforce hand size limit (discard to 7), clear turn state
- `nextPhase`: "start" (next player)

### 4. Move Handler Specifications

**PlayResourceMove**
```typescript
type PlayResourceParams = {
  playerId: PlayerId;
  cardId: CardId; // Card from hand
};

Validation:
- Current phase is "resource"
- playerId matches currentPlayer
- cardId is in player's hand
- Card is a Resource card
- resourcePlayed[playerId] is false

Execution:
- Move card from hand to resource area
- Set resourcePlayed[playerId] to true
- Increment activeResources[playerId]
- Auto-advance to main phase
```

**DeployUnitMove**
```typescript
type DeployUnitParams = {
  playerId: PlayerId;
  cardId: CardId; // Unit card from hand
  position?: number; // Battle area position (0-5)
};

Validation:
- Current phase is "main"
- playerId matches currentPlayer
- cardId is in player's hand
- Card is a Unit card
- Player has sufficient active resources >= card.cost
- Player's level (highest unit level in play) >= card.level
- Battle area has space (< 6 units)

Execution:
- Tap required resources (reduce activeResources)
- Move card from hand to battle area at position
- Create BattlePosition entry (tapped: true, canAttack: false)
- Trigger on-deploy abilities (future)
```

**PairPilotMove**
```typescript
type PairPilotParams = {
  playerId: PlayerId;
  pilotId: CardId; // Pilot card from hand
  unitId: CardId; // Unit already in battle area
};

Validation:
- Current phase is "main"
- playerId matches currentPlayer
- pilotId is in player's hand
- unitId is in player's battle area
- Card is a Pilot card
- Player has sufficient active resources >= pilot.cost
- Pilot level <= Unit level
- Unit does not already have a pilot
- Link conditions satisfied (if any)

Execution:
- Tap required resources
- Move pilot from hand to battle area (attached to unit)
- Update BattlePosition to include pilotId
- Apply stat bonuses (ap += pilot.apBonus, hp += pilot.hpBonus)
- Trigger pilot abilities (future)
```

**AttackMove**
```typescript
type AttackParams = {
  playerId: PlayerId;
  attackerIds: CardId[]; // Units attacking
  defenderId: PlayerId; // Defending player
};

Validation:
- Current phase is "main"
- playerId matches currentPlayer
- All attackerIds are in player's battle area
- All attackers are untapped and can attack
- defenderId is opponent

Execution:
- Create AttackSequence with attackers
- Tap all attacking units
- Set canAttack: false for attackers
- Trigger attack declaration abilities
- Enter blocking sub-phase (simplified for now: no blockers)
- Calculate damage (sum of attacker AP)
- Apply damage to shields (reveal and remove)
- If shields depleted, player loses
- Mark attack resolved
```

**EndTurnMove**
```typescript
type EndTurnParams = {
  playerId: PlayerId;
};

Validation:
- Current phase is "end"
- playerId matches currentPlayer
- No pending decisions

Execution:
- Enforce hand size limit (discard down to 7)
- Clear turn-based state
- Increment turn counter
- Switch currentPlayer to opponent
- Transition to "start" phase
```

### 5. Game Initialization

**Setup Function**
```typescript
function setupGundamGame(config: GameConfig): GundamGameState {
  // 1. Initialize base state
  // 2. Shuffle decks with seed
  // 3. Draw 5 cards per player
  // 4. Execute mulligan (future: interactive)
  // 5. Place 6 shields face-down per player
  // 6. Deploy EX Base to each player's base section
  // 7. Place EX Resource in player two's resource area
  // 8. Set currentPlayer to player one
  // 9. Set phase to "start"
  // 10. Return initialized state
}
```

**Mulligan System**
```typescript
type MulliganDecision = {
  playerId: PlayerId;
  mulligan: boolean;
};

// For initial implementation: optional mulligan
// Future: interactive choice via move
```

### 6. Validation System

**Move Validation Architecture**
- Each move implements `validate(state, params) => ValidationResult`
- ValidationResult: `{ valid: boolean; error?: string }`
- Early return pattern for validation failures
- Validate in order: phase check, player check, resource check, state check

**State Invariants**
- Shield count: 0-6 per player
- Battle area capacity: 0-6 units per player
- Active resources: 0 to total resources
- Current player: must be one of players
- Phase: must be valid phase ID

### 7. Integration with @tcg/core

**RuleEngine Integration**
```typescript
import { RuleEngine, GameDefinition } from "@tcg/core";

const gundamDefinition: GameDefinition<GundamGameState, GundamMove> = {
  id: "gundam-card-game",
  name: "Gundam Card Game",
  players: { min: 2, max: 2 },
  moves: gundamMoves,
  zones: gundamZones,
  flow: gundamFlow,
  setup: setupGundamGame,
  validation: gundamValidation,
};

// Create engine instance
const engine = new RuleEngine(gundamDefinition, { seed: "game-123" });
```

**State Access Patterns**
```typescript
// Use helper functions for state access
function getPlayerShields(state: GundamGameState, playerId: PlayerId): CardId[] {
  return state.gundam.shields[playerId] ?? [];
}

function getActiveResources(state: GundamGameState, playerId: PlayerId): number {
  return state.gundam.activeResources[playerId] ?? 0;
}

function getBattleArea(state: GundamGameState, playerId: PlayerId): BattlePosition[] {
  return state.gundam.battlePositions[playerId] ?? [];
}
```

### 8. Testing Strategy

**Test Categories**

1. **Game Initialization Tests** (`game-definition.test.ts`)
   - Correct starting state structure
   - Shield placement (6 per player)
   - EX Base deployment
   - EX Resource for player two
   - Starting hand (5 cards)
   - Deterministic deck shuffle with seed

2. **Phase Flow Tests** (`phases/*.test.ts`)
   - Phase transition order
   - Phase-specific move permissions
   - Automatic phase actions (untap, draw)
   - Turn counter increment
   - Player switching

3. **Move Validation Tests** (`moves/*.test.ts`)
   - Valid move acceptance
   - Invalid move rejection with error messages
   - Resource requirement validation
   - Level requirement validation
   - Zone capacity validation
   - Phase restriction validation

4. **Integration Tests** (`integration/*.test.ts`)
   - Complete turn cycle
   - Resource accumulation over turns
   - Unit deployment sequence
   - Pilot pairing workflow
   - Combat damage resolution
   - Win condition (shield depletion)

**Test Data Setup**
```typescript
function createTestDeck(): CardDefinition[] {
  return [
    createResourceCard("res-1"),
    createResourceCard("res-2"),
    createUnitCard("unit-1", { level: 1, cost: 1, ap: 3, hp: 4 }),
    createUnitCard("unit-2", { level: 2, cost: 2, ap: 4, hp: 5 }),
    createPilotCard("pilot-1", { level: 1, cost: 1, apBonus: 1, hpBonus: 1 }),
    // ... more test cards
  ];
}

function createTestState(overrides?: Partial<GundamGameState>): GundamGameState {
  // Create minimal valid state for testing
}
```

### 9. Performance Considerations

**Immutable Updates**
- Use spread operators for shallow copies
- Nested updates: spread each level
- Future: Consider immer for deep updates if needed (already in @tcg/core)

**Zone Operations**
- Array operations: map, filter, slice (non-mutating)
- Avoid large array copies where possible
- Future: Consider zone indexing for O(1) lookups

**Move Enumeration**
- Defer implementation until AI support phase
- Validate single moves efficiently
- Avoid enumerating all possible moves unless requested

### 10. Error Handling

**Validation Errors**
```typescript
type ValidationResult = 
  | { valid: true }
  | { valid: false; error: string; code?: ErrorCode };

enum ErrorCode {
  INVALID_PHASE = "INVALID_PHASE",
  INSUFFICIENT_RESOURCES = "INSUFFICIENT_RESOURCES",
  INVALID_LEVEL = "INVALID_LEVEL",
  ZONE_FULL = "ZONE_FULL",
  NOT_YOUR_TURN = "NOT_YOUR_TURN",
}
```

**Runtime Errors**
- Throw errors for programming mistakes (assertions)
- Return validation failures for game rule violations
- Never throw for invalid moves (return validation error)

## External Dependencies

No new external dependencies required beyond `@tcg/core` framework.

The framework already includes:
- `immer` - Immutable state updates
- `xstate` - State machine management (if used)
- `zod` - Runtime type validation
- `nanoid` - ID generation
- `seedrandom` - Deterministic RNG

All game logic will use framework APIs and TypeScript standard library.

