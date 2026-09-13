/**
 * CRU081 Courage of Bladehold — Warrior Chest d2 Temper.
 *
 * Printed:
 *   Action - Destroy Courage of Bladehold: Your sword attacks cost {r} less
 *   this turn. Go again
 *   Temper
 *
 * Reasoning (hand-authored):
 * 1. Hand/stack star snapshot was wrong — swords sit in weapon seats, and
 *    "this turn" is multi-fire future cost reduction (Savage Sash family).
 * 2. types:["Sword"] matches type-line Sword (subtype).
 * 3. Talishar (Sword 2H, OPT Attack cost 2) activates for 1{r} after destroy.
 * 4. Without courage, Talishar illegal at 1{r}.
 * 5. Non-sword AAC (brutal assault cost 2) still pays full (filter excludes).
 * 6. Go again refunds Action AP; Temper first defend d2 −1.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { courageOfBladehold } from "../../../../../../cards/src/cards/equipment/courage-of-bladehold.ts";
import { talisharTheLostPrince } from "../../../../../../cards/src/cards/weapons/talishar-the-lost-prince.ts";
import { brutalAssaultRed } from "../../../../../../cards/src/cards/actions/brutal-assault.ts";

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
      const pick =
        decision.candidates.find((c) => c.instanceId !== decision.actorId) ??
        decision.candidates[0];
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

describe("courage-of-bladehold (CRU081)", () => {
  it("core mechanic: destroy → sword attacks cost {r} less; go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [talisharTheLostPrince],
        chest: [courageOfBladehold],
        hand: [],
        actionPoints: 2,
        // Talishar printed 2{r}; after courage → 1{r}.
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);
    const apBefore = Bravo.actionPoints();

    Bravo.activate(courageOfBladehold);
    drain(game);

    expect(Bravo.zone("chest")).not.toContain(courageOfBladehold.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(courageOfBladehold.canonicalId);
    expect(Bravo.actionPoints()).toBe(apBefore);
    expect(game.getState().continuousEffectInstances.length).toBeGreaterThanOrEqual(1);
    const costGrant = game
      .getState()
      .continuousEffectInstances.find((inst) =>
        inst.atoms.some((atom) => atom.kind === "activation-cost"),
      );
    expect(costGrant?.futureApplicability?.remaining).toBeGreaterThan(1);

    const lifeBefore = Opponent.life();
    const rpBefore = Bravo.resourcePoints();
    Bravo.activate(talisharTheLostPrince);
    drain(game);
    game.helpers.resolveRestOfCombat();

    // Talishar p4; paid 1{r} (2 − 1).
    expect(Opponent.life()).toBe(lifeBefore - 4);
    expect(Bravo.resourcePoints()).toBe(rpBefore - 1);
  });

  it("boundaries: without courage Talishar needs 2{r}; non-sword full cost; Temper", () => {
    // Without courage: Talishar cost 2 illegal at 1{r}.
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [talisharTheLostPrince],
        hand: [],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => bare.as(bravo).activate(talisharTheLostPrince)).toThrow();

    // Non-sword AAC cost 2 still illegal at 1{r} after courage.
    const nonSword = FabTestEngine.start(
      {
        hero: bravo,
        chest: [courageOfBladehold],
        hand: [brutalAssaultRed],
        actionPoints: 2,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false },
    );
    nonSword.as(bravo).activate(courageOfBladehold);
    drain(nonSword);
    expect(() => nonSword.as(bravo).attackWith(brutalAssaultRed)).toThrow();

    // Temper first defend.
    const temper = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [courageOfBladehold],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = temper.as(dash);
    const plateId = Defender.findCardInZone("chest", courageOfBladehold);
    temper.as(bravo).attackWith(snatchRed);
    Defender.defendWith(courageOfBladehold);
    drain(temper);
    temper.helpers.resolveRestOfCombat();
    expect(Defender.zone("chest")).toContain(courageOfBladehold.canonicalId);
    expect(temper.objectState(plateId)?.defenseCounterTotal).toBe(-1);
    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));

    const a1 = courageOfBladehold.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.effect).toMatchObject({
      type: "modify-activation-cost",
      op: "subtract",
      amount: 1,
      duration: "this-turn",
      appliesTo: {
        next: { typeBox: { subtypes: ["Sword"] } },
      },
    });
  });
});
