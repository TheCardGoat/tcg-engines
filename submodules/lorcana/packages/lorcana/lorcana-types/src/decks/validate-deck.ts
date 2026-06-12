/**
 * DAC (Deck-As-Code) Format Validation
 *
 * Validates a deck against named Lorcana formats and determines which formats
 * a deck is legal in. Formats are defined as configuration objects (data-driven),
 * enabling a single unified validation path for all formats.
 *
 * Design:
 * - Formats as data: LorcanaFormat objects drive all validation; no per-format functions.
 * - Dependency injection: callers supply a `lookup` function — lorcana-types stays
 *   free of runtime card-data dependencies.
 * - Reprint-aware: CardFormatData.sets lists EVERY set code where a card has a
 *   printing. A card passes set validation if any of its sets overlaps with the
 *   format's allowed sets — no manual reprint traversal.
 * - Canonical grouping: copy limits are enforced by canonicalId, so two printings
 *   of the same card in one deck count together.
 *
 * Usage:
 *   const formats = getDeckFormats(deckCards, myLookup);
 *   // => ["core-constructed", "infinity"]
 *
 * Building the lookup from @tcg/lorcana-cards:
 * @example
 * ```ts
 * import { canonicalCards, cardsAuxKv, printings, sets } from "@tcg/lorcana-cards";
 * import type { CardFormatData, LorcanaSetCode } from "@tcg/lorcana-types";
 *
 * function buildCardFormatLookup() {
 *   const setCodeById: Record<string, string> = {};
 *   for (const [id, set] of Object.entries(sets)) {
 *     setCodeById[id] = set.code;
 *   }
 *   return function lookup(shortId: string): CardFormatData | undefined {
 *     const card = canonicalCards[shortId];
 *     if (!card) return undefined;
 *     const printingIds = cardsAuxKv.printingIdsByCanonicalId[card.canonicalId] ?? [];
 *     const cardSets = [
 *       ...new Set(
 *         printingIds
 *           .map((id) => printings[id]?.set)
 *           .filter(Boolean)
 *           .map((setId) => setCodeById[setId!])
 *           .filter(Boolean),
 *       ),
 *     ] as LorcanaSetCode[];
 *     const rotationStates = [
 *       ...new Set(
 *         printingIds
 *           .map((id) => printings[id]?.setRotationState)
 *           .filter(Boolean),
 *       ),
 *     ];
 *     return {
 *       canonicalId: card.canonicalId,
 *       fullName: card.fullName ?? card.name,
 *       inkTypes: Array.isArray(card.inkType) ? card.inkType : [card.inkType],
 *       sets: cardSets,
 *       rotationStates,
 *     };
 *   };
 * }
 * ```
 */

// ---------------------------------------------------------------------------
// Set codes
// ---------------------------------------------------------------------------

/** All Lorcana set codes derived from sets.json. */
export type LorcanaSetCode =
  | "TFC" // set1 — The First Chapter
  | "ROF" // set2 — Rise of the Floodborn
  | "ITI" // set3 — Into the Inklands
  | "URR" // set4 — Ursula's Return
  | "SSK" // set5 — Shimmering Skies
  | "AZS" // set6 — Azurite Sea
  | "ARC" // set7 — Archazia's Island
  | "ROJ" // set8 — Reign of Jafar
  | "FAB" // set9 — Fabled
  | "WIW" // set10 — Whispers in the Well
  | "WSP" // set11 — Winterspell
  | "WUN"; // set12 — Wilds Unknown

// ---------------------------------------------------------------------------
// Format identifiers
// ---------------------------------------------------------------------------

export type LorcanaFormatId =
  | "infinity"
  | "core-constructed"
  | "archazias-island"
  | "shimmering-skies"
  | "azurite-sea";

// ---------------------------------------------------------------------------
// Format configuration
// ---------------------------------------------------------------------------

/**
 * A named Lorcana format with its legality rules.
 *
 * All fields except `id`, `label`, and `allowedSets` are optional and fall back
 * to the standard rules (60-card minimum, 2-ink-type maximum, 4-copy limit).
 */
export interface LorcanaFormat {
  id: LorcanaFormatId;
  label: string;
  description?: string;
  /** Set codes whose printings are legal in this format. */
  allowedSets: LorcanaSetCode[];
  /**
   * Card shortIds banned in this format.
   * Checked by shortId, so a ban applies to a single canonical card;
   * use the shortId of the specific card (not a reprint) unless both are banned.
   */
  bannedCardIds?: string[];
  /** Minimum number of cards required in the deck (default: 60). */
  minDeckSize?: number;
  /** Maximum number of distinct ink types allowed (default: 2). */
  maxInkTypes?: number;
  /**
   * Card shortIds that bypass the set restriction for this format.
   * Useful for promotional cards allowed in a format outside their set window.
   */
  specialAllowedCardIds?: string[];
  /**
   * If set, a card also passes set validation when ANY of its printing rotation
   * states matches this value (e.g. `"CoreConstructed"`).
   * Used by formats that map to a Ravensburger rotation designation.
   * Historical/snapshot formats leave this undefined.
   */
  requiredRotationState?: string;
  /**
   * If set, at least one card in the deck must belong to one of the listed sets.
   * Used by formats like Early Access that are a superset of another format, so that
   * pure Core Constructed decks (with no WSP/WUN cards) are not considered valid.
   */
  requiresAnySet?: LorcanaSetCode[];
  /**
   * Set codes whose cards must be rejected even if they would otherwise pass via
   * {@link requiredRotationState}. Used to reject cards from sets that should
   * not be legal in the format even when Ravensburger pre-tags them as `"CoreConstructed"`.
   *
   * A card fails if every one of its printings is in `excludedSets`.
   */
  excludedSets?: LorcanaSetCode[];
}

// ---------------------------------------------------------------------------
// Banned card shortIds
// (sourced from generated package cards + cardsAuxKv; update if new printings appear)
// ---------------------------------------------------------------------------

/** Hiram Flaversham - Toymaker (set2-149) */
const HIRAM_FLAVERSHAM_TOYMAKER = "LsX";

/** Fortisphere (set4-200) */
const FORTISPHERE = "PSk";

// ---------------------------------------------------------------------------
// Format definitions
// ---------------------------------------------------------------------------

export const LORCANA_FORMATS: Record<LorcanaFormatId, LorcanaFormat> = {
  /**
   * All released sets legal; only Hiram Flaversham - Toymaker banned.
   */
  infinity: {
    id: "infinity",
    label: "Infinity",
    description: "All released sets are legal. One card is banned.",
    allowedSets: [
      "TFC",
      "ROF",
      "ITI",
      "URR",
      "SSK",
      "AZS",
      "ARC",
      "ROJ",
      "FAB",
      "WIW",
      "WSP",
      "WUN",
    ],
    bannedCardIds: [HIRAM_FLAVERSHAM_TOYMAKER],
  },

  /**
   * Rotating constructed format. Includes the most recent six sets.
   * Both Hiram Flaversham - Toymaker and Fortisphere are banned.
   */
  "core-constructed": {
    id: "core-constructed",
    label: "Core Constructed",
    description: "Current rotating format. Sets SSK through WUN are legal.",
    allowedSets: ["SSK", "AZS", "ARC", "ROJ", "FAB", "WIW", "WSP", "WUN"],
    bannedCardIds: [HIRAM_FLAVERSHAM_TOYMAKER, FORTISPHERE],
    requiredRotationState: "CoreConstructed",
  },

  /**
   * Archazia's Island format. Sets SSK through FAB (five sets).
   */
  "archazias-island": {
    id: "archazias-island",
    label: "Archazia's Island",
    description: "Sets SSK through FAB are legal. No banned cards.",
    allowedSets: ["SSK", "AZS", "ARC", "ROJ", "FAB"],
  },

  /**
   * Shimmering Skies format. Legacy format covering the first five sets.
   */
  "shimmering-skies": {
    id: "shimmering-skies",
    label: "Shimmering Skies",
    description: "Sets TFC through SSK are legal. No banned cards.",
    allowedSets: ["TFC", "ROF", "ITI", "URR", "SSK"],
  },

  /**
   * Azurite Sea format. Sets TFC through AZS are legal.
   * Certain promotional Fabled cards are also allowed via specialAllowedCardIds.
   */
  "azurite-sea": {
    id: "azurite-sea",
    label: "Azurite Sea",
    description: "Sets TFC through AZS are legal, plus select Fabled promo cards.",
    allowedSets: ["TFC", "ROF", "ITI", "URR", "SSK", "AZS"],
    // Populate with Fabled promotional card shortIds when available.
    specialAllowedCardIds: [],
  },
};

// ---------------------------------------------------------------------------
// Input / output types
// ---------------------------------------------------------------------------

/**
 * A single card entry in a deck.
 *
 * `cardId` is the canonical shortId from @tcg/lorcana-cards (e.g. `"LsX"`).
 * Multiple printings of the same canonical card should share the same shortId;
 * if they do not, the canonical grouping via `CardFormatData.canonicalId` handles it.
 */
export interface DeckCard {
  cardId: string;
  quantity: number;
}

/**
 * Card data required for format validation.
 *
 * Callers supply this via a lookup function, keeping lorcana-types free of
 * runtime card-data dependencies. See the module-level JSDoc for a reference
 * implementation using @tcg/lorcana-cards.
 */
export interface CardFormatData {
  /**
   * Canonical identifier that groups all printings of the same card.
   * Used to enforce the per-card copy limit across reprints.
   * Example: `"ci_LsX"`.
   */
  canonicalId: string;
  /** Display name used in validation messages (e.g. `"Hiram Flaversham - Toymaker"`). */
  fullName: string;
  /**
   * All set codes where this canonical card has a printing.
   * A card passes set validation if ANY of these overlaps with the format's allowedSets.
   * This naturally handles reprints without explicit traversal.
   */
  sets: LorcanaSetCode[];
  /** Ink types for this card. One-ink cards supply a single-element array. */
  inkTypes: string[];
  /**
   * Override the default 4-copy limit.
   * `"no-limit"` means unlimited copies (treated as Infinity internally).
   */
  cardCopyLimit?: number | "no-limit";
  /**
   * Ravensburger rotation states from all printings of this card.
   * Known values: `"CoreConstructed"`, `"InfinityConstructed"`, `"None"` (not in active rotation).
   * A card passes set validation if any rotation state matches the format's
   * {@link LorcanaFormat.requiredRotationState}.
   */
  rotationStates?: string[];
}

/** The kind of rule checked during format validation. */
export type FormatValidationKind =
  | "DECK_SIZE"
  | "INK_TYPES"
  | "CARD_QUANTITY"
  | "CARD_SET"
  | "BANNED_CARD"
  | "REQUIRES_ANY_SET";

/** Result of a single validation rule. */
export interface FormatRuleResult {
  kind: FormatValidationKind;
  passed: boolean;
  message: string;
}

/** All validation results for one format. */
export interface DeckFormatResult {
  formatId: LorcanaFormatId;
  valid: boolean;
  rules: FormatRuleResult[];
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Group deck cards by canonicalId, summing quantities for reprints. */
function groupByCanonical(
  cards: DeckCard[],
  lookup: (id: string) => CardFormatData | undefined,
): Map<string, { data: CardFormatData; totalQty: number }> {
  const groups = new Map<string, { data: CardFormatData; totalQty: number }>();
  for (const card of cards) {
    const data = lookup(card.cardId);
    if (!data) continue;
    const existing = groups.get(data.canonicalId);
    if (existing) {
      existing.totalQty += card.quantity;
    } else {
      groups.set(data.canonicalId, { data, totalQty: card.quantity });
    }
  }
  return groups;
}

function resolveMaxCopies(limit: number | "no-limit" | undefined): number {
  if (limit === "no-limit") return Infinity;
  return typeof limit === "number" ? limit : 4;
}

// ---------------------------------------------------------------------------
// Core validation
// ---------------------------------------------------------------------------

/**
 * Validate a deck against a single format.
 *
 * Each rule produces a `FormatRuleResult`. The `DeckFormatResult.valid` flag is
 * `true` only when every rule passes.
 */
export function validateDeckForFormat(
  cards: DeckCard[],
  lookup: (id: string) => CardFormatData | undefined,
  format: LorcanaFormat,
): DeckFormatResult {
  const rules: FormatRuleResult[] = [];
  const minSize = format.minDeckSize ?? 60;
  const maxInkTypes = format.maxInkTypes ?? 2;

  // DECK_SIZE
  const totalCards = cards.reduce((sum, c) => sum + c.quantity, 0);
  rules.push({
    kind: "DECK_SIZE",
    passed: totalCards >= minSize,
    message:
      totalCards >= minSize
        ? `Deck has ${totalCards} cards (minimum ${minSize}).`
        : `Deck has ${totalCards} cards but requires at least ${minSize}.`,
  });

  // INK_TYPES
  const inkTypes = new Set<string>();
  for (const card of cards) {
    const data = lookup(card.cardId);
    if (data) {
      for (const ink of data.inkTypes) {
        inkTypes.add(ink);
      }
    }
  }
  const inkCount = inkTypes.size;
  rules.push({
    kind: "INK_TYPES",
    passed: inkCount <= maxInkTypes,
    message:
      inkCount <= maxInkTypes
        ? `Deck uses ${inkCount} ink type(s) (maximum ${maxInkTypes}).`
        : `Deck uses ${inkCount} ink types (${[...inkTypes].join(", ")}), but at most ${maxInkTypes} are allowed.`,
  });

  // CARD_QUANTITY — enforced per canonical card across all printings
  const groups = groupByCanonical(cards, lookup);
  const quantityFailures: string[] = [];
  for (const { data, totalQty } of groups.values()) {
    const max = resolveMaxCopies(data.cardCopyLimit);
    if (totalQty > max) {
      quantityFailures.push(
        `${data.fullName}: ${totalQty} copies (maximum ${max === Infinity ? "unlimited" : max})`,
      );
    }
  }
  rules.push({
    kind: "CARD_QUANTITY",
    passed: quantityFailures.length === 0,
    message:
      quantityFailures.length === 0
        ? "All card quantities are within the allowed limits."
        : `Too many copies: ${quantityFailures.join("; ")}.`,
  });

  // CARD_SET — a card passes if any printing is in an allowed set,
  // OR if any printing's rotation state matches the format's required state.
  // Cards whose printings live entirely in `excludedSets` are rejected even
  // when rotation state would otherwise admit them.
  const setFailures: string[] = [];
  for (const card of cards) {
    if (format.specialAllowedCardIds?.includes(card.cardId)) continue;
    const data = lookup(card.cardId);
    if (!data) continue;
    const inAllowedSet = data.sets.some((s) => format.allowedSets.includes(s));
    const matchesRotation =
      format.requiredRotationState != null &&
      (data.rotationStates?.includes(format.requiredRotationState) ?? false);
    const allInExcluded =
      (format.excludedSets?.length ?? 0) > 0 &&
      data.sets.length > 0 &&
      data.sets.every((s) => format.excludedSets!.includes(s));
    const passes = !allInExcluded && (inAllowedSet || matchesRotation);
    if (!passes) {
      setFailures.push(`${data.fullName} (sets: ${data.sets.join(", ") || "unknown"})`);
    }
  }
  rules.push({
    kind: "CARD_SET",
    passed: setFailures.length === 0,
    message:
      setFailures.length === 0
        ? "All cards are legal for this format."
        : `Cards not legal in ${format.label}: ${setFailures.join("; ")}.`,
  });

  // BANNED_CARD
  if (format.bannedCardIds && format.bannedCardIds.length > 0) {
    const bannedFailures: string[] = [];
    for (const card of cards) {
      if (format.bannedCardIds.includes(card.cardId)) {
        const data = lookup(card.cardId);
        bannedFailures.push(data ? data.fullName : card.cardId);
      }
    }
    rules.push({
      kind: "BANNED_CARD",
      passed: bannedFailures.length === 0,
      message:
        bannedFailures.length === 0
          ? "No banned cards in deck."
          : `Banned in ${format.label}: ${bannedFailures.join(", ")}.`,
    });
  }

  // REQUIRES_ANY_SET — at least one card must belong to one of the specified sets.
  // Ensures that formats like Early Access (which are supersets of CC) reject pure CC decks.
  if (format.requiresAnySet && format.requiresAnySet.length > 0) {
    const hasRequiredSet = cards.some((card) => {
      const data = lookup(card.cardId);
      return data?.sets.some((s) => format.requiresAnySet!.includes(s)) ?? false;
    });
    rules.push({
      kind: "REQUIRES_ANY_SET",
      passed: hasRequiredSet,
      message: hasRequiredSet
        ? `Deck contains at least one card from the required sets (${format.requiresAnySet.join(", ")}).`
        : `${format.label} requires at least one card from: ${format.requiresAnySet.join(", ")}.`,
    });
  }

  return {
    formatId: format.id,
    valid: rules.every((r) => r.passed),
    rules,
  };
}

// ---------------------------------------------------------------------------
// Multi-format validation
// ---------------------------------------------------------------------------

/**
 * Validate a deck against all (or a specified subset of) formats.
 *
 * @param cards - The deck to validate.
 * @param lookup - Provides `CardFormatData` for a given card shortId.
 * @param formats - Formats to check. Defaults to all entries in `LORCANA_FORMATS`.
 * @returns One `DeckFormatResult` per format, in the order formats were supplied.
 */
export function validateDeck(
  cards: DeckCard[],
  lookup: (id: string) => CardFormatData | undefined,
  formats: LorcanaFormat[] = Object.values(LORCANA_FORMATS),
): DeckFormatResult[] {
  return formats.map((format) => validateDeckForFormat(cards, lookup, format));
}

/**
 * Return the format IDs for which the deck is fully legal.
 *
 * This is the primary "format detection" entry point: given a deck and a card
 * lookup, it tells you which named formats the deck belongs to.
 *
 * @example
 * ```ts
 * const formats = getDeckFormats(deckCards, lookup);
 * // => ["core-constructed", "infinity"]
 * ```
 */
export function getDeckFormats(
  cards: DeckCard[],
  lookup: (id: string) => CardFormatData | undefined,
): LorcanaFormatId[] {
  return validateDeck(cards, lookup)
    .filter((result) => result.valid)
    .map((result) => result.formatId);
}
