import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { transformedChefCastleStove } from "./157-transformed-chef-castle-stove";

const damagedCharacter = createMockCharacter({
  id: "stove-test-damaged-character",
  name: "Damaged Character",
  cost: 2,
  strength: 2,
  willpower: 5,
});

describe("Transformed Chef - Castle Stove", () => {
  describe("A CULINARY MASTERPIECE - When you play this character, remove up to 2 damage from chosen character.", () => {
    it("removes up to 2 damage from a chosen character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [transformedChefCastleStove],
        play: [{ card: damagedCharacter, damage: 3 }],
        inkwell: transformedChefCastleStove.cost,
      });

      expect(testEngine.asPlayerOne().playCard(transformedChefCastleStove)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({
          resolveOptional: true,
          targets: [damagedCharacter],
        }),
      ).toBeSuccessfulCommand();

      // damagedCharacter had 3 damage, remove up to 2 → 1 remaining
      expect(testEngine.asPlayerOne().getDamage(damagedCharacter)).toBe(1);
    });

    it("removes only up to 2 damage even if target has more damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [transformedChefCastleStove],
        play: [{ card: damagedCharacter, damage: 5 }],
        inkwell: transformedChefCastleStove.cost,
      });

      expect(testEngine.asPlayerOne().playCard(transformedChefCastleStove)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({
          resolveOptional: true,
          targets: [damagedCharacter],
        }),
      ).toBeSuccessfulCommand();

      // damagedCharacter had 5 damage, remove up to 2 → 3 remaining
      expect(testEngine.asPlayerOne().getDamage(damagedCharacter)).toBe(3);
    });

    it("can target any character including opponent's", () => {
      const opponentCharacter = createMockCharacter({
        id: "stove-test-opponent-character",
        name: "Opponent Character",
        cost: 3,
        strength: 3,
        willpower: 4,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [transformedChefCastleStove],
          inkwell: transformedChefCastleStove.cost,
        },
        {
          play: [{ card: opponentCharacter, damage: 2 }],
        },
      );

      expect(testEngine.asPlayerOne().playCard(transformedChefCastleStove)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({
          resolveOptional: true,
          targets: [opponentCharacter],
        }),
      ).toBeSuccessfulCommand();

      // Opponent character had 2 damage, remove up to 2 → 0 remaining
      expect(testEngine.asPlayerTwo().getDamage(opponentCharacter)).toBe(0);
    });
  });
});
