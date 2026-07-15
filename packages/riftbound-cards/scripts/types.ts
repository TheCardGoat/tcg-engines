/**
 * Type definitions for Riftbound card pipeline scripts
 *
 * This file contains types for:
 * - Riftcodex API response structure
 * - Input JSON structure (riftcodex-input.json)
 */

// ============================================================================
// Riftcodex API Types
// ============================================================================

/**
 * Paginated API response from Riftcodex
 */
export interface RiftcodexApiResponse {
  /** Array of card items */
  items: RiftcodexInputCard[];

  /** Total number of cards in the database */
  total: number;

  /** Current page number (1-indexed) */
  page: number;

  /** Number of items per page */
  size: number;

  /** Total number of pages */
  pages: number;
}

/**
 * Card attributes (stats)
 */
export interface RiftcodexCardAttributes {
  /** Energy cost to play the card */
  energy: number | null;

  /** Might stat (combat strength) */
  might: number | null;

  /** Power stat */
  power: number | null;
}

/**
 * Card type classification
 */
export type RiftcodexCardType = "Unit" | "Spell" | "Gear" | "Battlefield";

/**
 * Card rarity
 */
export type RiftcodexRarity =
  | "Common"
  | "Uncommon"
  | "Rare"
  | "Epic"
  | "Legendary";

/**
 * Card classification (type, rarity, domain)
 */
export interface RiftcodexCardClassification {
  /** Card type */
  type: RiftcodexCardType;

  /** Supertype (if any) */
  supertype: string | null;

  /** Card rarity */
  rarity: RiftcodexRarity;

  /** Domain(s) the card belongs to (e.g., ["Fury", "Calm"]) */
  domain: string[];
}

/**
 * Card text in multiple formats
 */
export interface RiftcodexCardText {
  /** Rich HTML text with symbols like :rb_exhaust:, :rb_might: */
  rich: string;

  /** Plain text version */
  plain: string;
}

/**
 * Set information
 */
export interface RiftcodexCardSet {
  /** Set identifier (e.g., "OGN") */
  set_id: string;

  /** Set display name (e.g., "Origins") */
  label: string;
}

/**
 * Media/image information
 */
export interface RiftcodexCardMedia {
  /** URL to the card image */
  image_url: string;

  /** Artist credit */
  artist: string;

  /** Accessibility text description */
  accessibility_text: string;
}

/**
 * Card metadata
 */
export interface RiftcodexCardMetadata {
  /** Cleaned card name */
  clean_name: string;

  /** Whether this is an alternate art version */
  alternate_art: boolean;

  /** Whether this card is overnumbered (beyond set size) */
  overnumbered: boolean;

  /** Whether this is a signature card */
  signature: boolean;
}

/**
 * Card orientation
 */
export type RiftcodexCardOrientation = "portrait" | "landscape";

/**
 * Complete card structure from Riftcodex API
 */
export interface RiftcodexInputCard {
  /** Unique identifier (UUID) */
  id: string;

  /** Card name */
  name: string;

  /** Riftbound ID (e.g., "ogn-021-298") */
  riftbound_id: string;

  /** TCGPlayer product ID */
  tcgplayer_id: string;

  /** Public code (e.g., "OGN-021/298") */
  public_code: string;

  /** Collector number within the set */
  collector_number: number;

  /** Card stats (energy, might, power) */
  attributes: RiftcodexCardAttributes;

  /** Card classification (type, rarity, domain) */
  classification: RiftcodexCardClassification;

  /** Card text in rich and plain formats */
  text: RiftcodexCardText;

  /** Set information */
  set: RiftcodexCardSet;

  /** Media/image information */
  media: RiftcodexCardMedia;

  /** Tags (e.g., ["Poro"]) */
  tags: string[];

  /** Card orientation */
  orientation: RiftcodexCardOrientation;

  /** Card metadata */
  metadata: RiftcodexCardMetadata;
}
