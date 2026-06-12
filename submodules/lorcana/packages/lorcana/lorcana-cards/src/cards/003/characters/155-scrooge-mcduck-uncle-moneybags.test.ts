import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockItem,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { scroogeMcduckUncleMoneybags } from "./155-scrooge-mcduck-uncle-moneybags";

const testItem = createMockItem({
  id: "scrooge-test-item",
  name: "Test Item",
  cost: 3,
});

const testCharacter = createMockCharacter({
  id: "scrooge-test-character",
  name: "Test Character",
  cost: 3,
});

describe("Scrooge McDuck - Uncle Moneybags", () => {
  describe("TREASURE FINDER - Whenever this character quests, you pay 1 less for the next item you play this turn", () => {
    it("reduces cost by 1 for the next item after questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: testItem.cost - 1,
        play: [{ card: scroogeMcduckUncleMoneybags }],
        hand: [testItem],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().canPlayCard(testItem)).toBe(false);

      expect(testEngine.asPlayerOne().quest(scroogeMcduckUncleMoneybags)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().canPlayCard(testItem)).toBe(true);
      expect(testEngine.asPlayerOne().playCard(testItem)).toBeSuccessfulCommand();
    });

    it("only reduces cost for items, not characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: testCharacter.cost - 1,
        play: [{ card: scroogeMcduckUncleMoneybags }],
        hand: [testCharacter],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().quest(scroogeMcduckUncleMoneybags)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().canPlayCard(testCharacter)).toBe(false);
    });

    it("only reduces cost for the NEXT item, not subsequent ones", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: testItem.cost * 2 - 1,
        play: [{ card: scroogeMcduckUncleMoneybags }],
        hand: [testItem, testItem],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().quest(scroogeMcduckUncleMoneybags)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(testItem)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().canPlayCard(testItem)).toBe(false);
    });
  });
});
