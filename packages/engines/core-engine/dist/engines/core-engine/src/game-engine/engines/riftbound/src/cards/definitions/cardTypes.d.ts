/**
 * Card type definitions for Riftbound TCG
 * Based on the comprehensive rules analysis covering all card categories
 */
import type { CardRarity, CardType, Domain } from "../../riftbound-engine-types";
export interface RiftboundBaseCard {
    id: string;
    name: string;
    type: CardType;
    set: string;
    number: number;
    rarity: CardRarity;
    implemented: boolean;
    domains: Domain[];
    energyCost: number;
    powerCost: Partial<Record<Domain, number>>;
    rulesText?: string;
    flavorText?: string;
    reminderText?: string;
    illustrator?: string;
    artVariant?: string;
}
export type Keyword = "accelerate" | "action" | "reaction" | "assault" | "shield" | "tank" | "ganking" | "hidden" | "deflect" | "deathknell" | "legion" | "temporary" | "vision";
export interface CardAbility {
    type: "passive" | "activated" | "triggered" | "replacement";
    cost?: {
        energy?: number;
        power?: Partial<Record<Domain, number>>;
        exhaust?: boolean;
        sacrifice?: boolean;
        discard?: number;
        other?: string;
    };
    condition?: string;
    trigger?: string;
    effect: string;
    keywords?: Keyword[];
}
export type CharacterTag = string;
export type RegionTag = string;
export type FactionTag = string;
export type SpeciesTag = string;
export interface RiftboundUnitCard extends RiftboundBaseCard {
    type: "unit";
    might: number;
    tags: Array<CharacterTag | RegionTag | FactionTag | SpeciesTag>;
    abilities: CardAbility[];
    keywords: Keyword[];
    isChampion?: boolean;
    championTag?: CharacterTag;
    isSignature?: boolean;
    canBeAtBase?: boolean;
    canBeAtBattlefield?: boolean;
    linkRequirement?: CharacterTag;
}
export interface RiftboundGearCard extends RiftboundBaseCard {
    type: "gear";
    abilities: CardAbility[];
    keywords: Keyword[];
    isEquipment?: boolean;
    attachmentRestriction?: string;
}
export interface RiftboundSpellCard extends RiftboundBaseCard {
    type: "spell";
    instructions: string[];
    keywords: Array<"action" | "reaction">;
    modes?: Array<{
        name: string;
        effect: string;
        condition?: string;
    }>;
    targets?: Array<{
        type: string;
        count: number | "any";
        restriction: string;
        optional?: boolean;
    }>;
}
export interface RiftboundRuneCard extends RiftboundBaseCard {
    type: "rune";
    energyCost: 0;
    powerCost: {};
    domains: [Domain];
    abilities: CardAbility[];
    isBasic?: boolean;
}
export interface RiftboundBattlefieldCard extends RiftboundBaseCard {
    type: "battlefield";
    energyCost: 0;
    powerCost: {};
    abilities: CardAbility[];
    pointValue?: number;
    isUnique?: boolean;
    requirements?: string[];
}
export interface RiftboundLegendCard extends RiftboundBaseCard {
    type: "legend";
    energyCost: 0;
    powerCost: {};
    championTag: CharacterTag;
    domainIdentity: Domain[];
    abilities: CardAbility[];
    deckRestrictions?: {
        maxSignatures?: number;
        requireAllDomains?: boolean;
        additionalRules?: string[];
    };
}
export interface RiftboundTokenCard extends RiftboundBaseCard {
    type: "unit" | "gear";
    energyCost: 0;
    powerCost: {};
    domains: [];
    isToken: true;
    createdBy?: string;
    might?: number;
    abilities: CardAbility[];
    keywords: Keyword[];
    tags?: Array<CharacterTag | RegionTag | FactionTag | SpeciesTag>;
}
export type RiftboundCard = RiftboundUnitCard | RiftboundGearCard | RiftboundSpellCard | RiftboundRuneCard | RiftboundBattlefieldCard | RiftboundLegendCard | RiftboundTokenCard;
export declare const isUnitCard: (card: RiftboundCard) => card is RiftboundUnitCard;
export declare const isGearCard: (card: RiftboundCard) => card is RiftboundGearCard;
export declare const isSpellCard: (card: RiftboundCard) => card is RiftboundSpellCard;
export declare const isRuneCard: (card: RiftboundCard) => card is RiftboundRuneCard;
export declare const isBattlefieldCard: (card: RiftboundCard) => card is RiftboundBattlefieldCard;
export declare const isLegendCard: (card: RiftboundCard) => card is RiftboundLegendCard;
export declare const isTokenCard: (card: RiftboundCard) => card is RiftboundTokenCard;
export declare const isMainDeckCard: (card: RiftboundCard) => boolean;
export declare const isPermanent: (card: RiftboundCard) => boolean;
export declare const isChampionUnit: (card: RiftboundCard) => boolean;
export declare const isSignatureCard: (card: RiftboundCard) => boolean;
export declare const hasKeyword: (card: RiftboundCard, keyword: Keyword) => boolean;
export declare const getBaseCost: (card: RiftboundCard) => {
    energy: number;
    power: Partial<Record<Domain, number>>;
};
export type MainDeckCard = RiftboundUnitCard | RiftboundGearCard | RiftboundSpellCard;
export type RuneDeckCard = RiftboundRuneCard;
export type NonDeckCard = RiftboundBattlefieldCard | RiftboundLegendCard;
//# sourceMappingURL=cardTypes.d.ts.map