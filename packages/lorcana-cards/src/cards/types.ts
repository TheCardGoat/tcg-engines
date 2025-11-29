/**
 * Canonical Card Type
 *
 * Represents a unique game card with all rules-relevant information.
 */

export type CardType = "character" | "action" | "item" | "location";

export type InkType =
  | "amber"
  | "amethyst"
  | "emerald"
  | "ruby"
  | "sapphire"
  | "steel";

export interface AbilityDefinition {
  id?: string;
  name?: string | null;
  text: string;
  type: "triggered" | "activated" | "static" | "keyword";
}

export interface CanonicalCard {
  /** Short generated ID (e.g., "a7x") */
  id: string;

  /** Card name (e.g., "Baloo") */
  name: string;

  /** Card version/subtitle (e.g., "Friend and Guardian") */
  version: string;

  /** Full name for display and deck building (e.g., "Baloo - Friend and Guardian") */
  fullName: string;

  /** Card type */
  cardType: CardType;

  /** Ink type(s) - single or dual ink */
  inkType: InkType | [InkType, InkType];

  /** Ink cost to play */
  cost: number;

  /** Can be added to inkwell */
  inkable: boolean;

  /** Strength - characters only */
  strength?: number;

  /** Willpower - characters only */
  willpower?: number;

  /** Lore value when questing - characters and locations */
  lore?: number;

  /** Move cost - locations only */
  moveCost?: number;

  /** Classifications (e.g., ["Storyborn", "Ally"]) - characters only */
  classifications?: string[];

  /** Action subtype (song, etc.) - actions only */
  actionSubtype?: "song" | null;

  /** Keywords on the card */
  keywords?: string[];

  /** Raw rules text for display (omitted for vanilla cards) */
  rulesText?: string;

  /** Parsed abilities for game logic (omitted for vanilla cards) */
  abilities?: AbilityDefinition[];

  /** References to all printings of this card */
  printings: CardPrintingRef[];

  /** True if card has no rules text (no abilities to test) */
  vanilla: boolean;

  /** Franchise the card belongs to (e.g., "Jungle Book", "Frozen") */
  franchise?: string;

  /** External IDs for cross-referencing with other systems */
  externalIds?: ExternalIds;
}

export interface ExternalIds {
  /** Ravensburger's deck building ID */
  ravensburger?: string;

  /** Ravensburger's culture invariant ID */
  cultureInvariantId?: number;

  /** TCGPlayer product ID */
  tcgPlayer?: number;

  /** Lorcast card ID */
  lorcast?: string;
}

export interface CardPrintingRef {
  /** Set ID (e.g., "set10") */
  set: string;

  /** Collector number within the set */
  collectorNumber: number;

  /** Full printing ID (e.g., "set10-001") */
  id: string;
}
