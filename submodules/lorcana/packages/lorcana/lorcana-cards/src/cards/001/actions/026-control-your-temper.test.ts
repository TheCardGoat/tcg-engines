import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { beastWolfsbane } from "../characters";
import { controlYourTemper } from "./026-control-your-temper";

describe("Control Your Temper!", () => {
  it("Chosen character gets -2 {S} this turn.", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [controlYourTemper],
      inkwell: controlYourTemper.cost,
      deck: [beastWolfsbane, beastWolfsbane],
      play: [beastWolfsbane],
    });

    expect(testEngine.asPlayerOne().getCardStrength(beastWolfsbane)).toEqual(
      beastWolfsbane.strength,
    );

    const playResult = testEngine.asPlayerOne().playCard(controlYourTemper, {
      targets: [beastWolfsbane],
    });
    expect(playResult).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(beastWolfsbane)).toEqual(
      beastWolfsbane.strength - 2,
    );

    testEngine.asPlayerOne().passTurn();

    expect(testEngine.asPlayerOne().getCardStrength(beastWolfsbane)).toEqual(
      beastWolfsbane.strength,
    );
  });
});
