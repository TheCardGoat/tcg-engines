import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { theWhiteRoseJewelOfTheGarden } from "./040-the-white-rose-jewel-of-the-garden";

describe("The White Rose - Jewel of the Garden", () => {
  describe("THE BEAUTY OF THE WORLD - When you play this character, gain 1 lore.", () => {
    it("gains 1 lore when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [theWhiteRoseJewelOfTheGarden],
        inkwell: theWhiteRoseJewelOfTheGarden.cost,
        deck: 1,
      });

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
      expect(
        testEngine.asPlayerOne().playCard(theWhiteRoseJewelOfTheGarden),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
    });
  });
});
