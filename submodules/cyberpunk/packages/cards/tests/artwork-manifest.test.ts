import { describe, expect, it } from "vite-plus/test";

import {
  CYBERPUNK_LEGACY_ART_ID_TO_ART_ID,
  getCyberpunkArtIdForPrinting,
  getCyberpunkFreeArtIdsForCanonical,
  getMergedCyberpunkCards,
  isCyberpunkAlternateArtId,
  isCyberpunkAlternateArtPrinting,
} from "../src/index.ts";

describe("Cyberpunk appearance catalog", () => {
  it("maps every canonical printing to one reviewed appearance and keeps a free appearance", () => {
    const cards = getMergedCyberpunkCards();
    const printings = cards.flatMap((card) => card.printings);
    const artIds = new Set(printings.map((printing) => printing.artId));

    expect(cards).toHaveLength(152);
    expect(printings).toHaveLength(536);
    expect(artIds).toHaveLength(290);
    expect(Object.keys(CYBERPUNK_LEGACY_ART_ID_TO_ART_ID)).toHaveLength(printings.length);

    for (const card of cards) {
      const freeArtIds = getCyberpunkFreeArtIdsForCanonical(card.canonicalId);
      expect(freeArtIds).toHaveLength(1);
      expect(card.printings.some((printing) => printing.artId === freeArtIds[0])).toBe(true);
      expect(isCyberpunkAlternateArtId(freeArtIds[0]!)).toBe(false);

      for (const printing of card.printings) {
        expect(getCyberpunkArtIdForPrinting(printing.id)).toBe(printing.artId);
        expect(CYBERPUNK_LEGACY_ART_ID_TO_ART_ID[printing.id]).toBe(printing.artId);
        expect(isCyberpunkAlternateArtPrinting({ printingId: printing.id })).toBe(
          isCyberpunkAlternateArtId(printing.artId),
        );
      }
    }
  });

  it("shares art for equivalent beta and retail prints while keeping true variants distinct", () => {
    const dexterRetail = "e2f38541-ecc9-41dc-ae15-164171391bff";
    const dexterBeta = "f9c512f2-a41f-4114-9500-cee3f8d8cc35";
    expect(getCyberpunkArtIdForPrinting(dexterRetail)).toBe(dexterRetail);
    expect(getCyberpunkArtIdForPrinting(dexterBeta)).toBe(dexterRetail);

    const rebeccaBase = "71a35836-e604-4d98-ab56-58bfb4581033";
    const rebeccaVariant = "f625d2ac-3007-48f4-82b3-b521fc11a172";
    expect(getCyberpunkArtIdForPrinting(rebeccaBase)).toBe(rebeccaBase);
    expect(getCyberpunkArtIdForPrinting(rebeccaVariant)).toBe(rebeccaVariant);
    expect(isCyberpunkAlternateArtId(rebeccaBase)).toBe(false);
    expect(isCyberpunkAlternateArtId(rebeccaVariant)).toBe(true);
  });

  it("fails closed when asked to classify an unknown art identity", () => {
    expect(() => isCyberpunkAlternateArtId("missing-art-id")).toThrow(
      "Unknown Cyberpunk art identity missing-art-id",
    );
  });
});
