import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs } from "../../001";
import { repair } from "./162-repair";

describe("Repair", () => {
  it("removes up to 3 damage from one of your characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [repair],
      inkwell: repair.cost,
      play: [arielOnHumanLegs],
    });

    testEngine.asServer().manualSetDamage(arielOnHumanLegs, 3);

    expect(
      testEngine.asPlayerOne().playCard(repair, {
        targets: [arielOnHumanLegs],
      }).success,
    ).toBe(true);

    expect(testEngine.asServer().getDamage(arielOnHumanLegs)).toBe(0);
  });
});
