/**
 * HNT146 Hand of Vengeance — Draconic Arms d1 Blade Break.
 *
 * Printed:
 *   Attack Reaction - Destroy this: Target attack that is attacking Arakni
 *   gets +1{p}.
 *   Blade Break
 *
 * Reasoning (hand-authored; case-by-case):
 * 1. Prior model: and: subtypes Attack/That/Is/Attacking/Arakni — dead residue.
 * 2. Remodel: hasStatus targets-arakni (Heart of Vengeance moniker path).
 * 3. Happy: AR destroy while attacking Arakni → Snatch 4+1 deals 5.
 * 4. Boundary: vs non-Arakni no legal target / activate fails; out of combat
 *    illegal; bladeBreak d1.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { handOfVengeance } from "../../../../../../cards/src/cards/equipment/hand-of-vengeance.ts";
import { arakni } from "../../../../../../cards/src/cards/heroes/arakni.ts";

const LIFE = 40;
const SNATCH = 4;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
    if (game.answerForcedDecision()) continue;
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
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (prio) {
      try {
        game.exec({ move: "pass", actorId: prio, payload: {} });
      } catch {
        return;
      }
      continue;
    }
    return;
  }
}

function toReaction(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 24; safety += 1) {
    if (game.combat()?.step === "reaction") return;
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
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (!prio) return;
    try {
      game.exec({ move: "pass", actorId: prio, payload: {} });
    } catch {
      return;
    }
  }
}

describe("hand-of-vengeance (HNT146)", () => {
  it("core mechanic: AR destroy → attack targeting Arakni gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [handOfVengeance],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: arakni, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Arakni = game.as(arakni);

    Bravo.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    Arakni.defendWith([]);
    toReaction(game);
    expect(game.combat()?.step).toBe("reaction");

    const act = Bravo.activate(handOfVengeance);
    expect(act.accepted).toBe(true);
    drain(game);

    expect(Bravo.zone("arms")).not.toContain(handOfVengeance.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(handOfVengeance.canonicalId);

    for (let safety = 0; safety < 32; safety += 1) {
      drain(game);
      if (!game.combat() && game.getState().rulesStack.length === 0) break;
      if (game.declareNoDefenseIfPending()) continue;
      const prio = game.getPriorityPlayerId();
      if (prio) {
        try {
          game.exec({ move: "pass", actorId: prio, payload: {} });
        } catch {
          break;
        }
      } else break;
    }

    expect(Arakni.life()).toBe(LIFE - (SNATCH + 1));
  });

  it("boundaries: non-Arakni no AR path; out of combat illegal; BB d1; model", () => {
    // Out of combat illegal.
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        arms: [handOfVengeance],
        actionPoints: 1,
        deck: 6,
      },
      { hero: arakni, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => bare.as(bravo).activate(handOfVengeance)).toThrow();
    expect(bare.as(bravo).zone("arms")).toContain(handOfVengeance.canonicalId);

    // Attack non-Arakni: targets-arakni fails → no legal AR target.
    const noArakni = FabTestEngine.start(
      {
        hero: bravo,
        arms: [handOfVengeance],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    noArakni.as(bravo).attackWith(snatchRed);
    noArakni.as(dash).defendWith([]);
    toReaction(noArakni);
    expect(noArakni.combat()?.step).toBe("reaction");
    expect(() => noArakni.as(bravo).activate(handOfVengeance)).toThrow();
    noArakni.helpers.resolveRestOfCombat();
    expect(noArakni.as(dash).life()).toBe(LIFE - SNATCH);
    expect(noArakni.as(bravo).zone("arms")).toContain(handOfVengeance.canonicalId);

    // Blade Break d1.
    const bb = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: LIFE, arms: [handOfVengeance], deck: 6 },
      { autoPassPriority: false },
    );
    bb.as(dash).attackWith(snatchRed);
    bb.as(bravo).defendWith(handOfVengeance);
    bb.helpers.resolveRestOfCombat();
    expect(bb.as(bravo).zone("arms")).not.toContain(handOfVengeance.canonicalId);
    expect(bb.as(bravo).zone("graveyard")).toContain(handOfVengeance.canonicalId);

    // Model shape.
    const a1 = handOfVengeance.base.abilities?.find(
      (a) =>
        a.id === "8qzF9KbHtkNHpGzpdGWhk:attackReactionDestroyTargetAttackIsAttackingArakniGets",
    );
    expect(a1).toMatchObject({
      kind: "activated",
      abilityType: "attack-reaction",
      cost: { class: "effect", type: "destroy-self" },
      effect: {
        type: "modify-numeric",
        property: "power",
        amount: 1,
        duration: "this-combat-chain",
        target: {
          filter: { hasStatus: "targets-arakni" },
        },
      },
    });
  });
});
