import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { petePastryChomper } from "./120-pete-pastry-chomper";

describe("Pete - Pastry Chomper", () => {
  it("is a vanilla 3/4/3/1 character", () => {
    expect(petePastryChomper.cost).toBe(3);
    expect(petePastryChomper.strength).toBe(4);
    expect(petePastryChomper.willpower).toBe(3);
    expect(petePastryChomper.lore).toBe(1);
    expect(petePastryChomper.vanilla).toBe(true);
  });

  it("can quest for 1 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [petePastryChomper],
      deck: 5,
    });

    const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);
    expect(testEngine.asPlayerOne().quest(petePastryChomper)).toBeSuccessfulCommand();
    const loreAfter = testEngine.asPlayerOne().getLore(PLAYER_ONE);

    expect(loreAfter).toBe(loreBefore + 1);
  });
});
