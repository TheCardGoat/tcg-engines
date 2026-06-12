import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02Byarlant004 } from "./004-byarlant.ts";

describe("Byarlant (GD02-004)", () => {
  it("【When Paired】Choose 1 rested enemy Unit with 3 or less HP. It won't be set as active during the start phase of your opponent's next turn.", () => {
    const pilot = createMockPilot({ level: 3, cost: 1 });
    const enemy = createMockUnit({ ap: 2, hp: 3, level: 2 });

    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd02Byarlant004],
        resourceArea: activeResources(5),
        deck: 5,
      },
      { play: [enemy], deck: 5, resourceArea: activeResources(3) },
    );

    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    // Rest the enemy so it qualifies as a target.
    engine.getG().exhausted[enemyId] = true;

    // Pair the pilot — fires the whenPaired trigger.
    expectSuccess(p1.assignPilot(pilot, gd02Byarlant004));

    // Resolve target selection if the flow halted for it.
    if (engine.getPendingChoice()) {
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
    }

    // A prevent-active continuous effect should exist on the enemy unit.
    const preventEffects = engine
      .getG()
      .continuousEffects.filter(
        (e) =>
          e.targetId === enemyId &&
          e.payload.kind === "restriction" &&
          e.payload.restriction === "prevent-active",
      );
    expect(preventEffects).toHaveLength(1);

    // End P1's turn, which transitions to P2's turn.
    engine.endTurn();

    // After P2's start-phase active-step, the enemy unit should still be rested
    // because the prevent-active restriction blocked it from being set active.
    expect(engine.getG().exhausted[enemyId]).toBe(true);

    // The prevent-active restriction should have been cleaned up.
    const remainingPrevent = engine
      .getG()
      .continuousEffects.filter(
        (e) =>
          e.targetId === enemyId &&
          e.payload.kind === "restriction" &&
          e.payload.restriction === "prevent-active",
      );
    expect(remainingPrevent).toHaveLength(0);
  });
});
