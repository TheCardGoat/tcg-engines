import type { CardEffect, CardType } from "@tcg/gundam-types";
import { cleanHtml } from "./effect-parser/helpers.ts";
import { splitIntoSegments, parseSegment } from "./effect-parser/segments.ts";

/**
 * Parse a raw card effect string into a typed CardEffect array.
 * Returns an empty array for cards with no meaningful effect ("-", empty, undefined).
 *
 * Each `【Keyword】...text` block becomes one CardEffect entry.
 * Cards with multiple blocks produce multiple entries.
 *
 * @param rawEffect  The `effect` field from a card definition.
 * @param _cardType  The card's type — reserved for future type-specific rules.
 */
export function parseEffect(rawEffect: string | undefined, _cardType?: CardType): CardEffect[] {
  if (!rawEffect) return [];
  const trimmed = rawEffect.trim();
  if (trimmed === "-" || trimmed === "") return [];

  const cleaned = cleanHtml(trimmed);
  const segments = splitIntoSegments(cleaned);

  return segments.map((seg) => parseSegment(seg, seg)).filter((e): e is CardEffect => e !== null);
}
