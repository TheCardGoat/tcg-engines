import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { panicImmortalSidekick } from "./082-panic-immortal-sidekick";

const mockAttacker = createMockCharacter({
  id: "panic-test-attacker",
  name: "Mock Attacker",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
});

const villainCharacter = createMockCharacter({
  id: "panic-test-villain",
  name: "Villain Target",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Villain"],
});

const nonVillainCharacter = createMockCharacter({
  id: "panic-test-non-villain",
  name: "Non Villain",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

const painCharacter = createMockCharacter({
  id: "panic-test-pain",
  name: "Pain",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
});

describe("Panic - Immortal Sidekick", () => {
  describe("REPORTING FOR DUTY: While this character is exerted, if you have a character named Pain in play, your Villain characters can't be challenged.", () => {
    it("Villain characters can't be challenged when Panic is exerted and Pain is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mockAttacker, isDrying: false }],
          deck: 1,
        },
        {
          play: [
            { card: panicImmortalSidekick, exerted: true },
            { card: painCharacter, exerted: true },
            { card: villainCharacter, exerted: true },
          ],
          deck: 1,
        },
      );

      const result = testEngine.asPlayerOne().challenge(mockAttacker, villainCharacter);

      expect(result).not.toBeSuccessfulCommand();
    });

    it("non-Villain characters can still be challenged when Panic is exerted and Pain is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mockAttacker, isDrying: false }],
          deck: 1,
        },
        {
          play: [
            { card: panicImmortalSidekick, exerted: true },
            { card: painCharacter, exerted: true },
            { card: nonVillainCharacter, exerted: true },
          ],
          deck: 1,
        },
      );

      const result = testEngine.asPlayerOne().challenge(mockAttacker, nonVillainCharacter);

      expect(result).toBeSuccessfulCommand();
    });

    it("Villain characters can be challenged when Panic is not exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mockAttacker, isDrying: false }],
          deck: 1,
        },
        {
          play: [
            { card: panicImmortalSidekick, exerted: false },
            { card: painCharacter, exerted: true },
            { card: villainCharacter, exerted: true },
          ],
          deck: 1,
        },
      );

      const result = testEngine.asPlayerOne().challenge(mockAttacker, villainCharacter);

      expect(result).toBeSuccessfulCommand();
    });

    it("Villain characters can be challenged when Pain is not in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mockAttacker, isDrying: false }],
          deck: 1,
        },
        {
          play: [
            { card: panicImmortalSidekick, exerted: true },
            { card: villainCharacter, exerted: true },
          ],
          deck: 1,
        },
      );

      const result = testEngine.asPlayerOne().challenge(mockAttacker, villainCharacter);

      expect(result).toBeSuccessfulCommand();
    });
  });
});
