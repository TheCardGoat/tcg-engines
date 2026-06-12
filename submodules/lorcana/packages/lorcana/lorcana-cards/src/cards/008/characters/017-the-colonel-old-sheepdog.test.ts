import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { theColonelOldSheepdog } from "./017-the-colonel-old-sheepdog";

const puppyCharacter = (id: string) =>
  createMockCharacter({
    id,
    name: `Puppy ${id}`,
    cost: 1,
    strength: 1,
    willpower: 1,
    classifications: ["Storyborn", "Puppy"],
  });

const puppy1 = puppyCharacter("colonel-test-puppy-1");
const puppy2 = puppyCharacter("colonel-test-puppy-2");
const puppy3 = puppyCharacter("colonel-test-puppy-3");

describe("The Colonel - Old Sheepdog", () => {
  describe("WE'VE GOT 'EM OUTNUMBERED - While you have 3 or more Puppy characters in play, this character gets +2 {S} and +2 {L}.", () => {
    it("gets +2 strength and +2 lore while you have 3 or more Puppy characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [theColonelOldSheepdog, puppy1, puppy2, puppy3],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardStrength(theColonelOldSheepdog)).toBe(
        theColonelOldSheepdog.strength + 2,
      );
      expect(testEngine.asPlayerOne().getCardLore(theColonelOldSheepdog)).toBe(
        theColonelOldSheepdog.lore + 2,
      );
    });

    it("stays at base stats when you have fewer than 3 Puppy characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [theColonelOldSheepdog, puppy1, puppy2],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardStrength(theColonelOldSheepdog)).toBe(
        theColonelOldSheepdog.strength,
      );
      expect(testEngine.asPlayerOne().getCardLore(theColonelOldSheepdog)).toBe(
        theColonelOldSheepdog.lore,
      );
    });

    it("stays at base stats when you have no Puppy characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [theColonelOldSheepdog],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardStrength(theColonelOldSheepdog)).toBe(
        theColonelOldSheepdog.strength,
      );
      expect(testEngine.asPlayerOne().getCardLore(theColonelOldSheepdog)).toBe(
        theColonelOldSheepdog.lore,
      );
    });
  });
});
