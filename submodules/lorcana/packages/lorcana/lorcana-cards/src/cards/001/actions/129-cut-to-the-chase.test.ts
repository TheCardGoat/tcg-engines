import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { moanaOfMotunui } from "../characters";
import { cutToTheChase } from "./129-cut-to-the-chase";

describe("Cut to the Chase", () => {
  it("grants Rush this turn to chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cutToTheChase],
      inkwell: cutToTheChase.cost,
      deck: [moanaOfMotunui, moanaOfMotunui],
      play: [moanaOfMotunui],
    });

    expect(testEngine.asPlayerOne().getCard(moanaOfMotunui)?.hasRush).toEqual(false);

    const playResult = testEngine.asPlayerOne().playCard(cutToTheChase, {
      targets: [moanaOfMotunui],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCard(moanaOfMotunui)?.hasRush).toEqual(true);

    testEngine.asPlayerOne().passTurn();
    expect(testEngine.asPlayerOne().getCard(moanaOfMotunui)?.hasRush).toEqual(false);
  });
});
