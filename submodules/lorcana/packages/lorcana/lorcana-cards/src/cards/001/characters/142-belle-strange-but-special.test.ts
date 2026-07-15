import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { belleStrangeButSpecial } from "./142-belle-strange-but-special";

const inkFodder1 = createMockCharacter({
  id: "ink-fodder-1",
  name: "Ink Fodder 1",
  cost: 1,
  inkable: true,
});

const inkFodder2 = createMockCharacter({
  id: "ink-fodder-2",
  name: "Ink Fodder 2",
  cost: 1,
  inkable: true,
});

const inkFodder3 = createMockCharacter({
  id: "ink-fodder-3",
  name: "Ink Fodder 3",
  cost: 1,
  inkable: true,
});

const otherCharacter = createMockCharacter({
  id: "other-char",
  name: "Other Character",
  cost: 1,
  lore: 2,
});

describe("Belle - Strange but Special", () => {
  describe("READ A BOOK - allows inking an additional card per turn", () => {
    it("allows inking two cards in one turn with one Belle in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [inkFodder1, inkFodder2, inkFodder3],
        play: [belleStrangeButSpecial],
        inkwell: 0,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().ink(inkFodder1)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().ink(inkFodder2)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(inkFodder1)).toBe("inkwell");
      expect(testEngine.asPlayerOne().getCardZone(inkFodder2)).toBe("inkwell");
    });

    it("does not allow inking three cards with one Belle (only one additional)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [inkFodder1, inkFodder2, inkFodder3],
        play: [belleStrangeButSpecial],
        inkwell: 0,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().ink(inkFodder1)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().ink(inkFodder2)).toBeSuccessfulCommand();

      const thirdInk = testEngine.asPlayerOne().ink(inkFodder3);
      expect(thirdInk.success).toBe(false);
    });

    it("allows inking three cards with two Belles in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [inkFodder1, inkFodder2, inkFodder3],
        play: [{ card: belleStrangeButSpecial }, { card: belleStrangeButSpecial }],
        inkwell: 0,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().ink(inkFodder1)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().ink(inkFodder2)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().ink(inkFodder3)).toBeSuccessfulCommand();
    });
  });

  describe("MY FAVORITE PART! - While you have 10 or more cards in your inkwell, this character gets +4 lore", () => {
    it("has base lore of 1 with fewer than 10 inkwell cards", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [belleStrangeButSpecial],
        inkwell: 9,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardLore(belleStrangeButSpecial)).toBe(1);
    });

    it("has lore of 5 with 10 or more inkwell cards", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [belleStrangeButSpecial],
        inkwell: 10,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardLore(belleStrangeButSpecial)).toBe(5);
    });

    it("gains 5 lore when questing with 10+ inkwell cards", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [belleStrangeButSpecial],
        inkwell: 10,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(belleStrangeButSpecial)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(5);
    });

    it("only Belle receives the lore bonus, not other characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: belleStrangeButSpecial }, otherCharacter],
        inkwell: 10,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardLore(belleStrangeButSpecial)).toBe(5);
      expect(testEngine.asPlayerOne().getCardLore(otherCharacter)).toBe(2);
    });
  });
});
