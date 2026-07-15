import type { Card, CardPrinting, CardRarity, PrintFinish } from "@tcg/gundam-types";
import * as cardExports from "./cards/index.ts";

/**
 * Atelier (alt-art acquisition/rental) data export for Gundam.
 *
 * The platform atelier backend needs a game-agnostic view of a card's
 * printings — which ones are "alternate art" (require ownership), how they are
 * priced, and which printing is the free default. This module bridges the
 * Gundam card pool into that view without leaking engine concerns.
 *
 * Gundam's alt-art rule is finish-based: a printing is alternate art iff its
 * `finish === "parallel"`. Standard-finish printings are the free base;
 * parallel-finish printings (`_p1`, `_p2`, …) are the ownable alt-art tiers.
 *
 * Gundam card rarities map to the atelier pricing taxonomy natively
 * (RFC §4 table): `secretRare` → `enchanted` (120 marks permanent). Gundam's
 * art model is "cosmetic": art selections change only the displayed image,
 * never the engine `cardNumber`.
 */

/**
 * Atelier pricing-code taxonomy used by the platform alt-art
 * acquisition/rental system. This is NOT a Gundam card rarity — it is the set
 * of price-bucket keys shared across games so the platform can apply a single
 * pricing table. Defined locally in the game submodule because game workspaces
 * cannot depend on `@tcg/api-core`. The literal values are intentionally
 * identical to `platform/.../engagement.ts::AltArtRarityCode` so the platform
 * adapter accepts them via structural typing.
 */
export type AltArtRarityCode =
  | "common"
  | "uncommon"
  | "rare"
  | "super_rare"
  | "legendary"
  | "epic"
  | "iconic"
  | "enchanted"
  | "promo"
  | "special";

/**
 * Maps authored Gundam card rarities ({@link CardRarity}) to their atelier
 * pricing codes. `secretRare` anchors the cross-game calibration target at
 * `enchanted` (120 marks permanent).
 */
export const GUNDAM_RARITY_TO_CODE: Readonly<Record<CardRarity, AltArtRarityCode>> = {
  common: "common",
  uncommon: "uncommon",
  rare: "rare",
  legendRare: "legendary",
  superRare: "super_rare",
  secretRare: "enchanted",
  promo: "promo",
};

/**
 * Ordinal rank of each Gundam rarity, lowest first. Used by
 * {@link defaultGundamPrintingId} to pick the cheapest (lowest-rarity)
 * standard-finish printing as the free default.
 */
export const GUNDAM_RARITY_RANK: Readonly<Record<CardRarity, number>> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  legendRare: 3,
  superRare: 4,
  secretRare: 5,
  promo: 6,
};

/**
 * Minimal shape required to read a rarity code off a printing. Accepts a raw
 * {@link CardPrinting} or any adapter projection of it.
 */
interface PrintingRarityRef {
  rarity: CardRarity;
}

/**
 * Game-agnostic projection of a single Gundam printing. Mirrors the platform
 * adapter's `AltArtPrintingInfo` shape so the adapter can pass these straight
 * through.
 */
export interface GundamPrintingInfo {
  printingId: string;
  artId: string;
  canonicalId: string;
  setCode: string;
  collectorNumber: string;
  rarity: CardRarity;
  finish: PrintFinish;
  imageUrl: string;
}

/**
 * Type guard for a Gundam card definition (mirrors the catalog collection in
 * the platform loaders). Filters the barrel exports down to actual card
 * records, excluding non-card values.
 */
function isGundamCardLike(value: unknown): value is Card {
  return (
    typeof value === "object" &&
    value !== null &&
    "cardNumber" in value &&
    "name" in value &&
    "canonicalId" in value &&
    "printings" in value
  );
}

/**
 * The full Gundam card pool, collected once at module load from the cards
 * barrel and filtered to actual card definitions.
 */
const allGundamCards: Card[] = (() => {
  const out: Card[] = [];
  for (const value of Object.values(cardExports)) {
    if (isGundamCardLike(value)) out.push(value);
  }
  return out;
})();

function toPrintingInfo(canonicalId: string, printing: CardPrinting): GundamPrintingInfo {
  return {
    printingId: printing.id,
    artId: printing.artId,
    canonicalId,
    setCode: printing.setCode,
    collectorNumber: printing.collectorNumber,
    rarity: printing.rarity,
    finish: printing.finish,
    imageUrl: printing.imageUrl,
  };
}

/**
 * Memoized index of every printing across the Gundam card pool, keyed by
 * printing id. Built once at module load. A printing id resolves to the single
 * canonical card it belongs to.
 */
const printingInfoById: ReadonlyMap<string, GundamPrintingInfo> = (() => {
  const map = new Map<string, GundamPrintingInfo>();
  for (const card of allGundamCards) {
    for (const printing of card.printings) {
      if (!map.has(printing.id)) {
        map.set(printing.id, toPrintingInfo(card.canonicalId, printing));
      }
    }
  }
  return map;
})();

/**
 * Memoized index of canonical id → every printing on any card sharing that
 * canonical id (including BETA duplicates that reuse a `cardNumber`). Built
 * once at module load.
 */
const printingInfosByCanonicalId: ReadonlyMap<string, GundamPrintingInfo[]> = (() => {
  const map = new Map<string, GundamPrintingInfo[]>();
  for (const info of printingInfoById.values()) {
    const list = map.get(info.canonicalId) ?? [];
    list.push(info);
    map.set(info.canonicalId, list);
  }
  return map;
})();

/**
 * Resolve the canonical card id for any authored Gundam card id or card number.
 * The Gundam engine cardId is the `cardNumber` (or a selectedPrintingId
 * carrying a `_pN` suffix); this resolves both `card.id` and `card.cardNumber`
 * to the canonical id. Returns `null` for truly-unknown ids.
 */
export function getGundamCanonicalForCardId(cardId: string): string | null {
  for (const card of allGundamCards) {
    if (card.id === cardId || card.cardNumber === cardId) return card.canonicalId;
  }
  return null;
}

/**
 * Every canonical id present in the Gundam card pool. Duplicates (from BETA
 * reprints sharing a `cardNumber`) are collapsed to a single canonical id.
 */
export function listGundamCanonicalIds(): string[] {
  return Array.from(printingInfosByCanonicalId.keys());
}

/**
 * Every printing unioned onto the canonical card for the given canonical id.
 * Returns `[]` for an unknown canonical id.
 */
export function getGundamPrintingInfosForCanonical(canonicalId: string): GundamPrintingInfo[] {
  return printingInfosByCanonicalId.get(canonicalId) ?? [];
}

/**
 * Look up a single printing by id. Returns `null` if the printing id is not
 * present on any Gundam card.
 */
export function getGundamPrintingInfo(printingId: string): GundamPrintingInfo | null {
  return printingInfoById.get(printingId) ?? null;
}

/**
 * Normalize a Gundam printing's rarity into an atelier pricing code. This is
 * the RAW rarity only — it does NOT apply any finish-based bump. Returns
 * `"common"` for unknown values.
 */
export function gundamRarityCode(printing: PrintingRarityRef): AltArtRarityCode {
  return GUNDAM_RARITY_TO_CODE[printing.rarity] ?? "common";
}

/**
 * True if the printing is a parallel-finish alt-art printing. Such printings
 * are the ownable alt-art tiers; standard-finish printings are the free base.
 */
export function isGundamAlternateArtPrinting(printingId: string): boolean {
  return printingInfoById.get(printingId)?.finish === "parallel";
}

/**
 * Security boundary: confirm `printingId` is genuinely a printing of the given
 * canonical card. Prevents crafted `artSelections` from selecting a printing
 * that belongs to a DIFFERENT gameplay card. Returns `false` for unknown
 * printing ids.
 */
export function isGundamPrintingOfCanonical(printingId: string, canonicalId: string): boolean {
  return getGundamPrintingInfo(printingId)?.canonicalId === canonicalId;
}

/**
 * The free default printing for a canonical card: the lowest-rarity
 * standard-finish (non-parallel) printing. If every printing is parallel
 * (rare), the lowest-rarity printing is returned anyway so the caller never
 * gets `null` for a valid canonical. Returns `null` only for an unknown
 * canonical id or a card with no printings.
 */
export function defaultGundamPrintingId(canonicalId: string): string | null {
  const printings = getGundamPrintingInfosForCanonical(canonicalId);
  if (printings.length === 0) return null;

  const standard = printings.filter((p) => p.finish !== "parallel");
  const candidates = standard.length > 0 ? standard : printings;

  const sorted = candidates.toSorted((a, b) => {
    const rarityDiff = GUNDAM_RARITY_RANK[a.rarity] - GUNDAM_RARITY_RANK[b.rarity];
    if (rarityDiff !== 0) return rarityDiff;
    return a.collectorNumber.localeCompare(b.collectorNumber);
  });
  return sorted[0]?.printingId ?? null;
}

/**
 * Atelier pricing code for a Gundam printing — this is what the platform
 * atelier uses to price a printing in Marks. Maps the authored rarity through
 * {@link GUNDAM_RARITY_TO_CODE} (`secretRare` → `enchanted`). Returns
 * `"common"` for an unknown printing id.
 */
export function gundamPrintingEffectiveRarityCode(printingId: string): AltArtRarityCode {
  const info = getGundamPrintingInfo(printingId);
  if (!info) return "common";
  return gundamRarityCode(info);
}

/**
 * Display info for the platform atelier "acquire" modal: the card's name and a
 * representative image URL, keyed by canonical id. The name is the card's
 * `displayName` falling back to its `name`. The image is resolved from the
 * free default printing so the modal shows the exact art the deckbuilder
 * renders for the base card.
 *
 * Returns `null` for an unknown canonical id.
 */
export function getGundamCardDisplay(
  canonicalId: string,
): { name: string; imageUrl: string } | null {
  const card = allGundamCards.find((c) => c.canonicalId === canonicalId);
  if (!card) return null;

  const defaultPrintingId = defaultGundamPrintingId(canonicalId);
  const printings = getGundamPrintingInfosForCanonical(canonicalId);
  const representative =
    (defaultPrintingId ? printings.find((p) => p.printingId === defaultPrintingId) : null) ??
    printings[0] ??
    null;

  const imageUrl = representative?.imageUrl ?? card.imageUrl ?? "";
  return {
    name: card.displayName || card.name,
    imageUrl,
  };
}
