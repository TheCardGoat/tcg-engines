import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { ratiganRagingRat } from "./113-ratigan-raging-rat";

describe("Ratigan - Raging Rat", () => {
  describe("NOTHING CAN STAND IN MY WAY - While this character has damage, he gets +2 {S}.", () => {
    it("should have base 1 strength when undamaged (condition not met)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [ratiganRagingRat],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardStrength(ratiganRagingRat)).toBe(1);
    });

    it("should have +2 strength when damaged (base 1 + 2 = 3)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: ratiganRagingRat, damage: 1 }],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardStrength(ratiganRagingRat)).toBe(3);
    });

    it("has a static modify-stat ability with self-has-damage condition", () => {
      const staticAbility = ratiganRagingRat.abilities?.find((a) => a.type === "static");
      expect(staticAbility).toBeDefined();
      expect(staticAbility?.condition).toEqual({ type: "self-has-damage" });
    });
  });
});
