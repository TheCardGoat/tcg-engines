import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { breakFree } from "./127-break-free";

describe("Break Free", () => {
  it("damages your chosen character and gives them Rush and +1 strength this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [breakFree],
      inkwell: breakFree.cost,
      play: [simbaProtectiveCub],
    });

    expect(testEngine.hasKeyword(simbaProtectiveCub, "Rush")).toBe(false);
    expect(
      testEngine.asPlayerOne().playCardTo(breakFree, simbaProtectiveCub),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveDamage({ card: simbaProtectiveCub, value: 1 });
    expect(testEngine.hasKeyword(simbaProtectiveCub, "Rush")).toBe(true);
    expect(testEngine.asPlayerOne().getCardStrength(simbaProtectiveCub)).toBe(
      simbaProtectiveCub.strength + 1,
    );
  });
});
