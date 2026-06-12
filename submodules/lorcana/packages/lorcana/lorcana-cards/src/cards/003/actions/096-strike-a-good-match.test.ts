import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, healingGlow, simbaProtectiveCub } from "../../001";
import { strikeAGoodMatch } from "./096-strike-a-good-match";

describe("Strike a Good Match", () => {
  it("draws 2 cards and then discards the chosen card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [strikeAGoodMatch, healingGlow],
      inkwell: strikeAGoodMatch.cost,
      deck: [simbaProtectiveCub, arielOnHumanLegs],
    });

    expect(
      testEngine.asPlayerOne().playCard(strikeAGoodMatch, {
        targets: [healingGlow],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(healingGlow)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(arielOnHumanLegs)).toBe("hand");
  });
});
