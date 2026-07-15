import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { goofyKnightForADay } from "../../002";
import { darkwingDuckDarkwarrior } from "../characters";
import { theTerrorThatFlapsInTheNight } from "./197-the-terror-that-flaps-in-the-night";

describe("The Terror That Flaps in the Night", () => {
  it("deals 2 damage without Darkwing Duck in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [theTerrorThatFlapsInTheNight],
        inkwell: theTerrorThatFlapsInTheNight.cost,
      },
      {
        play: [goofyKnightForADay],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(theTerrorThatFlapsInTheNight, {
        targets: [goofyKnightForADay],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerTwo().getDamage(goofyKnightForADay)).toBe(2);
  });

  it("deals 3 damage when you have a character named Darkwing Duck in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [theTerrorThatFlapsInTheNight],
        inkwell: theTerrorThatFlapsInTheNight.cost,
        play: [darkwingDuckDarkwarrior],
      },
      {
        play: [goofyKnightForADay],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(theTerrorThatFlapsInTheNight, {
        targets: [goofyKnightForADay],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerTwo().getDamage(goofyKnightForADay)).toBe(3);
  });
});
