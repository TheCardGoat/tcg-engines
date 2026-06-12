import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { scroopBackstabber } from "./122-scroop-backstabber";

describe("Scroop - Backstabber", () => {
  describe("BRUTE - While this character has damage, he gets +3 {S}.", () => {
    it("should have base 2 strength when undamaged (condition not met)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [scroopBackstabber],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardStrength(scroopBackstabber)).toBe(2);
    });

    it("should have +3 strength when damaged (base 2 + 3 = 5)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: scroopBackstabber, damage: 1 }],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardStrength(scroopBackstabber)).toBe(5);
    });

    it("has a static modify-stat ability with self-has-damage condition", () => {
      const staticAbility = scroopBackstabber.abilities?.find((a) => a.type === "static");
      expect(staticAbility).toBeDefined();
      expect(staticAbility?.condition).toEqual({ type: "self-has-damage" });
    });
  });
});
