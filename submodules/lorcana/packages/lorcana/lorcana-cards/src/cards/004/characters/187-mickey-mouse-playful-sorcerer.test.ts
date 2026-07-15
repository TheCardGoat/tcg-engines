import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mickeyMousePlayfulSorcerer } from "./187-mickey-mouse-playful-sorcerer";

const broomCharacter = createMockCharacter({
  id: "mm-ps-broom",
  name: "Broom",
  cost: 1,
  strength: 1,
  willpower: 1,
  classifications: ["Broom"],
});

const targetCharacter = createMockCharacter({
  id: "mm-ps-target",
  name: "Target Character",
  cost: 3,
  strength: 3,
  willpower: 4,
});

describe("Mickey Mouse - Playful Sorcerer", () => {
  it("has Shift and Resist +1 keywords", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [mickeyMousePlayfulSorcerer],
    });

    expect(testEngine.asPlayerOne().hasKeyword(mickeyMousePlayfulSorcerer, "Shift")).toBe(true);
    expect(testEngine.asPlayerOne().hasKeyword(mickeyMousePlayfulSorcerer, "Resist")).toBe(true);
  });

  describe("SWEEP AWAY - When you play this character, deal damage to chosen character equal to the number of Broom characters you have in play.", () => {
    it("deals 1 damage to chosen character with 1 Broom in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [mickeyMousePlayfulSorcerer],
          play: [broomCharacter, targetCharacter],
          inkwell: mickeyMousePlayfulSorcerer.cost,
          deck: 3,
        },
        {
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(mickeyMousePlayfulSorcerer)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ targets: [targetCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(targetCharacter)).toBe(1);
    });

    it("deals 0 damage with no Broom characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [mickeyMousePlayfulSorcerer],
          play: [targetCharacter],
          inkwell: mickeyMousePlayfulSorcerer.cost,
          deck: 3,
        },
        {
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(mickeyMousePlayfulSorcerer)).toBeSuccessfulCommand();

      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        expect(
          testEngine.asPlayerOne().resolveOnlyBag({ targets: [targetCharacter] }),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerOne().getDamage(targetCharacter)).toBe(0);
    });
  });
});
