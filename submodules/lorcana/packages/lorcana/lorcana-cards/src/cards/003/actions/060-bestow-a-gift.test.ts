import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, simbaProtectiveCub } from "../../001";
import { bestowAGift } from "./060-bestow-a-gift";

describe("Bestow a Gift", () => {
  it("moves 1 damage counter from the chosen character to the chosen opposing character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [bestowAGift],
        inkwell: bestowAGift.cost,
        play: [arielOnHumanLegs],
      },
      {
        play: [simbaProtectiveCub],
      },
    );

    testEngine.asServer().manualSetDamage(arielOnHumanLegs, 2);
    expect(
      testEngine.asPlayerOne().playCard(bestowAGift, {
        targets: [arielOnHumanLegs, simbaProtectiveCub],
      }).success,
    ).toBe(true);

    expect(testEngine.asServer().getDamage(arielOnHumanLegs)).toBe(1);
    expect(testEngine.asPlayerTwo().getDamage(simbaProtectiveCub)).toBe(1);
  });
});
