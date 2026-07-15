import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { floraStrongwilledFairy } from "./141-flora-strong-willed-fairy";

const otherAlly = createMockCharacter({
  id: "flora-other-ally",
  name: "Other Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const anotherAlly = createMockCharacter({
  id: "flora-another-ally",
  name: "Another Ally",
  cost: 1,
  strength: 1,
  willpower: 2,
});

const opposingCharacter = createMockCharacter({
  id: "flora-opponent",
  name: "Opposing Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Flora - Strong-Willed Fairy", () => {
  describe("LUMINOUS SHELTER - When you play this character, your other characters gain Resist +1 until the start of your next turn.", () => {
    it("grants Resist +1 to your other characters when Flora is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [floraStrongwilledFairy],
          play: [
            { card: otherAlly, isDrying: false },
            { card: anotherAlly, isDrying: false },
          ],
          inkwell: floraStrongwilledFairy.cost,
          deck: 3,
        },
        {
          play: [{ card: opposingCharacter, isDrying: false }],
          deck: 3,
        },
      );

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.getKeywordValue(otherAlly, "Resist")).toBeNull();
      expect(playerOne.getKeywordValue(anotherAlly, "Resist")).toBeNull();

      expect(playerOne.playCard(floraStrongwilledFairy)).toBeSuccessfulCommand();

      expect(playerOne.getKeywordValue(otherAlly, "Resist")).toBe(1);
      expect(playerOne.getKeywordValue(anotherAlly, "Resist")).toBe(1);
      // Flora herself is excluded ("your other characters").
      expect(playerOne.getKeywordValue(floraStrongwilledFairy, "Resist")).toBeNull();
      // Opposing characters are not affected.
      expect(playerOne.getKeywordValue(opposingCharacter, "Resist")).toBeNull();
    });

    it("removes the Resist +1 at the start of your next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [floraStrongwilledFairy],
          play: [{ card: otherAlly, isDrying: false }],
          inkwell: floraStrongwilledFairy.cost,
          deck: 3,
        },
        {
          deck: 3,
        },
      );

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.playCard(floraStrongwilledFairy)).toBeSuccessfulCommand();
      expect(playerOne.getKeywordValue(otherAlly, "Resist")).toBe(1);

      // The effect lasts until the start of your next turn.
      expect(playerOne.passTurn()).toBeSuccessfulCommand();
      expect(playerOne.getKeywordValue(otherAlly, "Resist")).toBe(1);

      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(playerOne.getKeywordValue(otherAlly, "Resist")).toBeNull();
    });
  });
});
