import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { duckForCover } from "./198-duck-for-cover";

describe("Duck for Cover!", () => {
  it("gives the chosen character Resist +1 and Evasive this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [duckForCover],
      inkwell: duckForCover.cost,
      play: [simbaProtectiveCub],
    });

    expect(testEngine.hasKeyword(simbaProtectiveCub, "Evasive")).toBe(false);
    expect(testEngine.getKeywordValue(simbaProtectiveCub, "Resist")).toBe(null);

    expect(
      testEngine.asPlayerOne().playCardTo(duckForCover, simbaProtectiveCub),
    ).toBeSuccessfulCommand();

    expect(testEngine.hasKeyword(simbaProtectiveCub, "Evasive")).toBe(true);
    expect(testEngine.getKeywordValue(simbaProtectiveCub, "Resist")).toBe(1);
  });
});
