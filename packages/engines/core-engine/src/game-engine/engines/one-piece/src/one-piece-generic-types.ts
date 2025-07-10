/**
 * Generic type definitions that extend the core engine for One Piece TCG
 * These types integrate with the CoreEngine framework
 */

import type { Move } from "~/game-engine/core-engine/move/move-types";
import type {
  CardAttribute,
  CardCategory,
  CardColor,
  CardInstanceState,
  CardRarity,
  CardState,
  DefeatCondition,
  OnePieceGameState as EngineGameState,
  PlayerState as EnginePlayerState,
  GamePhase,
  GameSegment,
  MoveResult,
  ZoneType,
} from "./one-piece-engine-types";

// Re-export core types for convenience
export type {
  ZoneType,
  GamePhase,
  GameSegment,
  CardCategory,
  CardColor,
  CardAttribute,
  CardRarity,
  CardState,
  DefeatCondition,
  CardInstanceState,
  MoveResult,
};

// Move types specific to One Piece gameplay
export type OnePieceMoveType =
  // Pre-game moves
  | "chooseFirstPlayer"
  | "mulligan"

  // Turn management
  | "startTurn"
  | "endTurn"
  | "passPriority"

  // DON!! management
  | "placeDon"
  | "giveDon"
  | "returnDon"

  // Card play moves
  | "playCharacter"
  | "playStage"
  | "activateEvent"

  // Battle moves
  | "declareAttack"
  | "declareBlock"
  | "activateCounter"
  | "resolveBattle"

  // Effect moves
  | "activateEffect"
  | "activateTrigger"

  // Utility moves
  | "drawCard"
  | "discardCard"
  | "trashCard"
  | "restCard"
  | "setActive"
  | "concede";

// Move parameter types for type safety
export interface OnePieceMoveParams {
  chooseFirstPlayer: { playerId: string };
  mulligan: { redraw: boolean };

  startTurn: {};
  endTurn: {};
  passPriority: {};

  placeDon: { count: number };
  giveDon: { donInstanceId: string; targetInstanceId: string };
  returnDon: { donInstanceIds: string[] };

  playCharacter: {
    instanceId: string;
    position?: number;
    targets?: string[];
  };
  playStage: {
    instanceId: string;
    replaceExisting?: boolean;
  };
  activateEvent: {
    instanceId: string;
    targets?: string[];
  };

  declareAttack: {
    attackerInstanceId: string;
    targetInstanceId?: string; // undefined for leader attack
  };
  declareBlock: {
    blockerInstanceId: string;
    attackerInstanceId: string;
  };
  activateCounter: {
    instanceId: string;
    counterValue: number;
  };
  resolveBattle: {};

  activateEffect: {
    instanceId: string;
    effectIndex: number;
    targets?: string[];
  };
  activateTrigger: {
    instanceId: string;
    activate: boolean;
  };

  drawCard: { count: number };
  discardCard: { instanceIds: string[] };
  trashCard: { instanceIds: string[] };
  restCard: { instanceIds: string[] };
  setActive: { instanceIds: string[] };
  concede: {};
}

// Type for move functions in the engine
export type OnePieceMove = Move<OnePieceGameState>;

// Collection of all moves available in the engine
export type OnePieceMoves = Record<OnePieceMoveType, OnePieceMove>;

// Re-export main types from engine-types to avoid conflicts
export type OnePieceGameState = EngineGameState;
export type OnePiecePlayerState = EnginePlayerState;

// Re-export card types for convenience
export type { OnePieceCard } from "./cards/definitions/cardTypes";

// Card filter type for game-specific filtering
export interface OnePieceCardFilter {
  // Basic filters
  id?: string;
  name?: string;
  category?: CardCategory;
  colors?: CardColor[];
  cost?: {
    min?: number;
    max?: number;
    exact?: number;
  };

  // Zone filters
  zone?: ZoneType;
  owner?: string;

  // Gameplay filters
  canPlay?: boolean;
  isRested?: boolean;
  hasAttacked?: boolean;

  // Attribute filters (for Leaders and Characters)
  attribute?: CardAttribute;

  // Power filters (for Leaders and Characters)
  power?: {
    min?: number;
    max?: number;
    exact?: number;
  };

  // Life filters (for Leaders)
  life?: {
    min?: number;
    max?: number;
    exact?: number;
  };

  // Counter filters (for Characters and Events)
  counter?: {
    min?: number;
    max?: number;
    exact?: number;
  };

  // Text/keyword filters
  hasKeyword?: string[];
  hasType?: string[];
  textContains?: string;

  // Implementation filter
  implemented?: boolean;
}

// Additional type aliases for convenience
export type { OnePieceMoveType as MoveType };
export type { OnePieceMoveParams as MoveParams };
export type { OnePieceMoves as Moves };

// Game-specific validation helpers
export const isValidZone = (zone: string): zone is ZoneType => {
  const validZones: ZoneType[] = [
    "deck",
    "hand",
    "donDeck",
    "costArea",
    "lifeArea",
    "trash",
    "leaderArea",
    "characterArea",
    "stageArea",
  ];
  return validZones.includes(zone as ZoneType);
};

export const isValidCardCategory = (
  category: string,
): category is CardCategory => {
  const validCategories: CardCategory[] = [
    "leader",
    "character",
    "event",
    "stage",
    "don",
  ];
  return validCategories.includes(category as CardCategory);
};

export const isValidColor = (color: string): color is CardColor => {
  const validColors: CardColor[] = [
    "red",
    "green",
    "blue",
    "purple",
    "black",
    "yellow",
  ];
  return validColors.includes(color as CardColor);
};

export const isValidAttribute = (
  attribute: string,
): attribute is CardAttribute => {
  const validAttributes: CardAttribute[] = [
    "slash",
    "strike",
    "ranged",
    "special",
    "wisdom",
  ];
  return validAttributes.includes(attribute as CardAttribute);
};

// Zone capacity validation
export const getZoneCapacity = (zone: ZoneType): number | null => {
  switch (zone) {
    case "characterArea":
      return 5; // Max 5 Character cards
    case "stageArea":
      return 1; // Max 1 Stage card
    case "leaderArea":
      return 1; // Exactly 1 Leader card
    case "donDeck":
      return 10; // Exactly 10 DON!! cards
    case "deck":
      return 50; // Exactly 50 cards
    default:
      return null; // No limit
  }
};

// Zone visibility helpers
export const getZoneVisibility = (
  zone: ZoneType,
): "public" | "private" | "secret" => {
  switch (zone) {
    case "hand":
      return "private"; // Only owner can see
    case "deck":
    case "donDeck":
      return "secret"; // No one can see order/contents
    case "lifeArea":
      return "secret"; // Face-down, no one can see
    default:
      return "public"; // Everyone can see
  }
};

// Zone ordering helpers
export const isZoneOrdered = (zone: ZoneType): boolean => {
  return zone === "deck" || zone === "donDeck" || zone === "lifeArea";
};
