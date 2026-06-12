import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, heiheiBoatSnack } from "../characters";
import { fireTheCannons } from "./197-fire-the-cannons";

describe("Fire the Cannons!", () => {
  it("deals 2 damage to a chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fireTheCannons],
        inkwell: fireTheCannons.cost,
      },
      {
        play: [arielOnHumanLegs],
      },
    );

    const playResult = testEngine.asPlayerOne().playCard(fireTheCannons, {
      targets: [arielOnHumanLegs],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getDamage(arielOnHumanLegs)).toEqual(2);
  });
});
