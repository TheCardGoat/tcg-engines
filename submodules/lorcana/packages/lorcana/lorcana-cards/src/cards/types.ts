/**
 * Canonical Card Types - Discriminated Union
 *
 * Type-safe card definitions for generated Lorcana cards.
 * Uses discriminated unions to provide type-safe access to card-type-specific properties.
 */

export type CardType = "character" | "action" | "item" | "location";

export type InkType = "amber" | "amethyst" | "emerald" | "ruby" | "sapphire" | "steel";

export type Languages = "en" | "de" | "fr" | "it";

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

export interface ExternalIds {
  tcgPlayer?: number;
  lorcast?: string;
}

export interface I18nProperties {
  name: string;
  version?: string;
  text?: string | { title: string; description?: string }[];
}

/**
 * Base properties for all canonical cards
 */
export interface CanonicalCardMetadata {
  id: string;
  name: string;
  version: string;
  i18n: Record<Languages, I18nProperties>;
  inkType: InkType | [InkType, InkType];
  cost: number;
  inkable: boolean;
  rulesText?: string;
  abilities?: AbilityDefinition[];
  vanilla: boolean;
  franchise?: string;
  externalIds?: ExternalIds;
}

/**
 * Character Card - has strength, willpower, lore, and classifications
 */
export interface CanonicalCharacterCard extends CanonicalCardMetadata {
  cardType: "character";
  strength: number;
  willpower: number;
  lore: number;
  classifications?: string[];
}

/**
 * Action Card - has optional actionSubtype for Songs
 */
export interface CanonicalActionCard extends CanonicalCardMetadata {
  cardType: "action";
  actionSubtype?: "song" | null;
}

/**
 * Item Card - permanent cards with ongoing effects
 */
export interface CanonicalItemCard extends CanonicalCardMetadata {
  cardType: "item";
}

/**
 * Location Card - has moveCost and lore
 */
export interface CanonicalLocationCard extends CanonicalCardMetadata {
  cardType: "location";
  willpower: number;
  moveCost: number;
  lore: number;
}

/**
 * Canonical Card - discriminated union of all card types
 */
export type CanonicalCard =
  | CanonicalCharacterCard
  | CanonicalActionCard
  | CanonicalItemCard
  | CanonicalLocationCard;

/**
 * Type guard for character cards
 */
export function isCanonicalCharacter(card: CanonicalCard): card is CanonicalCharacterCard {
  return card.cardType === "character";
}

/**
 * Type guard for action cards
 */
export function isCanonicalAction(card: CanonicalCard): card is CanonicalActionCard {
  return card.cardType === "action";
}

/**
 * Type guard for item cards
 */
export function isCanonicalItem(card: CanonicalCard): card is CanonicalItemCard {
  return card.cardType === "item";
}

/**
 * Type guard for location cards
 */
export function isCanonicalLocation(card: CanonicalCard): card is CanonicalLocationCard {
  return card.cardType === "location";
}
