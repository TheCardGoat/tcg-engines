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
  BaseCardMeta,
  ExtendCardDefinition,
  ExtendCardFilter,
  ExtendCardMeta,
  ExtendGameState,
  ExtendPlayerState,
} from "~/game-engine/core-engine/types/game-specific-types";
import type {
  AlphaClashAffiliation,
  AlphaClashCardStatus,
  AlphaClashCardType,
  AlphaClashClashStep,
  AlphaClashColor,
  AlphaClashDamageType,
  AlphaClashExpansionStep,
  AlphaClashGamePhase,
  AlphaClashKeyword,
  AlphaClashPriorityWindow,
  AlphaClashRarity,
  AlphaClashSubtype,
  AlphaClashZoneType,
} from "./shared-types";

// Import card type - this should not create circular dependency now
import type { AlphaClashCard } from "./src/cards/definitions/cardTypes";

/**
 * Card metadata for Alpha Clash
 * This extends the BaseCardMeta from core-engine
 */
export type AlphaClashCardMeta = ExtendCardMeta<{
  // Card status (ready, engaged, face-up, face-down)
  status?: AlphaClashCardStatus;

  // Damage and damage type
  damage?: number;
  damageType?: AlphaClashDamageType;

  // Counters on the card
  counters?: Record<string, number>;

  // Attachment relationships
  attachments?: string[]; // Instance IDs of attached cards
  attachedTo?: string; // Instance ID of card this is attached to

  // Modifiers (buffs/debuffs)
  modifiers?: Array<{
    source: string;
    effect: string;
    duration?: string;
  }>;

  // Turn tracking
  playedThisTurn?: boolean;
  activatedThisTurn?: boolean;
  attackedThisTurn?: boolean;

  // Other game state flags
  canAttack?: boolean;
  canObstruct?: boolean;
  isSelected?: boolean;

  // For clashgrounds
  isActive?: boolean;
}>;

// Re-export shared types for backward compatibility
export type {
  AlphaClashAffiliation,
  AlphaClashCardStatus,
  AlphaClashCardType,
  AlphaClashClashStep,
  AlphaClashColor,
  AlphaClashDamageType,
  AlphaClashExpansionStep,
  AlphaClashGamePhase,
  AlphaClashKeyword,
  AlphaClashPriorityWindow,
  AlphaClashRarity,
  AlphaClashSubtype,
  AlphaClashZoneType,
} from "./shared-types";

/**
 * Game-specific player state extending the base player state
 */
export type AlphaClashPlayerState = ExtendPlayerState<{
  // Contender health
  contenderHealth?: number;

  // Turn history for game logs
  turnHistory: string[];

  // Resources available this turn
  availableResources?: number;

  // Clash buffs used this clash
  clashBuffsUsed?: number;

  // Cards selected for champion selection (if applicable)
  selectedChampion?: string;

  // Priority windows where player can act
  hasPriority?: boolean;
}>;

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
