/**
 * Display-name normalization for card lookup and matching.
 *
 * Used so deck lists and queries with alternate punctuation or casing match
 * canonical card names (e.g. "Fix‐It" U+2011 vs "Fix-It", "A Pirate's Life" U+2019
 * vs ASCII apostrophe). Normalizes hyphens, apostrophes, commas, and other
 * common Unicode punctuation to ASCII, then NFKC and lowercasing for
 * case-insensitive matching.
 *
 * Normalization set (extend in this file if new variants appear in card names):
 * - Hyphens: U+2010–2015, U+2212 → ASCII '-'
 * - Apostrophes: U+2018, U+2019, U+201A, U+201B, U+2032 → ASCII "'"
 * - Commas: U+FF0C (fullwidth), U+060C (Arabic) → ASCII ','
 * - Other: U+3000 (fullwidth space) → ASCII space; trailing '!' and '?' stripped.
 */

/** Hyphen-like code points → ASCII hyphen for display-name matching. */
const HYPHEN_LIKE = /[\u2010-\u2015\u2212]/g;

/** Apostrophe-like code points → ASCII apostrophe. */
const APOSTROPHE_LIKE = /[\u2018\u2019\u201A\u201B\u2032]/g;

/** Comma-like code points → ASCII comma (fullwidth, Arabic). */
const COMMA_LIKE = /[\u060C\uFF0C]/g;

/** Fullwidth space → ASCII space. */
const FULLWIDTH_SPACE = /\u3000/g;

/**
 * Normalize a display name for case-insensitive, Unicode-robust matching.
 * Used so deck lists with "Sail The Azurite Sea" or "Fix‐It" (U+2011) match
 * canonical "Sail the Azurite Sea" / "Fix-It" (ASCII hyphen).
 * Also normalizes typographic apostrophes (e.g. "A Pirate's Life" U+2019) and
 * comma variants to ASCII. Trailing ! and ? are stripped so "You Can Fly" matches "You Can Fly!".
 */
export function normalizeDisplayNameForMatch(s: string): string {
  return s
    .trim()
    .replace(/[!?]+$/g, "")
    .replace(HYPHEN_LIKE, "-")
    .replace(APOSTROPHE_LIKE, "'")
    .replace(COMMA_LIKE, ",")
    .replace(FULLWIDTH_SPACE, " ")
    .normalize("NFKC")
    .toLowerCase();
}

/**
 * Same as normalizeDisplayNameForMatch but with ASCII apostrophe removed.
 * Enables "Duckburg - Funsos Funzone" (no apostrophe) to match "Duckburg - Funso's Funzone".
 */
export function normalizeDisplayNameApostropheInsensitive(s: string): string {
  return normalizeDisplayNameForMatch(s).replace(/'/g, "");
}
