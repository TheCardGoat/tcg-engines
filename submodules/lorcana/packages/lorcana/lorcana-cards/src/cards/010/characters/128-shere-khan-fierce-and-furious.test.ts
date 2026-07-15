import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { shereKhanFierceAndFurious } from "./128-shere-khan-fierce-and-furious";

describe("Shere Khan - Fierce and Furious", () => {
  describe("WILD RAGE 1 - {I}, Deal 1 damage to this character — Ready this character. He can't quest for the rest of this turn.", () => {
    it("deals 1 damage to self and prevents questing for the rest of the turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: shereKhanFierceAndFurious, isDrying: false }],
        inkwell: 10,
      });

      expect(testEngine.asPlayerOne().getDamage(shereKhanFierceAndFurious)).toBe(0);

      expect(
        testEngine.asPlayerOne().activateAbility(shereKhanFierceAndFurious, {
          ability: "WILD RAGE 1",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(shereKhanFierceAndFurious)).toBe(1);
      expect(testEngine.asPlayerOne().isExerted(shereKhanFierceAndFurious)).toBe(false);
      expect(testEngine.asPlayerOne()).toHaveRestriction({
        card: shereKhanFierceAndFurious,
        restriction: "cant-quest",
      });
    });
  });
});
