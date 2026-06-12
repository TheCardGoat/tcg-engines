import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { isisVanderchillIceQueenOfStCanard } from "./038-isis-vanderchill-ice-queen-of-st-canard";

const opposingCharacter = createMockCharacter({
  id: "isis-vc-opposing-character",
  name: "Opposing Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Isis Vanderchill - Ice Queen of St. Canard", () => {
  describe("CHILL OUT - When you play this character, exert chosen opposing character.", () => {
    it("exerts the chosen opposing character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [isisVanderchillIceQueenOfStCanard],
          inkwell: isisVanderchillIceQueenOfStCanard.cost,
        },
        {
          play: [opposingCharacter],
        },
      );

      expect(testEngine.asPlayerTwo().isExerted(opposingCharacter)).toBe(false);

      expect(
        testEngine.asPlayerOne().playCard(isisVanderchillIceQueenOfStCanard),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(isisVanderchillIceQueenOfStCanard, {
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().isExerted(opposingCharacter)).toBe(true);
    });

    it("does not exert an opposing character when there are no opposing characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [isisVanderchillIceQueenOfStCanard],
          inkwell: isisVanderchillIceQueenOfStCanard.cost,
        },
        {
          play: [],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(isisVanderchillIceQueenOfStCanard),
      ).toBeSuccessfulCommand();

      // No opposing character to target — bag effect should auto-resolve or have no valid targets
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
