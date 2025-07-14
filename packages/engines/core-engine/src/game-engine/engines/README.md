# Game Engine Blueprint: Creating New TCG Game Implementations

This document provides a comprehensive blueprint for creating new Trading Card Game (TCG) implementations using the CoreEngine framework. It analyzes the structure of existing engines (Lorcana and Gundam) to provide detailed implementation patterns and step-by-step instructions.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Directory Structure Blueprint](#directory-structure-blueprint)
3. [Type System Implementation](#type-system-implementation)
4. [Card System Architecture](#card-system-architecture)
5. [Game Logic and Flow](#game-logic-and-flow)
6. [Move System Implementation](#move-system-implementation)
7. [Testing Infrastructure](#testing-infrastructure)
8. [Step-by-Step Implementation Guide](#step-by-step-implementation-guide)
9. [Advanced Features](#advanced-features)
10. [Common Patterns and Best Practices](#common-patterns-and-best-practices)

---

## Architecture Overview

### Core Principles

All game engines in this system follow these fundamental principles:

1. **CoreEngine Integration**: Leverage the generic CoreEngine for state management, move processing, and core operations, if something is specified in core engine it should not be reimplement as G.
2. **Type Safety**: Comprehensive TypeScript implementation with runtime validation
3. **Modular Design**: Clear separation of concerns between engine, cards, rules, moves, and testing
4. **Immutable State**: All state changes create new objects rather than mutating existing ones
5. **Server-Authoritative**: Server holds definitive state with client optimistic updates
6. **Generic Type System**: Use CoreEngine's extensible type system for game-specific implementations

### Engine Comparison Matrix

| Feature | Lorcana | Gundam | Your Game |
|---------|---------|--------|-----------|
| **Complexity** | Medium | High | ? |
| **Zones** | 7 zones | 10 zones | ? |
| **Card Types** | 4 types | 5 types | ? |
| **Resource System** | Single (Ink) | Dual (Resource Deck + Area) | ? |
| **Combat** | Character-based | Unit vs Unit/Player | ? |
| **Phases per Turn** | 3 phases | 5+ phases | ? |

---

## Directory Structure Blueprint

### Standard Directory Layout

```
src/game-engine/engines/[GAME_NAME]/
├── Documentation Files
│   ├── FLOWCHARTS.md             # Visual game flow diagrams
│   ├── LLM-RULES.md              # Concise rules for AI processing (100-200 lines)
│   ├── README.md                 # Engineering guide and mechanics overview
│   └── RULES.md                  # Complete official rules documentation
│
├── Core Engine Files (root level)
│   ├── [game]-engine.ts          # Main engine class
│   └── [game]-engine-types.ts    # Type definitions for the game
│
└── src/                         # Source code directory
    ├── abilities/               # Card abilities and effects system
    │   ├── types.ts             # Ability type definitions
    │   ├── triggered.ts         # Triggered abilities
    │   ├── activated.ts         # Activated abilities
    │   ├── static.ts            # Static/continuous abilities
    │   └── keywords.ts          # Keyword abilities
    │
    ├── cards/                   # Card definitions and management
    │   ├── [game]-card-repository.ts  # Card repository implementation
    │   └── definitions/         # Card definition files
    │       ├── cardTypes.ts     # TypeScript card type definitions
    │       ├── cards.ts         # Master card registry/index
    │       ├── tokens/          # Special game tokens
    │       │   └── tokens.ts
    │       └── [SET_CODE]/      # Organized by card sets/expansions
    │           ├── index.ts     # Set exports
    │           ├── [type1]/     # Cards by type (units, spells, etc.)
    │           ├── [type2]/
    │           └── [typeN]/
    │
    ├── game-definition/         # Core game logic and flow
    │   ├── [game]-game-definition.ts  # Main game configuration
    │   └── segments/            # Game flow segments
    │       ├── starting-a-game/ # Pre-game setup
    │       │   ├── starting-a-game-segment.ts
    │       │   └── starting-a-game-segment.spec.ts
    │       ├── during-game/     # Main gameplay
    │       │   ├── during-game-segment.ts
    │       │   └── during-game-segment.spec.ts
    │       └── end-game/        # Game conclusion
    │           ├── end-game-segment.ts
    │           └── end-game-segment.spec.ts
    │
    ├── moves/                  # Player actions and moves
    │   ├── moves.ts            # Master moves export
    │   ├── types.ts            # Move type definitions
    │   ├── [move1].ts          # Individual move implementations
    │   ├── [move1].spec.ts     # Move unit tests
    │   ├── [move2].ts
    │   └── [moveN].ts
    │
    ├── testing/                # Test utilities
    │   ├── [game]-test-engine.ts    # Main test engine
    │   └── test-utils.ts       # Additional test helpers
    │
    └── utils/                  # Utility functions
        ├── create-empty-[game]-game-state.ts
        └── [game]-helpers.ts
```

---

## Type System Implementation

### 1. Types File (`[game]-engine-types.ts`)

Implement the game's type system using CoreEngine's generic extensions:
IMPORTANT: Before adding properties to GameState, make sure this is not already defined in CoreCtx nor PlayerState.
We can extend CoreCtx to have game specific properties, but we should not add properties that are meant to be part of PlayerState.

```typescript
/**
 * Basic type definitions for [GAME_NAME] engine
 * These are legacy types maintained for backward compatibility
 */

export type GameState = {
  // Add game-specific state properties
};

// Define your game's zone types
export type ZoneType = 
  | "deck" 
  | "hand" 
  | "play" 
  | "discard"
  // Add more zones as needed
  ;

// Define your game's card types
export type CardType = 
  | "creature" 
  | "spell" 
  | "artifact"
  // Add more card types as needed
  ;

// Add other game-specific enums and types

import type {
  ExtendCardDefinition,
  ExtendCardFilter,
  ExtendGameState,
  ExtendPlayerState,
} from "~/game-engine/core-engine/types/game-specific-types";
import type { [YourCardType] } from "./cards/definitions/cardTypes";

/**
 * Game-specific player state extending the base player state
 */
export type [Game]PlayerState = ExtendPlayerState<{
  // Add game-specific player properties
  lifePoints?: number;
  mana?: number;
  turnHistory: string[];
}>;

/**
 * Game-specific game state extending the base game state
 */
export type [Game]GameState = ExtendGameState<{
  // Add game-specific state properties

  // Add more properties as needed
}>;

/**
 * Game-specific card definition extending the base card definition
 */
export type [Game]CardDefinition = ExtendCardDefinition<[YourCardType]>;

/**
 * Comprehensive card filtering system
 */
export type [Game]CardFilter = ExtendCardFilter<{
  // Card type filtering
  cardType?: CardType;
  
  // Cost filtering
  cost?: {
    min?: number;
    max?: number;
    exact?: number;
  };
  
  // Zone-specific filtering
  zone?: ZoneType;
  
  // Game state filtering
  canPlay?: boolean;
  isExerted?: boolean;
  
  // Stat filtering
  power?: {
    min?: number;
    max?: number;
    exact?: number;
  };
  
  toughness?: {
    min?: number;
    max?: number;
    exact?: number;
  };
  
  // Keywords/abilities
  hasKeyword?: string[];
  hasAbility?: string[];
  
  // Turn/timing filtering
  playableThisTurn?: boolean;
  activatedThisTurn?: boolean;
  
  // Add more game-specific filters
}>;

// Game-specific enums and types
export type GamePhase =
  | "startPhase"
  | "mainPhase"
  | "combatPhase"
  | "endPhase";

export type ZoneType =
  | "deck"
  | "hand"
  | "battlefield"
  | "graveyard";

export type CardType = 
  | "creature" 
  | "spell" 
  | "artifact";

/**
 * Runtime type validation helpers
 */
export const is[Game]CardFilter = (filter: any): filter is [Game]CardFilter => {
  if (!filter || typeof filter !== "object") return false;
  
  const gameProperties = [
    "cardType",
    "cost",
    "zone",
    "canPlay",
    // Add your game-specific properties
  ];
  
  return gameProperties.some((prop) => filter[prop] !== undefined);
};

export const is[Game]PlayerState = (state: any): state is [Game]PlayerState => {
  if (!state || typeof state !== "object") return false;
  
  return (
    typeof state.id === "string" &&
    typeof state.name === "string" &&
    state.zones &&
    typeof state.zones === "object"
  );
};
```

---

## Card System Architecture

### 1. Card Type Definitions (`cards/definitions/cardTypes.ts`)

Define your game's card types with comprehensive TypeScript interfaces:

```typescript
/**
 * Card type definitions for [GAME_NAME]
 */

// Base card interface - all cards extend this
export interface BaseCard {
  id: string;
  name: string;
  type: string;
  set: string;
  number: number;
  rarity: "common" | "uncommon" | "rare" | "mythic" | "legendary";
  cost?: number;
  text?: string;
  flavorText?: string;
  artist?: string;
  // Add common properties
}

// Specific card types
export interface CreatureCard extends BaseCard {
  type: "creature";
  power: number;
  toughness: number;
  subtypes?: string[];
  keywords?: string[];
  abilities?: string[];
}

export interface SpellCard extends BaseCard {
  type: "spell";
  subtypes?: string[];
  effects?: string[];
}

export interface ArtifactCard extends BaseCard {
  type: "artifact";
  subtypes?: string[];
  abilities?: string[];
}

// Union type for all cards
export type [Game]Card = 
  | CreatureCard
  | SpellCard 
  | ArtifactCard;

// Add more card types as needed
```

### 2. Card Repository (`cards/[game]-card-repository.ts`)

Implement the card repository extending CoreEngine's repository:

```typescript
/**
 * Card repository for [GAME_NAME]
 */

import type {
  CoreCardDefinitionRepository,
} from "~/game-engine/core-engine/card/core-card-definition-repository";
import type { [Game]CardDefinition } from "../[game]-generic-types";
import { all[Game]CardsById } from "./definitions/cards";

export class [Game]CardRepository extends CoreCardDefinitionRepository<[Game]CardDefinition> {
  constructor(cards: Record<string, Record<string, string>>) {
    super();
    
    // Validate and populate the repository
    this.validateAndPopulate(cards);
  }
  
  private validateAndPopulate(cards: Record<string, Record<string, string>>) {
    const allInstanceIds = new Set<string>();
    
    for (const [playerId, playerCards] of Object.entries(cards)) {
      for (const [instanceId, publicId] of Object.entries(playerCards)) {
        // Validate unique instance IDs
        if (allInstanceIds.has(instanceId)) {
          throw new Error(`Duplicate instance ID found: ${instanceId}`);
        }
        allInstanceIds.add(instanceId);
        
        // Validate card exists in definitions
        const cardDefinition = all[Game]CardsById[publicId];
        if (!cardDefinition) {
          throw new Error(`Card definition not found for ID: ${publicId}`);
        }
        
        // Add to repository
        this.addCard(instanceId, publicId, cardDefinition);
      }
    }
  }
  
  getCardByPublicId(publicId: string): [Game]CardDefinition | undefined {
    return all[Game]CardsById[publicId];
  }
  
  getCardByInstanceId(instanceId: string): [Game]CardDefinition | undefined {
    return this.cards.get(instanceId);
  }
}
```

### 3. Card Definitions Structure

Organize your cards by sets and types:

```typescript
// cards/definitions/cards.ts - Master registry
import type { [Game]Card } from "./cardTypes";

// Import all sets
import { SET001_CARDS } from "./SET001";
import { SET002_CARDS } from "./SET002";
import { TOKEN_CARDS } from "./tokens/tokens";

// Create master card registry
export const all[Game]CardsById: Record<string, [Game]Card> = {
  ...SET001_CARDS,
  ...SET002_CARDS,
  ...TOKEN_CARDS,
};

// cards/definitions/SET001/index.ts - Set exports
import { CREATURES } from "./creatures/creatures";
import { SPELLS } from "./spells/spells";
import { ARTIFACTS } from "./artifacts/artifacts";

export const SET001_CARDS = {
  ...CREATURES,
  ...SPELLS,
  ...ARTIFACTS,
};

// cards/definitions/SET001/creatures/creatures.ts - Card definitions
import type { CreatureCard } from "../../cardTypes";

export const lightningDragon: CreatureCard = {
  id: "SET001-001",
  name: "Lightning Dragon",
  type: "creature",
  set: "SET001",
  number: 1,
  rarity: "rare",
  cost: 5,
  power: 4,
  toughness: 4,
  subtypes: ["Dragon"],
  keywords: ["Flying", "Haste"],
  text: "When Lightning Dragon enters the battlefield, deal 2 damage to any target.",
  flavorText: "Its roar thunders across the skies.",
  artist: "Fantasy Artist",
};

export const CREATURES = {
  [lightningDragon.id]: lightningDragon,
  // Add more creatures
};
```

---

## Game Logic and Flow

### 1. Main Game Definition (`game-definition/[game]-game-definition.ts`)

Create the main game configuration:

```typescript
/**
 * Main game definition for [GAME_NAME]
 */

import type { GameConfig } from "~/game-engine/core-engine/game/game-config";
import type { [Game]GameState } from "../[game]-generic-types";
import { [game]Moves } from "../moves/moves";
import { startingAGameSegment } from "./segments/starting-a-game/starting-a-game-segment";
import { duringGameSegment } from "./segments/during-game/during-game-segment";
import { endGameSegment } from "./segments/end-game/end-game-segment";

export const [Game]Game: GameConfig<[Game]GameState> = {
  name: "[GAME_NAME]",
  
  // Define your game segments
  segments: {
    startingAGame: startingAGameSegment,
    duringGame: duringGameSegment,
    endGame: endGameSegment,
  },
  
  // Global moves available across all segments
  moves: [game]Moves,
  
  // Win condition checker
  endIf: ({ G, ctx }) => {
    // Implement your win conditions
    for (const playerId of ctx.playerOrder) {
      const player = G.players?.[playerId];
      if (player?.lifePoints <= 0) {
        return { winner: getOpponent(playerId, ctx.playerOrder) };
      }
    }
    
    return false;
  },
  
};

function getOpponent(playerId: string, playerOrder: string[]): string {
  return playerOrder.find(id => id !== playerId) || "";
}
```

### 2. Segment Implementation

Each segment should follow this pattern:

```typescript
// segments/starting-a-game/starting-a-game-segment.ts
import type { SegmentConfig } from "~/game-engine/core-engine/game/structure/segment";
import type { [Game]GameState } from "../../[game]-generic-types";
import { [game]Moves } from "../../moves/moves";

export const startingAGameSegment: SegmentConfig<[Game]GameState> = {
  next: "duringGame",
  
  onBegin: ({ G, core }) => {
    // Initialize the segment
    logger.info("==== STARTING [GAME_NAME] ====");
    
    // Setup initial game state
    for (const player of core.getPlayers()) {
      // Shuffle decks
      core.shuffleZone("deck", player);
      
      // Draw initial hands
      const initialHandSize = 7; // Adjust for your game
      for (let i = 0; i < initialHandSize; i++) {
        core.moveCard({
          playerId: player,
          from: "deck",
          to: "hand",
          destination: "end",
        });
      }
    }
    
    return G;
  },
  
  endIf: ({ ctx }) => {
    // Define when this segment ends
    return ctx.otp !== undefined && !ctx.pendingMulligan;
  },
  
  onEnd: ({ G, ctx, core }) => {
    // Cleanup and transition logic
    if (ctx.otp) {
      core.setPriorityPlayer(ctx.otp);
      core.setTurnPlayer(ctx.otp);
    }
    
    return G;
  },
  
  turn: {
    phases: {
      chooseFirstPlayer: {
        start: true,
        next: "mulligan",
        
        endIf: ({ ctx }) => ctx.otp !== undefined,
        
        moves: {
          chooseFirstPlayer: [game]Moves.chooseFirstPlayer,
        },
      },
      
      mulligan: {
        endIf: ({ ctx }) => !ctx.pendingMulligan,
        
        onBegin: ({ G, ctx, core }) => {
          core.setPendingMulligan(core.getPlayers());
          return G;
        },
        
        moves: {
          mulligan: [game]Moves.mulligan,
        },
      },
    },
  },
};
```

---

## Move System Implementation

### 1. Move Types (`moves/types.ts`)

Define your move types:

```typescript
/**
 * Move type definitions for [GAME_NAME]
 */

import type { Move } from "~/game-engine/core-engine/game/moves/move";
import type { [Game]GameState } from "../[game]-generic-types";

export type [Game]Move = Move<[Game]GameState>;

// Define move argument types
export type PlayCardArgs = {
  cardInstanceId: string;
  targetInstanceId?: string;
  position?: number;
};

export type AttackArgs = {
  attackerInstanceId: string;
  targetInstanceId?: string; // undefined for direct attack
};

export type ActivateAbilityArgs = {
  cardInstanceId: string;
  abilityIndex: number;
  targets?: string[];
};
```

### 2. Individual Move Implementation

Each move should follow this pattern:

```typescript
// moves/playCard.ts
import type { [Game]Move } from "./types";
import { logger } from "~/game-engine/core-engine/utils/logger";

export const playCard: [Game]Move = ({ G, playerID, core }, cardInstanceId: string, targetInstanceId?: string) => {
  if (!playerID) {
    logger.warn("PlayCard: No player ID provided");
    return false;
  }
  
  // Validate the move
  const handZone = core.getZone("hand", playerID);
  if (!handZone.cards.includes(cardInstanceId)) {
    logger.warn("PlayCard: Card not in player's hand");
    return false;
  }
  
  // Get card definition
  const cardDefinition = core.getCardDefinition(cardInstanceId);
  if (!cardDefinition) {
    logger.warn("PlayCard: Card definition not found");
    return false;
  }
  
  // Check if player can afford the card
  const player = G.players?.[playerID];
  if (!player || (player.mana || 0) < (cardDefinition.cost || 0)) {
    logger.warn("PlayCard: Insufficient mana");
    return false;
  }
  
  // Play the card
  core.moveCard({
    playerId: playerID,
    instanceId: cardInstanceId,
    from: "hand",
    to: cardDefinition.type === "creature" ? "battlefield" : "graveyard",
    destination: "end",
  });
  
  // Pay the cost
  if (player.mana !== undefined && cardDefinition.cost) {
    player.mana -= cardDefinition.cost;
  }
  
  // Apply card effects
  applyCardEffects(G, core, cardDefinition, playerID, targetInstanceId);
  
  logger.info(`PlayCard: ${playerID} played ${cardDefinition.name}`);
  return G;
};

function applyCardEffects(G: [Game]GameState, core: any, card: any, playerID: string, targetInstanceId?: string) {
  // Implement card effect resolution
  // This will vary greatly depending on your game's mechanics
}

// moves/playCard.spec.ts - Unit test
import { describe, it, expect } from "bun:test";
import { [Game]TestEngine } from "../testing/[game]-test-engine";
import { mockCreatureCard } from "../testing/test-utils";

describe("playCard", () => {
  it("should play a creature card to the battlefield", () => {
    const testEngine = new [Game]TestEngine({
      hand: [mockCreatureCard],
    });
    
    const handCards = testEngine.getZone("hand");
    expect(handCards).toHaveLength(1);
    
    testEngine.playCard(handCards[0]);
    
    expect(testEngine.getZone("hand")).toHaveLength(0);
    expect(testEngine.getZone("battlefield")).toHaveLength(1);
  });
  
  it("should not play a card if player has insufficient mana", () => {
    const testEngine = new [Game]TestEngine({
      hand: [mockCreatureCard],
    });
    
    // Set player mana to less than card cost
    const state = testEngine.getState();
    state.players!["player_one"].mana = 0;
    
    const result = testEngine.playCard(testEngine.getZone("hand")[0]);
    expect(result).toBe(false);
  });
});
```

### 3. Move Registry (`moves/moves.ts`)

Export all your moves:

```typescript
/**
 * Move registry for [GAME_NAME]
 */

import { chooseFirstPlayer } from "./chooseFirstPlayer";
import { mulligan } from "./mulligan";
import { playCard } from "./playCard";
import { attack } from "./attack";
import { activateAbility } from "./activateAbility";
import { endTurn } from "./endTurn";

export const [game]Moves = {
  // Setup moves
  chooseFirstPlayer,
  mulligan,
  
  // Gameplay moves
  playCard,
  attack,
  activateAbility,
  endTurn,
  
  // Add more moves as needed
};
```

---

## Testing Infrastructure

### 1. Test Engine (`testing/[game]-test-engine.ts`)

Create a comprehensive test engine:

```typescript
import { expect } from "bun:test";
import type { [Game]GameState, ZoneType } from "../[game]-generic-types";
import { [Game]Engine } from "../[game]-engine";
import { [Game]CardRepository } from "../cards/[game]-card-repository";
import { mockCards } from "./test-utils";

export type TestInitialState = Partial<Record<ZoneType, number | [Game]Card[]>>;

export class [Game]TestEngine {
  // Multi-engine architecture for realistic testing
  authoritativeEngine: [Game]Engine;
  playerOneEngine: [Game]Engine;
  playerTwoEngine: [Game]Engine;
  
  activeEngine = "player_one";
  
  constructor(
    playerState: TestInitialState = {},
    opponentState: TestInitialState = {},
    opts: { debug?: boolean; skipPreGame?: boolean } = {}
  ) {
    const { initialCoreContext, game } = createMockGame(
      playerState,
      opponentState,
      opts.skipPreGame
    );
    
    const repository = new [Game]CardRepository(initialCoreContext.cards);
    const gameId = `TEST_${Date.now()}`;
    const players = ["player_one", "player_two"];
    
    // Create engines
    this.authoritativeEngine = new [Game]Engine({
      initialState: game,
      initialCoreCtx: initialCoreContext,
      cards: initialCoreContext.cards,
      cardRepository: repository,
      playerId: undefined, // Authoritative
      gameId,
      players,
      debug: opts.debug,
    });
    
    this.playerOneEngine = new [Game]Engine({
      initialState: game,
      initialCoreCtx: initialCoreContext,
      cards: initialCoreContext.cards,
      cardRepository: repository,
      playerId: "player_one",
      gameId,
      players,
      debug: opts.debug,
    });
    
    this.playerTwoEngine = new [Game]Engine({
      initialState: game,
      initialCoreCtx: initialCoreContext,
      cards: initialCoreContext.cards,
      cardRepository: repository,
      playerId: "player_two",
      gameId,
      players,
      debug: opts.debug,
    });
    
    // Connect engines
    this.playerOneEngine.setAuthoritativeEngine(this.authoritativeEngine);
    this.playerTwoEngine.setAuthoritativeEngine(this.authoritativeEngine);
  }
  
  // Engine selection
  get engine() {
    return this.activeEngine === "player_one" 
      ? this.playerOneEngine 
      : this.playerTwoEngine;
  }
  
  changeActivePlayer(playerId: "player_one" | "player_two") {
    this.activeEngine = playerId;
  }
  
  // State queries
  getState() {
    return this.authoritativeEngine.getState();
  }
  
  getCtx() {
    return this.authoritativeEngine.getCtx();
  }
  
  getZone(zone: ZoneType, playerId = "player_one"): string[] {
    const ctx = this.getCtx();
    return ctx.cardZones[`${playerId}-${zone}`]?.cards || [];
  }
  
  // Test assertions
  assertThatZonesContain(
    zones: Partial<Record<ZoneType, number>>,
    playerId = "player_one"
  ) {
    const actualCounts = this.getZonesCardCount(playerId);
    expect(actualCounts).toEqual(expect.objectContaining(zones));
  }
  
  getZonesCardCount(playerId = "player_one"): Record<ZoneType, number> {
    const ctx = this.getCtx();
    const zones: ZoneType[] = ["deck", "hand", "battlefield", "graveyard"];
    const counts: Record<ZoneType, number> = {} as any;
    
    for (const zone of zones) {
      const zoneCards = ctx.cardZones[`${playerId}-${zone}`]?.cards || [];
      counts[zone] = zoneCards.length;
    }
    
    return counts;
  }
  
  // Move wrappers
  chooseFirstPlayer(playerId: string) {
    return this.engine.moves.chooseFirstPlayer(playerId);
  }
  
  playCard(cardInstanceId: string, targetInstanceId?: string) {
    return this.engine.moves.playCard(cardInstanceId, targetInstanceId);
  }
  
  attack(attackerInstanceId: string, targetInstanceId?: string) {
    return this.engine.moves.attack(attackerInstanceId, targetInstanceId);
  }
  
  // Add more move wrappers as needed
}

function createMockGame(
  playerState: TestInitialState,
  opponentState: TestInitialState,
  skipPreGame = true
) {
  // Implementation similar to existing engines
  // Create initial game state and core context
  // Populate zones with mock cards based on TestInitialState
}
```

### 2. Test Utilities (`testing/test-utils.ts`)

Create helper utilities for testing:

```typescript
import type { [Game]Card } from "../cards/definitions/cardTypes";

// Mock cards for testing
export const mockCreatureCard: CreatureCard = {
  id: "TEST-CREATURE-001",
  name: "Test Creature",
  type: "creature",
  set: "TEST",
  number: 1,
  rarity: "common",
  cost: 3,
  power: 2,
  toughness: 2,
  text: "A creature for testing",
};

export const mockSpellCard: SpellCard = {
  id: "TEST-SPELL-001",
  name: "Test Spell",
  type: "spell",
  set: "TEST",
  number: 2,
  rarity: "common",
  cost: 2,
  text: "Deal 3 damage to any target",
};

// Add more mock cards for different scenarios

export const mockCards = {
  creature: mockCreatureCard,
  spell: mockSpellCard,
  // Add more as needed
};

// Helper functions for common test scenarios
export function createDeckWith(cards: [Game]Card[], count = 1): [Game]Card[] {
  const deck: [Game]Card[] = [];
  for (let i = 0; i < count; i++) {
    deck.push(...cards);
  }
  return deck;
}

export function createBalancedDeck(): [Game]Card[] {
  return [
    ...createDeckWith([mockCreatureCard], 20),
    ...createDeckWith([mockSpellCard], 20),
    // Create a balanced test deck
  ];
}
```

---

## Step-by-Step Implementation Guide

### Phase 1: Foundation Setup

1. **Create Directory Structure**
   ```bash
   mkdir -p src/game-engine/engines/[game-name]/{src/{abilities,cards/definitions,game-definition/segments,moves,testing,utils},docs}
   ```

2. **Create Documentation Files**
   - `RULES.md`: Complete official rules
   - `LLM-RULES.md`: Concise 50-100 line summary
   - `README.md`: Engineering overview
   - `FLOWCHARTS.md`: Visual game flow

3. **Implement Type System**
   - Create `[game]-engine-types.ts` with types
   - Define all zones, card types, and game phases

### Phase 2: Card System

1. **Define Card Types** (`cards/definitions/cardTypes.ts`)
   - Create interfaces for each card type
   - Define union type for all cards
   - Add game-specific properties

2. **Create Card Repository** (`cards/[game]-card-repository.ts`)
   - Extend CoreCardDefinitionRepository
   - Implement validation logic
   - Add card lookup methods

3. **Populate Card Definitions**
   - Organize by sets and types
   - Create master registry in `cards/definitions/cards.ts`
   - Add token definitions if needed

### Phase 3: Game Logic

1. **Create Main Game Definition**
   - Implement `[game]-game-definition.ts`
   - Define segments and their relationships
   - Set up win conditions and game setup

2. **Implement Segments**
   - Start with `starting-a-game-segment.ts`
   - Add `during-game-segment.ts`
   - Create `end-game-segment.ts`
   - Write comprehensive tests for each segment

3. **Define Game Flow**
   - Map out phases within each segment
   - Implement phase transitions
   - Add proper state validation

### Phase 4: Move System

1. **Define Move Types** (`moves/types.ts`)
   - Create base move type
   - Define argument interfaces
   - Add validation types

2. **Implement Core Moves**
   - Start with setup moves (choose first player, mulligan)
   - Add basic gameplay moves (play card, pass turn)
   - Implement complex moves (combat, abilities)

3. **Create Move Registry**
   - Export all moves from `moves/moves.ts`
   - Organize by game phase or type
   - Ensure proper type safety

### Phase 5: Main Engine

1. **Create Engine Class** (`[game]-engine.ts`)
   - Extend or wrap CoreEngine
   - Implement game-specific methods
   - Add utility functions for common operations

2. **Add Engine Features**
   - State querying methods
   - Card filtering and searching
   - Zone management helpers
   - Player action interfaces

### Phase 6: Testing Infrastructure

1. **Create Test Engine**
   - Implement multi-engine architecture
   - Add zone assertion methods
   - Create move wrapper functions

2. **Add Test Utilities**
   - Create mock cards for testing
   - Add helper functions for common scenarios
   - Implement test data factories

3. **Write Comprehensive Tests**
   - Unit tests for each move
   - Integration tests for game segments
   - End-to-end game flow tests

---

## Advanced Features

### Ability System Implementation

If your game has complex card abilities, implement a comprehensive ability system:

```typescript
// abilities/types.ts
export interface Ability {
  id: string;
  type: "triggered" | "activated" | "static" | "keyword";
  cost?: Cost;
  condition?: Condition;
  effect: Effect;
  timing?: Timing;
}

export interface TriggeredAbility extends Ability {
  type: "triggered";
  trigger: TriggerEvent;
  optional?: boolean;
}

export interface ActivatedAbility extends Ability {
  type: "activated";
  activationCost: Cost[];
  timingRestrictions?: TimingRestriction[];
}

// abilities/resolution.ts
export class AbilityStack {
  private stack: AbilityActivation[] = [];
  
  push(ability: AbilityActivation) {
    this.stack.push(ability);
  }
  
  resolve(G: GameState, core: CoreEngine) {
    while (this.stack.length > 0) {
      const ability = this.stack.pop()!;
      this.resolveAbility(ability, G, core);
    }
  }
  
  private resolveAbility(ability: AbilityActivation, G: GameState, core: CoreEngine) {
    // Implement ability resolution logic
  }
}
```

### Complex Combat System

For games with intricate combat mechanics:

```typescript
// combat/combat-manager.ts
export class CombatManager {
  private attackers: Set<string> = new Set();
  private blockers: Map<string, string> = new Map(); // attacker -> blocker
  private combatDamage: Map<string, number> = new Map();
  
  declareAttackers(attackerIds: string[], G: GameState, core: CoreEngine) {
    for (const attackerId of attackerIds) {
      if (this.canAttack(attackerId, G, core)) {
        this.attackers.add(attackerId);
      }
    }
  }
  
  declareBlockers(blocks: Array<{attacker: string, blocker: string}>, G: GameState, core: CoreEngine) {
    for (const {attacker, blocker} of blocks) {
      if (this.canBlock(attacker, blocker, G, core)) {
        this.blockers.set(attacker, blocker);
      }
    }
  }
  
  resolveCombat(G: GameState, core: CoreEngine) {
    // Implement combat damage resolution
    this.calculateDamage(G, core);
    this.applyDamage(G, core);
    this.cleanup();
  }
}
```

### Advanced Card Filtering

Implement sophisticated card filtering and querying:

```typescript
// utils/card-filter.ts
export class CardFilterEngine {
  static filter(cards: EnrichedCard[], filter: [Game]CardFilter): EnrichedCard[] {
    return cards.filter(card => this.matchesFilter(card, filter));
  }
  
  private static matchesFilter(card: EnrichedCard, filter: [Game]CardFilter): boolean {
    // Implement comprehensive filtering logic
    if (filter.cardType && card.definition.type !== filter.cardType) {
      return false;
    }
    
    if (filter.cost) {
      const cardCost = card.definition.cost || 0;
      if (filter.cost.min !== undefined && cardCost < filter.cost.min) return false;
      if (filter.cost.max !== undefined && cardCost > filter.cost.max) return false;
      if (filter.cost.exact !== undefined && cardCost !== filter.cost.exact) return false;
    }
    
    // Add more filter conditions
    return true;
  }
}
```

---

## Common Patterns and Best Practices

### 1. State Management

**Always maintain immutability:**
```typescript
// ❌ Don't mutate state directly
G.players[playerID].lifePoints -= damage;

// ✅ Create new state objects
return {
  ...G,
  players: {
    ...G.players,
    [playerID]: {
      ...G.players[playerID],
      lifePoints: (G.players[playerID].lifePoints || 0) - damage,
    },
  },
};
```

### 2. Error Handling

**Validate all inputs and provide clear error messages:**
```typescript
export const playCard: [Game]Move = ({ G, playerID, core }, cardInstanceId: string) => {
  // Validate player ID
  if (!playerID) {
    logger.warn("PlayCard: No player ID provided");
    return false;
  }
  
  // Validate card exists in hand
  const handZone = core.getZone("hand", playerID);
  if (!handZone.cards.includes(cardInstanceId)) {
    logger.warn(`PlayCard: Card ${cardInstanceId} not in ${playerID}'s hand`);
    return false;
  }
  
  // Continue with validation...
};
```

### 3. Logging

**Use structured logging throughout:**
```typescript
import { logger } from "~/game-engine/core-engine/utils/logger";

// Log important game events
logger.info(`Game started with players: ${ctx.playerOrder.join(", ")}`);
logger.debug(`Player ${playerID} attempting to play card ${cardInstanceId}`);
logger.warn(`Invalid move attempted: ${moveType} by ${playerID}`);
logger.error(`Critical error in move processing: ${error.message}`);
```

### 4. Testing Patterns

**Write comprehensive tests with clear assertions:**
```typescript
describe("Combat System", () => {
  it("should resolve combat damage correctly", () => {
    const testEngine = new [Game]TestEngine({
      battlefield: [mockCreatureCard],
    });
    
    // Setup combat scenario
    testEngine.declareAttackers([testEngine.getZone("battlefield")[0]]);
    testEngine.resolveCombat();
    
    // Assert expected outcomes
    expect(testEngine.getOpponentLifePoints()).toBe(17); // 20 - 3 damage
    testEngine.assertThatZonesContain({
      battlefield: 1, // Creature survives
    });
  });
});
```

### 5. Performance Considerations

**Optimize frequent operations:**
```typescript
// Cache expensive calculations
private cardFilterCache = new Map<string, EnrichedCard[]>();

queryCardsByFilter(filter: [Game]CardFilter): EnrichedCard[] {
  const cacheKey = JSON.stringify(filter);
  
  if (this.cardFilterCache.has(cacheKey)) {
    return this.cardFilterCache.get(cacheKey)!;
  }
  
  const result = this.performExpensiveQuery(filter);
  this.cardFilterCache.set(cacheKey, result);
  
  return result;
}
```

### 6. Type Safety

**Leverage TypeScript's type system:**
```typescript
// Use branded types for IDs
type CardInstanceId = string & { readonly brand: unique symbol };
type PlayerId = string & { readonly brand: unique symbol };

// Use discriminated unions for card types
type Card = 
  | { type: "creature"; power: number; toughness: number }
  | { type: "spell"; effects: Effect[] }
  | { type: "artifact"; abilities: Ability[] };

// Use const assertions for immutable data
const ZONES = ["deck", "hand", "battlefield", "graveyard"] as const;
type ZoneType = typeof ZONES[number];
```

---

## Validation Checklist

Before considering your implementation complete, ensure you have:

### Core Architecture
- [ ] Extended CoreEngine properly with game-specific types
- [ ] Implemented comprehensive type system with runtime validation
- [ ] Created modular directory structure following established patterns
- [ ] Set up proper documentation (RULES.md, LLM-RULES.md, README.md)

### Card System
- [ ] Defined all card types with TypeScript interfaces
- [ ] Implemented card repository extending CoreCardDefinitionRepository
- [ ] Organized card definitions by sets and types
- [ ] Created comprehensive card filtering system

### Game Logic
- [ ] Implemented all game segments with proper flow control
- [ ] Created phase system matching your game's structure
- [ ] Added win condition checking
- [ ] Implemented proper priority and turn management

### Move System
- [ ] Created type-safe move definitions
- [ ] Implemented all required moves with validation
- [ ] Added comprehensive error handling and logging
- [ ] Written unit tests for each move

### Testing
- [ ] Created multi-engine test architecture
- [ ] Implemented zone assertion helpers
- [ ] Added mock cards and test utilities
- [ ] Written integration tests for game flow

### Code Quality
- [ ] All code follows TypeScript strict mode
- [ ] Proper error handling throughout
- [ ] Comprehensive logging at appropriate levels
- [ ] Code is well-documented with JSDoc where needed
- [ ] All tests pass with good coverage

---

This blueprint provides a comprehensive foundation for implementing any TCG using the CoreEngine framework. Follow the patterns established by existing engines while adapting the specifics to your game's unique mechanics and requirements.