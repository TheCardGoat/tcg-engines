/**
 * `PendingEffect.originatingMoveId` propagation.
 *
 * The move that enqueues a triggered/activated/command effect stamps
 * the resulting PendingEffect with its `commandID`. Cascading rule
 * 10-1-6-7 preempts (new triggers spawned during another effect's
 * resolution) inherit the same id through `g.pendingEffectCurrentMoveId`.
 *
 * Verified end-to-end: explicit stamp via `enqueuePendingEffect`,
 * inheritance from the ambient `pendingEffectCurrentMoveId`, and
 * surfacing on the `gundam.pending.resolved` log values.
 */

import { describe, it, expect } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  createMockUnit,
} from "../../index.ts";
import { enqueuePendingEffect, nextPendingEffectId } from "./pending-effects.ts";
import type { GundamG } from "../types.ts";

const restOpponentUnitEffect: CardEffect = {
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

describe("PendingEffect.originatingMoveId propagation", () => {
  it("stamps explicit `originatingMoveId` via enqueuePendingEffect", () => {
    const myUnit = createMockUnit({ ap: 1, hp: 1 });
    const enemy = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({ play: [myUnit] }, { play: [enemy] });
    const moveId = "test-move-42";

    engine.runtime.runTestMutation(PLAYER_ONE as never, ({ G, framework }) => {
      enqueuePendingEffect(
        G as never as GundamG,
        {
          id: nextPendingEffectId(G as never as GundamG),
          controllerId: PLAYER_ONE,
          sourceCardId: "fake",
          effect: restOpponentUnitEffect,
          effectIndex: 0,
          kind: "activated",
          originatingMoveId: moveId,
        },
        framework,
      );
    });

    // Halting activated effect — queue still populated after the drain.
    const pending = engine.getG().pendingEffects;
    expect(pending).toHaveLength(1);
    expect(pending[0]!.originatingMoveId).toBe(moveId);
  });

  it("inherits originatingMoveId from g.pendingEffectCurrentMoveId when caller omits it", () => {
    const myUnit = createMockUnit({ ap: 1, hp: 1 });
    const enemy = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({ play: [myUnit] }, { play: [enemy] });
    const ambient = "parent-move-7";

    engine.runtime.runTestMutation(PLAYER_ONE as never, ({ G, framework }) => {
      const g = G as never as GundamG;
      // Simulate the drain's "currently resolving this move's effect" stash.
      g.pendingEffectCurrentMoveId = ambient;
      enqueuePendingEffect(
        g,
        {
          id: nextPendingEffectId(g),
          controllerId: PLAYER_ONE,
          sourceCardId: "fake",
          effect: restOpponentUnitEffect,
          effectIndex: 0,
          kind: "activated",
          // No originatingMoveId — expect inheritance.
        },
        framework,
      );
      // Clear ambient so it doesn't bleed past this test setup.
      g.pendingEffectCurrentMoveId = undefined;
    });

    const pending = engine.getG().pendingEffects;
    expect(pending).toHaveLength(1);
    expect(pending[0]!.originatingMoveId).toBe(ambient);
  });

  it("does not overwrite an explicit originatingMoveId with the ambient one", () => {
    const myUnit = createMockUnit({ ap: 1, hp: 1 });
    const enemy = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({ play: [myUnit] }, { play: [enemy] });
    const ambient = "parent-move-7";
    const explicit = "child-explicit-id";

    engine.runtime.runTestMutation(PLAYER_ONE as never, ({ G, framework }) => {
      const g = G as never as GundamG;
      g.pendingEffectCurrentMoveId = ambient;
      enqueuePendingEffect(
        g,
        {
          id: nextPendingEffectId(g),
          controllerId: PLAYER_ONE,
          sourceCardId: "fake",
          effect: restOpponentUnitEffect,
          effectIndex: 0,
          kind: "activated",
          originatingMoveId: explicit,
        },
        framework,
      );
      g.pendingEffectCurrentMoveId = undefined;
    });

    expect(engine.getG().pendingEffects[0]!.originatingMoveId).toBe(explicit);
  });

  it("surfaces moveGroupId on the gundam.pending.resolved log values", () => {
    const myUnit = createMockUnit({ ap: 1, hp: 1 });
    const enemy = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({ play: [myUnit] }, { play: [enemy] });
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
    const moveId = "test-resolve-move-1";

    engine.runtime.runTestMutation(PLAYER_ONE as never, ({ G, framework }) => {
      const g = G as never as GundamG;
      enqueuePendingEffect(
        g,
        {
          id: nextPendingEffectId(g),
          controllerId: PLAYER_ONE,
          sourceCardId: "fake",
          effect: restOpponentUnitEffect,
          effectIndex: 0,
          kind: "activated",
          originatingMoveId: moveId,
        },
        framework,
      );
    });

    expect(engine.getG().pendingEffects).toHaveLength(1);
    const result = engine.asPlayer(PLAYER_ONE).resolveEffect({ targets: [enemyId] });
    expectSuccess(result);
    if (!result.success) throw new Error("unreachable");

    // `resolveEffect` emits `gundam.pending.resolved` with moveGroupId
    // pulled from the resolved entry's originatingMoveId. The typed
    // payload lives under `entry.data`; the raw entry only exposes the
    // i18n-rendered `message` and the loose `data` bag.
    const resolved = result.logEntries
      .filter((e) => e.type === "gundam.pending.resolved")
      .find((e) => {
        const data = e.data as { values?: { moveGroupId?: string } } | undefined;
        return data?.values?.moveGroupId === moveId;
      });
    expect(resolved).toBeDefined();
  });
});
