import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { jetsamUrsulasSpy } from "./046-jetsam-ursulas-spy";

const flotsamCharacter = createMockCharacter({
  id: "jetsam-test-flotsam",
  name: "Flotsam",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const otherCharacter = createMockCharacter({
  id: "jetsam-test-other",
  name: "Other Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Jetsam - Ursula's Spy", () => {
  it("has Evasive keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [jetsamUrsulasSpy],
    });

    expect(testEngine.hasKeyword(jetsamUrsulasSpy, "Evasive")).toBe(true);
  });

  describe("SINISTER SLITHER — Your characters named Flotsam gain Evasive.", () => {
    it("grants Evasive to your characters named Flotsam", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [jetsamUrsulasSpy, flotsamCharacter],
      });

      expect(testEngine.hasKeyword(flotsamCharacter, "Evasive")).toBe(true);
    });

    it("does not grant Evasive to characters with other names", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [jetsamUrsulasSpy, otherCharacter],
      });

      expect(testEngine.hasKeyword(otherCharacter, "Evasive")).toBe(false);
    });

    it("does not grant Evasive to opponent's Flotsam characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [jetsamUrsulasSpy] },
        { play: [flotsamCharacter] },
      );

      expect(testEngine.asPlayerTwo().hasKeyword(flotsamCharacter, "Evasive")).toBe(false);
    });

    it("Flotsam without Jetsam in play does not have Evasive from SINISTER SLITHER", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [flotsamCharacter],
      });

      expect(testEngine.hasKeyword(flotsamCharacter, "Evasive")).toBe(false);
    });
  });
});
