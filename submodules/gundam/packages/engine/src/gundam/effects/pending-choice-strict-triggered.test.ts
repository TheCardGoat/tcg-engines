/**
 * PR F.4 — rule 10-3-3 deterministic count-clamping for triggered / burst.
 *
 * Pre-F.4, triggered and burst effects with a counted target filter
 * (e.g. "Choose 1 enemy Unit") silently applied to *every* matching
 * candidate when the executor was given no chosenTargets. F.4 honours
 * the filter's `count` by slicing the candidate list to the first N
 * candidates in enumeration order.
 *
 * Activated / command continue to halt for player input via
 * requiresPlayerChoice (F.1+F.2). The halt path is exercised in
 * pending-choice-validation.test.ts; this file covers the trigger /
 * burst auto-pick path.
 */

import { describe, it, expect } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import { GundamTestEngine, PLAYER_ONE, PLAYER_TWO, createMockUnit } from "../../index.ts";
import type { PendingEffect } from "../types.ts";
const restOneEnemyEffect: CardEffect = {
  type: "triggered",
  activation: { timing: ["deploy"] },
  directives: [
    {
      action: {
        action: "rest",
        target: { owner: "opponent", cardType: "unit", count: 1 },
      },
    },
  ],
  sourceText: "【Deploy】 Rest 1 enemy unit.",
};

let peIdCounter = 0;
function makeTrigger(controllerId: string): PendingEffect {
  return {
    id: `pe_strict_${++peIdCounter}`,
    sourceCardId: "src",
    effectIndex: 0,
    kind: "triggered",
    controllerId,
    effect: restOneEnemyEffect,
  };
}

describe("Pending effects — count-clamping for triggered effects (PR F.4)", () => {
  it("rests exactly 1 enemy unit (not all) when count: 1 and 3 enemies exist", () => {
    const a = createMockUnit({ ap: 1, hp: 1 });
    const b = createMockUnit({ ap: 1, hp: 1 });
    const c = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({}, { play: [a, b, c] });
    engine.getG().pendingEffects.push(makeTrigger(PLAYER_ONE));

    // Drain via a real flow tick — runs resolveFlowTransitions which
    // hits onTransitionCheck = drainPendingEffects.
    engine.tickFlow(PLAYER_ONE);

    const enemyIds = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");
    const exhaustedCount = enemyIds.filter((id) => engine.getG().exhausted[id]).length;
    expect(exhaustedCount).toBe(1);
    expect(engine.getG().pendingEffects).toHaveLength(0);
  });

  it("respects count: 2 — rests exactly 2 of 3 enemies", () => {
    const restTwo: CardEffect = {
      ...restOneEnemyEffect,
      directives: [
        {
          action: {
            action: "rest",
            target: { owner: "opponent", cardType: "unit", count: 2 },
          },
        },
      ],
    };
    const a = createMockUnit({ ap: 1, hp: 1 });
    const b = createMockUnit({ ap: 1, hp: 1 });
    const c = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({}, { play: [a, b, c] });
    engine.getG().pendingEffects.push({ ...makeTrigger(PLAYER_ONE), effect: restTwo });
    engine.tickFlow(PLAYER_ONE);

    const enemyIds = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");
    const exhaustedCount = enemyIds.filter((id) => engine.getG().exhausted[id]).length;
    expect(exhaustedCount).toBe(2);
  });

  it("respects ranged count: { min:1, max:2 } — clamps to max", () => {
    const restRange: CardEffect = {
      ...restOneEnemyEffect,
      directives: [
        {
          action: {
            action: "rest",
            target: { owner: "opponent", cardType: "unit", count: { min: 1, max: 2 } },
          },
        },
      ],
    };
    const a = createMockUnit({ ap: 1, hp: 1 });
    const b = createMockUnit({ ap: 1, hp: 1 });
    const c = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({}, { play: [a, b, c] });
    engine.getG().pendingEffects.push({ ...makeTrigger(PLAYER_ONE), effect: restRange });
    engine.tickFlow(PLAYER_ONE);

    const enemyIds = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");
    const exhaustedCount = enemyIds.filter((id) => engine.getG().exhausted[id]).length;
    expect(exhaustedCount).toBe(2);
  });

  it("count: 'all' still rests every matching candidate", () => {
    const restAll: CardEffect = {
      ...restOneEnemyEffect,
      directives: [
        {
          action: {
            action: "rest",
            target: { owner: "opponent", cardType: "unit", count: "all" },
          },
        },
      ],
    };
    const a = createMockUnit({ ap: 1, hp: 1 });
    const b = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({}, { play: [a, b] });
    engine.getG().pendingEffects.push({ ...makeTrigger(PLAYER_ONE), effect: restAll });
    engine.tickFlow(PLAYER_ONE);

    const enemyIds = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");
    const exhaustedCount = enemyIds.filter((id) => engine.getG().exhausted[id]).length;
    expect(exhaustedCount).toBe(2);
  });
});
