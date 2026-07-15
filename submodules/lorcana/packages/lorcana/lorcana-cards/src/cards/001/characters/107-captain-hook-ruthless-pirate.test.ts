import { describe, expect, it } from "bun:test";
import {
  LorcanaTestEngine,
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { captainHookRuthlessPirate } from "./107-captain-hook-ruthless-pirate";
import { goofyDaredevil } from "./111-goofy-daredevil";
import { minnieMouseAlwaysClassy } from "./116-minnie-mouse-always-classy";

describe("Captain Hook - Ruthless Pirate", () => {
  it("has Rush", () => {
    const testEngine = new LorcanaTestEngine({ play: [captainHookRuthlessPirate] });
    expect(testEngine.getCardModel(captainHookRuthlessPirate).hasRush).toBe(true);
  });

  describe("YOU COWARD! — While this character is exerted, opposing characters with Evasive gain Reckless.", () => {
    it("opposing character with Evasive gains Reckless when Captain Hook is exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [captainHookRuthlessPirate],
        },
        {
          play: [goofyDaredevil, minnieMouseAlwaysClassy],
        },
      );

      // Before exerting: Goofy has Evasive but not Reckless
      expect(testEngine.hasKeyword(goofyDaredevil, "Evasive")).toBe(true);
      expect(testEngine.hasKeyword(goofyDaredevil, "Reckless")).toBe(false);

      // Minnie has neither Evasive nor Reckless
      expect(testEngine.hasKeyword(minnieMouseAlwaysClassy, "Evasive")).toBe(false);
      expect(testEngine.hasKeyword(minnieMouseAlwaysClassy, "Reckless")).toBe(false);

      // Exert Captain Hook
      const hookId = testEngine.findCardInstanceId(captainHookRuthlessPirate, "play");
      testEngine.manualExertCard(hookId);

      // After exerting: Goofy should now have Reckless (still has Evasive)
      expect(testEngine.hasKeyword(goofyDaredevil, "Evasive")).toBe(true);
      expect(testEngine.hasKeyword(goofyDaredevil, "Reckless")).toBe(true);

      // Minnie still has neither (no Evasive, so doesn't gain Reckless)
      expect(testEngine.hasKeyword(minnieMouseAlwaysClassy, "Evasive")).toBe(false);
      expect(testEngine.hasKeyword(minnieMouseAlwaysClassy, "Reckless")).toBe(false);
    });
  });
});
