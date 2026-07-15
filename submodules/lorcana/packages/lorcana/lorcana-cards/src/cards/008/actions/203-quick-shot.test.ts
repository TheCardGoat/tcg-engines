import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend } from "../../001";
import { goofyKnightForADay } from "../../002";
import { quickShot } from "./203-quick-shot";

describe("Quick Shot", () => {
  it("deals 1 damage to the chosen character and draws a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [quickShot],
        inkwell: quickShot.cost,
        deck: [mickeyMouseTrueFriend],
      },
      {
        play: [goofyKnightForADay],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(quickShot, {
        targets: [goofyKnightForADay],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getDamage(goofyKnightForADay)).toBe(1);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });
});
