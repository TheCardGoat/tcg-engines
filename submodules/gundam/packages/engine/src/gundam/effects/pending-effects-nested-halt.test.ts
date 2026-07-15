/**
 * Pending-effect nested-halt re-entrancy.
 *
 * `stashAndShiftForHalt` / `restorePreHaltActor` (`pending-effects.ts`)
 * jointly own the contract: while the queue is halted on a pending
 * effect whose `controllerId` differs from the original active player,
 * `activePlayer` is shifted to the head's controller so the runtime's
 * active-player gate admits their `resolveEffect`; once the queue
 * drains the pre-halt actor is restored. The re-entrancy clause
 * (`if (g.pendingEffectPreHaltActor === undefined)`) protects against
 * nested shifts overwriting the original.
 *
 * These tests pin the invariant. They go through the public test
 * harness rather than touching the private helpers directly so the
 * full halt-shift-drain-restore cycle is exercised end-to-end.
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
import type { PendingEffect } from "../types.ts";

/** Activated effect that needs an explicit target — used as a halting head. */
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

let peIdCounter = 0;
function makePending(
  overrides: Partial<PendingEffect> & Pick<PendingEffect, "effect" | "controllerId">,
): PendingEffect {
  return {
    id: overrides.id ?? `nh_${++peIdCounter}`,
    sourceCardId: overrides.sourceCardId ?? "unused",
    effectIndex: overrides.effectIndex ?? 0,
    kind: overrides.kind ?? "activated",
    ...overrides,
  };
}

describe("Pending effects — nested-halt re-entrancy", () => {
  it("restores activePlayer to the original after a single halted effect drains", () => {
    const myUnit = createMockUnit({ ap: 1, hp: 1 });
    const enemy = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({ play: [myUnit] }, { play: [enemy] });
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    const before = engine.getState().ctx.status.activePlayer as unknown as string;
    expect(before).toBe(PLAYER_ONE);

    engine.getG().pendingEffects.push(
      makePending({
        effect: restOpponentUnitEffect,
        controllerId: PLAYER_ONE,
        kind: "activated",
      }),
    );

    engine.tickFlow(PLAYER_ONE);
    expect(engine.getG().pendingEffects).toHaveLength(1);

    expectSuccess(engine.asPlayer(PLAYER_ONE).resolveEffect({ targets: [enemyId] }));

    expect(engine.getG().pendingEffects).toHaveLength(0);
    expect(engine.getG().pendingEffectPreHaltActor).toBeUndefined();
    expect(engine.getState().ctx.status.activePlayer as unknown as string).toBe(before);
  });

  it("shifts activePlayer to the head's controller while halted, then restores", () => {
    const myUnit = createMockUnit({ ap: 1, hp: 1 });
    const enemy = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({ play: [myUnit] }, { play: [enemy] });
    const myUnitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

    const before = engine.getState().ctx.status.activePlayer as unknown as string;
    expect(before).toBe(PLAYER_ONE);

    // P2's effect halts the queue. The drain must shift activePlayer to P2
    // so P2 can submit `resolveEffect`.
    engine.getG().pendingEffects.push(
      makePending({
        effect: restOpponentUnitEffect,
        controllerId: PLAYER_TWO,
        kind: "activated",
      }),
    );

    engine.tickFlow(PLAYER_ONE);

    expect(engine.getG().pendingEffects).toHaveLength(1);
    expect(engine.getState().ctx.status.activePlayer as unknown as string).toBe(PLAYER_TWO);
    expect(engine.getG().pendingEffectPreHaltActor).toBe(before);

    // P2's perspective: opponent is P1, so the target filter `opponent`
    // resolves to P1's unit.
    expectSuccess(engine.asPlayer(PLAYER_TWO).resolveEffect({ targets: [myUnitId] }));

    expect(engine.getG().pendingEffects).toHaveLength(0);
    expect(engine.getG().pendingEffectPreHaltActor).toBeUndefined();
    expect(engine.getState().ctx.status.activePlayer as unknown as string).toBe(before);
  });

  it("preserves the original pre-halt actor across multiple alternating halts (re-entrancy)", () => {
    const myUnit = createMockUnit({ ap: 1, hp: 1 });
    const enemy = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({ play: [myUnit] }, { play: [enemy] });
    const myUnitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    const before = engine.getState().ctx.status.activePlayer as unknown as string;
    expect(before).toBe(PLAYER_ONE);

    // Two halting effects controlled by different players. They sit at the
    // same tier (`activated` = 3); `priorityHeadIndex` ties on insertion
    // order, so P2's is processed first (lower index) and shifts the actor.
    //
    // Note: `engine.getG()` is called fresh each time — mutative replaces
    // the state object on every mutation, so caching the reference would
    // leak stale draft.
    engine.getG().pendingEffects.push(
      makePending({
        effect: restOpponentUnitEffect,
        controllerId: PLAYER_TWO,
        kind: "activated",
      }),
    );
    engine.getG().pendingEffects.push(
      makePending({
        effect: restOpponentUnitEffect,
        controllerId: PLAYER_ONE,
        kind: "activated",
      }),
    );

    engine.tickFlow(PLAYER_ONE);

    // First halt: shifted to P2; stash records the original (P1).
    expect(engine.getState().ctx.status.activePlayer as unknown as string).toBe(PLAYER_TWO);
    expect(engine.getG().pendingEffectPreHaltActor).toBe(before);

    // P2 resolves. The drain re-runs, finds P1's pending head, halts and
    // shifts activePlayer to P1. The re-entrancy clause keeps the stash
    // pointing at the ORIGINAL pre-halt actor — not the intermediate P2.
    expectSuccess(engine.asPlayer(PLAYER_TWO).resolveEffect({ targets: [myUnitId] }));

    expect(engine.getG().pendingEffects).toHaveLength(1);
    expect(engine.getState().ctx.status.activePlayer as unknown as string).toBe(PLAYER_ONE);
    // Critical re-entrancy invariant: stash is still the original actor.
    expect(engine.getG().pendingEffectPreHaltActor).toBe(before);

    // P1 resolves their effect; queue drains; stash clears; actor restored.
    expectSuccess(engine.asPlayer(PLAYER_ONE).resolveEffect({ targets: [enemyId] }));

    expect(engine.getG().pendingEffects).toHaveLength(0);
    expect(engine.getG().pendingEffectPreHaltActor).toBeUndefined();
    expect(engine.getState().ctx.status.activePlayer as unknown as string).toBe(before);
  });

  it("randomized sequences always restore the original pre-halt actor when fully drained", () => {
    // Synthetic property test: enqueue N halting effects with random
    // controllers, drain by submitting resolveEffect from whichever player
    // currently has priority, and assert the original actor is restored
    // and the stash is cleared.
    //
    // No fast-check dependency in this project — we use a seeded LCG so
    // the test is deterministic and reproducible.
    const seed = 0xc0ffee;
    let rng = seed;
    function rand(): number {
      rng = (rng * 1103515245 + 12345) & 0x7fffffff;
      return rng / 0x7fffffff;
    }

    for (let trial = 0; trial < 25; trial++) {
      const myUnit = createMockUnit({ ap: 1, hp: 1 });
      const enemy = createMockUnit({ ap: 1, hp: 1 });
      const engine = GundamTestEngine.create({ play: [myUnit] }, { play: [enemy] });
      const myUnitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
      const originalActor = engine.getState().ctx.status.activePlayer as unknown as string;

      const length = 1 + Math.floor(rand() * 5); // 1..5 entries
      for (let i = 0; i < length; i++) {
        const controller = rand() < 0.5 ? PLAYER_ONE : PLAYER_TWO;
        engine.getG().pendingEffects.push(
          makePending({
            effect: restOpponentUnitEffect,
            controllerId: controller,
            kind: "activated",
          }),
        );
      }

      engine.tickFlow(originalActor === PLAYER_ONE ? PLAYER_ONE : PLAYER_TWO);

      // Drain by resolving whoever currently has priority; each resolution
      // may shift activePlayer. Bound by 2 × length to catch any livelock.
      const maxIter = length * 2;
      for (let i = 0; i < maxIter && engine.getG().pendingEffects.length > 0; i++) {
        const current = engine.getState().ctx.status.activePlayer as unknown as string;
        const target = current === PLAYER_ONE ? enemyId : myUnitId;
        expectSuccess(
          engine.asPlayer(current as typeof PLAYER_ONE).resolveEffect({ targets: [target] }),
        );
      }

      expect(engine.getG().pendingEffects).toHaveLength(0);
      expect(engine.getG().pendingEffectPreHaltActor).toBeUndefined();
      expect(engine.getState().ctx.status.activePlayer as unknown as string).toBe(originalActor);
    }
  });
});
