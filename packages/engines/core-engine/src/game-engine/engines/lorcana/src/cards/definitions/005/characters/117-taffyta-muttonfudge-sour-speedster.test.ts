/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { hiddenCoveTranquilHaven } from "~/game-engine/engines/lorcana/src/cards/definitions/004/locations/locations";
import { taffytaMuttonfudgeSourSpeedster } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Taffyta Muttonfudge - Sour Speedster", () => {
  it("**NEW ROSTER** Once per turn, when this character moves to a location, gain 2 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: hiddenCoveTranquilHaven.moveCost * 2,
      play: [hiddenCoveTranquilHaven, taffytaMuttonfudgeSourSpeedster],
    });

    await testEngine.moveToLocation({
      location: hiddenCoveTranquilHaven,
      character: taffytaMuttonfudgeSourSpeedster,
    });

    expect(testEngine.getLoreForPlayer("player_one")).toBe(2);
  });
});
