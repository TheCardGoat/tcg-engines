import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend } from "../../001";
import { theFrozenVineMonstrousPlant } from "../../011/locations";
import { restoringTheHeart } from "./039-restoring-the-heart";

describe("Restoring the Heart", () => {
  it("heals a chosen character and then draws a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [restoringTheHeart],
      inkwell: restoringTheHeart.cost,
      play: [mickeyMouseTrueFriend],
      deck: [theFrozenVineMonstrousPlant],
    });

    expect(testEngine.asServer().manualSetDamage(mickeyMouseTrueFriend, 2).success).toBe(true);

    expect(
      testEngine.asPlayerOne().playCard(restoringTheHeart, {
        targets: [mickeyMouseTrueFriend],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getDamage(mickeyMouseTrueFriend)).toBe(0);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });

  it("heals a chosen location and then draws a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [restoringTheHeart],
      inkwell: restoringTheHeart.cost,
      play: [theFrozenVineMonstrousPlant],
      deck: [mickeyMouseTrueFriend],
    });

    expect(testEngine.asServer().manualSetDamage(theFrozenVineMonstrousPlant, 3).success).toBe(
      true,
    );

    expect(
      testEngine.asPlayerOne().playCard(restoringTheHeart, {
        targets: [theFrozenVineMonstrousPlant],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getDamage(theFrozenVineMonstrousPlant)).toBe(0);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });
});
