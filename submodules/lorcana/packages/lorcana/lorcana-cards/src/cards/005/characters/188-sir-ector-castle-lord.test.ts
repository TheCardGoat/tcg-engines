import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { sirEctorCastleLord } from "./188-sir-ector-castle-lord";

describe("Sir Ector - Castle Lord", () => {
  it("is a vanilla 7/7/10/3 character", () => {
    expect(sirEctorCastleLord.cost).toBe(7);
    expect(sirEctorCastleLord.strength).toBe(7);
    expect(sirEctorCastleLord.willpower).toBe(10);
    expect(sirEctorCastleLord.lore).toBe(3);
    expect(sirEctorCastleLord.vanilla).toBe(true);
  });

  it("can quest for 3 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [sirEctorCastleLord],
      deck: 5,
    });

    const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);
    expect(testEngine.asPlayerOne().quest(sirEctorCastleLord)).toBeSuccessfulCommand();
    const loreAfter = testEngine.asPlayerOne().getLore(PLAYER_ONE);

    expect(loreAfter).toBe(loreBefore + 3);
  });
});
