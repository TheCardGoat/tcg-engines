import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { liShangNewlyPromoted } from "./133-li-shang-newly-promoted";

describe("Li Shang - Newly Promoted", () => {
  describe("BIG RESPONSIBILITY — While this character is damaged, he gets +2 {S}.", () => {
    it("has base 2 strength when undamaged (condition not met)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [liShangNewlyPromoted],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardStrength(liShangNewlyPromoted)).toBe(2);
    });

    it("has +2 strength when damaged (base 2 + 2 = 4)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: liShangNewlyPromoted, damage: 1 }],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardStrength(liShangNewlyPromoted)).toBe(4);
    });

    it("has a static modify-stat ability with self-has-damage condition", () => {
      const ability = liShangNewlyPromoted.abilities?.find(
        (a) => a.type === "static" && a.name === "BIG RESPONSIBILITY",
      );
      expect(ability?.type).toBe("static");
      if (ability?.type !== "static") {
        throw new Error("expected BIG RESPONSIBILITY static ability");
      }
      expect(ability.condition).toEqual({ type: "self-has-damage" });
    });
  });
});
