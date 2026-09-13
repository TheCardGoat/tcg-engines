/**
 * ARC078 Grasp of the Arknight — Runeblade Arms d2 Battleworn.
 *
 * Printed:
 *   Once per Turn Action - {r}{r}: Create a Runechant token. This ability
 *   costs an additional {r} to activate for each Runechant you control.
 *   Go again
 *   Battleworn
 *
 * Reasoning (hand-authored; case-by-case):
 * 1. Base activate {r}{r} Action + go again AP refund → create Runechant under
 *    controller (arena).
 * 2. Prior model permanently modified equipment cost after create with
 *    subtypes:["Runechant"] filter — wrong layer (not activation cost) and
 *    dead filter (token is Token+Aura, name Runechant).
 * 3. ENGINE: activated costIncrease amount (symmetric to costReduction)
 *    evaluated at quote/begin; +1{r} per controlled Runechant.
 * 4. Happy: 2{r} empty arena → 1 Runechant; AP refunded.
 * 5. Tax: 1 Runechant seated → 2{r} illegal, 3{r} creates second.
 * 6. OPT: second activate same turn illegal.
 * 7. Battleworn d2 first defend −1 counter (seat remains).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine, fabToken } from "../../../../index.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { graspOfTheArknight } from "../../../../../../cards/src/cards/equipment/grasp-of-the-arknight.ts";

const LIFE = 20;
const SNATCH = 4;
const ARMS_D = 2;

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

function runechantCount(
  game: ReturnType<typeof FabTestEngine.start>,
  player: ReturnType<ReturnType<typeof FabTestEngine.start>["as"]>,
): number {
  const state = game.getState();
  return player.zone("arena").filter((id) => {
    if (/runechant/i.test(id)) return true;
    const canon = state.objects[id]?.canonicalId ?? "";
    return /runechant/i.test(canon);
  }).length;
}

const seatedRunechant = fabToken("runechant");

describe("grasp-of-the-arknight (ARC078)", () => {
  it("core mechanic: {r}{r} → create Runechant; go again; costIncrease tax", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [graspOfTheArknight],
        hand: [],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    expect(runechantCount(game, Bravo)).toBe(0);

    const apBefore = Bravo.actionPoints();
    Bravo.activate(graspOfTheArknight);
    drain(game);

    expect(runechantCount(game, Bravo)).toBe(1);
    expect(Bravo.resourcePoints()).toBe(0);
    // Go again refunds Action AP.
    expect(Bravo.actionPoints()).toBe(apBefore);
    expect(Bravo.zone("arms")).toContain(graspOfTheArknight.canonicalId);

    // With 1 Runechant, base 2 + tax 1 = 3{r}. 2{r} is illegal.
    const taxed = FabTestEngine.start(
      {
        hero: bravo,
        arms: [graspOfTheArknight],
        arena: [seatedRunechant],
        hand: [],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    expect(runechantCount(taxed, taxed.as(bravo))).toBe(1);
    const tReject = taxed.as(bravo).expectFailure({
      move: "activate",
      payload: { instanceId: taxed.as(bravo).card(graspOfTheArknight) },
    });
    expect(tReject.accepted).toBe(false);
    expect(runechantCount(taxed, taxed.as(bravo))).toBe(1);

    // 3{r} pays tax and creates a second Runechant.
    const payTax = FabTestEngine.start(
      {
        hero: bravo,
        arms: [graspOfTheArknight],
        arena: [seatedRunechant],
        hand: [],
        actionPoints: 1,
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    expect(runechantCount(payTax, payTax.as(bravo))).toBe(1);
    payTax.as(bravo).activate(graspOfTheArknight);
    drain(payTax);
    expect(runechantCount(payTax, payTax.as(bravo))).toBe(2);
    expect(payTax.as(bravo).resourcePoints()).toBe(0);
  });

  it("boundaries: OPT second activate illegal; battleworn d2; model", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [graspOfTheArknight],
        hand: [],
        actionPoints: 2,
        resourcePoints: 4,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    Bravo.activate(graspOfTheArknight);
    drain(game);
    expect(runechantCount(game, Bravo)).toBe(1);

    const optReject = Bravo.expectFailure({
      move: "activate",
      payload: { instanceId: Bravo.card(graspOfTheArknight) },
    });
    expect(optReject.accepted).toBe(false);
    expect(runechantCount(game, Bravo)).toBe(1);

    // Battleworn: defend contributes 2 then −1 counter; seat remains.
    const bw = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: LIFE,
        arms: [graspOfTheArknight],
        hand: [],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    bw.as(dash).attackWith(snatchRed);
    bw.as(bravo).defendWith(graspOfTheArknight);
    drain(bw);
    bw.helpers.resolveRestOfCombat();
    drain(bw);
    expect(bw.as(bravo).zone("arms")).toContain(graspOfTheArknight.canonicalId);
    expect(bw.as(bravo).life()).toBe(LIFE - (SNATCH - ARMS_D));

    const a1 = graspOfTheArknight.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind === "activated") {
      expect(a1.abilityType).toBe("action");
      expect(a1.limit).toEqual({ count: 1, per: "turn" });
      expect(a1.cost).toMatchObject({ type: "resources", amount: 2 });
      expect(a1.costIncrease).toMatchObject({
        amount: {
          type: "count",
          what: "cards-in-zone",
          zone: "permanent",
          filter: { name: "Runechant" },
        },
      });
      expect(a1.layerKeywords).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: "go-again" })]),
      );
      expect(a1.effect).toMatchObject({
        type: "create-token",
        token: "runechant",
        controller: "controller",
      });
    }
    expect(graspOfTheArknight.base.numeric.defense).toBe(2);
    expect(graspOfTheArknight.base.keywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "battleworn" })]),
    );
  });
});
