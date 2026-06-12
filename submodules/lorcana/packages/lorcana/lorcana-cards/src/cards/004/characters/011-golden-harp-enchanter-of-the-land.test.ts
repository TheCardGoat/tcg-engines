import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { friendsOnTheOtherSide } from "../../001/actions/064-friends-on-the-other-side";
import { goldenHarpEnchanterOfTheLand } from "./011-golden-harp-enchanter-of-the-land";

describe("Golden Harp - Enchanter of the Land", () => {
  it("banishes itself at the end of your turn if you did not play a song", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [goldenHarpEnchanterOfTheLand],
    });

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(goldenHarpEnchanterOfTheLand)).toBe("discard");
  });

  it("stays in play if you played a song that turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [goldenHarpEnchanterOfTheLand],
      hand: [friendsOnTheOtherSide],
      inkwell: friendsOnTheOtherSide.cost,
      deck: 3,
    });

    expect(testEngine.asPlayerOne().playCard(friendsOnTheOtherSide)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(goldenHarpEnchanterOfTheLand)).toBe("play");
  });
});
