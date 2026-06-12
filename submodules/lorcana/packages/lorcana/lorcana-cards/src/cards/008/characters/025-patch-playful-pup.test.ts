import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { patchPlayfulPup } from "./025-patch-playful-pup";
import { dalmatianPuppyTailWagger } from "./038-dalmatian-puppy-tail-wagger";

describe("Patch - Playful Pup", () => {
  it("Ward (Opponents can't choose this character except to challenge.)", () => {
    const testEngine = new LorcanaTestEngine({
      play: [patchPlayfulPup],
    });

    const cardUnderTest = testEngine.getCardModel(patchPlayfulPup);
    expect(cardUnderTest.hasWard()).toBe(true);
  });

  describe("PUPPY BARKING - While you have another Puppy character in play, this character gets +1 {L}.", () => {
    it("gets +1 lore while you have another Puppy character in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [patchPlayfulPup, dalmatianPuppyTailWagger],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardLore(patchPlayfulPup)).toBe(patchPlayfulPup.lore + 1);
    });

    it("stays at base lore when you have no other Puppy characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [patchPlayfulPup],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardLore(patchPlayfulPup)).toBe(patchPlayfulPup.lore);
    });

    it("does not count itself for the puppy condition", () => {
      // Patch itself is a Puppy, but the condition requires ANOTHER Puppy
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [patchPlayfulPup],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardLore(patchPlayfulPup)).toBe(patchPlayfulPup.lore);
    });
  });
});
