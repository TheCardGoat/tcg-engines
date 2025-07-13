/**
 * # Lorcana TCG Generic Type Definitions
 *
 * This module defines the game-specific types for Lorcana TCG that extend
 * the CoreEngine's generic type system with Lorcana-specific properties.
 */

import type { LorcanitoCard } from "@lorcanito/lorcana-engine";
import type {
  ExtendCardDefinition,
  ExtendCardFilter,
  ExtendGameState,
  ExtendPlayerState,
} from "~/game-engine/core-engine/types/game-specific-types";

/**
 * Lorcana-specific player state extending the base player state
 */
export type LorcanaPlayerState = ExtendPlayerState<
  {
    lore: number;
    ink: number;
    questProgress: Record<string, number>;
  },
  PlayerTurnHistory
>;

export interface PlayerTurnHistory {
  turnNumber: number;
  playedCards: string[];
  inkwell: string[];
  challenged: string[];
  quested: string[];
}

/**
 * Lorcana-specific game state extending the base game state
 */
export type LorcanaGameState = ExtendGameState<{
  effects: LayerItem[];
  bag: LayerItem[];
}>;

/**
 * Lorcana-specific card definition extending the base card definition
 */
export type LorcanaCardDefinition = ExtendCardDefinition<
  LorcanitoCard & {
    inkwell?: boolean;
    name: string;
  }
>;

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
  attachedTo?: string; // instanceId of card this is attached to

  // Turn/timing filtering
  playedThisTurn?: boolean;
  questedThisTurn?: boolean;
  challengedThisTurn?: boolean;

  // Collection filtering
  set?: string;
  rarity?:
    | "common"
    | "uncommon"
    | "rare"
    | "super_rare"
    | "legendary"
    | "enchanted";

  // Text search
  nameContains?: string;
  textContains?: string;
}>;

// Lorcana-specific types
export type Zone = "deck" | "hand" | "play" | "inkwell" | "discard" | "bag";

export type LayerItem = {
  id: string;
  sourceCardId: string;
  controllerId: string;
  ability: Ability;
  targets: Target[];
  timestamp: number;
  optional: boolean;
};

export type Ability = {
  id: string;
  type: "activated" | "triggered" | "static" | "keyword";
  text: string;
  cost?: AbilityCost;
  effect: Effect;
  timing?: TriggerTiming;
};

export type Duration =
  | { type: "endOfTurn" }
  | { type: "untilLeaves" }
  | { type: "turns"; count: number }
  | { type: "permanent" };

export type AbilityCost = {
  exert?: boolean;
  ink?: number;
  banish?: boolean;
  discard?: number;
  damage?: number;
};

export type Effect = {
  type: string;
  parameters: Record<string, any>;
};

export type Target = {
  type: "card" | "player";
  id: string;
};

export type TriggerTiming =
  | "onPlay"
  | "onQuest"
  | "onChallenge"
  | "onBanish"
  | "onDamage"
  | "onMove"
  | "startOfTurn"
  | "endOfTurn";

/**
 * Type validation helpers for runtime type checking
 */
export const isLorcanaCardFilter = (
  filter: any,
): filter is LorcanaCardFilter => {
  if (!filter || typeof filter !== "object") return false;

  // Check if it has any Lorcana-specific properties
  const lorcanaProperties = [
    "cost",
    "ink",
    "inkable",
    "strength",
    "willpower",
    "lore",
    "exerted",
    "damaged",
    "banished",
    "cardType",
    "hasKeyword",
    "abilities",
    "canQuest",
    "canChallenge",
    "canSing",
    "canBePlayed",
    "moveCost",
    "canTarget",
    "attachedTo",
    "playedThisTurn",
    "questedThisTurn",
    "challengedThisTurn",
    "set",
    "rarity",
    "nameContains",
    "textContains",
  ];

  return lorcanaProperties.some((prop) => filter[prop] !== undefined);
};

export const isLorcanaPlayerState = (
  state: any,
): state is LorcanaPlayerState => {
  if (!state || typeof state !== "object") return false;

  return (
    typeof state.id === "string" &&
    typeof state.name === "string" &&
    typeof state.lore === "number" &&
    typeof state.ink === "number"
  );
};
