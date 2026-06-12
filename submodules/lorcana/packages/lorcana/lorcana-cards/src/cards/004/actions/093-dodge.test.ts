import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { dodge } from "./093-dodge";

describe("Dodge!", () => {
  it("gives the chosen character Ward and Evasive until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [dodge],
      inkwell: dodge.cost,
      play: [simbaProtectiveCub],
    });

    expect(testEngine.hasKeyword(simbaProtectiveCub, "Ward")).toBe(false);
    expect(testEngine.hasKeyword(simbaProtectiveCub, "Evasive")).toBe(false);
    expect(
      testEngine.asPlayerOne().playCard(dodge, {
        targets: [simbaProtectiveCub],
      }).success,
    ).toBe(true);

    expect(testEngine.hasKeyword(simbaProtectiveCub, "Ward")).toBe(true);
    expect(testEngine.hasKeyword(simbaProtectiveCub, "Evasive")).toBe(true);
  });
});
