import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { owlPirateLookout } from "./001-owl-pirate-lookout";

const inkableCard = createMockCharacter({
  id: "owl-ink-fodder",
  name: "Ink Fodder",
  cost: 1,
  inkable: true,
});

const opponentCharacter = createMockCharacter({
  id: "owl-opponent-char",
  name: "Opponent Character",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Owl - Pirate Lookout", () => {
  describe("WELL SPOTTED - During your turn, whenever a card is put into your inkwell, chosen opposing character gets -1 {S} until the start of your next turn.", () => {
    it("triggers when a card is put into inkwell and reduces chosen opposing character strength by 1", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [owlPirateLookout],
          hand: [inkableCard],
          deck: 3,
        },
        {
          play: [opponentCharacter],
          deck: 3,
        },
      );

      const initialStrength = testEngine.asPlayerTwo().getCardStrength(opponentCharacter);

      // Ink a card to trigger the ability
      expect(testEngine.asPlayerOne().ink(inkableCard)).toBeSuccessfulCommand();

      // Should have a bag effect from the triggered ability
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Resolve the triggered ability, choosing the opposing character
      const oppCharId = testEngine.findCardInstanceId(opponentCharacter, "play", "player_two");
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(owlPirateLookout, { targets: [oppCharId] }),
      ).toBeSuccessfulCommand();

      // Opposing character should have -1 strength
      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter)).toBe(initialStrength - 1);
    });

    it("the strength debuff expires at the start of your next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [owlPirateLookout],
          hand: [inkableCard],
          deck: 3,
        },
        {
          play: [opponentCharacter],
          deck: 3,
        },
      );

      const initialStrength = testEngine.asPlayerTwo().getCardStrength(opponentCharacter);

      expect(testEngine.asPlayerOne().ink(inkableCard)).toBeSuccessfulCommand();

      const oppCharId = testEngine.findCardInstanceId(opponentCharacter, "play", "player_two");
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(owlPirateLookout, { targets: [oppCharId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter)).toBe(initialStrength - 1);

      // Pass player one turn, then player two's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // At start of player one's next turn, debuff should expire
      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter)).toBe(initialStrength);
    });

    it("does not trigger during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [owlPirateLookout],
          deck: 3,
        },
        {
          hand: [inkableCard],
          play: [opponentCharacter],
          deck: 3,
        },
      );

      const initialStrength = testEngine.asPlayerTwo().getCardStrength(opponentCharacter);

      // Pass turn to player two
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent inks a card - Owl should NOT trigger
      expect(testEngine.asPlayerTwo().ink(inkableCard)).toBeSuccessfulCommand();

      // No bag effect should appear for player one
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Opposing character strength is unchanged
      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter)).toBe(initialStrength);
    });
  });
});
