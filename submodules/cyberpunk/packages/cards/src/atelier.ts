import type { AltArtRarityCode, CardPrinting, CardRarity } from "@tcg/cyberpunk-types";
import { getMergedCyberpunkCards, getMergedCyberpunkCardsById, setPriority } from "./merged.ts";
import { getCyberpunkFreeArtIdsForCanonical, isCyberpunkAlternateArtId } from "./artwork.ts";

export {
  CYBERPUNK_LEGACY_ART_ID_TO_ART_ID,
  CYBERPUNK_LEGACY_ART_ID_TO_CANONICAL_ID,
  getCyberpunkArtIdForPrinting,
  getCyberpunkFreeArtIdsForCanonical,
  isCyberpunkAlternateArtId,
  isCyberpunkAlternateArtPrinting,
} from "./artwork.ts";

/**
 * Atelier (alt-art acquisition/rental) data export for Cyberpunk.
 *
 * The platform atelier backend needs a game-agnostic view of a card's
 * printings — which ones are "alternate art" (require ownership), how they are
 * priced, and which printing is the free default. This module bridges the
 * Cyberpunk card pool into that view without leaking engine concerns.
 *
 * Every alternate appearance has one stable top-tier price, independent of
 * which equivalent physical printing a player selects. Simple appearances are
 * free, including duplicate printings from different product categories.
 *
 * Cyberpunk's art model is "cosmetic": art selections change only the displayed
 * image, never the engine `cardId`. The platform adapter enforces that — this
 * module only describes the data.
 */

/**
 * Lowercase Cyberpunk rarity codes used for default-printing selection. These
 * are the direct lowercase equivalents of {@link CardRarity}; they are a subset
 * of the atelier {@link AltArtRarityCode} pricing taxonomy only by coincidence.
 */
export type CyberpunkRarityCode = "common" | "uncommon" | "rare" | "epic";

/**
 * Maps authored Cyberpunk card rarities ({@link CardRarity}) to their lowercase
 * equivalents. This is the first step before looking up an atelier price; the
 * atelier pricing mapping lives in the platform layer.
 *
 * `null` and unknown values are not present in the table and fall back to
 * `"common"` via {@link cyberpunkRarityCode}.
 */
export const CYBERPUNK_RARITY_TO_CODE: Readonly<Record<CardRarity, CyberpunkRarityCode>> = {
  Common: "common",
  Uncommon: "uncommon",
  Rare: "rare",
  Epic: "epic",
  Secret: "epic",
  "Iconic Secret": "epic",
  "Iconic Other": "epic",
  "Iconic Legend": "epic",
  "Nova Rare": "epic",
};

/**
 * CDN base for Cyberpunk card images. Matches the catalog transform in
 * `platform/apps/general-api/src/modules/cyberpunk/service.ts` exactly so the
 * atelier / acquire modal surfaces the SAME image the deckbuilder shows.
 */
const CYBERPUNK_CARD_IMAGE_BASE = "https://cdn.tcg.online/public/cyberpunk/cards";

/**
 * Normalize a collector number for its CDN image path. Greek-prefix collector
 * numbers (`α062`, `β008`) are rewritten to ASCII (`a062`, `b008`) to match
 * the assets repository layout. Mirrors the catalog transform verbatim so the
 * atelier cannot drift from what the deckbuilder renders.
 */
function normalizeCollectorNumberForImagePath(collectorNumber: string): string {
  return collectorNumber
    .toLowerCase()
    .replace(/^\u03b1/, "a")
    .replace(/^\u03b2/, "b");
}

/**
 * Resolve a Cyberpunk printing's CDN image URL from its `(setCode,
 * collectorNumber)` pair. Deterministic — the same inputs always produce the
 * same URL — which lets the atelier backend populate per-printing image URLs
 * without a per-printing image table. This is the single source of truth for
 * the cyberpunk card image URL; the platform catalog reuses the same pattern
 * via this module's re-export.
 */
export function getCyberpunkPrintingImageUrl(setCode: string, collectorNumber: string): string {
  return `${CYBERPUNK_CARD_IMAGE_BASE}/${setCode}/${normalizeCollectorNumberForImagePath(collectorNumber)}.webp`;
}

/**
 * Normalize a Cyberpunk printing's rarity into a lowercase Cyberpunk rarity
 * code. Returns `"common"` for an empty string (the bulk of Cyberpunk printings
 * carry no rarity) and for unknown values, so the free-default path always
 * resolves to a valid code.
 *
 * This is the RAW rarity only — it does NOT apply the alt-art-set bump to
 * `"enchanted"`. For the pricing-facing code that bumps alt-art-set printings
 * up to the atelier calibration target, use
 * {@link cyberpunkPrintingEffectiveRarityCode}.
 */
const RARITY_CODE_BY_STRING: Readonly<Record<string, CyberpunkRarityCode>> =
  CYBERPUNK_RARITY_TO_CODE;

export function cyberpunkRarityCode(printing: { rarity: string }): CyberpunkRarityCode {
  if (!printing.rarity) return "common";
  return RARITY_CODE_BY_STRING[printing.rarity] ?? "common";
}

/**
 * Game-agnostic projection of a single Cyberpunk printing. Mirrors the platform
 * adapter's `AltArtPrintingInfo` shape so the adapter can pass these straight
 * through.
 *
 * - `canonicalId` is the merged card's stable slug — the same id the
 *   deckbuilder and engine use as `cardId`.
 * - `cardNumber` is the printing's `collectorNumber` (a free-form string like
 *   `"α002"` or `"005"`).
 * - `specialRarity` is always `null` for Cyberpunk (the authored data has no
 *   such field); kept on the shape for cross-game adapter uniformity.
 * - `sortNumber` is derived from {@link setPriority} so the platform
 *   rarity-ordering can rank printings consistently (retail sets rank higher).
 * - `imageUrl` is the per-printing CDN URL resolved deterministically from
 *   `(set, cardNumber)` via {@link getCyberpunkPrintingImageUrl}. Alternate
 *   arts carry DIFFERENT image URLs than the base printing (the whole point of
 *   alt-art), so this is per-printing, not per-canonical.
 */
export interface CyberpunkPrintingInfo {
  printingId: string;
  artId: string;
  canonicalId: string;
  set: string;
  cardNumber: string;
  rarity: string;
  specialRarity: null;
  sortNumber: number;
  imageUrl: string;
}

function toPrintingInfo(canonicalId: string, printing: CardPrinting): CyberpunkPrintingInfo {
  return {
    printingId: printing.id,
    artId: printing.artId,
    canonicalId,
    set: printing.setCode,
    cardNumber: printing.collectorNumber,
    rarity: printing.rarity,
    specialRarity: null,
    sortNumber: setPriority(printing.setCode),
    imageUrl: getCyberpunkPrintingImageUrl(printing.setCode, printing.collectorNumber),
  };
}

/**
 * Resolve the stable canonical slug for any authored Cyberpunk card id or
 * canonical slug — including cross-set ids that share a slug with a higher-priority canonical
 * (e.g. a spoiler id resolves to its retail canonical). Returns `null` for
 * truly-unknown ids, so callers can keep a strict "unknown card" rejection.
 */
export function getCyberpunkCanonicalForCardId(cardId: string): string | null {
  return getMergedCyberpunkCardsById().get(cardId)?.canonicalId ?? null;
}

/**
 * Every printing unioned onto the canonical card for the given canonical id.
 * Returns `[]` for an unknown canonical id. The canonical id is the merged
 * card's stable slug identity (see {@link getCyberpunkCanonicalForCardId}).
 */
export function getCyberpunkPrintingInfosForCanonical(
  canonicalId: string,
): CyberpunkPrintingInfo[] {
  const card = getMergedCyberpunkCardsById().get(canonicalId);
  if (!card) return [];
  return card.printings.map((printing) => toPrintingInfo(card.canonicalId, printing));
}

/**
 * Memoized index of every printing across the merged Cyberpunk card pool,
 * keyed by printing id. Built once at module load. A printing id resolves to
 * the single canonical card it belongs to post-merge.
 */
const printingInfoById: ReadonlyMap<string, CyberpunkPrintingInfo> = (() => {
  const map = new Map<string, CyberpunkPrintingInfo>();
  for (const card of getMergedCyberpunkCards()) {
    for (const printing of card.printings) {
      // Post-merge a printing id belongs to exactly one canonical card; the
      // guard keeps the first occurrence defensively in case of data drift.
      if (!map.has(printing.id)) {
        map.set(printing.id, toPrintingInfo(card.canonicalId, printing));
      }
    }
  }
  return map;
})();

/**
 * Look up a single printing by id. Returns `null` if the printing id is not
 * present on any merged Cyberpunk card.
 */
export function getCyberpunkPrintingInfo(printingId: string): CyberpunkPrintingInfo | null {
  return printingInfoById.get(printingId) ?? null;
}

/**
 * One printing for the explicitly free art identity of a canonical. The art
 * identity is selected in the reviewed catalog manifest, so set/rareness
 * heuristics cannot select a promotional treatment as the default. Returns
 * null only for an unknown canonical id or a catalog integrity failure.
 */
export function defaultCyberpunkPrintingId(canonicalId: string): string | null {
  const printings = getCyberpunkPrintingInfosForCanonical(canonicalId);
  if (printings.length === 0) return null;
  const [freeArtId] = getCyberpunkFreeArtIdsForCanonical(canonicalId);
  return printings.find((printing) => printing.artId === freeArtId)?.printingId ?? null;
}

/**
 * Security boundary: confirm `printingId` is genuinely a printing of the given
 * canonical card. Prevents crafted `artSelections` (which map `cardId →
 * printingId`) from selecting a printing that belongs to a DIFFERENT gameplay
 * card. Returns `false` for unknown printing ids.
 *
 * This composes {@link getCyberpunkPrintingInfo} with canonical-id equality,
 * exposing the same check the platform adapter uses so the rule has a single
 * implementation in the cyberpunk module.
 */
export function isCyberpunkPrintingOfCanonical(printingId: string, canonicalId: string): boolean {
  return getCyberpunkPrintingInfo(printingId)?.canonicalId === canonicalId;
}

/**
 * Atelier pricing code for a Cyberpunk printing — this is what the platform
 * atelier uses to price a printing in Marks.
 *
 * Pricing is appearance-level: equivalent printings always resolve to the same
 * tier. Standard appearances have no Atelier price; every distinct alternate
 * appearance uses the top tier (`enchanted`).
 *
 * Returns `"common"` for an unknown printing id (the safest default — never
 * grants ownership of a top-tier printing by accident).
 */
export function cyberpunkPrintingEffectiveRarityCode(printingId: string): AltArtRarityCode {
  const info = getCyberpunkPrintingInfo(printingId);
  if (!info) return "common";
  return isCyberpunkAlternateArtId(info.artId) ? "enchanted" : "common";
}

/**
 * Display info for the platform atelier "acquire" modal: the card's name and a
 * representative image URL, keyed by canonical id. The name is the card's
 * `displayName` (authored, e.g. "Lucyna Kushinada") falling back to its
 * `name`. The image is resolved from the FREE DEFAULT printing
 * (see {@link defaultCyberpunkPrintingId}) so the modal shows the exact art
 * the deckbuilder renders for the base card — not a promotional or alt-art
 * variant the player may not own.
 *
 * Returns `null` for an unknown canonical id so the platform adapter can
 * preserve its strict "unknown card" rejection.
 */
export function getCyberpunkCardDisplay(
  canonicalId: string,
): { name: string; imageUrl: string } | null {
  const card = getMergedCyberpunkCardsById().get(canonicalId);
  if (!card) return null;

  // Prefer the default printing's image so the modal matches the deckbuilder.
  // Fall back to the first printing, then the card-level `imageUrl`, so a
  // canonical with no resolvable printing still returns something useful.
  const defaultPrintingId = defaultCyberpunkPrintingId(canonicalId);
  const printingInfos = getCyberpunkPrintingInfosForCanonical(canonicalId);
  const representative =
    (defaultPrintingId ? printingInfos.find((p) => p.printingId === defaultPrintingId) : null) ??
    printingInfos[0] ??
    null;

  const imageUrl = representative?.imageUrl ?? card.imageUrl;
  return {
    name: card.displayName || card.name,
    imageUrl,
  };
}
