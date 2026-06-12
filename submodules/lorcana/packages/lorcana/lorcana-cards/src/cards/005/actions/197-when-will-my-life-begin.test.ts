import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { whenWillMyLifeBegin } from "./197-when-will-my-life-begin";

describe("When Will My Life Begin?", () => {
  it("gives the chosen character a temporary challenge restriction and draws a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [whenWillMyLifeBegin],
        inkwell: whenWillMyLifeBegin.cost,
        deck: [mickeyMouseTrueFriend, mickeyMouseTrueFriend],
      },
      {
        deck: [simbaProtectiveCub],
        play: [simbaProtectiveCub],
      },
    );

    expect(
      testEngine.asPlayerOne().playCardTo(whenWillMyLifeBegin, simbaProtectiveCub).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo()).toHaveRestriction({
      card: simbaProtectiveCub,
      restriction: "cant-challenge",
    });
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1, deck: 1, discard: 1 });
  });
});
