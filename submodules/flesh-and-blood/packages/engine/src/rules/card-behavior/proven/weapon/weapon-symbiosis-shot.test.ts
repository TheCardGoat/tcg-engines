/**
 * EVO003 Symbiosis Shot — Mechanologist Gun 2H — power 2.
 *
 * Printed:
 *   a1: Action - Remove a steam counter from this: Attack
 *   a2: Whenever a Mechanologist item enters the arena under your control,
 *       if this has fewer than 6 steam counters, you may put a steam
 *       counter on this.
 *
 * Reasoning (hand-authored):
 * 1. a1 (remove 1 steam → 2-power attack) proven @ weapon-final-pending;
 *    this file proves the a2 steam-gain clause.
 * 2. a2: triggered on enter-arena, filter supertypes Mechanologist+types
 *    Item, condition has-counter (steam < 6), effect optional →
 *    add-counter self. All paths ride proven engine surfaces (enter-arena
 *    triggers, has-counter conditions, optional booleans, named counters).
 * 3. Happy: Hyper Driver (DYN111, Mechanologist Item) enters → a2 fires →
 *    optional accepts → +1 steam → objectState.steamCounters = 1.
 *    Boundary: after six public item-entry triggers, a2 blocks a seventh
 *    item entry → no seventh counter.
 *
 * Status: ✅ a2 Mech-item-enter → +1 steam proven; steam≥6 boundary.
 * No card/engine change needed.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";

import { symbiosisShot } from "../../../../../../cards/src/cards/weapons/symbiosis-shot.ts";
import { hyperDriverYellow } from "../../../../../../cards/src/cards/actions/hyper-driver.ts";

const LIFE = 40;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 64; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "ordering", orderedIds: decision.entries.map((e) => e.id) },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const pick = decision.candidates[0];
      if (!pick && (decision.min ?? 1) > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: pick ? [pick.instanceId] : [] },
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
          answer: { kind: "boolean", value: true },
        },
      });
      continue;
    }
    if (decision && game.answerForcedDecision()) continue;
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

function symId(game: ReturnType<typeof FabTestEngine.start>): string {
  const state = game.getState();
  return Object.values(state.objects).find((o) => o.canonicalId === symbiosisShot.canonicalId)!
    .instanceId;
}

describe("symbiosis-shot (EVO003)", () => {
  it("a2: Mech item enters → optional +1 steam", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [symbiosisShot],
        hand: [hyperDriverYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const id = symId(game);

    expect(game.objectState(id).steamCounters ?? 0).toBe(0);

    // Hyper Driver enters the arena → a2 fires → optional accept → +1 steam.
    Bravo.play(hyperDriverYellow);
    drain(game);

    expect(game.objectState(id).steamCounters ?? 0).toBe(1);
  });

  it("a2 boundary: the seventh Mechanologist item cannot add steam beyond six", () => {
    const drivers = Array.from({ length: 7 }, () => hyperDriverYellow);
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [symbiosisShot],
        hand: drivers,
        resourcePoints: 7,
        actionPoints: 7,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const id = symId(game);

    // Each real Hyper Driver entry offers a2. The seventh entry is the
    // boundary: the fewer-than-six condition no longer permits an addition.
    for (let i = 0; i < 7; i += 1) {
      game.as(bravo).play(hyperDriverYellow);
      drain(game);
    }

    expect(game.objectState(id).steamCounters ?? 0).toBe(6);
  });
});
