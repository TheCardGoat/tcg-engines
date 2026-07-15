import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { goofyKnightForADay } from "../../002";
import { legendOfTheSwordInTheStone } from "./064-legend-of-the-sword-in-the-stone";

describe("Legend of the Sword in the Stone", () => {
  it("grants Challenger +3 this turn to the chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [legendOfTheSwordInTheStone],
      inkwell: legendOfTheSwordInTheStone.cost,
      deck: [goofyKnightForADay, goofyKnightForADay],
      play: [goofyKnightForADay],
    });

    expect(
      testEngine.asPlayerOne().playCardTo(legendOfTheSwordInTheStone, goofyKnightForADay).success,
    ).toBe(true);
    expect(testEngine.getKeywordValue(goofyKnightForADay, "Challenger")).toBe(3);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.getKeywordValue(goofyKnightForADay, "Challenger")).toBe(null);
  });
});
