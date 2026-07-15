import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { drFaciliersCards } from "./101-dr-faciliers-cards";
import { tangle } from "../actions";

describe("Dr. Facilier’s Cards", () => {
  it("THE CARDS WILL TELL {E} — You pay 1 {I} less for the next action you play this turn.", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [tangle],
      inkwell: tangle.cost - 1,
      play: [drFaciliersCards],
    });

    const result = testEngine
      .asPlayerOne()
      .activateAbility(drFaciliersCards, { ability: "THE CARDS WILL TELL" });
    expect(result).toBeSuccessfulCommand();

    const playResult = testEngine.asPlayerOne().playCard(tangle);

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(drFaciliersCards)).toEqual(true);
  });
});
