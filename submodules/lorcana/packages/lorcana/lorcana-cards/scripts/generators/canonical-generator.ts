/**
 * Canonical Cards Generator
 *
 * Generates canonical-cards.json from grouped input cards.
 * Identity is by canonical key (normalized full name); one shortId per unique card.
 * Uses merged text from Lorcast (which has symbols) and Ravensburger data.
 */

import { resolvePlaceholders } from "../../src/parser";
import { getMergedRulesText } from "../parsers/data-merger";
import { stripReminderText } from "../utils/reminder-text";
import {
  createMatchKey,
  extractLegalities,
  getFullNameFromCard,
  getSpecialRarity,
} from "../parsers/input-parser";
import type { PrintingItem } from "../parsers/input-parser";
import type {
  LorcastFullCard,
  LorcastFullIndex,
  LorcastTextIndex,
} from "../parsers/lorcast-parser";
import type {
  AbilityDefinition,
  CanonicalActionCard,
  CanonicalCard,
  CanonicalCharacterCard,
  CanonicalItemCard,
  CanonicalLocationCard,
  CardLegalities,
  CardType,
  ExternalIds,
  I18nProperties,
  InkType,
  InputCard,
  Languages,
  PipelineIdMapping,
} from "../types";

/**
 * Map ink color names from input to our enum
 */
function mapInkColor(color: string): InkType {
  const colorMap: Record<string, InkType> = {
    AMBER: "amber",
    AMETHYST: "amethyst",
    EMERALD: "emerald",
    RUBY: "ruby",
    SAPPHIRE: "sapphire",
    STEEL: "steel",
  };

  return colorMap[color.toUpperCase()] || "amber";
}

/**
 * Extract ink type(s) from magic_ink_colors array
 * Always returns an array for consistency
 */
function extractInkType(colors: string[]): InkType[] {
  if (colors.length === 0) return [];
  if (colors.length === 1) return [mapInkColor(colors[0])];

  // Dual ink - return as array
  return [mapInkColor(colors[0]), mapInkColor(colors[1])];
}

/**
 * Extract keywords from abilities array
 * Keywords are capitalized to match the engine's Keyword type
 */
const KNOWN_KEYWORDS: Record<string, string> = {
  alert: "Alert",
  bodyguard: "Bodyguard",
  boost: "Boost",
  challenger: "Challenger",
  evasive: "Evasive",
  reckless: "Reckless",
  resist: "Resist",
  rush: "Rush",
  shift: "Shift",
  singer: "Singer",
  support: "Support",
  ward: "Ward",
};

function extractKeywords(abilities: string[]): string[] {
  const keywords: string[] = [];

  for (const ability of abilities) {
    const lower = ability.toLowerCase();
    if (lower in KNOWN_KEYWORDS) {
      keywords.push(KNOWN_KEYWORDS[lower]);
    } else if (lower.startsWith("shift ")) {
      keywords.push("Shift");
    } else if (lower.startsWith("singer ")) {
      keywords.push("Singer");
    } else if (lower.startsWith("resist ")) {
      keywords.push("Resist");
    } else if (lower.startsWith("challenger ")) {
      keywords.push("Challenger");
    } else if (lower.startsWith("boost ")) {
      keywords.push("Boost");
    }
  }

  return keywords;
}

/**
 * Clean abilities for action cards: remove name property when it's null
 */
function cleanAbilitiesForAction(abilities: AbilityDefinition[]): AbilityDefinition[] {
  return abilities.map((ability) => {
    if (ability.name === null) {
      // Omit name property for action cards when null
      const { name: _name, ...rest } = ability;
      return rest;
    }
    return ability;
  });
}

/**
 * Find the base printing of a card group (non-special rarity)
 */
function findBasePrinting(
  cards: Array<InputCard & { cardType: CardType }>,
): InputCard & { cardType: CardType } {
  // Find the first card that's not a special rarity
  for (const card of cards) {
    if (!getSpecialRarity(card)) {
      return card;
    }
  }

  // If all are special, just return the first one
  return cards[0];
}

/**
 * Extract franchise from searchable_keywords
 */
function extractFranchise(card: InputCard): string | undefined {
  if (card.searchable_keywords && card.searchable_keywords.length > 0) {
    return card.searchable_keywords[0];
  }
  return undefined;
}

/**
 * Build external IDs object from card data
 * Lorcast + TCGPlayer: from Lorcast API (tcgplayer_id)
 */
function buildExternalIds(
  card: InputCard,
  lorcastCardIndex?: LorcastFullIndex,
): ExternalIds | undefined {
  const externalIds: ExternalIds = {};

  // Lorcast and TCGPlayer IDs (Lorcast API provides tcgplayer_id)
  if (lorcastCardIndex) {
    const key = createMatchKey(card.name, card.subtitle);
    const lorcastEntry = lorcastCardIndex.get(key);
    if (lorcastEntry) {
      if (lorcastEntry.id) {
        externalIds.lorcast = lorcastEntry.id;
      }
      if (lorcastEntry.tcgplayer_id != null) {
        externalIds.tcgPlayer = lorcastEntry.tcgplayer_id;
      }
    }
  }

  // Only return if we have at least one ID
  return Object.keys(externalIds).length > 0 ? externalIds : undefined;
}

/**
 * Extract additional metadata from Lorcast card data
 */
function extractLorcastMetadata(lorcastCard: LorcastFullCard | undefined): {
  layout?: "normal" | "landscape";
  legalities?: CardLegalities;
  releasedAt?: string;
  language?: string;
  illustrators?: string[];
} {
  if (!lorcastCard) {
    return {};
  }

  const metadata: {
    layout?: "normal" | "landscape";
    legalities?: CardLegalities;
    releasedAt?: string;
    language?: string;
    illustrators?: string[];
  } = {};

  // Layout
  if (lorcastCard.layout === "normal" || lorcastCard.layout === "landscape") {
    metadata.layout = lorcastCard.layout;
  }

  // Legalities
  const legalities = extractLegalities(lorcastCard.legalities);
  if (legalities) {
    metadata.legalities = legalities;
  }

  // Release date
  if (lorcastCard.released_at) {
    metadata.releasedAt = lorcastCard.released_at;
  }

  // Language
  if (lorcastCard.lang) {
    metadata.language = lorcastCard.lang;
  }

  // Illustrators
  if (lorcastCard.illustrators && lorcastCard.illustrators.length > 0) {
    metadata.illustrators = lorcastCard.illustrators;
  }

  return metadata;
}

function getLocationLore(card: InputCard): number {
  return card.quest_value ?? card.lore ?? 0;
}

/**
 * Build ordered common properties for all card types
 * Order: String → Numeric → Boolean → Object → Array
 */
interface CommonCardProperties {
  // STRING PROPERTIES
  id: string;
  canonicalId: string;
  cardType: CardType;
  name: string;
  version: string;
  inkType: InkType[];
  franchise?: string;
  set?: string;
  cardNumber?: string;
  // NUMERIC PROPERTIES
  cost: number;
  strength?: number;
  willpower?: number;
  lore?: number;
  // BOOLEAN PROPERTIES
  inkable: boolean;
  vanilla: boolean;
  // OBJECT PROPERTIES
  externalIds?: ExternalIds;
  legalities?: CardLegalities;
  // ARRAY PROPERTIES
  keywords?: string[];
  rulesText?: string;
  abilities?: AbilityDefinition[];
  parsedAbilities?: AbilityDefinition[];
  classifications?: string[];
  illustrators?: string[];
  // OTHER
  layout?: "normal" | "landscape";
  releasedAt?: string;
  language?: string;
}

function buildCommonCardProperties(
  shortId: string,
  baseCard: InputCard & { cardType: CardType },
  rulesText: string,
  isVanilla: boolean,
  franchise: string | undefined,
  externalIds: ExternalIds | undefined,
  keywords: string[],
  lorcastMetadata: {
    layout?: "normal" | "landscape";
    legalities?: CardLegalities;
    releasedAt?: string;
    language?: string;
    illustrators?: string[];
  } = {},
  overrides?: { id?: string; canonicalId?: string },
): Partial<CommonCardProperties> {
  const id = overrides?.id ?? shortId;
  const canonicalId = overrides?.canonicalId ?? `ci_${shortId}`;

  // Normalize name: replace backtick with apostrophe (e.g. "Ghostly`s Tale" → "Ghostly's Tale")
  const normalizedName = (baseCard.name || "").replace(/`/g, "'");

  // Build object with proper property order
  const props: Partial<CommonCardProperties> = {
    // === STRING PROPERTIES ===
    id,
    cardType: baseCard.cardType,
    name: normalizedName,
    inkType: extractInkType(baseCard.magic_ink_colors || []),
  };

  // Only add version if it's not empty (normalize backtick to apostrophe)
  if (baseCard.subtitle) {
    props.version = (baseCard.subtitle || "").replace(/`/g, "'");
  }

  if (franchise) {
    props.franchise = franchise;
  }

  // === NUMERIC PROPERTIES ===
  props.cost = baseCard.ink_cost;

  // === BOOLEAN PROPERTIES ===
  props.inkable = baseCard.ink_convertible;
  // Only add vanilla if it's true
  if (isVanilla) {
    props.vanilla = isVanilla;
  }

  // === OBJECT PROPERTIES ===
  if (externalIds) {
    props.externalIds = externalIds;
  }
  props.canonicalId = canonicalId;
  if (lorcastMetadata.legalities) {
    props.legalities = lorcastMetadata.legalities;
  }

  // === ARRAY PROPERTIES ===
  if (keywords.length > 0) {
    props.keywords = keywords;
  }
  if (!isVanilla) {
    props.rulesText = rulesText;
    // Abilities skipped: parser not yet ready; do not set props.abilities or props.parsedAbilities
  }

  // Add Lorcast metadata
  if (lorcastMetadata.layout) {
    props.layout = lorcastMetadata.layout;
  }
  if (lorcastMetadata.releasedAt) {
    props.releasedAt = lorcastMetadata.releasedAt;
  }
  if (lorcastMetadata.language) {
    props.language = lorcastMetadata.language;
  }
  if (lorcastMetadata.illustrators && lorcastMetadata.illustrators.length > 0) {
    props.illustrators = lorcastMetadata.illustrators;
  }

  return props;
}

/**
 * Transform a group of cards (same full name) to a canonical card
 * Returns a discriminated union type based on the card type.
 */
export function transformToCanonicalCard(
  fullName: string,
  cards: Array<InputCard & { cardType: CardType }>,
  idMapping: { byFullName: Record<string, string> },
  lorcastIndex?: LorcastTextIndex,
  lorcastCardIndex?: LorcastFullIndex,
): CanonicalCard {
  const shortId = idMapping.byFullName[fullName];
  if (!shortId) {
    throw new Error(`No short ID found for ${fullName}`);
  }

  // Use the base printing for canonical data
  const baseCard = findBasePrinting(cards);

  // Get rules text - prefer Lorcast text (has symbols) if available
  // Resolve {d} placeholders with actual numbers from original text
  let rulesText: string;
  if (lorcastIndex) {
    const { text, originalText } = getMergedRulesText(baseCard, lorcastIndex);
    // If we have both normalized text (with {d}) and original text (with numbers),
    // resolve the placeholders
    if (originalText && originalText.trim() && text.includes("{d}")) {
      rulesText = resolvePlaceholders(text, originalText);
      // If resolution failed (patterns don't match), fall back to normalized text
      if (rulesText === text && text.includes("{d}")) {
        // Resolution didn't work, use normalized text as-is
        rulesText = text;
      }
    } else {
      rulesText = text;
    }
  } else {
    rulesText = cleanRulesText(baseCard.rules_text || "");
  }

  rulesText = stripReminderText(rulesText, "en");

  // Determine if card is vanilla (no rules text)
  const isVanilla = !rulesText || rulesText.trim() === "";

  // Extract all optional data
  const franchise = extractFranchise(baseCard);
  const externalIds = buildExternalIds(baseCard, lorcastCardIndex);
  const keywords = extractKeywords(baseCard.abilities || []);

  // Extract Lorcast metadata (layout, legalities, etc.)
  const lorcastCard = lorcastCardIndex?.get(createMatchKey(baseCard.name, baseCard.subtitle));
  const lorcastMetadata = extractLorcastMetadata(lorcastCard);

  // Build common properties
  const common = buildCommonCardProperties(
    shortId,
    baseCard,
    rulesText,
    isVanilla,
    franchise,
    externalIds,
    keywords,
    lorcastMetadata,
  );

  // Create type-specific card based on cardType
  switch (baseCard.cardType) {
    case "character": {
      const card: CanonicalCharacterCard = {
        // === STRING PROPERTIES (from common) ===
        ...(common as CommonCardProperties),
        cardType: "character",

        // === NUMERIC PROPERTIES ===
        strength: baseCard.strength ?? 0,
        willpower: baseCard.willpower ?? 0,
        lore: baseCard.quest_value ?? 0,

        // === ARRAY PROPERTIES ===
        ...(baseCard.subtypes?.length && {
          classifications: baseCard.subtypes,
        }),
      };
      return card;
    }

    case "action": {
      const isSong =
        baseCard.abilities?.some((a) => a.toLowerCase().includes("song")) ||
        baseCard.subtypes?.some((s) => s.toLowerCase() === "song");

      // Filter abilities for action cards
      const { abilities: originalAbilities, ...commonWithoutAbilities } = common;
      let cleanedAbilities = originalAbilities || [];

      // For action cards, remove name property when it's null
      cleanedAbilities = cleanAbilitiesForAction(cleanedAbilities);

      const card: CanonicalActionCard = {
        ...(commonWithoutAbilities as CommonCardProperties),
        cardType: "action",
        ...(isSong && { actionSubtype: "song" as const }),
        ...(cleanedAbilities.length > 0 && { abilities: cleanedAbilities }),
      };
      return card;
    }

    case "item": {
      const card: CanonicalItemCard = {
        ...(common as CommonCardProperties),
        cardType: "item",
      };
      return card;
    }

    case "location": {
      const card: CanonicalLocationCard = {
        // === STRING PROPERTIES (from common) ===
        ...(common as CommonCardProperties),
        cardType: "location",

        // === NUMERIC PROPERTIES ===
        moveCost: baseCard.move_cost ?? 0,
        willpower: baseCard.willpower ?? 0,
        lore: getLocationLore(baseCard),

        // === ARRAY PROPERTIES ===
        ...(baseCard.subtypes?.length && {
          classifications: baseCard.subtypes,
        }),
      };
      return card;
    }

    default: {
      // This should never happen, but TypeScript needs exhaustive handling
      const exhaustiveCheck: never = baseCard.cardType;
      throw new Error(`Unknown card type: ${exhaustiveCheck}`);
    }
  }
}

/**
 * Generate all canonical cards from grouped input cards
 */
export function generateCanonicalCards(
  cardGroups: Map<string, Array<InputCard & { cardType: CardType }>>,
  idMapping: { byFullName: Record<string, string> },
  lorcastIndex?: LorcastTextIndex,
  lorcastCardIndex?: LorcastFullIndex,
): Record<string, CanonicalCard> {
  const canonicalCards: Record<string, CanonicalCard> = {};

  for (const [fullName, cards] of cardGroups.entries()) {
    const canonical = transformToCanonicalCard(
      fullName,
      cards,
      idMapping,
      lorcastIndex,
      lorcastCardIndex,
    );
    canonicalCards[canonical.id] = canonical;
  }

  return canonicalCards;
}

/**
 * Transform a single (card, printing) to one CanonicalCard.
 * cardId must be the 3-character short id (do not use printing-id format).
 */
export function transformToCanonicalCardForPrinting(
  card: InputCard & { cardType: CardType },
  cardId: string,
  canonicalId: string,
  lorcastIndex?: LorcastTextIndex,
  lorcastCardIndex?: LorcastFullIndex,
): CanonicalCard {
  let rulesText: string;
  if (lorcastIndex) {
    const { text, originalText } = getMergedRulesText(card, lorcastIndex);
    if (originalText && originalText.trim() && text.includes("{d}")) {
      rulesText = resolvePlaceholders(text, originalText);
      if (rulesText === text && text.includes("{d}")) {
        rulesText = text;
      }
    } else {
      rulesText = text;
    }
  } else {
    rulesText = cleanRulesText(card.rules_text || "");
  }

  rulesText = stripReminderText(rulesText, "en");

  const isVanilla = !rulesText || rulesText.trim() === "";
  const franchise = extractFranchise(card);
  const externalIds = buildExternalIds(card, lorcastCardIndex);
  const keywords = extractKeywords(card.abilities || []);
  const lorcastCard = lorcastCardIndex?.get(createMatchKey(card.name, card.subtitle));
  const lorcastMetadata = extractLorcastMetadata(lorcastCard);

  const common = buildCommonCardProperties(
    cardId,
    card,
    rulesText,
    isVanilla,
    franchise,
    externalIds,
    keywords,
    lorcastMetadata,
    { id: cardId, canonicalId },
  );

  switch (card.cardType) {
    case "character": {
      const out: CanonicalCharacterCard = {
        ...(common as CommonCardProperties),
        cardType: "character",
        strength: card.strength ?? 0,
        willpower: card.willpower ?? 0,
        lore: card.quest_value ?? 0,
        ...(card.subtypes?.length && { classifications: card.subtypes }),
      };
      return out;
    }
    case "action": {
      const isSong =
        card.abilities?.some((a) => a.toLowerCase().includes("song")) ||
        card.subtypes?.some((s) => s.toLowerCase() === "song");
      const { abilities: originalAbilities, ...commonWithoutAbilities } = common;
      let cleanedAbilities = originalAbilities || [];
      cleanedAbilities = cleanAbilitiesForAction(cleanedAbilities);
      const out: CanonicalActionCard = {
        ...(commonWithoutAbilities as CommonCardProperties),
        cardType: "action",
        ...(isSong && { actionSubtype: "song" as const }),
        ...(cleanedAbilities.length > 0 && { abilities: cleanedAbilities }),
      };
      return out;
    }
    case "item": {
      return { ...(common as CommonCardProperties), cardType: "item" };
    }
    case "location": {
      const out: CanonicalLocationCard = {
        ...(common as CommonCardProperties),
        cardType: "location",
        moveCost: card.move_cost ?? 0,
        willpower: card.willpower ?? 0,
        lore: getLocationLore(card),
        ...(card.subtypes?.length && { classifications: card.subtypes }),
      };
      return out;
    }
    default: {
      const exhaustiveCheck: never = card.cardType;
      throw new Error(`Unknown card type: ${exhaustiveCheck}`);
    }
  }
}

function fullName(card: CanonicalCard): string {
  return card.version ? `${card.name} - ${card.version}` : card.name;
}

function isSpecialPrintingId(printingId: string): boolean {
  return /-(?:enchanted|epic|iconic|promo|challenge)(?:-\d+)?$/i.test(printingId);
}

function printingSet(printingId: string): string | undefined {
  return printingId.match(/^set\d+/i)?.[0]?.toLowerCase();
}

function copySharedDataFromBasePrinting(
  special: CanonicalCard,
  base: CanonicalCard,
): CanonicalCard {
  const { id, canonicalId, legalities, releasedAt, illustrators } = special;

  return {
    ...base,
    id,
    canonicalId,
    ...(legalities ? { legalities } : {}),
    ...(releasedAt ? { releasedAt } : {}),
    ...(illustrators ? { illustrators } : {}),
  };
}

/**
 * Minimal i18n so generate-cards can emit .i18n.ts before embed-card-i18n runs.
 * Non-English locales mirror English; embed-card-i18n replaces them from API data.
 */
function buildPlaceholderI18n(
  card: Pick<CanonicalCard, "name" | "version" | "rulesText">,
): Record<Languages, I18nProperties> {
  const en: I18nProperties = {
    name: card.name,
    ...(card.version ? { version: card.version } : {}),
    ...(card.rulesText ? { text: card.rulesText } : {}),
  };
  return { en, de: { ...en }, fr: { ...en }, it: { ...en } };
}

/**
 * Generate one CardDefinition per printing from expanded items and printing ids.
 * Card id is always the 3-char shortId from byPrintingId (do not change to printing-id format).
 * Record is keyed by printingId so file generator can look up the printing.
 */
export function generateCanonicalCardsFromPrintings(
  items: PrintingItem[],
  printingIdsInOrder: string[],
  idMapping: PipelineIdMapping,
  lorcastIndex?: LorcastTextIndex,
  lorcastCardIndex?: LorcastFullIndex,
  existingCanonicalCards?: Record<string, CanonicalCard>,
): Record<string, CanonicalCard> {
  const canonicalCards: Record<string, CanonicalCard> = {};
  let idx = 0;
  for (const { card } of items) {
    const printingId = printingIdsInOrder[idx];
    idx++;
    if (!printingId) {
      continue; // Item did not yield a printing (e.g. parseCardIdentifier failed)
    }
    const shortId = idMapping.byPrintingId[printingId];
    if (!shortId) {
      throw new Error(`No short ID for printing: ${printingId}`);
    }
    const canonicalKey = getFullNameFromCard(card).toLowerCase();
    const canonicalShortId = idMapping.byCanonicalKey[canonicalKey];
    const candidate = existingCanonicalCards?.[printingId]?.canonicalId;
    const canonicalId =
      candidate && candidate.startsWith("ci_") ? candidate : `ci_${canonicalShortId ?? shortId}`;
    const canonical = transformToCanonicalCardForPrinting(
      card,
      shortId,
      canonicalId,
      lorcastIndex,
      lorcastCardIndex,
    );
    const existingI18n = existingCanonicalCards?.[printingId]?.i18n;
    canonicalCards[printingId] = existingI18n
      ? { ...canonical, i18n: existingI18n }
      : { ...canonical, i18n: buildPlaceholderI18n(canonical) };
  }

  // Fix canonicalIds shared across cards with different full names
  const byCanonicalId = new Map<string, CanonicalCard[]>();
  for (const card of Object.values(canonicalCards)) {
    const list = byCanonicalId.get(card.canonicalId) ?? [];
    list.push(card);
    byCanonicalId.set(card.canonicalId, list);
  }
  for (const [, cards] of byCanonicalId) {
    const distinctFullNames = new Set(cards.map((c) => fullName(c).toLowerCase()));
    if (distinctFullNames.size <= 1) continue;
    for (const c of cards) {
      c.canonicalId = `ci_${c.id}`;
    }
  }

  // Unify canonicalId for reprints: same full name ⇒ same canonicalId (use first printing by set order)
  const byFullName = new Map<string, Array<{ card: CanonicalCard; printingId: string }>>();
  for (const [printingId, card] of Object.entries(canonicalCards)) {
    const fn = fullName(card).toLowerCase();
    const list = byFullName.get(fn) ?? [];
    list.push({ card, printingId });
    byFullName.set(fn, list);
  }
  const setNum = (printingId: string): number => {
    const m = printingId.match(/set(\d+)/i);
    return m ? Number.parseInt(m[1], 10) : 0;
  };
  const cardNum = (printingId: string): number => {
    const m = printingId.match(/-(\d+)(?:-|$)/);
    return m ? Number.parseInt(m[1], 10) : 0;
  };
  for (const [, entries] of byFullName) {
    if (entries.length <= 1) continue;
    entries.sort(
      (a, b) =>
        setNum(a.printingId) - setNum(b.printingId) ||
        cardNum(a.printingId) - cardNum(b.printingId),
    );
    const canonicalId = entries[0]!.card.canonicalId;
    for (let i = 1; i < entries.length; i++) {
      entries[i]!.card.canonicalId = canonicalId;
    }
  }

  // Special printings are alternate art / promo printings of a same-set base card. Keep their
  // unique printing id, but copy the gameplay/text payload from that base to prevent source drift.
  for (const [printingId, card] of Object.entries(canonicalCards)) {
    if (!isSpecialPrintingId(printingId)) continue;

    const set = printingSet(printingId);
    const baseEntry = Object.entries(canonicalCards).find(
      ([candidatePrintingId, candidateCard]) =>
        !isSpecialPrintingId(candidatePrintingId) &&
        candidateCard.canonicalId === card.canonicalId &&
        set !== undefined &&
        printingSet(candidatePrintingId) === set,
    );

    if (baseEntry) {
      canonicalCards[printingId] = copySharedDataFromBasePrinting(card, baseEntry[1]);
    }
  }

  // Normalize any remaining non-compliant canonicalIds (e.g. from legacy data) to ci_<shortId>
  const CANONICAL_ID_PREFIX = "ci_";
  for (const card of Object.values(canonicalCards)) {
    if (!card.canonicalId.startsWith(CANONICAL_ID_PREFIX)) {
      card.canonicalId = `${CANONICAL_ID_PREFIX}${card.id}`;
    }
  }

  return canonicalCards;
}
