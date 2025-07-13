/**
 * Type definitions for Alpha Clash TCG engine
 *
 * Alpha Clash is a 2+ player TCG with:
 * - 5 colors: white, blue, black, red, green
 * - 9 zones: Contender, Clash, Clashground, Accessory, Resource, Oblivion, Standby, hand, deck
 * - 5 card types: Contender, Clash, Accessory, Action, Clashground
 * - 6-step clash phase system
 */

import type {
  ExtendCardDefinition,
  ExtendCardFilter,
  ExtendGameState,
  ExtendPlayerState,
} from "~/game-engine/core-engine/types/game-specific-types";
import type { AlphaClashCard } from "./src/cards/definitions/cardTypes";

export type PlayerTurnHistory = {};

/**
 * Alpha Clash game zones
 */
export type AlphaClashZoneType =
  | "deck"
  | "hand"
  | "contender"
  | "clash"
  | "clashground"
  | "accessory"
  | "resource"
  | "oblivion"
  | "standby";

/**
 * Alpha Clash card types
 */
export type AlphaClashCardType =
  | "contender"
  | "clash"
  | "accessory"
  | "action"
  | "clashground";

/**
 * Alpha Clash card subtypes
 */
export type AlphaClashSubtype =
  | "trap"
  | "weapon"
  | "basic"
  | "quick"
  | "clash-buff";

/**
 * Alpha Clash colors
 */
export type AlphaClashColor =
  | "white"
  | "blue"
  | "black"
  | "red"
  | "green"
  | "colorless";

/**
 * Alpha Clash affiliations
 */
export type AlphaClashAffiliation =
  | "alpha"
  | "alpha-hunter"
  | "rogue"
  | "discarded"
  | "harbinger"
  | "progenitor";

/**
 * Alpha Clash card rarities
 */
export type AlphaClashRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "mythic"
  | "legendary";

/**
 * Alpha Clash card status
 */
export type AlphaClashCardStatus =
  | "ready"
  | "engaged"
  | "face-up"
  | "face-down";

/**
 * Alpha Clash game phases
 */
export type AlphaClashGamePhase =
  | "startOfTurn"
  | "expansion"
  | "primary"
  | "clash"
  | "endOfTurn";

/**
 * Alpha Clash expansion phase steps
 */
export type AlphaClashExpansionStep = "ready" | "draw" | "resource";

/**
 * Alpha Clash clash phase steps
 */
export type AlphaClashClashStep =
  | "attack"
  | "counter"
  | "obstruct"
  | "attackerClashBuff"
  | "defenderClashBuff"
  | "damage";

/**
 * Alpha Clash priority window types
 */
export type AlphaClashPriorityWindow =
  | "counter-play"
  | "counter-attack"
  | "counter-trap";

/**
 * Alpha Clash damage types
 */
export type AlphaClashDamageType = "clash" | "non-clash";

/**
 * Alpha Clash keyword abilities
 */
export type AlphaClashKeyword =
  | "awe-factor"
  | "barrage"
  | "breakthrough"
  | "close-combat"
  | "enrage"
  | "flight"
  | "interception"
  | "necrotic"
  | "superspeed"
  | "undisputed"
  | "unrivaled";

/**
 * Game-specific player state extending the base player state
 */
export type AlphaClashPlayerState = ExtendPlayerState<
  {
    // Contender health
    contenderHealth?: number;

    // Resources available this turn
    availableResources?: number;

    // Clash buffs used this clash
    clashBuffsUsed?: number;

    // Cards selected for champion selection (if applicable)
    selectedChampion?: string;

    // Priority windows where player can act
    hasPriority?: boolean;
  },
  PlayerTurnHistory
>;

/**
 * Game-specific game state extending the base game state
 */
export type AlphaClashGameState = ExtendGameState<{
  // Current game segment
  currentSegment?: string;

  // Current game phase
  currentPhase?: AlphaClashGamePhase;

  // Players state
  players?: Record<string, AlphaClashPlayerState>;

  // Current expansion step (during expansion phase)
  currentExpansionStep?: AlphaClashExpansionStep;

  // Current clash step (during clash phase)
  currentClashStep?: AlphaClashClashStep;

  // Game end state
  gameEnded?: boolean;
  winner?: string;

  // Active clashground card
  activeClashground?: string;

  // Current clash state
  clashState?: {
    attackers: string[];
    defenders: string[];
    obstructors: Record<string, string>; // attacker -> obstructor
    clashBuffs: {
      attacker?: string;
      defender?: string;
    };
    damage: Record<string, number>; // card -> damage
  };

  // Priority state
  priorityState?: {
    window: AlphaClashPriorityWindow;
    activePlayer: string;
    passedPlayers: Set<string>;
  };

  // Effects stack for resolution
  effectsStack?: Array<{
    id: string;
    effect: any;
    source: string;
    targets?: string[];
  }>;

  // First player decision
  firstPlayerChosen?: boolean;
}>;

/**
 * Game-specific card definition extending the base card definition
 */
export type AlphaClashCardDefinition = ExtendCardDefinition<AlphaClashCard>;

/**
 * Comprehensive card filtering system
 */
export type AlphaClashCardFilter = ExtendCardFilter<{
  // Card type filtering
  cardType?: AlphaClashCardType;
  subtype?: AlphaClashSubtype;

  // Color filtering
  color?: AlphaClashColor[];

  // Cost filtering
  cost?: {
    min?: number;
    max?: number;
    exact?: number;
  };

  // Zone-specific filtering
  zone?: AlphaClashZoneType;

  // Status filtering
  status?: AlphaClashCardStatus;
  isReady?: boolean;
  isEngaged?: boolean;
  isFaceUp?: boolean;
  isFaceDown?: boolean;

  // Stat filtering
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

  health?: {
    min?: number;
    max?: number;
    exact?: number;
  };

  // Keywords/abilities
  hasKeyword?: AlphaClashKeyword[];
  hasAbility?: string[];

  // Affiliation filtering
  affiliation?: AlphaClashAffiliation[];

  // Rarity filtering
  rarity?: AlphaClashRarity[];

  // Turn/timing filtering
  canPlay?: boolean;
  canActivate?: boolean;
  canAttack?: boolean;
  canObstruct?: boolean;

  // Set filtering
  set?: string[];

  // Ownership filtering
  owner?: string;
  controller?: string;

  // Damage filtering
  hasDamage?: boolean;
  damageType?: AlphaClashDamageType;
}>;

/**
 * Runtime type validation helpers
 */
export const isAlphaClashCardFilter = (
  filter: any,
): filter is AlphaClashCardFilter => {
  if (!filter || typeof filter !== "object") return false;

  const alphaClashProperties = [
    "cardType",
    "subtype",
    "color",
    "cost",
    "zone",
    "status",
    "attack",
    "defense",
    "health",
    "hasKeyword",
    "affiliation",
    "rarity",
    "canPlay",
    "canActivate",
    "canAttack",
    "canObstruct",
    "set",
    "owner",
    "controller",
    "hasDamage",
    "damageType",
  ];

  return alphaClashProperties.some((prop) => filter[prop] !== undefined);
};

export const isAlphaClashPlayerState = (
  state: any,
): state is AlphaClashPlayerState => {
  if (!state || typeof state !== "object") return false;

  return (
    typeof state.id === "string" &&
    typeof state.name === "string" &&
    state.zones &&
    typeof state.zones === "object" &&
    Array.isArray(state.turnHistory)
  );
};

export const isAlphaClashGameState = (
  state: any,
): state is AlphaClashGameState => {
  if (!state || typeof state !== "object") return false;

  return (
    typeof state === "object" &&
    (state.currentPhase === undefined || typeof state.currentPhase === "string")
  );
};

/**
 * Helper type for card instances with game state
 */
export type AlphaClashCardInstance = {
  instanceId: string;
  definition: AlphaClashCardDefinition;
  zone: AlphaClashZoneType;
  owner: string;
  controller: string;
  status: AlphaClashCardStatus;
  damage?: number;
  damageType?: AlphaClashDamageType;
  counters?: Map<string, number>;
  attachments?: string[];
};

/**
 * Legacy types for backward compatibility
 */
export type GameState = AlphaClashGameState;
export type ZoneType = AlphaClashZoneType;
export type CardType = AlphaClashCardType;
