import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { liloMakingAWish } from "../../001";
import { megaraCaptivatingCynic } from "./079-megara-captivating-cynic";

describe("Megara - Captivating Cynic", () => {
  it("lets you discard a card instead of banishing Megara when both branches are legal", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [megaraCaptivatingCynic, liloMakingAWish],
      inkwell: megaraCaptivatingCynic.cost,
    });
    const discardId = testEngine.findCardInstanceId(liloMakingAWish, "hand", "player_one");

    expect(testEngine.asPlayerOne().playCard(megaraCaptivatingCynic)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(megaraCaptivatingCynic),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().resolveNextPending({ choiceIndex: 0 }).success).toBe(true);
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [discardId] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(megaraCaptivatingCynic)).toBe("play");
    expect(testEngine.asPlayerOne().getCardZone(liloMakingAWish)).toBe("discard");
  });

  it("banishes Megara when choosing the banish option", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [megaraCaptivatingCynic, liloMakingAWish],
      inkwell: megaraCaptivatingCynic.cost,
    });

    expect(testEngine.asPlayerOne().playCard(megaraCaptivatingCynic)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(megaraCaptivatingCynic),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().resolveNextPending({ choiceIndex: 1 }).success).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(megaraCaptivatingCynic)).toBe("discard");
  });

  it("banishes Megara automatically when hand is empty — no choice prompt shown", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [megaraCaptivatingCynic],
      inkwell: megaraCaptivatingCynic.cost,
    });

    expect(testEngine.asPlayerOne().playCard(megaraCaptivatingCynic)).toBeSuccessfulCommand();

    // After playing Megara her hand is empty, so only banish is legal — should auto-force without suspension
    // No pending choice-selection prompt should remain
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    // Megara is banished automatically
    expect(testEngine.asPlayerOne().getCardZone(megaraCaptivatingCynic)).toBe("discard");
  });
});
