import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { dashParrSuperSpeedy } from "./118-dash-parr-super-speedy";

const opponent = createMockCharacter({
  id: "dash-super-speedy-opponent",
  name: "Opponent Character",
  cost: 2,
  strength: 2,
  willpower: 5,
});

describe("Dash Parr - Super Speedy", () => {
  describe("Rush", () => {
    it("can challenge the turn it is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dashParrSuperSpeedy],
          inkwell: dashParrSuperSpeedy.cost,
          deck: 5,
        },
        {
          play: [{ card: opponent, exerted: true }],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(dashParrSuperSpeedy)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().challenge(dashParrSuperSpeedy, opponent),
      ).toBeSuccessfulCommand();
    });
  });
});
