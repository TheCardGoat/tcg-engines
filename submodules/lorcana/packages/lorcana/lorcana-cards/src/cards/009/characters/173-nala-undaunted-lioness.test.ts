import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { nalaUndauntedLioness } from "./173-nala-undaunted-lioness";

describe("Nala - Undaunted Lioness", () => {
  describe("DETERMINED DIVERSION - While this character has no damage, she gets +1 {L} and gains Resist +1.", () => {
    it("should have +1 lore when undamaged (base 2 + 1 = 3)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [nalaUndauntedLioness],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardLore(nalaUndauntedLioness)).toBe(3);
    });

    it("should have Resist when undamaged", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [nalaUndauntedLioness],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().hasKeyword(nalaUndauntedLioness, "Resist")).toBe(true);
    });

    it("should have base 2 lore when damaged (condition not met)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: nalaUndauntedLioness, damage: 1 }],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardLore(nalaUndauntedLioness)).toBe(2);
    });

    it("should NOT have Resist when damaged (condition not met)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: nalaUndauntedLioness, damage: 1 }],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().hasKeyword(nalaUndauntedLioness, "Resist")).toBe(false);
    });

    it("has static abilities with no-damage condition", () => {
      const staticAbilities = nalaUndauntedLioness.abilities?.filter((a) => a.type === "static");
      expect(staticAbilities).toHaveLength(2);
      for (const ability of staticAbilities ?? []) {
        expect(ability.condition).toEqual({ type: "no-damage" });
      }
    });
  });
});
