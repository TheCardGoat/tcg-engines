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
 */
function extractInkType(colors: string[]): InkType | [InkType, InkType] {
  if (colors.length === 0) return "amber";
  if (colors.length === 1) return mapInkColor(colors[0]);

  // Dual ink
  return [mapInkColor(colors[0]), mapInkColor(colors[1])];
}

/**
 * Map rarity string to lowercase
 */
function mapRarity(rarity: string): string {
  return rarity.toLowerCase().replace(/_/g, "_");
}

/**
 * Extract keywords from abilities array
 * Keywords are typically single words like "Bodyguard", "Rush", "Evasive"
 */
const KNOWN_KEYWORDS = [
  "alert",
  "bodyguard",
  "boost",
  "challenger",
  "evasive",
  "reckless",
  "resist",
  "rush",
  "shift",
  "singer",
  "support",
  "ward",
];

function extractKeywords(abilities: string[]): string[] {
  const keywords: string[] = [];

  for (const ability of abilities) {
    const lower = ability.toLowerCase();
    if (KNOWN_KEYWORDS.includes(lower)) {
      keywords.push(lower);
    } else if (lower.startsWith("shift ")) {
      keywords.push("shift");
    } else if (lower.startsWith("singer ")) {
      keywords.push("singer");
    } else if (lower.startsWith("resist ")) {
      keywords.push("resist");
    } else if (lower.startsWith("challenger ")) {
      keywords.push("challenger");
    } else if (lower.startsWith("boost ")) {
      keywords.push("boost");
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
  for (const kw of KNOWN_KEYWORDS) {
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
    for (const setId of card.card_sets) {
      const parsed = parseCardIdentifier(card.card_identifier);
      if (parsed) {
        const setNumber = getSetNumber(setId);
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
 * Build common card properties shared by all card types
 */
function buildCommonCardProperties(
  shortId: string,
  baseCard: InputCard & { cardType: CardType },
  rulesText: string,
  isVanilla: boolean,
  franchise: string | undefined,
  externalIds: ExternalIds | undefined,
  keywords: string[],
  printingRefs: CardPrintingRef[],
) {
  return {
    // === STRING PROPERTIES ===
    id: shortId,
    name: baseCard.name,
    version: baseCard.subtitle || "",
    fullName: baseCard.subtitle
      ? `${baseCard.name} - ${baseCard.subtitle}`
      : baseCard.name,
    inkType: extractInkType(baseCard.magic_ink_colors || []),
    ...(franchise && { franchise }),

    // === NUMERIC PROPERTIES ===
    cost: baseCard.ink_cost,

    // === BOOLEAN PROPERTIES ===
    inkable: baseCard.ink_convertible,
    vanilla: isVanilla,

    // === OBJECT PROPERTIES ===
    ...(externalIds && { externalIds }),

    // === ARRAY PROPERTIES ===
    printings: printingRefs,
    ...(keywords.length > 0 && { keywords }),
    ...(!isVanilla && { rulesText }),
    ...(!isVanilla && { abilities: parseAbilities(rulesText) }),
  };
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
