import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { sisuDaringVisitor } from "./119-sisu-daring-visitor";

const weakOpponent = createMockCharacter({
  id: "sisu-daring-visitor-009-weak-opponent",
  name: "Weak Opponent",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
});

const zeroStrengthOpponent = createMockCharacter({
  id: "sisu-daring-visitor-009-zero-strength-opponent",
  name: "Zero Strength Opponent",
  cost: 1,
  strength: 0,
  willpower: 2,
  lore: 1,
});

const strongOpponent = createMockCharacter({
  id: "sisu-daring-visitor-009-strong-opponent",
  name: "Strong Opponent",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
});

describe("Sisu - Daring Visitor (Set 9)", () => {
  it("has Evasive keyword ability", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [sisuDaringVisitor],
    });

    const cardUnderTest = testEngine.asPlayerOne().getCard(sisuDaringVisitor);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  describe("BRING ON THE HEAT! - When you play this character, banish chosen opposing character with 1 {S} or less.", () => {
    it("banishes a chosen opposing character with 1 strength when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [sisuDaringVisitor],
          inkwell: sisuDaringVisitor.cost,
        },
        {
          play: [weakOpponent],
        },
      );

      expect(testEngine.asPlayerOne().playCard(sisuDaringVisitor)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(sisuDaringVisitor, { targets: [weakOpponent] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(weakOpponent)).toBe("discard");
    });

    it("banishes a chosen opposing character with 0 strength when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [sisuDaringVisitor],
          inkwell: sisuDaringVisitor.cost,
        },
        {
          play: [zeroStrengthOpponent],
        },
      );

      expect(testEngine.asPlayerOne().playCard(sisuDaringVisitor)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(sisuDaringVisitor, { targets: [zeroStrengthOpponent] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(zeroStrengthOpponent)).toBe("discard");
    });

    it("effect fizzles when no opposing characters with 1 strength or less exist", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [sisuDaringVisitor],
          inkwell: sisuDaringVisitor.cost,
          deck: 1,
        },
        {
          play: [strongOpponent],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(sisuDaringVisitor)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      expect(testEngine.asPlayerTwo().getCardZone(strongOpponent)).toBe("play");
    });
  });
});
