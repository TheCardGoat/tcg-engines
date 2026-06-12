import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { daleBumbler } from "./094-dale-bumbler";

describe("Dale - Bumbler", () => {
  it("is a vanilla 1/1/3/1 character", () => {
    expect(daleBumbler.vanilla).toBe(true);
    expect(daleBumbler.abilities).toBeUndefined();
    expect(daleBumbler.cost).toBe(1);
    expect(daleBumbler.strength).toBe(1);
    expect(daleBumbler.willpower).toBe(3);
    expect(daleBumbler.lore).toBe(1);
  });

  it("can quest for 1 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [daleBumbler],
      deck: 2,
    });

    const loreBefore = testEngine.getLore(PLAYER_ONE);

    expect(testEngine.asPlayerOne().quest(daleBumbler)).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 1);
  });
});
