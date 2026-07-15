import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { forbiddenMountainMaleficentsCastle } from "../locations";
import { baboom } from "./196-ba-boom";

describe("Ba-Boom!", () => {
  it("deals 2 damage to the chosen location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [baboom],
      inkwell: baboom.cost,
      play: [forbiddenMountainMaleficentsCastle],
    });

    expect(
      testEngine.asPlayerOne().playCard(baboom, {
        targets: [forbiddenMountainMaleficentsCastle],
      }).success,
    ).toBe(true);

    expect(testEngine.asServer().getDamage(forbiddenMountainMaleficentsCastle)).toBe(2);
  });
});
