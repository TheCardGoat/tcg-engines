import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { donaldDuckFirstMate } from "./080-donald-duck-first-mate";

const captainCharacter = createMockCharacter({
  id: "donald-first-mate-captain",
  name: "Captain Hook",
  cost: 3,
  strength: 2,
  willpower: 3,
  classifications: ["Storyborn", "Villain", "Captain"],
});

const nonCaptainCharacter = createMockCharacter({
  id: "donald-first-mate-non-captain",
  name: "Random Pirate",
  cost: 2,
  strength: 2,
  willpower: 2,
  classifications: ["Storyborn", "Pirate"],
});

describe("Donald Duck - First Mate", () => {
  it("can be placed in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [donaldDuckFirstMate],
    });

    expect(testEngine.asPlayerOne().getCardZone(donaldDuckFirstMate)).toBe("play");
  });

  it("has base lore without a Captain in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [donaldDuckFirstMate],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().getCardLore(donaldDuckFirstMate)).toBe(
      donaldDuckFirstMate.lore,
    );
  });

  it("does not get +2 lore with a non-Captain character in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [donaldDuckFirstMate, nonCaptainCharacter],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().getCardLore(donaldDuckFirstMate)).toBe(
      donaldDuckFirstMate.lore,
    );
  });

  it("CAPTAIN ON DECK - gets +2 lore while you have a Captain character in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [donaldDuckFirstMate, captainCharacter],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().getCardLore(donaldDuckFirstMate)).toBe(
      donaldDuckFirstMate.lore + 2,
    );
  });
});
