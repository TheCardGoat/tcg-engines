import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { plutoGuardDog } from "./186-pluto-guard-dog";

describe("Pluto - Guard Dog", () => {
  describe("BRAVO - While this character has no damage, he gets +4 {S}.", () => {
    it("has the condition type 'no-damage' on the BRAVO static ability", () => {
      const bravoAbility = plutoGuardDog.abilities?.find(
        (a) => a.type === "static" && "name" in a && a.name === "BRAVO",
      ) as { condition?: unknown } | undefined;
      expect(bravoAbility).toBeDefined();
      expect(bravoAbility?.condition).toEqual({ type: "no-damage" });
    });

    it("should have strength 5 (base 1 + BRAVO +4) when undamaged", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [plutoGuardDog],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardStrength(plutoGuardDog)).toBe(5);
    });

    it("should have base strength 1 when damaged (BRAVO condition not met)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: plutoGuardDog, damage: 1 }],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardStrength(plutoGuardDog)).toBe(1);
    });
  });
});
