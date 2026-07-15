import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { jafarAspiringRuler } from "./190-jafar-aspiring-ruler";

describe("Jafar - Aspiring Ruler", () => {
  it("THAT'S BETTER grants Challenger +2 this turn to a chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [jafarAspiringRuler],
      inkwell: jafarAspiringRuler.cost,
      play: [simbaProtectiveCub],
    });

    expect(testEngine.asPlayerOne().playCard(jafarAspiringRuler)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(jafarAspiringRuler, {
        targets: [simbaProtectiveCub],
      }),
    ).toBeSuccessfulCommand();

    // Regression guard: when target was incorrectly encoded as "SELF",
    // Jafar himself received Challenger +2 instead of the chosen character.
    expect(testEngine.getKeywordValue(simbaProtectiveCub, "Challenger")).toBe(2);
    expect(testEngine.getKeywordValue(jafarAspiringRuler, "Challenger")).toBeFalsy();
  });
});
