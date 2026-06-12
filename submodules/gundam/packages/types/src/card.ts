import type { CardEffect } from "./effects.ts";

export type { CardEffect } from "./effects.ts";

// ── Enumerations ──────────────────────────────────────────────────────────────

export type CardColor = "blue" | "green" | "red" | "white" | "purple";

export type CardType = "unit" | "pilot" | "command" | "base" | "resource";

export type CardRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "legendRare"
  | "superRare"
  | "secretRare"
  | "promo";

export type CardLegality = "legal";

export type PrintFinish = "standard" | "parallel";

export type Zone =
  | "deck"
  | "resourceDeck"
  | "resourceArea"
  | "battleArea"
  | "baseSection"
  | "shieldArea"
  | "removalArea"
  | "hand"
  | "trash";

// ── Keyword Effects ───────────────────────────────────────────────────────────

export type KeywordEffect =
  | "Repair" // Heal at end of turn
  | "Breach" // Damage shields after kill
  | "Support" // Buff allies
  | "Blocker" // Redirect attacks
  | "FirstStrike" // Deal damage before opponent
  | "HighManeuver" // Cannot be blocked
  | "Suppression"; // Hit multiple shields

/**
 * A printed keyword on a card, with an optional numeric parameter.
 * E.g. `<Repair 1>` → `{ keyword: "Repair", value: 1 }`,
 * `<Blocker>` → `{ keyword: "Blocker" }`.
 */
export interface KeywordEffectEntry {
  keyword: KeywordEffect;
  /** Numeric parameter, e.g. 1 in <Repair 1>, 3 in <Breach 3>. Absent for parameterless keywords. */
  value?: number;
}

// ── Catalog Metadata ─────────────────────────────────────────────────────────

export interface CardIdentity {
  /**
   * Unique printing-level identifier from the source catalog.
   *
   * `cardNumber` remains the gameplay/deckbuilding identity. Consumers that
   * key engine data by definition id should continue indexing `cardNumber`.
   */
  id?: string;
  /** Stable cross-system id, e.g. `gundam:gd01-001`. */
  externalId?: string;
  /** URL-safe card slug for catalog/detail pages. */
  slug?: string;
  /** Display name including subtitle/version when the catalog provides one. */
  displayName?: string;
}

export interface CardSet {
  code: string;
  name: string;
  packageId?: string;
}

export interface CardPrinting {
  /** Unique printing id from the source catalog. */
  id: string;
  /** Printed collector number for this art/printing. */
  collectorNumber: string;
  /** Gameplay/deckbuilding card number shared by equivalent printings. */
  cardNumber: string;
  set: CardSet;
  rarity: CardRarity | null;
  finish: PrintFinish;
  imageUrl?: string;
  sourceImageUrl?: string;
  productName?: string;
}

export interface CardCatalogMetadata extends CardIdentity {
  /** Printed effect/rules text normalized for catalog display. */
  rulesText?: string | null;
  set?: CardSet;
  /** Source-catalog printing id for this concrete card record. */
  printNumber?: string;
  /** All known art/printing variants that share this card's gameplay identity. */
  printings?: CardPrinting[];
  selectedPrintingId?: string | null;
  imageUrl?: string;
  sourceImageUrl?: string;
  artist?: string;
  sourceUrl?: string | null;
  legality?: CardLegality;
}

// ── Card Base ─────────────────────────────────────────────────────────────────

interface CardBase extends CardCatalogMetadata {
  /** Unique card identifier; max 4 copies per deck */
  cardNumber: string;
  name: string;
  /** Cards may have multiple names */
  alternateNames?: string[];
  type: CardType;
  /** Resources and tokens have no color */
  color?: CardColor;
  /** Cards may have multiple traits */
  traits: string[];
  /** Source animation, manga, or product title printed for card grouping. */
  sourceTitle?: string;
  /** Resource level requirement */
  level: number;
  /** Cost paid by resting resources */
  cost: number;
  /** Raw text of the effect — used as fallback and for display */
  effect?: string;
  /** Structured effects parsed from `effect`. Engine prefers this over raw text. */
  effects?: CardEffect[];
  keywordEffects: KeywordEffectEntry[];
  rarity: CardRarity;
  illustrator?: string;
  flavorText?: string;
  /**
   * Canonical card number across all printings (e.g. the first-print number).
   * Allows linking reprints back to the original card entry.
   */
  canonicalId?: string;
  /**
   * Card numbers of other printings of this card (alternate art, promos, etc.).
   */
  reprints?: string[];
  /**
   * Localised display strings keyed by BCP-47 locale (e.g. "ja", "zh-TW").
   * Values are an object with the same shape as the translatable CardBase fields.
   */
  i18n?: Record<string, { name?: string; effect?: string; flavorText?: string }>;
}

// ── Unit Card ─────────────────────────────────────────────────────────────────

export interface UnitCard extends CardBase {
  type: "unit";
  ap: number;
  hp: number;
  /** Requirements for linking a pilot to this unit */
  linkCondition?: string;
  /** Zone reference printed on the card, if any */
  zone?: Zone;
}

// ── Pilot Card ────────────────────────────────────────────────────────────────

export interface PilotCard extends CardBase {
  type: "pilot";
  /** AP bonus added to the linked unit */
  apBonus: number;
  /** HP bonus added to the linked unit */
  hpBonus: number;
}

// ── Command Card ──────────────────────────────────────────────────────────────

export interface CommandCard extends CardBase {
  type: "command";
  /** Present when this Command has a printed 【Pilot】[Name] mode. */
  pilotName?: string;
  /** AP bonus added when this Command is played as a Pilot. */
  apBonus?: number;
  /** HP bonus added when this Command is played as a Pilot. */
  hpBonus?: number;
}

// ── Base Card ─────────────────────────────────────────────────────────────────

export interface BaseCard extends CardBase {
  type: "base";
  hp: number;
}

// ── Resource Card ─────────────────────────────────────────────────────────────

export interface ResourceCard extends CardBase {
  type: "resource";
  /** Resources have no color */
  color?: never;
}

// ── Union ─────────────────────────────────────────────────────────────────────

export type Card = UnitCard | PilotCard | CommandCard | BaseCard | ResourceCard;
