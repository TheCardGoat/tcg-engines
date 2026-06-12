import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend } from "@tcg/lorcana-cards/cards/001";
import { jafarAspiringRuler } from "@tcg/lorcana-cards/cards/007";

/**
 * BUG 22: Jafar - Aspiring Ruler "THAT'S BETTER":
 * "When you play this character, chosen character gains Challenger +2 this turn."
 * The player chooses the target (not auto-self). Must expose a target selection.
 */
describe("bug-22 — Jafar Aspiring Ruler lets the player choose the target", () => {
  it("exposes a chosen-character target selection after play (not auto-self)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [jafarAspiringRuler],
      play: [{ card: mickeyMouseTrueFriend, isDrying: false }],
      inkwell: jafarAspiringRuler.cost,
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(jafarAspiringRuler)).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();
    expect(bagEffect?.selectionContext?.kind).toBe("target-selection");

    // Resolve by targeting the ally (player's choice).
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(jafarAspiringRuler, {
        targets: [mickeyMouseTrueFriend],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.hasKeyword(mickeyMouseTrueFriend, "Challenger")).toBe(true);
    // Jafar himself must NOT gain Challenger — the effect targets "chosen character".
    expect(testEngine.hasKeyword(jafarAspiringRuler, "Challenger")).toBe(false);
  });
});
