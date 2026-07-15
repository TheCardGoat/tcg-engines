import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { elsaIceArtisan } from "./123-elsa-ice-artisan";

describe("Elsa - Ice Artisan", () => {
  it("has Shift keyword", () => {
    const testEngine = new LorcanaTestEngine({
      play: [elsaIceArtisan],
    });

    const cardUnderTest = testEngine.getCardModel(elsaIceArtisan);
    expect(cardUnderTest.hasShift()).toBe(true);
  });

  describe("DISTANT CALL", () => {
    it("should only get +3 lore while at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [elsaIceArtisan],
      });

      const elsa = testEngine.asPlayerOne().getCard(elsaIceArtisan);
      expect(elsa.lore).toBe(elsaIceArtisan.lore);
    });
  });
});
