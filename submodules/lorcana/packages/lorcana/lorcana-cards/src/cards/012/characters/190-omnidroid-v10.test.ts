import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { omnidroidV10 } from "./190-omnidroid-v10";

const shiftFodder = createMockCharacter({
  id: "omnidroid-v10-shift-fodder",
  name: "Omnidroid",
  version: "Test Fodder",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  classifications: ["Storyborn", "Robot"],
});

describe("Omnidroid - V.10", () => {
  describe("ELECTRO-ARMOR - While there's a card under this character, it gains Resist +2.", () => {
    it("does not have Resist when there is no card under it", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [omnidroidV10],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().hasKeyword(omnidroidV10, "Resist")).toBe(false);
    });

    it("gains Resist +2 while there is a card under it", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: omnidroidV10, cardsUnder: [shiftFodder] }],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().hasKeyword(omnidroidV10, "Resist")).toBe(true);
    });
  });

  it("has Shift 4 keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [omnidroidV10],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().hasKeyword(omnidroidV10, "Shift")).toBe(true);
  });

  it("has no missing-implementation flags", () => {
    expect(omnidroidV10.missingImplementation).toBeUndefined();
    expect(omnidroidV10.missingTests).toBeUndefined();
  });
});
