import { describe, expect, it } from "bun:test";
import { julietaMadrigalExcellentCook } from "@tcg/lorcana-cards/cards/004";
import { pocahontasMeekoAdventurousFriends } from "@tcg/lorcana-cards/cards/013";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";

const costOneInPlay = createMockCharacter({
  id: "nested-opt-cost-one-play",
  name: "Cost One In Play",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
});

const costOneInHand = createMockCharacter({
  id: "nested-opt-cost-one-hand",
  name: "Cost One In Hand",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
});

const woundedAlly = createMockCharacter({
  id: "nested-opt-wounded-ally",
  name: "Wounded Ally",
  cost: 2,
  willpower: 5,
});

/**
 * Drain bag/pending resolution windows with the bot without allowing concede.
 * Shared pattern with under-the-sea-automation for multi-may / multi-step peels.
 */
function resolveAutomationWindowWithoutConceding(engine: LorcanaMultiplayerTestEngine): void {
  const initial = engine.asServer().getState();
  const hasInitialResolutionWindow =
    (initial.G.triggeredAbilities?.bag.items.length ?? 0) > 0 ||
    initial.G.pendingEffects.length > 0;

  if (!hasInitialResolutionWindow) {
    expect(engine.asServer().isGameOver()).toBe(false);
    return;
  }

  let sawResolutionWindow = false;
  const maxSteps = 8;

  for (let step = 0; step < maxSteps && !engine.asServer().isGameOver(); step += 1) {
    const before = engine.asServer().getState();
    const hadResolutionWindow =
      (before.G.triggeredAbilities?.bag.items.length ?? 0) > 0 ||
      before.G.pendingEffects.length > 0;

    const result = engine.asServer().takeAutomatedActionForCurrentActor();

    if (hadResolutionWindow) {
      sawResolutionWindow = true;
      expect(result.fallbackTaken).not.toBe("concede");
      expect(result.finalResult.success).toBe(true);
    }

    const after = engine.asServer().getState();
    const hasResolutionWindow =
      (after.G.triggeredAbilities?.bag.items.length ?? 0) > 0 || after.G.pendingEffects.length > 0;

    if (sawResolutionWindow && !hasResolutionWindow) {
      break;
    }
  }

  expect(sawResolutionWindow).toBe(true);
  expect(engine.asPlayerOne().getBagCount()).toBe(0);
  expect(engine.asServer().getState().G.pendingEffects).toHaveLength(0);
  expect(engine.asServer().isGameOver()).toBe(false);
}

describe("nested optional automation", () => {
  it("drains Pocahontas & Meeko WELCOME RETURN without the AI conceding", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: pocahontasMeekoAdventurousFriends, isDrying: false },
        { card: costOneInPlay, isDrying: false },
      ],
      hand: [costOneInHand],
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().quest(pocahontasMeekoAdventurousFriends),
    ).toBeSuccessfulCommand();
    resolveAutomationWindowWithoutConceding(testEngine);
  });

  it("drains Julieta SIGNATURE RECIPE double-may without the AI conceding", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [julietaMadrigalExcellentCook],
      inkwell: julietaMadrigalExcellentCook.cost,
      play: [{ card: woundedAlly, damage: 2 }],
      deck: 3,
    });

    expect(testEngine.asPlayerOne().playCard(julietaMadrigalExcellentCook)).toBeSuccessfulCommand();
    resolveAutomationWindowWithoutConceding(testEngine);
  });
});
