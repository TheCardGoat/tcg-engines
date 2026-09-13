/**
 * ROS249 Calming Cloak — Illusionist Chest Arcane Barrier 1.
 *
 * Printed:
 *   Instant - {r}, destroy this: The next aura you play this turn costs
 *   {r}{r} less to play.
 *   Arcane Barrier 1
 *
 * Reasoning (case-by-case):
 * 1. Instant mixed cost 1{r} + destroy-self.
 * 2. Cost −2 this-turn appliesTo.next Aura (multi-fire future play).
 * 3. MODEL: subtypes:["Aura"] never matches — remodel types:["Aura"].
 * 4. Embolden Yellow cost 4 → plays for 2 after cloak; without cloak 2{r}
 *    illegal; second aura after first is full cost (next only).
 * 5. Arcane Barrier 1 keyword.
 *
 * Status: ✅ next aura −2{r}; Instant destroy; AB1 model.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { calmingCloak } from "../../../../../../cards/src/cards/equipment/calming-cloak.ts";
import { emboldenYellow } from "../../../../../../cards/src/cards/actions/embolden.ts";
import { emboldenBlue } from "../../../../../../cards/src/cards/actions/embolden.ts";

const LIFE = 20;
const EMBOLDEN_COST = 4;
const DISCOUNT = 2;

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

describe("calming-cloak (ROS249)", () => {
  it("core mechanic: Instant {r}+destroy → next Aura costs {r}{r} less", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [calmingCloak],
        hand: [emboldenYellow],
        actionPoints: 1,
        resourcePoints: 1 + (EMBOLDEN_COST - DISCOUNT),
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.resourcePoints()).toBe(1 + 2);

    // Pay 1{r}, destroy cloak.
    Bravo.activate(calmingCloak);
    drain(game);
    expect(Bravo.zone("chest")).not.toContain(calmingCloak.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(calmingCloak.canonicalId);
    expect(Bravo.resourcePoints()).toBe(EMBOLDEN_COST - DISCOUNT);

    // Embolden Yellow cost 4 − 2 = 2.
    const rpBefore = Bravo.resourcePoints();
    Bravo.play(emboldenYellow);
    drain(game);
    expect(Bravo.resourcePoints()).toBe(rpBefore - (EMBOLDEN_COST - DISCOUNT));
    expect(Bravo.zone("arena")).toContain(emboldenYellow.canonicalId);
  });

  it("boundaries: without discount cost-2 illegal for cost-4 aura; model types Aura; AB1", () => {
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        hand: [emboldenYellow],
        actionPoints: 1,
        resourcePoints: EMBOLDEN_COST - DISCOUNT,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const fail = bare.as(bravo).expectFailure({
      move: "begin-play",
      payload: { instanceId: bare.as(bravo).card(emboldenYellow) },
    });
    expect(fail.accepted).toBe(false);

    // Only next: second aura after first discounted play pays full.
    const two = FabTestEngine.start(
      {
        hero: bravo,
        chest: [calmingCloak],
        hand: [emboldenYellow, emboldenBlue],
        actionPoints: 2,
        resourcePoints: 1 + (EMBOLDEN_COST - DISCOUNT) + EMBOLDEN_COST,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const B = two.as(bravo);
    B.activate(calmingCloak);
    drain(two);
    B.play(emboldenYellow);
    drain(two);
    const rpMid = B.resourcePoints();
    // Second embolden still cost 4.
    B.play(emboldenBlue);
    drain(two);
    expect(B.resourcePoints()).toBe(rpMid - EMBOLDEN_COST);

    const a1 = calmingCloak.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated" || !a1.effect) return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({
      class: "mixed",
      type: "all",
      costs: [
        { class: "asset", type: "resources", amount: 1 },
        { class: "effect", type: "destroy-self" },
      ],
    });
    expect(a1.effect).toMatchObject({
      type: "modify-numeric",
      property: "cost",
      op: "subtract",
      amount: 2,
      duration: "this-turn",
      appliesTo: { next: { typeBox: { subtypes: ["Aura"] } } },
    });
    expect(
      calmingCloak.base.keywords?.some(
        (k) => typeof k !== "string" && k.name === "arcane-barrier" && k.value === 1,
      ),
    ).toBe(true);
  });
});
