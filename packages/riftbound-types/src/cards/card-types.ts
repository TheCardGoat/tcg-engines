/**
 * Riftbound Card Type Definitions
 *
 * Core card types for Riftbound TCG.
 * Riftbound has the following card types:
 * - **Unit**: Characters that fight at battlefields
 * - **Spell**: One-time effects (Action or Reaction)
 * - **Gear**: Permanents (Equipment and other gear)
 * - **Legend**: Champion legends in the Legend Zone
 * - **Battlefield**: Locations where combat occurs
 * - **Rune**: Resource cards in the Rune Deck
 */

import type { Ability } from "../abilities";
import type { Cost, Domain } from "../abilities/cost-types";

// ============================================================================
// Branded Types
// ============================================================================

/**
 * Branded type for Card IDs
 */
export type CardId = string & { readonly __brand: "CardId" };

/**
 * Helper to create a CardId from a string
 */
export function createCardId(id: string): CardId {
  return id as CardId;
}

// ============================================================================
// Card Rarity
// ============================================================================

/**
 * Card rarity levels
 */
export type CardRarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "champion";

// ============================================================================
// Base Card Interface
// ============================================================================

/**
 * Base card interface - all cards extend from this
 */
export interface BaseCard {
  /** Unique identifier for the card */
  readonly id: CardId;

  /** Display name of the card */
  readonly name: string;

  /** Card type discriminator */
  readonly cardType: RiftboundCardType;

  /** Energy cost (numeric) */
  readonly energyCost?: number;

  /** Power cost (domain-based) */
  readonly powerCost?: Domain[];

  /** Card abilities */
  readonly abilities?: Ability[];

  /** Rules text (original card text) */
  readonly rulesText?: string;

  /** Flavor text */
  readonly flavorText?: string;

  /** Set identifier */
  readonly setId?: string;

  /** Card number within set */
  readonly cardNumber?: number;

  /** Rarity */
  readonly rarity?: CardRarity;

  /** Tags (e.g., "Mech", "Dragon", "Sand Soldier") */
  readonly tags?: string[];

  /** Domain identity (for deck building) */
  readonly domain?: Domain | Domain[];
}

/**
 * All Riftbound card types
 */
export type RiftboundCardType =
  | "unit"
  | "spell"
  | "gear"
  | "equipment"
  | "legend"
  | "battlefield"
  | "rune";

// ============================================================================
// Unit Cards
// ============================================================================

/**
 * Unit card - characters that fight at battlefields
 *
 * @example
 * {
 *   id: "aggressive-warrior",
 *   name: "Aggressive Warrior",
 *   cardType: "unit",
 *   might: 4,
 *   energyCost: 3,
 *   powerCost: ["fury"],
 *   abilities: [
 *     { type: "keyword", keyword: "Assault", value: 2 }
 *   ]
 * }
 */
export interface UnitCard extends BaseCard {
  readonly cardType: "unit";

  /** Base Might (strength) */
  readonly might: number;

  /** Unit subtypes/tags */
  readonly tags?: string[];

  /** Whether this is a token */
  readonly isToken?: boolean;

  /** Whether this is a Champion unit */
  readonly isChampion?: boolean;
}

// ============================================================================
// Spell Cards
// ============================================================================

/**
 * Spell timing
 */
export type SpellTiming = "action" | "reaction";

/**
 * Spell card - one-time effects
 *
 * @example
 * {
 *   id: "lightning-bolt",
 *   name: "Lightning Bolt",
 *   cardType: "spell",
 *   timing: "action",
 *   energyCost: 2,
 *   powerCost: ["fury"],
 *   abilities: [
 *     { type: "spell", timing: "action", effect: { type: "damage", amount: 3, target: { type: "unit", location: "battlefield" } } }
 *   ]
 * }
 */
export interface SpellCard extends BaseCard {
  readonly cardType: "spell";

  /** When can this spell be played */
  readonly timing: SpellTiming;

  /** Whether this spell has Hidden */
  readonly hasHidden?: boolean;

  /** Repeat cost if applicable */
  readonly repeatCost?: Cost;
}

// ============================================================================
// Gear Cards
// ============================================================================

/**
 * Gear card - permanents (equipment and other gear)
 *
 * @example
 * {
 *   id: "gold-token",
 *   name: "Gold",
 *   cardType: "gear",
 *   isToken: true,
 *   abilities: [
 *     { type: "activated", cost: { exhaust: true }, timing: "reaction", effect: { type: "add-resource", energy: 1 } }
 *   ]
 * }
 */
export interface GearCard extends BaseCard {
  readonly cardType: "gear";

  /** Whether this is a token */
  readonly isToken?: boolean;
}

/**
 * Equipment card - gear that attaches to units
 *
 * @example
 * {
 *   id: "sword-of-fury",
 *   name: "Sword of Fury",
 *   cardType: "equipment",
 *   mightBonus: 2,
 *   equipCost: { power: ["fury"] },
 *   abilities: [...]
 * }
 */
export interface EquipmentCard extends BaseCard {
  readonly cardType: "equipment";

  /** Might bonus when equipped */
  readonly mightBonus?: number;

  /** Cost to equip */
  readonly equipCost?: Cost;

  /** Whether this has Quick-Draw */
  readonly hasQuickDraw?: boolean;
}

// ============================================================================
// Legend Cards
// ============================================================================

/**
 * Legend card - champion legends in the Legend Zone
 *
 * @example
 * {
 *   id: "champion-legend",
 *   name: "Champion Legend",
 *   cardType: "legend",
 *   domain: ["fury", "mind"],
 *   championTag: "Warrior",
 *   abilities: [...]
 * }
 */
export interface LegendCard extends BaseCard {
  readonly cardType: "legend";

  /** Domain identity (determines deck building) */
  readonly domain: Domain | Domain[];

  /** Champion tag (for Chosen Champion) */
  readonly championTag?: string;
}

// ============================================================================
// Battlefield Cards
// ============================================================================

/**
 * Battlefield card - locations where combat occurs
 *
 * @example
 * {
 *   id: "ancient-ruins",
 *   name: "Ancient Ruins",
 *   cardType: "battlefield",
 *   abilities: [
 *     { type: "triggered", trigger: { event: "conquer", on: "controller" }, effect: { type: "draw", amount: 1 } }
 *   ]
 * }
 */
export interface BattlefieldCard extends BaseCard {
  readonly cardType: "battlefield";
}

// ============================================================================
// Rune Cards
// ============================================================================

/**
 * Rune card - resource cards in the Rune Deck
 *
 * @example
 * {
 *   id: "fury-rune",
 *   name: "Fury Rune",
 *   cardType: "rune",
 *   domain: "fury",
 *   isBasic: true
 * }
 */
export interface RuneCard extends BaseCard {
  readonly cardType: "rune";

  /** Domain of this rune */
  readonly domain: Domain;

  /** Whether this is a basic rune */
  readonly isBasic?: boolean;
}

// ============================================================================
// Union Types
// ============================================================================

/**
 * All card types
 */
export type Card =
  | UnitCard
  | SpellCard
  | GearCard
  | EquipmentCard
  | LegendCard
  | BattlefieldCard
  | RuneCard;

/**
 * Main deck cards (excludes runes, legends, battlefields)
 */
export type MainDeckCard = UnitCard | SpellCard | GearCard | EquipmentCard;

/**
 * Permanent cards (stay on board)
 */
export type PermanentCard = UnitCard | GearCard | EquipmentCard | LegendCard;

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard for unit cards
 */
export function isUnitCard(card: Card): card is UnitCard {
  return card.cardType === "unit";
}

/**
 * Type guard for spell cards
 */
export function isSpellCard(card: Card): card is SpellCard {
  return card.cardType === "spell";
}

/**
 * Type guard for gear cards
 */
export function isGearCard(card: Card): card is GearCard {
  return card.cardType === "gear";
}

/**
 * Type guard for equipment cards
 */
export function isEquipmentCard(card: Card): card is EquipmentCard {
  return card.cardType === "equipment";
}

/**
 * Type guard for legend cards
 */
export function isLegendCard(card: Card): card is LegendCard {
  return card.cardType === "legend";
}

/**
 * Type guard for battlefield cards
 */
export function isBattlefieldCard(card: Card): card is BattlefieldCard {
  return card.cardType === "battlefield";
}

/**
 * Type guard for rune cards
 */
export function isRuneCard(card: Card): card is RuneCard {
  return card.cardType === "rune";
}

/**
 * Type guard for main deck cards
 */
export function isMainDeckCard(card: Card): card is MainDeckCard {
  return (
    card.cardType === "unit" ||
    card.cardType === "spell" ||
    card.cardType === "gear" ||
    card.cardType === "equipment"
  );
}

/**
 * Type guard for permanent cards
 */
export function isPermanentCard(card: Card): card is PermanentCard {
  return (
    card.cardType === "unit" ||
    card.cardType === "gear" ||
    card.cardType === "equipment" ||
    card.cardType === "legend"
  );
}
