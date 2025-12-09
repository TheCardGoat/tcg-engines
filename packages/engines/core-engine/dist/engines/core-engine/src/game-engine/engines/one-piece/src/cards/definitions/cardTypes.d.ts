/**
 * Card type definitions for One Piece TCG
 * Based on the comprehensive One Piece card information system
 */
import type { CardAttribute, CardCategory, CardColor, CardRarity } from "../../one-piece-generic-types";
export interface BaseCard {
    id: string;
    name: string;
    category: CardCategory;
    set: string;
    number: number;
    rarity: CardRarity;
    colors: CardColor[];
    cost?: number;
    text?: string;
    flavorText?: string;
    types?: string[];
    implemented: boolean;
}
export interface LeaderCard extends BaseCard {
    category: "leader";
    power: number;
    life: number;
    attribute: CardAttribute;
    cost?: never;
}
export interface CharacterCard extends BaseCard {
    category: "character";
    power: number;
    cost: number;
    attribute: CardAttribute;
    counter?: number;
    life?: never;
}
export interface EventCard extends BaseCard {
    category: "event";
    cost: number;
    counter?: number;
    power?: never;
    attribute?: never;
    life?: never;
}
export interface StageCard extends BaseCard {
    category: "stage";
    cost: number;
    power?: never;
    attribute?: never;
    life?: never;
    counter?: never;
}
export interface DonCard extends BaseCard {
    category: "don";
    cost?: never;
    power?: never;
    attribute?: never;
    life?: never;
    counter?: never;
    colors: CardColor[];
}
export type OnePieceCard = LeaderCard | CharacterCard | EventCard | StageCard | DonCard;
export interface KeywordEffect {
    name: string;
    description: string;
    implemented: boolean;
}
export interface CardAbility {
    type: "auto" | "activate" | "permanent" | "replacement";
    cost?: string;
    condition?: string;
    timing?: string;
    effect: string;
    keywords?: string[];
}
export interface EnrichedCard {
    card: OnePieceCard;
    abilities: CardAbility[];
    keywords: KeywordEffect[];
    rulings?: string[];
    interactions?: string[];
}
export declare const createLeaderCard: (base: Omit<LeaderCard, "category">) => LeaderCard;
export declare const createCharacterCard: (base: Omit<CharacterCard, "category">) => CharacterCard;
export declare const createEventCard: (base: Omit<EventCard, "category">) => EventCard;
export declare const createStageCard: (base: Omit<StageCard, "category">) => StageCard;
export declare const createDonCard: (base: Omit<DonCard, "category">) => DonCard;
export declare const isLeaderCard: (card: OnePieceCard) => card is LeaderCard;
export declare const isCharacterCard: (card: OnePieceCard) => card is CharacterCard;
export declare const isEventCard: (card: OnePieceCard) => card is EventCard;
export declare const isStageCard: (card: OnePieceCard) => card is StageCard;
export declare const isDonCard: (card: OnePieceCard) => card is DonCard;
export declare const hasColor: (card: OnePieceCard, color: CardColor) => boolean;
export declare const isMulticolor: (card: OnePieceCard) => boolean;
export declare const canPlayInDeck: (card: OnePieceCard, leaderColors: CardColor[]) => boolean;
export declare const hasKeyword: (card: OnePieceCard, keyword: string) => boolean;
export declare const canAttack: (card: OnePieceCard) => boolean;
export declare const canBlock: (card: OnePieceCard) => boolean;
export declare const hasRush: (card: OnePieceCard) => boolean;
export declare const hasDoubleAttack: (card: OnePieceCard) => boolean;
export declare const hasBanish: (card: OnePieceCard) => boolean;
//# sourceMappingURL=cardTypes.d.ts.map