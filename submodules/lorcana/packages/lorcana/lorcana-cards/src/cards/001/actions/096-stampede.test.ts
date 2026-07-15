import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs } from "../characters";
import { stampede } from "./096-stampede";

describe("Stampede", () => {
  it("deals 2 damage to a chosen damaged character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [stampede],
        inkwell: stampede.cost,
      },
      {
        play: [arielOnHumanLegs],
      },
    );

    testEngine.asServer().manualSetDamage(arielOnHumanLegs, 1);

    const playResult = testEngine.asPlayerOne().playCard(stampede, {
      targets: [arielOnHumanLegs],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getDamage(arielOnHumanLegs)).toEqual(3);
  });
});
