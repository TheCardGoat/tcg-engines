import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arthurTrainedSwordsman } from "../characters";
import { lastCannon } from "./202-last-cannon";

describe("Last Cannon", () => {
  it("banishes itself to give the chosen character Challenger +3 this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 1,
      play: [lastCannon, arthurTrainedSwordsman],
    });

    const result = testEngine.asPlayerOne().activateAbility(lastCannon, {
      targets: [arthurTrainedSwordsman],
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(lastCannon)).toBe("discard");
    expect(testEngine.asPlayerOne().getKeywordValue(arthurTrainedSwordsman, "Challenger")).toBe(3);
  });
});
