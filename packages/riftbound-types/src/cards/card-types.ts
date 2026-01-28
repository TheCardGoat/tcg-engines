/**
 * Riftbound Card Type Definitions
 *
 * Core card types for Riftbound TCG.
 */

import type { Ability } from "../abilities";

/**
 * Branded type for Card IDs
 */
export type CardId = string & { readonly __brand: "CardId" };

/**
 * Base card interface - all cards extend from this
 */
export interface BaseCard {
  /** Unique identifier for the card */
  readonly id: CardId;
  /** Display name of the card */
  readonly name: string;
  /** Card type discriminator */
  readonly type: string;
  /** Card abilities */
  readonly abilities?: Ability[];
  /** Flavor text */
  readonly flavorText?: string;
  /** Set identifier */
  readonly setId?: string;
  /** Card number within set */
  readonly cardNumber?: number;
  /** Rarity */
  readonly rarity?: CardRarity;
}

/**
 * Card rarity levels
 */
export type CardRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "legendary"
  | "mythic";

/**
 * Creature card type
 */
export interface CreatureCard extends BaseCard {
  readonly type: "creature";
  /** Attack power */
  readonly attack: number;
  /** Defense/health */
  readonly defense: number;
  /** Creature subtypes */
  readonly subtypes?: string[];
}

/**
 * Spell card type
 */
export interface SpellCard extends BaseCard {
  readonly type: "spell";
  /** Spell subtypes */
  readonly subtypes?: string[];
}

/**
 * Artifact card type
 */
export interface ArtifactCard extends BaseCard {
  readonly type: "artifact";
  /** Artifact subtypes */
  readonly subtypes?: string[];
}

/**
 * Location card type
 */
export interface LocationCard extends BaseCard {
  readonly type: "location";
  /** Location subtypes */
  readonly subtypes?: string[];
}

/**
 * Union type for all card types
 */
export type Card = CreatureCard | SpellCard | ArtifactCard | LocationCard;

/**
 * Type guard for creature cards
 */
export function isCreatureCard(card: Card): card is CreatureCard {
  return card.type === "creature";
}

/**
 * Type guard for spell cards
 */
export function isSpellCard(card: Card): card is SpellCard {
  return card.type === "spell";
}

/**
 * Type guard for artifact cards
 */
export function isArtifactCard(card: Card): card is ArtifactCard {
  return card.type === "artifact";
}

/**
 * Type guard for location cards
 */
export function isLocationCard(card: Card): card is LocationCard {
  return card.type === "location";
}

/**
 * Helper to create a CardId from a string
 */
export function createCardId(id: string): CardId {
  return id as CardId;
}
