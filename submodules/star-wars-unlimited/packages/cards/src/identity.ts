import { allCards } from "./generated.ts";

export interface SwuPrintingIdentityInfo {
  printingId: string;
  artId: string;
  canonicalId: string;
  setCode: string;
  collectorNumber: string;
  rarity: string;
  imageUrl: string;
}

const printingInfoById: ReadonlyMap<string, SwuPrintingIdentityInfo> = (() => {
  const map = new Map<string, SwuPrintingIdentityInfo>();
  for (const card of allCards) {
    for (const printing of card.printings) {
      if (!map.has(printing.id)) {
        map.set(printing.id, {
          printingId: printing.id,
          artId: printing.artId,
          canonicalId: card.canonicalId,
          setCode: printing.setCode,
          collectorNumber: printing.collectorNumber,
          rarity: printing.rarity,
          imageUrl: printing.imageUrl,
        });
      }
    }
  }
  return map;
})();

const printingInfosByCanonicalId: ReadonlyMap<string, SwuPrintingIdentityInfo[]> = (() => {
  const map = new Map<string, SwuPrintingIdentityInfo[]>();
  for (const info of printingInfoById.values()) {
    const list = map.get(info.canonicalId) ?? [];
    list.push(info);
    map.set(info.canonicalId, list);
  }
  for (const list of map.values()) {
    list.sort((left, right) => {
      const set = left.setCode.localeCompare(right.setCode);
      if (set !== 0) return set;
      const collector = left.collectorNumber.localeCompare(right.collectorNumber, undefined, {
        numeric: true,
      });
      if (collector !== 0) return collector;
      return left.printingId.localeCompare(right.printingId);
    });
  }
  return map;
})();

const canonicalIdByCardId: ReadonlyMap<string, string> = new Map(
  allCards.map((card) => [card.id, card.canonicalId]),
);

export function getSwuCanonicalForCardId(cardId: string): string | null {
  return canonicalIdByCardId.get(cardId) ?? printingInfoById.get(cardId)?.canonicalId ?? null;
}

export function getSwuPrintingInfo(printingId: string): SwuPrintingIdentityInfo | null {
  return printingInfoById.get(printingId) ?? null;
}

export function getSwuPrintingInfosForCanonical(canonicalId: string): SwuPrintingIdentityInfo[] {
  return printingInfosByCanonicalId.get(canonicalId) ?? [];
}

export function defaultSwuPrintingId(canonicalId: string): string | null {
  return getSwuPrintingInfosForCanonical(canonicalId)[0]?.printingId ?? null;
}

export function isSwuPrintingOfCanonical(printingId: string, canonicalId: string): boolean {
  return getSwuPrintingInfo(printingId)?.canonicalId === canonicalId;
}
