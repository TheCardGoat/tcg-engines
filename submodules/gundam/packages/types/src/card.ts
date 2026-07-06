import type { BaseCardDefinition, ExternalSource, Printing } from "@tcg/card-model";
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
   * Printing-qualified record key from the source catalog (e.g. `ST04-015_p2`).
   *
   * This is NOT the canonical identity — it identifies one concrete card record
   * (a specific printing/variant). The canonical gameplay identity shared
   * across every reprint, parallel art, and BETA duplicate is `canonicalId`
   * (backfilled from `cardNumber`, see {@link CardBase.canonicalId}). Consumers
   * that need the canonical key should read `canonicalId`; the production
   * runtime catalog (`gundam-engine-lifecycle.ts`) intentionally keys by this
   * printing-qualified `id` at the printing tier.
   */
  id?: string;
  /**
   * Optional dictionary of per-source external ids, keyed by the typed
   * {@link ExternalSource} union. Gundam populates only `bandai`
   * (e.g. `{ bandai: "gundam:gd01-001" }`). Not a uniqueness anchor.
   */
  externalIds?: Partial<Record<ExternalSource, string>>;
  /** URL-safe, language-stable card slug for catalog/detail pages. Printing-qualified. */
  slug: string;
  /** Display name including subtitle/version when the catalog provides one. */
  displayName?: string;
}

export interface CardSet {
  code: string;
  name: string;
  packageId?: string;
}

/**
 * A single physical printing / variant of a Gundam card.
 *
 * Extends the cross-game {@link Printing} contract (RFC §7 / ADR-11) so a
 * Gundam printing IS-A {@link Printing}: the unified fields `id`, `artId`,
 * `setCode`, `collectorNumber`, `rarity`, `imageUrl` are inherited, and Gundam
 * adds its richer `set` object, the gameplay `cardNumber`, and the `finish`
 * distinction on top.
 *
 * `artId` is platform-derived from the parallel-art suffix: base art (no `_pN`
 * suffix on the printing id) → `artId === cardNumber`; parallel art →
 * `artId === cardNumber + "_p" + N`. BETA duplicates that reuse the canonical
 * illustration share the same `artId` (RFC §7 Gundam art layer, ADR-7).
 */
export interface CardPrinting extends Printing {
  /** Printing identity — unique within Gundam (set + collector number + finish). */
  id: string;
  /** Art identity shared by printings that reuse the same illustration. */
  artId: string;
  /** Cross-game set code for this printing. */
  setCode: string;
  /** Printed collector number for this printing. */
  collectorNumber: string;
  /** CDN/card image URL for this printing. */
  imageUrl: string;
  /** Gameplay/deckbuilding card number shared by equivalent printings (canonical seed). */
  cardNumber: string;
  /** Richer set metadata; the cross-game `setCode` is inherited from {@link Printing}. */
  set: CardSet;
  /** Game-native rarity tier (narrows the base `rarity: string`). */
  rarity: CardRarity;
  finish: PrintFinish;
  sourceImageUrl?: string;
  productName?: string;
}

export interface CardCatalogMetadata extends CardIdentity {
  /** Printed effect/rules text normalized for catalog display. */
  rulesText?: string | null;
  set?: CardSet;
  /** Source-catalog printing id for this concrete card record. */
  printNumber?: string;
  selectedPrintingId?: string | null;
  imageUrl?: string;
  sourceImageUrl?: string;
  artist?: string;
  sourceUrl?: string | null;
  legality?: CardLegality;
}

// ── Card Base ─────────────────────────────────────────────────────────────────

/**
 * Gundam card base.
 *
 * Extends the cross-game {@link BaseCardDefinition} contract (RFC §7 / ADR-11)
 * so a Gundam card IS-A {@link BaseCardDefinition}: the unified identity fields
 * (`canonicalId`, `slug`, `name`, `printings`, `externalIds`) are inherited and
 * Gundam adds its game-specific fields (`cardNumber`, `type`, stats, effects,
 * …) on top.
 *
 * Identity hierarchy (RFC §3: canonical → art → printing):
 *  - `canonicalId`: backfilled from `cardNumber` with the parallel suffix
 *    stripped — the gameplay/deckbuilding identity shared across parallel arts
 *    and BETA duplicates. Uniqueness anchor: `(gameSlug, canonicalId)`.
 *  - `printings[].artId`: art/illustration tier (see {@link CardPrinting}).
 *  - `printings[].id`: printing-qualified record key (production catalog key).
 */
export interface CardBase extends CardCatalogMetadata, BaseCardDefinition {
  /** Unique card identifier; max 4 copies per deck */
  cardNumber: string;
  name: string;
  /**
   * All known art/printing variants that share this card's gameplay identity.
   * At least one. Narrowed from the base {@link Printing}[] to Gundam's richer
   * {@link CardPrinting}[] (each element IS-A {@link Printing}).
   */
  printings: CardPrinting[];
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
   * Canonical gameplay identity — stable across every reprint, parallel art,
   * and BETA duplicate of this card. Backfilled from `cardNumber` with the
   * parallel-art suffix stripped (e.g. `ST04-015`). Inherited as required from
   * {@link BaseCardDefinition}; redeclared here only to attach this doc.
   */
  canonicalId: string;
  /**
   * Sibling printing ids that share this card's `cardNumber` (parallel arts,
   * promos, BETA duplicates). Populated by the catalog generator from the
   * cross-printing `cardNumber` map. Empty/absent when there are no siblings.
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
