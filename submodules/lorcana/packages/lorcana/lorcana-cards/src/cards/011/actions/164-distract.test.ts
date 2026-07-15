import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { healingGlow, simbaProtectiveCub } from "../../001";
import { distract } from "./164-distract";

describe("Distract (set 011)", () => {
  it("gives the chosen character -2 strength this turn and draws a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [distract],
        inkwell: distract.cost,
        deck: [healingGlow],
      },
      {
        play: [simbaProtectiveCub],
      },
    );

    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", PLAYER_TWO);

    expect(testEngine.asPlayerTwo().getCardStrength(simbaId)).toBe(simbaProtectiveCub.strength);

    expect(
      testEngine.asPlayerOne().playCard(distract, {
        targets: [simbaId],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerTwo().getCardStrength(simbaId)).toBe(
      Math.max(0, simbaProtectiveCub.strength - 2),
    );
    expect(testEngine.asPlayerOne().getCardZone(healingGlow)).toBe("hand");
  });
});
