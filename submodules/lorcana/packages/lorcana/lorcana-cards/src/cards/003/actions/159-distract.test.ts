import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { healingGlow, simbaProtectiveCub } from "../../001";
import { distract } from "./159-distract";

describe("Distract", () => {
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

    expect(
      testEngine.asPlayerOne().playCard(distract, {
        targets: [simbaProtectiveCub],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerTwo().getCardStrength(simbaProtectiveCub)).toBe(0);
    expect(testEngine.asPlayerOne().getCardZone(healingGlow)).toBe("hand");
  });
});
