import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend } from "../../001";
import { signTheScroll } from "./030-sign-the-scroll";

describe("Sign the Scroll", () => {
  it("gains 2 lore if the opponent declines to discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [signTheScroll],
        inkwell: signTheScroll.cost,
      },
      {
        hand: [mickeyMouseTrueFriend],
      },
    );

    expect(testEngine.asPlayerOne().playCard(signTheScroll).success).toBe(true);
    expect(testEngine.asPlayerTwo().resolveNextPending({ resolveOptional: false }).success).toBe(
      true,
    );

    expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
    expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toBe("hand");
  });

  it("does not gain lore if the opponent chooses and discards a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [signTheScroll],
        inkwell: signTheScroll.cost,
      },
      {
        hand: [mickeyMouseTrueFriend],
      },
    );

    const discardId = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "hand", "player_two");

    expect(testEngine.asPlayerOne().playCard(signTheScroll).success).toBe(true);
    expect(testEngine.asPlayerTwo().resolveNextPending({ resolveOptional: true }).success).toBe(
      true,
    );
    expect(testEngine.asPlayerTwo().resolveNextPending({ targets: [discardId] }).success).toBe(
      true,
    );

    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toBe("discard");
  });
});
