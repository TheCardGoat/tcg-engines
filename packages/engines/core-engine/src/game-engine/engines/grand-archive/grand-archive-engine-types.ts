/**
 * Grand Archive Engine Type Definitions
 *
 * Comprehensive type system for Grand Archive TCG implementation
 * Based on Grand Archive Comprehensive Rules v1.1.3
 */

import type {
  ExtendCardDefinition,
  ExtendCardFilter,
  ExtendGameState,
  ExtendPlayerState,
} from "~/game-engine/core-engine/types/game-specific-types";

// =============================================================================
// Game-Specific Enums and Basic Types
// =============================================================================

/**
 * All Grand Archive game zones
 */
export type GrandArchiveZoneType =
  // Private zones
  | "hand"
  | "memory"
  | "mainDeck"
  | "materialDeck"
  // Public zones
  | "field"
  | "graveyard"
  | "banishment"
  | "effectsStack"
  | "intent"
  // Object-specific zones
  | "innerLineage"
  | "loadedCards";

/**
 * Grand Archive card types
 */
export type GrandArchiveCardType =
  | "champion"
  | "ally"
  | "action"
  | "attack"
  | "item"
  | "weapon"
  | "domain"
  | "phantasia";

/**
 * Grand Archive supertypes
 */
export type GrandArchiveSupertype = "unique" | "regalia";

/**
 * Grand Archive elements
 */
export type GrandArchiveElement =
  // Special
  | "norm"
  // Basic elements
  | "fire"
  | "water"
  | "wind"
  // Advanced elements
  | "arcane"
  | "astracrux"
  | "exia"
  | "luxem"
  | "neos"
  | "tera"
  | "umbra";

/**
 * Card speed types
 */
export type GrandArchiveSpeed = "fast" | "slow";

/**
 * Game phases within turns
 */
export type GrandArchiveGamePhase =
  | "wakeUpPhase"
  | "materializePhase"
  | "recollectionPhase"
  | "drawPhase"
  | "mainPhase"
  | "endPhase"
  | "combatPhase";

/**
 * Game segments (major game flow divisions)
 */
export type GrandArchiveGameSegment =
  | "startingAGame"
  | "duringGame"
  | "endGame";

/**
 * Combat phases
 */
export type GrandArchiveCombatPhase =
  | "attackDeclaration"
  | "retaliationStep"
  | "damageStep"
  | "endOfCombat";

/**
 * Counter types in Grand Archive
 */
export type GrandArchiveCounterType =
  | "damage" // Permanent damage on champions
  | "buff" // +1/+1 counters
  | "debuff" // -1/-1 counters
  | "durability" // Weapon/siegeable durability
  | "enlighten" // Draw card counters
  | "level" // Additional champion levels
  | "wither" // Requires payment or sacrifice
  | "preparation"; // Used for Prepare keyword

/**
 * Object states in Grand Archive
 */
export type GrandArchiveObjectState =
  | "awake"
  | "rested"
  | "attacking"
  | "defending"
  | "retaliating"
  | "damaged"
  | "undamaged"
  | "intercepting"
  | "distant"
  | "fostered"
  | "loaded"
  | "transformed";

/**
 * Ability types
 */
export type GrandArchiveAbilityType =
  | "triggered"
  | "activated"
  | "static"
  | "keyword"
  | "restriction";

// =============================================================================
// Extended Core Types
// =============================================================================

/**
 * Grand Archive specific player state extensions
 */
export type GrandArchivePlayerState = ExtendPlayerState<{
  // Champion management
  championLineage: string[]; // Stack of champion cards (bottom to top)
  championLevel: number; // Current effective level
  championDamage: number; // Damage counters on champion

  // Element availability
  availableElements: Set<GrandArchiveElement>;

  // Turn state
  hasMaterialized: boolean; // One materialization per turn
  turnActions: string[]; // Actions taken this turn

  // Counters on champion
  counters: Record<GrandArchiveCounterType, number>;

  // Game state tracking
  influence: number; // Hand + Memory card count
  turnHistory: string[]; // Historical record of actions

  // Player metadata
  isActive?: boolean;
  joinedAt?: number;
}>;

/**
 * Grand Archive specific game state extensions
 */
export type GrandArchiveGameState = ExtendGameState<{
  // Game phase and priority management
  currentPhase?: string;
  passedPlayers?: Set<string>;
  opportunityPlayer?: string;

  // Game metadata
  currentSegment?: string;
  winner?: string;
  gameEndReason?: string;
  gameEndTime?: number;
  startTime?: number;

  // Combat state
  combatState?: {
    attackers: string[]; // Attacking unit IDs
    blockers: Map<string, string>; // attacker -> blocker mapping
    combatDamage: Map<string, number>; // unit -> damage mapping
    weaponsUsed: string[]; // weapons used this combat
  };

  // Combat phase tracking (separate from combatState)
  combatPhase?: "attackDeclaration" | "blockDeclaration" | "damageResolution";

  // Effects Stack (FILO)
  effectsStack: Array<{
    id: string;
    type: "activation" | "materialization" | "trigger";
    cardId: string;
    playerId: string;
    modes?: Record<string, any>;
    targets?: string[];
    timestamp: number;
  }>;

  // Master tracking
  mastery?: {
    type: string;
    owner: string;
    state?: Record<string, any>;
  };
}>;

/**
 * Grand Archive card definition extension
 */
export type GrandArchiveCardDefinition = ExtendCardDefinition<{
  // Basic card properties
  id: string;
  name: string;
  type: GrandArchiveCardType;
  element: GrandArchiveElement;
  set: string;
  number: number;
  rarity: "common" | "uncommon" | "rare" | "super-rare" | "signature-rare";

  // Costs
  reserveCost?: number; // Main deck cards
  memoryCost?: number; // Material deck cards

  // Supertypes and subtypes
  supertypes?: GrandArchiveSupertype[];
  subtypes?: string[];

  // Speed (for actions)
  speed?: GrandArchiveSpeed;

  // Stats
  power?: number; // Attack power
  life?: number; // Life points
  durability?: number; // Weapon/domain durability
  level?: number; // Champion level

  // Text and abilities
  text?: string;
  abilities?: Array<{
    type: GrandArchiveAbilityType;
    cost?: string;
    effect: string;
    timing?: string;
    restrictions?: string[];
  }>;

  // Keywords
  keywords?: string[];

  // Special properties
  championClass?: string[]; // For champions
  domainIdentity?: GrandArchiveElement[]; // For legend cards
  pointValue?: number; // For battlefields
  isChampion?: boolean; // Special champion variants
  isBasic?: boolean; // Basic runes

  // Metadata
  flavorText?: string;
  artist?: string;
  implemented: boolean;
}>;

/**
 * Comprehensive card filtering system for Grand Archive
 */
export type GrandArchiveCardFilter = ExtendCardFilter<{
  // Basic filtering
  cardType?: GrandArchiveCardType;
  element?: GrandArchiveElement;
  supertype?: GrandArchiveSupertype;
  subtypes?: string[];

  // Cost filtering
  reserveCost?: {
    min?: number;
    max?: number;
    exact?: number;
  };
  memoryCost?: {
    min?: number;
    max?: number;
    exact?: number;
  };

  // Stats filtering
  power?: {
    min?: number;
    max?: number;
    exact?: number;
  };
  life?: {
    min?: number;
    max?: number;
    exact?: number;
  };
  durability?: {
    min?: number;
    max?: number;
    exact?: number;
  };
  level?: {
    min?: number;
    max?: number;
    exact?: number;
  };

  // State filtering
  zone?: GrandArchiveZoneType;
  speed?: GrandArchiveSpeed;
  canPlay?: boolean;
  canMaterialize?: boolean;

  // Keywords and abilities
  hasKeyword?: string[];
  hasAbility?: string[];
  abilityType?: GrandArchiveAbilityType;

  // Champion-specific
  championClass?: string[];
  championLevel?: number;

  // Turn/timing filtering
  playableThisTurn?: boolean;
  materializedThisTurn?: boolean;
  activatedThisTurn?: boolean;

  // Complex filters
  isUnique?: boolean;
  isRegalia?: boolean;
  isBasic?: boolean;
  isImplemented?: boolean;

  // Advanced filtering
  customFilter?: (card: GrandArchiveCardDefinition) => boolean;
}>;

// =============================================================================
// Runtime Type Guards
// =============================================================================

/**
 * Type guard for Grand Archive card filters
 */
export const isGrandArchiveCardFilter = (
  filter: any,
): filter is GrandArchiveCardFilter => {
  if (!filter || typeof filter !== "object") return false;

  const grandArchiveProperties = [
    "cardType",
    "element",
    "supertype",
    "reserveCost",
    "memoryCost",
    "power",
    "life",
    "durability",
    "level",
    "speed",
    "hasKeyword",
    "championClass",
    "isUnique",
    "isRegalia",
  ];

  return grandArchiveProperties.some((prop) => filter[prop] !== undefined);
};

/**
 * Type guard for Grand Archive player state
 */
export const isGrandArchivePlayerState = (
  state: any,
): state is GrandArchivePlayerState => {
  if (!state || typeof state !== "object") return false;

  return (
    typeof state.id === "string" &&
    typeof state.name === "string" &&
    Array.isArray(state.championLineage) &&
    typeof state.championLevel === "number" &&
    state.availableElements instanceof Set &&
    typeof state.hasMaterialized === "boolean" &&
    Array.isArray(state.turnActions) &&
    typeof state.counters === "object"
  );
};

/**
 * Type guard for Grand Archive game state
 */
export const isGrandArchiveGameState = (
  state: any,
): state is GrandArchiveGameState => {
  if (!state || typeof state !== "object") return false;

  const validSegments: GrandArchiveGameSegment[] = [
    "startingAGame",
    "duringGame",
    "endGame",
  ];
  const validPhases: GrandArchiveGamePhase[] = [
    "wakeUpPhase",
    "materializePhase",
    "recollectionPhase",
    "drawPhase",
    "mainPhase",
    "endPhase",
    "combatPhase",
  ];

  return (
    validSegments.includes(state.currentSegment) &&
    validPhases.includes(state.currentPhase) &&
    Array.isArray(state.effectsStack) &&
    state.passedPlayers instanceof Set
  );
};

// =============================================================================
// Utility Types
// =============================================================================

/**
 * Enhanced card instance with game state context
 */
export type GrandArchiveEnrichedCard = {
  instanceId: string;
  definition: GrandArchiveCardDefinition;
  owner: string;
  controller: string;
  zone: GrandArchiveZoneType;

  // Game state
  isRested: boolean;
  counters: Record<GrandArchiveCounterType, number>;
  states: Set<GrandArchiveObjectState>;

  // Metadata
  timestamp: number;
  turnPlayed?: number;
  activationsThisTurn: number;
};

/**
 * Combat participant information
 */
export type GrandArchiveCombatant = {
  unitId: string;
  role: "attacker" | "blocker" | "retaliator";
  power: number;
  life: number;
  keywords: string[];
  abilities: string[];
};

/**
 * Effect stack entry
 */
export type GrandArchiveEffectEntry = {
  id: string;
  type: "activation" | "materialization" | "trigger";
  source: string; // Card instance ID
  controller: string; // Player ID
  modes?: Record<string, any>;
  targets?: string[];
  cost?: Record<string, any>;
  timestamp: number;
};

/**
 * Move argument types for type safety
 */
export type GrandArchiveMoveArgs = {
  // Champion management
  materializeChampion: { championId: string };
  levelUpChampion: { championId: string };

  // Card actions
  activateCard: {
    cardId: string;
    targets?: string[];
    modes?: Record<string, any>;
    additionalCosts?: Record<string, any>;
  };
  materializeCard: {
    cardId: string;
    targets?: string[];
    modes?: Record<string, any>;
  };

  // Combat
  declareAttack: {
    attackerId: string;
    targetId?: string;
    weaponId?: string;
  };
  declareRetaliation: {
    defenderId: string;
    againstAttackerId: string;
  };

  // Abilities
  activateAbility: {
    sourceId: string;
    abilityIndex: number;
    targets?: string[];
    additionalCosts?: Record<string, any>;
  };

  // State management
  passPriority: Record<string, never>;
  endPhase: Record<string, never>;
  concede: Record<string, never>;
};

// Export all types for external use
export type * from "~/game-engine/core-engine/types/game-specific-types";
