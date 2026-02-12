/**
 * Search Effect Parser
 * Handles search deck effects like "search your deck" and "look at top X cards" (scry)
 */

import type { CstNode } from "chevrotain";
import { logger } from "../../logging";
import type {
  PlayerTarget,
  ScryCardFilter,
  ScryDestination,
  ScryEffect,
  SearchDeckEffect,
} from "../../types";
import { parseCardType } from "../utils";
import type { EffectParser } from "./index";

// ============================================================================
// Scry Effect Parser Helpers
// ============================================================================

/**
 * Parse a card type filter from text
 */
function parseCardTypeFilter(text: string): ScryCardFilter | null {
  const lowerText = text.toLowerCase();

  // Check for "song"
  if (lowerText.includes("song")) {
    return { type: "song" };
  }

  // Check for "floodborn"
  if (lowerText.includes("floodborn")) {
    return { type: "floodborn" };
  }

  // Check for card types
  const cardType = parseCardType(lowerText);
  if (cardType) {
    return { cardType, type: "card-type" };
  }

  return null;
}

/**
 * Parse a classification filter from text (e.g., "Madrigal", "Puppy", "Princess")
 */
function parseClassificationFilter(text: string): ScryCardFilter | null {
  // Common classification patterns
  const classificationPattern = /(?:a\s+)?(\w+)\s+(?:character|item|location)\s+card/i;
  const match = text.match(classificationPattern);
  if (match) {
    const classification = match[1];
    // Skip generic words
    if (
      !["character", "item", "action", "location", "song", "the", "a"].includes(
        classification.toLowerCase(),
      )
    ) {
      return { classification, type: "classification" };
    }
  }
  return null;
}

/**
 * Parse cost comparison filter (e.g., "cost 6 or less")
 */
function parseCostFilter(text: string): ScryCardFilter | null {
  const costPattern = /(?:with\s+)?cost\s+(\d+)\s+or\s+less/i;
  const match = text.match(costPattern);
  if (match) {
    return {
      comparison: "less-or-equal",
      type: "cost-comparison",
      value: Number.parseInt(match[1], 10),
    };
  }
  return null;
}

/**
 * Combine multiple filters with AND
 */
function combineFilters(filters: ScryCardFilter[]): ScryCardFilter | undefined {
  const validFilters = filters.filter(Boolean);
  if (validFilters.length === 0) {return undefined;}
  if (validFilters.length === 1) {return validFilters[0];}
  return { filters: validFilters, type: "and" };
}

/**
 * Determine the remainder destination from text
 */
function parseRemainderDestination(text: string): ScryDestination {
  const lowerText = text.toLowerCase();

  // Check for discard
  if (
    lowerText.includes("put the rest in your discard") ||
    lowerText.includes("put the rest into your discard") ||
    lowerText.includes("rest in your discard")
  ) {
    return { remainder: true, zone: "discard" };
  }

  // Check for top of deck
  if (
    lowerText.includes("rest on the top") ||
    lowerText.includes("rest on top") ||
    lowerText.includes("put the rest on the top") ||
    lowerText.includes("put the rest on top")
  ) {
    return { ordering: "player-choice", remainder: true, zone: "deck-top" };
  }

  // Default: bottom of deck
  return { ordering: "player-choice", remainder: true, zone: "deck-bottom" };
}

/**
 * Parse "may reveal" pattern to extract filter and count
 */
function parseMayRevealPattern(
  text: string,
): { filter: ScryCardFilter | undefined; max: number } | null {
  // Pattern: "may reveal up to N [type] card"
  const upToPattern = /may\s+reveal\s+up\s+to\s+(\d+)\s+([\w\s]+?)\s*(?:card|and)/i;
  let match = text.match(upToPattern);
  if (match) {
    const max = Number.parseInt(match[1], 10);
    const typeText = match[2].trim();
    const filters: ScryCardFilter[] = [];

    // Parse card type
    const typeFilter = parseCardTypeFilter(typeText);
    if (typeFilter) {filters.push(typeFilter);}

    // Parse classification
    const classFilter = parseClassificationFilter(typeText);
    if (classFilter) {filters.push(classFilter);}

    // Parse cost
    const costFilter = parseCostFilter(text);
    if (costFilter) {filters.push(costFilter);}

    return {
      filter: combineFilters(filters),
      max,
    };
  }

  // Pattern: "may reveal a [type] card"
  const singlePattern = /may\s+reveal\s+(?:a|an)\s+([\w\s]+?)\s*(?:card|and)/i;
  match = text.match(singlePattern);
  if (match) {
    const typeText = match[1].trim();
    const filters: ScryCardFilter[] = [];

    const typeFilter = parseCardTypeFilter(typeText);
    if (typeFilter) {filters.push(typeFilter);}

    const classFilter = parseClassificationFilter(typeText);
    if (classFilter) {filters.push(classFilter);}

    const costFilter = parseCostFilter(text);
    if (costFilter) {filters.push(costFilter);}

    return {
      filter: combineFilters(filters),
      max: 1,
    };
  }

  return null;
}

/**
 * Check if text indicates "play for free"
 */
function isPlayForFree(text: string): boolean {
  const lowerText = text.toLowerCase();
  return (
    lowerText.includes("play it for free") ||
    lowerText.includes("play that card for free") ||
    lowerText.includes("and play it for free")
  );
}

/**
 * Check if text indicates inkwell destination
 */
function hasInkwellDestination(text: string): boolean {
  const lowerText = text.toLowerCase();
  return lowerText.includes("into your inkwell") || lowerText.includes("into inkwell");
}

// ============================================================================
// Main Scry Parser
// ============================================================================

/**
 * Parse scry effect from "look at top X cards" text
 */
function parseScryEffect(text: string): ScryEffect | null {
  const lowerText = text.toLowerCase();

  // Extract amount of cards to look at
  const amountPattern = /look\s+at\s+the\s+top\s+(\d+)\s+cards?/i;
  const amountMatch = text.match(amountPattern);
  if (!amountMatch) {return null;}

  const amount = Number.parseInt(amountMatch[1], 10);
  const destinations: ScryDestination[] = [];

  // Determine target player (default: CONTROLLER)
  let target: PlayerTarget = "CONTROLLER";
  if (lowerText.includes("chosen player's deck")) {
    target = "CHOSEN_PLAYER";
  } else if (lowerText.includes("opponent's deck")) {
    target = "OPPONENT";
  }

  // ========================================================================
  // Pattern: Play for free
  // "Look at top X. May reveal [type] and play for free. Rest on bottom/discard."
  // ========================================================================
  if (isPlayForFree(text)) {
    const revealInfo = parseMayRevealPattern(text);
    if (revealInfo) {
      destinations.push({
        cost: "free",
        filter: revealInfo.filter,
        max: revealInfo.max,
        min: 0,
        reveal: true,
        zone: "play",
      });
    }
    destinations.push(parseRemainderDestination(text));

    logger.info("Parsed scry with play for free", { amount, destinations });
    return { amount, destinations, target, type: "scry" };
  }

  // ========================================================================
  // Pattern: Inkwell destination
  // "Look at top X. Put one into hand and other into inkwell facedown and exerted."
  // ========================================================================
  if (hasInkwellDestination(text)) {
    // Check if there's a hand component too
    if (
      lowerText.includes("put one into your hand") ||
      lowerText.includes("put 1 into your hand")
    ) {
      destinations.push({ max: 1, min: 1, zone: "hand" });
    }

    // Add inkwell destination
    const isExerted = lowerText.includes("exerted") || lowerText.includes("facedown");
    destinations.push({
      exerted: isExerted,
      facedown: true,
      remainder: true,
      zone: "inkwell",
    });

    logger.info("Parsed scry with inkwell", { amount, destinations });
    return { amount, destinations, target, type: "scry" };
  }

  // ========================================================================
  // Pattern: May reveal with hand destination
  // "Look at top X. You may reveal a [type] and put it into your hand. Rest on bottom."
  // ========================================================================
  const revealInfo = parseMayRevealPattern(text);
  if (revealInfo) {
    // Check for multiple independent filters (e.g., "character AND item")
    // Pattern: "up to 1 [type1] AND up to 1 [type2]"
    const multiFilterPattern =
      /up\s+to\s+(\d+)\s+([\w\s]+?)\s+(?:card\s+)?and\s+up\s+to\s+(\d+)\s+([\w\s]+?)\s+card/i;
    const multiMatch = text.match(multiFilterPattern);

    if (multiMatch) {
      // First filter
      const max1 = Number.parseInt(multiMatch[1], 10);
      const type1 = multiMatch[2].trim();
      const filter1Filters: ScryCardFilter[] = [];
      const typeFilter1 = parseCardTypeFilter(type1);
      if (typeFilter1) {filter1Filters.push(typeFilter1);}
      const classFilter1 = parseClassificationFilter(type1);
      if (classFilter1) {filter1Filters.push(classFilter1);}

      destinations.push({
        filter: combineFilters(filter1Filters),
        max: max1,
        min: 0,
        reveal: true,
        zone: "hand",
      });

      // Second filter
      const max2 = Number.parseInt(multiMatch[3], 10);
      const type2 = multiMatch[4].trim();
      const filter2Filters: ScryCardFilter[] = [];
      const typeFilter2 = parseCardTypeFilter(type2);
      if (typeFilter2) {filter2Filters.push(typeFilter2);}
      const classFilter2 = parseClassificationFilter(type2);
      if (classFilter2) {filter2Filters.push(classFilter2);}

      destinations.push({
        filter: combineFilters(filter2Filters),
        max: max2,
        min: 0,
        reveal: true,
        zone: "hand",
      });
    } else {
      // Single filter
      destinations.push({
        filter: revealInfo.filter,
        max: revealInfo.max,
        min: 0,
        reveal: true,
        zone: "hand",
      });
    }

    destinations.push(parseRemainderDestination(text));

    logger.info("Parsed scry with reveal to hand", { amount, destinations });
    return { amount, destinations, target, type: "scry" };
  }

  // ========================================================================
  // Pattern: Basic hand + remainder
  // "Look at top X. Put one into your hand and the rest on the bottom."
  // ========================================================================
  const handPattern = /put\s+(?:one|(\d+))\s+into\s+your\s+hand|put\s+it\s+into\s+your\s+hand/i;
  const handMatch = text.match(handPattern);
  if (handMatch) {
    const handCount = handMatch[1] ? Number.parseInt(handMatch[1], 10) : 1;
    destinations.push({ max: handCount, min: handCount, zone: "hand" });
    destinations.push(parseRemainderDestination(text));

    logger.info("Parsed scry with hand destination", { amount, destinations });
    return { amount, destinations, target, type: "scry" };
  }

  // ========================================================================
  // Pattern: Top or bottom choice (1 card)
  // "Look at top card. Put it on either the top or the bottom."
  // ========================================================================
  if (
    lowerText.includes("on either the top or the bottom") ||
    lowerText.includes("top or bottom")
  ) {
    destinations.push({ max: 1, min: 0, zone: "deck-top" });
    destinations.push({ remainder: true, zone: "deck-bottom" });

    logger.info("Parsed scry with top/bottom choice", { amount, destinations });
    return { amount, destinations, target, type: "scry" };
  }

  // ========================================================================
  // Pattern: Put back on top in any order
  // "Look at top X. Put them back on top in any order."
  // ========================================================================
  if (
    lowerText.includes("put them back on") ||
    lowerText.includes("put them back in any order") ||
    lowerText.includes("put them on the top")
  ) {
    destinations.push({
      ordering: "player-choice",
      remainder: true,
      zone: "deck-top",
    });

    logger.info("Parsed scry with reorder on top", { amount, destinations });
    return { amount, destinations, target, type: "scry" };
  }

  // ========================================================================
  // Default: Just look (no explicit destination)
  // Fall back to putting all on bottom
  // ========================================================================
  destinations.push({
    ordering: "player-choice",
    remainder: true,
    zone: "deck-bottom",
  });

  logger.info("Parsed basic scry effect", { amount, destinations });
  return { amount, destinations, target, type: "scry" };
}

// ============================================================================
// Search Deck Parser (unchanged)
// ============================================================================

/**
 * Parse search deck effect from text
 */
function parseSearchDeckEffect(text: string): SearchDeckEffect | null {
  // Patterns for search effects
  const searchAndShufflePattern = /search\s+your\s+deck\s+for\s+(?:a\s+)?(\w+).*?shuffle/i;
  const searchDeckPutPattern = /search\s+your\s+deck\s+for\s+(?:a\s+)?(\w+).*?put/i;
  const searchDeckPattern = /search\s+your\s+deck\s+for\s+(?:a\s+)?(\w+)/i;

  // Check for "search deck and shuffle"
  if (searchAndShufflePattern.test(text)) {
    const match = text.match(searchAndShufflePattern);
    if (match) {
      const cardTypeStr = match[1].toLowerCase();
      const cardType = parseCardType(cardTypeStr);

      logger.info("Parsed search deck and shuffle effect", { cardType });

      const effect: SearchDeckEffect = {
        putInto: "hand",
        shuffle: true,
        type: "search-deck",
      };
      if (cardType) {
        effect.cardType = cardType;
      }
      return effect;
    }
  }

  // Check for "search deck and put"
  if (searchDeckPutPattern.test(text)) {
    const match = text.match(searchDeckPutPattern);
    if (match) {
      const cardTypeStr = match[1].toLowerCase();
      const cardType = parseCardType(cardTypeStr);
      let putInto: "hand" | "top-of-deck" | "play" = "hand";

      if (text.includes("into play")) {
        putInto = "play";
      } else if (text.includes("on top")) {
        putInto = "top-of-deck";
      }

      logger.info("Parsed search deck and put effect", { cardType, putInto });

      const effect: SearchDeckEffect = {
        putInto,
        shuffle: false,
        type: "search-deck",
      };
      if (cardType) {
        effect.cardType = cardType;
      }
      return effect;
    }
  }

  // Check for basic "search deck"
  if (searchDeckPattern.test(text)) {
    const match = text.match(searchDeckPattern);
    if (match) {
      const cardTypeStr = match[1].toLowerCase();
      const cardType = parseCardType(cardTypeStr);

      logger.info("Parsed search deck effect", { cardType });

      const effect: SearchDeckEffect = {
        putInto: "hand",
        shuffle: false,
        type: "search-deck",
      };
      if (cardType) {
        effect.cardType = cardType;
      }
      return effect;
    }
  }

  return null;
}

// ============================================================================
// Main Parser
// ============================================================================

/**
 * Parse search/scry effect from text string
 */
function parseFromText(text: string): SearchDeckEffect | ScryEffect | null {
  logger.debug("Attempting to parse search/scry effect from text", { text });

  // Try scry effect first (look at top X cards)
  if (/look\s+at\s+the\s+top/i.test(text)) {
    const scryEffect = parseScryEffect(text);
    if (scryEffect) {return scryEffect;}
  }

  // Try search deck effect
  if (/search\s+your\s+deck/i.test(text)) {
    const searchEffect = parseSearchDeckEffect(text);
    if (searchEffect) {return searchEffect;}
  }

  logger.debug("Search/scry effect pattern did not match");
  return null;
}

/**
 * Search/Scry effect parser implementation
 */
export const searchEffectParser: EffectParser = {
  description:
    "Parses search and scry effects (e.g., 'search your deck', 'look at the top 3 cards')",
  parse: (input: CstNode | string): SearchDeckEffect | ScryEffect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    // CST parsing not implemented yet for search effects
    logger.warn("CST parsing not implemented for search effects");
    return null;
  },

  pattern: /search\s+your\s+deck|look\s+at\s+the\s+top/i,
};
