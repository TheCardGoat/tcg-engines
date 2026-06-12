/**
 * activate-ability — regression coverage for the pending-effects
 * migration (PR C).
 *
 * Two shapes exercised:
 *  - Auto-drain: an activated effect with no targets (or with
 *    pre-committed targets) flows through g.pendingEffects and
 *    resolves via the flow engine's onTransitionCheck drain without
 *    a separate resolveEffect call.
 *  - Halt: an activated effect whose directives carry an opponent-
 *    target filter with no targets pre-committed halts the queue
 *    until the controller submits resolveEffect({ targets }).
 */

import { describe, it, expect } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  createMockUnit,
  createMockResource,
} from "../../../index.ts";
import type { TestCardEntry } from "../../../index.ts";

function active(card: ReturnType<typeof createMockResource>): TestCardEntry {
  return { card, exhausted: false };
}
function resources(count: number): TestCardEntry[] {
  return Array.from({ length: count }, () => active(createMockResource()));
}

describe("activate-ability — queue migration (PR C)", () => {
  it("auto-drains an activated effect with no targets", () => {
    // Rest the unit to draw 1.
    const restToDraw: CardEffect = {
      type: "activated",
      activation: { timing: ["activate:main"] },
      cost: { restSelf: true },
      directives: [{ action: { action: "draw", count: 1 } }],
      sourceText: "【Activate･Main】 Rest this Unit: Draw 1.",
    };
    const unit = createMockUnit({ ap: 1, hp: 1, effects: [restToDraw] });

    const engine = GundamTestEngine.create(
      { play: [unit], resourceArea: resources(3), deck: 5 },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

    expectSuccess(p1.activateAbility(unit, 0, {}));

    // Cost paid immediately: unit rested.
    expect(engine.getG().exhausted[unitId]).toBe(true);
    // Effect drained automatically: deck −1, queue empty.
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore - 1);
    expect(engine.getG().pendingEffects).toHaveLength(0);
  });

  it("halts on an activated effect requiring target selection, resumes via resolveEffect", () => {
    // Rest the unit to rest an enemy unit. Targets required, none pre-committed.
    const restEnemy: CardEffect = {
      type: "activated",
      activation: { timing: ["activate:main"] },
      cost: { restSelf: true },
      directives: [
        {
          action: {
            action: "rest",
            target: { owner: "opponent", cardType: "unit", count: 1 },
          },
        },
      ],
      sourceText: "【Activate･Main】 Rest this Unit: Rest 1 enemy Unit.",
    };
    const unit = createMockUnit({ ap: 1, hp: 1, effects: [restEnemy] });
    const enemy = createMockUnit({ ap: 1, hp: 1 });

    const engine = GundamTestEngine.create(
      { play: [unit], resourceArea: resources(3) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    // Activate without supplying targets — effect enqueues, cost paid.
    expectSuccess(p1.activateAbility(unit, 0, {}));

    expect(engine.getG().exhausted[unitId]).toBe(true);
    expect(engine.getG().pendingEffects).toHaveLength(1);
    expect(engine.getG().pendingEffects[0]!.kind).toBe("activated");
    // Enemy not yet affected — effect is halted waiting for a choice.
    expect(engine.getG().exhausted[enemyId] ?? false).toBe(false);

    // Controller submits the target.
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(engine.getG().pendingEffects).toHaveLength(0);
    expect(engine.getG().exhausted[enemyId]).toBe(true);
  });

  it("forwards chosenTargets into statModifier directive (only picked target is buffed)", () => {
    // "Choose 1 friendly Unit. It gets AP+2 during this turn." — with two
    // legal friendlies in play the activate caller's `targets` must
    // decide which one receives the buff. Pre-fix, statModifier read
    // every filter match and buffed both.
    const buffOne: CardEffect = {
      type: "activated",
      activation: { timing: ["activate:main"] },
      cost: { restSelf: true },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 2,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              zone: "battleArea",
              count: 1,
              excludeSource: true,
            },
          },
        },
      ],
      sourceText: "【Activate･Main】 Choose 1 friendly Unit. It gets AP+2.",
    };
    const source = createMockUnit({ ap: 1, hp: 1, effects: [buffOne] });
    const ally1 = createMockUnit({ ap: 3, hp: 3 });
    const ally2 = createMockUnit({ ap: 3, hp: 3 });

    const engine = GundamTestEngine.create(
      { play: [source, ally1, ally2], resourceArea: resources(3) },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [_sourceId, ally1Id, ally2Id] = p1.getCardsInZone("battleArea");
    if (!ally1Id || !ally2Id) throw new Error("setup failed");

    expectSuccess(p1.activateAbility(source, 0, { targets: [ally1Id] }));

    const buffs = engine
      .getG()
      .continuousEffects.filter(
        (e) => e.payload.kind === "stat-modifier" && e.payload.stat === "ap",
      );
    // Exactly one buff; bound to the chosen ally (ally1), not ally2.
    expect(buffs).toHaveLength(1);
    expect(buffs[0]!.targetId).toBe(ally1Id);
    expect(buffs.find((e) => e.targetId === ally2Id)).toBeUndefined();
  });

  it("pre-committed targets auto-drain without a resolveEffect call", () => {
    const restEnemy: CardEffect = {
      type: "activated",
      activation: { timing: ["activate:main"] },
      cost: { restSelf: true },
      directives: [
        {
          action: {
            action: "rest",
            target: { owner: "opponent", cardType: "unit", count: 1 },
          },
        },
      ],
      sourceText: "【Activate･Main】 Rest this Unit: Rest 1 enemy Unit.",
    };
    const unit = createMockUnit({ ap: 1, hp: 1, effects: [restEnemy] });
    const enemy = createMockUnit({ ap: 1, hp: 1 });

    const engine = GundamTestEngine.create(
      { play: [unit], resourceArea: resources(3) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.activateAbility(unit, 0, { targets: [enemyId] }));

    // No queue entry left — the effect resolved on the next flow pass.
    expect(engine.getG().pendingEffects).toHaveLength(0);
    expect(engine.getG().exhausted[enemyId]).toBe(true);
  });

  // Locks in the EX-last rule (5-17-3-2-3) for activated-ability `payResources`
  // costs — a path that previously short-circuited through an inline call and
  // now goes through the centralized `payCost`.
  it("activated-ability payResources cost prefers regular resources over EX tokens", () => {
    const drawEffect: CardEffect = {
      type: "activated",
      activation: { timing: ["activate:main"] },
      cost: { payResources: 1 },
      directives: [{ action: { action: "draw", count: 1 } }],
      sourceText: "【Activate･Main】 ①: Draw 1.",
    };
    const unit = createMockUnit({ ap: 1, hp: 1, effects: [drawEffect] });
    const regular = createMockResource();
    const exToken = createMockResource();

    const engine = GundamTestEngine.create(
      { play: [unit], resourceArea: [active(regular), active(exToken)], deck: 5 },
      {},
    );

    const state = engine.getState();
    const resourceIds = engine.getCardsInZone({ zone: "resourceArea", playerId: PLAYER_ONE });
    const regularId = resourceIds[0]!;
    const exId = resourceIds[1]!;
    state.ctx.zones.private.cardMeta[exId] = { isToken: true };

    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.activateAbility(unit, 0, {}));

    // Regular resource exhausted; EX token untouched and still in zone.
    expect(engine.getG().exhausted[regularId]).toBe(true);
    expect(engine.getCardsInZone({ zone: "resourceArea", playerId: PLAYER_ONE })).toContain(exId);
    expect(engine.getCardsInZone({ zone: "removalArea" })).toHaveLength(0);
  });

  // EffectCost.destroySelf — printed "Destroy this Unit：" costs
  // (GD02-011 Moebius Peacemaker Team). Paid up-front in `payCost`:
  // the source card leaves play for the owner's trash before the
  // directive body runs.
  it("activated-ability destroySelf cost sends the source card to its owner's trash", () => {
    const drawThenDie: CardEffect = {
      type: "activated",
      activation: { timing: ["activate:main"] },
      cost: { destroySelf: true },
      directives: [{ action: { action: "draw", count: 1 } }],
      sourceText: "【Activate･Main】 Destroy this Unit: Draw 1.",
    };
    const unit = createMockUnit({ ap: 1, hp: 1, effects: [drawThenDie] });

    const engine = GundamTestEngine.create({ play: [unit], deck: 5 }, {});
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

    expectSuccess(p1.activateAbility(unit, 0, {}));

    // Cost paid: source moved to its owner's trash, not still in battleArea.
    expect(engine.getCardsInZone({ zone: "battleArea", playerId: PLAYER_ONE })).not.toContain(
      unitId,
    );
    expect(engine.getCardsInZone({ zone: "trash", playerId: PLAYER_ONE })).toContain(unitId);
    // Effect body still ran after cost payment — draw 1 happened.
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore - 1);
    expect(engine.getG().pendingEffects).toHaveLength(0);
  });
});
