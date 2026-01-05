/**
 * Type definitions for card generation scripts
 *
 * This file contains types for:
 * - Input JSON structure (lorcana-input.json)
 * - Output JSON structures (canonical cards, printings, sets)
 *
 * Uses types from @tcg/lorcana-types for card definitions to ensure
 * compatibility between generated cards and the game engine.
 */

// Re-export types from the engine for use in generation
export type {
  ActionCard,
  ActionSubtype,
  BaseCardProperties,
  CardType,
  CharacterCard,
  InkType,
  ItemCard,
  KeywordAbility,
  LocationCard,
  LorcanaCard,
} from "@tcg/lorcana-types";

// Import types needed for internal use
import type {
  ActionCard,
  CardType,
  CharacterCard,
  InkType,
  ItemCard,
  KeywordAbility,
  LocationCard,
  LorcanaCard,
} from "@tcg/lorcana-types";

// ============================================================================
// Input Types (ravensburger-input.json structure)
// ============================================================================

export interface RavensburgerInputJson {
  application_shared_properties: {
    current_app_version: string;
    minimum_app_version: string;
  };
  card_sets: InputCardSet[];
  cards: {
    characters: InputCard[];
    locations: InputCard[];
    items: InputCard[];
    actions: InputCard[];
  };
}

export interface InputCardSet {
  id: string;
  name: string;
  thumbnail_image_url: string;
  sort_number: number;
  type: "EXPANSION" | "QUEST";
}

export interface InputCardVariant {
  variant_id: "Regular" | "Foiled";
  detail_image_url: string;
  foil_type?: string;
  foil_mask_url?: string;
  foil_top_layer?: string;
  foil_top_layer_mask_url?: string;
}

export interface InputCard {
  name: string;
  subtitle?: string;
  strength?: number;
  willpower?: number;
  quest_value?: number;
  rarity: string;
  special_rarity_id?: string;
  ink_cost: number;
  author?: string;
  deck_building_id: string;
  culture_invariant_id: number;
  sort_number: number;
  additional_info: string[];
  ink_convertible: boolean;
  abilities: string[];
  subtypes: string[];
  flavor_text: string;
  rules_text: string;
  card_identifier: string;
  thumbnail_url: string;
  variants: InputCardVariant[];
  card_sets: string[];
  magic_ink_colors: string[];
  searchable_keywords: string[];
  set_rotation_state?: string;
  // Location-specific
  move_cost?: number;
  lore?: number;
  // Action-specific
  action_type?: string;
}

// ============================================================================
// Input Types (lorcast-input.json structure)
// ============================================================================

export interface LorcastInputCard {
  id: string;
  name: string;
  version: string | null;
  layout: string;
  released_at: string;
  image_uris: {
    digital: {
      small: string;
      normal: string;
      large: string;
    };
  };
  cost: number;
  inkwell: boolean;
  ink: string;
  inks: string[];
  type: string[];
  classifications: string[];
  text: string; // Key field - has symbols like {S}, {I}
  keywords: string[];
  move_cost: number | null;
  strength: number | null;
  willpower: number | null;
  lore: number | null;
  rarity: string;
  illustrators: string[];
  collector_number: string;
  lang: string;
  flavor_text: string | null;
  tcgplayer_id: number | null;
  legalities: Record<string, string>;
  set: {
    id: string;
    code: string;
    name: string;
  };
  prices: Record<string, unknown>;
}

// Type alias for backwards compatibility
export type LorcanaInputJson = RavensburgerInputJson;

// ============================================================================
// Output Types (Generated JSON structures)
// ============================================================================

// CardType and InkType are now imported from @tcg/lorcana-types

export type Rarity =
  | "common"
  | "uncommon"
  | "rare"
  | "super_rare"
  | "legendary"
  | "enchanted"
  | "special";

export type SpecialRarity = "enchanted" | "epic" | "iconic" | "promo";

// ============================================================================
// Canonical Card Types - Discriminated Union
// ============================================================================

/**
 * Base properties for all canonical cards.
 * These are metadata properties added during card generation.
 */
export interface CanonicalCardMetadata {
  /** Short generated ID (e.g., "a7x") */
  id: string;

  /** Card name (e.g., "Baloo") */
  name: string;

  /** Card version/subtitle (e.g., "Friend and Guardian") */
  version: string;

  /** Full name for display and deck building (e.g., "Baloo - Friend and Guardian") */
  fullName: string;

  /** Ink type(s) - always an array (single or dual ink) */
  inkType: InkType[];

  /** Ink cost to play */
  cost: number;

  /** Can be added to inkwell */
  inkable: boolean;

  /** Keywords on the card (as strings for generation) */
  keywords?: string[];

  /** Raw rules text for display (omitted for vanilla cards) */
  rulesText?: string;

  /** Parsed abilities for game logic (omitted for vanilla cards) */
  abilities?: AbilityDefinition[];

  /** Structured keyword abilities parsed from rules text */
  parsedAbilities?: KeywordAbility[];

  /** References to all printings of this card */
  printings: CardPrintingRef[];

  /** True if card has no rules text (no abilities to test) */
  vanilla: boolean;

  /** Franchise the card belongs to (e.g., "Jungle Book", "Frozen") */
  franchise?: string;

  /** External IDs for cross-referencing with other systems */
  externalIds?: ExternalIds;

  /** Flag indicating if the card is missing implementation */
  missingImplementation?: boolean;

  /** Flag indicating if the card is missing tests */
  missingTests?: boolean;
}

/**
 * Canonical Character Card
 *
 * Characters have strength, willpower, lore value, and classifications.
 */
export interface CanonicalCharacterCard extends CanonicalCardMetadata {
  cardType: "character";

  /** Strength - damage dealt in challenges */
  strength: number;

  /** Willpower - damage threshold before banishment */
  willpower: number;

  /** Lore value when questing */
  lore: number;

  /** Classifications (e.g., ["Storyborn", "Ally"]) */
  classifications?: string[];
}

/**
 * Canonical Action Card
 *
 * Actions are one-time effects. Songs are a subtype of actions.
 */
export interface CanonicalActionCard extends CanonicalCardMetadata {
  cardType: "action";

  /** Action subtype ("song" for Song cards) */
  actionSubtype?: "song" | null;
}

/**
 * Canonical Item Card
 *
 * Items are permanent cards that provide ongoing effects.
 */
export interface CanonicalItemCard extends CanonicalCardMetadata {
  cardType: "item";
}

/**
 * Canonical Location Card
 *
 * Locations have a move cost and lore value.
 */
export interface CanonicalLocationCard extends CanonicalCardMetadata {
  cardType: "location";

  /** Move cost - ink cost to move a character here */
  moveCost: number;

  /** Lore value when questing at this location */
  lore: number;
}

/**
 * Canonical Card - Discriminated union of all card types
 *
 * Keyed by short generated ID (e.g., "a7x")
 * Contains all rules-relevant information for a unique game card.
 * Use type guards or check `cardType` to narrow to specific card types.
 */
export type CanonicalCard =
  | CanonicalCharacterCard
  | CanonicalActionCard
  | CanonicalItemCard
  | CanonicalLocationCard;

// ============================================================================
// Type Guards for Canonical Cards
// ============================================================================

/**
 * Check if a canonical card is a character
 */
export function isCanonicalCharacter(
  card: CanonicalCard,
): card is CanonicalCharacterCard {
  return card.cardType === "character";
}

/**
 * Check if a canonical card is an action
 */
export function isCanonicalAction(
  card: CanonicalCard,
): card is CanonicalActionCard {
  return card.cardType === "action";
}

/**
 * Check if a canonical card is an item
 */
export function isCanonicalItem(
  card: CanonicalCard,
): card is CanonicalItemCard {
  return card.cardType === "item";
}

/**
 * Check if a canonical card is a location
 */
export function isCanonicalLocation(
  card: CanonicalCard,
): card is CanonicalLocationCard {
  return card.cardType === "location";
}

export interface ExternalIds {
  /** Ravensburger's deck building ID */
  ravensburger?: string;

  /** Lorcast card ID */
  lorcast?: string;

  /** TCGPlayer product ID */
  tcgPlayer?: number;
}

export interface CardPrintingRef {
  /** Set ID (e.g., "set10") */
  set: string;

  /** Collector number within the set */
  collectorNumber: number;

  /** Full printing ID (e.g., "set10-001") */
  id: string;
}

export interface AbilityDefinition {
  id?: string;
  name?: string | null;
  text: string;
  type: "triggered" | "activated" | "static" | "keyword";
}

/**
 * Card Printing - Physical card instance
 *
 * Keyed by "{setId}-{cardNumber}" (e.g., "set10-001")
 * Contains physical card metadata and variants
 */
export interface CardPrinting {
  /** Printing ID (e.g., "set10-001") */
  id: string;

  /** Reference to canonical card short ID */
  gameCardId: string;

  /** Set ID (e.g., "set10") */
  set: string;

  /** Card number in set */
  cardNumber: number;

  /** Original card identifier (e.g., "1/204 EN 10") */
  cardIdentifier: string;

  /** Rarity of this printing */
  rarity: Rarity;

  /** Special rarity if applicable */
  specialRarity?: SpecialRarity;

  /** Artist credit */
  author?: string;

  /** Flavor text */
  flavorText?: string;

  /** Available variants (regular, foil, etc.) */
  variants: CardVariant[];
}

export interface CardVariant {
  type: "regular" | "foil";
  imageUrl: string;
  thumbnailUrl?: string;
  foilType?: string;
  foilMaskUrl?: string;
}

/**
 * Set Definition
 */
export interface SetDefinition {
  id: string;
  name: string;
  code: string;
  sortNumber: number;
  type: "EXPANSION" | "QUEST";
  totalCards?: number;
  thumbnailUrl?: string;
}

/**
 * ID Mapping for cross-reference
 */
export interface IdMapping {
  byShortId: Record<string, string>;
  byDeckBuildingId: Record<string, string>;
}

// ============================================================================
// Generator Context
// ============================================================================

export interface GeneratorContext {
  idMapping: IdMapping;
  sets: Record<string, SetDefinition>;
  canonicalCards: Record<string, CanonicalCard>;
  printings: Record<string, CardPrinting>;
}
