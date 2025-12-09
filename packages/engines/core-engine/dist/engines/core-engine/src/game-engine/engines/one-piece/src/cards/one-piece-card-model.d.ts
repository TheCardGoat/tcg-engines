/**
 * One Piece Card Model
 *
 * Enhanced card model that provides additional querying capabilities
 * and game-specific functionality for One Piece TCG cards.
 */
import type { OnePieceEngine } from "../one-piece-engine";
import type { ZoneType } from "../one-piece-engine-types";
import type { OnePieceCard } from "../one-piece-generic-types";
export declare class OnePieceModel {
    private engine;
    private card;
    private instanceId;
    constructor({ engine, card, instanceId, }: {
        engine: OnePieceEngine;
        card: OnePieceCard;
        instanceId: string;
    });
    /**
     * ### Card Properties
     */
    get id(): string;
    get name(): string;
    get category(): "character" | "event" | "leader" | "stage" | "don";
    get colors(): import("../one-piece-engine-types").CardColor[];
    get cost(): number;
    get power(): number;
    get life(): number;
    get attribute(): import("../one-piece-engine-types").CardAttribute;
    get counter(): number;
    get text(): string;
    get types(): string[];
    get set(): string;
    get rarity(): import("../one-piece-engine-types").CardRarity;
    get implemented(): boolean;
    /**
     * ### Instance Properties
     */
    get instanceIdentifier(): string;
    get owner(): string;
    get zone(): ZoneType | undefined;
    /**
     * ### Card Type Checks
     */
    get isLeader(): boolean;
    get isCharacter(): boolean;
    get isEvent(): boolean;
    get isStage(): boolean;
    get isDon(): boolean;
    /**
     * ### Color Checks
     */
    get isRed(): boolean;
    get isGreen(): boolean;
    get isBlue(): boolean;
    get isPurple(): boolean;
    get isBlack(): boolean;
    get isYellow(): boolean;
    get isColorless(): boolean;
    get isMulticolor(): boolean;
    /**
     * ### Zone Checks
     */
    get isInHand(): boolean;
    get isInPlay(): boolean;
    get isInDeck(): boolean;
    get isInTrash(): boolean;
    get isInCostArea(): boolean;
    get isInLifeArea(): boolean;
    /**
     * ### Gameplay Checks
     */
    hasKeyword(keyword: string): boolean;
    hasType(type: string): boolean;
    hasColor(color: string): boolean;
    canAttack(): boolean;
    canBlock(): boolean;
    hasRush(): boolean;
    hasDoubleAttack(): boolean;
    hasBanish(): boolean;
    /**
     * ### Deck Construction Checks
     */
    canBeInDeck(): boolean;
    isCompatibleWithLeader(leaderColors: string[]): boolean;
    /**
     * ### Utility Methods
     */
    toString(): string;
    toJSON(): {
        instanceId: string;
        owner: string;
        zone: ZoneType;
        category: "leader";
        power: number;
        life: number;
        attribute: import("../one-piece-engine-types").CardAttribute;
        cost?: never;
        id: string;
        name: string;
        set: string;
        number: number;
        rarity: import("../one-piece-engine-types").CardRarity;
        colors: import("../one-piece-engine-types").CardColor[];
        text?: string;
        flavorText?: string;
        types?: string[];
        implemented: boolean;
    } | {
        instanceId: string;
        owner: string;
        zone: ZoneType;
        category: "character";
        power: number;
        cost: number;
        attribute: import("../one-piece-engine-types").CardAttribute;
        counter?: number;
        life?: never;
        id: string;
        name: string;
        set: string;
        number: number;
        rarity: import("../one-piece-engine-types").CardRarity;
        colors: import("../one-piece-engine-types").CardColor[];
        text?: string;
        flavorText?: string;
        types?: string[];
        implemented: boolean;
    } | {
        instanceId: string;
        owner: string;
        zone: ZoneType;
        category: "event";
        cost: number;
        counter?: number;
        power?: never;
        attribute?: never;
        life?: never;
        id: string;
        name: string;
        set: string;
        number: number;
        rarity: import("../one-piece-engine-types").CardRarity;
        colors: import("../one-piece-engine-types").CardColor[];
        text?: string;
        flavorText?: string;
        types?: string[];
        implemented: boolean;
    } | {
        instanceId: string;
        owner: string;
        zone: ZoneType;
        category: "stage";
        cost: number;
        power?: never;
        attribute?: never;
        life?: never;
        counter?: never;
        id: string;
        name: string;
        set: string;
        number: number;
        rarity: import("../one-piece-engine-types").CardRarity;
        colors: import("../one-piece-engine-types").CardColor[];
        text?: string;
        flavorText?: string;
        types?: string[];
        implemented: boolean;
    } | {
        instanceId: string;
        owner: string;
        zone: ZoneType;
        category: "don";
        cost?: never;
        power?: never;
        attribute?: never;
        life?: never;
        counter?: never;
        colors: import("../one-piece-engine-types").CardColor[];
        id: string;
        name: string;
        set: string;
        number: number;
        rarity: import("../one-piece-engine-types").CardRarity;
        text?: string;
        flavorText?: string;
        types?: string[];
        implemented: boolean;
    };
}
//# sourceMappingURL=one-piece-card-model.d.ts.map