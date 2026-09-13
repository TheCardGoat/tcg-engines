/**
 * HVY202 Headliner Helm — Generic Head Blade Break (set-base {d}).
 *
 * Printed:
 *   Headliner Helm's {d} is equal to the number of opposing heroes with
 *   greater {h} than you.
 *   Blade Break
 *
 * Reasoning (hand-authored, 1v1 product):
 * 1. Continuous set-base defense = count opposing heroes with
 *    greater-life-than-controller (0 or 1 in 1v1).
 * 2. Equal life → d0 defend (full damage) + BB.
 * 3. Opponent higher life → d1 defend + BB.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { headlinerHelm } from "../../../../../../cards/src/cards/equipment/headliner-helm.ts";

const SNATCH = 4;
const LIFE = 20;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
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
      const pick = decision.candidates[0];
      if (!pick && (decision.min ?? 1) > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "entity-target",
            instanceIds: pick ? [pick.instanceId] : [],
          },
        },
      });
      continue;
    }
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

describe("headliner-helm (HVY202)", () => {
  it("core mechanic: opponent higher life → d1 defend + BB", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      {
        hero: dash,
        life: 15,
        head: [headlinerHelm],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(headlinerHelm);
    drain(game);
    game.helpers.resolveRestOfCombat();

    // 1 opposing hero with greater life → d1; snatch 4−1 = 3.
    expect(Defender.life()).toBe(15 - (SNATCH - 1));
    expect(Defender.zone("graveyard")).toContain(headlinerHelm.canonicalId);
    expect(Defender.zone("head")).not.toContain(headlinerHelm.canonicalId);
  });

  it("boundaries: equal life → d0 defend + BB; model set-base count", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        life: LIFE,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [headlinerHelm],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(headlinerHelm);
    drain(game);
    game.helpers.resolveRestOfCombat();

    // 0 heroes with greater life → d0; full snatch.
    expect(Defender.life()).toBe(LIFE - SNATCH);
    expect(Defender.zone("graveyard")).toContain(headlinerHelm.canonicalId);

    const a1 = headlinerHelm.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || !a1.effect) return;
    expect(a1.effect).toMatchObject({
      type: "modify-numeric",
      property: "defense",
      op: "set-base",
      amount: {
        type: "count",
        what: "heroes",
        player: "opponent",
        filter: { hasStatus: "greater-life-than-controller" },
      },
      target: { selector: "self" },
      duration: "permanent",
    });
    expect(headlinerHelm.base.keywords?.some((k) => k.name === "blade-break")).toBe(true);
  });
});
