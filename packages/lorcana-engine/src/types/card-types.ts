/**
 * Card Types (Section 6)
 *
 * Four card types with distinct behaviors and properties.
 */

import type { Classification } from "./classifications";
import type { InkType } from "./ink-types";
import type { Keyword } from "./keywords";

/** Card Types (Section 6) */
export const CARD_TYPES = ["character", "action", "item", "location"] as const;
export type CardType = (typeof CARD_TYPES)[number];

/** Action subtypes */
export type ActionSubtype = "song" | null;

/**
 * Ability Definition (placeholder - will be expanded in Spec 7)
 */
export interface AbilityDefinition {
  id: string;
  name?: string;
  text: string;
  type: "triggered" | "activated" | "static";
}

/**
 * Lorcana Card Definition (Rule 6.2)
 *
 * All card properties including:
 * - id, name, version, fullName
 * - inkType (single or dual)
 * - cost, inkable (inkwell symbol)
 * - cardType
 * - Character-specific: strength, willpower, lore, classifications
 * - Action-specific: actionSubtype (Song)
 * - Location-specific: moveCost
 * - keywords, abilities
 */
export interface LorcanaCardDefinition {
  /** Unique identifier for the card */
  id: string;

  /** Card name (Rule 6.2.4) - e.g., "Elsa" */
  name: string;

  /** Card version (Rule 6.2.5) - e.g., "Ice Queen" */
  version: string;

  /**
   * Full name (name + version) - e.g., "Elsa - Ice Queen"
   * Used for deck building limits (max 4 copies per full name)
   */
  fullName: string;

  /** Ink type (Rule 6.2.3) - single or dual ink */
  inkType: InkType | [InkType, InkType];

  /** Ink cost (Rule 6.2.7) */
  cost: number;

  /** Inkable - has inkwell symbol (Rule 6.2.8) */
  inkable: boolean;

  /** Card type (Rule 6.1) */
  cardType: CardType;

  // Character-specific properties (Rule 6.1.2)

  /** Strength (Rule 6.2.9) - damage dealt in challenges */
  strength?: number;

  /** Willpower (Rule 6.2.10) - damage threshold before banishment */
  willpower?: number;

  /** Lore value (Rule 6.2.11) - lore gained when questing */
  lore?: number;

  /** Character classifications (Rule 6.2.6) */
  classifications?: Classification[];

  // Action-specific properties

  /** Action subtype (Rule 6.3.3) - "song" for Song cards */
  actionSubtype?: ActionSubtype;

  // Location-specific properties (Rule 6.5)

  /** Move cost (Rule 6.5.5) - ink cost to move a character here */
  moveCost?: number;

  // Abilities and keywords

  /** Keywords on the card */
  keywords?: Keyword[];

  /** Card abilities */
  abilities?: AbilityDefinition[];

  /** Flavor text (not mechanically relevant) */
  flavorText?: string;

  /** Set information */
  set?: string;

  /** Card number in set */
  cardNumber?: string;

  /** Rarity */
  rarity?:
    | "common"
    | "uncommon"
    | "rare"
    | "super_rare"
    | "legendary"
    | "enchanted";
}

/**
 * Check if a card type is valid
 */
export function isCardType(value: unknown): value is CardType {
  return typeof value === "string" && CARD_TYPES.includes(value as CardType);
}

/**
 * Get the full name of a card (name + version)
 * Uses the stored fullName or generates it from name and version
 */
export function getFullName(card: LorcanaCardDefinition): string {
  if (card.fullName) {
    return card.fullName;
  }
  if (card.version) {
    return `${card.name} - ${card.version}`;
  }
  return card.name;
}

/**
 * Check if a card has dual ink types (Rule 6.2.3.1)
 */
export function isDualInk(card: LorcanaCardDefinition): boolean {
  return Array.isArray(card.inkType);
}

/**
 * Get all ink types from a card (handles both single and dual ink)
 */
export function getInkTypes(card: LorcanaCardDefinition): InkType[] {
  if (Array.isArray(card.inkType)) {
    return card.inkType;
  }
  return [card.inkType];
}
