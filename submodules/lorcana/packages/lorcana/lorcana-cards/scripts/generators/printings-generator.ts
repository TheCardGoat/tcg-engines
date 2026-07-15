/**
 * Printings Generator
 *
 * Generates printings.json from input cards.
 * Each printing represents a physical card instance with variants.
 */

import {
  generatePrintingId,
  getFullNameFromCard,
  getSpecialRarity,
  parseCardIdentifier,
  type PrintingItem,
} from "../parsers/input-parser";
import type {
  CardPrinting,
  CardType,
  CardVariant,
  InputCard,
  InputCardVariant,
  PipelineIdMapping,
  Rarity,
  SpecialRarity,
} from "../types";

function nextAvailableNumericSuffix(
  isTaken: (suffix: number) => boolean,
  maxAttempts = 10_000,
): number {
  for (let suffix = 2; suffix < maxAttempts + 2; suffix += 1) {
    if (!isTaken(suffix)) {
      return suffix;
    }
  }

  throw new Error(`Unable to find an available numeric suffix after ${maxAttempts} attempts.`);
}

/**
 * Map rarity string to output format
 */
function mapRarity(rarity: string): Rarity {
  const rarityMap: Record<string, Rarity> = {
    COMMON: "common",
    UNCOMMON: "uncommon",
    RARE: "rare",
    SUPER_RARE: "super_rare",
    LEGENDARY: "legendary",
    ENCHANTED: "enchanted",
    SPECIAL: "special",
  };

  return rarityMap[rarity.toUpperCase()] || "common";
}

/**
 * Extract hash from a Ravensburger image URL.
 * URL format: https://api.lorcana.ravensburger.com/images/en/{set}/{num}_{hash}.jpg
 * Returns the 40-char hash, or the full URL if pattern doesn't match.
 */
function extractImageHash(url: string): string {
  const match = url.match(/_([a-f0-9]{40})\.jpg$/i);
  return match ? match[1] : url;
}

/**
 * Transform input variant to output variant
 * Stores only the image hash instead of full URL to save space.
 */
function transformVariant(inputVariant: InputCardVariant): CardVariant {
  const variant: CardVariant = {
    type: inputVariant.variant_id === "Foiled" ? "foil" : "regular",
    imageHash: extractImageHash(inputVariant.detail_image_url),
  };

  if (inputVariant.foil_type) {
    variant.foilType = inputVariant.foil_type;
  }

  if (inputVariant.foil_mask_url) {
    variant.foilMaskHash = extractImageHash(inputVariant.foil_mask_url);
  }

  return variant;
}

/**
 * Post-process variants: if foil imageHash equals regular imageHash, omit it from foil.
 */
function deduplicateFoilImages(variants: CardVariant[]): CardVariant[] {
  const regular = variants.find((v) => v.type === "regular");
  if (!regular) return variants;

  return variants.map((v) => {
    if (v.type === "foil" && v.imageHash === regular.imageHash) {
      const { imageHash, ...rest } = v;
      return rest;
    }
    return v;
  });
}

/**
 * Compute printing IDs in the same order as printing items (with collision suffix).
 * Used to build printingIdsInOrder before assigning short IDs.
 */
export function computePrintingIdsInOrder(items: PrintingItem[]): string[] {
  const order: string[] = [];
  const seen: Record<string, boolean> = {};
  for (const { card, setId } of items) {
    const parsed = parseCardIdentifier(card.card_identifier);
    if (!parsed) {
      order.push("");
      continue;
    }
    const specialRarity = getSpecialRarity(card);
    let printingId = generatePrintingId(
      setId,
      parsed.cardNumber,
      specialRarity ?? undefined,
      parsed.promoSheetCode,
    );
    if (seen[printingId]) {
      const suffix = nextAvailableNumericSuffix((n) => Boolean(seen[`${printingId}-${n}`]));
      printingId = `${printingId}-${suffix}`;
    }
    seen[printingId] = true;
    order.push(printingId);
  }
  return order;
}

/**
 * Build a printing from card + explicit printingId and shortId.
 * Used when printingIdsInOrder is precomputed (byPrintingId keyed by that id).
 */
function buildPrintingFromIds(
  card: InputCard & { cardType: CardType },
  setId: string,
  printingId: string,
  shortId: string,
): CardPrinting {
  const parsed = parseCardIdentifier(card.card_identifier);
  if (!parsed) throw new Error("buildPrintingFromIds requires parseable card_identifier");
  const specialRarity = getSpecialRarity(card);
  const printing: CardPrinting = {
    id: printingId,
    gameCardId: shortId,
    set: setId,
    cardNumber: parsed.cardNumber,
    rarity: mapRarity(card.rarity),
    variants: deduplicateFoilImages((card.variants || []).map(transformVariant)),
  };
  if (specialRarity) printing.specialRarity = specialRarity;
  if (parsed.promoSheetCode) printing.promoSheetCode = parsed.promoSheetCode;
  if (card.author) printing.author = card.author;
  if (card.flavor_text) printing.flavorText = card.flavor_text;
  if (card.set_rotation_state) printing.setRotationState = card.set_rotation_state;
  if (card.sort_number !== undefined) printing.sortNumber = card.sort_number;
  return printing;
}

/**
 * Transform a single input card to a printing.
 * Short ID is from byPrintingId[printingId] when set; otherwise byCanonicalKey (legacy).
 */
export function transformToPrinting(
  card: InputCard & { cardType: CardType },
  setId: string,
  idMapping: PipelineIdMapping,
): CardPrinting | null {
  const parsed = parseCardIdentifier(card.card_identifier);
  if (!parsed) return null;

  const specialRarity = getSpecialRarity(card);
  const printingId = generatePrintingId(
    setId,
    parsed.cardNumber,
    specialRarity ?? undefined,
    parsed.promoSheetCode,
  );
  const canonicalKey = getFullNameFromCard(card).toLowerCase();
  const shortId = idMapping.byPrintingId[printingId] ?? idMapping.byCanonicalKey[canonicalKey];

  if (!shortId) {
    console.warn(`No short ID found for canonical key: ${canonicalKey}`);
    return null;
  }

  return buildPrintingFromIds(card, setId, printingId, shortId);
}

/**
 * Ensure printing id is unique in the record; if collision, append numeric suffix.
 */
function ensureUniquePrintingId(
  printings: Record<string, CardPrinting>,
  printing: CardPrinting,
): CardPrinting {
  let id = printing.id;
  if (!printings[id]) return printing;
  const suffix = nextAvailableNumericSuffix((n) => Boolean(printings[`${id}-${n}`]));
  return { ...printing, id: `${id}-${suffix}` };
}

/**
 * Generate all printings from input cards.
 * One printing per (card, set); ids are unique (specialRarity suffix or numeric on collision).
 */
export function generatePrintings(
  cards: Array<InputCard & { cardType: CardType }>,
  idMapping: PipelineIdMapping,
): Record<string, CardPrinting> {
  const printings: Record<string, CardPrinting> = {};

  for (const card of cards) {
    for (const setId of card.card_sets) {
      const printing = transformToPrinting(card, setId, idMapping);
      if (printing) {
        const unique = ensureUniquePrintingId(printings, printing);
        printings[unique.id] = unique;
      }
    }
  }

  return printings;
}

/**
 * Generate printings from expanded printing items (one per item).
 * When printingIdsInOrder is provided (from computePrintingIdsInOrder), uses it and
 * byPrintingId for shortIds; ids are already unique so no collision suffix is applied.
 * When not provided, uses transformToPrinting and ensureUniquePrintingId (legacy).
 */
export function generatePrintingsFromItems(
  items: PrintingItem[],
  idMapping: PipelineIdMapping,
  printingIdsInOrder?: string[],
): { printings: Record<string, CardPrinting>; printingIdsInOrder: string[] } {
  const printings: Record<string, CardPrinting> = {};
  const order: string[] = [];

  if (printingIdsInOrder !== undefined) {
    for (let i = 0; i < items.length; i++) {
      const printingId = printingIdsInOrder[i];
      if (!printingId) {
        order.push("");
        continue;
      }
      const shortId = idMapping.byPrintingId[printingId];
      if (!shortId) {
        order.push("");
        continue;
      }
      const { card, setId } = items[i];
      const printing = buildPrintingFromIds(card, setId, printingId, shortId);
      printings[printingId] = printing;
      order.push(printingId);
    }
    return { printings, printingIdsInOrder: order };
  }

  for (const { card, setId } of items) {
    const printing = transformToPrinting(card, setId, idMapping);
    if (printing) {
      const unique = ensureUniquePrintingId(printings, printing);
      printings[unique.id] = unique;
      order.push(unique.id);
    } else {
      order.push("");
    }
  }
  return { printings, printingIdsInOrder: order };
}

/**
 * Calculate total cards per set from printings
 */
export function calculateSetTotals(printings: Record<string, CardPrinting>): Map<string, number> {
  const setTotals = new Map<string, number>();

  for (const printing of Object.values(printings)) {
    const current = setTotals.get(printing.set) || 0;
    // Only count base cards (not special rarities) for set total
    if (!printing.specialRarity) {
      setTotals.set(printing.set, Math.max(current, printing.cardNumber));
    }
  }

  return setTotals;
}
