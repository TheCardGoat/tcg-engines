import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { princePhillipWardenOfTheWoods } from "./072-prince-phillip-warden-of-the-woods";

const heroCharacter = createMockCharacter({
  id: "pp-wotw-s9-hero-char",
  name: "Hero Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

const anotherHeroCharacter = createMockCharacter({
  id: "pp-wotw-s9-another-hero",
  name: "Another Hero",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 2,
  classifications: ["Dreamborn", "Hero", "Princess"],
});

const nonHeroCharacter = createMockCharacter({
  id: "pp-wotw-s9-non-hero",
  name: "Non Hero",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Villain"],
});

describe("Prince Phillip - Warden of the Woods (set 9)", () => {
  describe("SHINING BEACON Your other Hero characters gain Ward.", () => {
    it("grants Ward to other Hero characters while in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [princePhillipWardenOfTheWoods, heroCharacter, anotherHeroCharacter],
        deck: 3,
      });

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: heroCharacter,
        keyword: "Ward",
      });

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: anotherHeroCharacter,
        keyword: "Ward",
      });
    });

    it("does NOT grant Ward to non-Hero characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [princePhillipWardenOfTheWoods, nonHeroCharacter],
        deck: 3,
      });

      expect(testEngine.hasKeyword(nonHeroCharacter, "Ward")).toBe(false);
    });

    it("Prince Phillip himself does NOT gain Ward (other heroes only)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [princePhillipWardenOfTheWoods],
        deck: 3,
      });

      expect(testEngine.hasKeyword(princePhillipWardenOfTheWoods, "Ward")).toBe(false);
    });
  });
});
