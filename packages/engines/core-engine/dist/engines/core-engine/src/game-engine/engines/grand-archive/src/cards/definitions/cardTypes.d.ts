/**
 * Grand Archive Card Type Definitions
 *
 * Comprehensive TypeScript interfaces for all Grand Archive card types
 * Based on Grand Archive Comprehensive Rules and game mechanics
 */
import type { GrandArchiveAbilityType, GrandArchiveCardType, GrandArchiveElement, GrandArchiveSpeed, GrandArchiveSupertype } from "../../../grand-archive-engine-types";
/**
 * Base card interface - all Grand Archive cards extend this
 */
export interface BaseGrandArchiveCard {
    id: string;
    name: string;
    type: GrandArchiveCardType;
    set: string;
    number: number;
    rarity: "common" | "uncommon" | "rare" | "super-rare" | "signature-rare";
    element: GrandArchiveElement;
    reserveCost?: number;
    memoryCost?: number;
    supertypes?: GrandArchiveSupertype[];
    subtypes?: string[];
    text?: string;
    flavorText?: string;
    artist?: string;
    abilities?: GrandArchiveAbility[];
    keywords?: string[];
    implemented: boolean;
}
/**
 * Ability definition for Grand Archive cards
 */
export interface GrandArchiveAbility {
    type: GrandArchiveAbilityType;
    cost?: string;
    effect: string;
    timing?: string;
    restrictions?: string[];
    keywords?: string[];
}
/**
 * Champion card type
 */
export interface ChampionCard extends BaseGrandArchiveCard {
    type: "champion";
    level: number;
    life: number;
    championClass: string[];
    domainIdentity?: GrandArchiveElement[];
}
/**
 * Ally card type - units that can attack and defend
 */
export interface AllyCard extends BaseGrandArchiveCard {
    type: "ally";
    power: number;
    life: number;
    subtypes?: string[];
}
/**
 * Action card type - spells with immediate effects
 */
export interface ActionCard extends BaseGrandArchiveCard {
    type: "action";
    speed: GrandArchiveSpeed;
    subtypes?: string[];
}
/**
 * Attack card type - creates combat when resolved
 */
export interface AttackCard extends BaseGrandArchiveCard {
    type: "attack";
    power: number;
    subtypes?: string[];
}
/**
 * Item card type - permanent objects with various effects
 */
export interface ItemCard extends BaseGrandArchiveCard {
    type: "item";
    subtypes?: string[];
    durability?: number;
}
/**
 * Weapon card type - equipment with power and durability
 */
export interface WeaponCard extends BaseGrandArchiveCard {
    type: "weapon";
    power: number;
    durability: number;
    subtypes?: string[];
}
/**
 * Domain card type - field objects with continuous effects
 */
export interface DomainCard extends BaseGrandArchiveCard {
    type: "domain";
    subtypes?: string[];
    durability?: number;
}
/**
 * Phantasia card type - special field objects
 */
export interface PhantasiaCard extends BaseGrandArchiveCard {
    type: "phantasia";
    subtypes?: string[];
}
/**
 * Union type for all Grand Archive cards
 */
export type GrandArchiveCard = ChampionCard | AllyCard | ActionCard | AttackCard | ItemCard | WeaponCard | DomainCard | PhantasiaCard;
/**
 * Type guard functions for card types
 */
export declare const isChampionCard: (card: GrandArchiveCard) => card is ChampionCard;
export declare const isAllyCard: (card: GrandArchiveCard) => card is AllyCard;
export declare const isActionCard: (card: GrandArchiveCard) => card is ActionCard;
export declare const isAttackCard: (card: GrandArchiveCard) => card is AttackCard;
export declare const isItemCard: (card: GrandArchiveCard) => card is ItemCard;
export declare const isWeaponCard: (card: GrandArchiveCard) => card is WeaponCard;
export declare const isDomainCard: (card: GrandArchiveCard) => card is DomainCard;
export declare const isPhantasiaCard: (card: GrandArchiveCard) => card is PhantasiaCard;
/**
 * Utility functions for card properties
 */
export declare const getCardCost: (card: GrandArchiveCard) => number;
export declare const hasKeyword: (card: GrandArchiveCard, keyword: string) => boolean;
export declare const hasSubtype: (card: GrandArchiveCard, subtype: string) => boolean;
export declare const hasSupertype: (card: GrandArchiveCard, supertype: GrandArchiveSupertype) => boolean;
export declare const isRegalia: (card: GrandArchiveCard) => boolean;
export declare const isUnique: (card: GrandArchiveCard) => boolean;
/**
 * Card stat accessors with type safety
 */
export declare const getCardPower: (card: GrandArchiveCard) => number | undefined;
export declare const getCardLife: (card: GrandArchiveCard) => number | undefined;
export declare const getCardDurability: (card: GrandArchiveCard) => number | undefined;
export declare const getCardLevel: (card: GrandArchiveCard) => number | undefined;
/**
 * Card filtering utilities
 */
export declare const filterCardsByType: <T extends GrandArchiveCard>(cards: GrandArchiveCard[], type: GrandArchiveCardType) => T[];
export declare const filterCardsByElement: (cards: GrandArchiveCard[], element: GrandArchiveElement) => GrandArchiveCard[];
export declare const filterCardsByImplemented: (cards: GrandArchiveCard[], implemented?: boolean) => GrandArchiveCard[];
//# sourceMappingURL=cardTypes.d.ts.map