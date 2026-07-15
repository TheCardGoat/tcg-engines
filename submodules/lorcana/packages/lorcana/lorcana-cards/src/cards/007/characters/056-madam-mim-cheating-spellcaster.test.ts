import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { madamMimCheatingSpellcaster } from "./056-madam-mim-cheating-spellcaster";

const opponentCharA = createMockCharacter({
  id: "mim-cs-opponent-a",
  name: "Opponent Char A",
  cost: 3,
  strength: 2,
  willpower: 3,
});

const opponentCharB = createMockCharacter({
  id: "mim-cs-opponent-b",
  name: "Opponent Char B",
  cost: 2,
  strength: 1,
  willpower: 2,
});

describe("Madam Mim - Cheating Spellcaster", () => {
  describe("PLAY ROUGH - Whenever this character quests, exert chosen opposing character.", () => {
    it("exerts chosen opposing character when Madam Mim quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [madamMimCheatingSpellcaster],
          deck: 3,
        },
        {
          play: [opponentCharA, opponentCharB],
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().quest(madamMimCheatingSpellcaster)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(madamMimCheatingSpellcaster, { targets: [opponentCharA] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCard(opponentCharA).exerted).toBe(true);
      expect(testEngine.asPlayerTwo().getCard(opponentCharB).exerted).toBe(false);
    });

    it("triggers each time Madam Mim quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [madamMimCheatingSpellcaster],
          deck: 3,
        },
        {
          play: [opponentCharA, opponentCharB],
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().quest(madamMimCheatingSpellcaster)).toBeSuccessfulCommand();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(madamMimCheatingSpellcaster, { targets: [opponentCharA] }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCard(opponentCharA).exerted).toBe(true);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().quest(madamMimCheatingSpellcaster)).toBeSuccessfulCommand();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(madamMimCheatingSpellcaster, { targets: [opponentCharB] }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCard(opponentCharB).exerted).toBe(true);
    });

    it("does not trigger when Madam Mim is exerted for other reasons", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [madamMimCheatingSpellcaster],
          deck: 3,
        },
        {
          play: [opponentCharA],
          deck: 3,
        },
      );

      testEngine.asPlayerOne().getCard(madamMimCheatingSpellcaster).exerted = true;

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getCard(opponentCharA).exerted).toBe(false);
    });
  });
});
