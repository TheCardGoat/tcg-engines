import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { merlinBackFromBermuda } from "./142-merlin-back-from-bermuda";
import { arthurKingVictorious } from "./194-arthur-king-victorious";

const nonArthurCharacter = createMockCharacter({
  id: "merlin-non-arthur",
  name: "Non-Arthur Character",
  cost: 2,
  strength: 2,
  willpower: 4,
});

const opponentAttacker = createMockCharacter({
  id: "merlin-opponent-attacker",
  name: "Opponent Attacker",
  cost: 3,
  strength: 3,
  willpower: 5,
});

describe("Merlin - Back from Bermuda", () => {
  describe("LONG LIVE THE KING! - Your characters named Arthur gain Resist +1.", () => {
    it("gives Resist +1 to Arthur", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [merlinBackFromBermuda, arthurKingVictorious],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().hasKeyword(arthurKingVictorious, "Resist")).toBe(true);
      expect(testEngine.asPlayerOne().getKeywordValue(arthurKingVictorious, "Resist")).toBe(1);
    });

    it("does not give Resist to characters not named Arthur", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [merlinBackFromBermuda, nonArthurCharacter],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().hasKeyword(nonArthurCharacter, "Resist")).toBe(false);
    });

    it("does not give Resist to itself", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [merlinBackFromBermuda],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().hasKeyword(merlinBackFromBermuda, "Resist")).toBe(false);
    });

    it("reduces damage to Arthur by 1", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [merlinBackFromBermuda, { card: arthurKingVictorious, exerted: true }],
          deck: 2,
        },
        {
          play: [opponentAttacker],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().challenge(opponentAttacker, arthurKingVictorious),
      ).toBeSuccessfulCommand();

      const expectedDamage = opponentAttacker.strength - 1;
      expect(testEngine.asPlayerOne().getDamage(arthurKingVictorious)).toBe(expectedDamage);
    });
  });
});
