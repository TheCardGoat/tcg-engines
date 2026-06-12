/**
 * Card Types (Section 6)
 *
 * Four card types with distinct behaviors and properties.
 * Provides both a unified LorcanaCardDefinition and discriminated union types
 * for type-safe access to card-type-specific properties.
 */

import type {
  ActionAbility,
  ActivatedAbility,
  KeywordAbility,
  ReplacementAbility,
  StaticAbility,
  TriggeredAbility,
} from "../abilities/ability-types";
import type { Classification } from "./classifications";
import type { InkType } from "./ink-types";
import type { CardPublicId } from "../branded";

/** Card Types (Section 6) */
export const CARD_TYPES = ["character", "action", "item", "location"] as const;
export type CardType = (typeof CARD_TYPES)[number];

export const LANGUAGES = ["en", "de", "fr", "it"] as const;
export type Languages = (typeof LANGUAGES)[number];

/** Action subtypes */
export type ActionSubtype = "song" | null;

/** Structured card text entry */
export interface CardTextEntry {
  title: string;
  description?: string;
}

/** Card rules text as raw text or structured entries */
export type CardText = string | CardTextEntry[];

/**
 * Base interface for all ability definitions in card data
 * Adds card-definition-specific metadata to the comprehensive ability types
 */
export interface BaseAbilityDefinition {
  /** Unique identifier for this ability instance */
  id?: string;

  /**
   * Optional name for named abilities (e.g., "I SUMMON THEE", "DISASSEMBLE")
   * Typically appears in ALL CAPS before the ability text
   */
  name?: string;

  /**
   * Original card text for this ability
   * Used for display and debugging
   */
  text?: string;
}

/**
 * Keyword ability definition
 * @example { type: "keyword", keyword: "Rush", id: "card-001-ability-1", text: "Rush" }
 * @example { type: "keyword", keyword: "Challenger", value: 3, id: "card-002-ability-1", text: "Challenger +3" }
 * @example { type: "keyword", keyword: "Shift", cost: { ink: 5 }, id: "card-003-ability-1", text: "Shift 5" }
 */
export type KeywordAbilityDefinition = BaseAbilityDefinition & KeywordAbility;

/**
 * Triggered ability definition
 * @example {
 *   type: "triggered",
 *   trigger: { event: "play", timing: "when", on: "SELF" },
 *   effect: { type: "draw", amount: 2, target: "CONTROLLER" },
 *   id: "card-001-ability-1",
 *   text: "When you play this character, draw 2 cards."
 * }
 */
export interface TriggeredAbilityDefinition
  extends BaseAbilityDefinition, Omit<TriggeredAbility, "type"> {
  type: "triggered";
}

/**
 * Activated ability definition
 * @example {
 *   type: "activated",
 *   name: "I SUMMON THEE",
 *   cost: { exert: true },
 *   effect: { type: "draw", amount: 1, target: "CONTROLLER" },
 *   id: "card-001-ability-1",
 *   text: "I SUMMON THEE {E} − Draw a card."
 * }
 */
export interface ActivatedAbilityDefinition
  extends BaseAbilityDefinition, Omit<ActivatedAbility, "type" | "name"> {
  type: "activated";
  usesPerTurn?: number;
}

/**
 * Static ability definition
 * @example {
 *   type: "static",
 *   condition: { type: "during-turn", whose: "your" },
 *   effect: { type: "gain-keyword", keyword: "Evasive", target: "SELF" },
 *   id: "card-001-ability-1",
 *   text: "During your turn, this character gains Evasive."
 * }
 */
export interface StaticAbilityDefinition
  extends BaseAbilityDefinition, Omit<StaticAbility, "type" | "name"> {
  type: "static";
}

/**
 * Action ability definition
 * @example {
 *   type: "action",
 *   effect: { type: "draw", amount: 2, target: "CONTROLLER" },
 *   id: "card-001-ability-1",
 *   text: "Draw 2 cards."
 * }
 */
export interface ActionAbilityDefinition
  extends BaseAbilityDefinition, Omit<ActionAbility, "type"> {
  type: "action";
  /**
   * When set, this action ability represents an alternative cost for playing the card.
   * - "sacrifice-item" = banish an item you control to play this card for free.
   * - "exert-4-items" = exert 4 ready items you control to play this card for free.
   * - "put-toy-character-on-deck-bottom" = put a Toy character card from your discard on the bottom of your deck to play this card for free.
   */
  alternativeCost?: "sacrifice-item" | "exert-4-items" | "put-toy-character-on-deck-bottom";
}

/**
 * Replacement ability definition
 * @example {
 *   type: "replacement",
 *   replaces: "damage-to-self",
 *   replacement: "prevent",
 *   id: "card-001-ability-1",
 *   text: "If this character would be dealt damage, prevent that damage."
 * }
 */
export interface ReplacementAbilityDefinition
  extends BaseAbilityDefinition, Omit<ReplacementAbility, "type" | "name"> {
  type: "replacement";
}

/**
 * Comprehensive ability definition type
 *
 * Represents any ability that can appear on a Lorcana card.
 * Each variant includes the full ability structure from the comprehensive
 * ability system, plus card-definition-specific metadata (id, name, text).
 *
 * This type bridges the card definition layer (static card data) with
 * the ability execution layer (runtime ability resolution).
 * 1.6.1.1. Triggered abilities continuously look for a specific condition and have an effect when that condition is met. Triggered abilities follow the rules in section 6.2.
 * 1.6.1.2. Activated abilities have a cost and an effect that occurs if that cost is paid. Activated abilities follow the rules in section 6.3.
 * 1.6.1.3. Static abilities are effects that are continuously active, either for a fixed length of time or for as long as the card generating the effect is in play. Static abilities follow the rules in section 6.4.
 * 1.6.1.4. Replacement effects are generated by some abilities. These replace one effect with another. Replacement effects follow the rules in section 6.5.
 * 1.6.1.5. Keywords are words or short phrases that represent distinct abilities. See section 8 for the full list of current keywords.
 */
export type AbilityDefinition =
  | KeywordAbilityDefinition
  | TriggeredAbilityDefinition
  | ActivatedAbilityDefinition
  | StaticAbilityDefinition
  | ActionAbilityDefinition
  | ReplacementAbilityDefinition;

// ============================================================================
// Base Card Properties (shared by all card types)
// ============================================================================

export interface I18nProperties {
  name: string;
  version?: string;
  text?: CardText;
  /** Localized labels for each choice option, index-parallel to ChoiceEffect.options */
  optionTexts?: string[];
}

/**
 * Base properties shared by all card types
 */
export interface BaseCardProperties {
  /** Unique identifier for the card */
  id: string;

  /**
   * Canonical ID for the card (e.g. "ci_27").
   * Groups reprints and alternate art as the same card; derived from Ravensburger culture_invariant_id.
   */
  canonicalId: string;

  /**
   * Other printing IDs for this card (same game card, different set/art).
   * Omitted when the card has only one printing.
   */
  reprints?: string[];

  /** Card name (Rule 6.2.4) - e.g., "Elsa" */
  name: string;

  /** Card version (Rule 6.2.5) - e.g., "Ice Queen" */
  version?: string;

  /**
   * Full name (name + version) - e.g., "Elsa - Ice Queen"
   * Used for deck building limits (max 4 copies per full name)
   * When not present, card name is equal to full name
   */
  fullName?: string;

  /** Ink type (Rule 6.2.3) - single or dual ink */
  inkType: InkType[];

  /** Ink cost (Rule 6.2.7) */
  cost: number;

  /** Inkable - has inkwell symbol (Rule 6.2.8) */
  inkable: boolean;

  /** Card abilities (includes keywords) */
  abilities?: AbilityDefinition[];

  /** Rules text - raw ability text as printed on the card */
  text?: CardText;

  /** Embedded localized card metadata */
  i18n: Record<Languages, I18nProperties>;

  /** Flavor text (not mechanically relevant) */
  flavorText?: string;

  /** Set information */
  set: string;

  /** Card number in set */
  cardNumber: number;

  /** Rarity */
  rarity?:
    | "common"
    | "uncommon"
    | "rare"
    | "super_rare"
    | "legendary"
    | "enchanted"
    | "epic"
    | "iconic"
    | "promo"
    | "special";

  /** Special rarity variant when applicable (e.g. Enchanted, Epic, Iconic, Promo) */
  specialRarity?: "enchanted" | "epic" | "iconic" | "promo" | "challenge";

  /**
   * Special card copy limit rules
   * - "no-limit": Unlimited copies allowed (e.g., Microbots)
   * - number: Custom limit (e.g., 99 for Dalmatian Puppy, 2 for The Glass Slipper)
   * - undefined: Default 4 copies per full name
   */
  cardCopyLimit?: number | "no-limit";

  /** Franchise the card belongs to (e.g., "Jungle Book", "Frozen") */
  franchise?: string;

  /** Whether the card is vanilla (no abilities/rules text) */
  vanilla?: boolean;

  /** External IDs from various systems */
  externalIds?: {
    ravensburger?: string;
    cultureInvariantId?: number;
    lorcast?: string;
    tcgPlayer?: number;
  };

  /** Printing references for cards with multiple printings */
  printings?: {
    set: string;
    collectorNumber: number;
    id: CardPublicId;
  }[];

  /**
   * Flag indicating that the card logic is not yet fully implemented
   * Used for stubbed cards during development
   */
  missingImplementation?: boolean;

  /**
   * Flag indicating that the card lacks comprehensive tests
   * Used for stubbed cards during development
   */
  missingTests?: boolean;
}

// ============================================================================
// Discriminated Union Types by Card Type
// ============================================================================

/**
 * Character Card Definition (Rule 6.1.2)
 *
 * Characters have strength, willpower, lore value, and classifications.
 * They can quest, challenge, and be challenged.
 */
export interface CharacterCard extends BaseCardProperties {
  cardType: "character";

  /** Strength (Rule 6.2.9) - damage dealt in challenges */
  strength: number;

  /** Willpower (Rule 6.2.10) - damage threshold before banishment */
  willpower: number;

  /** Lore value (Rule 6.2.11) - lore gained when questing */
  lore: number;

  /** Character classifications (Rule 6.2.6) */
  classifications?: Classification[];
}

/**
 * Action Card Definition (Rule 6.1.3)
 *
 * Actions are one-time effects that are played and then discarded.
 * Songs are a subtype of actions that can be sung by characters.
 */
export interface ActionCard extends BaseCardProperties {
  cardType: "action";

  /** Action subtype (Rule 6.3.3) - "song" for Song cards */
  actionSubtype?: ActionSubtype;
}

/**
 * Item Card Definition (Rule 6.1.4)
 *
 * Items are permanent cards that provide ongoing effects.
 * They stay in play until removed.
 */
export interface ItemCard extends BaseCardProperties {
  cardType: "item";
}

/**
 * Location Card Definition (Rule 6.5)
 *
 * Locations have a move cost, willpower, and lore value.
 * Characters can move to locations and quest at them.
 */
export interface LocationCard extends BaseCardProperties {
  cardType: "location";

  /** Move cost (Rule 6.5.5) - ink cost to move a character here */
  moveCost: number;

  /** Willpower - damage threshold before this location is banished */
  willpower: number;

  /** Lore value - lore gained when questing at this location */
  lore: number;
}

/**
 * Discriminated union of all card types
 * Use this when you need type-safe access to card-type-specific properties.
 */
export type LorcanaCard = CharacterCard | ActionCard | ItemCard | LocationCard;

// ============================================================================
// Type Guards for Card Types
// ============================================================================

/**
 * Check if a card is a character
 */
export function isCharacterCard(card: LorcanaCardDefinition): card is CharacterCard {
  return card.cardType === "character";
}

/**
 * Check if a card is an action
 */
export function isActionCard(card: LorcanaCardDefinition): card is ActionCard {
  return card.cardType === "action";
}

/**
 * Check if a card is an item
 */
export function isItemCard(card: LorcanaCardDefinition): card is ItemCard {
  return card.cardType === "item";
}

/**
 * Check if a card is a location
 */
export function isLocationCard(card: LorcanaCardDefinition): card is LocationCard {
  return card.cardType === "location";
}

/**
 * Lorcana Card Definition (Rule 6.2)
 *
 * Unified type with all properties optional based on card type.
 * Use `LorcanaCard` discriminated union for type-safe access to
 * card-type-specific properties.
 *
 * All card properties including:
 * - id, name, version, fullName
 * - inkType (single or dual)
 * - cost, inkable (inkwell symbol)
 * - cardType
 * - Character-specific: strength, willpower, lore, classifications
 * - Action-specific: actionSubtype (Song)
 * - Location-specific: moveCost
 * - abilities
 */
export interface LorcanaCardDefinition {
  /** Unique identifier for the card */
  id: string;

  /** Canonical ID (e.g. "ci_27") for same-card grouping; from Ravensburger culture_invariant_id. */
  canonicalId: string;

  /**
   * Other printing IDs for this card (same game card, different set/art).
   * Omitted when the card has only one printing.
   */
  reprints?: string[];

  /** Card name (Rule 6.2.4) - e.g., "Elsa" */
  name: string;

  /** Card version (Rule 6.2.5) - e.g., "Ice Queen" */
  version?: string;

  /**
   * Full name (name + version) - e.g., "Elsa - Ice Queen"
   * Used for deck building limits (max 4 copies per full name)
   * When not present, card name is equal to full name
   */
  fullName?: string;

  /** Ink type (Rule 6.2.3) - single or dual ink */
  inkType: InkType[];

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

  // Abilities

  /** Card abilities (includes keywords) */
  abilities?: AbilityDefinition[];

  /** Rules text - raw ability text as printed on the card */
  text?: CardText;

  /** Embedded localized card metadata */
  i18n: Record<Languages, I18nProperties>;

  /** Flavor text (not mechanically relevant) */
  flavorText?: string;

  /** Set information */
  set: string;

  /** Card number in set */
  cardNumber?: number;

  /** Rarity */
  rarity?:
    | "common"
    | "uncommon"
    | "rare"
    | "super_rare"
    | "legendary"
    | "enchanted"
    | "epic"
    | "iconic"
    | "promo"
    | "special";

  /** Special rarity variant when applicable (e.g. Enchanted, Epic, Iconic, Promo) */
  specialRarity?: "enchanted" | "epic" | "iconic" | "promo" | "challenge";

  /**
   * Special card copy limit rules
   * - "no-limit": Unlimited copies allowed (e.g., Microbots)
   * - number: Custom limit (e.g., 99 for Dalmatian Puppy, 2 for The Glass Slipper)
   * - undefined: Default 4 copies per full name
   */
  cardCopyLimit?: number | "no-limit";

  /** Franchise the card belongs to (e.g., "Jungle Book", "Frozen") */
  franchise?: string;

  /** External IDs from various systems */
  externalIds?: {
    ravensburger?: string;
    cultureInvariantId?: number;
    lorcast?: string;
    tcgPlayer?: number;
  };
}

/**
 * Get the canonical id of a card for "same card" grouping (reprints, alternate art).
 */
export function getCanonicalId(card: LorcanaCardDefinition | LorcanaCard): string {
  return card.canonicalId;
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
export function getFullName(card: LorcanaCardDefinition | LorcanaCard): string {
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
export function isDualInk(card: LorcanaCardDefinition | LorcanaCard): boolean {
  return card.inkType.length === 2;
}

/**
 * Get all ink types from a card
 */
export function getInkTypes(card: LorcanaCardDefinition | LorcanaCard): InkType[] {
  return card.inkType;
}
