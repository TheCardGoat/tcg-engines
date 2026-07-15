import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { tukeNorthernMoose } from "./007-tuke-northern-moose";

describe("Tuke - Northern Moose", () => {
  it("is a vanilla 4/4/4/1 character", () => {
    expect(tukeNorthernMoose.cost).toBe(4);
    expect(tukeNorthernMoose.strength).toBe(4);
    expect(tukeNorthernMoose.willpower).toBe(4);
    expect(tukeNorthernMoose.lore).toBe(1);
    expect(tukeNorthernMoose.vanilla).toBe(true);
  });

  it("can quest for 1 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [tukeNorthernMoose],
      deck: 5,
    });

    const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);
    expect(testEngine.asPlayerOne().quest(tukeNorthernMoose)).toBeSuccessfulCommand();
    const loreAfter = testEngine.asPlayerOne().getLore(PLAYER_ONE);

    expect(loreAfter).toBe(loreBefore + 1);
  });
});
