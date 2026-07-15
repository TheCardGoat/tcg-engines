import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { queenOfHeartsLosingHerTemper } from "./122-queen-of-hearts-losing-her-temper";

describe("Queen of Hearts - Losing Her Temper", () => {
  describe("ROYAL PAIN - While this character has damage, she gets +3 {S}.", () => {
    it("should have base strength when undamaged (condition not met)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [queenOfHeartsLosingHerTemper],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardStrength(queenOfHeartsLosingHerTemper)).toBe(
        queenOfHeartsLosingHerTemper.strength,
      );
    });

    it("should get +3 strength when damaged (base 1 + 3 = 4)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: queenOfHeartsLosingHerTemper, damage: 1 }],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardStrength(queenOfHeartsLosingHerTemper)).toBe(
        queenOfHeartsLosingHerTemper.strength + 3,
      );
    });

    it("has a static modify-stat ability with has-any-damage condition", () => {
      const staticAbility = queenOfHeartsLosingHerTemper.abilities?.find(
        (a) => a.type === "static",
      );
      expect(staticAbility).toBeDefined();
      expect(staticAbility?.condition).toEqual({ type: "has-any-damage" });
    });
  });
});
