# @tcg/gundam Architecture

This document describes the architecture and design patterns for implementing TCG engines using the `@tcg/core` framework, using the Gundam Card Game as a reference implementation.

## Overview

The `@tcg/gundam` package demonstrates how to build a production-ready TCG engine by extending the `@tcg/core` framework. This architecture serves as a template for implementing other trading card games.

## Architectural Principles

### 1. Framework Extension, Not Modification

The game-specific implementation extends `@tcg/core` without modifying it. The core framework provides:

- Base state management
- Move execution system
- Flow control primitives
- Zone abstractions
- Card system foundations

The game implementation provides:

- Game-specific state shape
- Game-specific moves
- Custom phase/turn logic
- Card definitions
- Zone configurations

### 2. Type-Driven Design

All game-specific types extend core framework types:

```typescript
import type { GameState, Move, Zone } from "@tcg/core";

// Extend core state with game-specific properties
type GundamGameState = GameState & {
  gameSpecific: {
    shields: Record<PlayerId, CardId[]>;
    bases: Record<PlayerId, CardId | null>;
    battleArea: Record<PlayerId, BattlePosition[]>;
    activeResources: Record<PlayerId, number>;
  };
};

// Define game-specific moves
type GundamMove =
  | PlayResourceMove
  | DeployUnitMove
  | PairPilotMove
  | AttackMove
  | ActivateAbilityMove;
```

### 3. Declarative Game Definition

The game is defined declaratively through a `GameDefinition`:

```typescript
import { defineGame } from "@tcg/core";

const gundamGame = defineGame({
  id: "gundam-card-game",
  name: "Gundam Card Game",
  
  // Define initial state structure
  initialState: {
    // Core state (from framework)
    // Game-specific state (custom)
  },
  
  // Register all available moves
  moves: {
    playResource: PlayResourceMove,
    deployUnit: DeployUnitMove,
    // ... other moves
  },
  
  // Define turn/phase flow
  flow: {
    phases: [StartPhase, DrawPhase, ResourcePhase, MainPhase, EndPhase],
    // ... flow configuration
  },
  
  // Configure zones
  zones: {
    deck: DeckZoneConfig,
    hand: HandZoneConfig,
    // ... other zones
  },
  
  // Validation rules
  validation: {
    // ... validation configuration
  },
});
```

## Folder Structure

```
packages/gundam-engine/
├── src/
│   ├── index.ts                    # Public API exports
│   ├── game-definition.ts          # Main game definition
│   ├── types.ts                    # Game-specific type definitions
│   │
│   ├── moves/                      # Move implementations
│   │   ├── index.ts                # Export all moves
│   │   ├── play-resource.ts        # Resource placement move
│   │   ├── deploy-unit.ts          # Unit deployment move
│   │   ├── pair-pilot.ts           # Pilot pairing move
│   │   ├── attack.ts               # Attack sequence move
│   │   └── activate-ability.ts     # Ability activation move
│   │
│   ├── phases/                     # Phase definitions
│   │   ├── index.ts                # Export all phases
│   │   ├── start-phase.ts          # Start phase logic
│   │   ├── draw-phase.ts           # Draw phase logic
│   │   ├── resource-phase.ts       # Resource phase logic
│   │   ├── main-phase.ts           # Main phase logic
│   │   └── end-phase.ts            # End phase logic
│   │
│   ├── zones/                      # Zone configurations
│   │   ├── index.ts                # Export all zones
│   │   ├── deck-zone.ts            # Deck zone config
│   │   ├── hand-zone.ts            # Hand zone config
│   │   ├── battle-area-zone.ts     # Battle area config
│   │   ├── shield-zone.ts          # Shield area config
│   │   ├── resource-zone.ts        # Resource area config
│   │   └── trash-zone.ts           # Trash zone config
│   │
│   ├── cards/                      # Card definitions
│   │   ├── index.ts                # Export all cards
│   │   ├── card-types.ts           # Card type definitions
│   │   ├── sets/                   # Organized by set
│   │   │   ├── st01/               # Starter Set 01
│   │   │   ├── st02/               # Starter Set 02
│   │   │   └── gd01/               # Booster Set GD01
│   │   └── tokens/                 # Token cards
│   │       └── ex-base.ts
│   │
│   ├── abilities/                  # Keyword abilities
│   │   ├── index.ts
│   │   ├── blocker.ts
│   │   ├── first-strike.ts
│   │   └── repair.ts
│   │
│   ├── utils/                      # Utility functions
│   │   ├── index.ts
│   │   ├── state-helpers.ts
│   │   └── validation.ts
│   │
│   └── __tests__/                  # Test files
│       ├── game-definition.test.ts
│       ├── moves/
│       ├── phases/
│       └── integration/
│
├── package.json
├── tsconfig.json
├── biome.json
├── bunfig.toml
├── README.md
└── ARCHITECTURE.md
```

## Core Concepts

### State Management

State is immutable and managed by the framework. Game-specific state extends the core state:

```typescript
// Core state (provided by @tcg/core)
type CoreGameState = {
  players: Player[];
  currentPlayer: PlayerId;
  turn: number;
  phase: PhaseId;
  zones: Record<ZoneId, Zone>;
  cards: Record<CardId, CardInstance>;
};

// Game-specific state extension
type GundamGameState = CoreGameState & {
  gundam: {
    // Gundam-specific properties
    shields: Record<PlayerId, CardId[]>;
    bases: Record<PlayerId, CardId | null>;
    battlePositions: Record<PlayerId, BattlePosition[]>;
    activeResources: Record<PlayerId, number>;
  };
};
```

### Move System

Moves are the only way to modify game state. Each move:

1. Validates preconditions
2. Transforms state immutably
3. Returns new state or error

```typescript
import { defineMove } from "@tcg/core";

export const DeployUnitMove = defineMove({
  type: "DEPLOY_UNIT",
  
  validate: (state, params) => {
    // Check if player has enough resources
    // Check if battle area has space
    // Check card requirements
    return validationResult;
  },
  
  execute: (state, params) => {
    // Immutably update state
    return {
      ...state,
      // ... new state
    };
  },
  
  // Optional: for AI/UI
  enumerate: (state, playerId) => {
    // Return all valid instances of this move
    return possibleMoves;
  },
});
```

### Phase System

Phases define the game flow. Each phase:

1. Has entry/exit hooks
2. Defines valid moves
3. Determines next phase

```typescript
import { definePhase } from "@tcg/core";

export const MainPhase = definePhase({
  id: "main",
  name: "Main Phase",
  
  onEnter: (state) => {
    // Phase initialization
    return state;
  },
  
  validMoves: [
    "DEPLOY_UNIT",
    "PAIR_PILOT",
    "ACTIVATE_ABILITY",
    "ATTACK",
    "END_MAIN_PHASE",
  ],
  
  onExit: (state) => {
    // Phase cleanup
    return state;
  },
  
  nextPhase: (state) => {
    // Determine next phase based on state
    return "end";
  },
});
```

### Zone System

Zones are configured with visibility, ordering, and rules:

```typescript
import { defineZone } from "@tcg/core";

export const BattleAreaZone = defineZone({
  id: "battle-area",
  name: "Battle Area",
  
  visibility: {
    owner: "public",
    opponent: "public",
  },
  
  ordered: true,
  maxCards: 6,
  
  canAddCard: (zone, card, state) => {
    // Validate card can be added
    return zone.cards.length < 6;
  },
  
  onCardEnter: (zone, card, state) => {
    // Handle card entering zone
    return state;
  },
  
  onCardLeave: (zone, card, state) => {
    // Handle card leaving zone
    return state;
  },
});
```

### Card System

Cards are defined declaratively with abilities and effects:

```typescript
import { defineCard } from "@tcg/core";

export const RX78_2Gundam = defineCard({
  id: "gd01-001",
  name: "RX-78-2 Gundam",
  type: "UNIT",
  
  stats: {
    level: 3,
    cost: 2,
    ap: 5,
    hp: 6,
  },
  
  keywords: ["<First Strike>"],
  
  abilities: [
    {
      trigger: "ON_DEPLOY",
      effect: {
        type: "SEARCH_DECK",
        filter: { type: "PILOT", name: "Amuro Ray" },
        destination: "HAND",
      },
    },
  ],
});
```

## Integration with @tcg/core

### Required Exports

The package must export:

```typescript
// Main game definition
export { gundamGame } from "./game-definition";

// Type definitions
export type {
  GundamGameState,
  GundamMove,
  GundamCard,
  // ... other types
} from "./types";

// Utility functions
export { createGundamGame, validateDeck } from "./utils";
```

### Framework Extension Points

The framework provides extension points through:

1. **State Extension**: Add game-specific state properties
2. **Move Registration**: Register custom moves
3. **Phase Definitions**: Define game-specific phases
4. **Zone Configurations**: Configure game-specific zones
5. **Card Definitions**: Define game-specific cards
6. **Validation Rules**: Add custom validation logic

## Testing Strategy

### Behavior-Driven Testing

Test game behavior through the public API:

```typescript
import { describe, it, expect } from "bun:test";
import { createGundamGame } from "../index";

describe("Gundam Card Game", () => {
  it("allows deploying a unit when requirements are met", () => {
    const game = createGundamGame(testSetup);
    
    // Setup state
    const stateWithResources = game.executeMove({
      type: "PLAY_RESOURCE",
      playerId: "player1",
    });
    
    // Execute move
    const result = stateWithResources.executeMove({
      type: "DEPLOY_UNIT",
      playerId: "player1",
      cardId: "unit-1",
    });
    
    // Verify behavior
    expect(result.success).toBe(true);
    expect(result.state.zones.battleArea["player1"]).toHaveLength(1);
  });
});
```

### Test Organization

```
__tests__/
├── game-definition.test.ts      # Core game setup
├── moves/
│   ├── deploy-unit.test.ts      # Unit deployment
│   ├── attack.test.ts           # Attack sequence
│   └── ...
├── phases/
│   ├── main-phase.test.ts       # Main phase flow
│   └── ...
└── integration/
    ├── full-game.test.ts        # Complete game scenarios
    └── edge-cases.test.ts       # Complex interactions
```

## Design Patterns

### 1. Immutable State Updates

Always return new state, never mutate:

```typescript
// ❌ Bad - mutates state
execute: (state, params) => {
  state.gundam.shields[playerId].pop();
  return state;
};

// ✅ Good - immutable update
execute: (state, params) => {
  return {
    ...state,
    gundam: {
      ...state.gundam,
      shields: {
        ...state.gundam.shields,
        [playerId]: state.gundam.shields[playerId].slice(0, -1),
      },
    },
  };
};
```

### 2. Early Returns for Validation

```typescript
validate: (state, params) => {
  if (!hasEnoughResources(state, params.playerId)) {
    return { valid: false, error: "Insufficient resources" };
  }
  
  if (!hasBattleSpace(state, params.playerId)) {
    return { valid: false, error: "Battle area full" };
  }
  
  return { valid: true };
};
```

### 3. Type-Safe Move Parameters

```typescript
type DeployUnitParams = {
  playerId: PlayerId;
  cardId: CardId;
  position?: number;
};

export const DeployUnitMove = defineMove<DeployUnitParams>({
  // Full type safety for params
});
```

## Performance Considerations

1. **State Structure**: Keep game-specific state flat for efficient updates
2. **Move Validation**: Validate cheaply before expensive state transformations
3. **Enumeration**: Lazy enumerate valid moves only when needed
4. **Card Lookups**: Use indexed structures for O(1) card access

## Next Steps

1. Implement core moves (resource, deploy, attack)
2. Define all phases and flow control
3. Configure all zones
4. Begin card definitions
5. Add comprehensive tests
6. Document patterns discovered

## Related Documentation

- [../../core/docs/INTEGRATION.md](../../core/docs/INTEGRATION.md) - Detailed integration guide
- [README.md](./README.md) - Package overview and usage
- [../../engines/core-engine/CLAUDE.md](../../engines/core-engine/CLAUDE.md) - Development guidelines

