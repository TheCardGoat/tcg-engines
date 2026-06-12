import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { pullTheLever } from "./080-pull-the-lever";

describe("Pull the Lever!", () => {
  it("draws 2 cards in mode 1", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [pullTheLever],
      inkwell: pullTheLever.cost,
      deck: [mickeyMouseTrueFriend, simbaProtectiveCub],
    });

    expect(testEngine.asPlayerOne().playCardWithChoice(pullTheLever, 0)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
  });

  it("makes each opponent choose and discard a card in mode 2", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [pullTheLever],
        inkwell: pullTheLever.cost,
      },
      {
        hand: [mickeyMouseTrueFriend],
      },
    );
    const discardId = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "hand", PLAYER_TWO);

    expect(testEngine.asPlayerOne().playCardWithChoice(pullTheLever, 1)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().respondWith(discardId)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toBe("discard");
  });
});
