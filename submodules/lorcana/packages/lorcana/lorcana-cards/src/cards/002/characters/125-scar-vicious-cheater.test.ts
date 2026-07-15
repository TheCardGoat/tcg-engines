import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { scarViciousCheater } from "./125-scar-vicious-cheater";

describe("Scar - Vicious Cheater", () => {
  it("has Rush", () => {
    const testEngine = new LorcanaTestEngine({
      play: [scarViciousCheater],
    });

    expect(testEngine.getCardModel(scarViciousCheater).hasRush).toBe(true);
  });

  it("readies itself and still can't quest after banishing another character in a challenge during your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [scarViciousCheater],
        deck: 1,
      },
      {
        play: [{ card: simbaProtectiveCub, exerted: true }],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().challenge(scarViciousCheater, simbaProtectiveCub).success).toBe(
      true,
    );
    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("discard");
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(scarViciousCheater, {
        resolveOptional: true,
      }).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().isExerted(scarViciousCheater)).toBe(false);
    expect(testEngine.asPlayerOne().getCard(scarViciousCheater)?.hasQuestRestriction).toBe(true);
    expect(testEngine.asPlayerOne().quest(scarViciousCheater).success).toBe(false);
  });

  it("does not create a bag entry when its trigger condition never happens, so Scar can still quest", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [scarViciousCheater],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getCard(scarViciousCheater)?.hasQuestRestriction).toBe(false);
    expect(testEngine.asPlayerOne().quest(scarViciousCheater)).toBeSuccessfulCommand();
  });
});
