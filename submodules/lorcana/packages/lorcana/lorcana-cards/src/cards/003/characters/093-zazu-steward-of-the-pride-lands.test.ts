import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockLocation } from "@tcg/lorcana-engine/testing";
import { zazuStewardOfThePrideLands } from "./093-zazu-steward-of-the-pride-lands";

const prideRock = createMockLocation({
  id: "zazu-steward-pride-rock",
  name: "Pride Rock",
  cost: 1,
  moveCost: 1,
  willpower: 4,
  lore: 1,
});

describe("Zazu - Steward of the Pride Lands", () => {
  describe("IT'S TIME TO GO! - While this character is at a location, he gets +1 {L}.", () => {
    it("gets +1 lore while at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [zazuStewardOfThePrideLands, prideRock],
        inkwell: prideRock.moveCost,
      });

      expect(testEngine.asPlayerOne().getCard(zazuStewardOfThePrideLands)?.lore).toBe(
        zazuStewardOfThePrideLands.lore,
      );

      expect(
        testEngine.asPlayerOne().moveCharacterToLocation(zazuStewardOfThePrideLands, prideRock),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(zazuStewardOfThePrideLands)?.lore).toBe(
        zazuStewardOfThePrideLands.lore + 1,
      );
    });

    it("does NOT get +1 lore when not at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [zazuStewardOfThePrideLands],
      });

      expect(testEngine.asPlayerOne().getCard(zazuStewardOfThePrideLands)?.lore).toBe(
        zazuStewardOfThePrideLands.lore,
      );
    });
  });
});
