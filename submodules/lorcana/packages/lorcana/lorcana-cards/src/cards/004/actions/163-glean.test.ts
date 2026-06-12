import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { pawpsicle } from "../../002";
import { glean } from "./163-glean";

describe("Glean", () => {
  it("banishes your item and gives you 2 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [glean],
      inkwell: glean.cost,
      play: [pawpsicle],
    });

    expect(
      testEngine.asPlayerOne().playCard(glean, {
        targets: [pawpsicle],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(pawpsicle)).toBe("discard");
    expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
  });

  it("banishes an opponent item and gives that player 2 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [glean],
        inkwell: glean.cost,
      },
      {
        play: [pawpsicle],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(glean, {
        targets: [pawpsicle],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerTwo().getCardZone(pawpsicle)).toBe("discard");
    expect(testEngine.getLore(PLAYER_TWO)).toBe(2);
  });
});
