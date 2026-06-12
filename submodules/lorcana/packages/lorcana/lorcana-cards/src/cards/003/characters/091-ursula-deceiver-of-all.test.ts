import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { friendsOnTheOtherSide } from "../../001";
import { ursulaDeceiverOfAll } from "./091-ursula-deceiver-of-all";

describe("Ursula - Deceiver of All", () => {
  it("replays the sung song from discard for free and then puts it on the bottom of the deck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [friendsOnTheOtherSide],
      play: [{ card: ursulaDeceiverOfAll, isDrying: false }],
      deck: 4,
    });

    expect(
      testEngine.asPlayerOne().singSong(friendsOnTheOtherSide, ursulaDeceiverOfAll).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(testEngine.asPlayerOne().resolvePendingByCard(ursulaDeceiverOfAll).success).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(friendsOnTheOtherSide)).toBe("deck");
    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 4,
        deck: 1,
        discard: 0,
      }),
    );
  });
});
