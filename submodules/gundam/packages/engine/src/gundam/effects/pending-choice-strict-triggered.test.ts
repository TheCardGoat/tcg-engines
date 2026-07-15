/**
 * PR F.4 — rule 10-3-3 bounded target choices for triggered / burst effects.
 *
 * Triggered and Burst effects with a bounded "choose" filter halt for the
 * controller instead of silently choosing the first matching candidates.
 * Unbounded `count: "all"` effects still resolve without a prompt.
 */

import { describe, it, expect } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "../../index.ts";

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

function triggerUnit(effect: CardEffect) {
  return createMockUnit({ name: "Rest Trigger", cost: 0, effects: [effect] });
}

describe("Pending effects — bounded choices for triggered effects (PR F.4)", () => {
  it("lets the controller choose exactly 1 of 3 enemy Units", () => {
    const a = createMockUnit({ ap: 1, hp: 1 });
    const b = createMockUnit({ ap: 1, hp: 1 });
    const c = createMockUnit({ ap: 1, hp: 1 });
    const source = triggerUnit(restOneEnemyEffect);
    const engine = GundamTestEngine.create(
      { hand: [source], resourceArea: activeResources(1) },
      { play: [a, b, c] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getHand()[0]!;
    const enemyIds = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(sourceId));

    const choice = p1.getBoardView().pendingChoice;
    expect(choice?.kind).toBe("targetSelection");
    if (choice?.kind !== "targetSelection") return;
    expect(choice.minTargets).toBe(1);
    expect(choice.maxTargets).toBe(1);
    expect(choice.legalTargetIds).toEqual(enemyIds);

    expectSuccess(p1.resolveEffect({ targets: [enemyIds[2]!] }));

    expect(p2.isExhausted(enemyIds[0]!)).toBe(false);
    expect(p2.isExhausted(enemyIds[1]!)).toBe(false);
    expect(p2.isExhausted(enemyIds[2]!)).toBe(true);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("lets the controller choose exactly 2 of 3 enemy Units", () => {
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
    const source = triggerUnit(restTwo);
    const engine = GundamTestEngine.create(
      { hand: [source], resourceArea: activeResources(1) },
      { play: [a, b, c] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getHand()[0]!;
    const enemyIds = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(sourceId));

    const choice = p1.getBoardView().pendingChoice;
    expect(choice?.kind).toBe("targetSelection");
    if (choice?.kind !== "targetSelection") return;
    expect(choice.minTargets).toBe(2);
    expect(choice.maxTargets).toBe(2);

    expectSuccess(p1.resolveEffect({ targets: [enemyIds[0]!, enemyIds[2]!] }));

    expect(p2.isExhausted(enemyIds[0]!)).toBe(true);
    expect(p2.isExhausted(enemyIds[1]!)).toBe(false);
    expect(p2.isExhausted(enemyIds[2]!)).toBe(true);
  });

  it("lets the controller choose within a ranged count", () => {
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
    const source = triggerUnit(restRange);
    const engine = GundamTestEngine.create(
      { hand: [source], resourceArea: activeResources(1) },
      { play: [a, b, c] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getHand()[0]!;
    const enemyIds = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(sourceId));

    const choice = p1.getBoardView().pendingChoice;
    expect(choice?.kind).toBe("targetSelection");
    if (choice?.kind !== "targetSelection") return;
    expect(choice.minTargets).toBe(1);
    expect(choice.maxTargets).toBe(2);

    expectSuccess(p1.resolveEffect({ targets: [enemyIds[1]!] }));

    expect(p2.isExhausted(enemyIds[0]!)).toBe(false);
    expect(p2.isExhausted(enemyIds[1]!)).toBe(true);
    expect(p2.isExhausted(enemyIds[2]!)).toBe(false);
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
    const source = triggerUnit(restAll);
    const engine = GundamTestEngine.create(
      { hand: [source], resourceArea: activeResources(1) },
      { play: [a, b] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getHand()[0]!;
    const enemyIds = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(sourceId));

    expect(p2.isExhausted(enemyIds[0]!)).toBe(true);
    expect(p2.isExhausted(enemyIds[1]!)).toBe(true);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });
});
