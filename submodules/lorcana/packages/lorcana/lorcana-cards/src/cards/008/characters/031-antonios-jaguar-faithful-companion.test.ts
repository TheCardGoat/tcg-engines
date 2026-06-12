import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { antoniosJaguarFaithfulCompanion } from "./031-antonios-jaguar-faithful-companion";
import { antonioMadrigalFriendToAll } from "./005-antonio-madrigal-friend-to-all";

describe("Antonio's Jaguar - Faithful Companion", () => {
  describe("YOU WANT TO GO WHERE? — When you play this character, if you have a character named Antonio Madrigal in play, gain 1 lore.", () => {
    it("gains 1 lore when Antonio Madrigal is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [antoniosJaguarFaithfulCompanion],
          play: [antonioMadrigalFriendToAll],
          inkwell: antoniosJaguarFaithfulCompanion.cost,
          deck: 3,
        },
        {
          deck: 3,
        },
      );

      const loreBefore = testEngine.getLore(PLAYER_ONE);
      expect(
        testEngine.asPlayerOne().playCard(antoniosJaguarFaithfulCompanion),
      ).toBeSuccessfulCommand();

      // Resolve any pending triggered effects
      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        const effects = testEngine.asPlayerOne().getBagEffects();
        if (effects.length > 0) {
          testEngine.asPlayerOne().resolvePendingByCard(antoniosJaguarFaithfulCompanion);
        }
      }

      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 1);
    });

    it("does not gain lore when no Antonio Madrigal is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [antoniosJaguarFaithfulCompanion],
          inkwell: antoniosJaguarFaithfulCompanion.cost,
          deck: 3,
        },
        {
          deck: 3,
        },
      );

      const loreBefore = testEngine.getLore(PLAYER_ONE);
      expect(
        testEngine.asPlayerOne().playCard(antoniosJaguarFaithfulCompanion),
      ).toBeSuccessfulCommand();
      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore);
    });
  });
});
