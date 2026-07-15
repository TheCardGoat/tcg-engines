import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { goofyKnightForADay } from "../../002";
import { seldomAllTheySeem } from "./164-seldom-all-they-seem";

describe("Seldom All They Seem", () => {
  it("gives the chosen character -3 strength this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [seldomAllTheySeem],
      inkwell: seldomAllTheySeem.cost,
      deck: [goofyKnightForADay, goofyKnightForADay],
      play: [goofyKnightForADay],
    });

    expect(testEngine.asPlayerOne().getCardStrength(goofyKnightForADay)).toBe(10);
    expect(
      testEngine.asPlayerOne().playCard(seldomAllTheySeem, {
        targets: [goofyKnightForADay],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardStrength(goofyKnightForADay)).toBe(7);
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardStrength(goofyKnightForADay)).toBe(10);
  });
});
