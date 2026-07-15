import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { hadesInfernalSchemer } from "./151-hades-infernal-schemer";

const opposingCharacter = createMockCharacter({
  id: "hades-infernal-schemer-opposing-character",
  name: "Opposing Character",
  cost: 3,
  strength: 2,
  willpower: 3,
});

describe("Hades - Infernal Schemer", () => {
  describe("IS THERE A DOWNSIDE TO THIS?", () => {
    it("puts the chosen opposing character into its owner's inkwell facedown when you accept the trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [hadesInfernalSchemer],
          inkwell: hadesInfernalSchemer.cost,
          deck: 1,
        },
        {
          play: [opposingCharacter],
          deck: 1,
        },
      );
      const opposingCharacterId = testEngine.findCardInstanceId(opposingCharacter, "play", "p2");

      expect(testEngine.asPlayerOne().playCard(hadesInfernalSchemer)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolveOnlyBag({ resolveOptional: true, targets: [opposingCharacterId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(opposingCharacterId)).toBe("inkwell");
      expect(testEngine.getCardPublicFaceState(opposingCharacterId, "inkwell", PLAYER_TWO)).toBe(
        "faceDown",
      );
      expect(testEngine.asPlayerTwo().isExerted(opposingCharacterId)).toBe(true);
    });

    it("leaves the opposing character in play when you decline the trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [hadesInfernalSchemer],
          inkwell: hadesInfernalSchemer.cost,
          deck: 1,
        },
        {
          play: [opposingCharacter],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(hadesInfernalSchemer)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(opposingCharacter)).toBe("play");
    });
  });
});
