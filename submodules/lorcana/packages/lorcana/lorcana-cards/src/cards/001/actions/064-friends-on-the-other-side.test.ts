import { describe, expect, it } from "bun:test";
import { friendsOnTheOtherSide } from "./064-friends-on-the-other-side";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";

describe("Friends On The Other Side", () => {
  it("Draw 2 cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: 10,
      hand: [friendsOnTheOtherSide],
      inkwell: friendsOnTheOtherSide.cost,
    });

    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 1, deck: 10, discard: 0 }),
    );

    testEngine.asPlayerOne().playCard(friendsOnTheOtherSide);

    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 2, deck: 8, discard: 1 }),
    );
  });
});
