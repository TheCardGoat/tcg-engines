import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { sumerianTalisman } from "./133-sumerian-talisman";

const weakAttacker = createMockCharacter({
  id: "sumerian-talisman-weak-attacker",
  name: "Weak Attacker",
  cost: 2,
  strength: 1,
  willpower: 1,
});

const strongDefender = createMockCharacter({
  id: "sumerian-talisman-strong-defender",
  name: "Strong Defender",
  cost: 3,
  strength: 5,
  willpower: 5,
});

describe("Sumerian Talisman", () => {
  describe("SOURCE OF MAGIC — During your turn, whenever one of your characters is banished in a challenge, you may draw a card.", () => {
    it("triggers when your attacking character is banished in a challenge during your turn", () => {
      // Player 1 challenges with weakAttacker (strength 1, willpower 1)
      // against Player 2's strongDefender (strength 5, willpower 5)
      // Result: weakAttacker takes 5 damage → banished during Player 1's turn
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 2,
          play: [sumerianTalisman, { card: weakAttacker, isDrying: false }],
        },
        {
          play: [{ card: strongDefender, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(weakAttacker, strongDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(weakAttacker)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("draws a card when the optional is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 2,
          play: [sumerianTalisman, { card: weakAttacker, isDrying: false }],
        },
        {
          play: [{ card: strongDefender, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(weakAttacker, strongDefender),
      ).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(sumerianTalisman),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1, deck: 1 });
    });

    it("does not draw a card when the optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 2,
          play: [sumerianTalisman, { card: weakAttacker, isDrying: false }],
        },
        {
          play: [{ card: strongDefender, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(weakAttacker, strongDefender),
      ).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(sumerianTalisman, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, deck: 2 });
    });

    it("does not trigger when your character is banished during opponent's turn", () => {
      // Player 2 challenges Player 1's character during Player 2's turn
      // Talisman should NOT trigger (not during Player 1's turn)
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 2,
          play: [sumerianTalisman, { card: weakAttacker, exerted: true }],
        },
        {
          play: [strongDefender],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerTwo().challenge(strongDefender, weakAttacker),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(weakAttacker)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
