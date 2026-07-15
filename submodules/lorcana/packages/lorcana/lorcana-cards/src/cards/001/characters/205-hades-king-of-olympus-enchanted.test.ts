import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { hadesKingOfOlympusEnchanted } from "./205-hades-king-of-olympus-enchanted";

const otherVillain = createMockCharacter({
  id: "hades-king-of-olympus-enchanted-other-villain",
  name: "Other Villain",
  cost: 2,
  classifications: ["Villain"],
});

const nonVillain = createMockCharacter({
  id: "hades-king-of-olympus-enchanted-non-villain",
  name: "Non Villain",
  cost: 2,
  classifications: ["Hero"],
});

const hadesShiftBase = createMockCharacter({
  id: "hades-king-of-olympus-enchanted-shift-base",
  name: "Hades",
  cost: 2,
});

describe("Hades - King of Olympus (Enchanted)", () => {
  describe("SINISTER PLOT - This character gets +1 lore for each other Villain character you have in play.", () => {
    it("counts only your other Villain characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [hadesKingOfOlympusEnchanted, otherVillain, nonVillain],
      });

      expect(testEngine.asPlayerOne().getCardLore(hadesKingOfOlympusEnchanted)).toBe(2);
    });

    it("does not count opposing Villain characters", () => {
      const opponentVillain = createMockCharacter({
        id: "hades-king-of-olympus-enchanted-opponent-villain",
        name: "Opponent Villain",
        cost: 2,
        classifications: ["Villain"],
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [hadesKingOfOlympusEnchanted],
        },
        {
          play: [opponentVillain],
        },
      );

      expect(testEngine.asPlayerOne().getCardLore(hadesKingOfOlympusEnchanted)).toBe(1);
    });
  });

  describe("Shift 6", () => {
    it("can be played for 6 ink on top of another Hades character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [hadesShiftBase],
        hand: [hadesKingOfOlympusEnchanted],
        inkwell: 6,
        deck: 5,
      });

      const shiftTarget = testEngine.findCardInstanceId(hadesShiftBase, "play", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(hadesKingOfOlympusEnchanted, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).toBeSuccessfulCommand();
    });
  });
});
