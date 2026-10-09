import { cyberpunkArtworkManifest, type CyberpunkArtCategory } from "./artwork-manifest.ts";

interface PrintingArtworkIdentity {
  canonicalId: string;
  artId: string;
  category: CyberpunkArtCategory;
}

const artworkByPrintingId = new Map<string, PrintingArtworkIdentity>();
const categoryByArtId = new Map<string, CyberpunkArtCategory>();
const freeArtIdByCanonicalId = new Map<string, string>();
const legacyArtIdToArtId: Record<string, string> = {};
const legacyArtIdToCanonicalId: Record<string, string> = {};

for (const [canonicalId, card] of Object.entries(cyberpunkArtworkManifest)) {
  const freeArtwork = card.artworks.find((artwork) => artwork.artId === card.freeArtId);
  if (!freeArtwork || freeArtwork.category !== "standard") {
    throw new Error(`Cyberpunk canonical ${canonicalId} must have a standard free art`);
  }
  freeArtIdByCanonicalId.set(canonicalId, card.freeArtId);

  for (const artwork of card.artworks) {
    if (categoryByArtId.has(artwork.artId)) {
      throw new Error(`Cyberpunk art identity ${artwork.artId} is reused by multiple canonicals`);
    }
    categoryByArtId.set(artwork.artId, artwork.category);

    for (const printingId of artwork.printingIds) {
      if (artworkByPrintingId.has(printingId)) {
        throw new Error(
          `Cyberpunk printing ${printingId} appears more than once in the art manifest`,
        );
      }
      artworkByPrintingId.set(printingId, {
        canonicalId,
        artId: artwork.artId,
        category: artwork.category,
      });
      legacyArtIdToArtId[printingId] = artwork.artId;
      legacyArtIdToCanonicalId[printingId] = canonicalId;
    }
  }
}

/**
 * Maps previous per-printing art IDs to reviewed appearance IDs. Use it for a
 * one-time entitlement-key migration, not as a runtime alias fallback.
 */
export const CYBERPUNK_LEGACY_ART_ID_TO_ART_ID: Readonly<Record<string, string>> =
  Object.freeze(legacyArtIdToArtId);

/** Canonical identity for each legacy printing ID, used by safe data reconciliation. */
export const CYBERPUNK_LEGACY_ART_ID_TO_CANONICAL_ID: Readonly<Record<string, string>> =
  Object.freeze(legacyArtIdToCanonicalId);

/** Returns the stable visual art identity for a printing, or null if unknown. */
export function getCyberpunkArtIdForPrinting(printingId: string): string | null {
  return artworkByPrintingId.get(printingId)?.artId ?? null;
}

/** Returns the one explicitly free, simple art identity for a canonical card. */
export function getCyberpunkFreeArtIdsForCanonical(canonicalId: string): string[] {
  const artId = freeArtIdByCanonicalId.get(canonicalId);
  return artId ? [artId] : [];
}

/** Returns whether this known art identity requires an Atelier unlock. */
export function isCyberpunkAlternateArtId(artId: string): boolean {
  const category = categoryByArtId.get(artId);
  if (!category) throw new Error(`Unknown Cyberpunk art identity ${artId}`);
  return category !== "standard";
}

/** Returns whether this known printing requires an Atelier unlock. */
export function isCyberpunkAlternateArtPrinting(printing: { printingId: string }): boolean {
  const artwork = artworkByPrintingId.get(printing.printingId);
  if (!artwork) throw new Error(`Unknown Cyberpunk printing ${printing.printingId}`);
  return artwork.category !== "standard";
}
