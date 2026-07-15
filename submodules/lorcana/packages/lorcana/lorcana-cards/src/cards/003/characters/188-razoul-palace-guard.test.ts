import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { razoulPalaceGuard } from "./188-razoul-palace-guard";

describe("Razoul - Palace Guard", () => {
  describe("LOOKY HERE - While this character has no damage, he gets +2 {S}.", () => {
    it("should have +2 strength when undamaged (base 1 + 2 = 3)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [razoulPalaceGuard],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardStrength(razoulPalaceGuard)).toBe(3);
    });

    it("should have base 1 strength when damaged (condition not met)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: razoulPalaceGuard, damage: 1 }],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardStrength(razoulPalaceGuard)).toBe(1);
    });

    it("has a static modify-stat ability with no-damage condition", () => {
      const staticAbility = razoulPalaceGuard.abilities?.find((a) => a.type === "static");
      expect(staticAbility).toBeDefined();
      expect(staticAbility?.condition).toEqual({ type: "no-damage" });
    });
  });
});
