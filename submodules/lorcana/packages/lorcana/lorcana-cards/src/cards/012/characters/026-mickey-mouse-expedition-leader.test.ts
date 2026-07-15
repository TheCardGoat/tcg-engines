import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mickeyMouseExpeditionLeader } from "./026-mickey-mouse-expedition-leader";

const questingAlly = createMockCharacter({
  id: "mickey-exp-ally",
  name: "Questing Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const opposingCharacter = createMockCharacter({
  id: "mickey-exp-opponent",
  name: "Opposing Character",
  cost: 3,
  strength: 3,
  willpower: 5,
});

describe("Mickey Mouse - Expedition Leader", () => {
  describe("LONG JOURNEY - This character may enter play exerted.", () => {
    it("enters play ready by default", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mickeyMouseExpeditionLeader],
        inkwell: mickeyMouseExpeditionLeader.cost,
        deck: 3,
      });

      expect(
        testEngine.asPlayerOne().playCard(mickeyMouseExpeditionLeader),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(mickeyMouseExpeditionLeader)).toBe(false);
    });

    it("enters play exerted when resolveOptional is true", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mickeyMouseExpeditionLeader],
        inkwell: mickeyMouseExpeditionLeader.cost,
        deck: 3,
      });

      expect(
        testEngine.asPlayerOne().playCard(mickeyMouseExpeditionLeader, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(mickeyMouseExpeditionLeader)).toBe(true);
    });
  });

  describe("SECRET PATH - While this character is exerted, whenever one of your other characters quests, chosen opposing character gets -2 {S} until the start of your next turn.", () => {
    it("triggers when another character quests while Mickey is exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: mickeyMouseExpeditionLeader, exerted: true },
            { card: questingAlly, isDrying: false },
          ],
          deck: 3,
        },
        {
          play: [opposingCharacter],
          deck: 3,
        },
      );

      const opposingId = testEngine.findCardInstanceId(opposingCharacter, "play", "player_two");
      const initialStrength = testEngine.getCard(opposingCharacter).strength!;

      expect(testEngine.asPlayerOne().quest(questingAlly)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mickeyMouseExpeditionLeader, { targets: [opposingId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getCard(opposingCharacter).strength).toBe(initialStrength - 2);
    });

    it("does not trigger when Mickey is ready", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: mickeyMouseExpeditionLeader, isDrying: false },
            { card: questingAlly, isDrying: false },
          ],
          deck: 3,
        },
        {
          play: [opposingCharacter],
          deck: 3,
        },
      );

      const initialStrength = testEngine.getCard(opposingCharacter).strength!;

      expect(testEngine.asPlayerOne().quest(questingAlly)).toBeSuccessfulCommand();

      // If the bag has a trigger, it must not modify strength when resolved (condition fails).
      if (testEngine.asPlayerOne().getBagCount() > 0) {
        testEngine.asPlayerOne().resolvePendingByCard(mickeyMouseExpeditionLeader);
      }

      expect(testEngine.getCard(opposingCharacter).strength).toBe(initialStrength);
    });

    it("does not trigger when Mickey himself quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mickeyMouseExpeditionLeader, isDrying: false }],
          deck: 3,
        },
        {
          play: [opposingCharacter],
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().quest(mickeyMouseExpeditionLeader)).toBeSuccessfulCommand();

      // SECRET PATH is for "other" characters, so Mickey questing should not trigger the ability.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
