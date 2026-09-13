import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { pocahontasMeekoAdventurousFriends } from "./027-pocahontas-meeko-adventurous-friends";

const pocahontasShiftBase = createMockCharacter({
  id: "pocahontas-meeko-shift-base",
  name: "Pocahontas",
  cost: 2,
});

const costOneInPlay = createMockCharacter({
  id: "pocahontas-meeko-cost-one-in-play",
  name: "Cost One In Play",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
});

const costOneInHand = createMockCharacter({
  id: "pocahontas-meeko-cost-one-in-hand",
  name: "Cost One In Hand",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
});

/**
 * WELCOME RETURN is structured as nested optionals (outer may-return + if-you-do
 * may-play). The engine peels these sequentially; the bot planner must plan only
 * the immediate decision surface so it does not deadlock into concede.
 */
function resolveAutomationWindowWithoutConceding(
  testEngine: LorcanaMultiplayerTestEngine,
  maxSteps = 8,
): void {
  let sawResolutionWindow = false;

  for (let step = 0; step < maxSteps && !testEngine.asServer().isGameOver(); step += 1) {
    const before = testEngine.asServer().getState();
    const hadResolutionWindow =
      (before.G.triggeredAbilities?.bag.items.length ?? 0) > 0 ||
      before.G.pendingEffects.length > 0;

    const result = testEngine.asServer().takeAutomatedActionForCurrentActor();

    if (hadResolutionWindow) {
      sawResolutionWindow = true;
      expect(result.fallbackTaken).not.toBe("concede");
      expect(result.finalResult.success).toBe(true);
    }

    const after = testEngine.asServer().getState();
    const hasResolutionWindow =
      (after.G.triggeredAbilities?.bag.items.length ?? 0) > 0 || after.G.pendingEffects.length > 0;

    if (sawResolutionWindow && !hasResolutionWindow) {
      break;
    }
  }

  expect(sawResolutionWindow).toBe(true);
  expect(testEngine.asServer().getState().G.triggeredAbilities.bag.items ?? []).toHaveLength(0);
  expect(testEngine.asServer().getState().G.pendingEffects).toHaveLength(0);
  expect(testEngine.asServer().isGameOver()).toBe(false);
}

describe("Pocahontas & Meeko - Adventurous Friends", () => {
  it("can shift onto a character named Pocahontas and has Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [pocahontasMeekoAdventurousFriends],
      play: [pocahontasShiftBase],
      inkwell: 2,
    });
    const shiftTarget = testEngine.findCardInstanceId(pocahontasShiftBase, "play", "player_one");

    expect(
      testEngine.asPlayerOne().playCard(pocahontasMeekoAdventurousFriends, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(pocahontasMeekoAdventurousFriends)).toBe("play");
    expect(testEngine.asPlayerOne().hasKeyword(pocahontasMeekoAdventurousFriends, "Evasive")).toBe(
      true,
    );
  });

  it("may return your cost 1 character and then play a cost 1 character for free", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [pocahontasMeekoAdventurousFriends, costOneInPlay],
      hand: [costOneInHand],
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().quest(pocahontasMeekoAdventurousFriends),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(
      pocahontasMeekoAdventurousFriends.lore,
    );
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(pocahontasMeekoAdventurousFriends, {
        resolveOptional: true,
        targets: [costOneInPlay],
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(pocahontasMeekoAdventurousFriends, {
        resolveOptional: true,
        targets: [costOneInHand],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(costOneInPlay)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(costOneInHand)).toBe("play");
  });

  it("bot enumerates WELCOME RETURN via the immediate outer may (nested optionals peel later)", () => {
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

    const bagItems = testEngine.asServer().getState().G.triggeredAbilities.bag.items ?? [];
    expect(bagItems).toHaveLength(1);
    expect(bagItems[0]).toMatchObject({
      abilityName: "WELCOME RETURN",
      effect: { type: "optional" },
    });

    const costOneInPlayId = testEngine.findCardInstanceId(costOneInPlay, "play", "player_one");
    const enumeration = testEngine.asPlayerOne().enumerateAutomatedActions();
    const resolveBagCandidates = enumeration.candidates.filter(
      (candidate) => candidate.family === "resolveBag",
    );
    const nestedBranchingSkips = enumeration.unsupportedSkips.filter(
      (diagnostic) =>
        diagnostic.kind === "unsupported-shape" &&
        diagnostic.family === "resolveBag" &&
        diagnostic.reason === "Nested branching exceeds the v1 automation support matrix",
    );

    expect(nestedBranchingSkips).toHaveLength(0);
    expect(resolveBagCandidates.length).toBeGreaterThan(0);
    expect(resolveBagCandidates).toContainEqual(
      expect.objectContaining({
        family: "resolveBag",
        bagId: bagItems[0]?.id,
        resolveOptional: false,
      }),
    );
    expect(resolveBagCandidates).toContainEqual(
      expect.objectContaining({
        family: "resolveBag",
        bagId: bagItems[0]?.id,
        resolveOptional: true,
        targets: [costOneInPlayId],
      }),
    );
  });

  it("bot drains WELCOME RETURN nested mays without conceding", () => {
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

    // Strategy may accept or decline either may; either path must finish cleanly.
    // When both are accepted, cost-1 board bounce + free play completes.
    const costOneInPlayZone = testEngine.asPlayerOne().getCardZone(costOneInPlay);
    const costOneInHandZone = testEngine.asPlayerOne().getCardZone(costOneInHand);
    const acceptedReturn = costOneInPlayZone === "hand";
    const acceptedFreePlay = costOneInHandZone === "play";
    if (acceptedReturn && acceptedFreePlay) {
      expect(costOneInPlayZone).toBe("hand");
      expect(costOneInHandZone).toBe("play");
    } else {
      // Declined outer may leaves board unchanged; declined free-play after return
      // leaves bounced card in hand and original hand card unplayed.
      expect(costOneInPlayZone === "play" || costOneInPlayZone === "hand").toBe(true);
      expect(costOneInHandZone === "play" || costOneInHandZone === "hand").toBe(true);
    }
  });
});
