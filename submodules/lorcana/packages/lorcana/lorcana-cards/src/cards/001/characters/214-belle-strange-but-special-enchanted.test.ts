import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { belleStrangeButSpecialEnchanted } from "./214-belle-strange-but-special-enchanted";

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

describe("Belle - Strange but Special (Enchanted)", () => {
  describe("READ A BOOK - During your turn, you may put an additional card from your hand into your inkwell facedown.", () => {
    it("allows inking two cards in one turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [inkFodder1, inkFodder2, inkFodder3],
        play: [belleStrangeButSpecialEnchanted],
        inkwell: 0,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().ink(inkFodder1)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().ink(inkFodder2)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(inkFodder1)).toBe("inkwell");
      expect(testEngine.asPlayerOne().getCardZone(inkFodder2)).toBe("inkwell");
    });

    it("does not allow inking three cards in one turn (only one additional)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [inkFodder1, inkFodder2, inkFodder3],
        play: [belleStrangeButSpecialEnchanted],
        inkwell: 0,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().ink(inkFodder1)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().ink(inkFodder2)).toBeSuccessfulCommand();

      const thirdInk = testEngine.asPlayerOne().ink(inkFodder3);
      expect(thirdInk.success).toBe(false);
    });
  });

  describe("MY FAVORITE PART! - While you have 10 or more cards in your inkwell, this character gets +4 lore.", () => {
    it("has base lore of 1 with fewer than 10 inkwell cards", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [belleStrangeButSpecialEnchanted],
        inkwell: 9,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardLore(belleStrangeButSpecialEnchanted)).toBe(1);
    });

    it("has lore of 5 with 10 or more inkwell cards", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [belleStrangeButSpecialEnchanted],
        inkwell: 10,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardLore(belleStrangeButSpecialEnchanted)).toBe(5);
    });

    it("gains 5 lore when questing with 10+ inkwell cards", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [belleStrangeButSpecialEnchanted],
        inkwell: 10,
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().quest(belleStrangeButSpecialEnchanted),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore("player_one")).toBe(5);
    });

    it("only Belle receives the lore bonus, not other characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [belleStrangeButSpecialEnchanted, otherCharacter],
        inkwell: 10,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardLore(belleStrangeButSpecialEnchanted)).toBe(5);
      expect(testEngine.asPlayerOne().getCardLore(otherCharacter)).toBe(2);
    });

    it("gains lore bonus when inkwell reaches 10 cards during the game", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [inkFodder1],
        play: [belleStrangeButSpecialEnchanted],
        inkwell: 9,
        deck: 5,
      });

      // Before inking: 9 inkwell cards, lore should be 1
      expect(testEngine.asPlayerOne().getCardLore(belleStrangeButSpecialEnchanted)).toBe(1);

      // Ink a card to reach 10
      expect(testEngine.asPlayerOne().ink(inkFodder1)).toBeSuccessfulCommand();

      // After inking: 10 inkwell cards, lore should be 5
      expect(testEngine.asPlayerOne().getCardLore(belleStrangeButSpecialEnchanted)).toBe(5);
    });
  });
});
