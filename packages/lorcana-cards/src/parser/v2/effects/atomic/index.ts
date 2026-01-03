/**
 * Effect Parser Registry
 * Provides a plugin-style architecture for parsing atomic effects.
 * Each effect type is registered explicitly and tried in order.
 */

import type { CstNode } from "chevrotain";
import type { Effect } from "../../types";
import { banishEffectParser } from "./banish-effect";
import { damageEffectParser } from "./damage-effect";
import { discardEffectParser } from "./discard-effect";
import { discardHandEffectParser } from "./discard-hand-effect";
import { drawEffectParser } from "./draw-effect";
import { exertEffectParser } from "./exert-effect";
import { inkwellEffectParser } from "./inkwell-effect";
import { keywordEffectParser } from "./keyword-effect";
import { locationEffectParser } from "./location-effect";
import { loreEffectParser } from "./lore-effect";
import { playEffectParser } from "./play-effect";
import { putDamageEffectParser } from "./put-damage-effect";
import { removeDamageEffectParser } from "./remove-damage-effect";
import { restrictionEffectParser } from "./restriction-effect";
import { returnEffectParser } from "./return-effect";
import { revealEffectParser } from "./reveal-effect";
import { searchEffectParser } from "./search-effect";
import { statModEffectParser } from "./stat-mod-effect";

/**
 * Interface for effect parsers.
 * Each effect parser handles one specific effect type.
 */
export interface EffectParser {
  /**
   * Pattern that this parser handles.
   * Can be a regex or grammar rule name for documentation.
   */
  pattern: RegExp | string;

  /**
   * Parse the effect from CST node or text.
   * Returns null if this parser cannot handle the input.
   */
  parse: (input: CstNode | string) => Effect | null;

  /**
   * Optional description for debugging and documentation.
   */
  description?: string;
}

/**
 * Registry of atomic effect parsers.
 * Order matters - more specific parsers should come first.
 * Parsers are ordered from most specific to most generic to ensure
 * correct matching precedence.
 */
export const atomicEffectParsers: EffectParser[] = [
  // Search and look effects (very specific patterns with deck interaction)
  searchEffectParser,

  // Stat modifications (very specific patterns with +/-)
  statModEffectParser,

  // Keyword grants (specific keyword names)
  keywordEffectParser,

  // Restriction effects (specific restriction patterns)
  restrictionEffectParser,

  // Remove damage effects (specific "remove X damage" pattern)
  removeDamageEffectParser,

  // Put damage effects (specific "put X damage counters" pattern)
  putDamageEffectParser,

  // Damage effects (specific "deal X damage" pattern)
  damageEffectParser,

  // Lore effects (specific "gain/lose X lore" pattern)
  loreEffectParser,

  // Exert effects (specific state changes)
  exertEffectParser,

  // Return effects (specific return to hand/deck patterns)
  returnEffectParser,

  // Banish effects (specific removal patterns)
  banishEffectParser,

  // Play effects (specific play card patterns)
  playEffectParser,

  // Reveal effects (specific reveal patterns)
  revealEffectParser,

  // Inkwell effects (specific inkwell patterns)
  inkwellEffectParser,

  // Location effects (specific location movement patterns)
  locationEffectParser,

  // Discard hand effects (specific discard hand patterns)
  discardHandEffectParser,

  // Draw effects (common pattern)
  drawEffectParser,

  // Discard effects (common pattern)
  discardEffectParser,
];

/**
 * Parse an atomic effect by trying each registered parser in order.
 * Returns the first successful parse result, or null if no parser matches.
 */
export function parseAtomicEffect(input: CstNode | string): Effect | null {
  // Trim trailing periods and whitespace from string inputs
  // This handles cases where effect text ends with a period like "draw a card."
  let normalizedInput = input;
  if (typeof input === "string") {
    normalizedInput = input.replace(/\.\s*$/, "").trim();
  }

  for (const parser of atomicEffectParsers) {
    const result = parser.parse(normalizedInput);
    if (result !== null) {
      return result;
    }
  }
  return null;
}
