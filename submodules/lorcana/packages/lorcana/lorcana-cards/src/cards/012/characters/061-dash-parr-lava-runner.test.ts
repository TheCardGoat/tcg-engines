import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { dashParrLavaRunner } from "./061-dash-parr-lava-runner";

const opponent = createMockCharacter({
  id: "dash-test-opponent",
  name: "Opponent Character",
  cost: 2,
  strength: 2,
  willpower: 5,
});

describe("Dash Parr - Lava Runner", () => {
  describe("Rush", () => {
    it("can challenge the turn it is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dashParrLavaRunner],
          inkwell: dashParrLavaRunner.cost,
          deck: 5,
        },
        {
          play: [{ card: opponent, exerted: true }],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(dashParrLavaRunner)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().challenge(dashParrLavaRunner, opponent),
      ).toBeSuccessfulCommand();
    });
  });

  describe("RECORD TIME - This character can quest the turn he's played.", () => {
    it("can quest the turn it is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dashParrLavaRunner],
          inkwell: dashParrLavaRunner.cost,
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(dashParrLavaRunner)).toBeSuccessfulCommand();

      // Should be able to quest even though just played (drying)
      expect(testEngine.asPlayerOne().quest(dashParrLavaRunner)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore("player_one")).toBe(dashParrLavaRunner.lore);
    });
  });
});
