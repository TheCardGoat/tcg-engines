/**
 * # Gundam TCG Generic Type Definitions
 *
 * This module defines the game-specific types for Gundam TCG that extend
 * the CoreEngine's generic type system with Gundam-specific properties.
 */
import type { ExtendCardDefinition, ExtendCardFilter, ExtendGameState, ExtendPlayerState } from "~/game-engine/core-engine/types/game-specific-types";
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
    cardType?: "Unit" | "Pilot" | "Command" | "Base" | "Resource";
    color?: "blue" | "green" | "red" | "white";
    cost?: {
        min?: number;
        max?: number;
        exact?: number;
    };
    deploymentZone?: "battleArea" | "resourceArea" | "shieldBase";
    canDeploy?: boolean;
    isPaired?: boolean;
    isExerted?: boolean;
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
    hasKeyword?: string[];
    hasAbility?: string[];
    canPairWith?: string;
    pairedWith?: string;
    playableThisTurn?: boolean;
    activatedThisTurn?: boolean;
}>;
export type GamePhase = "startPhase" | "drawPhase" | "resourcePhase" | "mainPhase" | "endPhase";
export type ZoneType = "deck" | "resourceDeck" | "resourceArea" | "battleArea" | "shieldBase" | "shieldSection" | "removalArea" | "hand" | "trash" | "sideboard";
export type CardType = "Unit" | "Pilot" | "Command" | "Base" | "Resource";
export type CardColor = "blue" | "green" | "red" | "white";
/**
 * Type validation helpers for runtime type checking
 */
export declare const isGundamCardFilter: (filter: any) => filter is GundamCardFilter;
export declare const isGundamPlayerState: (state: any) => state is GundamPlayerState;
//# sourceMappingURL=gundam-generic-types.d.ts.map