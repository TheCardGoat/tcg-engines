import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, simbaProtectiveCub } from "../../001";
import { magicalManeuvers } from "./080-magical-maneuvers";

describe("Magical Maneuvers", () => {
  it("returns one of your characters to hand, then exerts another chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [magicalManeuvers],
        inkwell: magicalManeuvers.cost,
        play: [arielOnHumanLegs],
      },
      {
        play: [simbaProtectiveCub],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(magicalManeuvers, {
        targets: [arielOnHumanLegs, simbaProtectiveCub],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(arielOnHumanLegs)).toBe("hand");
    expect(testEngine.asPlayerTwo().getCard(simbaProtectiveCub)?.exerted).toBe(true);
  });
});
