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
  ExtendGameState,
  ExtendPlayerState,
} from "~/game-engine/core-engine/types/game-specific-types";
import type { LayerItem } from "~/game-engine/engines/lorcana/src/abilities/ability-types";

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

/**
 * Legacy card definition type - kept for backward compatibility
 */
export type LorcanaCardDefinition = LorcanitoCard;

/**
 * Enhanced card definition extending the base card definition
 */
export type LorcanaCardDefinitionExtended = ExtendCardDefinition<
  LorcanitoCard & {
    inkwell?: boolean;
    name: string;
  }
>;

export type LorcanaCardMeta = {
  exerted?: boolean | null;
  playedThisTurn?: boolean | null;
  damage?: number | null;
  shifter?: string | null;
  shifted?: string | null;
  revealed?: boolean | null;
  location?: string | null;
  characters?: string[] | null;
};

/**
 * Lorcana-specific card filter extending the base card filter
 */
export type LorcanaCardFilter = ExtendCardFilter<{
  // Cost filtering
  cost?: {
    min?: number;
    max?: number;
    exact?: number;
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
 */
export type LorcanaGameState = {
  effects: LayerItem[];
  bag: LayerItem[];
  metas: Record<InstanceId, LorcanaCardMeta>;
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
 */
export type LorcanaGameStateExtended = ExtendGameState<{
  effects: LayerItem[];
  bag: LayerItem[];
  metas: Record<InstanceId, LorcanaCardMeta>;
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
