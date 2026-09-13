/**
 * BOL007 Gallantry Gold — Warrior Arms d1 Battleworn.
 *
 * Printed:
 *   Action - {r}, destroy Gallantry Gold: Your weapon attacks gain +1{p}
 *   this turn. Go again
 *   Battleworn
 *
 * Reasoning (hand-authored; case-by-case — stubby-hammerers / evo-engine-room):
 * 1. Action mixed cost {r}+destroy-self; go again refunds Action AP.
 * 2. Prior model: combat-chain + subtypes:["Weapon"] + count:star at resolution.
 *    Dead: Weapon is FAB_TYPES not a subtype; does not float to later attacks.
 * 3. Remodel appliesTo.next types:["Weapon"] count:star (floating aura this turn).
 * 4. Happy: activate → Dawnblade attack (base 3) deals 4; arms GY; AP refunded.
 * 5. Boundary: AAC Snatch after activate is not a weapon attack → still 4.
 * 6. Battleworn d1: defend keeps arms, −1 defense counter.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, dawnblade, snatchRed } from "../../../fixtures.ts";
import { gallantryGold } from "../../../../../../cards/src/cards/equipment/gallantry-gold.ts";

const LIFE = 40;
const DAWNBLADE = 3;
const SNATCH = 4;
const ARMS_D = 1;

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

describe("gallantry-gold (BOL007)", () => {
  it("core mechanic: {r}+destroy → weapon attacks +1{p} this turn; go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [gallantryGold],
        weapon1: [dawnblade],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);
    const apBefore = Bravo.actionPoints();

    Bravo.activate(gallantryGold);
    game.passBoth();

    // Destroy-self + 1{r}; go again refunds Action AP.
    expect(Bravo.zone("arms")).not.toContain(gallantryGold.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(gallantryGold.canonicalId);
    expect(Bravo.resourcePoints()).toBe(1);
    expect(Bravo.actionPoints()).toBe(apBefore);

    // Dawnblade base 3 + aura 1 = 4; weapon attack costs remaining 1{r}.
    Bravo.activate(dawnblade);
    game.helpers.resolveRestOfCombat();

    expect(Opponent.life()).toBe(LIFE - (DAWNBLADE + 1));
    expect(Bravo.resourcePoints()).toBe(0);
  });

  it("boundaries: AAC not buffed; BW d1; model appliesTo Weapon types", () => {
    // Snatch (Action Attack) is not a weapon attack — no +1{p}.
    const aac = FabTestEngine.start(
      {
        hero: bravo,
        arms: [gallantryGold],
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    aac.as(bravo).activate(gallantryGold);
    aac.passBoth();
    aac.as(bravo).attackWith(snatchRed);
    aac.as(dash).defendWith([]);
    aac.as(bravo).pass();
    aac.as(dash).pass();
    aac.helpers.resolveRestOfCombat();
    expect(aac.as(dash).life()).toBe(LIFE - SNATCH);

    // Battleworn d1.
    const bw = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        arms: [gallantryGold],
        life: 20,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    bw.as(dash).attackWith(snatchRed);
    bw.as(bravo).defendWith(gallantryGold);
    drain(bw);
    expect(bw.as(bravo).zone("arms")).toContain(gallantryGold.canonicalId);
    const armsId = bw.as(bravo).findCardInZone("arms", gallantryGold);
    expect(bw.objectState(armsId).defenseCounterTotal).toBe(-1);
    expect(bw.as(bravo).life()).toBe(20 - (SNATCH - ARMS_D));

    const a1 = gallantryGold.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind === "activated") {
      expect(a1.abilityType).toBe("action");
      expect(a1.cost).toMatchObject({
        class: "mixed",
        type: "all",
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
        amount: 1,
        duration: "this-turn",
        appliesTo: {
          next: { typeBox: { types: ["Weapon"] } },
          count: { type: "all" },
        },
      });
    }
    expect(gallantryGold.base.keywords?.some((k) => k.name === "battleworn")).toBe(true);
  });
});
