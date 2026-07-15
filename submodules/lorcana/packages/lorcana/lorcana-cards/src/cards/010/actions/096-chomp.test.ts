import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { goofyKnightForADay } from "../../002";
import { chomp } from "./096-chomp";

describe("Chomp!", () => {
  it("deals 2 damage to a chosen damaged character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [chomp],
        inkwell: chomp.cost,
      },
      {
        play: [goofyKnightForADay],
      },
    );

    testEngine.asServer().manualSetDamage(goofyKnightForADay, 1);

    const playResult = testEngine.asPlayerOne().playCard(chomp, {
      targets: [goofyKnightForADay],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getDamage(goofyKnightForADay)).toBe(3);
  });
});
