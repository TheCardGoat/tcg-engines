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

import type {
  AlphaClashAffiliation,
  AlphaClashCardType,
  AlphaClashColor,
  AlphaClashKeyword,
  AlphaClashRarity,
} from "../../../alpha-clash-engine-types";

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
  characterName?: string; // Character name in brackets
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
  attachCost?: number; // For weapons
  triggerCondition?: string; // For traps
  attachmentEffects?: string[]; // For weapons
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
export type AlphaClashCard =
  | ContenderCard
  | ClashCard
  | AccessoryCard
  | ActionCard
  | ClashgroundCard;

/**
 * Token card interface for generated tokens
 */
export interface AlphaClashTokenCard extends BaseAlphaClashCard {
  isToken: true;
  tokenSource?: string; // What created this token
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
  attachments?: string[]; // Instance IDs of attached cards
  attachedTo?: string; // Instance ID of card this is attached to
  modifiers?: Array<{
    source: string;
    effect: string;
    duration?: string;
  }>;
}

/**
 * Type guards for card types
 */
export const isContenderCard = (
  card: AlphaClashCard,
): card is ContenderCard => {
  return card.type === "contender";
};

export const isClashCard = (card: AlphaClashCard): card is ClashCard => {
  return card.type === "clash";
};

export const isAccessoryCard = (
  card: AlphaClashCard,
): card is AccessoryCard => {
  return card.type === "accessory";
};

export const isTrap = (card: AlphaClashCard): card is AccessoryCard => {
  return isAccessoryCard(card) && card.subtype === "trap";
};

export const isWeapon = (card: AlphaClashCard): card is AccessoryCard => {
  return isAccessoryCard(card) && card.subtype === "weapon";
};

export const isActionCard = (card: AlphaClashCard): card is ActionCard => {
  return card.type === "action";
};

export const isBasicAction = (card: AlphaClashCard): card is ActionCard => {
  return isActionCard(card) && card.subtype === "basic";
};

export const isQuickAction = (card: AlphaClashCard): card is ActionCard => {
  return isActionCard(card) && card.subtype === "quick";
};

export const isClashBuff = (card: AlphaClashCard): card is ActionCard => {
  return isActionCard(card) && card.subtype === "clash-buff";
};

export const isClashgroundCard = (
  card: AlphaClashCard,
): card is ClashgroundCard => {
  return card.type === "clashground";
};

/**
 * Utility functions for card properties
 */
export const getCardCost = (card: AlphaClashCard): number => {
  return card.cost || 0;
};

export const getCardColors = (card: AlphaClashCard): AlphaClashColor[] => {
  return card.colors || [];
};

export const hasKeyword = (
  card: AlphaClashCard,
  keyword: AlphaClashKeyword,
): boolean => {
  return card.keywords?.includes(keyword);
};

export const hasAffiliation = (
  card: AlphaClashCard,
  affiliation: AlphaClashAffiliation,
): boolean => {
  return card.affiliations?.includes(affiliation);
};

export const isColorless = (card: AlphaClashCard): boolean => {
  return card.colors.length === 0 || card.colors.includes("colorless");
};

export const isMulticolored = (card: AlphaClashCard): boolean => {
  return card.colors.length > 1 && !card.colors.includes("colorless");
};

/**
 * Combat-related utility functions
 */
export const canAttack = (card: AlphaClashCard): boolean => {
  return isClashCard(card) || isContenderCard(card);
};

export const canObstruct = (card: AlphaClashCard): boolean => {
  return isClashCard(card);
};

export const getAttackValue = (card: AlphaClashCard): number => {
  if (isClashCard(card) || isContenderCard(card)) {
    return card.attack;
  }
  return 0;
};

export const getDefenseValue = (card: AlphaClashCard): number => {
  if (isClashCard(card) || isContenderCard(card)) {
    return card.defense;
  }
  return 0;
};

export const getHealthValue = (card: AlphaClashCard): number => {
  if (isContenderCard(card)) {
    return card.startingHealth;
  }
  return 0;
};
