import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { friendsOnTheOtherSide } from "./064-friends-on-the-other-side";
import { doItAgain } from "./094-do-it-again";

describe("Do It Again!", () => {
  it("returns a chosen action card from your discard to your hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [doItAgain],
      inkwell: doItAgain.cost,
      discard: [friendsOnTheOtherSide],
    });

    expect(testEngine.asPlayerOne().getCardZone(friendsOnTheOtherSide)).toEqual("discard");

    const playResult = testEngine.asPlayerOne().playCard(doItAgain, {
      targets: [friendsOnTheOtherSide],
    });
    expect(playResult).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(doItAgain)).toEqual("discard");
    expect(testEngine.asPlayerOne().getCardZone(friendsOnTheOtherSide)).toEqual("hand");
    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 1, discard: 1 }),
    );
  });
});
