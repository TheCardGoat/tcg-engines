import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs } from "../../001";
import { wakeUpAlice } from "./116-wake-up-alice";

describe("Wake Up, Alice!", () => {
  it("returns the chosen damaged character to their player's hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [wakeUpAlice],
        inkwell: wakeUpAlice.cost,
      },
      {
        play: [arielOnHumanLegs],
      },
    );

    expect(testEngine.asServer().manualSetDamage(arielOnHumanLegs, 2)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().playCard(wakeUpAlice, {
        targets: [arielOnHumanLegs],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerTwo().getCardZone(arielOnHumanLegs)).toBe("hand");
  });
});
