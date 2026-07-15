import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mirabelMadrigalFamilyGatherer } from "./014-mirabel-madrigal-family-gatherer";

const ally1 = createMockCharacter({
  id: "mirabel-ally-1",
  name: "Ally One",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});
const ally2 = createMockCharacter({
  id: "mirabel-ally-2",
  name: "Ally Two",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});
const ally3 = createMockCharacter({
  id: "mirabel-ally-3",
  name: "Ally Three",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});
const ally4 = createMockCharacter({
  id: "mirabel-ally-4",
  name: "Ally Four",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});
const ally5 = createMockCharacter({
  id: "mirabel-ally-5",
  name: "Ally Five",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Mirabel Madrigal - Family Gatherer", () => {
  describe("NOT WITHOUT MY FAMILY - You can't play this character unless you have 5 or more characters in play.", () => {
    it("Can't be played with fewer than 5 characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mirabelMadrigalFamilyGatherer],
        inkwell: mirabelMadrigalFamilyGatherer.cost,
        play: [],
      });

      const result = testEngine.asPlayerOne().playCard(mirabelMadrigalFamilyGatherer);
      expect(result.success).toBe(false);
      expect(testEngine.asPlayerOne().getCardZone(mirabelMadrigalFamilyGatherer)).toBe("hand");
    });

    it("Can't be played with exactly 4 characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mirabelMadrigalFamilyGatherer],
        inkwell: mirabelMadrigalFamilyGatherer.cost,
        play: [ally1, ally2, ally3, ally4],
      });

      const result = testEngine.asPlayerOne().playCard(mirabelMadrigalFamilyGatherer);
      expect(result.success).toBe(false);
      expect(testEngine.asPlayerOne().getCardZone(mirabelMadrigalFamilyGatherer)).toBe("hand");
    });

    it("Can be played with exactly 5 characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mirabelMadrigalFamilyGatherer],
        inkwell: mirabelMadrigalFamilyGatherer.cost,
        play: [ally1, ally2, ally3, ally4, ally5],
      });

      const result = testEngine.asPlayerOne().playCard(mirabelMadrigalFamilyGatherer);
      expect(result.success).toBe(true);
      expect(testEngine.asPlayerOne().getCardZone(mirabelMadrigalFamilyGatherer)).toBe("play");
    });
  });
});
