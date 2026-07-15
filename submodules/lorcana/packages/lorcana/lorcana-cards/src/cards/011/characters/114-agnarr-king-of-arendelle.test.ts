import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { agnarrKingOfArendelle } from "./114-agnarr-king-of-arendelle";

const nonQueenCharacter = createMockCharacter({
  id: "agnarr-non-queen",
  name: "Non Queen Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  classifications: ["Storyborn", "Hero"],
});

const queenCharacterA = createMockCharacter({
  id: "agnarr-queen-a",
  name: "Iduna",
  cost: 3,
  strength: 2,
  willpower: 3,
  classifications: ["Storyborn", "Queen"],
});

const queenCharacterB = createMockCharacter({
  id: "agnarr-queen-b",
  name: "The Queen",
  cost: 4,
  strength: 3,
  willpower: 4,
  classifications: ["Storyborn", "Villain", "Queen"],
});

describe("Agnarr - King of Arendelle", () => {
  it("has base strength without a Queen in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [agnarrKingOfArendelle],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().getCardStrength(agnarrKingOfArendelle)).toBe(
      agnarrKingOfArendelle.strength,
    );
  });

  it("does not get +2 strength with a non-Queen character in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [agnarrKingOfArendelle, nonQueenCharacter],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().getCardStrength(agnarrKingOfArendelle)).toBe(
      agnarrKingOfArendelle.strength,
    );
  });

  it("gets +2 strength while you have a Queen character in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [agnarrKingOfArendelle, queenCharacterA],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().getCardStrength(agnarrKingOfArendelle)).toBe(
      agnarrKingOfArendelle.strength + 2,
    );
  });

  it("gets +2 strength with any Queen character (different Queen)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [agnarrKingOfArendelle, queenCharacterB],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().getCardStrength(agnarrKingOfArendelle)).toBe(
      agnarrKingOfArendelle.strength + 2,
    );
  });

  it("still only gets +2 strength when multiple Queens are in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [agnarrKingOfArendelle, queenCharacterA, queenCharacterB],
      deck: 2,
    });

    // The bonus is +2, not +2 per Queen
    expect(testEngine.asPlayerOne().getCardStrength(agnarrKingOfArendelle)).toBe(
      agnarrKingOfArendelle.strength + 2,
    );
  });
});
