import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { swordplay } from "./063-swordplay";

describe("Swordplay", () => {
  it("gives the chosen character Challenger +3 this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [swordplay],
      inkwell: swordplay.cost,
      play: [simbaProtectiveCub],
    });

    expect(
      testEngine.asPlayerOne().playCard(swordplay, {
        targets: [simbaProtectiveCub],
      }).success,
    ).toBe(true);

    expect(testEngine.getKeywordValue(simbaProtectiveCub, "Challenger")).toBe(3);
  });
});
