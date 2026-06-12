import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { arthurKingVictorious } from "./194-arthur-king-victorious";

const allyCharacter = createMockCharacter({
  id: "arthur-test-ally",
  name: "Ally Character",
  cost: 2,
  strength: 3,
  willpower: 4,
  lore: 1,
});

const opponentCharacter = createMockCharacter({
  id: "arthur-test-opponent",
  name: "Opponent Character",
  cost: 3,
  strength: 4,
  willpower: 5,
  lore: 1,
});

describe("Arthur - King Victorious", () => {
  describe("KNIGHTED BY THE KING - When you play this character, chosen character gains Challenger +2 and Resist +2 and can challenge ready characters this turn.", () => {
    it("grants Challenger +2, Resist +2, and can challenge ready characters to chosen character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [arthurKingVictorious],
          play: [allyCharacter],
          inkwell: arthurKingVictorious.cost,
        },
        {
          play: [opponentCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(arthurKingVictorious)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(arthurKingVictorious, { targets: [allyCharacter] }),
      ).toBeSuccessfulCommand();

      // Ally should have Challenger keyword
      expect(testEngine.asPlayerOne().hasKeyword(allyCharacter, "Challenger")).toBe(true);
      expect(testEngine.asPlayerOne().getKeywordValue(allyCharacter, "Challenger")).toBe(2);

      // Ally should have Resist keyword
      expect(testEngine.asPlayerOne().hasKeyword(allyCharacter, "Resist")).toBe(true);
      expect(testEngine.asPlayerOne().getKeywordValue(allyCharacter, "Resist")).toBe(2);

      // Ally should be able to challenge ready characters
      expect(testEngine.hasGrantedAbility(allyCharacter, "can-challenge-ready")).toBe(true);
    });

    it("effects expire at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [arthurKingVictorious],
          play: [allyCharacter],
          inkwell: arthurKingVictorious.cost,
        },
        {
          play: [opponentCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(arthurKingVictorious)).toBeSuccessfulCommand();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(arthurKingVictorious, { targets: [allyCharacter] }),
      ).toBeSuccessfulCommand();

      // Pass turn to expire the effects
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // All effects should be gone
      expect(testEngine.asPlayerOne().hasKeyword(allyCharacter, "Challenger")).toBe(false);
      expect(testEngine.asPlayerOne().hasKeyword(allyCharacter, "Resist")).toBe(false);
      expect(testEngine.hasGrantedAbility(allyCharacter, "can-challenge-ready")).toBe(false);
    });
  });
});
