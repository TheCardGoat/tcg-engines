import { describe, expect, it } from "bun:test";
import { PLAYER_ONE, PLAYER_TWO, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { glimmerVsGlimmer } from "./130-glimmer-vs-glimmer";

describe("Glimmer vs Glimmer", () => {
  it("banishes your chosen character to banish another chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [glimmerVsGlimmer],
        inkwell: glimmerVsGlimmer.cost,
        play: [simbaProtectiveCub],
      },
      {
        play: [mickeyMouseTrueFriend],
      },
    );
    const ownTargetId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", PLAYER_ONE);
    const opposingTargetId = testEngine.findCardInstanceId(
      mickeyMouseTrueFriend,
      "play",
      PLAYER_TWO,
    );

    expect(
      testEngine.asPlayerOne().playCard(glimmerVsGlimmer, {
        targets: [ownTargetId, opposingTargetId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toBe("discard");
  });
});
