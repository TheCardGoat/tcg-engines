import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { moanaOfMotunui } from "../characters";
import { theBeastIsMine } from "./099-the-beast-is-mine";

describe("The Beast is Mine!", () => {
  it("Chosen character gains Reckless during their next turn. (They can't quest and must challenge if able.)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [theBeastIsMine],
        inkwell: theBeastIsMine.cost,
        deck: [moanaOfMotunui, moanaOfMotunui],
        play: [moanaOfMotunui],
      },
      {
        deck: [moanaOfMotunui, moanaOfMotunui],
      },
    );

    expect(testEngine.asPlayerOne().getCard(moanaOfMotunui)?.hasReckless).toEqual(false);

    const playResult = testEngine.asPlayerOne().playCard(theBeastIsMine, {
      targets: [moanaOfMotunui],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCard(moanaOfMotunui)?.hasReckless).toEqual(false);

    testEngine.asPlayerOne().passTurn();
    expect(testEngine.asPlayerOne().getCard(moanaOfMotunui)?.hasReckless).toEqual(false);

    testEngine.asPlayerTwo().passTurn();
    expect(testEngine.asPlayerOne().getCard(moanaOfMotunui)?.hasReckless).toEqual(true);

    testEngine.asPlayerOne().passTurn();
    expect(testEngine.asPlayerOne().getCard(moanaOfMotunui)?.hasReckless).toEqual(false);
  });
});
