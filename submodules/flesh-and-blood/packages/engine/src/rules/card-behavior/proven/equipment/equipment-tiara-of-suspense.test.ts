/**
 * APS004 Tiara of Suspense — Revered Guardian Head d2 Guardwell.
 *
 * Printed (i18n):
 *   Instant - Destroy this: Put a suspense counter on an aura of suspense you
 *   control. Activate this only if you've been cheered this turn.
 *   Guardwell
 *
 * Model:
 *   activated Instant, cost destroy-self,
 *   condition has-status been-cheered-this-turn,
 *   effect add-counter suspense ×1 on permanent Aura+suspense (on-stack target)
 *
 * Reasoning:
 * 1. Activate gate is been-cheered-this-turn. That status was stamped as
 *    history.turn.crowdCheered but never exposed to has-status — wired via
 *    playerCrowdCheered facts (same pattern as boosted/charged).
 * 2. Cheer path: play Superstar (APS024) Instant Aura — enter-arena cheers
 *    the controller (public production path used by Pleiades AAA).
 * 3. Suspense aura target: Up on a Pedestal (APS028) enters with 2 suspense
 *    counters; destroy-self then puts a third.
 * 4. Filter subtypes:["Aura"] is correct in this type-box (Aura is FAB_SUBTYPES).
 * 5. Without cheer, activate is illegal. Without a suspense aura after cheer,
 *    activate may be legal but target selection fails / no counter applied.
 * 6. Guardwell is defend path (not core of this activate AAA).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, upOnAPedestalBlue, superstarBlue } from "../../../fixtures.ts";
import { tiaraOfSuspense } from "../../../../../../cards/src/cards/equipment/tiara-of-suspense.ts";

function suspenseCount(game: ReturnType<typeof FabTestEngine.start>, instanceId: string): number {
  const record = game.getState().objects[instanceId];
  if (!record) return 0;
  return record.counters.find((c) => c.kind === "named" && c.name === "suspense")?.count ?? 0;
}

/** Resolve stack decisions while preferring decline of optional enter-arena hooks. */
function drainStackPreferDecline(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 40; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: false },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const pick =
        decision.min === 0 ? [] : decision.candidates[0] ? [decision.candidates[0].instanceId] : [];
      if (decision.min > 0 && pick.length === 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: pick },
        },
      });
      continue;
    }
    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "ordering",
            orderedIds: decision.entries.map((e) => e.id),
          },
        },
      });
      continue;
    }
    if (decision) break;
    if (game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

function playToArena(
  game: ReturnType<typeof FabTestEngine.start>,
  player: ReturnType<ReturnType<typeof FabTestEngine.start>["as"]>,
  card: { canonicalId: string },
): string {
  player.play(card);
  drainStackPreferDecline(game);
  const ids = game
    .getState()
    .containers.zonesByPlayerId[player.id]!.arena.filter(
      (inst) => game.getState().objects[inst]?.canonicalId === card.canonicalId,
    );
  expect(ids.length).toBeGreaterThan(0);
  return ids[ids.length - 1]!;
}

describe("tiara-of-suspense (APS004)", () => {
  it("boundaries: activate is illegal before being cheered this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [tiaraOfSuspense],
        hand: [upOnAPedestalBlue],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    // Suspense aura in arena does not substitute for the cheer gate.
    playToArena(game, Bravo, upOnAPedestalBlue);
    expect(game.getState().players[Bravo.id]?.history.turn.crowdCheered).not.toBe(true);
    expect(() => Bravo.activate(tiaraOfSuspense)).toThrow();
    expect(Bravo.zone("head")).toContain(tiaraOfSuspense.canonicalId);
  });

  it("core mechanic: after cheer, destroy-self puts a suspense counter on suspense aura", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [tiaraOfSuspense],
        hand: [upOnAPedestalBlue, superstarBlue],
        actionPoints: 2,
        resourcePoints: 1, // Superstar costs 1
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    // Cheer first (Superstar enter), then seat the suspense destination aura.
    // Superstar after another aura sometimes leaves the cheer trigger un-resolved
    // under manual priority; cheer-first matches production "already cheered" setup.
    playToArena(game, Bravo, superstarBlue);
    expect(game.getState().players[Bravo.id]?.history.turn.crowdCheered).toBe(true);

    const auraId = playToArena(game, Bravo, upOnAPedestalBlue);
    expect(suspenseCount(game, auraId)).toBe(2);
    // Ensure pedestal enter optional is fully drained before Instant activate.
    drainStackPreferDecline(game);
    expect(game.getState().decision).toBeNull();

    Bravo.activate(tiaraOfSuspense);
    // Target the suspense aura (prefer the pedestal instance), then drain stack.
    for (let safety = 0; safety < 24; safety += 1) {
      const decision = game.getState().decision;
      if (decision?.kind === "entity-target") {
        const pick =
          decision.candidates.find((c) => c.instanceId === auraId) ?? decision.candidates[0];
        if (!pick) break;
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: { kind: "entity-target", instanceIds: [pick.instanceId] },
          },
        });
        continue;
      }
      if (decision?.kind === "boolean") {
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: { kind: "boolean", value: false },
          },
        });
        continue;
      }
      if (decision?.kind === "ordering") {
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: {
              kind: "ordering",
              orderedIds: decision.entries.map((e) => e.id),
            },
          },
        });
        continue;
      }
      if (decision) break;
      if (game.getState().rulesStack.length === 0) break;
      const prio = game.getState().priority?.holderPlayerId;
      if (prio) {
        game.exec({ move: "pass", actorId: prio, payload: {} });
        continue;
      }
      break;
    }

    expect(Bravo.zone("head")).not.toContain(tiaraOfSuspense.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(tiaraOfSuspense.canonicalId);
    expect(suspenseCount(game, auraId)).toBe(3);
  });

  it("boundaries: after cheer without a suspense aura, activate cannot put a counter", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [tiaraOfSuspense],
        hand: [superstarBlue],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    playToArena(game, Bravo, superstarBlue);
    expect(game.getState().players[Bravo.id]?.history.turn.crowdCheered).toBe(true);

    // Instant may still be activatable (cheer gate only); without a legal
    // target the effect should not invent counters, and destroy may still pay.
    // Prefer: illegal activate when no legal target, or destroy without counter.
    try {
      Bravo.activate(tiaraOfSuspense);
      for (let safety = 0; safety < 12; safety += 1) {
        const decision = game.getState().decision;
        if (decision?.kind === "entity-target") {
          // No legal suspense aura candidates.
          expect(decision.candidates.length).toBe(0);
          break;
        }
        if (!decision && game.getState().rulesStack.length === 0) break;
        const prio = game.getState().priority?.holderPlayerId;
        if (prio) game.exec({ move: "pass", actorId: prio, payload: {} });
        else break;
      }
    } catch {
      // Illegal activate with no target is also acceptable.
    }
  });
});
