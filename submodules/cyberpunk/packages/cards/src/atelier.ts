import type { AltArtRarityCode, CardPrinting, CardRarity } from "@tcg/cyberpunk-types";
import { getMergedCyberpunkCards, getMergedCyberpunkCardsById, setPriority } from "./merged.ts";

/**
 * Atelier (alt-art acquisition/rental) data export for Cyberpunk.
 *
 * The platform atelier backend needs a game-agnostic view of a card's
 * printings — which ones are "alternate art" (require ownership), how they are
 * priced, and which printing is the free default. This module bridges the
 * Cyberpunk card pool into that view without leaking engine concerns.
 *
 * Calibration target (shared with Lorcana): the rarest printing in each game
 * prices at 120 marks permanent (`enchanted`). Cyberpunk satisfies this via
 * the alt-art-set bump (see {@link CYBERPUNK_ALT_ART_SET_CODES}) — every
 * printing in a flagged set is treated as top-tier (`enchanted`) alternate
 * art. Lorcana satisfies it natively via `specialRarity`.
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
  "Nova Rare": "epic",
};

/**
 * Ordinal rank of each Cyberpunk rarity, lowest first. Used by
 * {@link defaultCyberpunkPrintingId} to pick the cheapest (lowest-rarity)
 * printing as the free default. Only the four rarities that actually appear in
 * Cyberpunk data are ranked.
 */
export const CYBERPUNK_RARITY_RANK: Readonly<Record<CyberpunkRarityCode, number>> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  epic: 3,
};

/**
 * Sets whose printings are ALL treated as top-tier (`enchanted`) alternate art.
 * Per the locked calibration: `promo`, `boxtoppersretail`, and `boxtoppersbeta`
 * printings are the rarest Cyberpunk art and are priced at 120 marks permanent
 * to match Lorcana's `enchanted`. Exported so the bump can be tuned in one place.
 */
export const CYBERPUNK_ALT_ART_SET_CODES: ReadonlySet<string> = new Set([
  "PRM01",
  "promo",
  "boxtoppersretail",
  "boxtoppersbeta",
]);

/**
 * Minimal shape required to decide whether a printing lives in an alt-art set.
 * Accepts a raw {@link CardPrinting} (which carries `setCode`) or any adapter
 * projection of it.
 */
export interface CyberpunkPrintingSetRef {
  setCode: string;
}

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
 * True if the printing belongs to a Cyberpunk alt-art set
 * (see {@link CYBERPUNK_ALT_ART_SET_CODES}). Such printings are priced at the
 * top tier and require ownership to select in the deckbuilder.
 *
 * Note: the platform adapter additionally honors a `specialRarity`-based bump
 * for cross-game parity. Cyberpunk printings have no `specialRarity`, so this
 * set-membership check is the sole source of alt-art-ness here.
 */
export function isCyberpunkAlternateArtPrinting(printing: CyberpunkPrintingSetRef): boolean {
  return CYBERPUNK_ALT_ART_SET_CODES.has(printing.setCode);
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
 * - `canonicalId` is the merged (slug-unique) card id — the same id the
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
 * Resolve the canonical (merged) card id for any authored Cyberpunk card id —
 * including cross-set ids that share a slug with a higher-priority canonical
 * (e.g. a spoiler id resolves to its retail canonical). Returns `null` for
 * truly-unknown ids, so callers can keep a strict "unknown card" rejection.
 */
export function getCyberpunkCanonicalForCardId(cardId: string): string | null {
  return getMergedCyberpunkCardsById().get(cardId)?.id ?? null;
}

/**
 * Every printing unioned onto the canonical card for the given canonical id.
 * Returns `[]` for an unknown canonical id. The canonical id is the merged
 * card's `id` (see {@link getCyberpunkCanonicalForCardId}).
 */
export function getCyberpunkPrintingInfosForCanonical(
  canonicalId: string,
): CyberpunkPrintingInfo[] {
  const card = getMergedCyberpunkCardsById().get(canonicalId);
  if (!card) return [];
  return card.printings.map((printing) => toPrintingInfo(card.id, printing));
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
        map.set(printing.id, toPrintingInfo(card.id, printing));
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
 * The free default printing for a canonical card: the lowest-rarity printing
 * that is NOT in an alt-art set (alt-art printings require ownership). Ties on
 * rarity are broken by LOWEST {@link setPriority} first (so the earliest-set
 * printing wins), then by ascending `collectorNumber` — per the locked Phase-1
 * design. The "lowest sortNumber" rule keeps the default stable even when a
 * card is reprinted in a higher-priority retail set later.
 *
 * If every printing is alt-art (rare — e.g. a promo-only card), the
 * lowest-rarity printing is returned anyway so the caller never gets `null`
 * for a valid canonical. Returns `null` only for an unknown canonical id or a
 * card with no printings.
 */
export function defaultCyberpunkPrintingId(canonicalId: string): string | null {
  const printings = getCyberpunkPrintingInfosForCanonical(canonicalId);
  if (printings.length === 0) return null;

  const nonAltArt = printings.filter((p) => !isCyberpunkAlternateArtPrinting({ setCode: p.set }));
  const candidates = nonAltArt.length > 0 ? nonAltArt : printings;

  const sorted = candidates.toSorted((a, b) => {
    const rarityDiff =
      CYBERPUNK_RARITY_RANK[cyberpunkRarityCode(a)] - CYBERPUNK_RARITY_RANK[cyberpunkRarityCode(b)];
    if (rarityDiff !== 0) return rarityDiff;
    // Lowest sortNumber wins (earliest-defined set), then ascending collector
    // number — see the JSDoc above for the rationale.
    const sortDiff = setPriority(a.set) - setPriority(b.set);
    if (sortDiff !== 0) return sortDiff;
    return a.cardNumber.localeCompare(b.cardNumber);
  });
  return sorted[0]?.printingId ?? null;
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
 * Composes {@link cyberpunkRarityCode} with the alt-art-set bump: a printing
 * whose set is in {@link CYBERPUNK_ALT_ART_SET_CODES} (`promo`,
 * `boxtoppersretail`, or `boxtoppersbeta`) is priced at `"enchanted"` (the top
 * tier = 120 Marks permanent), matching Lorcana's rarest alternate-art
 * printings so the cross-game calibration target holds. Every other printing is
 * priced at its raw normalized rarity.
 *
 * Returns `"common"` for an unknown printing id (the safest default — never
 * grants ownership of a top-tier printing by accident).
 */
export function cyberpunkPrintingEffectiveRarityCode(printingId: string): AltArtRarityCode {
  const info = getCyberpunkPrintingInfo(printingId);
  if (!info) return "common";
  if (isCyberpunkAlternateArtPrinting({ setCode: info.set })) {
    return "enchanted";
  }
  return cyberpunkRarityCode(info);
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
