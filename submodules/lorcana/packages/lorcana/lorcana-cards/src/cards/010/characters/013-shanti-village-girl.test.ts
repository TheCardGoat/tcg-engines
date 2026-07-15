import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { shantiVillageGirl } from "./013-shanti-village-girl";
import { beOurGuest } from "../../001/actions/025-be-our-guest";

describe("Shanti - Village Girl", () => {
  it("should have Singer 5 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [shantiVillageGirl],
    });

    const cardUnderTest = testEngine.getCardModel(shantiVillageGirl);
    expect(cardUnderTest.hasSinger()).toBe(true);
    expect(cardUnderTest.singerCost).toBe(5);
  });

  describe("SINGER 5 - This character counts as cost 5 when singing a song", () => {
    it("can sing a song costing 5 or less", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [beOurGuest],
        play: [shantiVillageGirl],
      });

      const result = testEngine.asPlayerOne().singSong(beOurGuest, shantiVillageGirl);
      expect(result.success).toBe(true);
      expect(testEngine.asPlayerOne().isExerted(shantiVillageGirl)).toBe(true);
    });
  });
});
