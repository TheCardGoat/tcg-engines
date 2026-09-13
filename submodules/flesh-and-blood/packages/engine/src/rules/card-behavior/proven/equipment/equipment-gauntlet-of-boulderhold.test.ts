/**
 * MPG007 Gauntlet of Boulderhold — Guardian Arms d1 Battleworn.
 *
 * Printed:
 *   Action - {r}{r}{r}, destroy this: The next Guardian attack action card you
 *   play from arsenal this turn gets +2{p}. Go again
 *   Battleworn
 *
 * Reasoning (hand-authored; case-by-case):
 * 1. Action 3{r}+destroy-self arms floating +2{p} for next Guardian AAC
 *    played from arsenal (playedFromZones arsenal gate).
 * 2. Happy: activate → play Crush the Weak (blue) from arsenal → p5+2=7.
 * 3. Boundary: same AAC from hand after activate → base p5 (no arsenal gate).
 * 4. Boundary: 2{r} illegal; go again refunds AP; battleworn d1.
 *
 * Status: ✅ arsenal Guardian +2; hand unbuffed; GA; BW d1; model.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { gauntletOfBoulderhold } from "../../../../../../cards/src/cards/equipment/gauntlet-of-boulderhold.ts";
import { crushTheWeakBlue } from "../../../../../../cards/src/cards/actions/crush-the-weak.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";

const LIFE = 40;
const CRUSH = 5;
const SNATCH = 4;

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

function armsDefense(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
): number | undefined {
  const state = game.getState();
  const instanceId = state.containers.zonesByPlayerId[playerId]?.arms.find(
    (id) => state.objects[id]?.canonicalId === gauntletOfBoulderhold.canonicalId,
  );
  if (!instanceId) return undefined;
  const view = buildFabRulesView(state);
  return view.object({
    instanceId,
    incarnation: state.objects[instanceId]!.incarnation,
  })?.current.numeric.defense;
}

describe("gauntlet-of-boulderhold (MPG007)", () => {
  it("core mechanic: activate → play Guardian AAC from arsenal → +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [gauntletOfBoulderhold],
        arsenal: [crushTheWeakBlue],
        hand: [],
        // 3 for activate + 3 for Crush.
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);
    const apBefore = game.getState().players[Bravo.id]!.actionPoints;

    Bravo.activate(gauntletOfBoulderhold);
    drain(game);

    expect(Bravo.zone("arms")).not.toContain(gauntletOfBoulderhold.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(gauntletOfBoulderhold.canonicalId);
    expect(Bravo.resourcePoints()).toBe(3);
    // Go again refunds Action AP.
    expect(game.getState().players[Bravo.id]!.actionPoints).toBe(apBefore);

    Bravo.playFromArsenal(crushTheWeakBlue, { target: Opponent.id });
    game.helpers.resolveRestOfCombat();

    // Crush base 5 +2 arsenal buff = 7 unblocked.
    expect(Opponent.life()).toBe(LIFE - (CRUSH + 2));
  });

  it("boundaries: from hand unbuffed; 2{r} illegal; BW d1; model", () => {
    // After activate, Guardian AAC from hand does not get +2.
    const fromHand = FabTestEngine.start(
      {
        hero: bravo,
        arms: [gauntletOfBoulderhold],
        hand: [crushTheWeakBlue],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const A = fromHand.as(bravo);
    const B = fromHand.as(dash);
    A.activate(gauntletOfBoulderhold);
    drain(fromHand);
    A.attackWith(crushTheWeakBlue);
    fromHand.helpers.resolveRestOfCombat();
    expect(B.life()).toBe(LIFE - CRUSH);

    // Insufficient resources.
    const poor = FabTestEngine.start(
      {
        hero: bravo,
        arms: [gauntletOfBoulderhold],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => poor.as(bravo).activate(gauntletOfBoulderhold)).toThrow();

    // Battleworn d1.
    const bw = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: LIFE,
        arms: [gauntletOfBoulderhold],
        hand: [],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Def = bw.as(bravo);
    expect(armsDefense(bw, Def.id)).toBe(1);
    bw.as(dash).attackWith(snatchRed);
    Def.defendWith(gauntletOfBoulderhold);
    bw.helpers.resolveRestOfCombat();
    expect(Def.life()).toBe(LIFE - (SNATCH - 1));
    expect(Def.zone("arms")).toContain(gauntletOfBoulderhold.canonicalId);
    expect(armsDefense(bw, Def.id)).toBe(0);

    const a1 = gauntletOfBoulderhold.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("action");
    expect(a1.cost).toMatchObject({
      class: "mixed",
      type: "all",
      costs: [
        { class: "asset", type: "resources", amount: 3 },
        { class: "effect", type: "destroy-self" },
      ],
    });
    expect(a1.layerKeywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "go-again" })]),
    );
    expect(a1.effect).toMatchObject({
      type: "modify-numeric",
      property: "power",
      amount: 2,
      appliesTo: {
        next: {
          typeBox: {
            supertypes: ["Guardian"],
            types: ["Action"],
            subtypes: ["Attack"],
          },
          playedFromZones: ["arsenal"],
        },
      },
    });
    expect(gauntletOfBoulderhold.base.keywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "battleworn" })]),
    );
  });
});
