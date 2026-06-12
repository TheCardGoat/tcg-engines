import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { monstroWhaleOfAWhale } from "./052-monstro-whale-of-a-whale";

describe("Monstro - Whale of a Whale", () => {
  it("is a vanilla 5/5/6/1 character", () => {
    expect(monstroWhaleOfAWhale.cost).toBe(5);
    expect(monstroWhaleOfAWhale.strength).toBe(5);
    expect(monstroWhaleOfAWhale.willpower).toBe(6);
    expect(monstroWhaleOfAWhale.lore).toBe(1);
    expect(monstroWhaleOfAWhale.vanilla).toBe(true);
  });

  it("can quest for 1 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [monstroWhaleOfAWhale],
      deck: 5,
    });

    const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);
    expect(testEngine.asPlayerOne().quest(monstroWhaleOfAWhale)).toBeSuccessfulCommand();
    const loreAfter = testEngine.asPlayerOne().getLore(PLAYER_ONE);

    expect(loreAfter).toBe(loreBefore + 1);
  });
});
