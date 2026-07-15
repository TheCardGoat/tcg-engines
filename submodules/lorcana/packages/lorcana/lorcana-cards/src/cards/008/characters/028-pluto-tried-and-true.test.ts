import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { plutoTriedAndTrue } from "./028-pluto-tried-and-true";

describe("Pluto - Tried and True", () => {
  describe("HAPPY HELPER - While this character has no damage, he gets +2 {S} and gains Support.", () => {
    it("should have +2 strength when undamaged", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [plutoTriedAndTrue],
        deck: 5,
      });

      const pluto = testEngine.getCard(plutoTriedAndTrue);
      expect(pluto.strength).toBe(plutoTriedAndTrue.strength + 2);
    });

    it("should have Support when undamaged", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [plutoTriedAndTrue],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().hasKeyword(plutoTriedAndTrue, "Support")).toBe(true);
    });

    it("should lose +2 strength bonus when damaged", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [plutoTriedAndTrue],
        deck: 5,
      });

      testEngine.asServer().manualSetDamage(plutoTriedAndTrue, 1);

      const pluto = testEngine.getCard(plutoTriedAndTrue);
      expect(pluto.strength).toBe(plutoTriedAndTrue.strength);
    });

    it("should lose Support when damaged", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [plutoTriedAndTrue],
        deck: 5,
      });

      testEngine.asServer().manualSetDamage(plutoTriedAndTrue, 1);

      expect(testEngine.asPlayerOne().hasKeyword(plutoTriedAndTrue, "Support")).toBe(false);
    });

    it("should regain +2 strength and Support when damage is removed", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [plutoTriedAndTrue],
        deck: 5,
      });

      testEngine.asServer().manualSetDamage(plutoTriedAndTrue, 1);

      const plutoDamaged = testEngine.getCard(plutoTriedAndTrue);
      expect(plutoDamaged.strength).toBe(plutoTriedAndTrue.strength);
      expect(testEngine.asPlayerOne().hasKeyword(plutoTriedAndTrue, "Support")).toBe(false);

      testEngine.asServer().manualSetDamage(plutoTriedAndTrue, 0);

      const plutoHealed = testEngine.getCard(plutoTriedAndTrue);
      expect(plutoHealed.strength).toBe(plutoTriedAndTrue.strength + 2);
      expect(testEngine.asPlayerOne().hasKeyword(plutoTriedAndTrue, "Support")).toBe(true);
    });
  });
});
