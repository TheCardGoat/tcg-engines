import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { goofyKnightForADay } from "../../002";
import { trialsAndTribulations } from "./043-trials-and-tribulations";

describe("Trials and Tribulations", () => {
  it("gives the chosen character -4 strength until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [trialsAndTribulations],
        inkwell: trialsAndTribulations.cost,
        deck: [goofyKnightForADay, goofyKnightForADay],
      },
      {
        deck: [goofyKnightForADay, goofyKnightForADay],
        play: [goofyKnightForADay],
      },
    );
    const playerOne = testEngine.asPlayerOne();
    const playerTwo = testEngine.asPlayerTwo();

    expect(playerTwo.getCardStrength(goofyKnightForADay)).toBe(goofyKnightForADay.strength);
    expect(
      playerOne.playCard(trialsAndTribulations, { targets: [goofyKnightForADay] }),
    ).toBeSuccessfulCommand();
    expect(playerTwo.getCardStrength(goofyKnightForADay)).toBe(goofyKnightForADay.strength - 4);

    expect(playerOne.passTurn()).toBeSuccessfulCommand();
    expect(playerTwo.getCardStrength(goofyKnightForADay)).toBe(goofyKnightForADay.strength - 4);

    expect(playerTwo.passTurn()).toBeSuccessfulCommand();
    expect(playerOne.getCardStrength(goofyKnightForADay)).toBe(goofyKnightForADay.strength);
  });
});
