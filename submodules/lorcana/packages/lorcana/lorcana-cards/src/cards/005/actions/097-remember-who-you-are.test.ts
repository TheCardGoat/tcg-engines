import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, moanaOfMotunui, simbaProtectiveCub } from "../../001";
import { rememberWhoYouAre } from "./097-remember-who-you-are";

describe("Remember Who You Are", () => {
  it("draws until you match the opponent's hand size when they have more cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [rememberWhoYouAre, simbaProtectiveCub],
        inkwell: rememberWhoYouAre.cost,
        deck: [mickeyMouseTrueFriend, moanaOfMotunui],
      },
      {
        hand: [simbaProtectiveCub, mickeyMouseTrueFriend, moanaOfMotunui],
      },
    );

    expect(testEngine.asPlayerOne().playCard(rememberWhoYouAre)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 3, deck: 0, discard: 1 });
  });

  it("does not draw when you already have at least as many cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [rememberWhoYouAre, simbaProtectiveCub, mickeyMouseTrueFriend],
        inkwell: rememberWhoYouAre.cost,
        deck: [moanaOfMotunui],
      },
      {
        hand: [simbaProtectiveCub],
      },
    );

    expect(testEngine.asPlayerOne().playCard(rememberWhoYouAre)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 2, deck: 1, discard: 1 });
  });
});
