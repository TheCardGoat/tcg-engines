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
  CardText,
  CardType,
  CharacterCard,
  I18nProperties,
  InkType,
  ItemCard,
  KeywordAbility,
  Languages,
  LocationCard,
  LorcanaCard,
} from "@tcg/lorcana-types";

// Import types needed for internal use
import type {
  ActionCard,
  CardText,
  CardType,
  CharacterCard,
  I18nProperties,
  InkType,
  ItemCard,
  KeywordAbility,
  Languages,
  LocationCard,
  LorcanaCard,
} from "@tcg/lorcana-types";

// ============================================================================
// Supported Locales
// ============================================================================

/**
 * Supported localization locales for Ravensburger API
 */
export const SUPPORTED_LOCALES = ["en", "de", "fr", "it"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Check if a string is a supported locale
 */
export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

// ============================================================================
// Localization Types
// ============================================================================

/**
 * Localized card data - only translatable fields
 * These are extracted from non-English Ravensburger API responses
 */
export interface LocalizedCardData {
  /** Card name in the localized language */
  name: string;

  /** Card version/subtitle in the localized language */
  version: string;

  /** Rules text with symbols in the localized language */
  rulesText: string;

  /** Structured rules text in CardText format */
  text: CardText;

  /** Flavor text in the localized language */
  flavorText: string;

  /** Searchable keywords/franchises in the localized language */
  searchableKeywords: string[];
}

/**
 * Localization data structure - keyed by shortId (gameCardId)
 */
export type LocalizationData = Record<string, LocalizedCardData>;

/**
 * Map of locale to localization data
 */
export type LocalizationMap = Partial<Record<SupportedLocale, LocalizationData>>;

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
  // Localization identity (Ravensburger culture_invariant_id for cross-locale matching)
  culture_invariant_id?: number;
  // Diagnostics only: deck_building_id from Ravensburger (not used at runtime)
  deck_building_id?: string;
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

export type SpecialRarity = "enchanted" | "epic" | "iconic" | "promo" | "challenge";

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

  /** Canonical ID for same-card grouping (same as short ID) */
  canonicalId: string;

  /** Card name (e.g., "Baloo") */
  name: string;

  /** Card version/subtitle (e.g., "Friend and Guardian") */
  version: string;

  /** Ink type(s) - always an array (single or dual ink) */
  inkType: InkType[];

  /** Ink cost to play */
  cost: number;

  /** Can be added to inkwell */
  inkable: boolean;

  /** Embedded localized card metadata */
  i18n: Record<Languages, I18nProperties>;

  /** Keywords on the card (as strings for generation) */
  keywords?: string[];

  /** Raw rules text for display (omitted for vanilla cards) */
  rulesText?: string;

  /** Parsed abilities for game logic (omitted for vanilla cards) */
  abilities?: AbilityDefinition[];

  /** Structured keyword abilities parsed from rules text */
  parsedAbilities?: AbilityDefinition[];

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

  /**
   * Card layout type
   * - "normal": Standard portrait card
   * - "landscape": Wide card (locations)
   */
  layout?: "normal" | "landscape";

  /** Card legality in different formats */
  legalities?: CardLegalities;

  /** Release date (ISO 8601 format) */
  releasedAt?: string;

  /** Language code (e.g., "en") */
  language?: string;

  /** Artist/Illustrator name(s) */
  illustrators?: string[];
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

  /** Willpower - damage threshold before this location is banished */
  willpower: number;

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
export function isCanonicalCharacter(card: CanonicalCard): card is CanonicalCharacterCard {
  return card.cardType === "character";
}

/**
 * Check if a canonical card is an action
 */
export function isCanonicalAction(card: CanonicalCard): card is CanonicalActionCard {
  return card.cardType === "action";
}

/**
 * Check if a canonical card is an item
 */
export function isCanonicalItem(card: CanonicalCard): card is CanonicalItemCard {
  return card.cardType === "item";
}

/**
 * Check if a canonical card is a location
 */
export function isCanonicalLocation(card: CanonicalCard): card is CanonicalLocationCard {
  return card.cardType === "location";
}

export interface ExternalIds {
  /** Lorcast card ID */
  lorcast?: string;

  /** TCGPlayer product ID */
  tcgPlayer?: number;
}

/**
 * Card legality in different formats
 */
export interface CardLegalities {
  /** Core Constructed format */
  core?: "legal" | "banned" | "not_legal" | "suspended" | "restricted";
  /** Draft format */
  draft?: "legal" | "banned" | "not_legal" | "suspended" | "restricted";
  /** Block format */
  block?: "legal" | "banned" | "not_legal" | "suspended" | "restricted";
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
  text?: string;
  type: "triggered" | "activated" | "static" | "keyword" | "action";
  keyword?: string;
  value?: number;
  cost?: unknown;
  shiftTarget?: string;
}

/**
 * Card Printing - Physical card instance
 *
 * Keyed by printing id (e.g. "set10-001", "set12-p3-043-promo")
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

  /** Rarity of this printing */
  rarity: Rarity;

  /** Special rarity if applicable */
  specialRarity?: SpecialRarity;

  /** Promo sheet code from card_identifier (e.g. "P3") when id uses set{N}-p3-NNN */
  promoSheetCode?: string;

  /** Artist credit (from Ravensburger) */
  author?: string;

  /** Flavor text */
  flavorText?: string;

  /** Available variants (regular, foil, etc.) */
  variants: CardVariant[];

  /** Set rotation state (e.g., "CoreConstructed") */
  setRotationState?: string;

  /** Sort number for ordering within set */
  sortNumber?: number;
}

export interface CardVariant {
  type: "regular" | "foil";
  /** Image hash from Ravensburger URL. Omitted on foil if identical to regular. */
  imageHash?: string;
  foilType?: string;
  /** Foil mask hash from Ravensburger URL */
  foilMaskHash?: string;
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
  /** Release date of the set (ISO 8601) */
  releasedAt?: string;
}

/**
 * ID Mapping for cross-reference (runtime / file format).
 * byShortId: shortId -> fullName (one representative per shortId).
 * byFullName: fullName -> shortId.
 * Full name is "name - subtitle" or just "name" if no subtitle.
 * @deprecated Use CardsAuxKv instead for runtime lookups
 */
export interface IdMapping {
  byShortId: Record<string, string>;
  byFullName: Record<string, string>;
}

// ============================================================================
// Cards Auxiliary Types (new unified identity pipeline)
// ============================================================================

/**
 * CardsAuxKv - Auxiliary key-value lookups for card identity, reprints, and localization.
 * This is the authoritative identity/reprint/localization lookup artifact.
 */
export interface CardsAuxKv {
  /** Map shortId -> canonicalId (e.g., "685" -> "ci_685") */
  canonicalIdByShortId: Record<string, string>;

  /** Map canonicalId -> representative shortId (the first/base printing) */
  representativeShortIdByCanonicalId: Record<string, string>;

  /** Map printingId -> shortId (e.g., "set11-001" -> "685") */
  printingIdToShortId: Record<string, string>;

  /** Map canonicalId -> all printing IDs for that card */
  printingIdsByCanonicalId: Record<string, string[]>;

  /** Map canonicalId -> base reprint IDs (excludes enchanted/epic/iconic/promo/challenge variants) */
  baseReprintIdsByCanonicalId: Record<string, string[]>;

  /** Map culture_invariant_id (as string) -> shortId for localization matching */
  localizationShortIdByCultureInvariantId: Record<string, string>;
}

/**
 * Minimal printing metadata for runtime use (replaces full printings.json).
 * Omits variants (use image helpers from canonical data instead).
 */
export interface CardPrintingMetadata {
  /** Printing ID (e.g., "set10-001") */
  id: string;

  /** Reference to canonical card short ID */
  gameCardId: string;

  /** Set ID (e.g., "set10") */
  set: string;

  /** Card number in set */
  cardNumber: number;

  /** Rarity of this printing */
  rarity: Rarity;

  /** Special rarity if applicable */
  specialRarity?: SpecialRarity;

  /** Promo sheet code when printing id uses set{N}-p3-NNN form */
  promoSheetCode?: string;

  /** Artist credit (from Ravensburger) */
  author?: string;

  /** Flavor text */
  flavorText?: string;

  /** Set rotation state (e.g., "CoreConstructed") */
  setRotationState?: string;

  /** Sort number for ordering within set */
  sortNumber?: number;
}

/**
 * Validation report structure for cards.aux.validation-report.json
 */
export interface CardsAuxValidationReport {
  ids: ValidationSection;
  canonicalIds: ValidationSection;
  reprints: ValidationSection;
  reprintSharedFields: ValidationSection;
  localization: ValidationSection;
}

export interface ValidationSection {
  status: "pass" | "fail";
  errors: string[];
  warnings: string[];
  counts: Record<string, number>;
}

/**
 * Pipeline ID mapping: identity by canonical key (normalized full name).
 * Used during generation; runtime derives IdMapping from canonical cards (no separate file).
 * - byShortId: shortId -> canonicalKey (for inverse lookup).
 * - byCanonicalKey: canonicalKey -> shortId (first 3-char id for that card; used for canonicalId).
 * - byPrintingId: printingId -> shortId (one unique 3-char id per printing; used for card.id).
 * Card id format is fixed: always 3 characters; do not use printing-id format.
 */
export interface PipelineIdMapping {
  byShortId: Record<string, string>;
  byCanonicalKey: Record<string, string>;
  /** One unique 3-char shortId per printing (card.id must stay 3-char; each printing gets its own id). */
  byPrintingId: Record<string, string>;
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
