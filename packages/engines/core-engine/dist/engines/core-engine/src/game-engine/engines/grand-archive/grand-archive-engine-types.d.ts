/**
 * Grand Archive Engine Type Definitions
 *
 * Comprehensive type system for Grand Archive TCG implementation
 * Based on Grand Archive Comprehensive Rules v1.1.3
 */
import type { ExtendCardDefinition, ExtendCardFilter, ExtendGameState, ExtendPlayerState } from "~/game-engine/core-engine/types/game-specific-types";
/**
 * All Grand Archive game zones
 */
export type GrandArchiveZoneType = "hand" | "memory" | "mainDeck" | "materialDeck" | "field" | "graveyard" | "banishment" | "effectsStack" | "intent" | "innerLineage" | "loadedCards";
/**
 * Grand Archive card types
 */
export type GrandArchiveCardType = "champion" | "ally" | "action" | "attack" | "item" | "weapon" | "domain" | "phantasia";
/**
 * Grand Archive supertypes
 */
export type GrandArchiveSupertype = "unique" | "regalia";
/**
 * Grand Archive elements
 */
export type GrandArchiveElement = "norm" | "fire" | "water" | "wind" | "arcane" | "astracrux" | "exia" | "luxem" | "neos" | "tera" | "umbra";
/**
 * Card speed types
 */
export type GrandArchiveSpeed = "fast" | "slow";
/**
 * Game phases within turns
 */
export type GrandArchiveGamePhase = "wakeUpPhase" | "materializePhase" | "recollectionPhase" | "drawPhase" | "mainPhase" | "endPhase" | "combatPhase";
/**
 * Game segments (major game flow divisions)
 */
export type GrandArchiveGameSegment = "startingAGame" | "duringGame" | "endGame";
/**
 * Combat phases
 */
export type GrandArchiveCombatPhase = "attackDeclaration" | "retaliationStep" | "damageStep" | "endOfCombat";
/**
 * Counter types in Grand Archive
 */
export type GrandArchiveCounterType = "damage" | "buff" | "debuff" | "durability" | "enlighten" | "level" | "wither" | "preparation";
/**
 * Object states in Grand Archive
 */
export type GrandArchiveObjectState = "awake" | "rested" | "attacking" | "defending" | "retaliating" | "damaged" | "undamaged" | "intercepting" | "distant" | "fostered" | "loaded" | "transformed";
/**
 * Ability types
 */
export type GrandArchiveAbilityType = "triggered" | "activated" | "static" | "keyword" | "restriction";
/**
 * Grand Archive specific player state extensions
 */
export type GrandArchivePlayerState = ExtendPlayerState<{
    championLineage: string[];
    championLevel: number;
    championDamage: number;
    availableElements: Set<GrandArchiveElement>;
    hasMaterialized: boolean;
    turnActions: string[];
    counters: Record<GrandArchiveCounterType, number>;
    influence: number;
    turnHistory: string[];
    isActive?: boolean;
    joinedAt?: number;
}>;
/**
 * Grand Archive specific game state extensions
 */
export type GrandArchiveGameState = ExtendGameState<{
    currentPhase?: string;
    passedPlayers?: Set<string>;
    opportunityPlayer?: string;
    currentSegment?: string;
    winner?: string;
    gameEndReason?: string;
    gameEndTime?: number;
    startTime?: number;
    combatState?: {
        attackers: string[];
        blockers: Map<string, string>;
        combatDamage: Map<string, number>;
        weaponsUsed: string[];
    };
    combatPhase?: "attackDeclaration" | "blockDeclaration" | "damageResolution";
    effectsStack: Array<{
        id: string;
        type: "activation" | "materialization" | "trigger";
        cardId: string;
        playerId: string;
        modes?: Record<string, any>;
        targets?: string[];
        timestamp: number;
    }>;
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
    id: string;
    name: string;
    type: GrandArchiveCardType;
    element: GrandArchiveElement;
    set: string;
    number: number;
    rarity: "common" | "uncommon" | "rare" | "super-rare" | "signature-rare";
    reserveCost?: number;
    memoryCost?: number;
    supertypes?: GrandArchiveSupertype[];
    subtypes?: string[];
    speed?: GrandArchiveSpeed;
    power?: number;
    life?: number;
    durability?: number;
    level?: number;
    text?: string;
    abilities?: Array<{
        type: GrandArchiveAbilityType;
        cost?: string;
        effect: string;
        timing?: string;
        restrictions?: string[];
    }>;
    keywords?: string[];
    championClass?: string[];
    domainIdentity?: GrandArchiveElement[];
    pointValue?: number;
    isChampion?: boolean;
    isBasic?: boolean;
    flavorText?: string;
    artist?: string;
    implemented: boolean;
}>;
/**
 * Comprehensive card filtering system for Grand Archive
 */
export type GrandArchiveCardFilter = ExtendCardFilter<{
    cardType?: GrandArchiveCardType;
    element?: GrandArchiveElement;
    supertype?: GrandArchiveSupertype;
    subtypes?: string[];
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
    zone?: GrandArchiveZoneType;
    speed?: GrandArchiveSpeed;
    canPlay?: boolean;
    canMaterialize?: boolean;
    hasKeyword?: string[];
    hasAbility?: string[];
    abilityType?: GrandArchiveAbilityType;
    championClass?: string[];
    championLevel?: number;
    playableThisTurn?: boolean;
    materializedThisTurn?: boolean;
    activatedThisTurn?: boolean;
    isUnique?: boolean;
    isRegalia?: boolean;
    isBasic?: boolean;
    isImplemented?: boolean;
    customFilter?: (card: GrandArchiveCardDefinition) => boolean;
}>;
/**
 * Type guard for Grand Archive card filters
 */
export declare const isGrandArchiveCardFilter: (filter: any) => filter is GrandArchiveCardFilter;
/**
 * Type guard for Grand Archive player state
 */
export declare const isGrandArchivePlayerState: (state: any) => state is GrandArchivePlayerState;
/**
 * Type guard for Grand Archive game state
 */
export declare const isGrandArchiveGameState: (state: any) => state is GrandArchiveGameState;
/**
 * Enhanced card instance with game state context
 */
export type GrandArchiveEnrichedCard = {
    instanceId: string;
    definition: GrandArchiveCardDefinition;
    owner: string;
    controller: string;
    zone: GrandArchiveZoneType;
    isRested: boolean;
    counters: Record<GrandArchiveCounterType, number>;
    states: Set<GrandArchiveObjectState>;
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
    source: string;
    controller: string;
    modes?: Record<string, any>;
    targets?: string[];
    cost?: Record<string, any>;
    timestamp: number;
};
/**
 * Move argument types for type safety
 */
export type GrandArchiveMoveArgs = {
    materializeChampion: {
        championId: string;
    };
    levelUpChampion: {
        championId: string;
    };
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
    declareAttack: {
        attackerId: string;
        targetId?: string;
        weaponId?: string;
    };
    declareRetaliation: {
        defenderId: string;
        againstAttackerId: string;
    };
    activateAbility: {
        sourceId: string;
        abilityIndex: number;
        targets?: string[];
        additionalCosts?: Record<string, any>;
    };
    passPriority: Record<string, never>;
    endPhase: Record<string, never>;
    concede: Record<string, never>;
};
export type * from "~/game-engine/core-engine/types/game-specific-types";
//# sourceMappingURL=grand-archive-engine-types.d.ts.map