/**
 * HNT216 Blade Beckoner Helm — Generic Head d1 Guardwell.
 *
 * Printed:
 *   This gets +1{d} while defending a weapon attack.
 *   Guardwell
 *
 * Reasoning (hand-authored):
 * 1. Continuous +1{d} when this is among defending cards and the attack is a
 *    Weapon type-line object.
 * 2. Condition was evaluated without subject during continuous resolveSubjects;
 *    defending-a-weapon-attack now falls back to continuous source (self).
 * 3. AAC defend stays base d1 (no weapon).
 * 4. Guardwell: after defend, helm stays equipped with −N defense counters
 *    equal to its defense value at close (effective d2 vs weapon → −2).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, dawnblade, snatchRed } from "../../../fixtures.ts";
import { bladeBeckonerHelm } from "../../../../../../cards/src/cards/equipment/blade-beckoner-helm.ts";

const SNATCH = 4;
const DAWN = 3;
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
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("blade-beckoner-helm (HNT216)", () => {
  it("core mechanic: defend weapon → +1{d} (d2); Guardwell −2 counters", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [dawnblade],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [bladeBeckonerHelm],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);
    const helmId = Defender.findCardInZone("head", bladeBeckonerHelm);

    Attacker.activate(dawnblade);
    // Weapon attack opens combat; advance to Defend like attackWith does.
    for (let safety = 0; safety < 24; safety += 1) {
      if (game.combat()?.step === "defend") break;
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
      const prio = game.getState().priority?.holderPlayerId;
      if (!prio) break;
      game.exec({ move: "pass", actorId: prio, payload: {} });
    }
    expect(game.combat()?.step).toBe("defend");
    Defender.defendWith(bladeBeckonerHelm);
    drain(game);
    game.helpers.resolveRestOfCombat();

    // Dawnblade 3 − effective d2 = 1 damage.
    expect(Defender.life()).toBe(LIFE - (DAWN - 2));
    // Guardwell keeps helm equipped; −1 counters equal to defense value at close (2).
    expect(Defender.zone("head")).toContain(bladeBeckonerHelm.canonicalId);
    expect(game.objectState(helmId)?.defenseCounterTotal).toBe(-2);
  });

  it("boundaries: AAC defend is base d1; Guardwell −1; model condition shape", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [bladeBeckonerHelm],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);
    const helmId = Defender.findCardInZone("head", bladeBeckonerHelm);

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(bladeBeckonerHelm);
    drain(game);
    game.helpers.resolveRestOfCombat();

    // Snatch 4 − base d1 = 3; no weapon bonus.
    expect(Defender.life()).toBe(LIFE - (SNATCH - 1));
    expect(Defender.zone("head")).toContain(bladeBeckonerHelm.canonicalId);
    expect(game.objectState(helmId)?.defenseCounterTotal).toBe(-1);

    const a1 = bladeBeckonerHelm.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || !a1.effect) return;
    expect(a1.condition).toMatchObject({
      type: "has-status",
      status: "defending-a-weapon-attack",
    });
    expect(a1.effect).toMatchObject({
      type: "modify-numeric",
      property: "defense",
      op: "add",
      amount: 1,
      target: { selector: "self" },
      duration: "permanent",
    });
    expect(bladeBeckonerHelm.base.keywords?.some((k) => k.name === "guardwell")).toBe(true);
  });
});
