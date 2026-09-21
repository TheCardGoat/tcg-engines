import { resolveGrandArchiveImage } from "@tcg/grand-archive-cards";
import { describe, expect, it } from "vitest";
import { grandArchivePublicDeckBoards, prepareGrandArchivePlatformDeck } from "./platform-decks";

describe("Grand Archive public deck presentation", () => {
  it("preserves material, sideboard, selected art, and the starting Champion", () => {
    const prepared = prepareGrandArchivePlatformDeck({
      mainDeck: [{ cardId: "h5lahljr2d", quantity: 3 }],
      materialDeck: [{ cardId: "vskyslv2qq", quantity: 1 }],
      sideboard: [{ cardId: "h5lahljr2d", quantity: 1 }],
      startingChampionId: "0rapy8v7x0",
    });
    const boards = grandArchivePublicDeckBoards(prepared.document);
    expect(boards.main[0]).toMatchObject({
      canonicalId: "08kkz07nau",
      printingId: "h5lahljr2d",
      quantity: 3,
      name: "Surging Bolt",
    });
    expect(boards.sideboard[0]).toMatchObject({ canonicalId: "08kkz07nau", quantity: 1 });
    expect(boards.material[0]).toMatchObject({
      canonicalId: "0rapy8v7x0",
      printingId: "vskyslv2qq",
      name: "Morrigan, Lost Spirit",
    });
    expect(boards.material[0]?.imageUrl).toBe(resolveGrandArchiveImage("0rapy8v7x0", "vskyslv2qq"));
    expect(boards.startingChampionId).toBe("0rapy8v7x0");
  });

  it("rejects a missing document rather than displaying an empty public deck", () => {
    expect(() => grandArchivePublicDeckBoards(null)).toThrow("authoritative document");
  });
});
