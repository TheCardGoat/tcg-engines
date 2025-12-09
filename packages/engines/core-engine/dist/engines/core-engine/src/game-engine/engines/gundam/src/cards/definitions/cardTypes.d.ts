import type { Ability } from "../../abilities/types";
interface GundamitoRawCard {
    id: string;
    implemented?: boolean;
    missingTestCase?: boolean;
    cost: number;
    level: number;
    number: number;
    title?: string;
    type: "pilot" | "unit" | "command" | "base" | "resource";
    subType?: "pilot";
    name: string;
    color: CardColor;
    abilities?: Array<Ability>;
    set: "ST01" | "ST02" | "ST03" | "ST04" | "ST05" | "ST06" | "GD01" | "GD02";
    rarity: CardRarity;
}
export interface GundamitoUnitCard extends GundamitoRawCard {
    type: "unit";
    title?: string;
    zones: Array<CardZones>;
    traits: Array<Traits>;
    linkRequirement: Array<string>;
    ap: number;
    hp: number;
}
export interface GundamitoPilotCard extends GundamitoRawCard {
    type: "pilot";
    traits: Array<Traits>;
    apModifier: number;
    hpModifier: number;
}
export type GundamitoCommandCard = GundamitoPureCommandCard | GundamitoCommandCardWithPilot;
export interface GundamitoPureCommandCard extends GundamitoRawCard {
    type: "command";
    name: string;
}
export interface GundamitoCommandCardWithPilot extends GundamitoRawCard {
    type: "command";
    subType: "pilot";
    name: string;
    pilotName: string;
    traits: Array<Traits>;
    apModifier: number;
    hpModifier: number;
}
export interface GundamitoBaseCard extends GundamitoRawCard {
    type: "base";
    title?: never;
    zones: Array<CardZones>;
    traits: Array<Traits>;
    abilities: Array<Ability>;
    ap: number;
    hp: number;
}
export interface GundamitoResourceCard extends Omit<GundamitoRawCard, "cost" | "level" | "color"> {
    type: "resource";
}
export declare const isGundamitoUnitCard: (card?: GundamitoCard) => card is GundamitoUnitCard;
export declare const isGundamitoPilotCard: (card?: GundamitoCard) => card is GundamitoPilotCard;
export declare const isGundamitoBaseCard: (card?: GundamitoCard) => card is GundamitoBaseCard;
export declare const isGundamitoCommandCard: (card: GundamitoCard) => card is GundamitoCommandCard;
export declare const isGundamitoResourceCard: (card?: GundamitoCard) => card is GundamitoResourceCard;
export type CardColor = "blue" | "white" | "green" | "red" | "token";
type CardRarity = "common" | "uncommon" | "rare" | "super_rare" | "legendary";
export type GundamitoCard = GundamitoUnitCard | GundamitoPilotCard | GundamitoBaseCard | GundamitoCommandCard | GundamitoResourceCard;
export type CardZones = "space" | "earth";
export type BoardZones = "hand" | "deck" | "trash" | "base" | "battle" | "shield" | "resourceDeck" | "resource";
export type Traits = "earth Federation" | "stronghold" | "white base team" | "earth alliance" | "operation meteor" | "earth federation" | "newtype" | "academy" | "civilian" | "zeon" | "neo zeon" | "maganac corps" | "warship";
export type Abilities = "repair" | "blocker" | "breach";
export {};
//# sourceMappingURL=cardTypes.d.ts.map