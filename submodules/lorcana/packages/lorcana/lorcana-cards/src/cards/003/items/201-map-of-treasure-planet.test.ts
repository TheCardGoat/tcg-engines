import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaScrappyCub } from "../characters";
import { bellesHouseMauricesWorkshop } from "../locations/168-belles-house-maurices-workshop";
import { mcduckManorScroogesMansion } from "../locations/169-mcduck-manor-scrooges-mansion";
import { mapOfTreasurePlanet } from "./201-map-of-treasure-planet";

describe("Map of Treasure Planet", () => {
  describe("KEY TO THE PORTAL — {E} — You pay 1 {I} less for the next location you play this turn.", () => {
    it("reduces the cost of the next location played by 1", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mcduckManorScroogesMansion],
        // mcduckManorScroogesMansion costs 4, we only have 3 ink
        inkwell: mcduckManorScroogesMansion.cost - 1,
        play: [mapOfTreasurePlanet],
      });

      expect(testEngine.asPlayerOne().canPlayCard(mcduckManorScroogesMansion)).toBe(false);

      const result = testEngine.asPlayerOne().activateAbility(mapOfTreasurePlanet, {
        ability: "KEY TO THE PORTAL",
      });

      expect(result).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(mapOfTreasurePlanet)).toBe(true);
      expect(testEngine.asPlayerOne().canPlayCard(mcduckManorScroogesMansion)).toBe(true);
      expect(testEngine.asPlayerOne().playCard(mcduckManorScroogesMansion)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(mcduckManorScroogesMansion)).toBe("play");
    });

    it("does not reduce the cost of a non-location card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [simbaScrappyCub],
        inkwell: 0,
        play: [mapOfTreasurePlanet],
      });

      const result = testEngine.asPlayerOne().activateAbility(mapOfTreasurePlanet, {
        ability: "KEY TO THE PORTAL",
      });

      expect(result).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().canPlayCard(simbaScrappyCub)).toBe(false);
    });
  });

  describe("SHOW THE WAY — You pay 1 {I} less to move your characters to a location.", () => {
    it("reduces the move cost to enter a location by 1", () => {
      // bellesHouseMauricesWorkshop has moveCost 2
      // With mapOfTreasurePlanet in play, it should cost 1 to move a character there
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mapOfTreasurePlanet, bellesHouseMauricesWorkshop, simbaScrappyCub],
        inkwell: bellesHouseMauricesWorkshop.moveCost - 1,
      });

      // Without the reduction, should need moveCost (2) ink, but we only have 1
      // With the reduction, it should cost 1
      expect(
        testEngine
          .asPlayerOne()
          .moveCharacterToLocation(simbaScrappyCub, bellesHouseMauricesWorkshop),
      ).toBeSuccessfulCommand();
    });

    it("without Map of Treasure Planet, full move cost is required", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [bellesHouseMauricesWorkshop, simbaScrappyCub],
        inkwell: bellesHouseMauricesWorkshop.moveCost - 1,
      });

      expect(
        testEngine
          .asPlayerOne()
          .moveCharacterToLocation(simbaScrappyCub, bellesHouseMauricesWorkshop),
      ).not.toBeSuccessfulCommand();
    });
  });
});
