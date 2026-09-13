/**
 * DTD207 Ironsong Versus — Warrior Arms d2 Temper.
 *
 * Printed:
 *   Once per Turn Action - {r}: Your next sword attack this turn gets
 *   "When this hits a hero, create a Courage token." Go again
 *   Temper
 *
 * Reasoning (hand-authored; case-by-case):
 * 1. OPT Action 1{r} + layerKeywords go again (AP refund).
 * 2. Floating grant-property ability to next subtypes Sword this turn:
 *    hit hero → create Courage under controller.
 * 3. Happy: activate → Dawnblade hit → arena has token:courage; arms stays.
 * 4. Boundary: without activate, sword hit creates no Courage; OPT second
 *    activate illegal same turn; Temper d2 first defend −1 counter.
 * 5. Model: limit 1/turn Action + appliesTo next Sword + hit hero Courage.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, dawnblade, snatchRed } from "../../../fixtures.ts";
import { ironsongVersus } from "../../../../../../cards/src/cards/equipment/ironsong-versus.ts";

const LIFE = 40;
const DAWN = 3;
const SNATCH = 4;
const DEF = 2;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 64; safety += 1) {
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

describe("ironsong-versus (DTD207)", () => {
  it("core mechanic: Action {r} → next sword hit creates Courage; go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [ironsongVersus],
        weapon1: [dawnblade],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);

    const act = Bravo.activate(ironsongVersus);
    expect(act.accepted).toBe(true);
    drain(game);
    // Go again refunds the Action AP.
    expect(Bravo.actionPoints()).toBeGreaterThanOrEqual(1);
    expect(Bravo.resourcePoints()).toBe(1);
    expect(Bravo.zone("arms")).toContain(ironsongVersus.canonicalId);

    Bravo.activate(dawnblade);
    drain(game);
    game.helpers.resolveRestOfCombat();

    expect(Opponent.life()).toBe(LIFE - DAWN);
    expect(Bravo.zone("arena")).toContain("token:courage");
  });

  it("boundaries: no buff without activate; OPT; Temper d2; model grant next Sword", () => {
    // Bare sword hit: no Courage.
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        arms: [ironsongVersus],
        weapon1: [dawnblade],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    bare.as(bravo).activate(dawnblade);
    drain(bare);
    bare.helpers.resolveRestOfCombat();
    expect(bare.as(dash).life()).toBe(LIFE - DAWN);
    expect(bare.as(bravo).zone("arena")).not.toContain("token:courage");

    // OPT: activate once, second illegal same turn.
    const opt = FabTestEngine.start(
      {
        hero: bravo,
        arms: [ironsongVersus],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(opt.as(bravo).activate(ironsongVersus).accepted).toBe(true);
    drain(opt);
    expect(() => opt.as(bravo).activate(ironsongVersus)).toThrow();

    // Temper d2 first defend.
    const temper = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: LIFE,
        arms: [ironsongVersus],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    temper.as(dash).attackWith(snatchRed);
    temper.as(bravo).defendWith(ironsongVersus);
    temper.helpers.resolveRestOfCombat();
    expect(temper.as(bravo).life()).toBe(LIFE - (SNATCH - DEF));
    expect(temper.as(bravo).zone("arms")).toContain(ironsongVersus.canonicalId);

    const a1 = ironsongVersus.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind === "activated") {
      expect(a1.abilityType).toBe("action");
      expect(a1.limit).toMatchObject({ count: 1, per: "turn" });
      expect(a1.cost).toMatchObject({ type: "resources", amount: 1 });
      expect(a1.effect).toMatchObject({
        type: "grant-property",
        duration: "this-turn",
        appliesTo: { next: { typeBox: { subtypes: ["Sword"] } } },
      });
    }
    expect(ironsongVersus.base.keywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "temper" })]),
    );
  });
});
