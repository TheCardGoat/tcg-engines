import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { rooHunnyRogue } from "./083-roo-hunny-rogue";

const otherHunny = createMockCharacter({
  id: "roo-hunny-rogue-other-hunny",
  name: "Other Hunny",
  cost: 1,
  classifications: ["Storyborn", "Hunny"],
});

describe("Roo - Hunny Rogue", () => {
  it("has Ward", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [rooHunnyRogue],
    });

    expect(testEngine.asPlayerOne().hasKeyword(rooHunnyRogue, "Ward")).toBe(true);
  });

  it("gains Evasive while you have another Hunny character in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [rooHunnyRogue, otherHunny],
    });

    expect(testEngine.asPlayerOne().hasKeyword(rooHunnyRogue, "Evasive")).toBe(true);
  });
});
