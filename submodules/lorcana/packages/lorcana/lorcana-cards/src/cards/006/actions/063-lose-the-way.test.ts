import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend } from "../../001/characters";
import { iWontGiveIn } from "./028-i-wont-give-in";
import { loseTheWay } from "./063-lose-the-way";

describe.skip("Lose the Way", () => {
  it("exerts the chosen character and can stop them from readying after discarding", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [loseTheWay, iWontGiveIn],
        inkwell: loseTheWay.cost,
      },
      {
        play: [mickeyMouseTrueFriend],
      },
    );
    const targetId = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "play", "p2");

    expect(testEngine.asPlayerOne().playCard(loseTheWay, { targets: [targetId] }).success).toBe(
      true,
    );
    expect(testEngine.asPlayerTwo().isExerted(targetId)).toBe(true);

    expect(
      testEngine.asPlayerOne().resolvePendingEffect(loseTheWay, {
        resolveOptional: true,
      }).success,
    ).toBe(true);
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [iWontGiveIn],
      }).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getCardZone(iWontGiveIn)).toBe("discard");

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().isExerted(targetId)).toBe(true);
  });

  it("still offers the discard branch when the chosen character is already exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [loseTheWay, iWontGiveIn],
        inkwell: loseTheWay.cost,
      },
      {
        play: [{ card: mickeyMouseTrueFriend, exerted: true }],
      },
    );
    const targetId = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "play", "p2");

    expect(testEngine.asPlayerOne().playCard(loseTheWay, { targets: [targetId] }).success).toBe(
      true,
    );
    expect(testEngine.asPlayerOne()).toHavePendingEffectCount(1);

    expect(
      testEngine.asPlayerOne().resolvePendingEffect(loseTheWay, {
        resolveOptional: true,
      }).success,
    ).toBe(true);
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [iWontGiveIn],
      }).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getCardZone(iWontGiveIn)).toBe("discard");
  });
});
