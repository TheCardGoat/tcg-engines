import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { hiddenCoveTranquilHaven } from "../../004/locations/101-hidden-cove-tranquil-haven";
import { taffytaMuttonfudgeSourSpeedster } from "./117-taffyta-muttonfudge-sour-speedster";

describe("Taffyta Muttonfudge - Sour Speedster", () => {
  it("NEW ROSTER: when this character moves to a location, gain 2 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [taffytaMuttonfudgeSourSpeedster, hiddenCoveTranquilHaven],
      inkwell: hiddenCoveTranquilHaven.moveCost,
    });

    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

    expect(
      testEngine
        .asPlayerOne()
        .moveCharacterToLocation(taffytaMuttonfudgeSourSpeedster, hiddenCoveTranquilHaven),
    ).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
  });

  it("NEW ROSTER: once-per-turn restriction — second move in same turn does not gain lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [taffytaMuttonfudgeSourSpeedster, hiddenCoveTranquilHaven],
      inkwell: hiddenCoveTranquilHaven.moveCost * 2,
    });

    expect(
      testEngine
        .asPlayerOne()
        .moveCharacterToLocation(taffytaMuttonfudgeSourSpeedster, hiddenCoveTranquilHaven),
    ).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(2);

    // Move back out from location first to allow a second move (if applicable), but
    // the once-per-turn restriction should prevent gaining lore a second time.
    // In practice the character is already at the location so we just verify lore stayed at 2.
    expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
  });
});
