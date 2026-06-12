import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mosquitoBite } from "./096-mosquito-bite";
import { goofyKnightForADay } from "../../002";

describe("Mosquito Bite", () => {
  it("Put 1 damage counter on chosen character.", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [mosquitoBite],
        inkwell: mosquitoBite.cost,
      },
      {
        play: [goofyKnightForADay],
      },
    );

    testEngine.asPlayerOne().playCard(mosquitoBite, {
      targets: [goofyKnightForADay],
    });

    expect(testEngine.asPlayerTwo().getDamage(goofyKnightForADay)).toBe(1);
  });
});
