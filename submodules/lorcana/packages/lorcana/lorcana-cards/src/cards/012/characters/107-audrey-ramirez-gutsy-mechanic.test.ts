import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { audreyRamirezGutsyMechanic } from "./107-audrey-ramirez-gutsy-mechanic";

const opponent = createMockCharacter({
  id: "audrey-test-opponent",
  name: "Opponent Character",
  cost: 2,
  strength: 1,
  willpower: 3,
});

describe("Audrey Ramirez - Gutsy Mechanic", () => {
  describe("Rush", () => {
    it("can challenge the turn it is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [audreyRamirezGutsyMechanic],
          inkwell: audreyRamirezGutsyMechanic.cost,
          deck: 5,
        },
        {
          play: [{ card: opponent, exerted: true }],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(audreyRamirezGutsyMechanic)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().challenge(audreyRamirezGutsyMechanic, opponent),
      ).toBeSuccessfulCommand();
    });
  });
});
