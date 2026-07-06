/**
 * Data Merger
 *
 * Merges card text from Lorcast into Ravensburger data.
 * Lorcast often has cleaner keyword formatting, but Ravensburger can be more
 * accurate for recently released symbol placeholders.
 */

import { cleanRulesText } from "../utils/text";
import type { InputCard } from "../types";
import {
  extractCardNumberFromIdentifier,
  extractSetCodeFromIdentifier,
  getLorcastText,
  type LorcastTextIndex,
} from "./lorcast-parser";

export interface MergeStats {
  totalCards: number;
  matched: number;
  unmatched: number;
  unmatchedCards: Array<{ name: string; version: string; identifier: string }>;
}

const EMPTY_SYMBOL = "{}";
const SYMBOL_PLACEHOLDER_REGEX = /\{(?:[A-Z]+)?\}/g;

function hasEmptySymbolPlaceholder(text: string): boolean {
  return text.includes(EMPTY_SYMBOL);
}

function hasConcreteSymbolPlaceholder(text: string): boolean {
  return /\{[A-Z]+\}/.test(text);
}

function getSymbolPlaceholders(text: string): string[] {
  return text.match(SYMBOL_PLACEHOLDER_REGEX) ?? [];
}

/**
 * Lorcast occasionally ships fresh cards with empty symbol placeholders, e.g.
 * "{}" where Ravensburger already has "{S}". Repair only matching symbol slots
 * so we keep Lorcast text shape without discarding concrete Ravensburger icons.
 */
export function repairEmptySymbolsFromReference(text: string, referenceText: string): string {
  if (!hasEmptySymbolPlaceholder(text) || !hasConcreteSymbolPlaceholder(referenceText)) {
    return text;
  }

  const sourceSymbols = getSymbolPlaceholders(text);
  const referenceSymbols = getSymbolPlaceholders(referenceText);
  if (sourceSymbols.length !== referenceSymbols.length) {
    return text;
  }

  let index = 0;
  return text.replace(SYMBOL_PLACEHOLDER_REGEX, (symbol) => {
    const replacement = referenceSymbols[index++];
    if (symbol === EMPTY_SYMBOL && replacement !== EMPTY_SYMBOL) {
      return replacement;
    }
    return symbol;
  });
}

function chooseRulesText(lorcastText: string, ravensburgerText: string): string {
  const repairedText = repairEmptySymbolsFromReference(lorcastText, ravensburgerText);
  if (repairedText !== lorcastText) {
    return repairedText;
  }

  if (
    hasEmptySymbolPlaceholder(lorcastText) &&
    !hasEmptySymbolPlaceholder(ravensburgerText) &&
    hasConcreteSymbolPlaceholder(ravensburgerText)
  ) {
    return ravensburgerText;
  }

  return lorcastText;
}

/**
 * Get merged rules text for a card
 * Uses Lorcast text if available and symbol-safe, falls back to cleaned Ravensburger text
 * Returns both normalized text (with {d} placeholders) and original text (with numbers)
 */
export function getMergedRulesText(
  card: InputCard,
  lorcastIndex: LorcastTextIndex,
): {
  text: string;
  originalText?: string;
  matched: boolean;
} {
  const setCode = extractSetCodeFromIdentifier(card.card_identifier);
  const cardNumber = extractCardNumberFromIdentifier(card.card_identifier);
  const originalText = cleanRulesText(card.rules_text || "");

  if (!setCode || cardNumber === null) {
    // Can't parse identifier, fall back to Ravensburger
    return {
      text: originalText,
      originalText: originalText,
      matched: false,
    };
  }

  const lorcastText = getLorcastText(
    lorcastIndex,
    setCode,
    cardNumber,
    card.name,
    card.subtitle || "",
  );

  if (lorcastText) {
    // Return symbol-safe merged text and original Ravensburger text
    return {
      text: chooseRulesText(lorcastText, originalText),
      originalText: originalText,
      matched: true,
    };
  }

  // No match found, use cleaned Ravensburger text
  return {
    text: originalText,
    originalText: originalText,
    matched: false,
  };
}

/**
 * Merge rules text from Lorcast into all cards
 * Returns merged cards and statistics
 */
export function mergeAllCards(
  cards: InputCard[],
  lorcastIndex: LorcastTextIndex,
): {
  mergedCards: Array<InputCard & { mergedRulesText: string }>;
  stats: MergeStats;
} {
  const mergedCards: Array<InputCard & { mergedRulesText: string }> = [];
  const stats: MergeStats = {
    totalCards: cards.length,
    matched: 0,
    unmatched: 0,
    unmatchedCards: [],
  };

  for (const card of cards) {
    const { text, matched } = getMergedRulesText(card, lorcastIndex);

    mergedCards.push({
      ...card,
      mergedRulesText: text,
    });

    if (matched) {
      stats.matched++;
    } else {
      stats.unmatched++;
      // Only log if card has rules text (vanilla cards don't need matching)
      if (card.rules_text && card.rules_text.trim()) {
        stats.unmatchedCards.push({
          name: card.name,
          version: card.subtitle || "",
          identifier: card.card_identifier,
        });
      }
    }
  }

  return { mergedCards, stats };
}

/**
 * Print merge statistics
 */
export function printMergeStats(stats: MergeStats): void {
  const matchRate = ((stats.matched / stats.totalCards) * 100).toFixed(1);
  console.log(`  Matched: ${stats.matched}/${stats.totalCards} (${matchRate}%)`);

  if (stats.unmatchedCards.length > 0 && stats.unmatchedCards.length <= 20) {
    console.log("  Unmatched cards with rules text:");
    for (const card of stats.unmatchedCards) {
      console.log(`    - ${card.name} - ${card.version} (${card.identifier})`);
    }
  } else if (stats.unmatchedCards.length > 20) {
    console.log(
      `  ${stats.unmatchedCards.length} unmatched cards with rules text (too many to list)`,
    );
  }
}
