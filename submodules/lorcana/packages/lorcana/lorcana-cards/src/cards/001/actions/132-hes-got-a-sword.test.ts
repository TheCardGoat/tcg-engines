import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { moanaOfMotunui } from "../characters";
import { hesGotASword } from "./132-hes-got-a-sword";

describe("He's Got a Sword!", () => {
  it("gives chosen character +2 strength this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [hesGotASword],
      inkwell: hesGotASword.cost,
      deck: [moanaOfMotunui, moanaOfMotunui],
      play: [moanaOfMotunui],
    });

    expect(testEngine.asPlayerOne().getCardStrength(moanaOfMotunui)).toEqual(
      moanaOfMotunui.strength,
    );

    const playResult = testEngine.asPlayerOne().playCard(hesGotASword, {
      targets: [moanaOfMotunui],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardStrength(moanaOfMotunui)).toEqual(
      moanaOfMotunui.strength + 2,
    );

    testEngine.asPlayerOne().passTurn();

    expect(testEngine.asPlayerOne().getCardStrength(moanaOfMotunui)).toEqual(
      moanaOfMotunui.strength,
    );
  });
});
