import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { flotsamUrsulasSpy } from "./043-flotsam-ursulas-spy";

const jetsamCharacter = createMockCharacter({
  id: "flotsam-test-jetsam",
  name: "Jetsam",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
});

const otherCharacter = createMockCharacter({
  id: "flotsam-test-other",
  name: "Other Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Flotsam - Ursula's Spy", () => {
  it("has Rush keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [flotsamUrsulasSpy],
    });

    expect(testEngine.hasKeyword(flotsamUrsulasSpy, "Rush")).toBe(true);
  });

  describe("DEXTEROUS LUNGE — Your characters named Jetsam gain Rush.", () => {
    it("grants Rush to your characters named Jetsam", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [flotsamUrsulasSpy, jetsamCharacter],
      });

      expect(testEngine.hasKeyword(jetsamCharacter, "Rush")).toBe(true);
    });

    it("does not grant Rush to characters with other names", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [flotsamUrsulasSpy, otherCharacter],
      });

      expect(testEngine.hasKeyword(otherCharacter, "Rush")).toBe(false);
    });

    it("does not grant Rush to opponent's Jetsam characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [flotsamUrsulasSpy] },
        { play: [jetsamCharacter] },
      );

      expect(testEngine.asPlayerTwo().hasKeyword(jetsamCharacter, "Rush")).toBe(false);
    });
  });
});
