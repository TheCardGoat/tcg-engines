import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { lawrenceJealousManservant } from "./186-lawrence-jealous-manservant";

describe("Lawrence - Jealous Manservant", () => {
  describe("PAYBACK - While this character has no damage, he gets +4 {S}.", () => {
    it("should have +4 strength when undamaged (base 0 + 4 = 4)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [lawrenceJealousManservant],
        deck: 5,
      });

      const card = testEngine.asPlayerOne().getCard(lawrenceJealousManservant);
      expect(card.strength).toBe(4);
    });

    it("should have base 0 strength when damaged (condition not met)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: lawrenceJealousManservant, damage: 1 }],
        deck: 5,
      });

      const card = testEngine.asPlayerOne().getCard(lawrenceJealousManservant);
      expect(card.strength).toBe(0);
    });

    it("has a static modify-stat ability", () => {
      const staticAbility = lawrenceJealousManservant.abilities?.find((a) => a.type === "static");
      expect(staticAbility).toBeDefined();
    });
  });
});
