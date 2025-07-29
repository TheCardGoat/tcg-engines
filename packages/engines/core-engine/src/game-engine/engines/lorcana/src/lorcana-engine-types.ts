/**
 * # Lorcana TCG Type Definitions
 *
 * This module defines all game-specific types for Lorcana TCG, including
 * both legacy direct type definitions and new CoreEngine-extended types.
 */

import type { LorcanitoCard } from "@lorcanito/lorcana-engine";
import type {
  ExtendCardDefinition,
  ExtendCardFilter,
  ExtendCardMeta,
  ExtendGameState,
  ExtendPlayerState,
} from "~/game-engine/core-engine/types/game-specific-types";
import type {
  DynamicValue,
  LayerItem,
  LorcanaAbility,
} from "~/game-engine/engines/lorcana/src/abilities/ability-types";

// Re-export builder types and class for convenience
export type {
  LorcanaCardFilterExtended,
  NumericComparison,
  NumericRange,
  StringComparison,
} from "./cards/lorcana-card-filter-builder";
export { LorcanaCardFilterBuilder } from "./cards/lorcana-card-filter-builder";

// =============================================================================
// PLAYER STATE TYPES
// =============================================================================

/**
 * Lorcana-specific player state extending the base player state
 */
export type LorcanaPlayerState = ExtendPlayerState<{
  lore: number;
  ink: number;
  questProgress: Record<string, number>;
  turnHistory?: PlayerTurnHistory[];
}>;

export interface PlayerTurnHistory {
  turnNumber: number;
  playedCards: string[];
  inkwell: string[];
  challenged: string[];
  quested: string[];
}

// =============================================================================
// CARD TYPES
// =============================================================================

// TODO: Remove this once we have redefined card abilities
export type LorcanaCardDefinition = LorcanitoCard & {
  abilities?: LorcanaAbility[];
};

/**
 * Enhanced card definition extending the base card definition
 */
export type LorcanaCardDefinitionExtended = ExtendCardDefinition<
  LorcanitoCard & {
    inkwell?: boolean;
    name: string;
  }
>;

/**
 * Lorcana-specific card metadata extending the base card metadata
 */
export type LorcanaCardMeta = ExtendCardMeta<{
  exerted?: boolean | null;
  playedThisTurn?: boolean | null;
  damage?: number | null;
  shifter?: string | null;
  shifted?: string | null;
  revealed?: boolean | null;
  location?: string | null;
  characters?: string[] | null;
}>;

/**
 * Lorcana-specific card filter extending the base card filter
 */
export type LorcanaCardFilter = ExtendCardFilter<{
  // Cost filtering
  cost?: {
    min?: number | DynamicValue;
    max?: number | DynamicValue;
    exact?: number | DynamicValue;
  };

  // Ink filtering
  ink?: string[]; // Array of ink colors
  inkable?: boolean; // Can be used as ink

  // Character-specific filtering
  strength?: {
    min?: number;
    max?: number;
    exact?: number;
  };

  willpower?: {
    min?: number;
    max?: number;
    exact?: number;
  };

  lore?: {
    min?: number;
    max?: number;
    exact?: number;
  };

  // Card state filtering
  exerted?: boolean;
  damaged?: boolean;
  banished?: boolean;

  // Card type filtering
  cardType?: "character" | "action" | "item" | "location";

  // Keyword filtering
  hasKeyword?: string[];
  abilities?: string[]; // Filter by ability text/type

  // Game state filtering
  canQuest?: boolean;
  canChallenge?: boolean;
  canSing?: boolean;
  canBePlayed?: boolean;

  // Location-specific
  moveCost?: {
    min?: number;
    max?: number;
    exact?: number;
  };

  // Relationship filtering
  canTarget?: string; // instanceId of potential target

  // Turn/timing filtering
  playedThisTurn?: boolean;
  questedThisTurn?: boolean;
  challengedThisTurn?: boolean;

  // Text search
  nameContains?: string;
  textContains?: string;
}>;

// =============================================================================
// GAME STATE TYPES
// =============================================================================

/**
 * Main Lorcana game state with all game-specific properties
 * Note: Card metadata is now stored in ctx.cardMetas instead of G.metas
 */
export type LorcanaGameState = {
  effects: LayerItem[];
  bag: LayerItem[];
  turnActions?: {
    putCardIntoInkwell?: boolean;
    // Add other turn-limited actions as needed
  };
  triggerEvents?: Array<{
    type: string;
    timing: string;
    locationId?: string;
    characterId?: string;
    timestamp: number;
  }>;
  passTurnRequested?: boolean; // Flag to trigger mainPhase end
};

/**
 * Extended game state using CoreEngine's extension pattern
 * Note: Card metadata is now stored in ctx.cardMetas instead of G.metas
 */
export type LorcanaGameStateExtended = ExtendGameState<{
  effects: LayerItem[];
  bag: LayerItem[];
  turnActions?: {
    putCardIntoInkwell?: boolean;
  };
  triggerEvents?: Array<{
    type: string;
    timing: string;
    locationId?: string;
    characterId?: string;
    timestamp: number;
  }>;
  passTurnRequested?: boolean;
}>;

// =============================================================================
// GAME MECHANICS TYPES
// =============================================================================

export type LorcanaZone =
  | "deck"
  | "hand"
  | "play"
  | "inkwell"
  | "discard"
  | "bag";

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type PlayerId = string;
export type InstanceId = string;
export type PublicId = string;
export type GameCards = Record<PlayerId, Record<InstanceId, PublicId>>;
