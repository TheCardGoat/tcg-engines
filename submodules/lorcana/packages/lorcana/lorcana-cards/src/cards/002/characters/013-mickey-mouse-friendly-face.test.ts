import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseFriendlyFace } from "./013-mickey-mouse-friendly-face";
import { gastonBaritoneBully } from "./008-gaston-baritone-bully";

describe("Mickey Mouse - Friendly Face", () => {
  it("GLAD YOU'RE HERE! - Reduces next character cost by 3 after questing", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: mickeyMouseFriendlyFace }],
      hand: [
        { card: gastonBaritoneBully }, // Cost 3
      ],
      inkwell: [], // 0 Ink
    });

    const mickeyId = testEngine.findCardInstanceId(mickeyMouseFriendlyFace, "play");
    const gastonId = testEngine.findCardInstanceId(gastonBaritoneBully, "hand");

    // Initially cannot play Gaston (Cost 3, Ink 0)
    expect(testEngine.asPlayerOne().canPlayCard(gastonId)).toBe(false);

    // Quest with Mickey
    testEngine.asPlayerOne().quest(mickeyId);

    // Resolve trigger
    testEngine.asPlayerOne().resolvePendingByCard(mickeyMouseFriendlyFace);

    // Now cost should be 0 (3 - 3)
    expect(testEngine.asPlayerOne().canPlayCard(gastonId)).toBe(true);

    // Play Gaston to verify
    testEngine.asPlayerOne().playCard(gastonId);

    // Verify Gaston is in play
    const gaston = testEngine.asServer().getCard(gastonId);
    expect(gaston.zone).toBe("play");
  });
});
