import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { undermine } from "./117-undermine";

describe("Undermine", () => {
  it("makes the chosen opponent discard and gives the chosen character +2 strength this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [undermine],
        inkwell: undermine.cost,
        play: [simbaProtectiveCub],
      },
      {
        hand: [mickeyMouseTrueFriend],
      },
    );
    const discardId = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "hand", PLAYER_TWO);
    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", "p1");

    expect(testEngine.asPlayerOne().playCard(undermine).success).toBe(true);
    expect(testEngine.asPlayerTwo().respondWith(discardId)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [simbaId] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardStrength(simbaProtectiveCub)).toBe(
      simbaProtectiveCub.strength + 2,
    );
  });
});
