/**
 * Deck list normalization and hashing for template/synergy perspectives.
 *
 * Card order is irrelevant for hashing and templating: we use a canonical
 * order (sort by cardId, then quantity) before any hash or comparison.
 */

import { createHash } from "node:crypto";
import type { DeckListInvalidEntry } from "./deck-list-errors";

/** Single card entry in a deck list (playable list only). */
export type DeckListCard = { cardId: string; quantity: number };

/**
 * Sort entries by cardId then quantity for deterministic hashing.
 * Call before hashing or when comparing normalized forms.
 */
function toCanonicalOrder(cards: DeckListCard[]): DeckListCard[] {
  return [...cards].sort((a, b) => {
    const id = a.cardId.localeCompare(b.cardId);
    return id !== 0 ? id : a.quantity - b.quantity;
  });
}

/**
 * Compare two card lists by card set and quantities (order-independent).
 */
function listEqual(a: DeckListCard[], b: DeckListCard[]): boolean {
  const ca = toCanonicalOrder(a);
  const cb = toCanonicalOrder(b);
  if (ca.length !== cb.length) return false;
  return ca.every((c, i) => {
    const b = cb[i];
    return b !== undefined && c.cardId === b.cardId && c.quantity === b.quantity;
  });
}

/**
 * Template form: "strategy shape".
 * - qty >= 4 -> 4
 * - qty === 3 -> 2
 * - qty === 2 -> 2
 * - qty === 1 -> remove
 * Returns list in canonical order.
 */
export function toTemplateForm(cards: DeckListCard[]): DeckListCard[] {
  const out: DeckListCard[] = [];
  for (const c of cards) {
    if (c.quantity <= 0) continue;
    if (c.quantity === 1) continue;
    const q = c.quantity >= 4 ? 4 : c.quantity === 3 ? 2 : 2;
    out.push({ cardId: c.cardId, quantity: q });
  }
  return toCanonicalOrder(out);
}

/**
 * Lorcana display format: one line per card, "quantity CardName - Subtitle".
 * Uses canonical order. Empty list returns "".
 */
export function toLorcanaFormat(cards: DeckListCard[]): string {
  if (cards.length === 0) return "";
  const ordered = toCanonicalOrder(cards);
  return ordered.map((c) => `${c.quantity} ${c.cardId}`).join("\n");
}

/**
 * Parses a comma-separated string of "Card Name:Quantity" into an array of DeckListCard.
 * e.g., "Hades - Infernal Schemer:4,Vision of the Future:4" becomes
 * `[{ cardId: "Hades - Infernal Schemer", quantity: 4 }, { cardId: "Vision of the Future", quantity: 4 }]`
 * Ignores malformed entries and sorts the output canonically.
 */
export function parseDeckListString(deckListString: string): DeckListCard[] {
  if (!deckListString.trim()) {
    return [];
  }

  const cards: DeckListCard[] = [];
  const entries = deckListString.split(",");

  for (const entry of entries) {
    const parts = entry.trim().split(":");
    if (parts.length < 2) {
      continue;
    }

    const quantityString = parts[parts.length - 1];
    if (quantityString === undefined) continue;
    const quantity = parseInt(quantityString, 10);

    if (isNaN(quantity) || quantity <= 0) {
      continue;
    }

    const cardId = parts
      .slice(0, parts.length - 1)
      .join(":")
      .trim();

    if (cardId) {
      cards.push({ cardId, quantity });
    }
  }

  return toCanonicalOrder(cards);
}

/**
 * Like parseDeckListString but also returns malformed entries.
 * Each skipped entry is reported as { kind: 'malformed', text: rawEntry }.
 */
export function parseDeckListStringWithErrors(deckListString: string): {
  cards: DeckListCard[];
  invalid: DeckListInvalidEntry[];
} {
  const cards: DeckListCard[] = [];
  const invalid: DeckListInvalidEntry[] = [];

  if (!deckListString.trim()) {
    return { cards: [], invalid: [] };
  }

  const entries = deckListString.split(",");

  for (const entry of entries) {
    const rawEntry = entry.trim();
    const parts = rawEntry.split(":");
    if (parts.length < 2) {
      if (rawEntry) invalid.push({ kind: "malformed", text: rawEntry });
      continue;
    }

    const quantityString = parts[parts.length - 1];
    if (quantityString === undefined) {
      invalid.push({ kind: "malformed", text: rawEntry });
      continue;
    }
    const quantity = parseInt(quantityString, 10);

    if (isNaN(quantity) || quantity <= 0) {
      invalid.push({ kind: "malformed", text: rawEntry });
      continue;
    }

    const cardId = parts
      .slice(0, parts.length - 1)
      .join(":")
      .trim();

    if (cardId) {
      cards.push({ cardId, quantity });
    } else {
      invalid.push({ kind: "malformed", text: rawEntry });
    }
  }

  return { cards: toCanonicalOrder(cards), invalid };
}

/**
 * Synergy form: "winning card core".
 * Keep only entries with quantity > 1; set each to quantity 1.
 * Returns list in canonical order. If none, returns [].
 */
export function toSynergyForm(cards: DeckListCard[]): DeckListCard[] {
  const out: DeckListCard[] = [];
  for (const c of cards) {
    if (c.quantity > 1) out.push({ cardId: c.cardId, quantity: 1 });
  }
  return toCanonicalOrder(out);
}

/**
 * True iff this list is already in template form (no change under toTemplateForm).
 */
export function isTemplateForm(cards: DeckListCard[]): boolean {
  return listEqual(cards, toTemplateForm(cards));
}

/**
 * True iff this list is already a synergy list (every entry has quantity 1).
 */
export function isSynergyForm(cards: DeckListCard[]): boolean {
  if (cards.length === 0) return true;
  return cards.every((c) => c.quantity === 1);
}

function sha256HexSync(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

/**
 * Canonical hash for a card list. Order-independent: sorts by cardId then quantity first.
 * Use the same algorithm for list_hash on deck_lists so template/synergy rows are findable.
 */
export function canonicalListHash(cards: DeckListCard[]): string {
  const canonical = toCanonicalOrder(cards);
  const payload = JSON.stringify(canonical);
  return sha256HexSync(payload);
}

/** Cached hash of the canonical empty list ([]). Use for the empty-synergy deck_list row. */
let emptyListHash: string | null = null;

/**
 * Hash of the canonical empty list ([]). Use for the empty-synergy deck_list row.
 */
export function getEmptyListHash(): string {
  if (emptyListHash === null) {
    emptyListHash = canonicalListHash([]);
  }
  return emptyListHash;
}
