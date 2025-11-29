/**
 * Short ID Generator
 *
 * Generates deterministic 3-character alphanumeric IDs from deck_building_id hashes.
 * Handles collisions by appending incrementing suffixes.
 */

import type { IdMapping } from "../types";

const BASE36_CHARS = "0123456789abcdefghijklmnopqrstuvwxyz";

/**
 * Convert a hex string to base36
 */
function hexToBase36(hex: string): string {
  // Take first 8 chars of hex (32 bits) to avoid BigInt issues
  const num = Number.parseInt(hex.slice(0, 8), 16);
  return num.toString(36);
}

/**
 * Generate a short ID from a deck_building_id
 * Returns a 3-character alphanumeric string
 */
function generateShortId(deckBuildingId: string, suffix = 0): string {
  const base36 = hexToBase36(deckBuildingId);

  // Take first 3 characters
  let shortId = base36.slice(0, 3).padStart(3, "0");

  // If we have a collision suffix, append it
  if (suffix > 0) {
    // Use base36 for suffix too
    const suffixStr = suffix.toString(36);
    shortId = shortId.slice(0, 3 - suffixStr.length) + suffixStr;
  }

  return shortId;
}

/**
 * Create ID mapping for all deck_building_ids
 *
 * @param deckBuildingIds - Array of deck_building_id values
 * @param existingMapping - Optional existing mapping to preserve stable IDs
 * @returns IdMapping object with bidirectional lookups
 */
export function createIdMapping(
  deckBuildingIds: string[],
  existingMapping?: IdMapping,
): IdMapping {
  const byShortId: Record<string, string> = {};
  const byDeckBuildingId: Record<string, string> = {};

  // First, preserve any existing mappings
  if (existingMapping) {
    for (const [shortId, dbId] of Object.entries(existingMapping.byShortId)) {
      if (deckBuildingIds.includes(dbId)) {
        byShortId[shortId] = dbId;
        byDeckBuildingId[dbId] = shortId;
      }
    }
  }

  // Generate IDs for new deck_building_ids
  for (const dbId of deckBuildingIds) {
    // Skip if already mapped
    if (byDeckBuildingId[dbId]) {
      continue;
    }

    // Try to generate a unique short ID
    let suffix = 0;
    let shortId = generateShortId(dbId, suffix);

    // Handle collisions
    while (byShortId[shortId]) {
      suffix++;
      shortId = generateShortId(dbId, suffix);

      // Safety limit
      if (suffix > 1000) {
        throw new Error(`Too many collisions for ${dbId}`);
      }
    }

    byShortId[shortId] = dbId;
    byDeckBuildingId[dbId] = shortId;
  }

  return { byShortId, byDeckBuildingId };
}

/**
 * Get short ID for a deck_building_id
 */
export function getShortId(
  mapping: IdMapping,
  deckBuildingId: string,
): string | undefined {
  return mapping.byDeckBuildingId[deckBuildingId];
}

/**
 * Get deck_building_id for a short ID
 */
export function getDeckBuildingId(
  mapping: IdMapping,
  shortId: string,
): string | undefined {
  return mapping.byShortId[shortId];
}
