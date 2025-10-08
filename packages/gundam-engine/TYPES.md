# Gundam Card Game Type System

> Complete type definitions for the Gundam Card Game engine based on official rules v1.0

This document provides an overview of the type system implemented for the `@tcg/gundam` engine package. All types are based on the official Bandai Gundam Card Game Comprehensive Rules Ver. 1.0.

## Table of Contents

- [Card Types](#card-types)
- [Game State](#game-state)
- [Turn Structure](#turn-structure)
- [Move System](#move-system)
- [Zone System](#zone-system)
- [Validation](#validation)

---

## Card Types

### Base Card Definition

All Gundam cards extend `GundamCardDefinition`:

```typescript
interface GundamCardDefinition {
  id: string;              // Unique identifier
  name: string;            // Card name
  cardNumber: string;      // Serial number (e.g., "GD01-001")
  cardType: CardType;      // UNIT | PILOT | COMMAND | BASE | RESOURCE
  color?: CardColor;       // blue | green | red | white (not on resources)
  trait?: string | string[]; // Group, class, or type
  lv?: number;             // Level requirement
  cost?: number;           // Cost to play
  text?: string;           // Card effect text
}
```

### Card Types Hierarchy

1. **Unit Cards** (Rules 2-3-3)
   - `cardType: "UNIT"`
   - Properties: `ap`, `hp`, `lv`, `cost`, `keywords`, `linkConditions`
   - Placed in battle area

2. **Pilot Cards** (Rules 2-3-4)
   - `cardType: "PILOT"`
   - Properties: `lv`, `cost`, `apModifier`, `hpModifier`
   - Paired beneath Units in battle area

3. **Command Cards** (Rules 2-3-5)
   - `cardType: "COMMAND"`
   - Properties: `timing` (【Main】/【Action】), `hasPilotEffect`, `hasBurstEffect`
   - One-time use cards

4. **Base Cards** (Rules 2-3-6)
   - `cardType: "BASE"`
   - Properties: `ap`, `hp`, `lv`, `cost`
   - Placed in base section of shield area

5. **Resource Cards** (Rules 2-3-7)
   - `cardType: "RESOURCE"`
   - Properties: `isEXResource`
   - Used to pay costs

### Keyword Effects

Based on Rules Section 11-1:

- `<Repair>` - Recover HP at end of turn
- `<Breach>` - Deal damage to shield area when destroying Unit
- `<Support>` - Give AP to another friendly Unit
- `<Blocker>` - Change attack target to this Unit
- `<First Strike>` - Deal damage before enemy
- `<High-Maneuver>` - Prevent <Blocker> activation

---

## Game State

### Core Game State Structure

```typescript
interface GundamGameState {
  // Player-specific game data
  shields: Record<PlayerId, CardId[]>;           // Max 6 per player
  bases: Record<PlayerId, CardId | null>;        // Max 1 per player
  battlePositions: Record<PlayerId, BattlePosition[]>; // Max 6 per player
  activeResources: Record<PlayerId, number>;     // Untapped resource count
  
  // Current attack state
  currentAttack: AttackSequence | null;
  
  // Phase-specific state
  actionStepPasses: number;
  
  // Turn tracking
  isFirstTurn: boolean;
  firstPlayerSkippedFirstDraw: boolean;
}
```

### Battle Position

Tracks a Unit in the battle area:

```typescript
interface BattlePosition {
  unitId: CardId;
  pilotId?: CardId;         // Optional paired Pilot
  tapped: boolean;          // Active (false) or Rested (true)
  canAttack: boolean;       // Can attack this turn
  canBlock: boolean;        // Can use <Blocker>
  isLinkUnit: boolean;      // Pilot satisfies link conditions
  damage: number;           // Damage counters
}
```

### Attack Sequence

Tracks the current attack:

```typescript
interface AttackSequence {
  attackerId: CardId;
  defenderId: PlayerId;
  attackTarget: "player" | "unit";
  targetUnitId?: CardId;
  blockerId?: CardId;
  attackerAP: number;
  defenderHP?: number;
  damageDealt: number;
  damageReceived: number;
  attackerDestroyed: boolean;
  defenderDestroyed: boolean;
  breachTriggered: boolean;
  resolved: boolean;
}
```

---

## Turn Structure

### Turn Flow (Rules 6-1)

Each turn progresses through five phases:

```typescript
type GamePhase = "start" | "draw" | "resource" | "main" | "end";
```

### Phase Breakdown

#### 1. Start Phase (Rules 6-2)
- **Active Step**: Untap all cards
- **Start Step**: Trigger start-of-turn effects

#### 2. Draw Phase (Rules 6-3)
- Draw 1 card (Player One skips on first turn)
- Check deck-out loss condition

#### 3. Resource Phase (Rules 6-4)
- Place 1 Resource from resource deck to resource area
- Enters play face-up and active

#### 4. Main Phase (Rules 6-5)
- Deploy Units, deploy Bases, pair Pilots
- Activate 【Activate･Main】 effects
- Attack with Units
- Player declares end when done

#### 5. End Phase (Rules 6-6)
- **Action Step**: Players activate 【Action】 cards/effects
- **End Step**: Trigger end-of-turn effects
- **Hand Step**: Discard down to 10 cards if needed
- **Cleanup Step**: Clear "during this turn" effects

### Phase Configuration

```typescript
interface PhaseConfig {
  id: GamePhase;
  name: string;
  steps?: PhaseStep[];
  automaticActions?: boolean;
  allowsMoves?: boolean;
}
```

---

## Move System

### Move Types

All possible player actions:

```typescript
type GundamMoveType =
  // Setup
  | "MULLIGAN"
  | "CONFIRM_HAND"
  
  // Resource Phase
  | "PLAY_RESOURCE"
  | "SKIP_RESOURCE_PHASE"
  
  // Main Phase
  | "DEPLOY_UNIT"
  | "DEPLOY_BASE"
  | "PAIR_PILOT"
  | "ACTIVATE_COMMAND_MAIN"
  | "ACTIVATE_MAIN_ABILITY"
  | "DECLARE_ATTACK"
  | "END_MAIN_PHASE"
  
  // Battle
  | "ACTIVATE_BLOCKER"
  | "SKIP_BLOCKER"
  | "ACTIVATE_ACTION_DURING_BATTLE"
  | "PASS_ACTION_STEP"
  
  // End Phase
  | "ACTIVATE_COMMAND_ACTION"
  | "ACTIVATE_ACTION_ABILITY"
  | "DISCARD_TO_HAND_LIMIT"
  | "END_TURN"
  
  // Burst
  | "ACTIVATE_BURST"
  | "DECLINE_BURST";
```

### Key Move Validation Requirements

#### Deploy Unit Move
- Player has sufficient active resources >= `unit.cost`
- Player's level (highest Unit in play) >= `unit.lv`
- Battle area has space (< 6 units)
- Card is in player's hand
- Current phase is "main"
- Current player's turn

#### Pair Pilot Move
- Player has sufficient active resources >= `pilot.cost`
- `pilot.lv` <= `unit.lv`
- Unit does not already have a Pilot
- Pilot is in player's hand
- Unit is in player's battle area
- Link conditions satisfied (if Unit has link conditions)
- Current phase is "main"

#### Declare Attack Move
- Unit is active (not rested)
- Unit can attack (not just deployed unless Link Unit)
- Unit is in player's battle area
- If targeting Unit: target must be rested enemy Unit
- Current phase is "main"
- No pending abilities waiting to activate

---

## Zone System

### Zone Types (Rules Section 3)

```typescript
type GundamZoneType =
  | "deck"                    // Private, ordered
  | "resource-deck"           // Private, ordered
  | "hand"                    // Private, unordered
  | "battle-area"             // Public, ordered, max 6
  | "shield-area-shields"     // Private, ordered, max 6
  | "shield-area-base"        // Public, max 1
  | "resource-area"           // Public, max 15
  | "trash"                   // Public, ordered
  | "removal";                // Public
```

### Zone Properties

| Zone | Visibility | Ordered | Max Cards | Per Player |
|------|------------|---------|-----------|------------|
| Deck | Private | Yes | None | Yes |
| Resource Deck | Private | Yes | None | Yes |
| Hand | Private | No | 10* | Yes |
| Battle Area | Public | Yes | 6 | Yes |
| Shields | Private | Yes | 6 | Yes |
| Base | Public | No | 1 | Yes |
| Resource Area | Public | No | 15 | Yes |
| Trash | Public | Yes | None | Yes |
| Removal | Public | No | None | Yes |

*Soft limit enforced in End Phase

### Zone Movement Rules

When cards move between zones (Rules 3-1-5):
- Card treated as **new** in destination zone
- Effects from previous zone are **ignored**
- Order may or may not be revealed depending on zone visibility

---

## Validation

### Move Validation Result

```typescript
interface MoveValidationResult {
  valid: boolean;
  reason?: string;
  failedChecks?: string[];
}
```

### Validation Types

#### Level Check
```typescript
interface LevelCheckResult {
  valid: boolean;
  currentLevel: number;     // Highest Unit level in play
  requiredLevel: number;
  reason?: string;
}
```

#### Cost Check
```typescript
interface CostCheckResult {
  valid: boolean;
  availableResources: number;  // Untapped resources
  requiredCost: number;
  reason?: string;
}
```

#### Link Condition Check
```typescript
interface LinkConditionCheckResult {
  valid: boolean;
  satisfiedConditions: string[];
  unsatisfiedConditions: string[];
  isLinkUnit: boolean;
}
```

### Common Constraints

All deployment moves check:
```typescript
interface DeploymentConstraints {
  hasCard: boolean;         // Card is in hand
  hasLevel: boolean;        // Level requirement met
  hasCost: boolean;         // Cost requirement met
  hasSpace: boolean;        // Zone has space
  isMainPhase: boolean;     // Current phase is "main"
  isPlayerTurn: boolean;    // Current player's turn
}
```

---

## Card Metadata (Dynamic State)

Cards can have dynamic, mutable properties stored in metadata:

```typescript
interface GundamCardMeta {
  // State flags
  tapped?: boolean;
  damaged?: boolean;
  damageCounters?: number;
  
  // Position
  position?: number;
  
  // Pairing (for Pilots)
  pairedWith?: CardId;
  
  // Effect tracking
  effectsThisTurn?: string[];
  oncePerTurnUsed?: Record<string, boolean>;
  
  // Temporary modifiers
  apModifier?: number;
  hpModifier?: number;
  gainedKeywords?: KeywordEffect[];
  lostKeywords?: KeywordEffect[];
}
```

---

## Win/Loss Conditions (Rules 1-2)

```typescript
type WinCondition =
  | "OPPONENT_SHIELD_DEPLETED"  // Opponent took damage with no shields
  | "OPPONENT_DECK_OUT"         // Opponent has no cards in deck
  | "OPPONENT_CONCEDED";        // Opponent conceded

interface GameOverState {
  winner: PlayerId;
  condition: WinCondition;
  timestamp: number;
}
```

---

## Type Guards

Convenient type guards for runtime type checking:

```typescript
function isUnitCard(card: GundamCardDefinition): card is UnitCardDefinition;
function isPilotCard(card: GundamCardDefinition): card is PilotCardDefinition;
function isCommandCard(card: GundamCardDefinition): card is CommandCardDefinition;
function isBaseCard(card: GundamCardDefinition): card is BaseCardDefinition;
function isResourceCard(card: GundamCardDefinition): card is ResourceCardDefinition;
function hasKeywordEffect(card: UnitCardDefinition | BaseCardDefinition, keyword: KeywordEffect): boolean;
```

---

## Implementation Status

✅ **Completed**:
- Complete type system (all card types, game state, move types)
- Phase and turn structure definitions
- Zone configurations
- Move validation types
- Card metadata system

🚧 **Pending**:
- Move implementations (actual execution logic)
- Card definitions (specific cards from sets)
- Game initialization logic
- Ability and effect system
- AI move enumeration

---

## References

- **Official Rules**: Gundam Card Game Comprehensive Rules Ver. 1.0 (November 29, 2024)
- **Framework**: `@tcg/core` - Core TCG engine framework
- **Architecture**: See `ARCHITECTURE.md` for implementation patterns
- **Spec**: See `.agent-os/packages/gundam-engine/specs/2025-10-08-core-game-mechanics/` for detailed specifications

---

## Usage Example

```typescript
import type {
  GundamGameState,
  DeployUnitParams,
  DeployUnitMove,
} from "@tcg/gundam";

// Type-safe move parameters
const deployParams: DeployUnitParams = {
  playerId: "player1",
  cardId: "card-123",
  position: 0,
};

// Move with full type safety
const deployUnitMove: DeployUnitMove = {
  execute: ({ G, coreOps }, params: DeployUnitParams) => {
    // Implementation here
    return G;
  },
  
  getConstraints: ({ G, coreOps }) => {
    // Return constraint checks
    return [];
  },
  
  getTargetSpecs: ({ G, coreOps }) => {
    // Return valid targets
    return [];
  },
};
```

---

*This type system provides complete TypeScript type safety for implementing the Gundam Card Game while adhering to official rules and the @tcg/core framework patterns.*

