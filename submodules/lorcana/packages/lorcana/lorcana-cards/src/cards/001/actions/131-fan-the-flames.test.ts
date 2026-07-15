import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { moanaOfMotunui } from "../characters";
import { fanTheFlames } from "./131-fan-the-flames";

describe("Fan the Flames", () => {
  it("readies chosen character and prevents it from questing this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [fanTheFlames],
      inkwell: fanTheFlames.cost,
      deck: [moanaOfMotunui, moanaOfMotunui],
      play: [moanaOfMotunui],
    });

    testEngine.asServer().manualExertCard(moanaOfMotunui);
    expect(testEngine.asPlayerOne().isExerted(moanaOfMotunui)).toBe(true);
    expect(testEngine.asPlayerOne().getCard(moanaOfMotunui)?.hasQuestRestriction).toEqual(false);

    const playResult = testEngine.asPlayerOne().playCard(fanTheFlames, {
      targets: [moanaOfMotunui],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(moanaOfMotunui)).toBe(false);
    expect(testEngine.asPlayerOne().getCard(moanaOfMotunui)?.hasQuestRestriction).toEqual(true);

    testEngine.asPlayerOne().passTurn();
    expect(testEngine.asPlayerOne().getCard(moanaOfMotunui)?.hasQuestRestriction).toEqual(false);
  });
});
