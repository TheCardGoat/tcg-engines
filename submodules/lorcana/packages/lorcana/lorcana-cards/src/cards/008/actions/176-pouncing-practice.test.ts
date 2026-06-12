import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { goofyKnightForADay } from "../../002";
import { pouncingPractice } from "./176-pouncing-practice";

describe("Pouncing Practice", () => {
  it("gives the chosen character -2 strength and gives your chosen character Evasive this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [pouncingPractice],
        inkwell: pouncingPractice.cost,
        play: [simbaProtectiveCub],
      },
      {
        play: [goofyKnightForADay],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(pouncingPractice, {
        targets: [goofyKnightForADay, simbaProtectiveCub],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardStrength(goofyKnightForADay)).toBe(
      goofyKnightForADay.strength - 2,
    );
    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: simbaProtectiveCub,
      keyword: "Evasive",
    });
  });
});
