import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { patchPlayfulPup } from "../characters";
import { twitterpated } from "./150-twitterpated";

describe("Twitterpated", () => {
  it("grants Evasive until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [twitterpated],
        inkwell: twitterpated.cost,
        deck: [patchPlayfulPup, patchPlayfulPup],
        play: [patchPlayfulPup],
      },
      {
        deck: [patchPlayfulPup, patchPlayfulPup],
      },
    );
    const playerOne = testEngine.asPlayerOne();
    const playerTwo = testEngine.asPlayerTwo();

    expect(playerOne).not.toHaveKeyword({ card: patchPlayfulPup, keyword: "Evasive" });
    expect(
      playerOne.playCard(twitterpated, { targets: [patchPlayfulPup] }),
    ).toBeSuccessfulCommand();
    expect(playerOne).toHaveKeyword({ card: patchPlayfulPup, keyword: "Evasive" });

    expect(playerOne.passTurn()).toBeSuccessfulCommand();
    expect(playerTwo).toHaveKeyword({ card: patchPlayfulPup, keyword: "Evasive" });

    expect(playerTwo.passTurn()).toBeSuccessfulCommand();
    expect(playerOne).not.toHaveKeyword({ card: patchPlayfulPup, keyword: "Evasive" });
  });
});
