import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { forceOfAGreatTyphoon } from "./128-force-of-a-great-typhoon";

describe("Force of a Great Typhoon", () => {
  it("gives the chosen character +5 strength this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [forceOfAGreatTyphoon],
      inkwell: forceOfAGreatTyphoon.cost,
      play: [simbaProtectiveCub],
    });

    expect(
      testEngine.asPlayerOne().playCard(forceOfAGreatTyphoon, {
        targets: [simbaProtectiveCub],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardStrength(simbaProtectiveCub)).toBe(
      simbaProtectiveCub.strength + 5,
    );
  });
});
