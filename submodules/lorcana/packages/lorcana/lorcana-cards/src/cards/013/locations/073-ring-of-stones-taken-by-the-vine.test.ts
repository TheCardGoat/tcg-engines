import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { ringOfStonesTakenByTheVine } from "./073-ring-of-stones-taken-by-the-vine";

const floodbornCharacter = createMockCharacter({
  id: "ring-of-stones-floodborn-character",
  name: "Floodborn Character",
  cost: 3,
  lore: 1,
  classifications: ["Floodborn", "Hero"],
});

const storybornCharacter = createMockCharacter({
  id: "ring-of-stones-storyborn-character",
  name: "Storyborn Character",
  cost: 3,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

describe("Ring of Stones - Taken by the Vine", () => {
  it("gives your Floodborn characters +1 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [ringOfStonesTakenByTheVine, floodbornCharacter, storybornCharacter],
    });

    expect(testEngine.getCard(floodbornCharacter).lore).toBe(2);
    expect(testEngine.getCard(storybornCharacter).lore).toBe(1);
  });
});
