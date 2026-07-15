import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, simbaProtectiveCub } from "../../001";
import { brawl } from "./130-brawl";

describe("Brawl", () => {
  it("banishes a chosen character with 2 strength or less", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [brawl],
        inkwell: brawl.cost,
      },
      {
        play: [simbaProtectiveCub],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(brawl, {
        targets: [simbaProtectiveCub],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("discard");
  });

  it("does not allow targeting a character with more than 2 strength", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [brawl],
        inkwell: brawl.cost,
      },
      {
        play: [arielOnHumanLegs],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(brawl, {
        targets: [arielOnHumanLegs],
      }).success,
    ).toBe(false);
    expect(testEngine.asPlayerTwo().getCardZone(arielOnHumanLegs)).toBe("play");
  });
});
