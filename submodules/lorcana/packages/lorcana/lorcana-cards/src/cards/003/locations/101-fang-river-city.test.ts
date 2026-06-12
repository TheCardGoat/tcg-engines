import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { fangRiverCity } from "./101-fang-river-city";

const traveler = createMockCharacter({
  id: "fang-traveler",
  name: "Fang Traveler",
  cost: 2,
});

describe("Fang - River City", () => {
  it("gives characters here Ward and Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [fangRiverCity, traveler],
      inkwell: fangRiverCity.moveCost,
    });

    expect(testEngine.asPlayerOne().getCard(traveler)?.keywords).not.toContain("Ward");
    expect(testEngine.asPlayerOne().getCard(traveler)?.hasEvasive).toBe(false);

    expect(testEngine.asPlayerOne().moveCharacterToLocation(traveler, fangRiverCity).success).toBe(
      true,
    );

    expect(testEngine.asPlayerOne().getCard(traveler)?.keywords).toContain("Ward");
    expect(testEngine.asPlayerOne().getCard(traveler)?.hasEvasive).toBe(true);
  });
});
