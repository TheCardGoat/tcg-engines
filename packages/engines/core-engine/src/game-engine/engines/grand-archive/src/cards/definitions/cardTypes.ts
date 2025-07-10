/**
 * Grand Archive Card Type Definitions
 *
 * Comprehensive TypeScript interfaces for all Grand Archive card types
 * Based on Grand Archive Comprehensive Rules and game mechanics
 */

import type {
  GrandArchiveAbilityType,
  GrandArchiveCardType,
  GrandArchiveElement,
  GrandArchiveSpeed,
  GrandArchiveSupertype,
} from "../../../grand-archive-engine-types";

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

  // Costs
  reserveCost?: number; // Main deck cards
  memoryCost?: number; // Material deck cards

  // Supertypes and subtypes
  supertypes?: GrandArchiveSupertype[];
  subtypes?: string[];

  // Text and abilities
  text?: string;
  flavorText?: string;
  artist?: string;

  // Abilities system
  abilities?: GrandArchiveAbility[];
  keywords?: string[];

  // Implementation status
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
export type GrandArchiveCard =
  | ChampionCard
  | AllyCard
  | ActionCard
  | AttackCard
  | ItemCard
  | WeaponCard
  | DomainCard
  | PhantasiaCard;

/**
 * Type guard functions for card types
 */

export const isChampionCard = (
  card: GrandArchiveCard,
): card is ChampionCard => {
  return card.type === "champion";
};

export const isAllyCard = (card: GrandArchiveCard): card is AllyCard => {
  return card.type === "ally";
};

export const isActionCard = (card: GrandArchiveCard): card is ActionCard => {
  return card.type === "action";
};

export const isAttackCard = (card: GrandArchiveCard): card is AttackCard => {
  return card.type === "attack";
};

export const isItemCard = (card: GrandArchiveCard): card is ItemCard => {
  return card.type === "item";
};

export const isWeaponCard = (card: GrandArchiveCard): card is WeaponCard => {
  return card.type === "weapon";
};

export const isDomainCard = (card: GrandArchiveCard): card is DomainCard => {
  return card.type === "domain";
};

export const isPhantasiaCard = (
  card: GrandArchiveCard,
): card is PhantasiaCard => {
  return card.type === "phantasia";
};

/**
 * Utility functions for card properties
 */

export const getCardCost = (card: GrandArchiveCard): number => {
  return card.reserveCost || card.memoryCost || 0;
};

export const hasKeyword = (
  card: GrandArchiveCard,
  keyword: string,
): boolean => {
  return card.keywords?.includes(keyword);
};

export const hasSubtype = (
  card: GrandArchiveCard,
  subtype: string,
): boolean => {
  return card.subtypes?.includes(subtype);
};

export const hasSupertype = (
  card: GrandArchiveCard,
  supertype: GrandArchiveSupertype,
): boolean => {
  return card.supertypes?.includes(supertype);
};

export const isRegalia = (card: GrandArchiveCard): boolean => {
  return hasSupertype(card, "regalia");
};

export const isUnique = (card: GrandArchiveCard): boolean => {
  return hasSupertype(card, "unique");
};

/**
 * Card stat accessors with type safety
 */

export const getCardPower = (card: GrandArchiveCard): number | undefined => {
  if (isAllyCard(card) || isAttackCard(card) || isWeaponCard(card)) {
    return card.power;
  }
  return undefined;
};

export const getCardLife = (card: GrandArchiveCard): number | undefined => {
  if (isChampionCard(card) || isAllyCard(card)) {
    return card.life;
  }
  return undefined;
};

export const getCardDurability = (
  card: GrandArchiveCard,
): number | undefined => {
  if (isWeaponCard(card)) {
    return card.durability;
  }
  if (isItemCard(card) || isDomainCard(card)) {
    return card.durability;
  }
  return undefined;
};

export const getCardLevel = (card: GrandArchiveCard): number | undefined => {
  if (isChampionCard(card)) {
    return card.level;
  }
  return undefined;
};

/**
 * Card filtering utilities
 */

export const filterCardsByType = <T extends GrandArchiveCard>(
  cards: GrandArchiveCard[],
  type: GrandArchiveCardType,
): T[] => {
  return cards.filter((card) => card.type === type) as T[];
};

export const filterCardsByElement = (
  cards: GrandArchiveCard[],
  element: GrandArchiveElement,
): GrandArchiveCard[] => {
  return cards.filter((card) => card.element === element);
};

export const filterCardsByImplemented = (
  cards: GrandArchiveCard[],
  implemented = true,
): GrandArchiveCard[] => {
  return cards.filter((card) => card.implemented === implemented);
};
