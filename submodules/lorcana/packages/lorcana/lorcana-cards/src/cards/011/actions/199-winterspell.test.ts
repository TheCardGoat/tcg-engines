import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend } from "../../001";
import { theFrozenVineMonstrousPlant } from "../locations";
import { winterspell } from "./199-winterspell";

describe("Winterspell", () => {
  it("protects the chosen location until your next turn starts and draws a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [winterspell],
        inkwell: winterspell.cost,
        play: [theFrozenVineMonstrousPlant],
        deck: [mickeyMouseTrueFriend, mickeyMouseTrueFriend, mickeyMouseTrueFriend],
      },
      {
        deck: [mickeyMouseTrueFriend, mickeyMouseTrueFriend],
        play: [mickeyMouseTrueFriend],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(winterspell, {
        targets: [theFrozenVineMonstrousPlant],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().canChallenge(mickeyMouseTrueFriend, theFrozenVineMonstrousPlant),
    ).toBe(false);

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asServer().manualExertCard(theFrozenVineMonstrousPlant),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerTwo().canChallenge(mickeyMouseTrueFriend, theFrozenVineMonstrousPlant),
    ).toBe(true);
  });
});
