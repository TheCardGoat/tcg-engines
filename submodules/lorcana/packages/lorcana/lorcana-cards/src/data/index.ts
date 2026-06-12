/**
 * Card Data Module
 *
 * This module exports card data and provides lookup utilities:
 * - Canonical cards (unique game cards, keyed by shortId)
 * - Canonical cards by printing ID (derived from generated package cards)
 * - Printings (minimal metadata from cards.aux.printing-metadata.json)
 * - Sets (card set metadata)
 * - Aux KV (cards.aux.kv.json for identity/reprint/localization lookups)
 *
 * @module data
 */

import type {
  AbilityDefinition as LorcanaAbilityDefinition,
  CardText,
  I18nProperties,
  Languages,
  LorcanaCard,
} from "@tcg/lorcana-types";
import { allCards as packageCards } from "../cards/catalog-data";

// Type definitions
export type CardType = "character" | "action" | "item" | "location";

export type InkType = "amber" | "amethyst" | "emerald" | "ruby" | "sapphire" | "steel";

export type Rarity =
  | "common"
  | "uncommon"
  | "rare"
  | "super_rare"
  | "legendary"
  | "enchanted"
  | "special";

export type SpecialRarity = "enchanted" | "epic" | "iconic" | "promo";

export type AbilityDefinition = LorcanaAbilityDefinition;

export interface CanonicalCard {
  id: string;
  canonicalId: string;
  name: string;
  version: string;
  i18n: Record<Languages, I18nProperties>;
  /** Full name (name + version) - e.g., "Elsa - Ice Queen" */
  fullName?: string;
  cardType: CardType;
  inkType: InkType | [InkType, InkType];
  cost: number;
  inkable: boolean;
  strength?: number;
  willpower?: number;
  lore?: number;
  moveCost?: number;
  classifications?: string[];
  actionSubtype?: "song" | null;
  keywords?: string[];
  rulesText: string;
  abilities?: AbilityDefinition[];
}

/** Derive display name from name + version (e.g. "Baloo - Friend and Guardian") */
export function getDisplayName(card: { name: string; version?: string }): string {
  return card.version ? `${card.name} - ${card.version}` : card.name;
}

export interface CardVariant {
  type: "regular" | "foil";
  /** Image hash from Ravensburger URL. Omitted on foil if identical to regular. */
  imageHash?: string;
  foilType?: string;
  /** Foil mask hash from Ravensburger URL */
  foilMaskHash?: string;
}

export interface CardPrinting {
  id: string;
  gameCardId: string;
  set: string;
  cardNumber: number;
  rarity: Rarity;
  specialRarity?: SpecialRarity;
  author?: string;
  flavorText?: string;
  variants: CardVariant[];
  /** Set rotation state (e.g., "CoreConstructed") */
  setRotationState?: string;
  /** Sort number for ordering within set */
  sortNumber?: number;
}

export interface CardPrintingMetadata {
  id: string;
  gameCardId: string;
  set: string;
  cardNumber: number;
  rarity: Rarity;
  specialRarity?: SpecialRarity;
  /**
   * Promo sheet code from upstream Ravensburger card_identifier (e.g. "P1", "P2", "P3").
   * Present when the printing is a promo from a Promo Set rather than a regular printing
   * of the parent set. Used by image URL builders to resolve the promo image folder
   * (e.g. P3 → EN/P03/<num>.webp) instead of the parent set folder where the promo
   * would collide with the regular printing at the same cardNumber.
   */
  promoSheetCode?: string;
  author?: string;
  flavorText?: string;
  setRotationState?: string;
  sortNumber?: number;
}

export interface SetDefinition {
  id: string;
  name: string;
  code: string;
  sortNumber: number;
  type: "EXPANSION" | "QUEST" | "GATEWAY";
  totalCards?: number;
  thumbnailUrl?: string;
}

/**
 * CardsAuxKv - Auxiliary key-value lookups for card identity, reprints, and localization.
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
  /** Map canonicalId -> base reprint IDs (excludes enchanted/epic/iconic/promo variants) */
  baseReprintIdsByCanonicalId: Record<string, string[]>;
  /** Map culture_invariant_id (as string) -> shortId for localization matching */
  localizationShortIdByCultureInvariantId: Record<string, string>;
}

// ============================================================================
// Localization Types
// ============================================================================

/**
 * Supported localization locales
 */
export const SUPPORTED_LOCALES = ["en", "de", "fr", "it"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Simulator UI locales supported by core-simulator.
 */
export const SIMULATOR_UI_LOCALES = ["en", "es", "de", "it", "pt-br"] as const;
export type SimulatorUiLocale = (typeof SIMULATOR_UI_LOCALES)[number];

const CARD_LOCALE_BY_SIMULATOR_UI_LOCALE: Record<SimulatorUiLocale, SupportedLocale> = {
  en: "en",
  es: "en",
  de: "de",
  it: "it",
  "pt-br": "en",
};

export interface SimulatorCardLocaleResolution {
  uiLocale: SimulatorUiLocale;
  cardLocale: SupportedLocale;
  usesFallback: boolean;
  fallbackReason?: "ui-locale-unsupported-by-card-data";
}

export function isSimulatorUiLocale(locale: string): locale is SimulatorUiLocale {
  return SIMULATOR_UI_LOCALES.includes(locale as SimulatorUiLocale);
}

/**
 * Resolve a simulator UI locale into an available card-data locale.
 *
 * Card data currently exists for `en`, `de`, `fr`, `it`.
 * Simulator UI supports `en`, `es`, `de`, `it`, `pt-br`.
 * `es` and `pt-br` therefore deterministically fallback to `en`.
 */
export function resolveSimulatorCardLocale(
  uiLocale: SimulatorUiLocale | string,
): SimulatorCardLocaleResolution {
  const normalizedUiLocale = isSimulatorUiLocale(uiLocale) ? uiLocale : "en";
  const cardLocale = CARD_LOCALE_BY_SIMULATOR_UI_LOCALE[normalizedUiLocale];
  const usesFallback = cardLocale !== normalizedUiLocale;

  return {
    uiLocale: normalizedUiLocale,
    cardLocale,
    usesFallback,
    ...(usesFallback ? { fallbackReason: "ui-locale-unsupported-by-card-data" as const } : {}),
  };
}

/**
 * Localized card data - only translatable fields
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
 * Localization data keyed by shortId (gameCardId)
 */
export type LocalizationData = Record<string, LocalizedCardData>;

/**
 * Image IDs mapping: printingId (e.g. "set8-057") -> Ravensburger image hash.
 * Used to rewrite EN image URLs to locale-specific hashes.
 */
export type ImageIdsByPrinting = Record<string, string>;

// Lazy-loaded image ID modules (optional; stubs committed for type-check; can be overwritten by future image-ids generator)
const imageIdsModules: Record<Exclude<SupportedLocale, "en">, () => Promise<unknown>> = {
  de: () => import("./localization-de-image-ids.json").catch(() => ({})),
  fr: () => import("./localization-fr-image-ids.json").catch(() => ({})),
  it: () => import("./localization-it-image-ids.json").catch(() => ({})),
};
const imageIdsCache = new Map<Exclude<SupportedLocale, "en">, ImageIdsByPrinting>();

/**
 * Load image ID mappings for a locale.
 * Returns printingId -> hash for rewriting Ravensburger image URLs to locale-specific hashes.
 *
 * @param locale - The locale to load (de, fr, it)
 * @returns Promise resolving to the image IDs map, or empty object if not available
 */
export async function getImageIdsForLocale(
  locale: Exclude<SupportedLocale, "en">,
): Promise<ImageIdsByPrinting> {
  if (imageIdsCache.has(locale)) {
    return imageIdsCache.get(locale)!;
  }
  const loader = imageIdsModules[locale];
  if (!loader) {
    return {};
  }
  try {
    const data = (await loader()) as ImageIdsByPrinting;
    imageIdsCache.set(locale, data);
    return data;
  } catch {
    return {};
  }
}

/**
 * Check if a string is a supported locale
 */
export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

function cardTextToRulesText(text?: CardText): string | undefined {
  if (!text) {
    return undefined;
  }

  if (typeof text === "string") {
    return text;
  }

  const serialized = text
    .map((entry) =>
      (entry.description ? `${entry.title} ${entry.description}` : entry.title).trim(),
    )
    .filter(Boolean)
    .join("\n")
    .trim();

  return serialized || undefined;
}

function normalizeInkType(inkType: LorcanaCard["inkType"]): CanonicalCard["inkType"] {
  const firstInk = inkType[0];
  if (!firstInk) {
    throw new Error("Lorcana card is missing ink type");
  }

  const secondInk = inkType[1];
  return secondInk ? [firstInk, secondInk] : firstInk;
}

function fallbackPrintingId(card: LorcanaCard): string {
  const setNumber = Number.parseInt(card.set, 10);
  const setId = Number.isNaN(setNumber) ? `set${card.set.toLowerCase()}` : `set${setNumber}`;
  const cardNumber = String(card.cardNumber).padStart(3, "0");
  const base = `${setId}-${cardNumber}`;
  return card.specialRarity ? `${base}-${card.specialRarity}` : base;
}

function toCanonicalCard(card: LorcanaCard): CanonicalCard {
  const version = card.version ?? "";
  return {
    id: card.id,
    canonicalId: card.canonicalId,
    name: card.name,
    version,
    i18n: card.i18n,
    fullName: card.fullName ?? getDisplayName({ name: card.name, version }),
    cardType: card.cardType,
    inkType: normalizeInkType(card.inkType),
    cost: card.cost,
    inkable: card.inkable,
    ...(card.cardType === "character"
      ? {
          strength: card.strength,
          willpower: card.willpower,
          lore: card.lore,
          classifications: card.classifications,
        }
      : {}),
    ...(card.cardType === "location"
      ? {
          willpower: card.willpower,
          lore: card.lore,
          moveCost: card.moveCost,
        }
      : {}),
    ...(card.cardType === "action" ? { actionSubtype: card.actionSubtype ?? null } : {}),
    rulesText: cardTextToRulesText(card.text) ?? "",
    ...(card.abilities ? { abilities: card.abilities } : {}),
  };
}

function toEmbeddedI18nProperties(localized: LocalizedCardData): I18nProperties {
  return {
    name: localized.name,
    ...(localized.version ? { version: localized.version } : {}),
    ...(localized.text ? { text: localized.text } : {}),
  };
}

function getEmbeddedLocalization(
  card: CanonicalCard,
  locale: SupportedLocale,
  localizationData?: LocalizationData,
): I18nProperties | undefined {
  const embedded = card.i18n?.[locale];
  if (embedded) {
    return embedded;
  }

  if (locale === "en") {
    return {
      name: card.name,
      ...(card.version ? { version: card.version } : {}),
      ...(card.rulesText ? { text: card.rulesText } : {}),
    };
  }

  const external = localizationData?.[card.id];
  if (!external) {
    return undefined;
  }

  return toEmbeddedI18nProperties(external);
}

// Import generated auxiliary data. The canonical card records are derived from
// generated package cards so runtime builds do not require canonical-cards.json.
import auxKvData from "./cards.aux.kv.json";
import printingMetadataData from "./cards.aux.printing-metadata.json";
import setsData from "./sets.json";

/** Printings from minimal metadata (replaces full printings.json) */
export const printings = printingMetadataData as unknown as Record<string, CardPrintingMetadata>;

/** Aux KV for identity/reprint/localization lookups */
export const cardsAuxKv = auxKvData as unknown as CardsAuxKv;

/** Sets data */
export const sets = setsData as unknown as Record<string, SetDefinition>;

// ============================================================================
// Build canonical card indexes from generated package cards
// ============================================================================

/** Canonical cards keyed by shortId (derived from generated package card files) */
export const canonicalCards: Record<string, CanonicalCard> = {};

/** Canonical cards keyed by printingId (derived from package cards and aux printing maps) */
export const canonicalCardsByPrintingId: Record<string, CanonicalCard> = {};

const canonicalCardsByCanonicalId = new Map<string, CanonicalCard>();

for (const packageCard of packageCards) {
  const canonicalCard = toCanonicalCard(packageCard);
  canonicalCards[canonicalCard.id] = canonicalCard;
  if (!canonicalCardsByCanonicalId.has(canonicalCard.canonicalId)) {
    canonicalCardsByCanonicalId.set(canonicalCard.canonicalId, canonicalCard);
  }

  const ownPrintingId = fallbackPrintingId(packageCard);
  const printingId = packageCard.reprints?.includes(ownPrintingId)
    ? ownPrintingId
    : (packageCard.reprints?.find(
        (id) => cardsAuxKv.printingIdToShortId[id] === canonicalCard.id,
      ) ?? ownPrintingId);
  canonicalCardsByPrintingId[printingId] = canonicalCard;
}

for (const [printingId, shortId] of Object.entries(cardsAuxKv.printingIdToShortId)) {
  if (canonicalCardsByPrintingId[printingId]) {
    continue;
  }

  const directCard = canonicalCards[shortId];
  if (directCard) {
    canonicalCardsByPrintingId[printingId] = directCard;
    continue;
  }

  const canonicalId = cardsAuxKv.canonicalIdByShortId[shortId];
  const representativeShortId = canonicalId
    ? cardsAuxKv.representativeShortIdByCanonicalId[canonicalId]
    : undefined;
  const representative =
    (representativeShortId ? canonicalCards[representativeShortId] : undefined) ??
    (canonicalId ? canonicalCardsByCanonicalId.get(canonicalId) : undefined);

  if (representative) {
    const derivedCard = {
      ...representative,
      id: shortId,
      canonicalId: canonicalId ?? representative.canonicalId,
    };
    canonicalCards[shortId] = derivedCard;
    canonicalCardsByPrintingId[printingId] = derivedCard;
  }
}

for (const [printingId, shortId] of Object.entries(cardsAuxKv.printingIdToShortId)) {
  if (canonicalCardsByPrintingId[printingId]) {
    continue;
  }

  const printing = printings[printingId];
  if (!printing) {
    continue;
  }

  const sibling = Object.values(printings).find(
    (candidate) =>
      candidate.id !== printingId &&
      candidate.set === printing.set &&
      candidate.cardNumber === printing.cardNumber &&
      candidate.specialRarity === printing.specialRarity &&
      candidate.promoSheetCode === printing.promoSheetCode &&
      Boolean(canonicalCardsByPrintingId[candidate.id]),
  );
  const siblingCard = sibling ? canonicalCardsByPrintingId[sibling.id] : undefined;
  const canonicalId = cardsAuxKv.canonicalIdByShortId[shortId];

  if (siblingCard) {
    const derivedCard = {
      ...siblingCard,
      id: shortId,
      canonicalId: canonicalId ?? siblingCard.canonicalId,
    };
    canonicalCards[shortId] = derivedCard;
    canonicalCardsByPrintingId[printingId] = derivedCard;
  }
}

// ============================================================================
// Localization System
// ============================================================================

// Cache for loaded localization data
const localizationCache: Map<SupportedLocale, LocalizationData> = new Map();

/**
 * Load localization data for a locale
 * Uses lazy loading and caching for efficiency
 *
 * @param locale - The locale to load (e.g., 'de', 'fr', 'it')
 * @returns Promise resolving to the localization data
 * @throws Error if locale is not supported or data cannot be loaded
 */
export async function loadLocalization(locale: SupportedLocale): Promise<LocalizationData> {
  // Check if locale is supported
  if (!isSupportedLocale(locale)) {
    throw new Error(`Unsupported locale: ${locale}`);
  }

  // English is the canonical source, no localization needed
  if (locale === "en") {
    return {};
  }

  return {};
}

/**
 * Get localized version of a canonical card
 * Returns the card with translated name, version, rules text, and flavor text
 *
 * Falls back to English if localization is not available.
 *
 * @param shortId - The canonical card short ID (e.g., '100')
 * @param locale - The target locale (e.g., 'de', 'fr', 'it')
 * @returns Promise resolving to the localized card (or English fallback)
 */
export async function getLocalizedCard(
  shortId: string,
  locale: SupportedLocale,
): Promise<CanonicalCard | undefined> {
  const card = canonicalCards[shortId];

  if (!card || locale === "en") {
    return card;
  }

  const localization = card.i18n?.[locale] ? undefined : await loadLocalization(locale);

  // Use the sync version with fallback logic
  return getLocalizedCardSync(shortId, locale, localization ?? {});
}

/**
 * Check if a card has localization available for a given locale
 */
export function hasLocalization(shortId: string, localizationData: LocalizationData): boolean {
  return shortId in localizationData;
}

/**
 * Get localized card data with fallback information
 * Returns both the card and whether localization was found
 */
export function getLocalizedCardWithFallback(
  shortId: string,
  locale: SupportedLocale,
  localizationData: LocalizationData,
): {
  card: CanonicalCard | undefined;
  isLocalized: boolean;
  isFallback: boolean;
} {
  const card = canonicalCards[shortId];

  if (!card) {
    return { card: undefined, isLocalized: false, isFallback: false };
  }

  // English is the canonical source
  if (locale === "en") {
    return { card, isLocalized: true, isFallback: false };
  }

  const localized = getEmbeddedLocalization(card, locale, localizationData);

  // No localization data - return original with fallback flag
  if (!localized) {
    return { card, isLocalized: false, isFallback: true };
  }

  // Check if localized content is identical to English (e.g., Italian API returning English)
  // We compare name and version, and loosely check rulesText (ignoring symbol differences)
  const normalizeText = (text: string) =>
    text
      ?.replace(/\{[A-Z]\}/g, "") // Remove {E}, {S}, etc.
      .replace(/\s+/g, " ") // Normalize multiple spaces to single space
      .trim() || "";

  const localizedRulesText = cardTextToRulesText(localized.text);
  const normalizedEnglishRules = normalizeText(card.rulesText);
  const normalizedLocalizedRules = normalizeText(localizedRulesText ?? "");

  const english = card.i18n?.en ?? {
    name: card.name,
    ...(card.version ? { version: card.version } : {}),
    ...(card.rulesText ? { text: card.rulesText } : {}),
  };

  const isSameAsEnglish =
    localized.name === english.name &&
    (localized.version ?? "") === (english.version ?? "") &&
    normalizedLocalizedRules === normalizedEnglishRules;

  if (isSameAsEnglish) {
    return { card, isLocalized: false, isFallback: true };
  }

  // Return localized card (display name derived via getDisplayName when needed)
  return {
    card: {
      ...card,
      name: localized.name,
      version: localized.version ?? "",
      fullName: localized.version ? `${localized.name} - ${localized.version}` : localized.name,
      rulesText: localizedRulesText ?? "",
    },
    isLocalized: true,
    isFallback: false,
  };
}

/**
 * Synchronously get a localized card (requires pre-loaded localization data)
 * Useful for server-side rendering where localization data is already loaded
 *
 * Falls back to English if:
 * - Card not found
 * - Locale is 'en' (canonical source)
 * - No localization data for the card
 * - Localized content is identical to English
 *
 * Also falls back via canonicalId representative mapping for non-representative printings.
 *
 * @param shortId - The canonical card short ID
 * @param locale - The target locale
 * @param localizationData - Pre-loaded localization data
 * @returns The localized card, or the English fallback if not available
 */
export function getLocalizedCardSync(
  shortId: string,
  locale: SupportedLocale,
  localizationData: LocalizationData,
): CanonicalCard | undefined {
  // Try direct lookup first
  const result = getLocalizedCardWithFallback(shortId, locale, localizationData);

  // If we found localization, return it
  if (result.isLocalized) {
    return result.card;
  }

  // If we have the card but no localization, try canonicalId fallback
  if (result.card && !result.isLocalized) {
    const canonicalId = cardsAuxKv.canonicalIdByShortId[shortId];
    if (canonicalId) {
      const representativeShortId = cardsAuxKv.representativeShortIdByCanonicalId[canonicalId];
      if (representativeShortId && representativeShortId !== shortId) {
        // Try looking up via representative shortId
        const representativeResult = getLocalizedCardWithFallback(
          representativeShortId,
          locale,
          localizationData,
        );
        if (representativeResult.isLocalized) {
          // Return the card with localized data from representative
          return {
            ...result.card,
            name: representativeResult.card!.name,
            version: representativeResult.card!.version,
            rulesText: representativeResult.card!.rulesText,
          };
        }
      }
    }
  }

  return result.card;
}

/**
 * Pre-load all localizations into cache
 * Useful for server-side rendering or when you know you'll need multiple locales
 */
export async function preloadAllLocalizations(): Promise<void> {
  const locales: SupportedLocale[] = ["de", "fr", "it"];
  await Promise.all(locales.map((locale) => loadLocalization(locale)));
}

/**
 * Clear the localization cache
 * Useful for memory management or testing
 */
export function clearLocalizationCache(): void {
  localizationCache.clear();
}

/**
 * Get the size of the localization cache
 */
export function getLocalizationCacheSize(): number {
  return localizationCache.size;
}

/**
 * Get the localized display name for a franchise.
 * Uses searchableKeywords in localization data: entries like ["Little Mermaid", "La Petite Sirène"]
 * have the English name first and localized name second.
 *
 * @param englishName - The canonical English franchise name (e.g. "Little Mermaid")
 * @param locale - Target locale (e.g. "fr", "de", "it")
 * @param localizationData - Pre-loaded localization data for the locale
 * @returns Localized franchise name, or English if no translation exists
 */
export function getLocalizedFranchiseName(
  englishName: string,
  locale: SupportedLocale,
  localizationData: LocalizationData,
): string {
  if (locale === "en") return englishName;
  if (Object.keys(localizationData).length === 0) return englishName;

  const normalizedEnglish = englishName.trim();
  if (!normalizedEnglish) return englishName;

  for (const entry of Object.values(localizationData)) {
    const keywords = entry.searchableKeywords ?? [];
    const idx = keywords.findIndex(
      (k) => k.trim().toLowerCase() === normalizedEnglish.toLowerCase(),
    );
    if (idx === -1) continue;

    // Found a match - pick the localized variant (one that differs from English)
    const other = keywords.filter(
      (k, i) => i !== idx && k.trim().toLowerCase() !== normalizedEnglish.toLowerCase(),
    );
    if (other.length > 0) {
      return other[0]!;
    }
    // Only one keyword, same as English (e.g. "Bambi") - no translation
    return englishName;
  }
  return englishName;
}

// Computed collections
const allCanonicalCards: CanonicalCard[] = Object.values(canonicalCards);
export const allPrintings: CardPrintingMetadata[] = Object.values(printings);
export const allSets: SetDefinition[] = Object.values(sets).sort(
  (a: SetDefinition, b: SetDefinition) => a.sortNumber - b.sortNumber,
);

// ============================================================================
// Ravensburger Image URL Helpers
// ============================================================================

const RAVENSBURGER_IMAGE_BASE = "https://api.lorcana.ravensburger.com/images/en";

/**
 * Build a full Ravensburger image URL from set, card number, and hash.
 */
export function buildRavensburgerImageUrl(set: string, cardNumber: number, hash: string): string {
  return `${RAVENSBURGER_IMAGE_BASE}/${set}/${cardNumber}_${hash}.jpg`;
}

// ============================================================================
// Lookup Utilities using Aux KV
// ============================================================================

/**
 * Get a canonical card by its short ID
 */
export function getCanonicalCard(shortId: string): CanonicalCard | undefined {
  return canonicalCards[shortId];
}

/**
 * Get all printing IDs for a card (by shortId or canonicalId)
 */
export function getPrintingIdsForCard(shortIdOrCanonicalId: string): string[] {
  // Check if it's a canonicalId (starts with ci_)
  if (shortIdOrCanonicalId.startsWith("ci_")) {
    return cardsAuxKv.printingIdsByCanonicalId[shortIdOrCanonicalId] ?? [];
  }
  // Otherwise treat as shortId
  const canonicalId = cardsAuxKv.canonicalIdByShortId[shortIdOrCanonicalId];
  if (canonicalId) {
    return cardsAuxKv.printingIdsByCanonicalId[canonicalId] ?? [];
  }
  return [];
}

/**
 * Get a printing by its ID (e.g., "set10-001")
 */
export function getPrinting(printingId: string): CardPrintingMetadata | undefined {
  return printings[printingId];
}

/**
 * Get all printings for a canonical card (by shortId or canonicalId)
 */
export function getPrintingsForCard(shortIdOrCanonicalId: string): CardPrintingMetadata[] {
  return getPrintingIdsForCard(shortIdOrCanonicalId)
    .map((id) => printings[id])
    .filter((p): p is CardPrintingMetadata => p !== undefined);
}

/**
 * Get the canonical card for a printing
 */
export function getCardForPrinting(printingId: string): CanonicalCard | undefined {
  const shortId = cardsAuxKv.printingIdToShortId[printingId];
  if (!shortId) {
    return undefined;
  }
  return canonicalCards[shortId];
}

/**
 * Get a set by its ID
 */
export function getSet(setId: string): SetDefinition | undefined {
  return sets[setId];
}

/**
 * Get all cards in a set (as printings)
 */
export function getCardsInSet(setId: string): CardPrintingMetadata[] {
  return allPrintings.filter((p) => p.set === setId);
}

/**
 * Get all reprint IDs for a card (by shortId or canonicalId)
 * Returns all base printing IDs (excludes enchanted/epic/iconic/promo variants)
 */
export function getReprintIds(shortIdOrCanonicalId: string): string[] {
  // Check if it's a canonicalId (starts with ci_)
  if (shortIdOrCanonicalId.startsWith("ci_")) {
    return cardsAuxKv.baseReprintIdsByCanonicalId[shortIdOrCanonicalId] ?? [];
  }
  // Otherwise treat as shortId
  const canonicalId = cardsAuxKv.canonicalIdByShortId[shortIdOrCanonicalId];
  if (canonicalId) {
    return cardsAuxKv.baseReprintIdsByCanonicalId[canonicalId] ?? [];
  }
  return [];
}

/**
 * Search cards by name (case-insensitive)
 */
export function searchCardsByName(query: string): CanonicalCard[] {
  const lowerQuery = query.toLowerCase();
  return allCanonicalCards.filter(
    (card) =>
      card.name.toLowerCase().includes(lowerQuery) ||
      getDisplayName(card).toLowerCase().includes(lowerQuery),
  );
}

/**
 * Search cards by name with localization support
 * Searches in the specified locale's card names
 */
export async function searchCardsByNameLocalized(
  query: string,
  locale: SupportedLocale,
): Promise<CanonicalCard[]> {
  const lowerQuery = query.toLowerCase();

  // If English, use the standard search
  if (locale === "en") {
    return searchCardsByName(query);
  }

  // Load localization data
  return allCanonicalCards.filter((card) => {
    // Check English name first
    if (
      card.name.toLowerCase().includes(lowerQuery) ||
      getDisplayName(card).toLowerCase().includes(lowerQuery)
    ) {
      return true;
    }

    // Check localized name via shortId
    const localized = card.i18n?.[locale];
    if (localized) {
      const localizedDisplayName = localized.version
        ? `${localized.name} - ${localized.version}`
        : localized.name;
      return (
        localized.name.toLowerCase().includes(lowerQuery) ||
        localizedDisplayName.toLowerCase().includes(lowerQuery)
      );
    }

    return false;
  });
}

/**
 * Get cards by type
 */
export function getCardsByType(cardType: CardType): CanonicalCard[] {
  return allCanonicalCards.filter((card) => card.cardType === cardType);
}

/**
 * Get cards by ink type
 */
export function getCardsByInkType(inkType: InkType): CanonicalCard[] {
  return allCanonicalCards.filter((card) => {
    if (Array.isArray(card.inkType)) {
      return card.inkType.includes(inkType);
    }
    return card.inkType === inkType;
  });
}
