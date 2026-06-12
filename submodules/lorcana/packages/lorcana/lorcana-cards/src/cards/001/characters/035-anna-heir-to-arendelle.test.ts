import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { annaHeirToArendelle } from "./035-anna-heir-to-arendelle";
import { elsaQueenRegent } from "./040-elsa-queen-regent";

const opponentCharacter = createMockCharacter({
  id: "opp-char",
  name: "Opponent Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Anna - Heir to Arendelle", () => {
  describe("LOVING HEART — When you play this character, if you have a character named Elsa in play, choose an opposing character. The chosen character doesn't ready at the start of their next turn.", () => {
    it("does not trigger when no Elsa is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [annaHeirToArendelle],
          inkwell: annaHeirToArendelle.cost,
          deck: 2,
        },
        {
          play: [opponentCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(annaHeirToArendelle)).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Elsa is not in play — no restriction applied to opponent's character
      expect(testEngine.asPlayerTwo()).not.toHaveRestriction({
        card: opponentCharacter,
        restriction: "cant-ready",
      });
    });

    it("applies cant-ready restriction to chosen opposing character when Elsa is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [annaHeirToArendelle],
          inkwell: annaHeirToArendelle.cost,
          play: [elsaQueenRegent],
          deck: 2,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(annaHeirToArendelle)).toBeSuccessfulCommand();

      // Triggered ability should be on the stack
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

      // Resolve the triggered ability targeting the opponent's character
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(annaHeirToArendelle, { targets: [opponentCharacter] }),
      ).toBeSuccessfulCommand();

      // The opponent character should have the cant-ready restriction
      expect(testEngine.asPlayerTwo()).toHaveRestriction({
        card: opponentCharacter,
        restriction: "cant-ready",
      });

      // Pass player one's turn — at start of player two's turn, the character should NOT ready
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.isExerted(opponentCharacter)).toBe(true);
    });
  });
});
