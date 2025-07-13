/**
 * # Gundam TCG Generic Type Definitions
 *
 * This module defines the game-specific types for Gundam TCG that extend
 * the CoreEngine's generic type system with Gundam-specific properties.
 */

import type {
  ExtendCardDefinition,
  ExtendCardFilter,
  ExtendGameState,
  ExtendPlayerState,
} from "~/game-engine/core-engine/types/game-specific-types";
import type { GundamitoCard } from "./cards/definitions/cardTypes";

/**
 * Gundam-specific player state extending the base player state
 */
export type GundamPlayerState = ExtendPlayerState<{
  turnHistory: string[];
  zones: {
    deck: string[];
    resourceDeck: string[];
    resourceArea: string[];
    battleArea: string[];
    shieldBase: string[];
    shieldSection: string[];
    removalArea: string[];
    hand: string[];
    trash: string[];
    sideboard: string[];
  };
}>;

/**
 * Gundam-specific game state extending the base game state
 */
export type GundamGameState = ExtendGameState<{
  gameId?: string;
  matchId?: string;
  numPlayers?: number;
  winner?: string;
  choosingFirstPlayer?: string;
  firstPlayer?: string;
  createdAt?: number;
  randomSeed?: string;
  manualMode?: boolean;
  turn?: string;
  priority?: string;
  phase?: GamePhase;
  players?: Record<string, GundamPlayerState>;
  actionHistory?: string[];
}>;

/**
 * Gundam-specific card definition extending the base card definition
 */
export type GundamCardDefinition = ExtendCardDefinition<GundamitoCard>;

/**
 * Gundam-specific card filter extending the base card filter
 */
export type GundamCardFilter = ExtendCardFilter<{
  // Card type filtering
  cardType?: "Unit" | "Pilot" | "Command" | "Base" | "Resource";

  // Color filtering
  color?: "blue" | "green" | "red" | "white";

  // Cost filtering
  cost?: {
    min?: number;
    max?: number;
    exact?: number;
  };

  // Zone-specific filtering
  deploymentZone?: "battleArea" | "resourceArea" | "shieldBase";

  // Game state filtering
  canDeploy?: boolean;
  isPaired?: boolean;
  isExerted?: boolean;

  // Stat filtering (for Units/Pilots)
  attack?: {
    min?: number;
    max?: number;
    exact?: number;
  };

  defense?: {
    min?: number;
    max?: number;
    exact?: number;
  };

  // Keywords/abilities
  hasKeyword?: string[];
  hasAbility?: string[];

  // Relationship filtering
  canPairWith?: string; // instanceId of potential pair target
  pairedWith?: string; // instanceId of current pair

  // Turn/timing filtering
  playableThisTurn?: boolean;
  activatedThisTurn?: boolean;
}>;

// Game-specific enums and types
export type GamePhase =
  | "startPhase"
  | "drawPhase"
  | "resourcePhase"
  | "mainPhase"
  | "endPhase";

export type ZoneType =
  | "deck"
  | "resourceDeck"
  | "resourceArea"
  | "battleArea"
  | "shieldBase"
  | "shieldSection"
  | "removalArea"
  | "hand"
  | "trash"
  | "sideboard";

export type CardType = "Unit" | "Pilot" | "Command" | "Base" | "Resource";

export type CardColor = "blue" | "green" | "red" | "white";

/**
 * Type validation helpers for runtime type checking
 */
export const isGundamCardFilter = (filter: any): filter is GundamCardFilter => {
  if (!filter || typeof filter !== "object") return false;

  // Check if it has any Gundam-specific properties
  const gundamProperties = [
    "cardType",
    "color",
    "cost",
    "deploymentZone",
    "canDeploy",
    "isPaired",
    "isExerted",
    "attack",
    "defense",
    "hasKeyword",
    "hasAbility",
    "canPairWith",
    "pairedWith",
    "playableThisTurn",
    "activatedThisTurn",
  ];

  return gundamProperties.some((prop) => filter[prop] !== undefined);
};

export const isGundamPlayerState = (state: any): state is GundamPlayerState => {
  if (!state || typeof state !== "object") return false;

  return (
    typeof state.id === "string" &&
    typeof state.name === "string" &&
    Array.isArray(state.turnHistory) &&
    state.zones &&
    typeof state.zones === "object"
  );
};
