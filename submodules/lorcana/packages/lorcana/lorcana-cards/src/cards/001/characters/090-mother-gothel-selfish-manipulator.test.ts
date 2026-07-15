import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { motherGothelSelfishManipulator } from "./090-mother-gothel-selfish-manipulator";

const opposingCharacterA = createMockCharacter({
  id: "mg-opposing-a",
  name: "Opposing Character A",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const opposingCharacterB = createMockCharacter({
  id: "mg-opposing-b",
  name: "Opposing Character B",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 2,
});

describe("Mother Gothel - Selfish Manipulator", () => {
  describe("SKIP THE DRAMA, STAY WITH MAMA - While this character is exerted, opposing characters can't quest.", () => {
    it("opposing characters CANNOT quest when she is exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [opposingCharacterA, opposingCharacterB],
          deck: 2,
        },
        {
          play: [motherGothelSelfishManipulator],
          deck: 2,
        },
      );

      // Exert Mother Gothel
      const gothelInstanceId = testEngine.findCardInstanceId(
        motherGothelSelfishManipulator,
        "play",
        PLAYER_TWO,
      );
      testEngine.manualExertCard(gothelInstanceId);

      // Opposing characters should not be able to quest
      expect(testEngine.asPlayerOne().quest(opposingCharacterA)).not.toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().quest(opposingCharacterB)).not.toBeSuccessfulCommand();

      // Lore should remain 0
      expect(testEngine.asPlayerOne().getLore("player_one")).toBe(0);
    });

    it("opposing characters CAN quest when she is NOT exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [opposingCharacterA],
          deck: 2,
        },
        {
          play: [motherGothelSelfishManipulator],
          deck: 2,
        },
      );

      // Mother Gothel is not exerted - opposing character should be able to quest
      expect(testEngine.asPlayerOne().quest(opposingCharacterA)).toBeSuccessfulCommand();

      // Lore should increase
      expect(testEngine.asPlayerOne().getLore("player_one")).toBe(opposingCharacterA.lore);
    });
  });
});
