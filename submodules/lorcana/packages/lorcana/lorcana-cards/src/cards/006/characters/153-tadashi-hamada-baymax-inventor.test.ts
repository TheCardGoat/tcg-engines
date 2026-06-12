import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { tadashiHamadaBaymaxInventor } from "./153-tadashi-hamada-baymax-inventor";

const itemA = createMockItem({
  id: "tadashi-test-item-a",
  name: "Item A",
  cost: 1,
});

const itemB = createMockItem({
  id: "tadashi-test-item-b",
  name: "Item B",
  cost: 2,
});

describe("Tadashi Hamada - Baymax Inventor", () => {
  describe("LET'S GET BACK TO WORK - This character gets +1 {S} and +1 {W} for each item you have in play.", () => {
    it("has base strength 3 and willpower 3 when no items are in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: tadashiHamadaBaymaxInventor, isDrying: false }],
        deck: 5,
      });

      const card = testEngine.asPlayerOne().getCard(tadashiHamadaBaymaxInventor);
      expect(card.strength).toBe(3);
      expect(card.willpower).toBe(3);
    });

    it("gets +1 strength and +1 willpower for each item in play (1 item = 4/4)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: tadashiHamadaBaymaxInventor, isDrying: false }, itemA],
        deck: 5,
      });

      const card = testEngine.asPlayerOne().getCard(tadashiHamadaBaymaxInventor);
      expect(card.strength).toBe(4);
      expect(card.willpower).toBe(4);
    });

    it("gets +2 strength and +2 willpower for 2 items in play (2 items = 5/5)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: tadashiHamadaBaymaxInventor, isDrying: false }, itemA, itemB],
        deck: 5,
      });

      const card = testEngine.asPlayerOne().getCard(tadashiHamadaBaymaxInventor);
      expect(card.strength).toBe(5);
      expect(card.willpower).toBe(5);
    });

    it("opponent's items do not buff Tadashi", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: tadashiHamadaBaymaxInventor, isDrying: false }],
          deck: 5,
        },
        {
          play: [itemA, itemB],
          deck: 5,
        },
      );

      const card = testEngine.asPlayerOne().getCard(tadashiHamadaBaymaxInventor);
      expect(card.strength).toBe(3);
      expect(card.willpower).toBe(3);
    });
  });
});
