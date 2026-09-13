import { typeBoxTokens } from "@tcg/flesh-and-blood-types";
/**
 * SMP015 Bloodied Strapping — Event Chest d0.
 *
 * Printed:
 *   You may equip this.
 *   Action - Destroy this: The next attack action card you play this turn
 *   costs {r}{r} less to play. Go again
 *
 * Reasoning (case-by-case):
 * 1. Pre-game chest seat covers equip; a1 continuous optional equip is Event
 *    equipment equip permission (model-guarded; mid-game equip not re-proved).
 * 2. Action destroy-self → cost −2 this-turn appliesTo.next AAC + go again.
 * 3. MODEL: and of subtypes Attack + subtypes Action is wrong — Action is a
 *    type. Remodel types:["Action"] subtypes:["Attack"] (silken-gi family).
 * 4. Brutal Assault cost 2 → free after destroy; without discount illegal at 0 RP.
 * 5. Only next AAC gets the discount (second pays full).
 *
 * Status: ✅ destroy → next AAC −2{r}+GA; bare illegal; second full; model.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { bloodiedStrapping } from "../../../../../../cards/src/cards/equipment/bloodied-strapping.ts";
import { brutalAssaultRed } from "../../../../../../cards/src/cards/actions/brutal-assault.ts";

const LIFE = 20;
const BRUTAL_COST = 2;
const BRUTAL_POWER = 6;

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

describe("bloodied-strapping (SMP015)", () => {
  it("core mechanic: Action destroy → next AAC costs {r}{r} less + go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [bloodiedStrapping],
        hand: [brutalAssaultRed, brutalAssaultRed],
        actionPoints: 2,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);

    // Without strapping discount, cost-2 AAC is illegal at 0 RP.
    expect(() => Bravo.attackWith(brutalAssaultRed)).toThrow();

    const apBefore = Bravo.actionPoints();
    Bravo.activate(bloodiedStrapping);
    drain(game);
    expect(Bravo.zone("chest")).not.toContain(bloodiedStrapping.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(bloodiedStrapping.canonicalId);
    // Go again refunds the Action AP.
    expect(Bravo.actionPoints()).toBe(apBefore);

    // First AAC: cost 2 − 2 = 0.
    const lifeBefore = Opponent.life();
    const rpBefore = Bravo.resourcePoints();
    Bravo.attackWith(brutalAssaultRed);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);
    expect(Opponent.life()).toBe(lifeBefore - BRUTAL_POWER);
    expect(Bravo.resourcePoints()).toBe(rpBefore);

    // Second AAC this turn: full cost 2 — still 0 RP so illegal.
    expect(() => Bravo.attackWith(brutalAssaultRed)).toThrow();
  });

  it("boundaries: second AAC pays full with RP; equip text + AAC cost model", () => {
    const two = FabTestEngine.start(
      {
        hero: bravo,
        chest: [bloodiedStrapping],
        hand: [brutalAssaultRed, brutalAssaultRed],
        actionPoints: 2,
        resourcePoints: BRUTAL_COST,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = two.as(bravo);
    Bravo.activate(bloodiedStrapping);
    drain(two);
    Bravo.attackWith(brutalAssaultRed);
    drain(two);
    two.helpers.resolveRestOfCombat();
    drain(two);
    const rpMid = Bravo.resourcePoints();
    expect(rpMid).toBe(BRUTAL_COST); // first was free
    Bravo.attackWith(brutalAssaultRed);
    drain(two);
    two.helpers.resolveRestOfCombat();
    expect(Bravo.resourcePoints()).toBe(rpMid - BRUTAL_COST);

    const a1 = bloodiedStrapping.base.abilities?.find(
      (a) => a.id === "fMrFHR8DtpGQkCcHDCrDM:mayEquip",
    );
    expect(a1?.kind).toBe("static");
    if (a1?.kind === "static") {
      expect(a1.staticKind).toBe("continuous");
      expect(a1.effect).toMatchObject({
        type: "optional",
        effect: { type: "equip", target: { selector: "self" } },
      });
    }

    const a2 = bloodiedStrapping.base.abilities?.find(
      (a) => a.id === "fMrFHR8DtpGQkCcHDCrDM:actionDestroyNextAttackActionPlayTurnCostsLess",
    );
    expect(a2?.kind).toBe("activated");
    if (a2?.kind !== "activated" || !a2.effect) return;
    expect(a2.abilityType).toBe("action");
    expect(a2.cost).toMatchObject({ class: "effect", type: "destroy-self" });
    expect(a2.effect).toMatchObject({
      type: "modify-numeric",
      property: "cost",
      op: "subtract",
      amount: 2,
      duration: "this-turn",
      appliesTo: { next: { typeBox: { types: ["Action"], subtypes: ["Attack"] } } },
    });
    expect(a2.layerKeywords?.some((k) => k.name === "go-again")).toBe(true);
    expect(bloodiedStrapping.base.numeric.defense).toBe(0);
    expect(typeBoxTokens(bloodiedStrapping.base.typeBox)).toEqual(
      expect.arrayContaining(["Event", "Equipment", "Chest"]),
    );
  });
});
