/**
 * PR F.3 — Within-controller ordering (rule 10-1-6-5).
 *
 * When multiple pending effects at the same priority tier share a
 * controller, the controller picks resolution order. Exercises:
 *   - `resolveEffect({})` preserves existing priority-head behaviour.
 *   - `resolveEffect({ pendingEffectId })` resolves the chosen entry.
 *   - Validation rejects wrong-controller, unknown-id, and lower-tier
 *     (cross-tier queue jumps are forbidden — rule 10-1-6-8 wins).
 *   - `buildPendingChoicePrompt` emits an `ordering` descriptor when two
 *     or more same-tier same-controller peers exist, and falls back to
 *     content prompts when the queue is down to one peer.
 *   - Ordering descriptor honours F.1 role scoping (controller/judge only).
 */

import { describe, it, expect } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  expectFailure,
  createMockUnit,
} from "../../index.ts";
import type { PendingEffect } from "../types.ts";

const drawOneEffect: CardEffect = {
  type: "triggered",
  activation: { timing: ["deploy"] },
  directives: [{ action: { action: "draw", count: 1 } }],
  sourceText: "Draw 1.",
};

const drawTwoEffect: CardEffect = {
  type: "triggered",
  activation: { timing: ["deploy"] },
  directives: [{ action: { action: "draw", count: 2 } }],
  sourceText: "Draw 2.",
};

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
    id: overrides.id ?? `f3_${++peIdCounter}`,
    sourceCardId: overrides.sourceCardId ?? "unused",
    effectIndex: overrides.effectIndex ?? 0,
    kind: overrides.kind ?? "triggered",
    ...overrides,
  };
}

describe("Pending effects — within-controller ordering (PR F.3)", () => {
  it("default order preserved: resolveEffect({}) resolves the priority head", () => {
    // Both entries are `activated` with a target filter. Each still needs
    // a target when resolveEffect runs, so auto-drain halts the queue at
    // the head; resolveEffect pops exactly one entry, the caller supplies
    // the target for the one it's committing.
    const myUnit = createMockUnit({ ap: 1, hp: 1 });
    const enemy1 = createMockUnit({ ap: 1, hp: 1 });
    const enemy2 = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({ play: [myUnit] }, { play: [enemy1, enemy2] });
    const enemies = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");

    engine.getG().pendingEffects.push(
      makePending({
        id: "first",
        effect: restOpponentUnitEffect,
        controllerId: PLAYER_ONE,
        kind: "activated",
      }),
      makePending({
        id: "second",
        effect: restOpponentUnitEffect,
        controllerId: PLAYER_ONE,
        kind: "activated",
      }),
    );

    expectSuccess(engine.asPlayer(PLAYER_ONE).resolveEffect({ targets: [enemies[0]!] }));

    // Head ("first") resolved → enemies[0] rested; "second" still waits.
    expect(engine.getG().pendingEffects.map((pe) => pe.id)).toEqual(["second"]);
    expect(engine.getG().exhausted[enemies[0]!]).toBe(true);
    expect(engine.getG().exhausted[enemies[1]!]).toBeFalsy();
  });

  it("pick-by-id: resolveEffect({ pendingEffectId }) resolves the chosen peer, first remains", () => {
    const myUnit = createMockUnit({ ap: 1, hp: 1 });
    const enemy1 = createMockUnit({ ap: 1, hp: 1 });
    const enemy2 = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({ play: [myUnit] }, { play: [enemy1, enemy2] });
    const enemies = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");

    engine.getG().pendingEffects.push(
      makePending({
        id: "first",
        effect: restOpponentUnitEffect,
        controllerId: PLAYER_ONE,
        kind: "activated",
      }),
      makePending({
        id: "second",
        effect: restOpponentUnitEffect,
        controllerId: PLAYER_ONE,
        kind: "activated",
      }),
    );

    expectSuccess(
      engine
        .asPlayer(PLAYER_ONE)
        .resolveEffect({ pendingEffectId: "second", targets: [enemies[1]!] }),
    );

    expect(engine.getG().pendingEffects.map((pe) => pe.id)).toEqual(["first"]);
    expect(engine.getG().exhausted[enemies[1]!]).toBe(true);
    expect(engine.getG().exhausted[enemies[0]!]).toBeFalsy();
  });

  it("rejects wrong controller at the active-player gate", () => {
    const engine = GundamTestEngine.create({}, {});
    engine.getG().pendingEffects.push(
      makePending({
        id: "mine",
        effect: drawOneEffect,
        controllerId: PLAYER_ONE,
        kind: "triggered",
      }),
    );

    // When the queue halts through the normal drain, activePlayer is
    // shifted to the head's controllerId; the runtime gate then admits
    // only that player. Here the pending effect is pushed directly onto
    // G without triggering the drain, so activePlayer is still the
    // setup-default (PLAYER_ONE) — either way, PLAYER_TWO is rejected
    // before reaching resolveEffect.validate's in-move guard.
    expectFailure(
      engine.asPlayer(PLAYER_TWO).resolveEffect({ pendingEffectId: "mine" }),
      "NOT_ACTIVE_PLAYER",
    );
  });

  it("rejects unknown id with PENDING_EFFECT_NOT_FOUND", () => {
    const engine = GundamTestEngine.create({}, {});
    engine.getG().pendingEffects.push(
      makePending({
        id: "real",
        effect: drawOneEffect,
        controllerId: PLAYER_ONE,
        kind: "triggered",
      }),
    );

    expectFailure(
      engine.asPlayer(PLAYER_ONE).resolveEffect({ pendingEffectId: "bogus" }),
      "PENDING_EFFECT_NOT_FOUND",
    );
  });

  it("rejects lower-tier selection when a higher-tier entry (burst) is waiting", () => {
    const engine = GundamTestEngine.create({ deck: 10 }, {});
    // Burst (tier 0) must resolve before triggered (tier 1) per rule 10-1-6-8.
    engine.getG().pendingEffects.push(
      makePending({
        id: "burst-entry",
        effect: drawOneEffect,
        controllerId: PLAYER_ONE,
        kind: "burst",
      }),
      makePending({
        id: "triggered-entry",
        effect: drawOneEffect,
        controllerId: PLAYER_ONE,
        kind: "triggered",
      }),
    );

    expectFailure(
      engine.asPlayer(PLAYER_ONE).resolveEffect({ pendingEffectId: "triggered-entry" }),
      "NOT_PRIORITY_TIER",
    );

    // Queue untouched.
    expect(engine.getG().pendingEffects.map((pe) => pe.id)).toEqual([
      "burst-entry",
      "triggered-entry",
    ]);
  });
});

describe("Pending choice — ordering descriptor (PR F.3)", () => {
  it("emits ordering when two same-tier same-controller peers exist", () => {
    const engine = GundamTestEngine.create({ deck: 10 }, {});
    engine.getG().pendingEffects.push(
      makePending({
        id: "a",
        effect: restOpponentUnitEffect,
        controllerId: PLAYER_ONE,
        kind: "activated",
      }),
      makePending({
        id: "b",
        effect: drawOneEffect,
        controllerId: PLAYER_ONE,
        kind: "activated",
      }),
    );

    const choice = engine.getPendingChoice();
    expect(choice?.kind).toBe("ordering");
    if (choice?.kind !== "ordering") return;
    expect(choice.controllerId).toBe(PLAYER_ONE);
    expect(choice.effectId).toBe("a");
    expect(choice.candidateEffectIds).toEqual(["a", "b"]);
  });

  it("falls through to content prompt when only one peer remains at the tier", () => {
    const engine = GundamTestEngine.create({ deck: 10 }, {});
    engine.getG().pendingEffects.push(
      makePending({
        id: "only",
        effect: restOpponentUnitEffect,
        controllerId: PLAYER_ONE,
        kind: "activated",
      }),
    );

    const choice = engine.getPendingChoice();
    expect(choice?.kind).toBe("targetSelection");
  });

  it("does not emit ordering when peers belong to different controllers (same tier)", () => {
    // Two 'activated' entries at tier 3 — but different controllers, so
    // neither player has an ordering choice over the other's effect.
    const engine = GundamTestEngine.create({ deck: 10 }, { deck: 10 });
    engine.getG().pendingEffects.push(
      makePending({
        id: "mine",
        effect: restOpponentUnitEffect,
        controllerId: PLAYER_ONE,
        kind: "activated",
      }),
      makePending({
        id: "theirs",
        effect: restOpponentUnitEffect,
        controllerId: PLAYER_TWO,
        kind: "activated",
      }),
    );

    const choice = engine.getPendingChoice();
    // Head is PLAYER_ONE's; peers = only "mine" → ordering suppressed.
    expect(choice?.kind).toBe("targetSelection");
  });

  it("ordering descriptor is visible to controller and judge, hidden from opponent/spectator", () => {
    const engine = GundamTestEngine.create({ deck: 10 }, {});
    engine.getG().pendingEffects.push(
      makePending({
        id: "a",
        effect: drawOneEffect,
        controllerId: PLAYER_ONE,
        kind: "activated",
      }),
      makePending({
        id: "b",
        effect: drawTwoEffect,
        controllerId: PLAYER_ONE,
        kind: "activated",
      }),
    );

    expect(engine.getPendingChoice({ role: "judge" })?.kind).toBe("ordering");
    expect(engine.getPendingChoice({ role: "player", playerId: PLAYER_ONE as never })?.kind).toBe(
      "ordering",
    );
    expect(
      engine.getPendingChoice({ role: "player", playerId: PLAYER_TWO as never }),
    ).toBeUndefined();
    expect(engine.getPendingChoice({ role: "spectator" })).toBeUndefined();
  });
});
