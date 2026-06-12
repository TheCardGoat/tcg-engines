import { describe, expect, it } from "bun:test";
import { underTheSea } from "@tcg/lorcana-cards/cards/009";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";

const playerOneWeakA = createMockCharacter({
  id: "under-the-sea-player-one-weak-a",
  name: "Player One Weak A",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
});

const playerOneWeakB = createMockCharacter({
  id: "under-the-sea-player-one-weak-b",
  name: "Player One Weak B",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const playerTwoWeakA = createMockCharacter({
  id: "under-the-sea-player-two-weak-a",
  name: "Player Two Weak A",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
});

const playerTwoWeakB = createMockCharacter({
  id: "under-the-sea-player-two-weak-b",
  name: "Player Two Weak B",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

function resolveAutomationWindowWithoutConceding(engine: LorcanaMultiplayerTestEngine): void {
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

describe("Under the Sea automation", () => {
  it("lets both players resolve Under the Sea without the AI conceding", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [underTheSea],
        inkwell: underTheSea.cost,
        play: [playerOneWeakA, playerOneWeakB],
      },
      {
        hand: [underTheSea],
        inkwell: underTheSea.cost,
        play: [playerTwoWeakA, playerTwoWeakB],
      },
    );

    expect(testEngine.asPlayerOne().playCard(underTheSea)).toBeSuccessfulCommand();
    resolveAutomationWindowWithoutConceding(testEngine);
    expect(testEngine.asPlayerTwo().getCardZone(playerTwoWeakA)).toBe("deck");
    expect(testEngine.asPlayerTwo().getCardZone(playerTwoWeakB)).toBe("deck");

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().playCard(underTheSea)).toBeSuccessfulCommand();
    resolveAutomationWindowWithoutConceding(testEngine);
    expect(testEngine.asPlayerOne().getCardZone(playerOneWeakA)).toBe("deck");
    expect(testEngine.asPlayerOne().getCardZone(playerOneWeakB)).toBe("deck");
    expect(testEngine.asServer().isGameOver()).toBe(false);
  });
});
