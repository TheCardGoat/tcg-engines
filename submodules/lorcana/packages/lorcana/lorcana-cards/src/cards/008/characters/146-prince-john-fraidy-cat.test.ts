import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { princeJohnFraidycat } from "./146-prince-john-fraidy-cat";

const opponentCharacter = createMockCharacter({
  id: "prince-john-fraidy-opponent-char",
  name: "Opponent Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const ownCharacter = createMockCharacter({
  id: "prince-john-fraidy-own-char",
  name: "Own Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Prince John - Fraidy-Cat", () => {
  describe("HELP! — Whenever an opponent plays a character, deal 1 damage to this character.", () => {
    it("deals 1 damage to Prince John when an opponent plays a character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [princeJohnFraidycat],
          deck: 2,
        },
        {
          hand: [opponentCharacter],
          inkwell: opponentCharacter.cost,
          deck: 2,
        },
      );

      // Pass to player 2's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent plays a character
      expect(testEngine.asPlayerTwo().playCard(opponentCharacter)).toBeSuccessfulCommand();

      // HELP! should trigger - resolve it
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThanOrEqual(1);

      testEngine.asPlayerOne().resolvePendingByCard(princeJohnFraidycat);

      // Prince John should have taken 1 damage
      expect(testEngine.asPlayerOne().getDamage(princeJohnFraidycat)).toBe(1);
    });

    it("does NOT deal damage to Prince John when the controller plays a character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [princeJohnFraidycat],
        hand: [ownCharacter],
        inkwell: ownCharacter.cost,
        deck: 2,
      });

      // Player 1 plays their own character
      expect(testEngine.asPlayerOne().playCard(ownCharacter)).toBeSuccessfulCommand();

      // Resolve any bag effects that may exist (none should be HELP!)
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      for (const effect of bagEffects) {
        testEngine.asPlayerOne().resolvePendingByCard(princeJohnFraidycat);
      }

      // Prince John should have taken no damage
      expect(testEngine.asPlayerOne().getDamage(princeJohnFraidycat)).toBe(0);
    });
  });
});
