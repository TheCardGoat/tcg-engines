import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { forbiddenMountainMaleficentsCastle } from "../locations";
import { quickPatch } from "./027-quick-patch";

describe("Quick Patch", () => {
  it("removes up to 3 damage from the chosen location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [quickPatch],
      inkwell: quickPatch.cost,
      play: [forbiddenMountainMaleficentsCastle],
    });

    testEngine.asServer().manualSetDamage(forbiddenMountainMaleficentsCastle, 3);

    expect(
      testEngine.asPlayerOne().playCard(quickPatch, {
        targets: [forbiddenMountainMaleficentsCastle],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getDamage(forbiddenMountainMaleficentsCastle)).toBe(0);
  });
});
