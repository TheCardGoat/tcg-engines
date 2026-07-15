import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { snowWhiteWellWisher } from "./025-snow-white-well-wisher";
import { gastonBaritoneBully } from "./008-gaston-baritone-bully";

describe("Snow White - Well Wisher", () => {
  it("WISHES COME TRUE - return character card from discard to hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: snowWhiteWellWisher }],
      discard: [{ card: gastonBaritoneBully }],
    });

    const snowWhiteId = testEngine.findCardInstanceId(snowWhiteWellWisher, "play");
    const gastonDiscardId = testEngine.findCardInstanceId(gastonBaritoneBully, "discard");

    testEngine.asPlayerOne().quest(snowWhiteId);
    testEngine.asPlayerOne().resolvePendingByCard(snowWhiteWellWisher);

    // Target (choose card from discard)
    let pendingChoice = testEngine.asPlayerOne().getPendingChoice();
    if (pendingChoice) {
      testEngine.asPlayerOne().resolveNextPending({ targets: [gastonDiscardId] });
    }

    const gastonZone = testEngine.asPlayerOne().getCardZone(gastonDiscardId);
    expect(gastonZone).toBe("hand");
  });

  it("WISHES COME TRUE - no valid target", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: snowWhiteWellWisher }],
      discard: [],
    });

    const snowWhiteId = testEngine.findCardInstanceId(snowWhiteWellWisher, "play");

    testEngine.asPlayerOne().quest(snowWhiteId);

    // When there are no valid targets in discard, the optional ability should not be queued at all.
    // Lorcana rules: optional effects with no valid targets are suppressed.
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });
});
