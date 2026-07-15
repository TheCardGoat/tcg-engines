import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { morphSpaceGoo } from "./081-morph-space-goo";
import { cogsworthGrandfatherClock } from "../../002/characters/142-cogsworth-grandfather-clock";

describe("Morph - Space Goo", () => {
  describe("MIMICRY - You may play any character with Shift on this character as if this character had any name.", () => {
    it("allows a character with Shift to be shifted onto Morph even though Morph's name doesn't match", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [cogsworthGrandfatherClock],
        play: [{ card: morphSpaceGoo, isDrying: false }],
        inkwell: 3,
        deck: 1,
      });

      const shiftTarget = testEngine.findCardInstanceId(morphSpaceGoo, "play");

      const result = testEngine.asPlayerOne().playCard(cogsworthGrandfatherClock, {
        cost: { cost: "shift", shiftTarget },
      });

      expect(result).toBeSuccessfulCommand();

      // Cogsworth should be in play after shifting onto Morph
      const cogsworthCard = testEngine.getCard(cogsworthGrandfatherClock);
      expect(cogsworthCard.zone).toBe("play");
    });

    it("does not allow shifting onto a character without mimicry when names don't match", () => {
      const nonMimicryCharacter = createMockCharacter({
        id: "non-mimicry-char",
        name: "Random Character",
        cost: 2,
        strength: 2,
        willpower: 2,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [cogsworthGrandfatherClock],
        play: [{ card: nonMimicryCharacter, isDrying: false }],
        inkwell: 3,
        deck: 1,
      });

      const shiftTarget = testEngine.findCardInstanceId(nonMimicryCharacter, "play");

      const result = testEngine.asPlayerOne().playCard(cogsworthGrandfatherClock, {
        cost: { cost: "shift", shiftTarget },
      });

      // Should fail - Random Character is not named "Cogsworth"
      expect(result).not.toBeSuccessfulCommand();
    });
  });
});
