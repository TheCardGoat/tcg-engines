import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { drDelbertDopplerFussyAstronomer } from "./152-dr-delbert-doppler-fussy-astronomer";

describe("Dr. Delbert Doppler - Fussy Astronomer", () => {
  it("should be a vanilla character with correct stats", () => {
    const testEngine = new LorcanaTestEngine({
      play: [drDelbertDopplerFussyAstronomer],
    });

    const cardUnderTest = testEngine.getCardModel(drDelbertDopplerFussyAstronomer);
    expect(cardUnderTest.strength).toBe(4);
    expect(cardUnderTest.willpower).toBe(4);
    expect(cardUnderTest.lore).toBe(1);
  });

  it("should be able to quest for 1 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: drDelbertDopplerFussyAstronomer, isDrying: false }],
      deck: 5,
    });

    expect(testEngine.asPlayerOne().quest(drDelbertDopplerFussyAstronomer)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
  });
});
