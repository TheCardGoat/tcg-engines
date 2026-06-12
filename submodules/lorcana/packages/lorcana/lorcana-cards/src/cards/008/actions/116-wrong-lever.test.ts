import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { goofyKnightForADay } from "../../002";
import { pullTheLever } from "./080-pull-the-lever";
import { wrongLever } from "./116-wrong-lever";

describe("Wrong Lever!", () => {
  it("returns the chosen character to hand in the first mode", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [wrongLever],
        inkwell: wrongLever.cost,
      },
      {
        play: [goofyKnightForADay],
      },
    );

    expect(
      testEngine.asPlayerOne().playCardWithChoice(wrongLever, 0, { targets: [goofyKnightForADay] })
        .success,
    ).toBe(true);
    expect(testEngine.asPlayerTwo().getCardZone(goofyKnightForADay)).toBe("hand");
  });

  it("puts Pull the Lever! on the bottom of your deck before resolving the follow-up target selection", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [wrongLever],
        inkwell: wrongLever.cost,
        discard: [pullTheLever],
      },
      {
        play: [goofyKnightForADay],
        deck: [simbaProtectiveCub],
      },
    );
    const playerOne = testEngine.asPlayerOne();
    const goofyId = testEngine.findCardInstanceId(goofyKnightForADay, "play", "p2");

    expect(playerOne.playCardWithChoice(wrongLever, 1).success).toBe(true);
    expect(playerOne.resolveNextPending({ targets: [goofyId] }).success).toBe(true);

    expect(playerOne.getCardZone(pullTheLever)).toBe("deck");
  });

  it("regression: second mode does NOT put character on bottom when no Pull the Lever! is in discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [wrongLever],
        inkwell: wrongLever.cost,
        discard: [], // No Pull the Lever! in discard
      },
      {
        play: [goofyKnightForADay],
        deck: [simbaProtectiveCub],
      },
    );
    const goofyId = testEngine.findCardInstanceId(goofyKnightForADay, "play", "p2");

    // Play Wrong Lever choosing second mode
    const playResult = testEngine.asPlayerOne().playCardWithChoice(wrongLever, 1);
    expect(playResult.success).toBe(true);

    // Try to resolve the pending target for putting character on bottom
    const pendingResult = testEngine.asPlayerOne().resolveNextPending({ targets: [goofyId] });

    // Without Pull the Lever! in discard, the "if you do" condition should fail
    // Goofy should NOT be put on bottom - should remain in play
    expect(testEngine.asPlayerTwo().getCardZone(goofyKnightForADay)).toBe("play");
  });
});
