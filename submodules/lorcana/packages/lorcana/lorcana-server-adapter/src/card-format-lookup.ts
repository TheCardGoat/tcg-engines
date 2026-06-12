import { getAllCardsByIdSync } from "@tcg/lorcana-cards/cards/sync";
import { cardsAuxKv, printings, sets } from "@tcg/lorcana-cards/data";
import type { CardFormatData, LorcanaSetCode } from "@tcg/lorcana-types";

const setCodeBySetId: Record<string, string> = {};
for (const s of Object.values(sets)) {
  setCodeBySetId[s.id] = s.code;
}

let lookupCache: ((shortId: string) => CardFormatData | undefined) | null = null;

/**
 * Derive the full display name for a card.
 */
function getCardFullName(card: { fullName?: string; name: string; version?: string }): string {
  return card.fullName ?? (card.version ? `${card.name} - ${card.version}` : card.name);
}

/**
 * Collect set codes from a list of printing IDs.
 */
function collectSetCodes(printingIds: string[]): Set<string> {
  const codes = new Set<string>();
  for (const pid of printingIds) {
    const setId = printings[pid]?.set;
    if (setId) {
      const code = setCodeBySetId[setId];
      if (code) codes.add(code);
    }
  }
  return codes;
}

/**
 * Collect rotation states from a list of printing IDs.
 */
function collectRotationStates(printingIds: string[]): string[] {
  return [
    ...new Set(
      printingIds
        .map((pid) => printings[pid]?.setRotationState)
        .filter((rs): rs is string => Boolean(rs)),
    ),
  ];
}

/**
 * Card metadata lookup for {@link validateDeckForFormat} / DAC format validation.
 * Maps deck `cardId` (Lorcana short id, same keys as {@link getAllCardsByIdSync}) to {@link CardFormatData}.
 *
 * Includes a name-based fallback: if a card's canonicalId grouping misses a
 * reprint, the lookup also checks all other shortIds that share the same full
 * name. This is a safety net for stale data or canonicalId mismatches.
 */
export function getLorcanaCardFormatLookup(): (shortId: string) => CardFormatData | undefined {
  if (lookupCache) return lookupCache;

  const cardsById = getAllCardsByIdSync();

  // Pre-compute name → shortId[] index for the name-based fallback.
  const shortIdsByFullName: Record<string, string[]> = {};
  for (const [sid, c] of Object.entries(cardsById)) {
    const fn = getCardFullName(c).toLowerCase();
    (shortIdsByFullName[fn] ??= []).push(sid);
  }

  lookupCache = (shortId: string): CardFormatData | undefined => {
    const card = cardsById[shortId];
    if (!card) return undefined;

    const kvPrintingIds = cardsAuxKv.printingIdsByCanonicalId[card.canonicalId] ?? [];
    // Supplement (not override) with reprint IDs stored directly on the card.
    // These are only added when missing from the canonical KV lookup, bridging any
    // ID mismatches between hand-crafted TS card files and the Ravensburger data.
    const reprintIds: string[] = Array.isArray(card.reprints) ? card.reprints : [];
    const printingIds = [...new Set([...kvPrintingIds, ...reprintIds])];

    // Primary: sets from the canonical grouping.
    const setCodes = collectSetCodes(printingIds);

    // Name-based fallback: include sets from sibling shortIds (same full name,
    // possibly different canonicalId due to stale data).
    const fn = getCardFullName(card).toLowerCase();
    const siblings = shortIdsByFullName[fn] ?? [];
    for (const sibId of siblings) {
      if (sibId === shortId) continue;
      const sibCard = cardsById[sibId];
      if (!sibCard) continue;
      const sibPrintings = cardsAuxKv.printingIdsByCanonicalId[sibCard.canonicalId] ?? [];
      for (const code of collectSetCodes(sibPrintings)) {
        setCodes.add(code);
      }
    }

    // Rotation states from all printings (primary + siblings).
    const allPrintingIds = [...printingIds];
    for (const sibId of siblings) {
      if (sibId === shortId) continue;
      const sibCard = cardsById[sibId];
      if (!sibCard) continue;
      const sibPrintings = cardsAuxKv.printingIdsByCanonicalId[sibCard.canonicalId] ?? [];
      allPrintingIds.push(...sibPrintings);
    }

    return {
      canonicalId: card.canonicalId,
      fullName: getCardFullName(card),
      sets: [...setCodes] as LorcanaSetCode[],
      inkTypes: card.inkType,
      cardCopyLimit: card.cardCopyLimit,
      rotationStates: collectRotationStates(allPrintingIds),
    };
  };

  return lookupCache;
}
