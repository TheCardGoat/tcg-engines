import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, minnieMouseAlwaysClassy } from "@tcg/lorcana-cards/cards/001";

describe("Pass Turn Draw Animation", () => {
  it("emits a turn-change overlay and a deck-to-hand draw animation for the next player", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: [mickeyMouseTrueFriend],
      },
      {
        deck: [minnieMouseAlwaysClassy],
      },
    );

    testEngine.asLorcanaPlayerOne().passTurn();
    const packet = testEngine.asLorcanaPlayerOne().getLastPacketUpdate();
    const animations = packet?.animations ?? [];

    const turnChangeAnimation = animations.find(
      (animation) => animation.kind === "lorcana.turnChange",
    );
    expect(turnChangeAnimation).toBeDefined();

    const drawAnimation = animations.find(
      (animation) =>
        animation.kind === "lorcana.boardMove" &&
        (animation.payload as { variant?: string }).variant === "draw",
    );
    expect(drawAnimation).toBeDefined();
    expect(drawAnimation?.payload).toEqual(
      expect.objectContaining({
        actorSide: "playerTwo",
        sourceZoneId: "deck",
        destinationZoneId: "hand",
        phase: "consequence",
        playback: "serial",
        variant: "draw",
      }),
    );
  });
});
