import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { perditaOnTheLookout } from "./014-perdita-on-the-lookout";

const puppyCharacter = (id: string) =>
  createMockCharacter({
    id,
    name: `Puppy ${id}`,
    cost: 1,
    strength: 1,
    willpower: 1,
    classifications: ["Storyborn", "Puppy"],
  });

const puppy1 = puppyCharacter("perdita-test-puppy-1");

const nonPuppyCharacter = createMockCharacter({
  id: "perdita-test-non-puppy",
  name: "Non-Puppy Character",
  cost: 1,
  strength: 1,
  willpower: 1,
  classifications: ["Storyborn", "Hero"],
});

describe("Perdita - On the Lookout", () => {
  describe("KEEPING WATCH - While you have a Puppy character in play, this character gets +1 {W}.", () => {
    it("gets +1 willpower while you have a Puppy character in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [perditaOnTheLookout, puppy1],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getDerivedWillpowerForCard(perditaOnTheLookout)).toBe(
        perditaOnTheLookout.willpower + 1,
      );
    });

    it("stays at base willpower when no Puppy characters are in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [perditaOnTheLookout],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getDerivedWillpowerForCard(perditaOnTheLookout)).toBe(
        perditaOnTheLookout.willpower,
      );
    });

    it("stays at base willpower when only non-Puppy characters are in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [perditaOnTheLookout, nonPuppyCharacter],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getDerivedWillpowerForCard(perditaOnTheLookout)).toBe(
        perditaOnTheLookout.willpower,
      );
    });
  });
});
