import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { sisuEmboldenedWarrior } from "./118-sisu-emboldened-warrior";

const opponentCard = createMockCharacter({
  id: "sisu-emboldened-warrior-009-opponent-card",
  name: "Opponent Card",
  cost: 1,
});

describe("Sisu - Emboldened Warrior (Set 9)", () => {
  describe("SURGE OF POWER - This character gets +1 {S} for each card in opponents' hands.", () => {
    it("gets +1 strength for each card in the opponent's hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [sisuEmboldenedWarrior],
          deck: 5,
        },
        {
          hand: [opponentCard, opponentCard, opponentCard],
          deck: 5,
        },
      );

      const cardId = testEngine.findCardInstanceId(sisuEmboldenedWarrior, "play", "player_one");

      expect(testEngine.getBoard().cards[cardId]?.strength).toBe(
        sisuEmboldenedWarrior.strength + 3,
      );
    });

    it("has base strength when the opponent has no cards in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [sisuEmboldenedWarrior],
          deck: 5,
        },
        {
          hand: [],
          deck: 5,
        },
      );

      const cardId = testEngine.findCardInstanceId(sisuEmboldenedWarrior, "play", "player_one");

      expect(testEngine.getBoard().cards[cardId]?.strength).toBe(sisuEmboldenedWarrior.strength);
    });

    it("gets +1 strength for a single card in the opponent's hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [sisuEmboldenedWarrior],
          deck: 5,
        },
        {
          hand: [opponentCard],
          deck: 5,
        },
      );

      const cardId = testEngine.findCardInstanceId(sisuEmboldenedWarrior, "play", "player_one");

      expect(testEngine.getBoard().cards[cardId]?.strength).toBe(
        sisuEmboldenedWarrior.strength + 1,
      );
    });
  });
});
