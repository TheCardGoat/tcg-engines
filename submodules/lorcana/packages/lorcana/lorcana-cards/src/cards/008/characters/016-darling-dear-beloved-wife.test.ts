import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend } from "../../001";
import { darlingDearBelovedWife } from "./016-darling-dear-beloved-wife";

describe("Darling Dear - Beloved Wife", () => {
  it("HOW SWEET - gives a chosen character +2 lore this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [darlingDearBelovedWife],
      inkwell: darlingDearBelovedWife.cost,
      play: [mickeyMouseTrueFriend],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(darlingDearBelovedWife)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(darlingDearBelovedWife, {
        targets: [mickeyMouseTrueFriend],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardLore(mickeyMouseTrueFriend)).toBe(
      mickeyMouseTrueFriend.lore + 2,
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardLore(mickeyMouseTrueFriend)).toBe(
      mickeyMouseTrueFriend.lore,
    );
  });
});
