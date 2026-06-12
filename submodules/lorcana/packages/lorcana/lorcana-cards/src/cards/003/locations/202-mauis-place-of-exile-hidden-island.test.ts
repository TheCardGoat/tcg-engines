import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mauisPlaceOfExileHiddenIsland } from "./202-mauis-place-of-exile-hidden-island";

const islandGuest = createMockCharacter({
  id: "hidden-island-guest",
  name: "Hidden Island Guest",
  cost: 2,
});

describe("Maui's Place of Exile - Hidden Island", () => {
  it("gives characters here Resist +1", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [mauisPlaceOfExileHiddenIsland, islandGuest],
      inkwell: mauisPlaceOfExileHiddenIsland.moveCost,
    });

    expect(testEngine.getKeywordValue(islandGuest, "Resist")).toBeNull();
    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(islandGuest, mauisPlaceOfExileHiddenIsland)
        .success,
    ).toBe(true);
    expect(testEngine.getKeywordValue(islandGuest, "Resist")).toBe(1);
  });
});
