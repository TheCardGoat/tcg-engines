# @tcg/core Type Specification

**Date:** 2025-10-09  
**Version:** 2.0.0 (Breaking Changes)  
**Status:** Design Phase

## Overview

This document specifies the complete type system for `@tcg/core` framework, designed from first principles for trading card games. All types follow these core tenets:

1. **Immutability** - All state types are immutable
2. **Type Safety** - Strict TypeScript with no `any` types
3. **Extensibility** - Games extend core types via intersection
4. **Simplicity** - Core provides minimal foundation, games add specifics
5. **Consistency** - Similar concepts use similar patterns

## 1. Branded Types

### 1.1 Brand Utility

**File:** `packages/core/src/types/branded.ts`

```typescript
/**
 * Brand<T, TBrand> - Creates a branded type for compile-time type safety
 * 
 * Branded types prevent mixing different ID types even though they're
 * all strings at runtime.
 * 
 * @example
 * ```typescript
 * const playerId = createPlayerId("p1");
 * const cardId = createCardId("c1");
 * 
 * // TypeScript error: Type 'CardId' is not assignable to type 'PlayerId'
 * const wrong: PlayerId = cardId;
 * ```
 */
export type Brand<T, TBrand> = T & { readonly [brand]: TBrand };
```

**Design Decision:** Use symbol instead of string literal for brand property
- **Rationale:** Prevents accidental property access, purely compile-time

### 1.2 Core ID Types

```typescript
/**
 * PlayerId - Branded string for player identification
 * 
 * Used to identify players uniquely across the game.
 */
export type PlayerId = Brand<string, "PlayerId">;

/**
 * CardId - Branded string for card instance identification
 * 
 * Identifies a specific card instance in the game (not the card definition).
 * Multiple instances of the same card have different CardIds.
 */
export type CardId = Brand<string, "CardId">;

/**
 * ZoneId - Branded string for zone identification
 * 
 * Identifies game zones (deck, hand, play, discard, etc.).
 */
export type ZoneId = Brand<string, "ZoneId">;

/**
 * GameId - Branded string for game identification
 * 
 * Identifies a specific game instance for matchmaking/lobbies.
 */
export type GameId = Brand<string, "GameId">;

/**
 * AbilityId - Branded string for ability identification
 * 
 * Identifies abilities/effects for activation and tracking.
 */
export type AbilityId = Brand<string, "AbilityId">;
```

**Addition:** `AbilityId` added to core (was lorcana-specific)
- **Rationale:** Most TCGs have identifiable abilities/effects

### 1.3 Creator Functions

**File:** `packages/core/src/types/branded-utils.ts`

```typescript
export function createPlayerId(value: string): PlayerId {
  if (!value || value.length === 0) {
    throw new Error("PlayerId cannot be empty");
  }
  return value as PlayerId;
}

export function createCardId(value: string): CardId {
  if (!value || value.length === 0) {
    throw new Error("CardId cannot be empty");
  }
  return value as CardId;
}

export function createZoneId(value: string): ZoneId {
  if (!value || value.length === 0) {
    throw new Error("ZoneId cannot be empty");
  }
  return value as ZoneId;
}

export function createGameId(value: string): GameId {
  if (!value || value.length === 0) {
    throw new Error("GameId cannot be empty");
  }
  return value as GameId;
}

export function createAbilityId(value: string): AbilityId {
  if (!value || value.length === 0) {
    throw new Error("AbilityId cannot be empty");
  }
  return value as AbilityId;
}
```

**Design Decision:** Include validation in creator functions
- **Rationale:** Catch empty strings early, prevent invalid IDs

---

## 2. Zone System

### 2.1 Zone Visibility

```typescript
/**
 * ZoneVisibility - Defines who can see cards in a zone
 * 
 * - "public": All players can see all cards (e.g., play area, discard)
 * - "private": Owner can see cards, opponents see count only (e.g., hand)
 * - "secret": No one can see cards, only count (e.g., deck, facedown cards)
 * 
 * @example
 * ```typescript
 * // Play area - everyone can see all cards
 * const playZone: ZoneConfig = {
 *   id: createZoneId("play"),
 *   name: "Play Area",
 *   visibility: "public",
 *   ordered: false,
 * };
 * 
 * // Hand - only owner can see their cards
 * const handZone: ZoneConfig = {
 *   id: createZoneId("hand"),
 *   name: "Hand",
 *   visibility: "private",
 *   ordered: false,
 * };
 * 
 * // Deck - no one can see cards (even owner)
 * const deckZone: ZoneConfig = {
 *   id: createZoneId("deck"),
 *   name: "Deck",
 *   visibility: "secret",
 *   ordered: true,
 *   faceDown: true,
 * };
 * ```
 */
export type ZoneVisibility = "public" | "private" | "secret";
```

**Design Decision:** Three-tier visibility model
- **Rationale:** 
  - More flexible than two-tier
  - "secret" handles both deck (owner can't see) and facedown cards
  - Covers all TCG zone visibility needs

**Lorcana Migration:**
- Lorcana `"all"` → Core `"public"`
- Lorcana `"owner"` + `facedown: false` → Core `"private"`
- Lorcana `"owner"` + `facedown: true` → Core `"secret"`

### 2.2 Zone Configuration

```typescript
/**
 * ZoneConfig - Configuration for a game zone
 * 
 * Defines the properties and rules of a zone where cards can exist.
 */
export type ZoneConfig = {
  /**
   * Unique identifier for this zone
   */
  id: ZoneId;

  /**
   * Human-readable name (for UI/display)
   */
  name: string;

  /**
   * Who can see cards in this zone
   */
  visibility: ZoneVisibility;

  /**
   * Whether card order matters in this zone
   * 
   * - true: Order is significant (e.g., deck, discard)
   * - false: Can rearrange freely (e.g., hand, play)
   */
  ordered: boolean;

  /**
   * Optional owner of the zone
   * 
   * - Defined: Zone is player-specific (e.g., hand, deck)
   * - Undefined: Zone is shared (e.g., shared play area)
   */
  owner?: PlayerId;

  /**
   * Whether cards are face-down by default
   * 
   * - true: Cards enter face-down (e.g., deck)
   * - false/undefined: Cards are face-up
   * 
   * Note: Face-down is separate from visibility.
   * Deck is both secret (can't see) and face-down (cards aren't revealed).
   */
  faceDown?: boolean;

  /**
   * Maximum number of cards allowed in this zone
   * 
   * - Defined: Zone has size limit (e.g., hand size limit, battle area slots)
   * - Undefined: No limit
   */
  maxSize?: number;
};
```

### 2.3 Zone State

```typescript
/**
 * Zone - A zone containing cards with configuration
 * 
 * Represents a zone as an object with config and card list.
 * Used for shared zones or when zone config needs to travel with cards.
 */
export type Zone = {
  config: ZoneConfig;
  cards: CardId[];
};

/**
 * ZoneState - Per-player zone state
 * 
 * Maps each player to their array of cards in a zone.
 * Used for player-specific zones (hand, deck, discard, etc.).
 * 
 * @example
 * ```typescript
 * const handState: ZoneState = {
 *   [player1Id]: [card1Id, card2Id, card3Id],
 *   [player2Id]: [card4Id, card5Id],
 * };
 * ```
 */
export type ZoneState = Record<PlayerId, CardId[]>;
```

**Addition:** `ZoneState` utility type
- **Rationale:** Common pattern in both lorcana and gundam, should be in core

### 2.4 Zone Operations

All existing zone operations remain, with additions:

```typescript
/**
 * Create empty zone state for players
 */
export function createZoneState(players: PlayerId[]): ZoneState;

/**
 * Add card to player's zone
 */
export function addCardToZone(
  zoneState: ZoneState,
  playerId: PlayerId,
  cardId: CardId,
): void;

/**
 * Add card to top of ordered zone
 */
export function addCardToTop(
  zoneState: ZoneState,
  playerId: PlayerId,
  cardId: CardId,
): void;

/**
 * Add card to bottom of ordered zone
 */
export function addCardToBottom(
  zoneState: ZoneState,
  playerId: PlayerId,
  cardId: CardId,
): void;

/**
 * Remove card from player's zone
 */
export function removeCardFromZone(
  zoneState: ZoneState,
  playerId: PlayerId,
  cardId: CardId,
): void;

/**
 * Move card between zones
 */
export function moveCardBetweenZones(
  sourceZone: ZoneState,
  destZone: ZoneState,
  playerId: PlayerId,
  cardId: CardId,
): void;

/**
 * Check if card is in player's zone
 */
export function isCardInZone(
  zoneState: ZoneState,
  playerId: PlayerId,
  cardId: CardId,
): boolean;

/**
 * Get all cards in player's zone
 */
export function getCardsInZone(
  zoneState: ZoneState,
  playerId: PlayerId,
): CardId[];

/**
 * Get number of cards in player's zone
 */
export function getZoneSize(
  zoneState: ZoneState,
  playerId: PlayerId,
): number;

/**
 * Get top card from ordered zone
 */
export function getTopCard(
  zoneState: ZoneState,
  playerId: PlayerId,
): CardId | undefined;

/**
 * Clear all cards from player's zone
 */
export function clearZone(
  zoneState: ZoneState,
  playerId: PlayerId,
): void;
```

---

## 3. Card System

### 3.1 Card Definition (Blueprint)

```typescript
/**
 * CardDefinition - Static, immutable data for a card type
 * 
 * This represents the "blueprint" of a card, not an instance in play.
 * All instances of the same card share the same definition.
 * 
 * Core provides minimal base properties. Games extend via intersection.
 * 
 * @example
 * ```typescript
 * // Core definition
 * const baseCard: CardDefinition = {
 *   id: "lorcana-001",
 *   name: "Mickey Mouse - Brave Little Tailor",
 *   type: "character",
 * };
 * 
 * // Game-specific extension
 * type LorcanaCard = CardDefinition & {
 *   inkwell: boolean;
 *   cost: number;
 *   lore?: number;
 *   strength?: number;
 *   willpower?: number;
 * };
 * ```
 */
export type CardDefinition = {
  /**
   * Unique identifier for this card definition
   * 
   * Multiple instances share the same id.
   */
  id: string;

  /**
   * Display name of the card
   */
  name: string;

  /**
   * Card type (game-specific)
   * 
   * Examples: "character", "action", "unit", "pilot", "command"
   */
  type: string;

  /**
   * Base power value (for creatures/units)
   * 
   * Optional: Not all card types have power
   */
  basePower?: number;

  /**
   * Base toughness/health value (for creatures/units)
   * 
   * Optional: Not all card types have toughness
   */
  baseToughness?: number;

  /**
   * Base mana/resource cost to play the card
   * 
   * Optional: Some cards may have no cost or variable cost
   */
  baseCost?: number;

  /**
   * Static abilities this card has
   * 
   * Can be keywords or ability IDs
   * Optional: Not all cards have abilities
   */
  abilities?: string[];

  /**
   * Card rarity (optional metadata)
   * 
   * Examples: "common", "uncommon", "rare", "super-rare", "legendary"
   */
  rarity?: string;

  /**
   * Set code (optional metadata)
   * 
   * Examples: "ST01", "GD01", "TFC"
   */
  setCode?: string;

  /**
   * Card number within set (optional metadata)
   * 
   * Examples: "001", "042"
   */
  cardNumber?: string;

  /**
   * Image URL (optional metadata)
   */
  imageUrl?: string;

  /**
   * Card text/description (optional metadata)
   */
  text?: string;
};
```

**Design Decision:** Minimal base, extensible
- **Rationale:**
  - Core can't predict all card properties
  - Games extend with intersection types
  - Optional metadata fields cover common needs

### 3.2 Card Instance (Runtime)

```typescript
/**
 * CardInstanceBase - Base runtime state for a card instance
 * 
 * Represents a specific card in play (not the blueprint).
 */
export type CardInstanceBase = {
  /**
   * Unique instance identifier
   * 
   * Each physical card in the game has a unique instance ID.
   */
  instanceId: CardId;

  /**
   * Reference to the card definition (blueprint)
   */
  definitionId: string;

  /**
   * Player who owns this card
   */
  ownerId: PlayerId;

  /**
   * Current zone this card is in
   */
  zoneId?: ZoneId;
};

/**
 * CardInstance - Card instance with game-specific state
 * 
 * Games extend with custom state (damage, counters, modifications, etc.)
 * 
 * @example
 * ```typescript
 * // Lorcana character state
 * type LorcanaCharacter = CardInstance<{
 *   damage: number;
 *   exerted: boolean;
 *   playedThisTurn: boolean;
 * }>;
 * 
 * // Gundam unit state
 * type GundamUnit = CardInstance<{
 *   damage: number;
 *   position: number;
 *   pairedPilot?: CardId;
 *   rested: boolean;
 * }>;
 * ```
 */
export type CardInstance<TCustomState = Record<string, never>> =
  CardInstanceBase & TCustomState;
```

---

## 4. Game State

### 4.1 Base Game State

```typescript
/**
 * Player - Player information for game setup
 */
export type Player = {
  /** Unique player identifier */
  id: string;
  /** Optional player name for display */
  name?: string;
};

/**
 * GameState - Base game state structure
 * 
 * All TCG games share these core properties.
 * Games extend with custom state via intersection.
 * 
 * @example
 * ```typescript
 * type LorcanaState = GameState & {
 *   phase: LorcanaPhase;  // Override with specific type
 *   lorcana: {
 *     lore: Record<PlayerId, number>;
 *     ink: { ... };
 *     characterStates: Record<CardId, CharacterState>;
 *   };
 * };
 * ```
 */
export type GameState = {
  /**
   * Players in the game
   */
  players: PlayerId[];

  /**
   * Current player index (into players array)
   */
  currentPlayerIndex: number;

  /**
   * Turn number (starts at 1)
   */
  turnNumber: number;

  /**
   * Current phase (game-specific)
   * 
   * Games override with specific phase types
   */
  phase: string;
};
```

**Addition:** Base `GameState` type
- **Rationale:**
  - Eliminates duplication across engines
  - Common structure for all TCGs
  - Games can override `phase` with specific types

---

## 5. Move System

### 5.1 Move Context

```typescript
/**
 * MoveContext - Context provided to move reducers and conditions
 * 
 * Contains all information needed to execute a move.
 * 
 * NO CHANGES from current implementation - already well-designed
 */
export type MoveContext = {
  playerId: PlayerId;
  sourceCardId?: CardId;
  targets?: string[][];
  data?: Record<string, unknown>;
  timestamp?: number;
  rng?: SeededRNG;
};
```

### 5.2 Move Definitions

```typescript
/**
 * NO CHANGES to move system - current implementation is solid
 * 
 * - MoveReducer<TGameState>
 * - MoveCondition<TGameState>
 * - MoveDefinition<TGameState>
 * - MoveResult<TGameState>
 * - MoveMap<TGameState>
 * - GameMoveDefinition<TState>
 * - GameMoveDefinitions<TState, TMoves>
 */
```

---

## 6. Flow System

```typescript
/**
 * NO CHANGES to flow system - comprehensive and well-designed
 * 
 * - FlowContext<TState>
 * - LifecycleHook<TState>
 * - EndCondition<TState>
 * - SegmentDefinition<TState>
 * - PhaseDefinition<TState>
 * - TurnDefinition<TState>
 * - FlowDefinition<TState>
 */
```

---

## 7. Targeting System

```typescript
/**
 * NO CHANGES to targeting system - complete and flexible
 * 
 * - TargetRestriction
 * - TargetCount
 * - TargetDefinition
 * - TargetContext<TCustomState>
 * - ValidationResult
 */
```

---

## 8. Game Definition

### 8.1 Game End Result

```typescript
/**
 * GameEndResult - Result when game ends
 * 
 * NO CHANGES - current implementation is good
 */
export type GameEndResult = {
  winner: string;
  reason: string;
  metadata?: Record<string, unknown>;
};
```

### 8.2 Game Definition

```typescript
/**
 * GameDefinition - Complete declarative game definition
 * 
 * NO CHANGES - current implementation is solid
 * 
 * Generic over:
 * - TState: Game state shape
 * - TMoves: Available moves
 */
export type GameDefinition<TState, TMoves extends Record<string, any>> = {
  name: string;
  setup: (players: Player[]) => TState;
  moves: GameMoveDefinitions<TState, TMoves>;
  flow?: FlowDefinition<TState>;
  endIf?: (state: TState) => GameEndResult | undefined;
  playerView?: (state: TState, playerId: string) => TState;
};
```

---

## Summary of Changes

### Breaking Changes

1. ✅ **Add `AbilityId` branded type** to core
2. ✅ **Add `ZoneState` utility type** to core
3. ✅ **Add base `GameState` type** to core
4. ✅ **Add zone state operations** (`addCardToTop`, `addCardToBottom`, `createZoneState`)
5. ✅ **Add optional metadata fields** to `CardDefinition` (rarity, setCode, cardNumber, imageUrl, text)

### No Changes

- Move system (already perfect)
- Flow system (already comprehensive)
- Targeting system (already complete)
- Game definition (already solid)

### Migration Required

- Lorcana must adopt core's branded types
- Lorcana must adopt core's zone visibility model
- Gundam must use core's base types (not yet implemented, so no migration)

---

## Extension Patterns

### Pattern 1: Extending Card Definitions

```typescript
// Core provides minimal base
import type { CardDefinition } from "@tcg/core";

// Game extends with intersection
export type LorcanaCard = CardDefinition & {
  inkwell: boolean;
  cost: number;
  lore?: number;
  strength?: number;
  willpower?: number;
  color: "amber" | "amethyst" | "emerald" | "ruby" | "sapphire" | "steel";
};
```

### Pattern 2: Extending Game State

```typescript
// Core provides base
import type { GameState, PlayerId, CardId } from "@tcg/core";

// Game extends with intersection, overrides phase
export type LorcanaPhase = "beginning" | "main" | "end";

export type LorcanaState = GameState & {
  phase: LorcanaPhase;  // Override with specific type
  lorcana: {
    // Game-specific state
    lore: Record<PlayerId, number>;
    ink: {
      available: Record<PlayerId, number>;
      total: Record<PlayerId, number>;
    };
    characterStates: Record<CardId, CharacterState>;
  };
};
```

### Pattern 3: Extending Card Instances

```typescript
// Core provides base
import type { CardInstance, CardId } from "@tcg/core";

// Game extends with custom state
export type CharacterState = {
  damage: number;
  exerted: boolean;
  playedThisTurn: boolean;
};

export type LorcanaCharacter = CardInstance<CharacterState>;
```

---

## Type Safety Guarantees

All types follow these guarantees:

1. **No `any` types** - Full type safety
2. **Strict null checks** - Optional properties clearly marked
3. **Branded types prevent ID mixing** - Compile-time safety
4. **Immutability** - All state types are readonly where appropriate
5. **Extension via intersection** - Games don't modify core types

---

## Validation Against Requirements

### ✅ Lorcana Requirements

- 5 zones: ✅ Core's zone system handles all
- Character drying: ✅ Via `CardInstance<{ playedThisTurn: boolean }>`
- Ink management: ✅ Via game state extension
- Lore tracking: ✅ Via game state extension
- Challenges: ✅ Via game state extension

### ✅ Gundam Requirements

- 7 zones: ✅ Core's zone system handles all
- Shield area: ✅ Via `ZoneState`
- Battle positions: ✅ Via game state extension
- Bases: ✅ Via `ZoneState` or game state
- Resources: ✅ Via game state extension
- Pilot pairing: ✅ Via `CardInstance<{ pairedPilot?: CardId }>`

---

## Next Steps

1. Update core type files with new types
2. Create migration guide for lorcana-engine
3. Create integration examples for both engines
4. Test type compatibility
5. Document patterns and best practices


