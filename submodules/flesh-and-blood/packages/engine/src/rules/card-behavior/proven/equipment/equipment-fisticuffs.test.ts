/**
 * BEN005 Fisticuffs — Generic Arms (no defense).
 *
 * Printed:
 *   Attack Reaction - {r}{r}, destroy Fisticuffs: Target attack action card
 *   gains +1{p}.
 *
 * Reasoning (hand-authored; case-by-case):
 * 1. AR mixed cost 2{r} + destroy-self; not an Action (no AP spend).
 * 2. Effect targets on-stack Action Attack on combat-chain (+1{p} UEoT).
 *    Model filter types Action + subtypes Attack matches Snatch / AACs.
 * 3. Happy: open AR on Snatch (base 4) with 2{r} → destroy arms → 5 damage.
 * 4. Boundary: out of reaction step illegal; arms stay seated.
 * 5. Boundary: 1{r} insufficient — activation illegal / fails payment.
 * 6. No printed defense / bladeBreak — no defend path for this row.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { fisticuffs } from "../../../../../../cards/src/cards/equipment/fisticuffs.ts";

const LIFE = 40;
const SNATCH = 4;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 80; safety += 1) {
    const decision = game.getState().decision;
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
    if (decision?.kind === "entity-target") {
      const attack = decision.candidates.find(
        (c) => game.getState().objects[c.instanceId]?.canonicalId === snatchRed.canonicalId,
      );
      const pick = attack ?? decision.candidates[0];
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
    if (decision?.kind === "payment") {
      const pick = decision.candidates[0];
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "payment", instanceIds: pick ? [pick.instanceId] : [] },
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

function finishCombat(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 80; safety += 1) {
    drain(game);
    if (!game.combat() && game.getState().rulesStack.length === 0 && !game.getState().decision) {
      return;
    }
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (prio && !game.getState().decision) {
      try {
        game.exec({ move: "pass", actorId: prio, payload: {} });
      } catch {
        return;
      }
      continue;
    }
    if (!game.getState().decision && !prio) return;
  }
}

describe("fisticuffs (BEN005)", () => {
  it("core mechanic: AR {r}{r}+destroy → target AAC +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [fisticuffs],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);

    expect(Bravo.zone("arms")).toContain(fisticuffs.canonicalId);

    Bravo.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    Opponent.defendWith([]);
    Bravo.pass();
    Opponent.pass();
    expect(game.combat()?.step).toBe("reaction");

    Bravo.activate(fisticuffs);
    finishCombat(game);

    // Destroy-self as cost; 2{r} spent.
    expect(Bravo.zone("arms")).not.toContain(fisticuffs.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(fisticuffs.canonicalId);
    expect(Bravo.resourcePoints()).toBe(0);

    // Snatch base 4 + AR +1{p} = 5 unblocked.
    expect(Opponent.life()).toBe(LIFE - (SNATCH + 1));
  });

  it("boundaries: out of AR illegal; insufficient {r}; model", () => {
    // Out of combat: AR illegal.
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        arms: [fisticuffs],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => bare.as(bravo).activate(fisticuffs)).toThrow();
    expect(bare.as(bravo).zone("arms")).toContain(fisticuffs.canonicalId);

    // 1{r} insufficient for 2{r} cost.
    const short = FabTestEngine.start(
      {
        hero: bravo,
        arms: [fisticuffs],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    short.as(bravo).attackWith(snatchRed);
    short.as(dash).defendWith([]);
    short.as(bravo).pass();
    short.as(dash).pass();
    expect(short.combat()?.step).toBe("reaction");
    const reject = short.as(bravo).expectFailure({
      move: "activate",
      payload: { instanceId: short.as(bravo).card(fisticuffs) },
    });
    expect(reject.accepted).toBe(false);
    expect(short.as(bravo).zone("arms")).toContain(fisticuffs.canonicalId);

    // Without AR buff: plain Snatch deals 4.
    const plain = FabTestEngine.start(
      {
        hero: bravo,
        arms: [fisticuffs],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    plain.as(bravo).attackWith(snatchRed);
    finishCombat(plain);
    expect(plain.as(dash).life()).toBe(LIFE - SNATCH);
    // Never activated — still seated.
    expect(plain.as(bravo).zone("arms")).toContain(fisticuffs.canonicalId);

    const a1 = fisticuffs.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind === "activated") {
      expect(a1.abilityType).toBe("attack-reaction");
      expect(a1.cost).toMatchObject({
        class: "mixed",
        type: "all",
        costs: [
          { class: "asset", type: "resources", amount: 2 },
          { class: "effect", type: "destroy-self" },
        ],
      });
      expect(a1.effect).toMatchObject({
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              types: ["Action"],
              subtypes: ["Attack"],
            },
          },
        },
        duration: "this-turn",
      });
    }
    // No defense / bladeBreak on this Generic arms.
    expect(fisticuffs.base.numeric.defense).toBeUndefined();
    expect(fisticuffs.base.keywords ?? []).toHaveLength(0);
  });
});
