/**
 * Type definitions for Alpha Clash TCG engine
 *
 * Alpha Clash is a 2+ player TCG with:
 * - 5 colors: white, blue, black, red, green
 * - 9 zones: Contender, Clash, Clashground, Accessory, Resource, Oblivion, Standby, hand, deck
 * - 5 card types: Contender, Clash, Accessory, Action, Clashground
 * - 6-step clash phase system
 */
import type { ExtendCardDefinition, ExtendCardFilter, ExtendGameState, ExtendPlayerState } from "~/game-engine/core-engine/types/game-specific-types";
import type { AlphaClashCard } from "./src/cards/definitions/cardTypes";
/**
 * Alpha Clash game zones
 */
export type AlphaClashZoneType = "deck" | "hand" | "contender" | "clash" | "clashground" | "accessory" | "resource" | "oblivion" | "standby";
/**
 * Alpha Clash card types
 */
export type AlphaClashCardType = "contender" | "clash" | "accessory" | "action" | "clashground";
/**
 * Alpha Clash card subtypes
 */
export type AlphaClashSubtype = "trap" | "weapon" | "basic" | "quick" | "clash-buff";
/**
 * Alpha Clash colors
 */
export type AlphaClashColor = "white" | "blue" | "black" | "red" | "green" | "colorless";
/**
 * Alpha Clash affiliations
 */
export type AlphaClashAffiliation = "alpha" | "alpha-hunter" | "rogue" | "discarded" | "harbinger" | "progenitor";
/**
 * Alpha Clash card rarities
 */
export type AlphaClashRarity = "common" | "uncommon" | "rare" | "mythic" | "legendary";
/**
 * Alpha Clash card status
 */
export type AlphaClashCardStatus = "ready" | "engaged" | "face-up" | "face-down";
/**
 * Alpha Clash game phases
 */
export type AlphaClashGamePhase = "startOfTurn" | "expansion" | "primary" | "clash" | "endOfTurn";
/**
 * Alpha Clash expansion phase steps
 */
export type AlphaClashExpansionStep = "ready" | "draw" | "resource";
/**
 * Alpha Clash clash phase steps
 */
export type AlphaClashClashStep = "attack" | "counter" | "obstruct" | "attackerClashBuff" | "defenderClashBuff" | "damage";
/**
 * Alpha Clash priority window types
 */
export type AlphaClashPriorityWindow = "counter-play" | "counter-attack" | "counter-trap";
/**
 * Alpha Clash damage types
 */
export type AlphaClashDamageType = "clash" | "non-clash";
/**
 * Alpha Clash keyword abilities
 */
export type AlphaClashKeyword = "awe-factor" | "barrage" | "breakthrough" | "close-combat" | "enrage" | "flight" | "interception" | "necrotic" | "superspeed" | "undisputed" | "unrivaled";
/**
 * Game-specific player state extending the base player state
 */
export type AlphaClashPlayerState = ExtendPlayerState<{
    contenderHealth?: number;
    turnHistory: string[];
    availableResources?: number;
    clashBuffsUsed?: number;
    selectedChampion?: string;
    hasPriority?: boolean;
}>;
/**
 * Game-specific game state extending the base game state
 */
export type AlphaClashGameState = ExtendGameState<{
    currentSegment?: string;
    currentPhase?: AlphaClashGamePhase;
    players?: Record<string, AlphaClashPlayerState>;
    currentExpansionStep?: AlphaClashExpansionStep;
    currentClashStep?: AlphaClashClashStep;
    gameEnded?: boolean;
    winner?: string;
    activeClashground?: string;
    clashState?: {
        attackers: string[];
        defenders: string[];
        obstructors: Record<string, string>;
        clashBuffs: {
            attacker?: string;
            defender?: string;
        };
        damage: Record<string, number>;
    };
    priorityState?: {
        window: AlphaClashPriorityWindow;
        activePlayer: string;
        passedPlayers: Set<string>;
    };
    effectsStack?: Array<{
        id: string;
        effect: any;
        source: string;
        targets?: string[];
    }>;
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
    cardType?: AlphaClashCardType;
    subtype?: AlphaClashSubtype;
    color?: AlphaClashColor[];
    cost?: {
        min?: number;
        max?: number;
        exact?: number;
    };
    zone?: AlphaClashZoneType;
    status?: AlphaClashCardStatus;
    isReady?: boolean;
    isEngaged?: boolean;
    isFaceUp?: boolean;
    isFaceDown?: boolean;
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
    hasKeyword?: AlphaClashKeyword[];
    hasAbility?: string[];
    affiliation?: AlphaClashAffiliation[];
    rarity?: AlphaClashRarity[];
    canPlay?: boolean;
    canActivate?: boolean;
    canAttack?: boolean;
    canObstruct?: boolean;
    set?: string[];
    owner?: string;
    controller?: string;
    hasDamage?: boolean;
    damageType?: AlphaClashDamageType;
}>;
/**
 * Runtime type validation helpers
 */
export declare const isAlphaClashCardFilter: (filter: any) => filter is AlphaClashCardFilter;
export declare const isAlphaClashPlayerState: (state: any) => state is AlphaClashPlayerState;
export declare const isAlphaClashGameState: (state: any) => state is AlphaClashGameState;
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
//# sourceMappingURL=alpha-clash-engine-types.d.ts.map