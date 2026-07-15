import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { mowgliManCub } from "../characters/019-mowgli-man-cub";
import { puttingItAllTogether } from "./196-putting-it-all-together";

describe("Putting It All Together", () => {
  it("stops the chosen opposing character from challenging during their next turn, then expires", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [puttingItAllTogether],
        inkwell: puttingItAllTogether.cost,
        play: [{ card: simbaProtectiveCub, exerted: true }],
        deck: 2,
      },
      {
        play: [mowgliManCub],
        deck: 2,
      },
    );

    const playResult = testEngine.asPlayerOne().playCard(puttingItAllTogether, {
      targets: [mowgliManCub],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo()).toHaveRestriction({
      card: mowgliManCub,
      restriction: "cant-challenge",
    });
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo()).not.toHaveRestriction({
      card: mowgliManCub,
      restriction: "cant-challenge",
    });
  });
});
