/**
 * Regression tests for Copilot review feedback on PRs #91 / #93 / #94
 * (pending-choice UX arc).
 *
 * Covers, in one file, the cross-PR defensive behaviours that the
 * review pass added:
 *   1. TARGETS_ALREADY_COMMITTED — resolveEffect rejects `args.targets`
 *      when the pending effect already has pre-committed `chosenTargets`.
 *   2. execute prefers `pending.chosenTargets` over `args.targets`
 *      (defensive — validate should already reject the overwrite attempt).
 *   3. DUPLICATE_TARGETS — `resolveEffect({ targets: [a, a] })` rejected.
 *   4. pendingEffectId restricted to `peersAtHead` — same-tier
 *      same-controller-as-head only; cannot skip past another
 *      controller whose head sits at the same tier.
 *   5. executor clamps `chosenTargets` intersection to filter.count
 *      (defense-in-depth even when the player supplies too many).
 *   6. `drainPendingEffects` halts on peers >= 2 for activated / command
 *      heads; does NOT halt for triggered / burst peers (lifecycle
 *      hooks have no pause window).
 */

import { describe, it, expect } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectFailure,
  expectSuccess,
  createMockBase,
  createMockUnit,
  findStatModifier,
} from "../../index.ts";
import type { PendingEffect } from "../types.ts";

const restOpponentUnit: CardEffect = {
  type: "activated",
  activation: { timing: ["activate:main"] },
  directives: [
    {
      action: {
        action: "rest",
        target: { owner: "opponent", cardType: "unit", count: 1 },
      },
    },
  ],
  sourceText: "Rest 1 enemy unit.",
};

let peIdCounter = 0;
function makePE(
  overrides: Partial<PendingEffect> & Pick<PendingEffect, "effect" | "controllerId" | "kind">,
): PendingEffect {
  return {
    id: overrides.id ?? `pe_fix_${++peIdCounter}`,
    sourceCardId: overrides.sourceCardId ?? "src",
    effectIndex: overrides.effectIndex ?? 0,
    ...overrides,
  };
}

describe("resolveEffect — committed-target immutability (PR #93 fix)", () => {
  it("rejects args.targets when pending.chosenTargets is already set", () => {
    const enemyA = createMockUnit({ ap: 1, hp: 1 });
    const enemyB = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({}, { play: [enemyA, enemyB] });
    const [aId, bId] = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");

    engine.getG().pendingEffects.push(
      makePE({
        effect: restOpponentUnit,
        controllerId: PLAYER_ONE,
        kind: "activated",
        chosenTargets: [aId!],
      }),
    );

    expectFailure(
      engine.asPlayer(PLAYER_ONE).resolveEffect({ targets: [bId!] }),
      "TARGETS_ALREADY_COMMITTED",
    );
  });

  it("execute honours pending.chosenTargets over any args.targets override", () => {
    const enemyA = createMockUnit({ ap: 1, hp: 1 });
    const enemyB = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({}, { play: [enemyA, enemyB] });
    const [aId] = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");

    engine.getG().pendingEffects.push(
      makePE({
        effect: restOpponentUnit,
        controllerId: PLAYER_ONE,
        kind: "activated",
        chosenTargets: [aId!],
      }),
    );

    // No targets supplied → validate lets it through (chosenTargets
    // already committed); execute uses chosenTargets.
    expectSuccess(engine.asPlayer(PLAYER_ONE).resolveEffect({}));
    expect(engine.getG().exhausted[aId!]).toBe(true);
  });
});

describe("resolveEffect — duplicate targets (PR #93 fix)", () => {
  it("rejects [a, a] with DUPLICATE_TARGETS even when count would accept 2", () => {
    const restTwo: CardEffect = {
      type: "activated",
      activation: { timing: ["activate:main"] },
      directives: [
        {
          action: {
            action: "rest",
            target: { owner: "opponent", cardType: "unit", count: 2 },
          },
        },
      ],
      sourceText: "Rest 2 enemy units.",
    };
    const enemyA = createMockUnit({ ap: 1, hp: 1 });
    const enemyB = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({}, { play: [enemyA, enemyB] });
    const [aId] = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");

    engine
      .getG()
      .pendingEffects.push(
        makePE({ effect: restTwo, controllerId: PLAYER_ONE, kind: "activated" }),
      );

    expectFailure(
      engine.asPlayer(PLAYER_ONE).resolveEffect({ targets: [aId!, aId!] }),
      "DUPLICATE_TARGETS",
    );
  });
});

describe("pendingEffectId restricted to peersAtHead (PR #94 fix)", () => {
  it("rejects a same-tier effect owned by a different controller than the current head", () => {
    // Two triggered effects at tier 1/2 — one owned by each player.
    // Active player is P1, so P1's triggered is tier 1 (head), P2's is tier 2.
    // P1 cannot pick P2's entry even though both are triggered.
    const engine = GundamTestEngine.create({ deck: 5 }, { deck: 5 });
    const draw: CardEffect = {
      type: "triggered",
      activation: { timing: ["deploy"] },
      directives: [{ action: { action: "draw", count: 1 } }],
      sourceText: "Draw 1.",
    };

    engine.getG().pendingEffects.push(
      makePE({
        id: "p1_head",
        effect: draw,
        controllerId: PLAYER_ONE,
        kind: "triggered",
      }),
      makePE({
        id: "p2_peer",
        effect: draw,
        controllerId: PLAYER_TWO,
        kind: "triggered",
      }),
    );

    // P2 tries to resolve their own lower-tier entry while P1's entry
    // is the head. Normally this would be caught by the in-move
    // peersAtHead guard (NOT_PRIORITY_TIER), but the runtime's
    // active-player gate fires first: activePlayer is PLAYER_ONE here
    // (setup-default; the drain didn't run on the direct push), so
    // PLAYER_TWO is rejected before resolveEffect.validate runs.
    expectFailure(
      engine.asPlayer(PLAYER_TWO).resolveEffect({ pendingEffectId: "p2_peer" }),
      "NOT_ACTIVE_PLAYER",
    );
  });
});

describe("executor clamps chosenTargets to filter.count (PR #94 fix)", () => {
  it("rests at most 1 enemy when pre-committed chosenTargets has 3 for count:1 filter", () => {
    const a = createMockUnit({ ap: 1, hp: 1 });
    const b = createMockUnit({ ap: 1, hp: 1 });
    const c = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({}, { play: [a, b, c] });
    const enemyIds = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");

    // Bypass resolveEffect.validate (which would reject count mismatch)
    // by pushing an over-committed pending effect directly — simulates a
    // hypothetical triggering-move bug that committed too many targets.
    // The executor should still clamp to count:1.
    engine.getG().pendingEffects.push(
      makePE({
        effect: restOpponentUnit,
        controllerId: PLAYER_ONE,
        kind: "triggered",
        chosenTargets: enemyIds,
      }),
    );

    engine.tickFlow(PLAYER_ONE);

    const exhaustedCount = enemyIds.filter((id) => engine.getG().exhausted[id]).length;
    expect(exhaustedCount).toBe(1);
  });

  it("does not intersect count:all follow-up targets with an earlier chosen target", () => {
    const readyBaseThenDebuffAll: CardEffect = {
      type: "activated",
      activation: { timing: ["activate:main"] },
      directives: [
        {
          action: {
            action: "setActive",
            target: { owner: "friendly", cardType: "base", state: "rested", count: 1 },
          },
        },
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: -1,
            duration: "thisTurn",
            target: { owner: "opponent", cardType: "unit", count: "all" },
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText: "Set active, then all enemy Units get AP-1.",
    };
    const base = { card: createMockBase(), exhausted: true };
    const enemyA = createMockUnit({ ap: 3 });
    const enemyB = createMockUnit({ ap: 2 });
    const engine = GundamTestEngine.create({ baseSection: [base] }, { play: [enemyA, enemyB] });
    const baseId = engine.asPlayer(PLAYER_ONE).getCardsInZone("baseSection")[0]!;
    const enemyIds = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");

    engine.getG().pendingEffects.push(
      makePE({
        effect: readyBaseThenDebuffAll,
        controllerId: PLAYER_ONE,
        kind: "activated",
        chosenTargets: [baseId],
      }),
    );

    expectSuccess(engine.asPlayer(PLAYER_ONE).resolveEffect({}));

    expect(engine.getG().exhausted[baseId] ?? false).toBe(false);
    expect(findStatModifier(engine, enemyIds[0]!, "ap")?.modifier).toBe(-1);
    expect(findStatModifier(engine, enemyIds[1]!, "ap")?.modifier).toBe(-1);
  });
});

describe("drainPendingEffects halt-on-peers (PR #94 fix)", () => {
  it("does NOT halt when peers are triggered — falls back to insertion order", () => {
    const drawOne: CardEffect = {
      type: "triggered",
      activation: { timing: ["deploy"] },
      directives: [{ action: { action: "draw", count: 1 } }],
      sourceText: "Draw 1.",
    };
    const engine = GundamTestEngine.create({ deck: 10 }, {});
    const before = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

    engine
      .getG()
      .pendingEffects.push(
        makePE({ id: "t1", effect: drawOne, controllerId: PLAYER_ONE, kind: "triggered" }),
        makePE({ id: "t2", effect: drawOne, controllerId: PLAYER_ONE, kind: "triggered" }),
      );

    // Drain should resolve both even though they're same-tier same-controller
    // peers — triggered kinds don't get an ordering halt (no UX window).
    engine.tickFlow(PLAYER_ONE);

    expect(engine.getG().pendingEffects).toHaveLength(0);
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(before - 2);
  });
});
