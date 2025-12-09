/**
 * Generic type definitions that extend the core engine for One Piece TCG
 * These types integrate with the CoreEngine framework
 */
import type { Move } from "~/game-engine/core-engine/move/move-types";
import type { CardAttribute, CardCategory, CardColor, CardInstanceState, CardRarity, CardState, DefeatCondition, OnePieceGameState as EngineGameState, PlayerState as EnginePlayerState, GamePhase, GameSegment, MoveResult, ZoneType } from "./one-piece-engine-types";
export type { ZoneType, GamePhase, GameSegment, CardCategory, CardColor, CardAttribute, CardRarity, CardState, DefeatCondition, CardInstanceState, MoveResult, };
export type OnePieceMoveType = "chooseFirstPlayer" | "mulligan" | "startTurn" | "endTurn" | "passPriority" | "placeDon" | "giveDon" | "returnDon" | "playCharacter" | "playStage" | "activateEvent" | "declareAttack" | "declareBlock" | "activateCounter" | "resolveBattle" | "activateEffect" | "activateTrigger" | "drawCard" | "discardCard" | "trashCard" | "restCard" | "setActive" | "concede";
export interface OnePieceMoveParams {
    chooseFirstPlayer: {
        playerId: string;
    };
    mulligan: {
        redraw: boolean;
    };
    startTurn: {};
    endTurn: {};
    passPriority: {};
    placeDon: {
        count: number;
    };
    giveDon: {
        donInstanceId: string;
        targetInstanceId: string;
    };
    returnDon: {
        donInstanceIds: string[];
    };
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
        targetInstanceId?: string;
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
    drawCard: {
        count: number;
    };
    discardCard: {
        instanceIds: string[];
    };
    trashCard: {
        instanceIds: string[];
    };
    restCard: {
        instanceIds: string[];
    };
    setActive: {
        instanceIds: string[];
    };
    concede: {};
}
export type OnePieceMove = Move<OnePieceGameState>;
export type OnePieceMoves = Record<OnePieceMoveType, OnePieceMove>;
export type OnePieceGameState = EngineGameState;
export type OnePiecePlayerState = EnginePlayerState;
export type { OnePieceCard } from "./cards/definitions/cardTypes";
export interface OnePieceCardFilter {
    id?: string;
    name?: string;
    category?: CardCategory;
    colors?: CardColor[];
    cost?: {
        min?: number;
        max?: number;
        exact?: number;
    };
    zone?: ZoneType;
    owner?: string;
    canPlay?: boolean;
    isRested?: boolean;
    hasAttacked?: boolean;
    attribute?: CardAttribute;
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
    counter?: {
        min?: number;
        max?: number;
        exact?: number;
    };
    hasKeyword?: string[];
    hasType?: string[];
    textContains?: string;
    implemented?: boolean;
}
export type { OnePieceMoveType as MoveType };
export type { OnePieceMoveParams as MoveParams };
export type { OnePieceMoves as Moves };
export declare const isValidZone: (zone: string) => zone is ZoneType;
export declare const isValidCardCategory: (category: string) => category is CardCategory;
export declare const isValidColor: (color: string) => color is CardColor;
export declare const isValidAttribute: (attribute: string) => attribute is CardAttribute;
export declare const getZoneCapacity: (zone: ZoneType) => number | null;
export declare const getZoneVisibility: (zone: ZoneType) => "public" | "private" | "secret";
export declare const isZoneOrdered: (zone: ZoneType) => boolean;
//# sourceMappingURL=one-piece-generic-types.d.ts.map