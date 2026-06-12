import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { vanellopeVonSchweetzCandyMechanic } from "./009-vanellope-von-schweetz-candy-mechanic";

const opposingCharacter = createMockCharacter({
  id: "vanellope-candy-mechanic-target",
  name: "Opposing Character",
  cost: 3,
  strength: 4,
  willpower: 4,
});

describe("Vanellope von Schweetz - Candy Mechanic", () => {
  describe("YOU'VE GOT TO PAY TO PLAY - Whenever this character quests, chosen opposing character gets -1 {S} until the start of your next turn.", () => {
    it("triggers when Vanellope quests and prompts for a target", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [vanellopeVonSchweetzCandyMechanic],
        },
        {
          play: [opposingCharacter],
        },
      );

      expect(
        testEngine.asPlayerOne().quest(vanellopeVonSchweetzCandyMechanic),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    });

    it("reduces chosen opposing character's strength by 1 until the start of your next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [vanellopeVonSchweetzCandyMechanic],
        },
        {
          play: [opposingCharacter],
        },
      );

      const strengthBefore = testEngine.asPlayerTwo().getCardStrength(opposingCharacter);

      expect(
        testEngine.asPlayerOne().quest(vanellopeVonSchweetzCandyMechanic),
      ).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(vanellopeVonSchweetzCandyMechanic, {
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(strengthBefore - 1);

      // Effect persists during opponent's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(strengthBefore - 1);

      // Effect expires at start of player one's next turn
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(strengthBefore);
    });
  });
});
