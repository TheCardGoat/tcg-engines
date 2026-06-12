import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mickeyMouseMusketeer } from "./186-mickey-mouse-musketeer";

const musketeerAlly = createMockCharacter({
  id: "musketeer-ally-1",
  name: "Musketeer Ally",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Dreamborn", "Musketeer"],
});

const musketeerAlly2 = createMockCharacter({
  id: "musketeer-ally-2",
  name: "Musketeer Ally 2",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  classifications: ["Dreamborn", "Musketeer"],
});

const nonMusketeer = createMockCharacter({
  id: "non-musketeer-1",
  name: "Non Musketeer",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Dreamborn", "Hero"],
});

describe("Mickey Mouse - Musketeer", () => {
  it("has Bodyguard keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [mickeyMouseMusketeer],
      deck: 1,
    });

    expect(testEngine.hasKeyword(mickeyMouseMusketeer, "Bodyguard")).toBe(true);
  });

  describe("ALL FOR ONE - Your other Musketeer characters get +1 {S}.", () => {
    it("other Musketeer characters get +1 strength", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mickeyMouseMusketeer, musketeerAlly, musketeerAlly2],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().getCardStrength(musketeerAlly)).toBe(3);
      expect(testEngine.asPlayerOne().getCardStrength(musketeerAlly2)).toBe(4);
    });

    it("Mickey Musketeer does not buff himself", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mickeyMouseMusketeer, musketeerAlly],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().getCardStrength(mickeyMouseMusketeer)).toBe(2);
    });

    it("non-Musketeer characters do not get buffed", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mickeyMouseMusketeer, nonMusketeer],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().getCardStrength(nonMusketeer)).toBe(2);
    });

    it("Musketeer characters get buffed even without Mickey attacking", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mickeyMouseMusketeer, musketeerAlly],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().getCardStrength(musketeerAlly)).toBe(3);
    });
  });
});
