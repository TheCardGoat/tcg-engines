import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { yokaiScientificSupervillain } from "../../006/characters/160-yokai-scientific-supervillain";
import { yokaiIntellectualSchemer } from "./097-yokai-intellectual-schemer";

const yokaiShiftBase = createMockCharacter({
  id: "yokai-shift-base-097",
  name: "Yokai",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const theQueenBase = createMockCharacter({
  id: "the-queen-base-097",
  name: "The Queen",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
});

const theQueenShifter = createMockCharacter({
  id: "the-queen-shifter-097",
  name: "The Queen",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  abilities: [
    {
      id: "test-shift-4",
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 4 },
      text: "Shift 4",
    },
  ],
});

describe("Yokai - Intellectual Schemer", () => {
  describe("INNOVATE - You pay 1 {I} less to play characters using their Shift ability.", () => {
    it("reduces shift cost by 1 when Yokai is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [yokaiIntellectualSchemer, yokaiShiftBase],
        hand: [yokaiScientificSupervillain],
        inkwell: 10,
        deck: 5,
      });

      const shiftTarget = testEngine.findCardInstanceId(yokaiShiftBase, "play", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(yokaiScientificSupervillain, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(yokaiScientificSupervillain)).toBe("play");
      expect(testEngine.asServer().getAvailableInk(PLAYER_ONE)).toBe(5);
    });

    it("does not reduce the standard play cost", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [yokaiIntellectualSchemer],
        hand: [yokaiScientificSupervillain],
        inkwell: 10,
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().playCard(yokaiScientificSupervillain),
      ).toBeSuccessfulCommand();
      expect(testEngine.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    });

    it("does not reduce shift cost for opponent", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [yokaiIntellectualSchemer],
          deck: 5,
        },
        {
          play: [theQueenBase],
          hand: [theQueenShifter],
          inkwell: 1,
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      const shiftTarget = testEngine.findCardInstanceId(theQueenBase, "play", PLAYER_TWO);

      expect(
        testEngine.asPlayerTwo().playCard(theQueenShifter, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).not.toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(theQueenShifter)).toBe("hand");
    });
  });
});
