import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { swingIntoAction } from "./062-swing-into-action";

describe("Swing into Action", () => {
  it("gives the chosen character Rush this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [swingIntoAction],
      inkwell: swingIntoAction.cost,
      play: [simbaProtectiveCub],
    });

    expect(testEngine.hasKeyword(simbaProtectiveCub, "Rush")).toBe(false);
    expect(
      testEngine.asPlayerOne().playCard(swingIntoAction, {
        targets: [simbaProtectiveCub],
      }).success,
    ).toBe(true);

    expect(testEngine.hasKeyword(simbaProtectiveCub, "Rush")).toBe(true);
  });
});
