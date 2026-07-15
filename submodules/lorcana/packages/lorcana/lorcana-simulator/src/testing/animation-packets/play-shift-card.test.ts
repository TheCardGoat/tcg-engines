import { describe, it, expect } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  captainHookThinkingAHappyThought,
  captainHookForcefulDuelist,
} from "@tcg/lorcana-cards/cards/001";

describe("Play Shift Card Animation", () => {
  it("emits boardMove with play-character-shift variant when shifting", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [captainHookThinkingAHappyThought],
      play: [{ card: captainHookForcefulDuelist, isDrying: false }],
      inkwell: 3,
      deck: 1,
    });

    const shiftTarget = testEngine.findCardInstanceId(captainHookForcefulDuelist, "play");

    expect(
      testEngine.asPlayerOne().playCard(captainHookThinkingAHappyThought, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    const packet = testEngine.asLorcanaPlayerOne().getLastPacketUpdate();
    const animations = packet?.animations ?? [];

    const boardMoveAnimation = animations.find((a) => a.kind === "lorcana.boardMove");
    expect(boardMoveAnimation).toBeDefined();
    expect(boardMoveAnimation?.payload).toEqual(
      expect.objectContaining({
        variant: "play-character-shift",
        sourceZoneId: "hand",
        destinationZoneId: "play",
        impactAt: "via",
        renderFace: "faceUp",
        actorSide: "playerOne",
      }),
    );
  });

  it("emits standard play-character variant for non-shift play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [captainHookForcefulDuelist],
      inkwell: captainHookForcefulDuelist.cost,
      deck: 1,
    });

    expect(testEngine.asPlayerOne().playCard(captainHookForcefulDuelist)).toBeSuccessfulCommand();

    const packet = testEngine.asLorcanaPlayerOne().getLastPacketUpdate();
    const animations = packet?.animations ?? [];

    const boardMoveAnimation = animations.find((a) => a.kind === "lorcana.boardMove");
    expect(boardMoveAnimation).toBeDefined();
    expect(boardMoveAnimation?.payload).toEqual(
      expect.objectContaining({
        variant: "play-character",
        sourceZoneId: "hand",
        destinationZoneId: "play",
      }),
    );
  });
});
