import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { pawpsicle } from "@tcg/lorcana-cards/cards/002";
import { mickeyMouseTrueFriend } from "@tcg/lorcana-cards/cards/001";

describe("Draw Effect Animation", () => {
  it("emits a deck-to-hand draw animation when a draw effect resolves", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [pawpsicle],
      inkwell: pawpsicle.cost,
      deck: [mickeyMouseTrueFriend],
    });

    expect(testEngine.asPlayerOne().playCard(pawpsicle).success).toBe(true);
    const bagEffect = testEngine.asPlayerOne().getBagEffects()[0];
    expect(bagEffect).toBeDefined();

    expect(testEngine.asPlayerOne().resolvePendingByCard(bagEffect!.sourceId).success).toBe(true);

    const packet = testEngine.asPlayerOne().getLastPacketUpdate();
    const animations = packet?.animations ?? [];
    const drawAnimation = animations.find(
      (animation) =>
        animation.kind === "lorcana.boardMove" &&
        (animation.payload as { variant?: string }).variant === "draw",
    );

    expect(drawAnimation).toBeDefined();
    expect(drawAnimation?.payload).toEqual(
      expect.objectContaining({
        sourceZoneId: "deck",
        destinationZoneId: "hand",
        phase: "consequence",
        playback: "serial",
        variant: "draw",
      }),
    );
  });
});
