/**
 * Cost Pattern Definitions
 *
 * Regex patterns for parsing Riftbound cost notation.
 * Costs use emoji-style notation: :rb_energy_N: and :rb_rune_domain:
 */

import type { Domain } from "@tcg/riftbound-types/abilities/cost-types";

// ============================================================================
// Domain Constants
// ============================================================================

/**
 * All valid domain names in Riftbound
 */
export const DOMAINS: readonly Domain[] = [
  "fury",
  "calm",
  "mind",
  "body",
  "chaos",
  "order",
  "rainbow",
] as const;

/**
 * Domain pattern string for regex
 */
export const DOMAIN_PATTERN_STRING = DOMAINS.join("|");

// ============================================================================
// Cost Patterns
// ============================================================================

/**
 * Pattern to match energy cost: :rb_energy_N:
 * Captures the numeric value N
 *
 * @example ":rb_energy_1:" -> captures "1"
 * @example ":rb_energy_3:" -> captures "3"
 */
export const ENERGY_PATTERN = /:rb_energy_(\d+):/g;

/**
 * Pattern to match power/rune cost: :rb_rune_domain:
 * Captures the domain name
 *
 * @example ":rb_rune_fury:" -> captures "fury"
 * @example ":rb_rune_rainbow:" -> captures "rainbow"
 */
export const POWER_PATTERN = new RegExp(
  `:rb_rune_(${DOMAIN_PATTERN_STRING}):`,
  "g",
);

/**
 * Pattern to match exhaust cost: :rb_exhaust:
 */
export const EXHAUST_PATTERN = /:rb_exhaust:/g;

/**
 * Pattern to match might notation: :rb_might:
 */
export const MIGHT_PATTERN = /:rb_might:/g;

/**
 * Combined pattern to match any cost token
 * Used for extracting cost strings from text
 */
export const ANY_COST_TOKEN_PATTERN = new RegExp(
  `:rb_(?:energy_\\d+|rune_(?:${DOMAIN_PATTERN_STRING})|exhaust):`,
  "g",
);

/**
 * Pattern to match a complete cost string (one or more cost tokens)
 * Used for extracting the full cost portion from ability text
 *
 * @example ":rb_energy_1::rb_rune_fury:" matches as a complete cost
 */
export const COST_STRING_PATTERN = new RegExp(
  `(?::rb_(?:energy_\\d+|rune_(?:${DOMAIN_PATTERN_STRING})|exhaust):)+`,
  "g",
);

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if a string contains any cost tokens
 */
export function hasCostTokens(text: string): boolean {
  // Create a new regex to avoid global state issues with lastIndex
  const pattern = new RegExp(ANY_COST_TOKEN_PATTERN.source);
  return pattern.test(text);
}

/**
 * Extract all cost strings from text
 */
export function extractCostStrings(text: string): string[] {
  const pattern = new RegExp(COST_STRING_PATTERN.source, "g");
  const matches: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    matches.push(match[0]);
  }

  return matches;
}

/**
 * Check if a domain string is valid
 */
export function isValidDomain(domain: string): domain is Domain {
  return DOMAINS.includes(domain as Domain);
}
