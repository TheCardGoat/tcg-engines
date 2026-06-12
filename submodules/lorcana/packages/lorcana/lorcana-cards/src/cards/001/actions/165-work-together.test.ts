import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { moanaOfMotunui } from "../characters";
import { workTogether } from "./165-work-together";

describe("Work Together", () => {
  it("grants Support to chosen character this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [workTogether],
      inkwell: workTogether.cost,
      deck: [moanaOfMotunui, moanaOfMotunui],
      play: [moanaOfMotunui],
    });

    expect(testEngine.asPlayerOne().getCard(moanaOfMotunui)?.hasSupport).toEqual(false);

    const playResult = testEngine.asPlayerOne().playCard(workTogether, {
      targets: [moanaOfMotunui],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCard(moanaOfMotunui)?.hasSupport).toEqual(true);

    testEngine.asPlayerOne().passTurn();
    expect(testEngine.asPlayerOne().getCard(moanaOfMotunui)?.hasSupport).toEqual(false);
  });
});
