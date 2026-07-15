import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { hansThirteenthInLine } from "./180-hans-thirteenth-in-line";

const targetCharacter = createMockCharacter({
  id: "hans-thirteenth-target-character",
  name: "Target Character",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
});

const ownCharacter = createMockCharacter({
  id: "hans-thirteenth-own-character",
  name: "Own Character",
  cost: 2,
  strength: 2,
  willpower: 5,
  lore: 1,
});

const opponentCharacter = createMockCharacter({
  id: "hans-thirteenth-opponent-character",
  name: "Opponent Character",
  cost: 2,
  strength: 2,
  willpower: 5,
  lore: 1,
});

describe("Hans - Thirteenth in Line", () => {
  describe("STAGE A LITTLE ACCIDENT - Whenever this character quests, you may deal 1 damage to chosen character.", () => {
    it("deals 1 damage to a chosen character when questing (optional accepted)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: hansThirteenthInLine, isDrying: false }, targetCharacter],
        deck: 2,
      });

      const targetId = testEngine.findCardInstanceId(targetCharacter, "play");

      expect(testEngine.asPlayerOne().quest(hansThirteenthInLine)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(hansThirteenthInLine, {
          resolveOptional: true,
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      const targetModel = testEngine.asServer().getCard(targetId);
      expect(targetModel.damage).toBe(1);
    });

    it("does not deal damage when optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: hansThirteenthInLine, isDrying: false }, targetCharacter],
        deck: 2,
      });

      const targetId = testEngine.findCardInstanceId(targetCharacter, "play");

      expect(testEngine.asPlayerOne().quest(hansThirteenthInLine)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(hansThirteenthInLine, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      const targetModel = testEngine.asServer().getCard(targetId);
      expect(targetModel.damage).toBe(0);
    });

    it("can deal damage to an opponent's character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: hansThirteenthInLine, isDrying: false }],
          deck: 2,
        },
        {
          play: [opponentCharacter],
          deck: 2,
        },
      );

      const opponentId = testEngine.findCardInstanceId(opponentCharacter, "play", PLAYER_TWO);

      expect(testEngine.asPlayerOne().quest(hansThirteenthInLine)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(hansThirteenthInLine, {
          resolveOptional: true,
          targets: [opponentCharacter],
        }),
      ).toBeSuccessfulCommand();

      const opponentModel = testEngine.asServer().getCard(opponentId);
      expect(opponentModel.damage).toBe(1);
    });

    it("gains lore from questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: hansThirteenthInLine, isDrying: false }, targetCharacter],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
      expect(testEngine.asPlayerOne().quest(hansThirteenthInLine)).toBeSuccessfulCommand();

      // Resolve optional bag
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(hansThirteenthInLine, { resolveOptional: false });

      expect(testEngine.getLore(PLAYER_ONE)).toBe(hansThirteenthInLine.lore);
    });
  });
});
