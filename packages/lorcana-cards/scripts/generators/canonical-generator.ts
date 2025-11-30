/**
 * Canonical Cards Generator
 *
 * Generates canonical-cards.json from grouped input cards.
 * Each canonical card represents a unique game card (by deck_building_id).
 * Uses merged text from Lorcast (which has symbols) and Ravensburger data.
 */

import { getMergedRulesText } from "../parsers/data-merger";
import {
  generatePrintingId,
  getSpecialRarity,
  parseCardIdentifier,
} from "../parsers/input-parser";
import type { LorcastTextIndex } from "../parsers/lorcast-parser";
import type {
  AbilityDefinition,
  CanonicalActionCard,
  CanonicalCard,
  CanonicalCharacterCard,
  CanonicalItemCard,
  CanonicalLocationCard,
  CardPrintingRef,
  CardType,
  ExternalIds,
  IdMapping,
  InkType,
  InputCard,
  KeywordAbility,
} from "../types";
import { parseKeywordAbilities } from "./parser-validator";

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
 * Clean rules text by removing HTML tags
 */
function cleanRulesText(text: string): string {
  return text
    .replace(/<b>/g, "")
    .replace(/<\/b>/g, "")
    .replace(/<i>/g, "")
    .replace(/<\/i>/g, "")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<mark>/g, "")
    .replace(/<\/mark>/g, "")
    .trim();
}

/**
 * Parse abilities from rules_text
 * This is a simplified parser - the actual ability parsing would use the full parser
 */
function parseAbilities(rulesText: string): AbilityDefinition[] {
  const abilities: AbilityDefinition[] = [];
  const cleanedText = cleanRulesText(rulesText);

  if (!cleanedText) return abilities;

  // Split on newlines to get individual ability sections
  const sections = cleanedText.split("\n").filter((s) => s.trim());

  for (const section of sections) {
    const trimmed = section.trim();
    if (!trimmed) continue;

    // Try to extract ability name (all caps followed by text)
    const namedMatch = trimmed.match(/^([A-Z][A-Z\s]+[A-Z])\s+(.+)$/);

    if (namedMatch) {
      abilities.push({
        name: namedMatch[1].trim(),
        text: trimmed,
        type: inferAbilityType(trimmed),
      });
    } else {
      // Keyword or unnamed ability
      abilities.push({
        name: null,
        text: trimmed,
        type: inferAbilityType(trimmed),
      });
    }
  }

  return abilities;
}

/**
 * Infer ability type from text
 */
function inferAbilityType(
  text: string,
): "triggered" | "activated" | "static" | "keyword" {
  const lower = text.toLowerCase();

  // Check for keywords first
  for (const kw of Object.keys(KNOWN_KEYWORDS)) {
    if (lower.startsWith(kw)) return "keyword";
  }

  // Triggered abilities
  if (
    lower.includes("whenever") ||
    lower.includes("when you play") ||
    lower.includes("when this") ||
    lower.includes("at the start") ||
    lower.includes("at the end")
  ) {
    return "triggered";
  }

  // Activated abilities (have a cost)
  if (lower.includes("⬡") || lower.match(/\d+\s*⬡/)) {
    return "activated";
  }

  return "static";
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
 * Convert set ID to numeric format (e.g., "set2" -> "002")
 */
function getSetNumber(setId: string): string {
  const match = setId.match(/\d+/);
  const num = match ? Number.parseInt(match[0], 10) : 0;
  return num.toString().padStart(3, "0");
}

/**
 * Generate printing refs for all cards in a group
 */
function generatePrintingRefs(
  cards: Array<InputCard & { cardType: CardType }>,
  shortId: string,
): CardPrintingRef[] {
  const printingRefs: CardPrintingRef[] = [];
  const seen = new Set<string>();

  for (const card of cards) {
    const parsed = parseCardIdentifier(card.card_identifier);
    if (!parsed) continue;

    for (const setId of card.card_sets) {
      const setNumber = getSetNumber(setId);

      // Verify that the card_identifier's set number matches the setId
      // card_identifier format: "4/204 EN 1" where "1" is the set number
      // Extract set number from setId (e.g., "set1" -> 1, "set2" -> 2)
      const setIdMatch = setId.match(/\d+/);
      const setIdNumber = setIdMatch
        ? Number.parseInt(setIdMatch[0], 10)
        : null;

      // Only use this card_identifier if it matches the current setId
      if (
        parsed.setNumber !== null &&
        setIdNumber !== null &&
        parsed.setNumber !== setIdNumber
      ) {
        // This card_identifier is for a different set, skip it
        continue;
      }

      const key = `${setNumber}-${parsed.cardNumber}`;
      if (!seen.has(key)) {
        seen.add(key);
        printingRefs.push({
          set: setNumber,
          collectorNumber: parsed.cardNumber,
          id: shortId,
        });
      }
    }
  }

  return printingRefs;
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
 */
function buildExternalIds(
  card: InputCard,
  lorcastIndex?: LorcastTextIndex,
): ExternalIds | undefined {
  const externalIds: ExternalIds = {};

  // Ravensburger IDs
  if (card.deck_building_id) {
    externalIds.ravensburger = card.deck_building_id;
  }

  // Lorcast IDs (if we have a match)
  if (lorcastIndex) {
    const key = `${card.name}|${card.subtitle || ""}`.toLowerCase();
    const lorcastEntry = lorcastIndex.get(key);
    if (lorcastEntry) {
      if (lorcastEntry.id) {
        externalIds.lorcast = lorcastEntry.id;
      }
      if (lorcastEntry.tcgplayer_id) {
        externalIds.tcgPlayer = lorcastEntry.tcgplayer_id;
      }
    }
  }

  // Only return if we have at least one ID
  return Object.keys(externalIds).length > 0 ? externalIds : undefined;
}

/**
 * Build ordered common properties for all card types
 * Order: String → Numeric → Boolean → Object → Array
 */
interface CommonCardProperties {
  // STRING PROPERTIES
  id: string;
  cardType: CardType;
  name: string;
  version: string;
  fullName: string;
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
  // ARRAY PROPERTIES
  keywords?: string[];
  rulesText?: string;
  abilities?: AbilityDefinition[];
  parsedAbilities?: KeywordAbility[];
  classifications?: string[];
  printings?: CardPrintingRef[];
}

function buildCommonCardProperties(
  shortId: string,
  baseCard: InputCard & { cardType: CardType },
  rulesText: string,
  isVanilla: boolean,
  franchise: string | undefined,
  externalIds: ExternalIds | undefined,
  keywords: string[],
  printingRefs: CardPrintingRef[],
): Partial<CommonCardProperties> {
  // Build object with proper property order
  const props: Partial<CommonCardProperties> = {
    // === STRING PROPERTIES ===
    id: shortId,
    cardType: baseCard.cardType,
    name: baseCard.name,
    version: baseCard.subtitle || "",
    fullName: baseCard.subtitle
      ? `${baseCard.name} - ${baseCard.subtitle}`
      : baseCard.name,
    inkType: extractInkType(baseCard.magic_ink_colors || []),
  };

  if (franchise) {
    props.franchise = franchise;
  }

  // === NUMERIC PROPERTIES ===
  props.cost = baseCard.ink_cost;

  // === BOOLEAN PROPERTIES ===
  props.inkable = baseCard.ink_convertible;
  props.vanilla = isVanilla;

  // === OBJECT PROPERTIES ===
  if (externalIds) {
    props.externalIds = externalIds;
  }

  // === ARRAY PROPERTIES ===
  // TODO: Printings will be added back to output when needed
  props.printings = printingRefs;
  if (keywords.length > 0) {
    props.keywords = keywords;
  }
  if (!isVanilla) {
    props.rulesText = rulesText;
    props.abilities = parseAbilities(rulesText);

    // Try to parse structured keyword abilities
    // This will only succeed if ALL abilities are keywords
    const parsed = parseKeywordAbilities({
      rulesText,
      vanilla: false,
    } as CanonicalCard);
    if (parsed && parsed.length > 0) {
      props.parsedAbilities = parsed.map((a) => a.ability as KeywordAbility);
    }
  }

  return props;
}

/**
 * Transform a group of cards (same deck_building_id) to a canonical card
 * Returns a discriminated union type based on the card type.
 */
export function transformToCanonicalCard(
  deckBuildingId: string,
  cards: Array<InputCard & { cardType: CardType }>,
  idMapping: IdMapping,
  lorcastIndex?: LorcastTextIndex,
): CanonicalCard {
  const shortId = idMapping.byDeckBuildingId[deckBuildingId];
  if (!shortId) {
    throw new Error(`No short ID found for ${deckBuildingId}`);
  }

  // Use the base printing for canonical data
  const baseCard = findBasePrinting(cards);

  // Get rules text - prefer Lorcast text (has symbols) if available
  let rulesText: string;
  if (lorcastIndex) {
    const { text } = getMergedRulesText(baseCard, lorcastIndex);
    rulesText = text;
  } else {
    rulesText = cleanRulesText(baseCard.rules_text || "");
  }

  // Determine if card is vanilla (no rules text)
  const isVanilla = !rulesText || rulesText.trim() === "";

  // Extract all optional data
  const franchise = extractFranchise(baseCard);
  const externalIds = buildExternalIds(baseCard, lorcastIndex);
  const keywords = extractKeywords(baseCard.abilities || []);
  const printingRefs = generatePrintingRefs(cards, shortId);

  // Build common properties
  const common = buildCommonCardProperties(
    shortId,
    baseCard,
    rulesText,
    isVanilla,
    franchise,
    externalIds,
    keywords,
    printingRefs,
  );

  // Create type-specific card based on cardType
  switch (baseCard.cardType) {
    case "character": {
      const card: CanonicalCharacterCard = {
        // === STRING PROPERTIES (from common) ===
        ...common,
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

      const card: CanonicalActionCard = {
        ...common,
        cardType: "action",
        ...(isSong && { actionSubtype: "song" as const }),
      };
      return card;
    }

    case "item": {
      const card: CanonicalItemCard = {
        ...common,
        cardType: "item",
      };
      return card;
    }

    case "location": {
      const card: CanonicalLocationCard = {
        // === STRING PROPERTIES (from common) ===
        ...common,
        cardType: "location",

        // === NUMERIC PROPERTIES ===
        moveCost: baseCard.move_cost ?? 0,
        lore: baseCard.lore ?? 0,

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
  idMapping: IdMapping,
  lorcastIndex?: LorcastTextIndex,
): Record<string, CanonicalCard> {
  const canonicalCards: Record<string, CanonicalCard> = {};

  for (const [deckBuildingId, cards] of cardGroups.entries()) {
    const canonical = transformToCanonicalCard(
      deckBuildingId,
      cards,
      idMapping,
      lorcastIndex,
    );
    canonicalCards[canonical.id] = canonical;
  }

  return canonicalCards;
}
