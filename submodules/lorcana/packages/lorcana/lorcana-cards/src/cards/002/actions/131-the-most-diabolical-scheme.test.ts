import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { gastonBaritoneBully, goofyKnightForADay } from "../characters";
import { theMostDiabolicalScheme } from "./131-the-most-diabolical-scheme";

describe("The Most Diabolical Scheme", () => {
  it("banishes your chosen Villain, then banishes a chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [theMostDiabolicalScheme],
        inkwell: theMostDiabolicalScheme.cost,
        play: [gastonBaritoneBully],
      },
      {
        play: [goofyKnightForADay],
      },
    );
    const villainId = testEngine.findCardInstanceId(gastonBaritoneBully, "play", "p1");
    const opposingId = testEngine.findCardInstanceId(goofyKnightForADay, "play", "p2");

    expect(
      testEngine.asPlayerOne().playCard(theMostDiabolicalScheme, {
        targets: [villainId, opposingId],
      }).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getCardZone(villainId)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(opposingId)).toBe("discard");
  });
});
