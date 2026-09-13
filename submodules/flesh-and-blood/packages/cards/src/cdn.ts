/**
 * Normalization orders printings by source quality before replacing private
 * source URLs with manifest-backed first-party CDN URLs, so the first usable
 * entry is the deterministic default printing.
 */
export function fabDefaultPrintingId(card: {
  printings: readonly { id: string; imageUrl: string }[];
}): string | undefined {
  for (const printing of card.printings) {
    if (typeof printing.imageUrl === "string" && printing.imageUrl.length > 0) return printing.id;
  }
  return undefined;
}
