import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { chemPurse } from "./119-chem-purse";
import { bellesFavoriteBook } from "./179-belles-favorite-book";

describe("Belle's Favorite Book", () => {
  it("banishes another item to put the top card of your deck into your inkwell facedown and exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [chemPurse],
      play: [bellesFavoriteBook, chemPurse],
    });
    const topDeckId = testEngine.findCardInstanceId(chemPurse, "deck", "player_one");

    expect(
      testEngine.asPlayerOne().activateAbility(bellesFavoriteBook, {
        ability: "CHAPTER THREE",
        costs: {
          banishItems: [chemPurse],
        },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(chemPurse)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(bellesFavoriteBook)).toBe("play");
    expect(
      testEngine.getAuthoritativeState().ctx.zones.private.cardMeta[topDeckId]?.publicFaceState,
    ).toBe("faceDown");
    expect(testEngine.asServer().getCard(topDeckId)?.exerted).toBe(true);
  });
});
