import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { flynnRiderBreakingAndEntering } from "./102-flynn-rider-breaking-and-entering";

const challenger = createMockCharacter({
  id: "flynn-breaking-challenger",
  name: "Challenger",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
});

const discardCard = createMockCharacter({
  id: "flynn-breaking-discard-card",
  name: "Discard Card",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Flynn Rider - Breaking and Entering", () => {
  describe("THIS IS A VERY BIG DAY - Whenever this character is challenged, the challenging player may choose and discard a card. If they don't, you gain 2 lore.", () => {
    it("lets the challenging player discard a card instead of giving Flynn's controller lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: challenger, isDrying: false }],
          hand: [discardCard],
          deck: 1,
        },
        {
          play: [{ card: flynnRiderBreakingAndEntering, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(challenger, flynnRiderBreakingAndEntering),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerTwo().getBagEffects();
      expect(bagEffects).toHaveLength(1);
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(flynnRiderBreakingAndEntering),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().respondWithChoice(0)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().respondWith(discardCard)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(discardCard)).toBe("discard");
      expect(testEngine.asPlayerTwo().getLore(PLAYER_TWO)).toBe(0);
    });

    it("gains 2 lore when the challenging player chooses not to discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: challenger, isDrying: false }],
          hand: [discardCard],
          deck: 1,
        },
        {
          play: [{ card: flynnRiderBreakingAndEntering, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(challenger, flynnRiderBreakingAndEntering),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerTwo().getBagEffects();
      expect(bagEffects).toHaveLength(1);
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(flynnRiderBreakingAndEntering),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().respondWithChoice(1)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(discardCard)).toBe("hand");
      expect(testEngine.asPlayerTwo().getLore(PLAYER_TWO)).toBe(2);
    });

    it("gains 2 lore when the challenging player has no cards in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: challenger, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: flynnRiderBreakingAndEntering, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(challenger, flynnRiderBreakingAndEntering),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerTwo().getBagEffects();
      expect(bagEffects).toHaveLength(1);
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(flynnRiderBreakingAndEntering),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().respondWithChoice(1)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getLore(PLAYER_TWO)).toBe(2);
    });
  });
});
