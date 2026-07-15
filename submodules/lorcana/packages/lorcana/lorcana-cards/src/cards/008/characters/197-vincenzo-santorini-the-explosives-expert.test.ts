import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { vincenzoSantoriniTheExplosivesExpert } from "./197-vincenzo-santorini-the-explosives-expert";

const target = createMockCharacter({
  id: "vincenzo-target",
  name: "Target Character",
  cost: 2,
  willpower: 5,
});

describe("Vincenzo Santorini - The Explosives Expert", () => {
  describe("I JUST LIKE TO BLOW THINGS UP - When you play this character, you may deal 3 damage to chosen character.", () => {
    it("triggers when played and offers optional damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [vincenzoSantoriniTheExplosivesExpert],
          inkwell: vincenzoSantoriniTheExplosivesExpert.cost,
        },
        {
          play: [target],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(vincenzoSantoriniTheExplosivesExpert),
      ).toBeSuccessfulCommand();

      // Should have a bag effect for the optional triggered ability
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    });

    it("deals 3 damage when accepted and target is chosen", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [vincenzoSantoriniTheExplosivesExpert],
          inkwell: vincenzoSantoriniTheExplosivesExpert.cost,
        },
        {
          play: [target],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(vincenzoSantoriniTheExplosivesExpert),
      ).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(vincenzoSantoriniTheExplosivesExpert, { targets: [target] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(target)).toBe(3);
    });

    it("regression: declining the optional 'you may' deals no damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [vincenzoSantoriniTheExplosivesExpert],
          inkwell: vincenzoSantoriniTheExplosivesExpert.cost,
        },
        {
          play: [target],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(vincenzoSantoriniTheExplosivesExpert),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(vincenzoSantoriniTheExplosivesExpert, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(target)).toBe(0);
    });
  });
});
