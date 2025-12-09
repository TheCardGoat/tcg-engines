/**
 * Card type definitions for Alpha Clash TCG
 *
 * Defines TypeScript interfaces for all Alpha Clash card types:
 * - Contender: Each player's main character with starting health
 * - Clash: Combat units that can attack and obstruct
 * - Accessory: Traps (face-down) and Weapons (attachments)
 * - Action: Spells with timing restrictions (Basic, Quick, Clash Buff)
 * - Clashground: Field effects (only one active at a time)
 */
import type { AlphaClashAffiliation, AlphaClashCardType, AlphaClashColor, AlphaClashKeyword, AlphaClashRarity } from "../../../alpha-clash-engine-types";
/**
 * Base card interface - all Alpha Clash cards extend this
 */
export interface BaseAlphaClashCard {
    id: string;
    name: string;
    type: AlphaClashCardType;
    set: string;
    number: number;
    rarity: AlphaClashRarity;
    cost?: number;
    colors: AlphaClashColor[];
    text?: string;
    flavorText?: string;
    artist?: string;
    characterName?: string;
    affiliations?: AlphaClashAffiliation[];
    keywords?: AlphaClashKeyword[];
    abilities?: string[];
}
/**
 * Contender card - Each player's main character
 *
 * Rules:
 * - Exactly 1 per deck
 * - Placed in Contender Zone at game start
 * - Has starting health, abilities, attack/defense
 * - Player loses if Contender health reaches 0 or below
 */
export interface ContenderCard extends BaseAlphaClashCard {
    type: "contender";
    startingHealth: number;
    attack: number;
    defense: number;
    subtypes?: string[];
}
/**
 * Clash card - Combat units
 *
 * Rules:
 * - Can attack or obstruct during Clash Phase
 * - Have attack and defense values
 * - Can be engaged/ready, face-up/face-down
 * - Defeated when damage >= defense
 */
export interface ClashCard extends BaseAlphaClashCard {
    type: "clash";
    attack: number;
    defense: number;
    subtypes?: string[];
}
/**
 * Accessory cards - Traps and Weapons
 *
 * Trap Rules:
 * - Set face-down in Accessory Zone
 * - Activated in response to specific events
 * - Counter-Trap priority window when activated
 *
 * Weapon Rules:
 * - Can be attached to Clash cards
 * - Pay attach cost to equip
 * - Modify attached card's characteristics
 */
export interface AccessoryCard extends BaseAlphaClashCard {
    type: "accessory";
    subtype: "trap" | "weapon";
    attachCost?: number;
    triggerCondition?: string;
    attachmentEffects?: string[];
}
/**
 * Action cards - Spells with timing restrictions
 *
 * Basic Action Rules:
 * - Playable only during owner's Primary Phase
 * - Go to discard after resolution
 *
 * Quick Action Rules:
 * - Playable in response to specific events
 * - Can be played during priority windows
 *
 * Clash Buff Rules:
 * - Playable only during Clash Phase
 * - Maximum 1 per player per clash
 * - Each player can play one during their Clash Buff Step
 */
export interface ActionCard extends BaseAlphaClashCard {
    type: "action";
    subtype: "basic" | "quick" | "clash-buff";
    effects: string[];
    targets?: string[];
    timingRestrictions?: string[];
}
/**
 * Clashground cards - Field effects
 *
 * Rules:
 * - Only one Clashground in play at any time
 * - New Clashground replaces existing one
 * - Affects the field of play globally
 * - Remains in play until replaced or destroyed
 */
export interface ClashgroundCard extends BaseAlphaClashCard {
    type: "clashground";
    fieldEffects: string[];
    permanentEffects?: string[];
    subtypes?: string[];
}
/**
 * Union type for all Alpha Clash cards
 */
export type AlphaClashCard = ContenderCard | ClashCard | AccessoryCard | ActionCard | ClashgroundCard;
/**
 * Token card interface for generated tokens
 */
export interface AlphaClashTokenCard extends BaseAlphaClashCard {
    isToken: true;
    tokenSource?: string;
    tokenEffects?: string[];
}
/**
 * Enhanced card interface with game state information
 */
export interface EnrichedAlphaClashCard {
    instanceId: string;
    definition: AlphaClashCard;
    zone: string;
    owner: string;
    controller: string;
    status: "ready" | "engaged" | "face-up" | "face-down";
    damage?: number;
    damageType?: "clash" | "non-clash";
    counters?: Record<string, number>;
    attachments?: string[];
    attachedTo?: string;
    modifiers?: Array<{
        source: string;
        effect: string;
        duration?: string;
    }>;
}
/**
 * Type guards for card types
 */
export declare const isContenderCard: (card: AlphaClashCard) => card is ContenderCard;
export declare const isClashCard: (card: AlphaClashCard) => card is ClashCard;
export declare const isAccessoryCard: (card: AlphaClashCard) => card is AccessoryCard;
export declare const isTrap: (card: AlphaClashCard) => card is AccessoryCard;
export declare const isWeapon: (card: AlphaClashCard) => card is AccessoryCard;
export declare const isActionCard: (card: AlphaClashCard) => card is ActionCard;
export declare const isBasicAction: (card: AlphaClashCard) => card is ActionCard;
export declare const isQuickAction: (card: AlphaClashCard) => card is ActionCard;
export declare const isClashBuff: (card: AlphaClashCard) => card is ActionCard;
export declare const isClashgroundCard: (card: AlphaClashCard) => card is ClashgroundCard;
/**
 * Utility functions for card properties
 */
export declare const getCardCost: (card: AlphaClashCard) => number;
export declare const getCardColors: (card: AlphaClashCard) => AlphaClashColor[];
export declare const hasKeyword: (card: AlphaClashCard, keyword: AlphaClashKeyword) => boolean;
export declare const hasAffiliation: (card: AlphaClashCard, affiliation: AlphaClashAffiliation) => boolean;
export declare const isColorless: (card: AlphaClashCard) => boolean;
export declare const isMulticolored: (card: AlphaClashCard) => boolean;
/**
 * Combat-related utility functions
 */
export declare const canAttack: (card: AlphaClashCard) => boolean;
export declare const canObstruct: (card: AlphaClashCard) => boolean;
export declare const getAttackValue: (card: AlphaClashCard) => number;
export declare const getDefenseValue: (card: AlphaClashCard) => number;
export declare const getHealthValue: (card: AlphaClashCard) => number;
//# sourceMappingURL=cardTypes.d.ts.map