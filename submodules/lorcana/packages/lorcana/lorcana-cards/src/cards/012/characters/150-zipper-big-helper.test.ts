import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { zipperBigHelper } from "./150-zipper-big-helper";

const allyCharacter = createMockCharacter({
  id: "zipper-big-helper-ally",
  name: "Friendly Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Zipper - Big Helper", () => {
  describe("BUZZING ENTHUSIASM - Whenever this character quests, you may add his {W} to another chosen character's {S} this turn.", () => {
    it("adds Zipper's willpower to a chosen character's strength when resolved", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: zipperBigHelper, isDrying: false },
          { card: allyCharacter, isDrying: false },
        ],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().quest(zipperBigHelper)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(zipperBigHelper, {
          resolveOptional: true,
          targets: [allyCharacter],
        }),
      ).toBeSuccessfulCommand();

      // 2 (base) + 6 (Zipper's willpower) = 8
      expect(testEngine.asPlayerOne().getCardStrength(allyCharacter)).toBe(
        allyCharacter.strength + zipperBigHelper.willpower,
      );
    });

    it("does nothing when the optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: zipperBigHelper, isDrying: false },
          { card: allyCharacter, isDrying: false },
        ],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().quest(zipperBigHelper)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(zipperBigHelper, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(allyCharacter)).toBe(allyCharacter.strength);
    });

    it("strength bonus expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: zipperBigHelper, isDrying: false },
          { card: allyCharacter, isDrying: false },
        ],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().quest(zipperBigHelper)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(zipperBigHelper, {
          resolveOptional: true,
          targets: [allyCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(allyCharacter)).toBe(
        allyCharacter.strength + zipperBigHelper.willpower,
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardStrength(allyCharacter)).toBe(allyCharacter.strength);
    });
  });
});
