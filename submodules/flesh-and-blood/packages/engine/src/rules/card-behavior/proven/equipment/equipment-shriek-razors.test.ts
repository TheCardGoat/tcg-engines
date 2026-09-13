/**
 * EVO235 Shriek Razors — Assassin Arms d1 Battleworn.
 *
 * Printed:
 *   While this is in your graveyard, at the start of your turn, you may
 *   destroy 2 Silvers you control. If you do, equip this.
 *   Attack Reaction - {r}{r}, destroy this: Target attack action card
 *   defending an Assassin attack gets -1{d}.
 *   Battleworn
 *
 * Reasoning (hand-authored; case-by-case):
 * 1. a1 GY start: functionalZones graveyard + name Silver (was subtypes Silvers).
 * 2. Happy GY: 2 Silvers + end turn → equip arms; Silvers destroyed.
 * 3. a2 AR: Assassin AAC attack; opponent defends with AAC (Snatch d2);
 *    reaction activate 2{r}+destroy → Snatch −1{d} → damage = p − 1.
 * 4. Boundary: 1 Silver stuck in GY; out-of-combat AR illegal; non-Assassin
 *    attack has no legal AAC defending target; BW d1.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { shriekRazors } from "../../../../../../cards/src/cards/equipment/shriek-razors.ts";
import { silver } from "../../../../../../cards/src/cards/tokens/silver.ts";
import { infectRed } from "../../../../../../cards/src/cards/actions/infect.ts";
import { fabToken } from "../../../../testing/test-fixtures.ts";

const LIFE = 40;
const INFECT = 3;
const SNATCH_D = 2;
const ARMS_D = 1;

function drain(game: ReturnType<typeof FabTestEngine.start>, acceptOptional = true): void {
  for (let safety = 0; safety < 64; safety += 1) {
    if (game.answerForcedDecision()) continue;
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: acceptOptional },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const need = Math.max(decision.min ?? 1, 0);
      // Prefer Snatch as defending AAC target when present.
      const snatch = decision.candidates.find(
        (c) => game.getState().objects[c.instanceId]?.canonicalId === snatchRed.canonicalId,
      );
      const picks = snatch
        ? [snatch.instanceId]
        : decision.candidates.slice(0, need).map((c) => c.instanceId);
      if (picks.length < need && need > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: picks.slice(0, need || picks.length) },
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

/** Advance defend → reaction without assuming which seat holds priority. */
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
    const prio = game.getState().priority?.holderPlayerId;
    if (!prio) return;
    try {
      game.exec({ move: "pass", actorId: prio, payload: {} });
    } catch {
      return;
    }
  }
}

describe("shriek-razors (EVO235)", () => {
  it("core mechanic: GY start destroy 2 Silver → equip from graveyard", () => {
    const s1 = fabToken("silver");
    const s2 = { ...fabToken("silver"), canonicalId: silver.canonicalId };
    const game = FabTestEngine.start(
      { hero: bravo, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        graveyard: [shriekRazors],
        arena: [s1, s2],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);
    expect(Dash.zone("graveyard")).toContain(shriekRazors.canonicalId);
    expect(Dash.zone("arms")).not.toContain(shriekRazors.canonicalId);

    game.as(bravo).endTurn();
    drain(game, true);

    expect(Dash.zone("arms")).toContain(shriekRazors.canonicalId);
    expect(Dash.zone("graveyard")).not.toContain(shriekRazors.canonicalId);
  });

  it("core mechanic: AR 2{r}+destroy → defending AAC −1{d} vs Assassin attack", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [shriekRazors],
        hand: [infectRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [snatchRed], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);

    Bravo.attackWith(infectRed);
    expect(game.combat()?.step).toBe("defend");
    // Opponent defends with AAC Snatch (d2) — legal AR target.
    Opponent.defendWith(snatchRed);
    toReaction(game);
    expect(game.combat()?.step).toBe("reaction");

    const act = Bravo.activate(shriekRazors);
    expect(act.accepted).toBe(true);
    drain(game, false);

    expect(Bravo.zone("arms")).not.toContain(shriekRazors.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(shriekRazors.canonicalId);
    expect(Bravo.resourcePoints()).toBe(0);

    // Resolve combat: infect 3 − (snatch 2 − 1) = 2 damage.
    for (let safety = 0; safety < 48; safety += 1) {
      drain(game, false);
      if (!game.combat() && game.getState().rulesStack.length === 0) break;
      const prio = game.getState().priority?.holderPlayerId;
      if (prio) {
        try {
          game.exec({ move: "pass", actorId: prio, payload: {} });
        } catch {
          break;
        }
      } else break;
    }

    expect(Opponent.life()).toBe(LIFE - (INFECT - (SNATCH_D - 1)));
  });

  it("boundaries: 1 Silver stuck; non-Assassin no AR path; out of combat illegal; BW d1; model", () => {
    // 1 Silver: cannot destroy 2 → stays in GY.
    const stuck = FabTestEngine.start(
      { hero: bravo, deck: 4 },
      {
        hero: dash,
        graveyard: [shriekRazors],
        arena: [fabToken("silver")],
        deck: 4,
      },
      { autoPassPriority: false },
    );
    stuck.as(bravo).endTurn();
    drain(stuck, true);
    expect(stuck.as(dash).zone("graveyard")).toContain(shriekRazors.canonicalId);
    expect(stuck.as(dash).zone("arms")).not.toContain(shriekRazors.canonicalId);

    // Out of combat: AR illegal.
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        arms: [shriekRazors],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => bare.as(bravo).activate(shriekRazors)).toThrow();
    expect(bare.as(bravo).zone("arms")).toContain(shriekRazors.canonicalId);

    // Generic Snatch attack (not Assassin) + AAC defend: no legal Assassin-defend target.
    // AR may refuse activate or leave arms after failed resolution — assert no −1{d} damage path.
    const generic = FabTestEngine.start(
      {
        hero: bravo,
        arms: [shriekRazors],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [snatchRed], deck: 6 },
      { autoPassPriority: false },
    );
    generic.as(bravo).attackWith(snatchRed);
    generic.as(dash).defendWith(snatchRed);
    toReaction(generic);
    expect(generic.combat()?.step).toBe("reaction");
    // No Assassin attack → target filter empty; activate should fail or not buff.
    let activated = false;
    try {
      const r = generic.as(bravo).activate(shriekRazors);
      activated = r.accepted;
    } catch {
      activated = false;
    }
    if (activated) drain(generic, false);
    for (let safety = 0; safety < 32; safety += 1) {
      drain(generic, false);
      if (!generic.combat() && generic.getState().rulesStack.length === 0) break;
      const prio = generic.getState().priority?.holderPlayerId;
      if (prio) {
        try {
          generic.exec({ move: "pass", actorId: prio, payload: {} });
        } catch {
          break;
        }
      } else break;
    }
    // Full Snatch vs Snatch d2 without −1: 4 − 2 = 2 (if AR failed and arms stayed).
    // If destroy cost paid without legal target, arms leave but defense unmodified.
    const life = generic.as(dash).life();
    expect(life).toBe(LIFE - (4 - SNATCH_D));

    // Battleworn d1.
    const bw = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: LIFE, arms: [shriekRazors], deck: 6 },
      { autoPassPriority: false },
    );
    const Def = bw.as(bravo);
    const eqId = Def.findCardInZone("arms", shriekRazors);
    bw.as(dash).attackWith(snatchRed);
    Def.exec({ move: "defend", payload: { instanceIds: [eqId] } });
    bw.helpers.resolveRestOfCombat();
    expect(Def.zone("arms")).toContain(shriekRazors.canonicalId);
    expect(bw.objectState(eqId)?.defenseCounterTotal ?? 0).toBeLessThanOrEqual(-ARMS_D);

    // Model shape.
    const a1 = shriekRazors.base.abilities?.find(
      (a) => a.id === "DjWkHNPRFf8JgdpzGd96L:whileIsGraveyardAtStartTurnMayDestroy2",
    );
    expect(a1).toMatchObject({
      kind: "static",
      staticKind: "triggered",
      functionalZones: ["graveyard"],
      trigger: {
        kind: "event-and-state",
        event: { name: "start-phase" },
        state: { type: "has-status", status: "in-your-graveyard" },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "destroy",
            target: { filter: { name: "Silver" }, count: 2 },
          },
          then: { type: "equip", target: { selector: "self" } },
        },
      },
    });
    const a2 = shriekRazors.base.abilities?.find(
      (a) =>
        a.id ===
        "DjWkHNPRFf8JgdpzGd96L:attackReactionDestroyTargetAttackActionDefendingAssassinAttack",
    );
    expect(a2).toMatchObject({
      kind: "activated",
      abilityType: "attack-reaction",
      effect: {
        type: "modify-numeric",
        property: "defense",
        amount: 1,
        duration: "this-combat-chain",
        target: {
          player: "any",
          filter: {
            typeBox: {
              types: ["Action"],
              subtypes: ["Attack"],
            },
            defending: true,
            defendingAgainst: { typeBox: { supertypes: ["Assassin"] } },
          },
        },
      },
    });
  });
});
