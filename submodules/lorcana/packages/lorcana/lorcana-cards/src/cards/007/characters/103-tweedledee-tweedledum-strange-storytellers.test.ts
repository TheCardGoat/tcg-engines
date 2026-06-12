import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { tweedledeeTweedledumStrangeStorytellers } from "./103-tweedledee-tweedledum-strange-storytellers";

const damagedTarget = createMockCharacter({
  id: "tweedledee-test-damaged-target",
  name: "Damaged Target",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
});

describe("Tweedledee & Tweedledum - Strange Storytellers", () => {
  describe("ANOTHER RECITATION - Whenever this character quests, you may return chosen damaged character to their player's hand.", () => {
    it("returns a damaged character to hand when the controller accepts the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: tweedledeeTweedledumStrangeStorytellers, isDrying: false }, damagedTarget],
        deck: 1,
      });

      expect(testEngine.asServer().manualSetDamage(damagedTarget, 2)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().quest(tweedledeeTweedledumStrangeStorytellers),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(tweedledeeTweedledumStrangeStorytellers, {
          resolveOptional: true,
          targets: [damagedTarget],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(damagedTarget)).toBe("hand");
    });

    it("does not return the character to hand when the controller declines the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: tweedledeeTweedledumStrangeStorytellers, isDrying: false }, damagedTarget],
        deck: 1,
      });

      expect(testEngine.asServer().manualSetDamage(damagedTarget, 2)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().quest(tweedledeeTweedledumStrangeStorytellers),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(tweedledeeTweedledumStrangeStorytellers, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(damagedTarget)).toBe("play");
    });

    it("can return an opponent's damaged character to their hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: tweedledeeTweedledumStrangeStorytellers, isDrying: false }],
          deck: 1,
        },
        {
          play: [damagedTarget],
          deck: 1,
        },
      );

      expect(testEngine.asServer().manualSetDamage(damagedTarget, 2)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().quest(tweedledeeTweedledumStrangeStorytellers),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(tweedledeeTweedledumStrangeStorytellers, {
          resolveOptional: true,
          targets: [damagedTarget],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(damagedTarget)).toBe("hand");
    });
  });
});
