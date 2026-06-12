import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { rhinoOnesixteenthWolf } from "./015-rhino-one-sixteenth-wolf";

const opponentCharacter = createMockCharacter({
  id: "rhino-test-opp",
  name: "Opponent Character",
  cost: 3,
  strength: 4,
  willpower: 4,
  lore: 1,
});

describe("Rhino - One-Sixteenth Wolf", () => {
  describe("TINY HOWL - When you play this character, chosen opposing character gets -1 {S} until the start of your next turn.", () => {
    it("should give -1 strength to chosen opposing character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [rhinoOnesixteenthWolf],
          inkwell: rhinoOnesixteenthWolf.cost,
          deck: 5,
        },
        {
          play: [opponentCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(rhinoOnesixteenthWolf)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      const bagId = bagEffects[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(rhinoOnesixteenthWolf, {
          targets: [opponentCharacter],
        }),
      ).toBeSuccessfulCommand();

      const oppCard = testEngine.asPlayerTwo().getCard(opponentCharacter);
      expect(oppCard.strength).toBe(opponentCharacter.strength - 1);
    });
  });
});
