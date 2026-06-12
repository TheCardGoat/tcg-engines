/**
 * Short ID Generator
 *
 * Assigns 3-character IDs per printing (case-sensitive: a-z, A-Z, 0-9).
 * Reuses existing card .id from canonical-cards when valid and unique; otherwise generates new.
 * No separate mapping file: IDs live only on cards.
 */

import type { CanonicalCard, PipelineIdMapping } from "../types";

/** 62 chars: 0-9, a-z, A-Z (case-sensitive) */
const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const BASE = ALPHABET.length;

/** Card ID length: short IDs must be exactly 3 characters. */
const CARD_IRD_LENGTH = 3;

/**
 * Generate a random 3-character short ID (case-sensitive).
 */
function generateRandomShortId(): string {
  const bytes = new Uint8Array(CARD_IRD_LENGTH);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < CARD_IRD_LENGTH; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  let result = "";
  for (let i = 0; i < CARD_IRD_LENGTH; i++) {
    result += ALPHABET[bytes[i] % BASE];
  }
  if (result.length !== CARD_IRD_LENGTH) {
    throw new Error(`Generated short ID must be ${CARD_IRD_LENGTH} chars, got: ${result.length}`);
  }
  return result;
}

function generateUniqueShortId(usedIds: Set<string>, printingId: string): string {
  const maxAttempts = 1000;
  let shortId = generateRandomShortId();

  for (let attempts = 0; usedIds.has(shortId); attempts += 1) {
    if (attempts >= maxAttempts) {
      throw new Error(`Too many collisions for printing: ${printingId}`);
    }
    shortId = generateRandomShortId();
  }

  return shortId;
}

/**
 * Assign one unique 3-char id per printing. Reuses existing card .id from
 * existingCanonicalCards when valid (exactly 3 chars) and not yet in usedIds;
 * otherwise generates a new id. No id-mapping file: existing ids come only from
 * canonical cards (keyed by printingId).
 *
 * @returns PipelineIdMapping (byPrintingId, byCanonicalKey, byShortId)
 */
export function assignPrintingIds(
  printingItems: Array<{ card: { name?: string; subtitle?: string } }>,
  printingIdsInOrder: string[],
  getFullNameFromCard: (card: { name?: string; subtitle?: string }) => string,
  existingCanonicalCards?: Record<string, CanonicalCard>,
): PipelineIdMapping {
  const byPrintingId: Record<string, string> = {};
  const usedIds = new Set<string>();

  let idx = 0;
  for (const { card } of printingItems) {
    const printingId = printingIdsInOrder[idx];
    idx++;
    if (!printingId) continue;

    const existingId = existingCanonicalCards?.[printingId]?.id;
    const valid = existingId && existingId.length === CARD_IRD_LENGTH;
    let shortId: string;
    if (valid && !usedIds.has(existingId)) {
      shortId = existingId;
    } else {
      shortId = generateUniqueShortId(usedIds, printingId);
    }
    usedIds.add(shortId);
    byPrintingId[printingId] = shortId;
  }

  // Derive byCanonicalKey (first occurrence per canonical key) and byShortId.
  // Only the canonical representative (first printing per full name) goes in byShortId
  // so that byShortId and byCanonicalKey remain inverses (one shortId per canonical key).
  const byCanonicalKey: Record<string, string> = {};
  const byShortId: Record<string, string> = {};
  idx = 0;
  for (const { card } of printingItems) {
    const printingId = printingIdsInOrder[idx];
    idx++;
    if (!printingId) continue;
    const shortId = byPrintingId[printingId];
    if (!shortId) continue;
    const canonicalKey = getFullNameFromCard(card).toLowerCase();
    if (!(canonicalKey in byCanonicalKey)) {
      byCanonicalKey[canonicalKey] = shortId;
      byShortId[shortId] = canonicalKey;
    }
  }

  return { byPrintingId, byCanonicalKey, byShortId };
}

/**
 * Get short ID for a canonical key (e.g. normalized full name).
 */
export function getShortIdForCanonicalKey(
  mapping: PipelineIdMapping,
  canonicalKey: string,
): string | undefined {
  return mapping.byCanonicalKey[canonicalKey];
}

/**
 * Extend pipeline mapping with byPrintingId: one unique 3-char id per printing.
 * First printing of each canonical key gets the existing byCanonicalKey id; additional
 * printings (same card, e.g. enchanted variant) get a new unique 3-char id.
 *
 * Reuses existing printing IDs from previous runs if they are still valid:
 * - Must be exactly 3 characters
 * - Must not be a duplicate across all printings
 *
 * Card id format must remain 3 characters; this ensures uniqueness without changing format.
 *
 * Does not depend on deck_building_id or culture_invariant_id.
 */
export function extendWithPrintingIds(
  printingItems: Array<{ card: { name?: string; subtitle?: string } }>,
  printingIdsInOrder: string[],
  pipelineIdMapping: Pick<PipelineIdMapping, "byShortId" | "byCanonicalKey">,
  getFullNameFromCard: (card: { name?: string; subtitle?: string }) => string,
  existingCanonicalCards?: Record<string, CanonicalCard>,
): Record<string, string> {
  const byPrintingId: Record<string, string> = {};
  const usedShortIds = new Set<string>(Object.keys(pipelineIdMapping.byShortId));
  const canonicalKeyToFirstPrintingId = new Map<string, string>();

  // Track valid existing printing IDs to detect duplicates
  const existingValidIds: Record<string, string> = {};
  if (existingCanonicalCards) {
    // existingCanonicalCards is keyed by printingId, value has .id as the shortId
    for (const [printingId, card] of Object.entries(existingCanonicalCards)) {
      const shortId = card.id;

      // Only consider valid 3-char IDs (regenerate condition 1)
      if (shortId.length !== CARD_IRD_LENGTH) continue;

      // Check if this printing still exists in current items
      const idx = printingIdsInOrder.indexOf(printingId);
      if (idx === -1) continue;

      existingValidIds[printingId] = shortId;
    }

    // Detect duplicates among existing valid IDs (regenerate condition 2)
    const shortIdCounts = new Map<string, number>();
    for (const shortId of Object.values(existingValidIds)) {
      shortIdCounts.set(shortId, (shortIdCounts.get(shortId) ?? 0) + 1);
    }

    // Filter out duplicate IDs
    for (const [printingId, shortId] of Object.entries(existingValidIds)) {
      if (shortIdCounts.get(shortId)! > 1) {
        delete existingValidIds[printingId];
      }
    }
  }

  let idx = 0;
  for (const { card } of printingItems) {
    const printingId = printingIdsInOrder[idx];
    idx++;
    if (!printingId) continue;
    const canonicalKey = getFullNameFromCard(card).toLowerCase();
    const canonicalShortId = pipelineIdMapping.byCanonicalKey[canonicalKey];
    if (!canonicalShortId) continue;

    // Try to reuse existing printing ID if it's valid and not a duplicate
    const existingShortId = existingValidIds[printingId];
    if (existingShortId && !usedShortIds.has(existingShortId)) {
      byPrintingId[printingId] = existingShortId;
      usedShortIds.add(existingShortId);

      // Track first printing for canonical key
      if (!canonicalKeyToFirstPrintingId.has(canonicalKey)) {
        canonicalKeyToFirstPrintingId.set(canonicalKey, printingId);
      }
      continue;
    }

    const firstPrintingId = canonicalKeyToFirstPrintingId.get(canonicalKey);
    if (firstPrintingId === undefined) {
      canonicalKeyToFirstPrintingId.set(canonicalKey, printingId);
      byPrintingId[printingId] = canonicalShortId;
      usedShortIds.add(canonicalShortId);
      continue;
    }
    const shortId = generateUniqueShortId(usedShortIds, printingId);
    usedShortIds.add(shortId);
    byPrintingId[printingId] = shortId;
  }
  return byPrintingId;
}
