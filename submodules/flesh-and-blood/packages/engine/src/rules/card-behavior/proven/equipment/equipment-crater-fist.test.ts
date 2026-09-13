/**
 * CRU025 Crater Fist — Guardian Arms d2 Temper.
 *
 * Printed:
 *   Action - {r}{r}{r}, destroy Crater Fist: Your attacks with crush gain
 *   +2{p} this turn. Go again
 *   Temper
 *
 * Reasoning (hand-authored; case-by-case — gallantry-gold / stubby-hammerers):
 * 1. Action mixed cost 3{r}+destroy-self; go again refunds Action AP.
 * 2. Prior model: combat-chain + hasKeyword crush + count:star at resolution —
 *    does not float to later crush attacks this turn.
 * 3. Remodel appliesTo.next Action/Attack hasKeyword crush count:star.
 *    Crush is ability label.name (matches-filter hasKeyword path).
 * 4. Happy: activate → Crush the Weak Red (base 7) deals 9; arms GY; AP refunded.
 * 5. Boundary: Snatch (no crush) after activate still deals 4.
 * 6. Temper d2: defend keeps arms with −1 defense counter.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { craterFist } from "../../../../../../cards/src/cards/equipment/crater-fist.ts";
import { crushTheWeakRed } from "../../../../../../cards/src/cards/actions/crush-the-weak.ts";

const LIFE = 40;
const CRUSH_BASE = 7;
const SNATCH = 4;
const ARMS_D = 2;

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

describe("crater-fist (CRU025)", () => {
  it("core mechanic: {r}{r}{r}+destroy → crush attacks +2{p} this turn; go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [craterFist],
        hand: [crushTheWeakRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);
    const apBefore = Bravo.actionPoints();

    Bravo.activate(craterFist);
    game.passBoth();

    // Destroy-self + 3{r}; go again refunds Action AP.
    expect(Bravo.zone("arms")).not.toContain(craterFist.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(craterFist.canonicalId);
    expect(Bravo.resourcePoints()).toBe(3);
    expect(Bravo.actionPoints()).toBe(apBefore);

    // Crush the Weak Red base 7 + aura 2 = 9.
    Bravo.play(crushTheWeakRed);
    drain(game);
    if (game.combat()) {
      Opponent.pass();
      Bravo.pass();
    }
    game.helpers.resolveRestOfCombat();
    drain(game);

    expect(Opponent.life()).toBe(LIFE - (CRUSH_BASE + 2));
    expect(Bravo.resourcePoints()).toBe(0);
  });

  it("boundaries: non-crush AAC unbuffed; Temper d2; model appliesTo crush", () => {
    // Snatch has no crush — aura does not apply.
    const aac = FabTestEngine.start(
      {
        hero: bravo,
        arms: [craterFist],
        hand: [snatchRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    aac.as(bravo).activate(craterFist);
    aac.passBoth();
    aac.as(bravo).attackWith(snatchRed);
    aac.as(dash).defendWith([]);
    aac.as(bravo).pass();
    aac.as(dash).pass();
    aac.helpers.resolveRestOfCombat();
    expect(aac.as(dash).life()).toBe(LIFE - SNATCH);

    // Temper d2: defend keeps arms, −1 defense counter.
    const temper = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        arms: [craterFist],
        life: 20,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    temper.as(dash).attackWith(snatchRed);
    temper.as(bravo).defendWith(craterFist);
    drain(temper);
    temper.helpers.resolveRestOfCombat();
    expect(temper.as(bravo).zone("arms")).toContain(craterFist.canonicalId);
    const armsId = temper.as(bravo).findCardInZone("arms", craterFist);
    expect(temper.objectState(armsId).defenseCounterTotal).toBe(-1);
    expect(temper.as(bravo).life()).toBe(20 - (SNATCH - ARMS_D));

    const a1 = craterFist.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind === "activated") {
      expect(a1.abilityType).toBe("action");
      expect(a1.cost).toMatchObject({
        class: "mixed",
        type: "all",
        costs: [
          { class: "asset", type: "resources", amount: 3 },
          { class: "effect", type: "destroy-self" },
        ],
      });
      expect(
        a1.layerKeywords?.some(
          (k) =>
            ("ref" in k && k.ref === "goAgain") || (k as { name?: string }).name === "go-again",
        ),
      ).toBe(true);
      expect(a1.effect).toMatchObject({
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              types: ["Action"],
              subtypes: ["Attack"],
            },
            hasKeyword: "crush",
          },
          count: { type: "all" },
        },
      });
    }
    expect(craterFist.base.keywords?.some((k) => k.name === "temper")).toBe(true);
  });
});
