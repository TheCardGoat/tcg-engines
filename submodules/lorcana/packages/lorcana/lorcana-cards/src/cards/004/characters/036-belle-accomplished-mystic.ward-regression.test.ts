import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { belleAccomplishedMystic } from "./036-belle-accomplished-mystic";

const damagedAlly = createMockCharacter({
  id: "belle-slot-ally",
  name: "Damaged Ally",
  cost: 2,
  strength: 2,
  willpower: 5,
});

const opposingTarget = createMockCharacter({
  id: "belle-slot-opp",
  name: "Opposing",
  cost: 2,
  strength: 2,
  willpower: 6,
  abilities: [
    {
      type: "keyword",
      keyword: "Ward",
      text: "Ward",
      id: "belle-slot-opp-ward",
    },
  ],
});

// Regression: replay mgPNpagigao72B9Hc9_xf2x turn 13 — Belle's ENHANCED HEALING
// silently completed (status: "completed", no patches) when the player chose a
// Ward'd opposing character as the destination. Root cause: action-target
// candidate enumeration for move-damage participants used `selector: "all"`,
// which skipped the Ward filter; validation accepted the slotted submission;
// then `resolveEffectTargets` for `CHOSEN_OPPOSING_CHARACTER` (selector: chosen)
// correctly excluded the Ward target, leaving `destinationId` undefined and
// causing a silent no-op in the move-damage handler.
//
// Fixed in target-analysis.ts → resolveActionTargetCandidates by switching the
// derived descriptor to `selector: "chosen"` so the Ward filter applies during
// candidate enumeration and the engine returns INVALID_ACTION_TARGET to the
// caller instead of resolving with no effect.
describe("Belle - ENHANCED HEALING — Ward destination rejection (regression)", () => {
  it("rejects a Ward'd opposing destination instead of silently no-op'ing", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [belleAccomplishedMystic],
        play: [{ card: damagedAlly, damage: 3 }],
        inkwell: belleAccomplishedMystic.cost,
      },
      {
        play: [
          opposingTarget,
          createMockCharacter({
            id: "belle-slot-opp-vanilla",
            name: "Vanilla Opp",
            cost: 1,
            strength: 1,
            willpower: 3,
          }),
        ],
      },
    );

    expect(testEngine.asPlayerOne().playCard(belleAccomplishedMystic)).toBeSuccessfulCommand();

    const fromId = testEngine.asPlayerOne().getCard(damagedAlly).id;
    const toId = testEngine.asPlayerTwo().getCard(opposingTarget).id;

    // Mirror exactly what the simulator emits (see replay
    // mgPNpagigao72B9Hc9_xf2x turn 13 step 65) — go through resolveBag directly.
    const bagEffect = testEngine.asPlayerOne().getBagEffects()[0];
    expect(bagEffect).toBeDefined();
    const result = testEngine.asPlayerOne().resolveBag(bagEffect!.id, {
      resolveOptional: true,
      // Try to send damage to a Ward'd target. The engine should reject
      // the selection with a clear error — NOT silently no-op.
      targets: { kind: "move-damage", from: [fromId], to: [toId] } as never,
      amount: 3,
    } as never);
    // Engine must reject — Ward target cannot be chosen by an opposing effect.
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe("INVALID_ACTION_TARGET");
    }
    expect(testEngine.asPlayerOne().getCard(damagedAlly)?.damage).toBe(3);
    expect(testEngine.asPlayerTwo().getCard(opposingTarget)?.damage).toBe(0);
  });
});
